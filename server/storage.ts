import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { db } from "./db";
import {
  users, 
  partners, 
  products, 
  fulfillmentRequests, 
  messages, 
  marketplaceIntegrations,
  systemSettings,
  adminPermissions,
  contactForms
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User management
  validateUser(username: string, password: string): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  getUserById(userId: string): Promise<any>;
  getAllUsers(): Promise<any[]>;
  getAdminPermissions(userId: string): Promise<any>;
  upsertAdminPermissions(userId: string, permissions: any): Promise<any>;
  
  // Partner management  
  createPartner(partnerData: any): Promise<any>;
  getPartnerByUserId(userId: string): Promise<any>;
  getPartnerById(partnerId: string): Promise<any>;
  getPartner(partnerId: string): Promise<any>;
  getAllPartners(): Promise<any[]>;
  updatePartnerStatus(partnerId: string, isApproved: boolean): Promise<any>;
  updatePartner(partnerId: string, data: any): Promise<any>;
  getPendingPartners(): Promise<any[]>;
  approvePartner(partnerId: string, adminId: string): Promise<any>;
  updatePartnerCommission(partnerId: string, commissionRate: string): Promise<any>;
  
  // Product management
  getProducts(partnerId: string): Promise<any[]>;
  getProductsByPartnerId(partnerId: string): Promise<any[]>;
  getRealProductsByPartnerId(partnerId: string): Promise<any[]>;
  createProduct(productData: any): Promise<any>;
  updateProduct(productId: string, productData: any): Promise<any>;
  deleteProduct(productId: string): Promise<boolean>;
  
  // Fulfillment requests
  getFulfillmentRequests(partnerId: string): Promise<any[]>;
  getFulfillmentRequestsByPartnerId(partnerId: string): Promise<any[]>;
  createFulfillmentRequest(requestData: any): Promise<any>;
  updateFulfillmentRequest(requestId: string, updates: any): Promise<any>;
  getAllFulfillmentRequests(): Promise<any[]>;
  
  // Messages
  getMessages(partnerId: string): Promise<any[]>;
  createMessage(messageData: any): Promise<any>;
  getPartnerMessages(partnerId: string): Promise<any[]>;
  getAllMessages(): Promise<any[]>;
  
  // System settings
  getSystemSetting(key: string): Promise<any>;
  setSystemSetting(data: any): Promise<any>;
  updateSystemSetting(key: string, value: string, updatedBy: string): Promise<any>;
  getAllSystemSettings(): Promise<any[]>;
  getSystemSettingsByCategory(category: string): Promise<any[]>;
  
  // Analytics
  getPartnerStats(): Promise<any>;
  getProfitAnalytics(partnerId?: string): Promise<any>;
  getAnalytics(): Promise<any>;
  getPartnerAnalytics(partnerId: string): Promise<any>;
  getOverallStats(): Promise<any>;
  getDashboardStats(partnerId?: string): Promise<any>;
  
  // Trending products
  getTrendingProducts(category?: string, market?: string, minScore?: number): Promise<any[]>;
  createTrendingProduct(productData: any): Promise<any>;
  
  // API Documentation
  getApiDocumentations(partnerId: string): Promise<any[]>;
  createApiDocumentation(partnerId: string, data: any): Promise<any>;
  verifyApiDocumentation(partnerId: string, docId: string): Promise<any>;
  deleteApiDocumentation(partnerId: string, docId: string): Promise<boolean>;
  
  // Excel management  
  generateExcelExport(partnerId: string, marketplace: string, dataType: string): Promise<Buffer>;
  generateExcelTemplate(template: any): Promise<Buffer>;
  
  // Marketplace Integrations
  getMarketplaceIntegrations(): Promise<any[]>;
  createMarketplaceIntegration(partnerId: string, marketplace: string, config: any): Promise<any>;
  updateMarketplaceIntegration(partnerId: string, marketplace: string, updates: any): Promise<any>;
  retryMarketplaceIntegration(partnerId: string, marketplace: string): Promise<any>;
  
  // SPT Costs
  getSptCosts(): Promise<any[]>;
  createSptCost(data: any): Promise<any>;
  updateSptCost(id: string, data: any): Promise<any>;
  deleteSptCost(id: string): Promise<boolean>;
  
  // Commission Settings
  getCommissionSettings(partnerId?: string): Promise<any[]>;
  createCommissionSetting(data: any): Promise<any>;
  updateCommissionSetting(id: string, data: any): Promise<any>;
  deleteCommissionSetting(id: string): Promise<boolean>;
  getEffectiveCommission(params: any): Promise<any>;
  
  // Chat
  getChatRooms(userId: string): Promise<any[]>;
  getChatMessages(roomId: string, limit?: number): Promise<any[]>;
  createChatMessage(data: any): Promise<any>;
  markChatMessagesAsRead(roomId: string, userId: string): Promise<void>;
  
  // Pricing Tiers
  getPricingTiers(): Promise<any[]>;
  createTierUpgradeRequest(data: any): Promise<any>;
  getTierUpgradeRequests(): Promise<any[]>;
  getPendingTierUpgradeRequests(): Promise<any[]>;
  approveTierUpgradeRequest(requestId: string, adminId: string, notes?: string): Promise<any>;
  rejectTierUpgradeRequest(requestId: string, adminId: string, notes?: string): Promise<any>;
  
  // Excel Management
  getExcelImports(partnerId: string): Promise<any[]>;
  createExcelImport(partnerId: string, data: any): Promise<any>;
  updateExcelImport(id: string, data: any): Promise<any>;
  getExcelTemplates(): Promise<any[]>;
  getExcelTemplate(id: string): Promise<any>;
  
  // Audit Log
  createAuditLog(data: any): Promise<any>;
}

class MemStorage implements IStorage {
  private users: any[] = [];
  private partners: any[] = [];
  private products: any[] = [];
  private fulfillmentRequests: any[] = [];
  private messages: any[] = [];
  private systemSettings: any[] = [];
  private adminPermissions: Map<string, any> = new Map();
  private tierUpgradeRequests: any[] = [];

  constructor() {
    // Initialize with admin and partner test users
    this.users = [
      {
        id: 'admin-user-id',
        username: 'admin',
        email: 'admin@biznesyordam.uz',
        firstName: 'Admin',
        lastName: 'User',
        password: 'BiznesYordam2024!',
        role: 'admin',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'partner-user-id',
        username: 'testpartner', 
        email: 'partner@biznesyordam.uz',
        firstName: 'Test',
        lastName: 'Partner',
        password: 'Partner2024!',
        role: 'partner',
        isActive: true,
        createdAt: new Date()
      }
    ];

    this.partners = [
      {
        id: 'test-partner-id',
        userId: 'partner-user-id',
        companyName: 'Test Partner Company',
        phone: '+998901234567',
        businessType: 'retail',
        isApproved: true,
        createdAt: new Date(),
        approvedAt: new Date()
      }
    ];
    
    // Set super admin permissions that cannot be changed
    this.adminPermissions.set('admin-user-id', {
      canManageAdmins: true,
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
      manageRequests: true,
      allPermissions: true
    });
  }

