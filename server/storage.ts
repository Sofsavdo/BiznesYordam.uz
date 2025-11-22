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
  warehouses,
  warehouseStock,
  stockMovements,
  orders,
  orderItems,
  customers,
  stockAlerts,
  inventoryReports,
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
  type AdminPermission,
  type Warehouse,
  type WarehouseStock,
  type StockMovement,
  type Order,
  type OrderItem,
  type Customer,
  type StockAlert,
  type InventoryReport
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
    console.log('🔍 Validating password for username:', username);
    const user = await getUserByUsername(username);
    
    if (!user) {
      console.log('❌ User not found:', username);
      return null;
    }
    
    console.log('✅ User found:', { id: user.id, username: user.username, role: user.role });
    console.log('🔐 Comparing password...');
    
    const isValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Password valid:', isValid);
    
    return isValid ? user : null;
  } catch (error: any) {
    console.error('❌ Error validating password:', error);
    return null;
  }
}

export async function getUsersByRole(role: 'admin' | 'partner' | 'customer'): Promise<User[]> {
  try {
    const userList = await db.select().from(users).where(eq(users.role, role));
    return userList;
  } catch (error: any) {
    console.error('Error getting users by role:', error);
    return [];
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
      commissionRate: '0.25', // YANGI: 25% savdodan (Starter Pro)
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
        settingValue: '0.10', // YANGI: 10% minimum (Enterprise Elite)
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

// ==================== INVENTORY MANAGEMENT FUNCTIONS ====================

// Warehouse operations
export async function createWarehouse(warehouseData: {
  name: string;
  code: string;
  address: string;
  city: string;
  region?: string;
  capacity?: number;
  managerId?: string;
  contactPhone?: string;
  operatingHours?: any;
}): Promise<Warehouse> {
  try {
    const [warehouse] = await db.insert(warehouses).values({
      id: nanoid(),
      name: warehouseData.name,
      code: warehouseData.code,
      address: warehouseData.address,
      city: warehouseData.city,
      region: warehouseData.region,
      capacity: warehouseData.capacity || 10000,
      currentUtilization: '0',
      isActive: true,
      managerId: warehouseData.managerId,
      contactPhone: warehouseData.contactPhone,
      operatingHours: warehouseData.operatingHours ? JSON.stringify(warehouseData.operatingHours) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return warehouse;
  } catch (error: any) {
    throw new StorageError(`Ombor yaratishda xatolik: ${error.message}`, 'CREATE_WAREHOUSE_ERROR');
  }
}

export async function getAllWarehouses(): Promise<Warehouse[]> {
  try {
    return await db.select().from(warehouses).where(eq(warehouses.isActive, true));
  } catch (error: any) {
    console.error('Error getting warehouses:', error);
    return [];
  }
}

export async function getWarehouseById(id: string): Promise<Warehouse | null> {
  try {
    const [warehouse] = await db.select().from(warehouses).where(eq(warehouses.id, id));
    return warehouse || null;
  } catch (error: any) {
    console.error('Error getting warehouse:', error);
    return null;
  }
}

// Stock operations
export async function updateProductStock(
  productId: string,
  warehouseId: string,
  quantity: number,
  movementType: 'inbound' | 'outbound' | 'transfer' | 'adjustment' | 'return',
  reason: string,
  performedBy: string,
  referenceType?: string,
  referenceId?: string,
  notes?: string
): Promise<{ product: Product; movement: StockMovement }> {
  try {
    // Get current product
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (!product) {
      throw new StorageError('Mahsulot topilmadi', 'PRODUCT_NOT_FOUND');
    }

    const previousStock = product.currentStock;
    let newStock = previousStock;

    // Calculate new stock based on movement type
    if (movementType === 'inbound' || movementType === 'return') {
      newStock = previousStock + quantity;
    } else if (movementType === 'outbound') {
      newStock = previousStock - quantity;
      if (newStock < 0) {
        throw new StorageError('Yetarli mahsulot yo\'q', 'INSUFFICIENT_STOCK');
      }
    } else if (movementType === 'adjustment') {
      newStock = quantity; // Direct set for adjustments
    }

    const availableStock = newStock - product.reservedStock;

    // Determine stock status
    let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued' = 'in_stock';
    if (newStock === 0) {
      stockStatus = 'out_of_stock';
    } else if (newStock <= (product.minStockLevel || 10)) {
      stockStatus = 'low_stock';
    }

    // Update product stock
    const [updatedProduct] = await db.update(products)
      .set({
        currentStock: newStock,
        availableStock: availableStock,
        stockStatus: stockStatus,
        lastStockUpdate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(products.id, productId))
      .returning();

    // Create stock movement record
    const [movement] = await db.insert(stockMovements).values({
      id: nanoid(),
      productId,
      warehouseId,
      movementType,
      quantity: Math.abs(quantity),
      previousStock,
      newStock,
      reason,
      referenceType,
      referenceId,
      performedBy,
      notes,
      createdAt: new Date()
    }).returning();

    // Update warehouse stock
    const [existingWarehouseStock] = await db.select().from(warehouseStock)
      .where(and(
        eq(warehouseStock.warehouseId, warehouseId),
        eq(warehouseStock.productId, productId)
      ));

    if (existingWarehouseStock) {
      await db.update(warehouseStock)
        .set({
          quantity: newStock,
          availableQuantity: availableStock,
          lastMovement: new Date(),
          updatedAt: new Date()
        })
        .where(eq(warehouseStock.id, existingWarehouseStock.id));
    } else {
      await db.insert(warehouseStock).values({
        id: nanoid(),
        warehouseId,
        productId,
        quantity: newStock,
        reservedQuantity: 0,
        availableQuantity: newStock,
        lastMovement: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Check if alert needed
    if (stockStatus === 'low_stock' || stockStatus === 'out_of_stock') {
      await createStockAlert({
        productId,
        partnerId: product.partnerId,
        alertType: stockStatus === 'out_of_stock' ? 'out_of_stock' : 'low_stock',
        severity: stockStatus === 'out_of_stock' ? 'critical' : 'high',
        message: stockStatus === 'out_of_stock' 
          ? `${product.name} tugadi! Zudlik bilan to'ldirish kerak.`
          : `${product.name} qoldig'i kam (${newStock} dona). Minimum: ${product.minStockLevel}`,
        currentStock: newStock,
        threshold: product.minStockLevel || 10
      });
    }

    return { product: updatedProduct, movement };
  } catch (error: any) {
    throw new StorageError(`Stock yangilashda xatolik: ${error.message}`, 'UPDATE_STOCK_ERROR');
  }
}

export async function getStockMovements(filters?: {
  productId?: string;
  warehouseId?: string;
  movementType?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<StockMovement[]> {
  try {
    let query = db.select().from(stockMovements);

    if (filters?.productId) {
      query = query.where(eq(stockMovements.productId, filters.productId)) as any;
    }
    if (filters?.warehouseId) {
      query = query.where(eq(stockMovements.warehouseId, filters.warehouseId)) as any;
    }
    if (filters?.startDate) {
      query = query.where(gte(stockMovements.createdAt, filters.startDate)) as any;
    }
    if (filters?.endDate) {
      query = query.where(lte(stockMovements.createdAt, filters.endDate)) as any;
    }

    return await query.orderBy(desc(stockMovements.createdAt));
  } catch (error: any) {
    console.error('Error getting stock movements:', error);
    return [];
  }
}

export async function getWarehouseStock(warehouseId: string): Promise<WarehouseStock[]> {
  try {
    return await db.select().from(warehouseStock)
      .where(eq(warehouseStock.warehouseId, warehouseId));
  } catch (error: any) {
    console.error('Error getting warehouse stock:', error);
    return [];
  }
}

// Order operations
export async function createOrder(orderData: {
  partnerId: string;
  marketplace: string;
  marketplaceOrderId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: string;
  }>;
  shippingAddress: any;
  shippingMethod?: string;
  warehouseId?: string;
}): Promise<Order> {
  try {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;

    // Calculate totals
    let subtotal = 0;
    for (const item of orderData.items) {
      subtotal += parseFloat(item.unitPrice) * item.quantity;
    }

    const shippingCost = 15000; // Default shipping cost
    const tax = subtotal * 0.12; // 12% tax
    const totalAmount = subtotal + shippingCost + tax;

    // Create order
    const [order] = await db.insert(orders).values({
      id: nanoid(),
      orderNumber,
      partnerId: orderData.partnerId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      marketplace: orderData.marketplace as any,
      marketplaceOrderId: orderData.marketplaceOrderId,
      orderDate: new Date(),
      status: 'pending',
      paymentStatus: 'pending',
      fulfillmentStatus: 'pending',
      subtotal: subtotal.toString(),
      shippingCost: shippingCost.toString(),
      tax: tax.toString(),
      totalAmount: totalAmount.toString(),
      shippingAddress: JSON.stringify(orderData.shippingAddress),
      shippingMethod: orderData.shippingMethod,
      warehouseId: orderData.warehouseId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Create order items and reserve stock
    for (const item of orderData.items) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      
      await db.insert(orderItems).values({
        id: nanoid(),
        orderId: order.id,
        productId: item.productId,
        productName: product.name,
        sku: product.sku || undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: '0',
        tax: (parseFloat(item.unitPrice) * item.quantity * 0.12).toString(),
        totalPrice: (parseFloat(item.unitPrice) * item.quantity).toString(),
        status: 'pending',
        createdAt: new Date()
      });

      // Reserve stock
      await db.update(products)
        .set({
          reservedStock: product.reservedStock + item.quantity,
          availableStock: product.currentStock - (product.reservedStock + item.quantity),
          updatedAt: new Date()
        })
        .where(eq(products.id, item.productId));
    }

    return order;
  } catch (error: any) {
    throw new StorageError(`Buyurtma yaratishda xatolik: ${error.message}`, 'CREATE_ORDER_ERROR');
  }
}

export async function getOrdersByPartnerId(partnerId: string): Promise<Order[]> {
  try {
    return await db.select().from(orders)
      .where(eq(orders.partnerId, partnerId))
      .orderBy(desc(orders.createdAt));
  } catch (error: any) {
    console.error('Error getting orders:', error);
    return [];
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error: any) {
    console.error('Error getting all orders:', error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    return order || null;
  } catch (error: any) {
    console.error('Error getting order:', error);
    return null;
  }
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  } catch (error: any) {
    console.error('Error getting order items:', error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  fulfillmentStatus?: string,
  paymentStatus?: string,
  userId?: string
): Promise<Order | null> {
  try {
    const updates: any = {
      status,
      updatedAt: new Date()
    };

    if (fulfillmentStatus) updates.fulfillmentStatus = fulfillmentStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    if (status === 'shipped') {
      updates.shippedAt = new Date();
    } else if (status === 'delivered') {
      updates.actualDelivery = new Date();
    }

    const [order] = await db.update(orders)
      .set(updates)
      .where(eq(orders.id, orderId))
      .returning();

    // If order is completed or cancelled, release reserved stock
    if (status === 'cancelled') {
      const items = await getOrderItems(orderId);
      for (const item of items) {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        await db.update(products)
          .set({
            reservedStock: Math.max(0, product.reservedStock - item.quantity),
            availableStock: product.currentStock - Math.max(0, product.reservedStock - item.quantity),
            updatedAt: new Date()
          })
          .where(eq(products.id, item.productId));
      }
    }

    return order || null;
  } catch (error: any) {
    throw new StorageError(`Buyurtma statusini yangilashda xatolik: ${error.message}`, 'UPDATE_ORDER_ERROR');
  }
}

// Stock Alert operations
export async function createStockAlert(alertData: {
  productId: string;
  partnerId: string;
  alertType: string;
  severity: string;
  message: string;
  currentStock?: number;
  threshold?: number;
}): Promise<StockAlert> {
  try {
    const [alert] = await db.insert(stockAlerts).values({
      id: nanoid(),
      productId: alertData.productId,
      partnerId: alertData.partnerId,
      alertType: alertData.alertType,
      severity: alertData.severity,
      message: alertData.message,
      currentStock: alertData.currentStock,
      threshold: alertData.threshold,
      isResolved: false,
      createdAt: new Date()
    }).returning();

    // Also create a notification
    const [product] = await db.select().from(products).where(eq(products.id, alertData.productId));
    const [partner] = await db.select().from(partners).where(eq(partners.id, alertData.partnerId));
    const [user] = await db.select().from(users).where(eq(users.id, partner.userId));

    await db.insert(notifications).values({
      id: nanoid(),
      userId: user.id,
      type: 'stock_alert',
      title: alertData.alertType === 'out_of_stock' ? 'Mahsulot tugadi!' : 'Mahsulot qoldig\'i kam',
      message: alertData.message,
      data: JSON.stringify({
        productId: alertData.productId,
        productName: product.name,
        currentStock: alertData.currentStock,
        threshold: alertData.threshold
      }),
      isRead: false,
      priority: alertData.severity === 'critical' ? 'urgent' : 'high',
      createdAt: new Date()
    });

    return alert;
  } catch (error: any) {
    console.error('Error creating stock alert:', error);
    throw error;
  }
}

export async function getStockAlertsByPartnerId(partnerId: string, includeResolved: boolean = false): Promise<StockAlert[]> {
  try {
    let query = db.select().from(stockAlerts).where(eq(stockAlerts.partnerId, partnerId));
    
    if (!includeResolved) {
      query = query.where(eq(stockAlerts.isResolved, false)) as any;
    }

    return await query.orderBy(desc(stockAlerts.createdAt));
  } catch (error: any) {
    console.error('Error getting stock alerts:', error);
    return [];
  }
}

export async function resolveStockAlert(alertId: string, resolvedBy: string): Promise<StockAlert | null> {
  try {
    const [alert] = await db.update(stockAlerts)
      .set({
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy
      })
      .where(eq(stockAlerts.id, alertId))
      .returning();

    return alert || null;
  } catch (error: any) {
    console.error('Error resolving stock alert:', error);
    return null;
  }
}

// Inventory statistics
export async function getInventoryStats(partnerId: string): Promise<any> {
  try {
    const partnerProducts = await db.select().from(products)
      .where(eq(products.partnerId, partnerId));

    const totalProducts = partnerProducts.length;
    const totalStock = partnerProducts.reduce((sum, p) => sum + p.currentStock, 0);
    const totalValue = partnerProducts.reduce((sum, p) => {
      const cost = parseFloat(p.costPrice || '0');
      return sum + (cost * p.currentStock);
    }, 0);

    const lowStockProducts = partnerProducts.filter(p => p.stockStatus === 'low_stock').length;
    const outOfStockProducts = partnerProducts.filter(p => p.stockStatus === 'out_of_stock').length;
    const inStockProducts = partnerProducts.filter(p => p.stockStatus === 'in_stock').length;

    return {
      totalProducts,
      totalStock,
      totalValue: totalValue.toFixed(2),
      inStockProducts,
      lowStockProducts,
      outOfStockProducts,
      stockHealth: totalProducts > 0 ? ((inStockProducts / totalProducts) * 100).toFixed(1) : 0
    };
  } catch (error: any) {
    console.error('Error getting inventory stats:', error);
    return {
      totalProducts: 0,
      totalStock: 0,
      totalValue: '0',
      inStockProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      stockHealth: 0
    };
  }
}

// Export storage object for compatibility
export const storage = {
  createUser,
  getUserByUsername,
  getUserById,
  getUsersByRole,
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
  getAdminPermissions,
  // Inventory Management
  createWarehouse,
  getAllWarehouses,
  getWarehouseById,
  updateProductStock,
  getStockMovements,
  getWarehouseStock,
  createOrder,
  getOrdersByPartnerId,
  getAllOrders,
  getOrderById,
  getOrderItems,
  updateOrderStatus,
  createStockAlert,
  getStockAlertsByPartnerId,
  resolveStockAlert,
  getInventoryStats
};