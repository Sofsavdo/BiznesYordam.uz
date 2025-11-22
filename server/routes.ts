import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { Server } from "http";
import { storage } from "./storage";
import { healthCheck } from "./health";
import { getSessionConfig } from "./session";
import { asyncHandler } from "./errorHandler";
import { 
  loginSchema, 
  partnerRegistrationSchema,
  insertProductSchema,
  insertFulfillmentRequestSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import debugRoutes from "./debugRoutes";

// Enhanced authentication middleware with better error handling
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ 
      message: "Avtorizatsiya yo'q",
      code: "UNAUTHORIZED",
      timestamp: new Date().toISOString()
    });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ 
      message: "Avtorizatsiya yo'q",
      code: "UNAUTHORIZED"
    });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ 
      message: "Admin huquqi talab qilinadi",
      code: "FORBIDDEN"
    });
  }
  
  next();
}

function requirePartner(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ 
      message: "Avtorizatsiya yo'q",
      code: "UNAUTHORIZED"
    });
  }
  
  if (req.session.user.role !== 'partner' && req.session.user.role !== 'admin') {
    return res.status(403).json({ 
      message: "Hamkor huquqi talab qilinadi",
      code: "FORBIDDEN"
    });
  }
  
  next();
}

// Enhanced error handling middleware
function handleValidationError(error: any, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Ma'lumotlar noto'g'ri",
      code: "VALIDATION_ERROR",
      errors: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
  next(error);
}

