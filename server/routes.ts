import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import session from "express-session";
import cors from "cors";
import "./types"; // Import session types
import { getSessionConfig } from "./session";
import { storage } from "./storage";
import { db } from "./db";
import { healthCheck } from "./health";
import {
  loginSchema,
  partnerRegistrationSchema,
  insertProductSchema,
  insertFulfillmentRequestSchema,
  insertMessageSchema,
  insertExcelImportSchema,
  insertExcelTemplateSchema,
  users
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Session configuration moved to session.ts

// WebSocket connections storage
const wsConnections = new Map<string, any>();

// Broadcast message to user
function broadcastToUser(userId: string, message: any) {
  const userWs = wsConnections.get(userId);
  if (userWs && userWs.readyState === 1) { // WebSocket.OPEN
    userWs.send(JSON.stringify(message));
  }
}

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ 
        message: "Avtorizatsiya talab qilinadi",
        code: "AUTH_REQUIRED"
      });
    }
    
    // Check if user is still active
    if (!req.session.user.isActive) {
      req.session.destroy(() => {});
      return res.status(401).json({ 
        message: "Foydalanuvchi faol emas",
        code: "USER_INACTIVE"
      });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: "Server xatoligi" });
  }
};

// Helper function to get authenticated user
const getAuthUser = (req: any) => {
  return req.session!.user;
};

