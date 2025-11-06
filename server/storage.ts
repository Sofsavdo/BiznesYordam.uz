import { db } from "./db";
import { 
  users, 
  partners, 
  products, 
  fulfillmentRequests, 
  messages, 
  analytics,
  pricingTiers,
  tierUpgradeRequests,
  systemSettings,
  sptCosts,
  commissionSettings,
  marketplaceIntegrations,
  marketplaceApiConfigs,
  excelImports,
  excelTemplates,
  profitBreakdown,
  trendingProducts,
  notifications,
  auditLogs,
  adminPermissions,
  type User,
  type Partner,
  type Product,
  type FulfillmentRequest,
  type Message,
  type Analytics,
  type PricingTier,
  type TierUpgradeRequest,
  type SystemSetting,
  type SptCost,
  type CommissionSetting,
  type MarketplaceApiConfig,
  type ExcelImport,
  type ExcelTemplate,
  type ProfitBreakdown,
  type TrendingProduct,
  type Notification,
  type AuditLog,
  type AdminPermission
} from "@shared/schema";
import { eq, desc, and, gte, lte, sql, or, like, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

// Enhanced error handling
class StorageError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

// User operations
export async function createUser(userData: {
  username: string;
  email?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'admin' | 'partner' | 'customer';
}): Promise<User> {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [user] = await db.insert(users).values({
      id: nanoid(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role || 'customer',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return user;
  } catch (error: any) {
    if (error.code === '23505' || error.message?.includes('UNIQUE constraint')) {
      throw new StorageError('Username yoki email allaqachon mavjud', 'DUPLICATE_USER');
    }
    throw new StorageError(`Foydalanuvchi yaratishda xatolik: ${error.message}`, 'CREATE_USER_ERROR');
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || null;
  } catch (error: any) {
    console.error('Error getting user by username:', error);
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  } catch (error: any) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function validateUserPassword(username: string, password: string): Promise<User | null> {
  try {
    const user = await getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  } catch (error: any) {
    console.error('Error validating password:', error);
    return null;
  }
}

// Partner operations
export async function createPartner(partnerData: {
  userId: string;
  businessName?: string;
  businessCategory: string;
  monthlyRevenue?: string;
  pricingTier?: string;
  notes?: string;
}): Promise<Partner> {
  try {
    const [partner] = await db.insert(partners).values({
      id: nanoid(),
      userId: partnerData.userId,
      businessName: partnerData.businessName,
      businessCategory: partnerData.businessCategory as any,
      monthlyRevenue: partnerData.monthlyRevenue,
      pricingTier: partnerData.pricingTier || 'starter_pro',
      commissionRate: '0.30',
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: partnerData.notes
    }).returning();
    
    return partner;
  } catch (error: any) {
    throw new StorageError(`Hamkor yaratishda xatolik: ${error.message}`, 'CREATE_PARTNER_ERROR');
  }
}

export async function getPartnerByUserId(userId: string): Promise<Partner | null> {
  try {
    const [partner] = await db.select().from(partners).where(eq(partners.userId, userId));
    return partner || null;
  } catch (error: any) {
    console.error('Error getting partner by user ID:', error);
    return null;
  }
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  try {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || null;
  } catch (error: any) {
    console.error('Error getting partner by ID:', error);
    return null;
  }
}

export async function updatePartner(id: string, updates: Partial<Partner>): Promise<Partner | null> {
  try {
    const [partner] = await db.update(partners)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(partners.id, id))
      .returning();
    
    return partner || null;
  } catch (error: any) {
    throw new StorageError(`Hamkor yangilashda xatolik: ${error.message}`, 'UPDATE_PARTNER_ERROR');
  }
}

export async function getAllPartners(): Promise<Partner[]> {
  try {
    return await db.select().from(partners).orderBy(desc(partners.createdAt));
  } catch (error: any) {
    console.error('Error getting all partners:', error);
    return [];
  }
}

export async function approvePartner(partnerId: string, adminId: string): Promise<Partner | null> {
  try {
    const [partner] = await db.update(partners)
      .set({
        isApproved: true,
        approvedBy: adminId,
        approvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(partners.id, partnerId))
      .returning();
    
    return partner || null;
  } catch (error: any) {
    throw new StorageError(`Hamkorni tasdiqlashda xatolik: ${error.message}`, 'APPROVE_PARTNER_ERROR');
  }
}

// Product operations
export async function createProduct(productData: {
  partnerId: string;
  name: string;
  category: string;
  description?: string;
  price: string;
  costPrice?: string;
  sku?: string;
  barcode?: string;
  weight?: string;
}): Promise<Product> {
  try {
    const [product] = await db.insert(products).values({
      id: nanoid(),
      partnerId: productData.partnerId,
      name: productData.name,
      category: productData.category as any,
      description: productData.description,
      price: productData.price,
      costPrice: productData.costPrice,
      sku: productData.sku,
      barcode: productData.barcode,
      weight: productData.weight,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return product;
  } catch (error: any) {
    throw new StorageError(`Mahsulot yaratishda xatolik: ${error.message}`, 'CREATE_PRODUCT_ERROR');
  }
}

export async function getProductsByPartnerId(partnerId: string): Promise<Product[]> {
  try {
    return await db.select().from(products)
      .where(eq(products.partnerId, partnerId))
      .orderBy(desc(products.createdAt));
  } catch (error: any) {
    console.error('Error getting products by partner ID:', error);
    return [];
  }
}

// Fulfillment request operations
export async function createFulfillmentRequest(requestData: {
  partnerId: string;
  productId?: string;
  requestType: string;
  title: string;
  description: string;
  priority?: string;
  estimatedCost?: string;
  metadata?: any;
}): Promise<FulfillmentRequest> {
  try {
    const [request] = await db.insert(fulfillmentRequests).values({
      id: nanoid(),
      partnerId: requestData.partnerId,
      productId: requestData.productId,
      requestType: requestData.requestType,
      title: requestData.title,
      description: requestData.description,
      priority: requestData.priority || 'medium',
      status: 'pending',
      estimatedCost: requestData.estimatedCost,
      metadata: requestData.metadata ? JSON.stringify(requestData.metadata) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return request;
  } catch (error: any) {
    throw new StorageError(`Fulfillment so'rov yaratishda xatolik: ${error.message}`, 'CREATE_REQUEST_ERROR');
  }
}

export async function getFulfillmentRequestsByPartnerId(partnerId: string): Promise<FulfillmentRequest[]> {
  try {
    return await db.select().from(fulfillmentRequests)
      .where(eq(fulfillmentRequests.partnerId, partnerId))
      .orderBy(desc(fulfillmentRequests.createdAt));
  } catch (error: any) {
    console.error('Error getting fulfillment requests:', error);
    return [];
  }
}

export async function getAllFulfillmentRequests(): Promise<FulfillmentRequest[]> {
  try {
    return await db.select().from(fulfillmentRequests)
      .orderBy(desc(fulfillmentRequests.createdAt));
  } catch (error: any) {
    console.error('Error getting all fulfillment requests:', error);
    return [];
  }
}

export async function updateFulfillmentRequest(id: string, updates: Partial<FulfillmentRequest>): Promise<FulfillmentRequest | null> {
  try {
    const [request] = await db.update(fulfillmentRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(fulfillmentRequests.id, id))
      .returning();
    
    return request || null;
  } catch (error: any) {
    throw new StorageError(`Fulfillment so'rov yangilashda xatolik: ${error.message}`, 'UPDATE_REQUEST_ERROR');
  }
}

// Message operations
export async function createMessage(messageData: {
  fromUserId: string;
  toUserId: string;
  content: string;
  isRead?: boolean;
}): Promise<Message> {
  try {
    const [message] = await db.insert(messages).values({
      id: nanoid(),
      fromUserId: messageData.fromUserId,
      toUserId: messageData.toUserId,
      content: messageData.content,
      isRead: messageData.isRead || false,
      createdAt: new Date()
    }).returning();
    
    return message;
  } catch (error: any) {
    throw new StorageError(`Xabar yaratishda xatolik: ${error.message}`, 'CREATE_MESSAGE_ERROR');
  }
}

export async function getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
  try {
    return await db.select().from(messages)
      .where(
        or(
          and(eq(messages.fromUserId, userId1), eq(messages.toUserId, userId2)),
          and(eq(messages.fromUserId, userId2), eq(messages.toUserId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  } catch (error: any) {
    console.error('Error getting messages between users:', error);
    return [];
  }
}

// Analytics operations
export async function getAnalyticsByPartnerId(partnerId: string): Promise<Analytics[]> {
  try {
    return await db.select().from(analytics)
      .where(eq(analytics.partnerId, partnerId))
      .orderBy(desc(analytics.date));
  } catch (error: any) {
    console.error('Error getting analytics:', error);
    return [];
  }
}

export async function createAnalytics(analyticsData: {
  partnerId: string;
  date: Date;
  revenue: string;
  orders: number;
  profit: string;
  commissionPaid: string;
  marketplace?: string;
  category?: string;
}): Promise<Analytics> {
  try {
    const [newAnalytics] = await db.insert(analytics).values({
      id: nanoid(),
      partnerId: analyticsData.partnerId,
      date: analyticsData.date,
      revenue: analyticsData.revenue,
      orders: analyticsData.orders,
      profit: analyticsData.profit,
      commissionPaid: analyticsData.commissionPaid,
      marketplace: analyticsData.marketplace as any,
      category: analyticsData.category as any,
      createdAt: new Date()
    }).returning();
    
    return newAnalytics;
  } catch (error: any) {
    throw new StorageError(`Analytics yaratishda xatolik: ${error.message}`, 'CREATE_ANALYTICS_ERROR');
  }
}

// Pricing tier operations
export async function getAllPricingTiers(): Promise<PricingTier[]> {
  try {
    return await db.select().from(pricingTiers)
      .where(eq(pricingTiers.isActive, true))
      .orderBy(pricingTiers.minRevenue);
  } catch (error: any) {
    console.error('Error getting pricing tiers:', error);
    return [];
  }
}

export async function getPricingTierByTier(tier: string): Promise<PricingTier | null> {
  try {
    const [pricingTier] = await db.select().from(pricingTiers)
      .where(eq(pricingTiers.tier, tier));
    return pricingTier || null;
  } catch (error: any) {
    console.error('Error getting pricing tier:', error);
    return null;
  }
}

// Tier upgrade request operations
export async function createTierUpgradeRequest(requestData: {
  partnerId: string;
  requestedTier: string;
  reason?: string;
}): Promise<TierUpgradeRequest> {
  try {
    // Get current partner tier
    const partner = await getPartnerById(requestData.partnerId);
    if (!partner) {
      throw new StorageError('Hamkor topilmadi', 'PARTNER_NOT_FOUND');
    }

    const [request] = await db.insert(tierUpgradeRequests).values({
      id: nanoid(),
      partnerId: requestData.partnerId,
      currentTier: partner.pricingTier as any,
      requestedTier: requestData.requestedTier as any,
      reason: requestData.reason,
      status: 'pending',
      requestedAt: new Date()
    }).returning();
    
    return request;
  } catch (error: any) {
    throw new StorageError(`Tarif yangilash so'rovi yaratishda xatolik: ${error.message}`, 'CREATE_TIER_REQUEST_ERROR');
  }
}

export async function getTierUpgradeRequests(): Promise<TierUpgradeRequest[]> {
  try {
    return await db.select().from(tierUpgradeRequests)
      .orderBy(desc(tierUpgradeRequests.requestedAt));
  } catch (error: any) {
    console.error('Error getting tier upgrade requests:', error);
    return [];
  }
}

export async function updateTierUpgradeRequest(id: string, updates: Partial<TierUpgradeRequest>): Promise<TierUpgradeRequest | null> {
  try {
    const [request] = await db.update(tierUpgradeRequests)
      .set(updates)
      .where(eq(tierUpgradeRequests.id, id))
      .returning();
    
    return request || null;
  } catch (error: any) {
    throw new StorageError(`Tarif so'rovini yangilashda xatolik: ${error.message}`, 'UPDATE_TIER_REQUEST_ERROR');
  }
}

// Trending products operations
export async function getTrendingProducts(filters?: {
  category?: string;
  sourceMarket?: string;
  minTrendScore?: number;
}): Promise<TrendingProduct[]> {
  try {
    let query = db.select().from(trendingProducts);
    
    // Filter by isActive if column exists
    try {
      query = query.where(eq(trendingProducts.isActive, true));
    } catch {
      // Column might not exist in some database versions, skip filter
    }
    
    if (filters?.category && filters.category !== 'all') {
      query = query.where(eq(trendingProducts.category, filters.category as any));
    }
    
    if (filters?.sourceMarket && filters.sourceMarket !== 'all') {
      query = query.where(eq(trendingProducts.sourceMarket, filters.sourceMarket));
    }
    
    if (filters?.minTrendScore) {
      query = query.where(gte(trendingProducts.trendScore, filters.minTrendScore));
    }
    
    const results = await query.orderBy(desc(trendingProducts.trendScore));
    return results;
  } catch (error: any) {
    console.error('Error getting trending products:', error);
    // Return empty array on error, don't throw
    return [];
  }
}

export async function createTrendingProduct(productData: {
  productName: string;
  category: string;
  description?: string;
  sourceMarket: string;
  sourceUrl?: string;
  currentPrice?: string;
  estimatedCostPrice?: string;
  estimatedSalePrice?: string;
  profitPotential?: string;
  searchVolume?: number;
  trendScore?: number;
  competitionLevel?: string;
  keywords?: string[];
  images?: string[];
}): Promise<TrendingProduct> {
  try {
    const [product] = await db.insert(trendingProducts).values({
      id: nanoid(),
      productName: productData.productName,
      category: productData.category as any,
      description: productData.description,
      sourceMarket: productData.sourceMarket,
      sourceUrl: productData.sourceUrl,
      currentPrice: productData.currentPrice,
      estimatedCostPrice: productData.estimatedCostPrice,
      estimatedSalePrice: productData.estimatedSalePrice,
      profitPotential: productData.profitPotential,
      searchVolume: productData.searchVolume,
      trendScore: productData.trendScore || 0,
      competitionLevel: productData.competitionLevel || 'medium',
      keywords: JSON.stringify(productData.keywords || []),
      images: JSON.stringify(productData.images || []),
      isActive: true,
      scannedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return product;
  } catch (error: any) {
    throw new StorageError(`Trending mahsulot yaratishda xatolik: ${error.message}`, 'CREATE_TRENDING_PRODUCT_ERROR');
  }
}

// Profit breakdown operations
export async function getProfitBreakdown(partnerId: string, filters?: {
  period?: string;
  marketplace?: string;
}): Promise<ProfitBreakdown[]> {
  try {
    let query = db.select().from(profitBreakdown)
      .where(eq(profitBreakdown.partnerId, partnerId));
    
    if (filters?.marketplace && filters.marketplace !== 'all') {
      query = query.where(eq(profitBreakdown.marketplace, filters.marketplace as any));
    }
    
    if (filters?.period) {
      const now = new Date();
      let startDate: Date;
      
      switch (filters.period) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
      
      query = query.where(gte(profitBreakdown.date, startDate));
    }
    
    const results = await query.orderBy(desc(profitBreakdown.date));
    return results;
  } catch (error: any) {
    console.error('Error getting profit breakdown:', error);
    // Return empty array on error, don't throw
    return [];
  }
}

// System settings operations
export async function getSystemSetting(key: string): Promise<SystemSetting | null> {
  try {
    const [setting] = await db.select().from(systemSettings)
      .where(and(eq(systemSettings.settingKey, key), eq(systemSettings.isActive, true)));
    return setting || null;
  } catch (error: any) {
    console.error('Error getting system setting:', error);
    return null;
  }
}

export async function setSystemSetting(settingData: {
  settingKey: string;
  settingValue: string;
  settingType?: string;
  category: string;
  description?: string;
  updatedBy: string;
}): Promise<SystemSetting> {
  try {
    // Check if setting exists
    const existing = await getSystemSetting(settingData.settingKey);
    
    if (existing) {
      // Update existing setting
      const [setting] = await db.update(systemSettings)
        .set({
          settingValue: settingData.settingValue,
          updatedBy: settingData.updatedBy,
          updatedAt: new Date()
        })
        .where(eq(systemSettings.settingKey, settingData.settingKey))
        .returning();
      
      return setting;
    } else {
      // Create new setting
      const [setting] = await db.insert(systemSettings).values({
        id: nanoid(),
        settingKey: settingData.settingKey,
        settingValue: settingData.settingValue,
        settingType: settingData.settingType || 'string',
        category: settingData.category,
        description: settingData.description,
        isActive: true,
        updatedBy: settingData.updatedBy,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      return setting;
    }
  } catch (error: any) {
    throw new StorageError(`System setting yaratish/yangilashda xatolik: ${error.message}`, 'SYSTEM_SETTING_ERROR');
  }
}

// Seed system settings
export async function seedSystemSettings(adminId: string): Promise<void> {
  try {
    const defaultSettings = [
      {
        settingKey: 'platform_commission_rate',
        settingValue: '0.15',
        settingType: 'number',
        category: 'commission',
        description: 'Default platform commission rate',
        updatedBy: adminId
      },
      {
        settingKey: 'spt_base_cost',
        settingValue: '5000',
        settingType: 'number',
        category: 'spt',
        description: 'Base SPT cost per item',
        updatedBy: adminId
      },
      {
        settingKey: 'max_file_upload_size',
        settingValue: '10485760',
        settingType: 'number',
        category: 'general',
        description: 'Maximum file upload size in bytes (10MB)',
        updatedBy: adminId
      }
    ];

    for (const setting of defaultSettings) {
      await setSystemSetting(setting);
    }
    
    console.log('✅ System settings seeded');
  } catch (error: any) {
    console.error('Error seeding system settings:', error);
  }
}

// Audit log operations
export async function createAuditLog(logData: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  payload?: any;
}): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      id: nanoid(),
      userId: logData.userId,
      action: logData.action,
      entityType: logData.entityType,
      entityId: logData.entityId,
      payload: logData.payload ? JSON.stringify(logData.payload) : null,
      createdAt: new Date()
    });
  } catch (error: any) {
    console.error('Error creating audit log:', error);
  }
}

// Admin permissions operations
export async function getAdminPermissions(userId: string): Promise<any> {
  try {
    const [permissions] = await db.select().from(adminPermissions)
      .where(eq(adminPermissions.userId, userId));
    return permissions || null;
  } catch (error: any) {
    console.error('Error getting admin permissions:', error);
    return null;
  }
}

// Export storage object for compatibility
export const storage = {
  createUser,
  getUserByUsername,
  getUserById,
  validateUserPassword,
  createPartner,
  getPartnerByUserId,
  getPartnerById,
  updatePartner,
  getAllPartners,
  approvePartner,
  createProduct,
  getProductsByPartnerId,
  createFulfillmentRequest,
  getFulfillmentRequestsByPartnerId,
  getAllFulfillmentRequests,
  updateFulfillmentRequest,
  createMessage,
  getMessagesBetweenUsers,
  getAnalyticsByPartnerId,
  createAnalytics,
  getAllPricingTiers,
  getPricingTierByTier,
  createTierUpgradeRequest,
  getTierUpgradeRequests,
  updateTierUpgradeRequest,
  getTrendingProducts,
  createTrendingProduct,
  getProfitBreakdown,
  getSystemSetting,
  setSystemSetting,
  seedSystemSettings,
  createAuditLog,
  getAdminPermissions
};