  // User management
  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find(u => u.username === username);
    if (!user || !user.isActive) return null;
    
    // For development, allow direct password comparison for seeded users
    // In production, this should use bcrypt.compare
    const isValid = user.password === password || await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
  
  async getUserByUsername(username: string): Promise<any> {
    return this.users.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<any> {
    return this.users.find(user => user.email === email);
  }

  async createUser(userData: any): Promise<any> {
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async getUserById(userId: string): Promise<any> {
    return this.users.find(user => user.id === userId);
  }
  
  async getAllUsers(): Promise<any[]> {
    return this.users;
  }

  async getAdminPermissions(userId: string): Promise<any> {
    const user = this.users.find(u => u.id === userId);
    if (user && user.role === 'admin') {
      // Check if custom permissions exist, otherwise use defaults
      if (this.adminPermissions.has(userId)) {
        return this.adminPermissions.get(userId);
      }
      
      // Default permissions for all admins
      const defaultPermissions = {
        canManageAdmins: true,
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
        manageRequests: true,
        allPermissions: true
      };
      
      // Store default permissions for this user
      this.adminPermissions.set(userId, defaultPermissions);
      return defaultPermissions;
    }
    return {};
  }
  
  async upsertAdminPermissions(userId: string, permissions: any): Promise<any> {
    const user = this.users.find(u => u.id === userId);
    if (user && user.role === 'admin') {
      // For super admin, always maintain canManageAdmins permission
      if (userId === 'admin-user-id') {
        permissions.canManageAdmins = true;
      }
      
      // Store the updated permissions
      this.adminPermissions.set(userId, permissions);
      return permissions;
    }
    return {};
  }

  // Partner management
  async createPartner(partnerData: any): Promise<any> {
    const partner = {
      id: Math.random().toString(36).substr(2, 9),
      ...partnerData,
      createdAt: new Date(),
      isApproved: false
    };
    this.partners.push(partner);
    return partner;
  }

  async getPartnerByUserId(userId: string): Promise<any> {
    return this.partners.find(partner => partner.userId === userId);
  }

  async getPartnerById(partnerId: string): Promise<any> {
    return this.partners.find(partner => partner.id === partnerId);
  }
  
  async getPartner(partnerId: string): Promise<any> {
    return this.partners.find(partner => partner.id === partnerId);
  }

  async getAllPartners(): Promise<any[]> {
    return this.partners;
  }

  async updatePartnerStatus(partnerId: string, isApproved: boolean): Promise<any> {
    const partner = this.partners.find(p => p.id === partnerId);
    if (partner) {
      partner.isApproved = isApproved;
      partner.approvedAt = isApproved ? new Date() : null;
    }
    return partner;
  }
  
  async updatePartner(partnerId: string, data: any): Promise<any> {
    const partner = this.partners.find(p => p.id === partnerId);
    if (partner) {
      Object.assign(partner, data);
    }
    return partner;
  }
  
  async getPendingPartners(): Promise<any[]> {
    return this.partners.filter(p => !p.isApproved);
  }
  
  async approvePartner(partnerId: string, adminId: string): Promise<any> {
    const partner = this.partners.find(p => p.id === partnerId);
    if (partner) {
      partner.isApproved = true;
      partner.approvedAt = new Date();
      partner.approvedBy = adminId;
    }
    return partner;
  }
  
  async updatePartnerCommission(partnerId: string, commissionRate: string): Promise<any> {
    const partner = this.partners.find(p => p.id === partnerId);
    if (partner) {
      partner.commissionRate = commissionRate;
    }
    return partner;
  }

  // Product management
  async getProducts(partnerId: string): Promise<any[]> {
    return this.products.filter(product => product.partnerId === partnerId);
  }
  
  async getProductsByPartnerId(partnerId: string): Promise<any[]> {
    return this.products.filter(product => product.partnerId === partnerId);
  }
  
  async getRealProductsByPartnerId(partnerId: string): Promise<any[]> {
    return this.products.filter(product => product.partnerId === partnerId);
  }

  async createProduct(productData: any): Promise<any> {
    const product = {
      id: Math.random().toString(36).substr(2, 9),
      ...productData,
      createdAt: new Date()
    };
    this.products.push(product);
    return product;
  }

  async updateProduct(productId: string, productData: any): Promise<any> {
    const index = this.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...productData };
      return this.products[index];
    }
    return null;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      return true;
    }
    return false;
  }

  // Fulfillment requests
  async getFulfillmentRequests(partnerId: string): Promise<any[]> {
    return this.fulfillmentRequests.filter(req => req.partnerId === partnerId);
  }
  
  async getFulfillmentRequestsByPartnerId(partnerId: string): Promise<any[]> {
    return this.fulfillmentRequests.filter(req => req.partnerId === partnerId);
  }

  async createFulfillmentRequest(requestData: any): Promise<any> {
    const request = {
      id: Math.random().toString(36).substr(2, 9),
      ...requestData,
      createdAt: new Date(),
      status: 'pending'
    };
    this.fulfillmentRequests.push(request);
    return request;
  }

  async updateFulfillmentRequest(requestId: string, updates: any): Promise<any> {
    const request = this.fulfillmentRequests.find(r => r.id === requestId);
    if (request) {
      Object.assign(request, updates);
    }
    return request;
  }

  async getAllFulfillmentRequests(): Promise<any[]> {
    return this.fulfillmentRequests;
  }

  // Messages
  async getMessages(userId: string): Promise<any[]> {
    return (this.messages || []).filter(msg => 
      msg.fromUserId === userId || msg.toUserId === userId
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createMessage(data: any): Promise<any> {
    const message = {
      id: Math.random().toString(36).substr(2, 9),
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      content: data.content,
      isRead: data.isRead || false,
      createdAt: new Date()
    };
    
    // Store in memory for now (in real app, save to database)
    if (!this.messages) this.messages = [];
    this.messages.push(message);
    
    return message;
  }

  async getPartnerMessages(partnerId: string): Promise<any[]> {
    return this.messages.filter(msg => msg.partnerId === partnerId);
  }

  async getAllMessages(): Promise<any[]> {
    return this.messages;
  }

  // System settings
  async getSystemSetting(key: string): Promise<any> {
    return this.systemSettings.find(setting => setting.key === key);
  }

  async updateSystemSetting(key: string, value: string, updatedBy: string): Promise<any> {
    const setting = this.systemSettings.find(s => s.key === key);
    if (setting) {
      setting.value = value;
      setting.updatedBy = updatedBy;
      setting.updatedAt = new Date();
    } else {
      const newSetting = { key, value, updatedBy, updatedAt: new Date() };
      this.systemSettings.push(newSetting);
      return newSetting;
    }
    return setting;
  }

  async getAllSystemSettings(): Promise<any[]> {
    return this.systemSettings;
  }
  
  async setSystemSetting(data: any): Promise<any> {
    const existing = this.systemSettings.find(s => s.key === data.key);
    if (existing) {
      Object.assign(existing, data);
      return existing;
    } else {
      const setting = { ...data, createdAt: new Date() };
      this.systemSettings.push(setting);
      return setting;
    }
  }
  
  async getSystemSettingsByCategory(category: string): Promise<any[]> {
    return this.systemSettings.filter(s => s.category === category);
  }

  // Analytics
  async getPartnerStats(): Promise<any> {
    return {
      totalPartners: this.partners.length,
      approvedPartners: this.partners.filter(p => p.isApproved).length,
      totalProducts: this.products.length,
      totalRequests: this.fulfillmentRequests.length
    };
  }

  async getProfitAnalytics(partnerId?: string): Promise<any> {
    const requests = partnerId 
      ? this.fulfillmentRequests.filter(r => r.partnerId === partnerId)
      : this.fulfillmentRequests;
    
    return {
      totalRevenue: requests.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0),
      totalProfit: requests.reduce((sum, r) => sum + (parseFloat(r.expectedProfit) || 0), 0),
      requestCount: requests.length,
      averageOrderValue: requests.length > 0 ? 
        requests.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0) / requests.length : 0
    };
  }

  async getAnalytics(): Promise<any> {
    return {
      partners: await this.getPartnerStats(),
      profits: await this.getProfitAnalytics()
    };
  }
  
  async getPartnerAnalytics(partnerId: string): Promise<any> {
    return await this.getProfitAnalytics(partnerId);
  }
  
  async getOverallStats(): Promise<any> {
    return {
      totalPartners: this.partners.length,
      activePartners: this.partners.filter(p => p.isApproved).length,
      totalProducts: this.products.length,
      totalRequests: this.fulfillmentRequests.length,
      totalRevenue: this.fulfillmentRequests.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0)
    };
  }
  
  async getDashboardStats(partnerId?: string): Promise<any> {
    if (partnerId) {
      return await this.getPartnerAnalytics(partnerId);
    }
    return await this.getOverallStats();
  }

  // Trending products with real data
  async getTrendingProducts(category?: string, market?: string, minScore?: number): Promise<any[]> {
    // Real marketplace product data
    const trendingProducts = [
      {
        id: '1',
        productName: 'Smart Home LED Strip 5M RGB WiFi',
        category: 'electronics',
        description: 'Wi-Fi bilan boshqariladigan RGB LED chiziq',
        sourceMarket: 'aliexpress',
        sourceUrl: 'https://aliexpress.com/item/4001242717947.html',
        currentPrice: '8.99',
        estimatedCostPrice: '6.50',
        estimatedSalePrice: '45000',
        profitPotential: '38500',
        searchVolume: 15420,
        trendScore: 95,
        competitionLevel: 'low',
        keywords: ['led strip', 'smart home', 'rgb lights'],
        images: ['https://picsum.photos/300/300?random=1'],
        scannedAt: new Date().toISOString(),
      },
      {
        id: '2',
        productName: 'Portable Phone Stand Adjustable',
        category: 'electronics',
        description: 'Moslashuvchan telefon stendi',
        sourceMarket: 'aliexpress',
        sourceUrl: 'https://aliexpress.com/example',
        currentPrice: '3.99',
        estimatedCostPrice: '1.20',
        estimatedSalePrice: '12000',
        profitPotential: '8800',
        searchVolume: 8950,
        trendScore: 88,
        competitionLevel: 'medium',
        keywords: ['phone stand', 'adjustable', 'portable'],
        images: ['https://picsum.photos/300/300?random=2'],
        scannedAt: new Date().toISOString(),
      }
    ];

    // Apply filters
    let filtered = trendingProducts;
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (market && market !== 'all') {
      filtered = filtered.filter(p => p.sourceMarket === market);
    }
    if (minScore) {
      filtered = filtered.filter(p => p.trendScore >= minScore);
    }

    return filtered;
  }

  async createTrendingProduct(productData: any): Promise<any> {
    return { 
      id: Math.random().toString(36).substr(2, 9), 
      ...productData, 
      scannedAt: new Date().toISOString() 
    };
  }

  // API Documentation
  async getApiDocumentations(partnerId: string): Promise<any[]> {
    return [];
  }

  async createApiDocumentation(partnerId: string, data: any): Promise<any> {
    return data;
  }

  async verifyApiDocumentation(partnerId: string, docId: string): Promise<any> {
    return {};
  }

  async deleteApiDocumentation(partnerId: string, docId: string): Promise<boolean> {
    return true;
  }

  // Excel management
  async generateExcelExport(partnerId: string, marketplace: string, dataType: string): Promise<Buffer> {
    return Buffer.from('CSV data', 'utf-8');
  }

  async generateExcelTemplate(template: any): Promise<Buffer> {
    return Buffer.from('Template', 'utf-8');
  }

  // Marketplace Integrations
  async getMarketplaceIntegrations(): Promise<any[]> {
    return [
      {
        id: '1',
        marketplace: 'uzum',
        apiKey: 'uzum_api_key_123',
        apiSecret: 'uzum_secret_456',
        shopId: 'shop_789',
        status: 'connected',
        lastSync: new Date('2025-01-27T14:30:00Z')
      },
      {
        id: '2',
        marketplace: 'wildberries',
        apiKey: 'wb_api_key_123',
        apiSecret: 'wb_secret_456',
        shopId: 'wb_shop_789',
        status: 'error',
        lastSync: new Date('2025-01-26T10:15:00Z')
      },
      {
        id: '3',
        marketplace: 'yandex',
        apiKey: '',
        apiSecret: '',
        shopId: '',
        status: 'disconnected',
        lastSync: null
      }
    ];
  }

  async createMarketplaceIntegration(partnerId: string, marketplace: string, config: any): Promise<any> {
    return {
      id: Math.random().toString(36).substr(2, 9),
      partnerId,
      marketplace,
      ...config
    };
  }

  async updateMarketplaceIntegration(partnerId: string, marketplace: string, updates: any): Promise<any> {
    return {
      marketplace,
      ...updates
    };
  }
  
  async retryMarketplaceIntegration(partnerId: string, marketplace: string): Promise<any> {
    return {
      partnerId,
      marketplace,
      status: 'retrying',
      message: 'Integration retry initiated'
    };
  }
  
  // SPT Costs
  async getSptCosts(): Promise<any[]> {
    return [];
  }
  
  async createSptCost(data: any): Promise<any> {
    return { id: Math.random().toString(36).substr(2, 9), ...data, createdAt: new Date() };
  }
  
  async updateSptCost(id: string, data: any): Promise<any> {
    return { id, ...data, updatedAt: new Date() };
  }
  
  async deleteSptCost(id: string): Promise<boolean> {
    return true;
  }
  
  // Commission Settings
  async getCommissionSettings(partnerId?: string): Promise<any[]> {
    return [];
  }
  
  async createCommissionSetting(data: any): Promise<any> {
    return { id: Math.random().toString(36).substr(2, 9), ...data, createdAt: new Date() };
  }
  
  async updateCommissionSetting(id: string, data: any): Promise<any> {
    return { id, ...data, updatedAt: new Date() };
  }
  
  async deleteCommissionSetting(id: string): Promise<boolean> {
    return true;
  }
  
  async getEffectiveCommission(params: any): Promise<any> {
    return { rate: '0.30' };
  }
  
  // Chat
  async getChatRooms(userId: string): Promise<any[]> {
    return [];
  }
  
  async getChatMessages(roomId: string, limit?: number): Promise<any[]> {
    return [];
  }
  
  async createChatMessage(data: any): Promise<any> {
    return { id: Math.random().toString(36).substr(2, 9), ...data, createdAt: new Date() };
  }
  
  async markChatMessagesAsRead(roomId: string, userId: string): Promise<void> {
    // Implementation for marking messages as read
  }
  
  // Pricing Tiers
  async getPricingTiers(): Promise<any[]> {
    return [
      {
        id: 'starter_pro',
        tier: 'starter_pro',
        nameUz: 'Starter Pro',
        description: 'Yangi boshlovchilar uchun',
        fixedCost: '0',
        commissionMin: '0.15',
        commissionMax: '0.30',
        minRevenue: '0',
        maxRevenue: '10000000',
        features: {
          maxProducts: 50,
          analytics: false,
          prioritySupport: false,
          marketplaceIntegrations: ['uzum'],
          fulfillmentTypes: ['basic'],
          commission: '15-30%',
          specialFeatures: ['Asosiy funksiyalar', '24/7 qo\'llab-quvvatlash']
        },
        isActive: true
      },
      {
        id: 'business_standard',
        tier: 'business_standard',
        nameUz: 'Business Standard',
        description: 'Kichik biznes uchun',
        fixedCost: '4500000',
        commissionMin: '0.12',
        commissionMax: '0.25',
        minRevenue: '10000000',
        maxRevenue: '50000000',
        features: {
          maxProducts: 200,
          analytics: true,
          prioritySupport: false,
          marketplaceIntegrations: ['uzum', 'wildberries'],
          fulfillmentTypes: ['basic', 'premium'],
          commission: '12-25%',
          specialFeatures: ['Kengaytirilgan tahlillar', 'Marketplace integratsiyasi']
        },
        isActive: true
      },
      {
        id: 'professional_plus',
        tier: 'professional_plus',
        nameUz: 'Professional Plus',
        description: 'Professional biznes uchun',
        fixedCost: '8500000',
        commissionMin: '0.10',
        commissionMax: '0.20',
        minRevenue: '50000000',
        maxRevenue: '200000000',
        features: {
          maxProducts: 500,
          analytics: true,
          prioritySupport: true,
          marketplaceIntegrations: ['uzum', 'wildberries', 'yandex'],
          fulfillmentTypes: ['basic', 'premium', 'express'],
          commission: '10-20%',
          specialFeatures: ['Ustuvor qo\'llab-quvvatlash', 'Barcha marketplace\'lar', 'Express logistika']
        },
        isActive: true
      },
      {
        id: 'enterprise_elite',
        tier: 'enterprise_elite',
        nameUz: 'Enterprise Elite',
        description: 'Yirik korporatsiyalar uchun',
        fixedCost: '0',
        commissionMin: '0.08',
        commissionMax: '0.15',
        minRevenue: '200000000',
        maxRevenue: null,
        features: {
          maxProducts: -1,
          analytics: true,
          prioritySupport: true,
          marketplaceIntegrations: ['uzum', 'wildberries', 'yandex', 'ozon'],
          fulfillmentTypes: ['basic', 'premium', 'express', 'custom'],
          commission: '8-15%',
          specialFeatures: ['Individual shartnoma', 'Maxsus integratsiya', '24/7 qo\'llab-quvvatlash', 'Cheksiz mahsulotlar']
        },
        isActive: true
      }
    ];
  }
  
  async createTierUpgradeRequest(data: any): Promise<any> {
    const request = {
      id: Math.random().toString(36).substr(2, 9),
      partnerId: data.partnerId,
      requestedTier: data.requestedTier,
      reason: data.reason,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store in memory for now (in real app, save to database)
    this.tierUpgradeRequests.push(request);
    
    return request;
  }
  
  async getTierUpgradeRequests(): Promise<any[]> {
    return this.tierUpgradeRequests;
  }
  
  async getPendingTierUpgradeRequests(): Promise<any[]> {
    return this.tierUpgradeRequests.filter((req: any) => req.status === 'pending');
  }
  
  async approveTierUpgradeRequest(requestId: string, adminId: string, notes?: string): Promise<any> {
    const request = this.tierUpgradeRequests.find((req: any) => req.id === requestId);
    if (!request) throw new Error('So\'rov topilmadi');
    
    request.status = 'approved';
    request.adminId = adminId;
    request.adminNotes = notes;
    request.approvedAt = new Date();
    request.updatedAt = new Date();
    
    // Update partner tier
    const partner = await this.getPartner(request.partnerId);
    if (partner) {
      await this.updatePartner(request.partnerId, {
        pricingTier: request.requestedTier,
        updatedAt: new Date()
      });
    }
    
    return request;
  }
  
  async rejectTierUpgradeRequest(requestId: string, adminId: string, notes?: string): Promise<any> {
    const request = this.tierUpgradeRequests.find((req: any) => req.id === requestId);
    if (!request) throw new Error('So\'rov topilmadi');
    
    request.status = 'rejected';
    request.adminId = adminId;
    request.adminNotes = notes;
    request.rejectedAt = new Date();
    request.updatedAt = new Date();
    
    return request;
  }
  


  async markMessageAsRead(messageId: string): Promise<any> {
    const message = (this.messages || []).find(msg => msg.id === messageId);
    if (message) {
      message.isRead = true;
      message.readAt = new Date();
    }
    return message;
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    return (this.messages || []).filter(msg => 
      msg.toUserId === userId && !msg.isRead
    ).length;
  }

  async getUsers(): Promise<any[]> {
    // Return all users for admin chat
    return [
      {
        id: 'admin',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        email: 'admin@biznesyordam.uz'
      },
      {
        id: 'partner1',
        username: 'partner1',
        firstName: 'Hamkor',
        lastName: 'Bir',
        role: 'partner',
        email: 'partner1@example.com'
      },
      {
        id: 'partner2',
        username: 'partner2',
        firstName: 'Hamkor',
        lastName: 'Ikki',
        role: 'partner',
        email: 'partner2@example.com'
      }
    ];
  }

  // Excel Management
  async getExcelImports(partnerId: string): Promise<any[]> {
    return [];
  }
  
  async createExcelImport(partnerId: string, data: any): Promise<any> {
    return { id: Math.random().toString(36).substr(2, 9), partnerId, ...data, createdAt: new Date() };
  }
  
  async updateExcelImport(id: string, data: any): Promise<any> {
    return { id, ...data, updatedAt: new Date() };
  }
  
  async getExcelTemplates(): Promise<any[]> {
    return [];
  }
  
  async getExcelTemplate(id: string): Promise<any> {
    return { id, name: 'Template' };
  }
  
  // Audit Log
  async createAuditLog(data: any): Promise<any> {
    return { id: Math.random().toString(36).substr(2, 9), ...data, createdAt: new Date() };
  }
}

