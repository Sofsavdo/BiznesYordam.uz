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
    const partner = await storage.getPartnerByUserId(req.session!.user!.id);
    if (!partner) {
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

  // Chat routes
  app.get("/api/admin/chat-partners", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const partners = await storage.getAllPartners();
    
    // Get WebSocket manager from global scope
    const wsManager = (global as any).wsManager;
    
    // Get user data for each partner
    const partnersWithUsers = await Promise.all(
      partners.map(async (partner) => {
        const user = await storage.getUserById(partner.userId);
        const isOnline = wsManager ? wsManager.isUserOnline(partner.userId) : false;
        return {
          ...partner,
          userData: user,
          isOnline
        };
      })
    );
    
    res.json(partnersWithUsers);
  }));

  app.get("/api/admin/chats/:partnerUserId/messages", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
    const { partnerUserId } = req.params;
    const adminUserId = req.session!.user!.id;
    
    const messages = await storage.getMessagesBetweenUsers(adminUserId, partnerUserId);
    res.json(messages);
  }));

  app.post("/api/chat/partners/:partnerId/message", requireAuth, asyncHandler(async (req: Request, res: Response) => {
    const { partnerId } = req.params;
    const { message, messageType = 'text', fileUrl, fileName, fileSize } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Xabar matni bo'sh bo'lishi mumkin emas",
        code: "EMPTY_MESSAGE"
      });
    }

    // Get partner user ID
    const partner = await storage.getPartnerById(partnerId);
    if (!partner) {
      return res.status(404).json({ 
        message: "Hamkor topilmadi",
        code: "PARTNER_NOT_FOUND"
      });
    }

    const newMessage = await storage.createMessage({
      fromUserId: req.session!.user!.id,
      toUserId: partner.userId,
      content: message.trim(),
      isRead: false
    });

    // Send real-time notification via WebSocket
    const wsManager = (global as any).wsManager;
    if (wsManager) {
      wsManager.sendToUser(partner.userId, {
        type: 'message',
        data: {
          ...newMessage,
          timestamp: Date.now()
        }
      });
    }

    res.json({ 
      success: true, 
      newMessage,
      message: "Xabar yuborildi"
    });
  }));

  // Error handling middleware
  app.use(handleValidationError);

  return server;
}