export function registerRoutes(app: express.Application): Server {
  const server = new Server(app);

  // Session configuration
  app.use(session(getSessionConfig()));

  // Health check endpoint
  app.get("/api/health", healthCheck);

  // Debug endpoints (remove after fixing)
  app.use("/api", debugRoutes);

  // Swagger setup
  const swaggerSpec = swaggerJSDoc({
    definition: {
      openapi: '3.0.0',
      info: { title: 'BiznesYordam API', version: '2.0.1' },
      servers: [{ url: '/' }]
    },
    apis: []
  });
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

  // Authentication routes
  app.post("/api/auth/login", asyncHandler(async (req: Request, res: Response) => {
    try {
      console.log('🔐 Login attempt:', { username: req.body.username, hasSession: !!req.session });
      
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.validateUserPassword(username, password);
      if (!user) {
        await storage.createAuditLog({
          userId: 'anonymous',
          action: 'LOGIN_FAILED',
          entityType: 'user',
          payload: { username, reason: 'invalid_credentials' }
        });
        
        return res.status(401).json({ 
          message: "Username yoki parol noto'g'ri",
          code: "INVALID_CREDENTIALS"
        });
      }

      if (!user.isActive) {
        return res.status(401).json({ 
          message: "Hisob faol emas",
          code: "ACCOUNT_INACTIVE"
        });
      }

      // Set session
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email || undefined,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        role: user.role
      };

      // Get partner info if user is a partner
      let partner = null;
      let permissions = null;
      
      if (user.role === 'partner') {
        partner = await storage.getPartnerByUserId(user.id);
      } else if (user.role === 'admin') {
        permissions = await storage.getAdminPermissions(user.id);
      }

      await storage.createAuditLog({
        userId: user.id,
        action: 'LOGIN_SUCCESS',
        entityType: 'user',
        payload: { username, role: user.role }
      });

      // Save session before sending response
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('❌ Session save error:', err);
            reject(err);
          } else {
            console.log('✅ Session saved successfully for user:', user.id);
            console.log('📝 Session ID:', req.sessionID);
            console.log('🍪 Session cookie will be set');
            resolve();
          }
        });
      });

      // Explicitly set cookie header for debugging
      const cookieValue = `connect.sid=${req.sessionID}; Path=/; HttpOnly; SameSite=Lax`;
      console.log('🍪 Setting cookie:', cookieValue);

      res.json({ 
        user: req.session.user, 
        partner,
        permissions,
        message: "Muvaffaqiyatli kirildi"
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Ma'lumotlar noto'g'ri",
          code: "VALIDATION_ERROR",
          errors: error.errors
        });
      }
      throw error;
    }
  }));

  app.post("/api/auth/logout", asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session?.user?.id;
    
    if (userId) {
      await storage.createAuditLog({
        userId,
        action: 'LOGOUT',
        entityType: 'user'
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ 
          message: "Chiqishda xatolik",
          code: "LOGOUT_ERROR"
        });
      }
      
      res.clearCookie('connect.sid');
      res.json({ message: "Muvaffaqiyatli chiqildi" });
    });
  }));

  app.get("/api/auth/me", asyncHandler(async (req: Request, res: Response) => {
    console.log('🔍 Auth check:', { 
      hasSession: !!req.session, 
      hasUser: !!req.session?.user,
      sessionID: req.sessionID,
      cookies: req.headers.cookie 
    });
    
    if (!req.session?.user) {
      return res.status(401).json({ 
        message: "Avtorizatsiya yo'q",
        code: "UNAUTHORIZED"
      });
    }

    let partner = null;
    let permissions = null;
    
    if (req.session.user.role === 'partner') {
      partner = await storage.getPartnerByUserId(req.session.user.id);
    } else if (req.session.user.role === 'admin') {
      permissions = await storage.getAdminPermissions(req.session.user.id);
    }

    res.json({ 
      user: req.session.user, 
      partner,
      permissions
    });
  }));

  // Partner registration
  app.post("/api/partners/register", asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = partnerRegistrationSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({
          message: "Bu username allaqachon mavjud",
          code: "USERNAME_EXISTS"
        });
      }

      // Create user
      const user = await storage.createUser({
        username: validatedData.username,
        email: validatedData.email,
        password: validatedData.password,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        role: 'partner'
      });

      // Create partner profile
      const partner = await storage.createPartner({
        userId: user.id,
        businessName: validatedData.businessName,
        businessCategory: validatedData.businessCategory,
        monthlyRevenue: validatedData.monthlyRevenue,
        notes: validatedData.notes || undefined
      });

      await storage.createAuditLog({
        userId: user.id,
        action: 'PARTNER_REGISTERED',
        entityType: 'partner',
        entityId: partner.id,
        payload: { businessName: validatedData.businessName }
      });

      res.status(201).json({
        message: "Hamkor muvaffaqiyatli ro'yxatdan o'tdi",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        partner
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Ma'lumotlar noto'g'ri",
          code: "VALIDATION_ERROR",
          errors: error.errors
        });
      }
      throw error;
    }
  }));

  // Partner routes
  app.get("/api/partners/me", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    console.log('🔍 GET /api/partners/me - User ID:', req.session?.user?.id);
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    console.log('📦 Partner found:', partner ? 'Yes' : 'No');
    if (!partner) {
      console.log('❌ Partner not found for user:', req.session!.user!.id);
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }
    res.json(partner);
  }));

  app.put("/api/partners/me", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    const updatedPartner = await storage.updatePartner(partner.id, req.body);
    
    await storage.createAuditLog({
      userId: req.session!.user!.id,
      action: 'PARTNER_UPDATED',
      entityType: 'partner',
      entityId: partner.id,
      payload: req.body
    });

    res.json(updatedPartner);
  }));

  // Product routes
  app.get("/api/products", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    const products = await storage.getProductsByPartnerId(partner.id);
    res.json(products);
  }));

  app.post("/api/products", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      const partner = await storage.getPartnerByUserId(req.session!.user!.id);
      if (!partner) {
        return res.status(404).json({ 
          message: "Hamkor ma'lumotlari topilmadi",
          code: "PARTNER_NOT_FOUND"
        });
      }

      const product = await storage.createProduct({
        partnerId: partner.id,
        name: validatedData.name,
        category: validatedData.category,
        price: validatedData.price,
        description: validatedData.description || undefined,
        costPrice: validatedData.costPrice || undefined,
        sku: validatedData.sku || undefined,
        barcode: validatedData.barcode || undefined,
        weight: validatedData.weight || undefined
      });

      await storage.createAuditLog({
        userId: req.session!.user!.id,
        action: 'PRODUCT_CREATED',
        entityType: 'product',
        entityId: product.id,
        payload: { name: product.name }
      });

      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Mahsulot ma'lumotlari noto'g'ri",
          code: "VALIDATION_ERROR",
          errors: error.errors
        });
      }
      throw error;
    }
  }));

  // Fulfillment request routes
  app.get("/api/fulfillment-requests", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    if (req.session!.user!.role === 'admin') {
      const requests = await storage.getAllFulfillmentRequests();
      res.json(requests);
    } else {
      const partner = await storage.getPartnerByUserId(req.session!.user!.id);
      if (!partner) {
        return res.status(404).json({ 
          message: "Hamkor ma'lumotlari topilmadi",
          code: "PARTNER_NOT_FOUND"
        });
      }

      const requests = await storage.getFulfillmentRequestsByPartnerId(partner.id);
      res.json(requests);
    }
  }));

  app.post("/api/fulfillment-requests", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = insertFulfillmentRequestSchema.parse(req.body);
      
      const partner = await storage.getPartnerByUserId(req.session!.user!.id);
      if (!partner) {
        return res.status(404).json({ 
          message: "Hamkor ma'lumotlari topilmadi",
          code: "PARTNER_NOT_FOUND"
        });
      }

      const request = await storage.createFulfillmentRequest({
        partnerId: partner.id,
        requestType: validatedData.requestType,
        title: validatedData.title,
        description: validatedData.description,
        productId: validatedData.productId ?? undefined,
        priority: validatedData.priority || undefined,
        estimatedCost: validatedData.estimatedCost || undefined,
        metadata: validatedData.metadata || undefined
      });

      await storage.createAuditLog({
        userId: req.session!.user!.id,
        action: 'FULFILLMENT_REQUEST_CREATED',
        entityType: 'fulfillment_request',
        entityId: request.id,
        payload: { title: request.title }
      });

      res.status(201).json(request);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "So'rov ma'lumotlari noto'g'ri",
          code: "VALIDATION_ERROR",
          errors: error.errors
        });
      }
      throw error;
    }
  }));

  app.put("/api/fulfillment-requests/:id", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const request = await storage.updateFulfillmentRequest(id, updates);
    if (!request) {
      return res.status(404).json({ 
        message: "So'rov topilmadi",
        code: "REQUEST_NOT_FOUND"
      });
    }

    await storage.createAuditLog({
      userId: req.session!.user!.id,
      action: 'FULFILLMENT_REQUEST_UPDATED',
      entityType: 'fulfillment_request',
      entityId: id,
      payload: updates
    });

    res.json(request);
  }));

  // Analytics routes
  app.get("/api/analytics", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    const analytics = await storage.getAnalyticsByPartnerId(partner.id);
    res.json(analytics);
  }));

  // Profit breakdown routes
  app.get("/api/profit-breakdown", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    const { period, marketplace } = req.query;
    const profitData = await storage.getProfitBreakdown(partner.id, {
      period: period as string,
      marketplace: marketplace as string
    });
    
    res.json(profitData);
  }));

  // Trending products routes
  app.get("/api/trending-products/:category/:market/:minScore", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    const { category, market, minScore } = req.params;
    
    // Check tier access for trending products
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    // Only Professional Plus and Enterprise Elite can access trending products
    if (!['professional_plus', 'enterprise_elite'].includes(partner.pricingTier)) {
      return res.status(403).json({
        message: "Bu funksiya uchun Professional Plus yoki Enterprise Elite tarifi kerak",
        code: "TIER_ACCESS_REQUIRED",
        requiredTier: "professional_plus"
      });
    }

    const products = await storage.getTrendingProducts({
      category: category !== 'all' ? category : undefined,
      sourceMarket: market !== 'all' ? market : undefined,
      minTrendScore: parseInt(minScore) || 70
    });
    
    res.json(products);
  }));

  // Admin routes
  app.get("/api/admin/trending-products", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const products = await storage.getTrendingProducts();
    res.json(products);
  }));

  app.get("/api/admin/partners", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const partners = await storage.getAllPartners();
    res.json(partners);
  }));

  app.put("/api/admin/partners/:id/approve", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const partner = await storage.approvePartner(id, req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    await storage.createAuditLog({
      userId: req.session!.user!.id,
      action: 'PARTNER_APPROVED',
      entityType: 'partner',
      entityId: id
    });

    res.json(partner);
  }));

  // Pricing tiers
  app.get("/api/pricing-tiers", asyncHandler(async (req: Request, res: Response) => {
    const tiers = await storage.getAllPricingTiers();
    res.json(tiers);
  }));

  // Tier upgrade requests
  app.post("/api/tier-upgrade-requests", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    const { requestedTier, reason } = req.body;
    
    if (!requestedTier || !reason) {
      return res.status(400).json({
        message: "Talab qilingan tarif va sabab kiritilishi shart",
        code: "MISSING_REQUIRED_FIELDS"
      });
    }

    const request = await storage.createTierUpgradeRequest({
      partnerId: partner.id,
      requestedTier,
      reason
    });

    await storage.createAuditLog({
      userId: req.session!.user!.id,
      action: 'TIER_UPGRADE_REQUESTED',
      entityType: 'tier_upgrade_request',
      entityId: request.id,
      payload: { requestedTier, currentTier: partner.pricingTier }
    });

    res.status(201).json(request);
  }));

  app.get("/api/admin/tier-upgrade-requests", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const requests = await storage.getTierUpgradeRequests();
    res.json(requests);
  }));

  app.put("/api/admin/tier-upgrade-requests/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const request = await storage.updateTierUpgradeRequest(id, {
      status,
      adminNotes,
      reviewedBy: req.session!.user!.id,
      reviewedAt: new Date()
    });

    if (!request) {
      return res.status(404).json({ 
        message: "So'rov topilmadi",
        code: "REQUEST_NOT_FOUND"
      });
    }

    await storage.createAuditLog({
      userId: req.session!.user!.id,
      action: 'TIER_UPGRADE_REVIEWED',
      entityType: 'tier_upgrade_request',
      entityId: id,
      payload: { status, adminNotes }
    });

    res.json(request);
  }));

  // Email notification routes
  app.post("/api/notifications/send", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const { to, template, data } = req.body;
    
    if (!to || !template || !data) {
      return res.status(400).json({
        message: "Email, template va data talab qilinadi",
        code: "MISSING_FIELDS"
      });
    }

    // Import email service dynamically
    const { sendEmail } = await import('./email');
    const result = await sendEmail(to, template, data);

    if (result.success) {
      res.json({ 
        success: true, 
        message: "Email yuborildi",
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Email yuborishda xatolik",
        error: result.error
      });
    }
  }));

  // ==================== INVENTORY MANAGEMENT ROUTES ====================

  // Warehouse routes
  app.get("/api/warehouses", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const warehouses = await storage.getAllWarehouses();
    res.json(warehouses);
  }));

  app.post("/api/warehouses", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const warehouse = await storage.createWarehouse(req.body);
    
    await storage.createAuditLog({
      userId: req.session!.user!.id,
      action: 'WAREHOUSE_CREATED',
      entityType: 'warehouse',
      entityId: warehouse.id,
      payload: { name: warehouse.name, code: warehouse.code }
    });

    res.status(201).json(warehouse);
  }));

  app.get("/api/warehouses/:id/stock", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const stock = await storage.getWarehouseStock(id);
    res.json(stock);
  }));

  // Stock management routes
  app.post("/api/stock/update", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const { 
      productId, 
      warehouseId, 
      quantity, 
      movementType, 
      reason, 
      referenceType, 
      referenceId, 
      notes 
    } = req.body;

    if (!productId || !warehouseId || quantity === undefined || !movementType || !reason) {
      return res.status(400).json({
        message: "Barcha majburiy maydonlar to'ldirilishi kerak",
        code: "MISSING_FIELDS"
      });
    }

    const result = await storage.updateProductStock(
      productId,
      warehouseId,
      quantity,
      movementType,
      reason,
      req.session!.user!.id,
      referenceType,
      referenceId,
      notes
    );

    await storage.createAuditLog({
      userId: req.session!.user!.id,
      action: 'STOCK_UPDATED',
      entityType: 'product',
      entityId: productId,
      payload: { 
        movementType, 
        quantity, 
        previousStock: result.movement.previousStock,
        newStock: result.movement.newStock
      }
    });

    res.json({
      success: true,
      product: result.product,
      movement: result.movement,
      message: "Stock muvaffaqiyatli yangilandi"
    });
  }));

  app.get("/api/stock/movements", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const { productId, warehouseId, movementType, startDate, endDate } = req.query;

    const movements = await storage.getStockMovements({
      productId: productId as string,
      warehouseId: warehouseId as string,
      movementType: movementType as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined
    });

    res.json(movements);
  }));

  // Order management routes
  app.get("/api/orders", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    if (req.session!.user!.role === 'admin') {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } else {
      const partner = await storage.getPartnerByUserId(req.session!.user!.id);
      if (!partner) {
        return res.status(404).json({ 
          message: "Hamkor ma'lumotlari topilmadi",
          code: "PARTNER_NOT_FOUND"
        });
      }

      const orders = await storage.getOrdersByPartnerId(partner.id);
      res.json(orders);
    }
  }));

  app.post("/api/orders", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    const orderData = {
      ...req.body,
      partnerId: partner.id
    };

    const order = await storage.createOrder(orderData);

    await storage.createAuditLog({
      userId: req.session!.user!.id,
      action: 'ORDER_CREATED',
      entityType: 'order',
      entityId: order.id,
      payload: { orderNumber: order.orderNumber, totalAmount: order.totalAmount }
    });

    res.status(201).json(order);
  }));

  app.get("/api/orders/:id", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await storage.getOrderById(id);

    if (!order) {
      return res.status(404).json({ 
        message: "Buyurtma topilmadi",
        code: "ORDER_NOT_FOUND"
      });
    }

    // Check authorization
    if (req.session!.user!.role !== 'admin') {
      const partner = await storage.getPartnerByUserId(req.session!.user!.id);
      if (!partner || order.partnerId !== partner.id) {
        return res.status(403).json({ 
          message: "Ruxsat yo'q",
          code: "FORBIDDEN"
        });
      }
    }

    const items = await storage.getOrderItems(id);
    res.json({ ...order, items });
  }));

  app.put("/api/orders/:id/status", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, fulfillmentStatus, paymentStatus } = req.body;

    const order = await storage.updateOrderStatus(
      id,
      status,
      fulfillmentStatus,
      paymentStatus,
      req.session!.user!.id
    );

    if (!order) {
      return res.status(404).json({ 
        message: "Buyurtma topilmadi",
        code: "ORDER_NOT_FOUND"
      });
    }

    await storage.createAuditLog({
      userId: req.session!.user!.id,
      action: 'ORDER_STATUS_UPDATED',
      entityType: 'order',
      entityId: id,
      payload: { status, fulfillmentStatus, paymentStatus }
    });

    // Send notification via WebSocket
    const wsManager = (global as any).wsManager;
    if (wsManager) {
      const partner = await storage.getPartnerById(order.partnerId);
      if (partner) {
        wsManager.sendToUser(partner.userId, {
          type: 'notification',
          data: {
            type: 'order_update',
            title: 'Buyurtma holati yangilandi',
            message: `Buyurtma #${order.orderNumber} holati: ${status}`,
            orderId: order.id,
            timestamp: Date.now()
          }
        });
      }
    }

    res.json(order);
  }));

  // Stock alerts routes
  app.get("/api/stock-alerts", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    const includeResolved = req.query.includeResolved === 'true';
    const alerts = await storage.getStockAlertsByPartnerId(partner.id, includeResolved);
    res.json(alerts);
  }));

  app.put("/api/stock-alerts/:id/resolve", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const alert = await storage.resolveStockAlert(id, req.session!.user!.id);

    if (!alert) {
      return res.status(404).json({ 
        message: "Ogohlantirish topilmadi",
        code: "ALERT_NOT_FOUND"
      });
    }

    res.json(alert);
  }));

  // Inventory statistics
  app.get("/api/inventory/stats", requirePartner, asyncHandler(async (req: Request, res: Response) => {
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor ma'lumotlari topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    const stats = await storage.getInventoryStats(partner.id);
    res.json(stats);
  }));

  // Admin inventory overview
  app.get("/api/admin/inventory/overview", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const partners = await storage.getAllPartners();
    const overview = await Promise.all(
      partners.map(async (partner) => {
        const stats = await storage.getInventoryStats(partner.id);
        return {
          partnerId: partner.id,
          businessName: partner.businessName,
          ...stats
        };
      })
    );

    res.json(overview);
  }));

  // Error handling middleware
  app.use(handleValidationError);

  return server;
}