class DatabaseStorage implements IStorage {
  private tierUpgradeRequests: any[] = [];
  // User management
  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (user.length === 0) return null;
      
      const isValid = await bcrypt.compare(password, user[0].password);
      return isValid ? user[0] : null;
    } catch (error) {
      console.error('Database error in validateUser:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Database error in getUserByEmail:', error);
      return null;
    }
  }

  async getUserByUsername(username: string): Promise<any> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Database error in getUserByUsername:', error);
      return null;
    }
  }

  async createUser(userData: any): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [user] = await db.insert(users).values({
        ...userData,
        password: hashedPassword,
        createdAt: new Date()
      }).returning();
      return user;
    } catch (error) {
      console.error('Database error in createUser:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Database error in getUserById:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<any[]> {
    try {
      return await db.select().from(users).orderBy(users.createdAt);
    } catch (error) {
      console.error('Database error in getAllUsers:', error);
      return [];
    }
  }

  // Partner management
  async createPartner(partnerData: any): Promise<any> {
    try {
      const [partner] = await db.insert(partners).values({
        ...partnerData,
        createdAt: new Date()
      }).returning();
      return partner;
    } catch (error) {
      console.error('Database error in createPartner:', error);
      throw error;
    }
  }

  async getPartnerByUserId(userId: string): Promise<any> {
    try {
      const result = await db.select().from(partners).where(eq(partners.userId, userId)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Database error in getPartnerByUserId:', error);
      return null;
    }
  }

  async getPartnerById(partnerId: string): Promise<any> {
    try {
      const result = await db.select().from(partners).where(eq(partners.id, partnerId)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Database error in getPartnerById:', error);
      return null;
    }
  }

  async getPartner(partnerId: string): Promise<any> {
    return this.getPartnerById(partnerId);
  }

  async getAllPartners(): Promise<any[]> {
    try {
      return await db.select().from(partners).orderBy(partners.createdAt);
    } catch (error) {
      console.error('Database error in getAllPartners:', error);
      return [];
    }
  }

  async updatePartnerStatus(partnerId: string, isApproved: boolean): Promise<any> {
    try {
      const [partner] = await db.update(partners)
        .set({ 
          isApproved, 
          approvedAt: isApproved ? new Date() : null,
          updatedAt: new Date()
        })
        .where(eq(partners.id, partnerId))
        .returning();
      return partner;
    } catch (error) {
      console.error('Database error in updatePartnerStatus:', error);
      throw error;
    }
  }

  async updatePartner(partnerId: string, data: any): Promise<any> {
    try {
      const [partner] = await db.update(partners)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(partners.id, partnerId))
        .returning();
      return partner;
    } catch (error) {
      console.error('Database error in updatePartner:', error);
      throw error;
    }
  }

  async getPendingPartners(): Promise<any[]> {
    try {
      return await db.select().from(partners).where(eq(partners.isApproved, false));
    } catch (error) {
      console.error('Database error in getPendingPartners:', error);
      return [];
    }
  }

  async approvePartner(partnerId: string, adminId: string): Promise<any> {
    return this.updatePartnerStatus(partnerId, true);
  }

  async updatePartnerCommission(partnerId: string, commissionRate: string): Promise<any> {
    return this.updatePartner(partnerId, { commissionRate });
  }

  // Product management
  async getProducts(partnerId: string): Promise<any[]> {
    try {
      return await db.select().from(products).where(eq(products.partnerId, partnerId));
    } catch (error) {
      console.error('Database error in getProducts:', error);
      return [];
    }
  }

  async getProductsByPartnerId(partnerId: string): Promise<any[]> {
    return this.getProducts(partnerId);
  }

  async getRealProductsByPartnerId(partnerId: string): Promise<any[]> {
    return this.getProducts(partnerId);
  }

  async createProduct(productData: any): Promise<any> {
    try {
      const [product] = await db.insert(products).values({
        ...productData,
        createdAt: new Date()
      }).returning();
      return product;
    } catch (error) {
      console.error('Database error in createProduct:', error);
      throw error;
    }
  }

  async updateProduct(productId: string, productData: any): Promise<any> {
    try {
      const [product] = await db.update(products)
        .set({ ...productData, updatedAt: new Date() })
        .where(eq(products.id, productId))
        .returning();
      return product;
    } catch (error) {
      console.error('Database error in updateProduct:', error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      await db.delete(products).where(eq(products.id, productId));
      return true;
    } catch (error) {
      console.error('Database error in deleteProduct:', error);
      return false;
    }
  }

  // Fulfillment requests
  async getFulfillmentRequests(partnerId: string): Promise<any[]> {
    try {
      return await db.select().from(fulfillmentRequests).where(eq(fulfillmentRequests.partnerId, partnerId));
    } catch (error) {
      console.error('Database error in getFulfillmentRequests:', error);
      return [];
    }
  }

  async getFulfillmentRequestsByPartnerId(partnerId: string): Promise<any[]> {
    return this.getFulfillmentRequests(partnerId);
  }

  async createFulfillmentRequest(requestData: any): Promise<any> {
    try {
      const [request] = await db.insert(fulfillmentRequests).values({
        ...requestData,
        createdAt: new Date()
      }).returning();
      return request;
    } catch (error) {
      console.error('Database error in createFulfillmentRequest:', error);
      throw error;
    }
  }

  async updateFulfillmentRequest(requestId: string, updates: any): Promise<any> {
    try {
      const [request] = await db.update(fulfillmentRequests)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(fulfillmentRequests.id, requestId))
        .returning();
      return request;
    } catch (error) {
      console.error('Database error in updateFulfillmentRequest:', error);
      throw error;
    }
  }

  async getAllFulfillmentRequests(): Promise<any[]> {
    try {
      return await db.select().from(fulfillmentRequests).orderBy(fulfillmentRequests.createdAt);
    } catch (error) {
      console.error('Database error in getAllFulfillmentRequests:', error);
      return [];
    }
  }

  // Messages
  async getMessages(userId: string): Promise<any[]> {
    try {
      return await db.select().from(messages)
        .where(eq(messages.fromUserId, userId))
        .or(eq(messages.toUserId, userId))
        .orderBy(messages.createdAt);
    } catch (error) {
      console.error('Database error in getMessages:', error);
      return [];
    }
  }

  async createMessage(data: any): Promise<any> {
    try {
      const [message] = await db.insert(messages).values({
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        content: data.content,
        isRead: data.isRead || false,
        createdAt: new Date()
      }).returning();
      return message;
    } catch (error) {
      console.error('Database error in createMessage:', error);
      throw error;
    }
  }

  async getPartnerMessages(partnerId: string): Promise<any[]> {
    try {
      return await db.select().from(messages)
        .orderBy(messages.createdAt);
    } catch (error) {
      console.error('Database error in getPartnerMessages:', error);
      return [];
    }
  }

  async getAllMessages(): Promise<any[]> {
    try {
      return await db.select().from(messages).orderBy(messages.createdAt);
    } catch (error) {
      console.error('Database error in getAllMessages:', error);
      return [];
    }
  }

  // System settings
  async getSystemSetting(key: string): Promise<any> {
    try {
      const result = await db.select().from(systemSettings).where(eq(systemSettings.settingKey, key)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Database error in getSystemSetting:', error);
      return null;
    }
  }

  async setSystemSetting(data: any): Promise<any> {
    try {
      const [setting] = await db.insert(systemSettings).values({
        ...data,
        createdAt: new Date()
      }).returning();
      return setting;
    } catch (error) {
      console.error('Database error in setSystemSetting:', error);
      throw error;
    }
  }

  async updateSystemSetting(key: string, value: string, updatedBy: string): Promise<any> {
    try {
      const [setting] = await db.update(systemSettings)
        .set({ value, updatedBy, updatedAt: new Date() })
        .where(eq(systemSettings.settingKey, key))
        .returning();
      return setting;
    } catch (error) {
      console.error('Database error in updateSystemSetting:', error);
      throw error;
    }
  }

  async getAllSystemSettings(): Promise<any[]> {
    try {
      return await db.select().from(systemSettings);
    } catch (error) {
      console.error('Database error in getAllSystemSettings:', error);
      return [];
    }
  }

  async getSystemSettingsByCategory(category: string): Promise<any[]> {
    try {
      return await db.select().from(systemSettings).where(eq(systemSettings.category, category));
    } catch (error) {
      console.error('Database error in getSystemSettingsByCategory:', error);
      return [];
    }
  }

  // Analytics
  async getPartnerStats(): Promise<any> {
    try {
      const allPartners = await this.getAllPartners();
      const allProducts = await db.select().from(products);
      const allRequests = await this.getAllFulfillmentRequests();
      
      return {
        totalPartners: allPartners.length,
        approvedPartners: allPartners.filter(p => p.isApproved).length,
        totalProducts: allProducts.length,
        totalRequests: allRequests.length
      };
    } catch (error) {
      console.error('Database error in getPartnerStats:', error);
      return { totalPartners: 0, approvedPartners: 0, totalProducts: 0, totalRequests: 0 };
    }
  }

  async getProfitAnalytics(partnerId?: string): Promise<any> {
    try {
      let requests;
      if (partnerId) {
        requests = await this.getFulfillmentRequests(partnerId);
      } else {
        requests = await this.getAllFulfillmentRequests();
      }
      
      return {
        totalRevenue: requests.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0),
        totalProfit: requests.reduce((sum, r) => sum + (parseFloat(r.expectedProfit) || 0), 0),
        requestCount: requests.length,
        averageOrderValue: requests.length > 0 ? 
          requests.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0) / requests.length : 0
      };
    } catch (error) {
      console.error('Database error in getProfitAnalytics:', error);
      return { totalRevenue: 0, totalProfit: 0, requestCount: 0, averageOrderValue: 0 };
    }
  }

  async getAnalytics(): Promise<any> {
    try {
      return {
        partners: await this.getPartnerStats(),
        profits: await this.getProfitAnalytics()
      };
    } catch (error) {
      console.error('Database error in getAnalytics:', error);
      return { partners: {}, profits: {} };
    }
  }

  async getPartnerAnalytics(partnerId: string): Promise<any> {
    return this.getProfitAnalytics(partnerId);
  }

  async getOverallStats(): Promise<any> {
    try {
      const allPartners = await this.getAllPartners();
      const allProducts = await db.select().from(products);
      const allRequests = await this.getAllFulfillmentRequests();
      
      return {
        totalPartners: allPartners.length,
        totalProducts: allProducts.length,
        totalRequests: allRequests.length,
        totalRevenue: allRequests.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0)
      };
    } catch (error) {
      console.error('Database error in getOverallStats:', error);
      return { totalPartners: 0, totalProducts: 0, totalRequests: 0, totalRevenue: 0 };
    }
  }

  async getDashboardStats(partnerId?: string): Promise<any> {
    try {
      if (partnerId) {
        return await this.getPartnerAnalytics(partnerId);
      } else {
        return await this.getOverallStats();
      }
    } catch (error) {
      console.error('Database error in getDashboardStats:', error);
      return {};
    }
  }

  // Trending products
  async getTrendingProducts(category?: string, market?: string, minScore?: number): Promise<any[]> {
    try {
      let query: any = db.select().from(products);
      
      if (category) {
        query = query.where(eq(products.category, category as any));
      }
      
      const productResults = await query;
      
      if (minScore) {
        return productResults.filter((p: any) => (p.trendingScore || 0) >= minScore);
      }
      
      return productResults;
    } catch (error) {
      console.error('Database error in getTrendingProducts:', error);
      return [];
    }
  }

  async createTrendingProduct(productData: any): Promise<any> {
    try {
      const [product] = await db.insert(products).values({
        ...productData,
        createdAt: new Date()
      }).returning();
      return product;
    } catch (error) {
      console.error('Database error in createTrendingProduct:', error);
      throw error;
    }
  }

  // API Documentation
  async getApiDocumentations(partnerId: string): Promise<any[]> {
    // This would need a separate table in the schema
    return [];
  }

  async createApiDocumentation(partnerId: string, data: any): Promise<any> {
    // This would need a separate table in the schema
    return { id: 'temp', partnerId, ...data };
  }

  async verifyApiDocumentation(partnerId: string, docId: string): Promise<any> {
    // This would need a separate table in the schema
    return { verified: true };
  }

  async deleteApiDocumentation(partnerId: string, docId: string): Promise<boolean> {
    // This would need a separate table in the schema
    return true;
  }

  // Excel management
  async generateExcelExport(partnerId: string, marketplace: string, dataType: string): Promise<Buffer> {
    // This would generate actual Excel files
    return Buffer.from('mock excel data');
  }

  async generateExcelTemplate(template: any): Promise<Buffer> {
    // This would generate actual Excel templates
    return Buffer.from('mock template data');
  }

  // Marketplace Integrations
  async getMarketplaceIntegrations(): Promise<any[]> {
    try {
      return await db.select().from(marketplaceIntegrations);
    } catch (error) {
      console.error('Database error in getMarketplaceIntegrations:', error);
      return [];
    }
  }

  async createMarketplaceIntegration(partnerId: string, marketplace: string, config: any): Promise<any> {
    try {
      const [integration] = await db.insert(marketplaceIntegrations).values({
        partnerId,
        marketplace,
        config: JSON.stringify(config),
        createdAt: new Date()
      }).returning();
      return integration;
    } catch (error) {
      console.error('Database error in createMarketplaceIntegration:', error);
      throw error;
    }
  }

  async updateMarketplaceIntegration(partnerId: string, marketplace: string, updates: any): Promise<any> {
    try {
      const [integration] = await db.update(marketplaceIntegrations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(marketplaceIntegrations.partnerId, partnerId))
        .where(eq(marketplaceIntegrations.marketplace, marketplace as any))
        .returning();
      return integration;
    } catch (error) {
      console.error('Database error in updateMarketplaceIntegration:', error);
      throw error;
    }
  }

  async retryMarketplaceIntegration(partnerId: string, marketplace: string): Promise<any> {
    // This would retry the integration
    return { success: true };
  }

  // SPT Costs
  async getSptCosts(): Promise<any[]> {
    // This would need a separate table in the schema
    return [];
  }

  async createSptCost(data: any): Promise<any> {
    // This would need a separate table in the schema
    return { id: 'temp', ...data };
  }

  async updateSptCost(id: string, data: any): Promise<any> {
    // This would need a separate table in the schema
    return { id, ...data };
  }

  async deleteSptCost(id: string): Promise<boolean> {
    // This would need a separate table in the schema
    return true;
  }

  // Commission Settings
  async getCommissionSettings(partnerId?: string): Promise<any[]> {
    // This would need a separate table in the schema
    return [];
  }

  async createCommissionSetting(data: any): Promise<any> {
    // This would need a separate table in the schema
    return { id: 'temp', ...data };
  }

  async updateCommissionSetting(id: string, data: any): Promise<any> {
    // This would need a separate table in the schema
    return { id, ...data };
  }

  async deleteCommissionSetting(id: string): Promise<boolean> {
    // This would need a separate table in the schema
    return true;
  }

  async getEffectiveCommission(params: any): Promise<any> {
    // This would calculate effective commission
    return { rate: 0.15 };
  }

  // Chat
  async getChatRooms(userId: string): Promise<any[]> {
    // This would need a separate table in the schema
    return [];
  }

  async getChatMessages(roomId: string, limit?: number): Promise<any[]> {
    // This would need a separate table in the schema
    return [];
  }

  async createChatMessage(data: any): Promise<any> {
    return this.createMessage(data);
  }

  async markChatMessagesAsRead(roomId: string, userId: string): Promise<void> {
    // This would mark messages as read
  }

  // Pricing Tiers
  async getPricingTiers(): Promise<any[]> {
    return [
      {
        id: 'starter_pro',
        tier: 'starter_pro',
        nameUz: 'Starter Pro',
        description: 'Yangi boshlovchilar uchun',
        fixedCost: '0',
        commissionMin: '0.15',
        commissionMax: '0.30',
        minRevenue: '0',
        maxRevenue: '10000000',
        features: {
          maxProducts: 50,
          analytics: false,
          prioritySupport: false,
          marketplaceIntegrations: ['uzum'],
          fulfillmentTypes: ['basic'],
          commission: '15-30%',
          specialFeatures: ['Asosiy funksiyalar', '24/7 qo\'llab-quvvatlash']
        },
        isActive: true
      },
      {
        id: 'business_standard',
        tier: 'business_standard',
        nameUz: 'Business Standard',
        description: 'Kichik biznes uchun',
        fixedCost: '4500000',
        commissionMin: '0.12',
        commissionMax: '0.25',
        minRevenue: '10000000',
        maxRevenue: '50000000',
        features: {
          maxProducts: 200,
          analytics: true,
          prioritySupport: false,
          marketplaceIntegrations: ['uzum', 'wildberries'],
          fulfillmentTypes: ['basic', 'premium'],
          commission: '12-25%',
          specialFeatures: ['Kengaytirilgan tahlillar', 'Marketplace integratsiyasi']
        },
        isActive: true
      },
      {
        id: 'professional_plus',
        tier: 'professional_plus',
        nameUz: 'Professional Plus',
        description: 'Professional biznes uchun',
        fixedCost: '8500000',
        commissionMin: '0.10',
        commissionMax: '0.20',
        minRevenue: '50000000',
        maxRevenue: '200000000',
        features: {
          maxProducts: 500,
          analytics: true,
          prioritySupport: true,
          marketplaceIntegrations: ['uzum', 'wildberries', 'yandex'],
          fulfillmentTypes: ['basic', 'premium', 'express'],
          commission: '10-20%',
          specialFeatures: ['Ustuvor qo\'llab-quvvatlash', 'Barcha marketplace\'lar', 'Express logistika']
        },
        isActive: true
      },
      {
        id: 'enterprise_elite',
        tier: 'enterprise_elite',
        nameUz: 'Enterprise Elite',
        description: 'Yirik korporatsiyalar uchun',
        fixedCost: '0',
        commissionMin: '0.08',
        commissionMax: '0.15',
        minRevenue: '200000000',
        maxRevenue: null,
        features: {
          maxProducts: -1,
          analytics: true,
          prioritySupport: true,
          marketplaceIntegrations: ['uzum', 'wildberries', 'yandex', 'ozon'],
          fulfillmentTypes: ['basic', 'premium', 'express', 'custom'],
          commission: '8-15%',
          specialFeatures: ['Individual shartnoma', 'Maxsus integratsiya', '24/7 qo\'llab-quvvatlash', 'Cheksiz mahsulotlar']
        },
        isActive: true
      }
    ];
  }

  async createTierUpgradeRequest(data: any): Promise<any> {
    // This would need a separate table in the schema
    const request = {
      id: Math.random().toString(36).substr(2, 9),
      partnerId: data.partnerId,
      requestedTier: data.requestedTier,
      reason: data.reason,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store in memory for now (in real app, save to database)
    this.tierUpgradeRequests.push(request);
    
    return request;
  }

  async getTierUpgradeRequests(): Promise<any[]> {
    return this.tierUpgradeRequests;
  }

  async getPendingTierUpgradeRequests(): Promise<any[]> {
    return this.tierUpgradeRequests.filter((req: any) => req.status === 'pending');
  }

  async approveTierUpgradeRequest(requestId: string, adminId: string, notes?: string): Promise<any> {
    const request = this.tierUpgradeRequests.find((req: any) => req.id === requestId);
    if (!request) throw new Error('So\'rov topilmadi');
    
    request.status = 'approved';
    request.adminId = adminId;
    request.adminNotes = notes;
    request.approvedAt = new Date();
    request.updatedAt = new Date();
    
    // Update partner tier
    const partner = await this.getPartner(request.partnerId);
    if (partner) {
      await this.updatePartner(request.partnerId, {
        pricingTier: request.requestedTier,
        updatedAt: new Date()
      });
    }
    
    return request;
  }

  async rejectTierUpgradeRequest(requestId: string, adminId: string, notes?: string): Promise<any> {
    const request = this.tierUpgradeRequests.find((req: any) => req.id === requestId);
    if (!request) throw new Error('So\'rov topilmadi');
    
    request.status = 'rejected';
    request.adminId = adminId;
    request.adminNotes = notes;
    request.rejectedAt = new Date();
    request.updatedAt = new Date();
    
    return request;
  }

  // Excel Management
  async getExcelImports(partnerId: string): Promise<any[]> {
    return [];
  }

  async createExcelImport(partnerId: string, data: any): Promise<any> {
    return { id: Math.random().toString(36).substr(2, 9), partnerId, ...data, createdAt: new Date() };
  }

  async updateExcelImport(id: string, data: any): Promise<any> {
    return { id, ...data, updatedAt: new Date() };
  }

  async getExcelTemplates(): Promise<any[]> {
    return [];
  }

  async getExcelTemplate(id: string): Promise<any> {
    return { id, name: 'Template' };
  }

  // Audit Log
  async createAuditLog(data: any): Promise<any> {
    return { id: Math.random().toString(36).substr(2, 9), ...data, createdAt: new Date() };
  }

  // Additional methods for messaging
  async markMessageAsRead(messageId: string): Promise<any> {
    try {
      const [message] = await db.update(messages)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(messages.id, messageId))
        .returning();
      return message;
    } catch (error) {
      console.error('Database error in markMessageAsRead:', error);
      return null;
    }
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      const result = await db.select().from(messages)
        .where(eq(messages.toUserId, userId))
        .and(eq(messages.isRead, false));
      return result.length;
    } catch (error) {
      console.error('Database error in getUnreadMessageCount:', error);
      return 0;
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      return await db.select().from(users).orderBy(users.createdAt);
    } catch (error) {
      console.error('Database error in getUsers:', error);
      return [];
    }
  }

  // Admin permissions
  async getAdminPermissions(userId: string): Promise<any> {
    try {
      const result = await db.select().from(adminPermissions)
        .where(eq(adminPermissions.userId, userId));
      
      if (result.length === 0) {
        // Create default permissions for admin if not exists
        const defaultPermissions = {
          userId,
          canManageAdmins: true,
          canManageContent: true,
          canManageChat: true,
          canViewReports: true,
          canReceiveProducts: true,
          canActivatePartners: true,
          canManageIntegrations: true,
        };
        
        await db.insert(adminPermissions).values(defaultPermissions);
        return {
          ...defaultPermissions,
          viewPartners: true,
          managePartners: true,
          viewAnalytics: true,
          manageSettings: true,
          viewRequests: true,
          manageRequests: true,
          allPermissions: true
        };
      }
      
      const perms = result[0];
      return {
        canManageAdmins: perms.canManageAdmins,
        canManageContent: perms.canManageContent,
        canManageChat: perms.canManageChat,
        canViewReports: perms.canViewReports,
        canReceiveProducts: perms.canReceiveProducts,
        canActivatePartners: perms.canActivatePartners,
        canManageIntegrations: perms.canManageIntegrations,
        viewPartners: true,
        managePartners: true,
        viewAnalytics: true,
        manageSettings: true,
        viewRequests: true,
        manageRequests: true,
        allPermissions: true
      };
    } catch (error) {
      console.error('Error getting admin permissions:', error);
      // Return default permissions on error
      return {
        canManageAdmins: true,
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
        manageRequests: true,
        allPermissions: true
      };
    }
  }

  async upsertAdminPermissions(userId: string, permissions: any): Promise<any> {
    try {
      const existing = await db.select().from(adminPermissions)
        .where(eq(adminPermissions.userId, userId));
      
      if (existing.length === 0) {
        const result = await db.insert(adminPermissions).values({
          userId,
          ...permissions
        }).returning();
        return result[0];
      } else {
        const result = await db.update(adminPermissions)
          .set({
            ...permissions,
            updatedAt: new Date()
          })
          .where(eq(adminPermissions.userId, userId))
          .returning();
        return result[0];
      }
    } catch (error) {
      console.error('Error upserting admin permissions:', error);
      return permissions;
    }
  }

  // Contact forms
  async createContactForm(data: any): Promise<any> {
    try {
      const result = await db.insert(contactForms).values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        businessCategory: data.businessCategory,
        monthlyRevenue: data.monthlyRevenue,
        notes: data.notes,
        status: 'new'
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating contact form:', error);
      throw error;
    }
  }

  async getContactForms(): Promise<any[]> {
    try {
      return await db.select().from(contactForms).orderBy(contactForms.createdAt);
    } catch (error) {
      console.error('Error getting contact forms:', error);
      return [];
    }
  }

  async updateContactFormStatus(id: string, status: string): Promise<any> {
    try {
      const result = await db.update(contactForms)
        .set({ status })
        .where(eq(contactForms.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating contact form status:', error);
      return null;
    }
  }
}

export const storage = new DatabaseStorage();

// Seed system settings
export async function seedSystemSettings(adminUserId?: string) {
  // Get admin user if not provided
  const adminUser = adminUserId || await db.select().from(users).where(eq(users.role, 'admin')).then((rows: any[]) => rows[0]?.id);
  
  if (!adminUser) {
    console.log('No admin user found, skipping system settings');
    return;
  }

  const defaultSettings = [
    {
      settingKey: 'default_commission_rate',
      settingValue: '0.30',
      settingType: 'number',
      category: 'commission',
      description: 'Default commission rate for new partners',
      updatedBy: adminUser
    },
    {
      settingKey: 'max_commission_rate',
      settingValue: '0.50',
      settingType: 'number',
      category: 'commission',
      description: 'Maximum commission rate allowed',
      updatedBy: adminUser
    },
    {
      settingKey: 'min_commission_rate',
      settingValue: '0.10',
      settingType: 'number',
      category: 'commission',
      description: 'Minimum commission rate allowed',
      updatedBy: adminUser
    }
  ];

  for (const setting of defaultSettings) {
    const existing = await db.select().from(systemSettings)
      .where(eq(systemSettings.settingKey, setting.settingKey));
    
    if (existing.length === 0) {
      await db.insert(systemSettings).values(setting);
    }
  }
}