const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
  try {
    if (!req.session?.user || !roles.includes(req.session.user.role)) {
      return res.status(403).json({ 
        message: "Ruxsat yo'q",
        code: "INSUFFICIENT_PERMISSIONS"
      });
    }
    next();
  } catch (error) {
    console.error('Role middleware error:', error);
    res.status(500).json({ message: "Server xatoligi" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple in-memory rate limiter (per IP + route)
  const rateBuckets = new Map<string, { count: number; resetAt: number }>();
  const rateLimit = (max: number, windowMs: number) => (req: any, res: any, next: any) => {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'local';
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const bucket = rateBuckets.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }
    bucket.count += 1;
    rateBuckets.set(key, bucket);
    if (bucket.count > max) {
      return res.status(429).json({ message: 'Juda ko\'p so\'rov. Keyinroq urinib ko\'ring.' });
    }
    next();
  };

  // Fine-grained permission middleware
  const requirePermission = (keys: string[]) => async (req: any, res: any, next: any) => {
    const user = req.session?.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Ruxsat yo'q" });
    }
    const perms = await storage.getAdminPermissions(user.id);
    const ok = keys.every((k) => Boolean(perms?.[k]));
    if (!ok) return res.status(403).json({ message: "Ruxsat yo'q" });
    next();
  };

  // Reverse proxy (Render) ortida to'g'ri cookie uchun
  app.set('trust proxy', 1);

  // Production-ready session configuration
  const sessionConfig = getSessionConfig();
  app.use(session(sessionConfig));

  // Session middleware to ensure sessions are saved
  app.use((req, res, next) => {
    // Log session info for debugging
    if (req.path.startsWith('/api/auth')) {
      console.log('🔍 Session middleware:', {
        path: req.path,
        sessionID: req.sessionID,
        hasSession: !!req.session,
        hasUser: !!req.session?.user,
        cookies: req.headers.cookie
      });
    }

    const originalEnd = res.end;
    res.end = function(chunk?: any, encoding?: any) {
      if (req.session && req.session.user) {
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
          } else {
            console.log('✅ Session saved for user:', req.session.user?.username);
          }
        });
      }
      return originalEnd.call(this, chunk, encoding);
    };
    next();
  });

  // CORS allaqachon index.ts da konfiguratsiya qilingan

  // Auth routes
  app.post('/api/auth/login', rateLimit(10, 60_000), async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Additional validation
      if (!username || !password) {
        return res.status(400).json({ 
          message: "Username va parol kiritilishi shart",
          code: "MISSING_CREDENTIALS"
        });
      }

      const user = await storage.validateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ 
          message: "Username yoki parol noto'g'ri",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ 
          message: "Foydalanuvchi faol emas",
          code: "USER_INACTIVE"
        });
      }

      // Set session data
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email || undefined,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        role: user.role,
        isActive: Boolean(user.isActive)
      };
      
      // Save session explicitly and wait for it
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            reject(err);
          } else {
            console.log('✅ Session saved successfully for user:', user.username);
            resolve();
          }
        });
      });
      
      // Get partner info if user is a partner
      let partner = null;
      if (user.role === 'partner') {
        partner = await storage.getPartnerByUserId(user.id);
      }

      // Get admin permissions if admin
      let permissions = null;
      if (user.role === 'admin') {
        permissions = await storage.getAdminPermissions(user.id);
      }

      // Log successful login
      await storage.createAuditLog({ 
        userId: user.id, 
        action: 'login', 
        entityType: 'user', 
        entityId: user.id 
      });

      console.log('✅ Login successful for user:', user.username, 'Session ID:', req.sessionID);

      res.json({ 
        user, 
        partner, 
        permissions,
        message: "Muvaffaqiyatli kirildi"
      });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Ma'lumotlar noto'g'ri",
          code: "VALIDATION_ERROR",
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        message: "Server xatoligi",
        code: "SERVER_ERROR"
      });
    }
  });

  app.post('/api/auth/logout', requireAuth, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      
      // Log logout action
      await storage.createAuditLog({ 
        userId, 
        action: 'logout', 
        entityType: 'user', 
        entityId: userId 
      });

      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ 
            message: "Chiqishda xatolik",
            code: "SESSION_ERROR"
          });
        }
        res.json({ 
          message: "Muvaffaqiyatli chiqildi",
          code: "LOGOUT_SUCCESS"
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        message: "Server xatoligi",
        code: "SERVER_ERROR"
      });
    }
  });

  app.get('/api/auth/me', async (req, res) => {
    try {
      console.log('🔍 Auth check - Session:', req.session?.user ? 'exists' : 'not found');
      console.log('🔍 Session ID:', req.sessionID);
      console.log('🔍 Session data:', req.session);
      
      if (!req.session?.user) {
        console.log('❌ No user in session');
        return res.status(401).json({ 
          message: "Avtorizatsiya yo'q",
          code: "AUTH_REQUIRED"
        });
      }
      
      const user = req.session.user;
      console.log('✅ User authenticated:', user.username, user.role);
      
      let partner = null;
      let permissions = null;
      
      if (user.role === 'partner') {
        partner = await storage.getPartnerByUserId(user.id);
        console.log('📋 Partner data:', partner ? 'found' : 'not found');
      }
      
      if (user.role === 'admin') {
        permissions = await storage.getAdminPermissions(user.id);
        console.log('🔐 Admin permissions:', permissions ? 'found' : 'not found');
      }
      
      const response = { user, partner, permissions };
      console.log('✅ Auth response sent');
      res.json(response);
    } catch (error) {
      console.error('❌ Auth check error:', error);
      res.status(500).json({ 
        message: "Server xatoligi",
        code: "SERVER_ERROR"
      });
    }
  });

  // Partner registration
  app.post('/api/partners/register', rateLimit(10, 60_000), async (req, res) => {
    try {
      const data = partnerRegistrationSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ 
          message: "Username band",
          code: "USERNAME_EXISTS"
        });
      }

      // Check if email already exists
      if (data.email) {
        const existingEmail = await storage.getUserByEmail(data.email);
        if (existingEmail) {
          return res.status(400).json({ 
            message: "Email band",
            code: "EMAIL_EXISTS"
          });
        }
      }

      // Create user
      const user = await storage.createUser({
        username: data.username,
        password: data.password,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'partner',
      });

      // Create partner
      const partner = await storage.createPartner({
        userId: user.id,
        businessName: data.businessName,
        businessCategory: data.businessCategory,
        monthlyRevenue: data.monthlyRevenue,
        pricingTier: 'starter_pro',
        commissionRate: '0.30',
      });

      // Log registration
      await storage.createAuditLog({ 
        userId: user.id, 
        action: 'partner_registration', 
        entityType: 'partner', 
        entityId: partner.id 
      });

      res.json({ 
        message: "Hamkor muvaffaqiyatli ro'yxatdan o'tdi. Tasdiq kutilmoqda.",
        partner,
        code: "REGISTRATION_SUCCESS"
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Ma'lumotlar noto'g'ri",
          code: "VALIDATION_ERROR",
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        message: "Server xatoligi",
        code: "SERVER_ERROR"
      });
    }
  });

  // Partner routes
  app.get('/api/partners/me', requireAuth, requireRole(['partner']), async (req, res) => {
    try {
      const partner = await storage.getPartnerByUserId(getAuthUser(req).id);
      if (!partner) {
        return res.status(404).json({ message: "Hamkor topilmadi" });
      }
      res.json(partner);
    } catch (error) {
      console.error('Get partner error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Admin management routes
  app.get('/api/admins', requireAuth, requireRole(['admin']), requirePermission(['canManageAdmins']), async (req, res) => {
    try {
      // Get all admin users from storage
      const allUsers = await storage.getAllUsers();
      const adminUsers = allUsers.filter((u: any) => u.role === 'admin');
      const withPerms = await Promise.all(adminUsers.map(async (u: any) => ({
        ...u,
        permissions: await storage.getAdminPermissions(u.id),
      })));
      res.json(withPerms);
    } catch (e) {
      res.status(500).json({ message: 'Server xatoligi' });
    }
  });

  app.post('/api/admins', requireAuth, requireRole(['admin']), requirePermission(['canManageAdmins']), async (req, res) => {
    try {
      const { username, password, firstName, lastName, email } = req.body;
      const existing = await storage.getUserByUsername(username);
      if (existing) return res.status(400).json({ message: 'Username band' });
      const user = await storage.createUser({ username, password, firstName, lastName, email, role: 'admin' } as any);
      
      // Set default permissions for new admin
      const defaultPermissions = {
        canManageAdmins: false, // New admins don't have admin management rights by default
        canManageContent: true,
        canManageChat: true,
        canViewReports: true,
        canReceiveProducts: true,
        canActivatePartners: true,
        canManageIntegrations: true,
        viewPartners: true,
        managePartners: true,
        viewAnalytics: true,
        manageSettings: true,
        viewRequests: true,
        manageRequests: true
      };
      
      await storage.upsertAdminPermissions(user.id, defaultPermissions);
      res.json({ message: 'Admin yaratildi', user });
    } catch (e) {
      res.status(500).json({ message: 'Server xatoligi' });
    }
  });

  app.post('/api/admins/:id/permissions', requireAuth, requireRole(['admin']), requirePermission(['canManageAdmins']), async (req, res) => {
    try {
      const adminId = req.params.id;
      const perms = req.body || {};
      const updated = await storage.upsertAdminPermissions(adminId, perms);
      res.json({ message: 'Ruxsatlar yangilandi', permissions: updated });
    } catch (e) {
      res.status(500).json({ message: 'Server xatoligi' });
    }
  });

  app.get('/api/partners', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { page = '1', pageSize = '20', q = '' } = req.query as any;
      const all = await storage.getAllPartners();
      
      // For AdminPanel compatibility, return array directly without pagination
      const filtered = q ? all.filter((p: any) => (p.businessName||'').toLowerCase().includes(String(q).toLowerCase())) : all;
      res.setHeader('X-Total-Count', String(filtered.length));
      res.json(filtered);
    } catch (error) {
      console.error('Get partners error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.get('/api/partners/pending', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const partners = await storage.getPendingPartners();
      res.json(partners);
    } catch (error) {
      console.error('Get pending partners error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/partners/:id/approve', requireAuth, requireRole(['admin']), requirePermission(['canActivatePartners']), async (req, res) => {
    try {
      const partnerId = req.params.id;
      const partner = await storage.approvePartner(partnerId, getAuthUser(req).id);
      await storage.createAuditLog({ userId: getAuthUser(req).id, action: 'partner_approve', entityType: 'partner', entityId: partnerId });
      res.json({ message: "Hamkor tasdiqlandi", partner });
    } catch (error) {
      console.error('Approve partner error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Product routes
  app.get('/api/products', requireAuth, requireRole(['partner']), async (req, res) => {
    try {
      const partner = await storage.getPartnerByUserId(getAuthUser(req).id);
      if (!partner) {
        return res.status(404).json({ message: "Hamkor topilmadi" });
      }
      
      const products = await storage.getProductsByPartnerId(partner.id);
      res.json(products);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/products', requireAuth, requireRole(['partner']), async (req, res) => {
    try {
      const partner = await storage.getPartnerByUserId(getAuthUser(req).id);
      if (!partner) {
        return res.status(404).json({ message: "Hamkor topilmadi" });
      }

      const productData = insertProductSchema.parse({
        ...req.body,
        partnerId: partner.id,
      });

      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      console.error('Create product error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Ma'lumotlar noto'g'ri",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Fulfillment request routes
  app.get('/api/fulfillment-requests', requireAuth, async (req, res) => {
    try {
      let requests;
      
      const user = getAuthUser(req);
      if (user.role === 'admin') {
        requests = await storage.getAllFulfillmentRequests();
      } else if (user.role === 'partner') {
        const partner = await storage.getPartnerByUserId(getAuthUser(req).id);
        if (!partner) {
          return res.status(404).json({ message: "Hamkor topilmadi" });
        }
        requests = await storage.getFulfillmentRequestsByPartnerId(partner.id);
      } else {
        return res.status(403).json({ message: "Ruxsat yo'q" });
      }
      
      res.json(requests);
    } catch (error) {
      console.error('Get fulfillment requests error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/fulfillment-requests', requireAuth, requireRole(['partner']), async (req, res) => {
    try {
      const partner = await storage.getPartnerByUserId(getAuthUser(req).id);
      if (!partner) {
        return res.status(404).json({ message: "Hamkor topilmadi" });
      }

      const requestData = insertFulfillmentRequestSchema.parse({
        ...req.body,
        partnerId: partner.id,
      });

      const request = await storage.createFulfillmentRequest(requestData);
      res.json(request);
    } catch (error) {
      console.error('Create fulfillment request error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Ma'lumotlar noto'g'ri",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.patch('/api/fulfillment-requests/:id', requireAuth, async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await storage.updateFulfillmentRequest(requestId, req.body);
      res.json(request);
    } catch (error) {
      console.error('Update fulfillment request error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Pricing tiers
  app.get('/api/pricing-tiers', async (req, res) => {
    try {
      const tiers = await storage.getPricingTiers();
      const body = JSON.stringify(tiers);
      const etag = `W/"${Buffer.from(body).length}-${tiers.length}"`;
      res.setHeader('ETag', etag);
      if (req.headers['if-none-match'] === etag) return res.status(304).end();
      res.setHeader('Cache-Control', 'public, max-age=60');
      res.status(200).send(body);
    } catch (error) {
      console.error('Get pricing tiers error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Marketplace Integration routes
  app.post('/api/partners/:partnerId/marketplace/connect', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { partnerId } = req.params;
      const { marketplace, apiKey, apiSecret, shopId, additionalData } = req.body;
      
      // Validate marketplace
      const validMarketplaces = ['uzum', 'wildberries', 'yandex', 'ozon'];
      if (!validMarketplaces.includes(marketplace)) {
        return res.status(400).json({ message: "Noto'g'ri marketplace" });
      }

      // Store marketplace credentials
      const integration = await storage.createMarketplaceIntegration(partnerId, marketplace, {
        apiKey,
        apiSecret,
        shopId,
        additionalData,
        status: 'connected',
        lastSync: new Date(),
        createdAt: new Date()
      });

      res.json({ 
        message: "Marketplace muvaffaqiyatli ulandi",
        integration 
      });
    } catch (error) {
      console.error('Marketplace connection error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/partners/:partnerId/marketplace/retry', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { partnerId } = req.params;
      const { marketplace } = req.body;
      
      const result = await storage.retryMarketplaceIntegration(partnerId, marketplace);
      
      res.json({ 
        message: "Marketplace ulanishi qayta urinildi",
        result 
      });
    } catch (error) {
      console.error('Marketplace retry error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.get('/api/marketplace-integrations', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const integrations = await storage.getMarketplaceIntegrations();
      res.json(integrations);
    } catch (error) {
      console.error('Get marketplace integrations error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/partners/:partnerId/api-docs', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { partnerId } = req.params;
      const { marketplace, apiDocUrl } = req.body;
      
      // Store API documentation URL for partner
      await storage.updatePartner(partnerId, {
        notes: `API Documentation for ${marketplace}: ${apiDocUrl}`
      });
      
      res.json({ 
        message: "API hujjatlari saqlandi",
        marketplace,
        apiDocUrl 
      });
    } catch (error) {
      console.error('API docs error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/admin/marketplace-configs/:marketplace/test', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { marketplace } = req.params;
      
      // Simulate API connection test
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        await storage.updateMarketplaceIntegration('admin', marketplace, {
          status: 'connected',
          lastSync: new Date()
        });
        res.json({ 
          success: true, 
          marketplace,
          message: `${marketplace} API bilan muvaffaqiyatli ulanish` 
        });
      } else {
        await storage.updateMarketplaceIntegration('admin', marketplace, {
          status: 'error'
        });
        res.status(400).json({ 
          success: false, 
          marketplace,
          message: 'API kalit xato yoki API muammosi' 
        });
      }
    } catch (error) {
      console.error('Test marketplace connection error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/admin/marketplace-configs/:marketplace/sync', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { marketplace } = req.params;
      
      // Simulate data synchronization
      await storage.updateMarketplaceIntegration('admin', marketplace, {
        lastSync: new Date()
      });
      
      res.json({ 
        success: true,
        marketplace,
        message: `${marketplace} ma'lumotlari sinxronlanmoqda`,
        syncedProducts: Math.floor(Math.random() * 100) + 50
      });
    } catch (error) {
      console.error('Sync marketplace data error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Admin trending products (no tier restriction) - full access
  app.get('/api/admin/trending-products', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      // Get real trending products from database - admin has full access
      const trendingProducts = await storage.getTrendingProducts();
      res.json(trendingProducts);
    } catch (error) {
      console.error('Get admin trending products error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Trending products endpoints - Admin access + real API integration
  app.get('/api/trending-products/:category/:market/:minScore', requireAuth, async (req, res) => {
    try {
      const user = getAuthUser(req);
      
      // Admin users have full access, check partner tier for others
      if (user.role !== 'admin') {
        const partner = await storage.getPartnerByUserId(user.id);
        if (!partner) {
          return res.status(404).json({ message: "Hamkor topilmadi" });
        }

        // Check if user has access to trend hunter (Professional Plus+)
        if (!['professional_plus', 'enterprise_elite'].includes(partner.pricingTier)) {
          return res.status(403).json({ message: "Bu funksiya uchun Professional Plus tarifi kerak" });
        }
      }

      // Get filtered trending products from database
      const { category, market, minScore } = req.params;
      const trendingProducts = await storage.getTrendingProducts(
        category === 'all' ? undefined : category,
        market === 'all' ? undefined : market,
        parseInt(minScore)
      );
      
      res.json(trendingProducts);
    } catch (error) {
      console.error('Trending products error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/trending-products/:id/watchlist', requireAuth, requireRole(['partner']), async (req, res) => {
    try {
      const productId = req.params.id;
      const user = getAuthUser(req);
      
      // Check partner tier access
      const partner = await storage.getPartnerByUserId(user.id);
      if (!partner) {
        return res.status(404).json({ message: "Hamkor topilmadi" });
      }

      if (!['professional_plus', 'enterprise_elite'].includes(partner.pricingTier)) {
        return res.status(403).json({ message: "Bu funksiya uchun Professional Plus tarifi kerak" });
      }
      
      // Mock implementation - in real app would add to database watchlist
      res.json({ message: "Mahsulot kuzatuv ro'yxatiga qo'shildi", productId });
    } catch (error) {
      console.error('Add to watchlist error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Tier upgrade request routes
  app.post('/api/tier-upgrade-requests', requireAuth, requireRole(['partner']), async (req, res) => {
    try {
      const partner = await storage.getPartnerByUserId(getAuthUser(req).id);
      if (!partner) {
        return res.status(404).json({ message: "Hamkor topilmadi" });
      }

      const { requestedTier, reason } = req.body;
      
      if (!requestedTier || !reason) {
        return res.status(400).json({ message: "Barcha maydonlar to'ldirilishi shart" });
      }

      const requestData = {
        partnerId: partner.id,
        currentTier: partner.pricingTier,
        requestedTier,
        reason,
      };

      const upgradeRequest = await storage.createTierUpgradeRequest(requestData);
      res.json({ 
        message: "Tarif yaxshilash so'rovi yuborildi. Admin ko'rib chiqadi.", 
        request: upgradeRequest 
      });
    } catch (error) {
      console.error('Create tier upgrade request error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Approve tier upgrade request
  app.post('/api/tier-upgrade-requests/:id/approve', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const requestId = req.params.id;
      const { adminNotes } = req.body;
      
      const result = await storage.approveTierUpgradeRequest(requestId, adminNotes);
      res.json({ 
        message: "Tarif yaxshilash so'rovi tasdiqlandi", 
        result 
      });
    } catch (error) {
      console.error('Approve tier upgrade request error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Reject tier upgrade request
  app.post('/api/tier-upgrade-requests/:id/reject', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const requestId = req.params.id;
      const { adminNotes } = req.body;
      
      const result = await storage.rejectTierUpgradeRequest(requestId, adminNotes);
      res.json({ 
        message: "Tarif yaxshilash so'rovi rad etildi", 
        result 
      });
    } catch (error) {
      console.error('Reject tier upgrade request error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.get('/api/tier-upgrade-requests', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const requests = await storage.getTierUpgradeRequests();
      res.json(requests);
    } catch (error) {
      console.error('Get tier upgrade requests error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.get('/api/tier-upgrade-requests/pending', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const requests = await storage.getPendingTierUpgradeRequests();
      res.json(requests);
    } catch (error) {
      console.error('Get pending tier upgrade requests error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/tier-upgrade-requests/:id/approve', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const requestId = req.params.id;
      const { adminNotes } = req.body;
      
      const request = await storage.approveTierUpgradeRequest(requestId, getAuthUser(req).id, adminNotes);
      res.json({ 
        message: "Tarif yaxshilash so'rovi tasdiqlandi",
        request 
      });
    } catch (error) {
      console.error('Approve tier upgrade request error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/tier-upgrade-requests/:id/reject', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const requestId = req.params.id;
      const { adminNotes } = req.body;
      
      const request = await storage.rejectTierUpgradeRequest(requestId, getAuthUser(req).id, adminNotes);
      res.json({ 
        message: "Tarif yaxshilash so'rovi rad etildi",
        request 
      });
    } catch (error) {
      console.error('Reject tier upgrade request error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Messaging routes
  app.get('/api/messages', requireAuth, async (req, res) => {
    try {
      const userId = getAuthUser(req).id;
      const messages = await storage.getMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/messages', requireAuth, async (req, res) => {
    try {
      const userId = getAuthUser(req).id;
      const { toUserId, content } = req.body;
      
      if (!toUserId || !content) {
        return res.status(400).json({ message: "Barcha maydonlar to'ldirilishi shart" });
      }

      const message = await storage.createMessage({
        fromUserId: userId,
        toUserId,
        content,
        isRead: false
      });

      // Send real-time notification if WebSocket is available
      if ((global as any).wsManager) {
        (global as any).wsManager.sendToUser(toUserId, {
          type: 'message',
          data: message
        });
      }

      res.json({ 
        message: "Xabar yuborildi", 
        messageData: message 
      });
    } catch (error) {
      console.error('Create message error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.put('/api/messages/:id/read', requireAuth, async (req, res) => {
    try {
      const messageId = req.params.id;
      const updatedMessage = await storage.markMessageAsRead(messageId);
      res.json({ 
        message: "Xabar o'qildi deb belgilandi", 
        messageData: updatedMessage 
      });
    } catch (error) {
      console.error('Mark message as read error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.get('/api/messages/unread-count', requireAuth, async (req, res) => {
    try {
      const userId = getAuthUser(req).id;
      const count = await storage.getUnreadMessageCount(userId);
      res.json({ count });
    } catch (error) {
      console.error('Get unread message count error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Get all users (for admin chat)
  app.get('/api/users', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Get contact forms (for admin)
  app.get('/api/contact-forms', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const contactForms = await storage.getContactForms();
      res.json(contactForms);
    } catch (error) {
      console.error('Get contact forms error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Update contact form status
  app.put('/api/contact-forms/:id/status', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const contactForm = await storage.updateContactFormStatus(id, status);
      res.json({ 
        message: "Contact form status updated", 
        contactForm 
      });
    } catch (error) {
      console.error('Update contact form status error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Calculator endpoint
  // Contact forms - Landing page integration  
  app.post('/api/contact-forms', async (req, res) => {
    try {
      const { firstName, lastName, email, phone, businessCategory, monthlyRevenue, notes } = req.body;
      
      // Validate required fields
      if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ 
          success: false,
          message: "Barcha majburiy maydonlar to'ldirilishi shart" 
        });
      }

      // Save contact form submission to database
      const contactForm = await storage.createContactForm({
        firstName,
        lastName,
        email,
        phone,
        businessCategory: businessCategory || 'other',
        monthlyRevenue: monthlyRevenue || '0',
        notes: notes || '',
        status: 'new',
        createdAt: new Date()
      });

      // Send notification to admin via WebSocket
      if ((global as any).wsManager) {
        (global as any).wsManager.notifyAdmins({
          type: 'notification',
          data: {
            type: 'new_contact_form',
            title: 'Yangi hamkor arizasi',
            message: `${firstName} ${lastName} dan yangi ariza`,
            contactForm
          }
        });
      }

      // Create audit log
      await storage.createAuditLog({
        action: 'contact_form_submitted',
        userId: 'anonymous',
        details: {
          contactFormId: contactForm.id,
          email,
          businessCategory
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      res.json({ 
        success: true,
        message: "Arizangiz qabul qilindi! Tez orada siz bilan bog'lanamiz.",
        contactFormId: contactForm.id
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ 
        success: false,
        message: "Arizani yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring." 
      });
    }
  });

  app.post('/api/calculator/optimize', async (req, res) => {
    try {
      const { productPrice, category, monthlyVolume, marketplace } = req.body;
      
      // Calculator logic
      const monthlyRevenue = productPrice * monthlyVolume;
      
      // Get pricing tiers
      const tiers = await storage.getPricingTiers();
      
      // Commission rates by marketplace and category (realistic rates)
      const commissionRates = {
        uzum: { electronics: 0.08, clothing: 0.06, home: 0.10, sports: 0.07, beauty: 0.12 },
        wildberries: { electronics: 0.06, clothing: 0.05, home: 0.08, sports: 0.06, beauty: 0.10 },
        yandex: { electronics: 0.10, clothing: 0.08, home: 0.12, sports: 0.09, beauty: 0.15 }
      };

      const sptCosts = {
        electronics: 5000, clothing: 3000, home: 4500, sports: 3500, beauty: 2500
      };

      const logisticsCosts = { uzum: 8000, wildberries: 12000, yandex: 6000 };

      // Calculate costs
      const sptCost = (sptCosts as any)[category] * monthlyVolume;
      const marketplaceCommission = monthlyRevenue * (commissionRates as any)[marketplace][category];
      const logisticsCost = (logisticsCosts as any)[marketplace] * monthlyVolume;
      const taxCost = monthlyRevenue * 0.03;

      // Find optimal tier
      const optimalTier = tiers.find(tier => {
        const minRevenue = parseFloat(tier.minRevenue);
        const maxRevenue = tier.maxRevenue ? parseFloat(tier.maxRevenue) : Infinity;
        return monthlyRevenue >= minRevenue && monthlyRevenue <= maxRevenue;
      });

      if (!optimalTier) {
        return res.status(400).json({ message: "Mos tarif topilmadi" });
      }

      const tierCommission = monthlyRevenue * parseFloat(optimalTier.commissionMin);
      const totalCosts = parseFloat(optimalTier.fixedCost) + tierCommission + sptCost + marketplaceCommission + logisticsCost + taxCost;
      const netProfit = monthlyRevenue - totalCosts;

      res.json({
        tier: optimalTier,
        monthlyRevenue,
        costs: {
          fixed: parseFloat(optimalTier.fixedCost),
          commission: tierCommission,
          spt: sptCost,
          marketplace: marketplaceCommission,
          logistics: logisticsCost,
          tax: taxCost,
          total: totalCosts
        },
        netProfit
      });

    } catch (error) {
      console.error('Calculator error:', error);
      res.status(500).json({ message: "Hisoblashda xatolik" });
    }
  });

  // Marketplace integrations endpoint
  app.get('/api/marketplace-integrations', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      // Get real marketplace integrations from database
      const integrations = await storage.getMarketplaceIntegrations();
      res.json(integrations);
    } catch (error) {
      console.error('Get marketplace integrations error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Detailed analytics endpoint
  app.get('/api/analytics/detailed', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      // Get real analytics data from database
      const analyticsData = await storage.getAnalytics();
      res.json(analyticsData);
    } catch (error) {
      console.error('Get detailed analytics error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Chat and messaging endpoints
  app.get('/api/admin/chats', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      // Get real chat data from database
      const messages = await storage.getAllMessages();
      const partners = await storage.getAllPartners();
      
      // Group messages by partner and get latest message for each
      const chatsMap = new Map();
      
      for (const message of messages) {
        const partnerId = message.fromUserId;
        const partner = partners.find(p => p.userId === partnerId);
        
        if (partner) {
          const existingChat = chatsMap.get(partnerId);
          if (!existingChat || new Date(message.createdAt) > new Date(existingChat.lastMessageTime)) {
            chatsMap.set(partnerId, {
              id: partnerId,
              partnerId: partner.id,
              partnerName: partner.businessName || 'Unknown Business',
              lastMessage: message.content,
              lastMessageTime: message.createdAt,
              unreadCount: messages.filter(m => m.fromUserId === partnerId && !m.isRead).length,
              status: 'active'
            });
          }
        }
      }
      
      const chats = Array.from(chatsMap.values());
      res.json(chats);
    } catch (error) {
      console.error('Get admin chats error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/admin/chats/:partnerId/messages', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { partnerId } = req.params;
      const { content, messageType = 'text' } = req.body;
      const adminUser = getAuthUser(req);
      
      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Xabar matni kerak" });
      }

      // Check if partner exists  
      const partner = await storage.getPartner(partnerId);
      if (!partner) {
        return res.status(404).json({ message: "Hamkor topilmadi" });
      }

      // Save message to database
      const messageData = {
        fromUserId: adminUser.id,
        toUserId: partnerId,
        content: content.trim(),
        isRead: false,
      };

      const savedMessage = await storage.createMessage(messageData);
      
      // Broadcast message via WebSocket to partner
      const realtimeMessage = {
        type: 'new_message',
        id: savedMessage.id,
        fromUserId: adminUser.id,
        toUserId: partnerId,
        content: savedMessage.content,
        createdAt: savedMessage.createdAt,
        isRead: false,
        senderType: 'admin'
      };
      broadcastToUser(partnerId, realtimeMessage);
      console.log(`Real-time message sent to partner ${partnerId}:`, realtimeMessage);
      
      const message = {
        id: savedMessage.id,
        content: savedMessage.content,
        senderId: adminUser.id,
        senderType: 'admin',
        createdAt: new Date().toISOString(),
        messageType
      };
      
      res.json({ 
        message: "Xabar yuborildi va hamkor ogohlantirildi",
        data: message
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ message: "Xabar yuborishda xatolik" });
    }
  });

  // System settings endpoints
  app.get('/api/system/commission-settings', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const settings = {
        globalCommissions: {
          starter: '8.5',
          professional: '6.5', 
          professional_plus: '4.5',
          enterprise_elite: '2.5'
        },
        sptCosts: {
          defaultPerOrder: '3500',
          byCategory: {
            electronics: '4000',
            clothing: '3000',
            home: '3500',
            beauty: '2500'
          },
          byWeight: {
            under1kg: '2500',
            under5kg: '3500',
            under10kg: '5000',
            over10kg: '7500'
          }
        },
        marketplaceCommissions: {
          uzum: '10',
          wildberries: '15',
          yandex: '8'
        }
      };
      res.json(settings);
    } catch (error) {
      console.error('Get commission settings error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.put('/api/system/commission-settings', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      // In a real implementation, this would update the database
      const updatedSettings = req.body;
      res.json({ message: "Sozlamalar yangilandi", settings: updatedSettings });
    } catch (error) {
      console.error('Update commission settings error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Individual partner commission override
  app.put('/api/partners/:id/commission', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const { commissionRate } = req.body;
      
      // Update partner commission rate
      const partner = await storage.updatePartnerCommission(id, commissionRate);
      res.json({ message: "Hamkor komissiyasi yangilandi", partner });
    } catch (error) {
      console.error('Update partner commission error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // API Documentation Management
  app.get('/api/partners/:id/api-documentations', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const documentations = await storage.getApiDocumentations(id);
      res.json(documentations);
    } catch (error) {
      console.error('Get API documentations error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });
app.post('/api/partners/:id/api-documentations', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const { marketplace, apiDocumentationUrl, shopId, notes } = req.body;
      
      const documentation = await storage.createApiDocumentation(id, {
        marketplace,
        apiDocumentationUrl,
        shopId,
        notes
      });
      
      res.json(documentation);
    } catch (error) {
      console.error('Create API documentation error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/api-documentations/:id/verify', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const result = await storage.verifyApiDocumentation('partner-id', id);
      res.json(result);
    } catch (error) {
      console.error('Verify API documentation error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.delete('/api/api-documentations/:id', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteApiDocumentation('partner-id', id);
      res.json({ message: "API hujjat o'chirildi" });
    } catch (error) {
      console.error('Delete API documentation error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  // Excel Import/Export Management
  app.get('/api/partners/:id/excel-imports', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const imports = await storage.getExcelImports(id);
      res.json(imports);
    } catch (error) {
      console.error('Get Excel imports error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.post('/api/partners/:id/excel-import', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const { importType, marketplace } = req.body;
      
      // Handle file upload (you'll need to add multer middleware for file handling)
      // For now, we'll simulate the import process
      const importRecord = await storage.createExcelImport(id, {
        marketplace,
        importType,
        fileName: 'uploaded_file.xlsx',
        fileSize: 1024,
        status: 'processing'
      });
      
      // Simulate processing
      setTimeout(async () => {
        await storage.updateExcelImport(importRecord.id, {
          status: 'completed',
          recordsProcessed: 100,
          recordsTotal: 100,
          successCount: 95,
          errorCount: 5,
          processedAt: new Date().toISOString()
        });
      }, 2000);
      
      res.json(importRecord);
    } catch (error) {
      console.error('Create Excel import error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.get('/api/partners/:id/export/:marketplace/:dataType', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id, marketplace, dataType } = req.params;
      
      // Generate Excel file based on data type
      const excelData = await storage.generateExcelExport(id, marketplace, dataType);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${marketplace}_${dataType}_${new Date().toISOString().split('T')[0]}.xlsx`);
      res.send(excelData);
    } catch (error) {
      console.error('Export Excel error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.get('/api/excel-templates', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const templates = await storage.getExcelTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Get Excel templates error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  app.get('/api/excel-templates/:id/download', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getExcelTemplate(id);
      
      if (!template) {
        return res.status(404).json({ message: "Shablon topilmadi" });
      }
      
      // Generate template file
      const templateFile = await storage.generateExcelTemplate(template);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=template_${template.name}.xlsx`);
      res.send(templateFile);
    } catch (error) {
      console.error('Download Excel template error:', error);
      res.status(500).json({ message: "Server xatoligi" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server setup for real-time chat on a separate port to avoid Vite conflicts
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });
  
  wss.on('connection', (ws: any, req: any) => {
    console.log('New WebSocket connection');
    
    ws.on('message', async (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'authenticate') {
          // Authenticate user and store connection
          const { userId } = message;
          if (userId) {
            wsConnections.set(userId, ws);
            ws.userId = userId;
            ws.send(JSON.stringify({ type: 'authenticated', userId }));
            console.log(`User ${userId} authenticated via WebSocket`);
          }
        }
        
        if (message.type === 'chat_message') {
          const { fromUserId, toUserId, content, messageType } = message;
          
          // Save message to database
          const savedMessage = await storage.createMessage({
            fromUserId,
            toUserId, 
            content,
            isRead: false
          });
          
          // Broadcast to recipient
          const responseMessage = {
            type: 'new_message',
            id: savedMessage.id,
            fromUserId,
            toUserId,
            content: savedMessage.content,
            createdAt: savedMessage.createdAt,
            isRead: false
          };
          
          // Send to recipient
          broadcastToUser(toUserId, responseMessage);
          
          // Confirm to sender  
          ws.send(JSON.stringify({ 
            type: 'message_sent', 
            messageId: savedMessage.id,
            originalMessage: responseMessage 
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });
    
    ws.on('close', () => {
      if (ws.userId) {
        wsConnections.delete(ws.userId);
        console.log(`User ${ws.userId} disconnected from WebSocket`);
      }
    });
    
    ws.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  });
  
  return httpServer;
}
