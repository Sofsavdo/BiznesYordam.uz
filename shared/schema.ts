// Complete SQLite Schema for BiznesYordam - Professional Platform
import { sql, relations } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// ==================== CORE TABLES ====================

// Users
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').unique(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  role: text('role').notNull().default('customer'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Partners
export const partners = sqliteTable('partners', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id),
  businessName: text('business_name').notNull(),
  businessAddress: text('business_address'),
  businessCategory: text('business_category'),
  inn: text('inn').unique(),
  phone: text('phone').notNull(),
  website: text('website'),
  monthlyRevenue: text('monthly_revenue'),
  approved: integer('approved', { mode: 'boolean' }).default(false),
  pricingTier: text('pricing_tier').default('starter_pro'),
  monthlyFee: integer('monthly_fee'),
  profitSharePercent: integer('profit_share_percent'),
  aiEnabled: integer('ai_enabled', { mode: 'boolean' }).default(false),
  warehouseSpaceKg: integer('warehouse_space_kg'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  lastActivityAt: integer('last_activity_at', { mode: 'timestamp' }),
});

// Products
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  name: text('name').notNull(),
  sku: text('sku').unique(),
  barcode: text('barcode'),
  description: text('description'),
  category: text('category'),
  brand: text('brand'),
  price: real('price').notNull(),
  costPrice: real('cost_price'),
  weight: text('weight'),
  stockQuantity: integer('stock_quantity').default(0),
  lowStockThreshold: integer('low_stock_threshold').default(10),
  optimizedTitle: text('optimized_title'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// Orders
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  orderNumber: text('order_number').unique().notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone'),
  marketplace: text('marketplace'),
  status: text('status').default('pending'),
  totalAmount: real('total_amount').notNull(),
  shippingAddress: text('shipping_address'),
  trackingNumber: text('tracking_number'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MARKETPLACE & INTEGRATIONS ====================

export const marketplaceIntegrations = sqliteTable('marketplace_integrations', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  marketplace: text('marketplace').notNull(),
  apiKey: text('api_key'),
  apiSecret: text('api_secret'),
  active: integer('active', { mode: 'boolean' }).default(false),
  lastSyncAt: integer('last_sync_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const marketplaceApiConfigs = sqliteTable('marketplace_api_configs', {
  id: text('id').primaryKey(),
  marketplace: text('marketplace').notNull().unique(),
  apiEndpoint: text('api_endpoint').notNull(),
  authType: text('auth_type').notNull(),
  rateLimit: integer('rate_limit'),
  documentation: text('documentation'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== FULFILLMENT ====================

export const fulfillmentRequests = sqliteTable('fulfillment_requests', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('pending'),
  priority: text('priority').default('medium'),
  estimatedCost: text('estimated_cost'),
  actualCost: text('actual_cost'),
  assignedTo: text('assigned_to').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
});

export const warehouses = sqliteTable('warehouses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  capacity: integer('capacity').notNull(),
  currentLoad: integer('current_load').default(0),
  active: integer('active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const warehouseStock = sqliteTable('warehouse_stock', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull().default(0),
  location: text('location'),
  lastUpdated: integer('last_updated', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const stockMovements = sqliteTable('stock_movements', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id),
  warehouseId: text('warehouse_id').references(() => warehouses.id),
  movementType: text('movement_type').notNull(),
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  performedBy: text('performed_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  address: text('address'),
  totalOrders: integer('total_orders').default(0),
  totalSpent: real('total_spent').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  lastOrderAt: integer('last_order_at', { mode: 'timestamp' }),
});

export const stockAlerts = sqliteTable('stock_alerts', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id),
  alertType: text('alert_type').notNull(),
  message: text('message').notNull(),
  resolved: integer('resolved', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
});

export const inventoryReports = sqliteTable('inventory_reports', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  reportType: text('report_type').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  data: text('data').notNull(),
  generatedBy: text('generated_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== AI TABLES ====================

export const aiTasks = sqliteTable('ai_tasks', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  accountId: text('account_id'),
  taskType: text('task_type').notNull(),
  status: text('status').default('pending'),
  priority: text('priority').default('medium'),
  inputData: text('input_data'),
  outputData: text('output_data'),
  errorMessage: text('error_message'),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  estimatedCost: real('estimated_cost'),
  actualCost: real('actual_cost'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const aiProductCards = sqliteTable('ai_product_cards', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  productId: text('product_id').references(() => products.id),
  accountId: text('account_id'),
  baseProductName: text('base_product_name'),
  marketplace: text('marketplace').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  bulletPoints: text('bullet_points'),
  seoKeywords: text('seo_keywords'),
  imagePrompts: text('image_prompts'),
  generatedImages: text('generated_images'),
  status: text('status').default('draft'),
  qualityScore: integer('quality_score'),
  aiModel: text('ai_model'),
  generationCost: real('generation_cost'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
});

export const aiMarketplaceAccounts = sqliteTable('ai_marketplace_accounts', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  marketplace: text('marketplace').notNull(),
  accountName: text('account_name').notNull(),
  credentialsEncrypted: text('credentials_encrypted'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// ==================== REFERRAL SYSTEM ====================

export const referrals = sqliteTable('referrals', {
  id: text('id').primaryKey(),
  referrerPartnerId: text('referrer_partner_id').notNull().references(() => partners.id),
  referredPartnerId: text('referred_partner_id').notNull().references(() => partners.id),
  promoCode: text('promo_code'),
  contractType: text('contract_type').notNull(),
  status: text('status').default('invited'), // 'invited', 'registered', 'paid_1month', 'active', 'expired'\n  bonusEarned: real('bonus_earned').default(0),
  bonusPaid: real('bonus_paid').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  activatedAt: integer('activated_at', { mode: 'timestamp' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
});

export const referralBonuses = sqliteTable('referral_bonuses', {
  id: text('id').primaryKey(),
  referralId: text('referral_id').notNull().references(() => referrals.id),
  referrerPartnerId: text('referrer_partner_id').notNull().references(() => partners.id),
  amount: real('amount').notNull(),
  monthNumber: integer('month_number').notNull(),
  platformProfit: real('platform_profit').notNull(),
  bonusRate: real('bonus_rate').notNull(),
  tierMultiplier: real('tier_multiplier').notNull(),
  status: text('status').default('pending'),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const referralWithdrawals = sqliteTable('referral_withdrawals', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  amount: real('amount').notNull(),
  method: text('method').notNull(),
  fee: real('fee').notNull(),
  netAmount: real('net_amount').notNull(),
  status: text('status').default('pending'),
  requestedAt: integer('requested_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  processedAt: integer('processed_at', { mode: 'timestamp' }),
  transactionId: text('transaction_id'),
});

export const partnerContracts = sqliteTable('partner_contracts', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  contractType: text('contract_type').notNull(),
  pricingTier: text('pricing_tier').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  monthlyFee: real('monthly_fee').notNull(),
  commissionRate: real('commission_rate').notNull(),
  discountPercent: real('discount_percent').default(0),
  status: text('status').default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  signedAt: integer('signed_at', { mode: 'timestamp' }),
});

export type Referral = typeof referrals.$inferSelect;
export type ReferralBonus = typeof referralBonuses.$inferSelect;
export type ReferralWithdrawal = typeof referralWithdrawals.$inferSelect;
export type PartnerContract = typeof partnerContracts.$inferSelect;


// ==================== ANALYTICS & REPORTS ====================

export const analytics = sqliteTable('analytics', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  metricType: text('metric_type').notNull(),
  value: real('value').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const profitBreakdown = sqliteTable('profit_breakdown', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  orderId: text('order_id').references(() => orders.id),
  revenue: real('revenue').notNull(),
  costs: real('costs').notNull(),
  platformFee: real('platform_fee').notNull(),
  profitShare: real('profit_share').notNull(),
  netProfit: real('net_profit').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const trendingProducts = sqliteTable('trending_products', {
  id: text('id').primaryKey(),
  marketplace: text('marketplace').notNull(),
  category: text('category').notNull(),
  productName: text('product_name').notNull(),
  price: real('price'),
  salesCount: integer('sales_count'),
  rating: real('rating'),
  trendScore: integer('trend_score').notNull(),
  imageUrl: text('image_url'),
  productUrl: text('product_url'),
  analyzedAt: integer('analyzed_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== CHAT & MESSAGING ====================

export const chatRooms = sqliteTable('chat_rooms', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').references(() => partners.id),
  adminId: text('admin_id').references(() => users.id),
  status: text('status').default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  lastMessageAt: integer('last_message_at', { mode: 'timestamp' }),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  chatRoomId: text('chat_room_id').notNull().references(() => chatRooms.id),
  senderId: text('sender_id').notNull().references(() => users.id),
  senderRole: text('sender_role').notNull(),
  content: text('content').notNull(),
  messageType: text('message_type').default('text'),
  attachmentUrl: text('attachment_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  readAt: integer('read_at', { mode: 'timestamp' }),
});

// Alias for compatibility
export const enhancedMessages = messages;

// ==================== TIER & PRICING ====================

export const tierUpgradeRequests = sqliteTable('tier_upgrade_requests', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  currentTier: text('current_tier').notNull(),
  requestedTier: text('requested_tier').notNull(),
  reason: text('reason'),
  status: text('status').default('pending'),
  requestedAt: integer('requested_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
  reviewedBy: text('reviewed_by').references(() => users.id),
});

export const pricingTiers = sqliteTable('pricing_tiers', {
  id: text('id').primaryKey(),
  tier: text('tier').notNull().unique(),
  nameUz: text('name_uz').notNull(),
  fixedCost: text('fixed_cost').notNull(),
  commissionMin: text('commission_min').notNull(),
  commissionMax: text('commission_max').notNull(),
  minRevenue: text('min_revenue').notNull(),
  maxRevenue: text('max_revenue'),
  features: text('features').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const commissionSettings = sqliteTable('commission_settings', {
  id: text('id').primaryKey(),
  tier: text('tier').notNull().unique(),
  baseCommission: text('base_commission').notNull(),
  volumeBonus: text('volume_bonus'),
  performanceBonus: text('performance_bonus'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const sptCosts = sqliteTable('spt_costs', {
  id: text('id').primaryKey(),
  serviceType: text('service_type').notNull(),
  tier: text('tier').notNull(),
  costPerUnit: text('cost_per_unit').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== ADMIN & SYSTEM ====================

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  changes: text('changes'),
  payload: text('payload'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const systemSettings = sqliteTable('system_settings', {
  id: text('id').primaryKey(),
  key: text('key').unique().notNull(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedBy: text('updated_by').references(() => users.id),
});

export const adminPermissions = sqliteTable('admin_permissions', {
  userId: text('user_id').primaryKey().references(() => users.id),
  canManageAdmins: integer('can_manage_admins', { mode: 'boolean' }).notNull().default(false),
  canManageContent: integer('can_manage_content', { mode: 'boolean' }).notNull().default(false),
  canManageChat: integer('can_manage_chat', { mode: 'boolean' }).notNull().default(false),
  canViewReports: integer('can_view_reports', { mode: 'boolean' }).notNull().default(false),
  canReceiveProducts: integer('can_receive_products', { mode: 'boolean' }).notNull().default(false),
  canActivatePartners: integer('can_activate_partners', { mode: 'boolean' }).notNull().default(false),
  canManageIntegrations: integer('can_manage_integrations', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').default('info'),
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== EXCEL & IMPORT ====================

export const excelImports = sqliteTable('excel_imports', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size'),
  rowsImported: integer('rows_imported'),
  status: text('status').default('pending'),
  errorLog: text('error_log'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const excelTemplates = sqliteTable('excel_templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  templateUrl: text('template_url'),
  category: text('category'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== VALIDATION SCHEMAS ====================

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertPartnerSchema = createInsertSchema(partners);
export const selectPartnerSchema = createSelectSchema(partners);

// Partner Registration (userId NOT required)
export const partnerRegistrationSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(9),
  businessName: z.string().min(2),
  businessCategory: z.string().optional(),
  monthlyRevenue: z.string().optional(),
  businessAddress: z.string().optional(),
  inn: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
});

// Product Creation (partnerId NOT required - from session)
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  partnerId: true,
  createdAt: true,
  updatedAt: true,
});

export const selectProductSchema = createSelectSchema(products);

// Fulfillment Request Schema
export const insertFulfillmentRequestSchema = createInsertSchema(fulfillmentRequests).omit({
  id: true,
  partnerId: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

// Login Schema
export const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(1),
}).refine(data => data.username || data.email, {
  message: "Username yoki email talab qilinadi",
});

// ==================== TYPE EXPORTS ====================

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
export type AITask = typeof aiTasks.$inferSelect;
export type AIProductCard = typeof aiProductCards.$inferSelect;
