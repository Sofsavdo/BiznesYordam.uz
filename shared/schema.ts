import { sql, relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  index,
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'partner', 'admin']);
export const marketplaceEnum = pgEnum('marketplace', ['uzum', 'wildberries', 'yandex', 'ozon']);
export const categoryEnum = pgEnum('category', ['electronics', 'clothing', 'home', 'sports', 'beauty']);
export const stockStatusEnum = pgEnum('stock_status', ['in_stock', 'low_stock', 'out_of_stock', 'discontinued']);
export const movementTypeEnum = pgEnum('movement_type', ['inbound', 'outbound', 'transfer', 'adjustment', 'return']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'picking', 'packed', 'shipped', 'delivered', 'cancelled', 'returned']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'refunded', 'failed']);
export const fulfillmentStatusEnum = pgEnum('fulfillment_status', ['pending', 'processing', 'ready', 'shipped', 'completed']);

// Session storage table (required for authentication)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: text("sess").notNull(), // JSON as text
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").notNull().unique(),
  email: varchar("email").unique(),
  password: text("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  role: userRoleEnum("role").notNull().default('customer'),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Admin permissions table (fine-grained)
export const adminPermissions = pgTable("admin_permissions", {
  userId: varchar("user_id").primaryKey().references(() => users.id),
  canManageAdmins: boolean("can_manage_admins").notNull().default(false),
  canManageContent: boolean("can_manage_content").notNull().default(false),
  canManageChat: boolean("can_manage_chat").notNull().default(false),
  canViewReports: boolean("can_view_reports").notNull().default(false),
  canReceiveProducts: boolean("can_receive_products").notNull().default(false),
  canActivatePartners: boolean("can_activate_partners").notNull().default(false),
  canManageIntegrations: boolean("can_manage_integrations").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Audit logs
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(),
  entityType: varchar("entity_type").notNull(),
  entityId: varchar("entity_id"),
  payload: text("payload"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Partners table
export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessName: varchar("business_name"),
  businessCategory: categoryEnum("business_category").notNull(),
  monthlyRevenue: decimal("monthly_revenue"),
  pricingTier: varchar("pricing_tier").notNull().default('starter_pro'),
  commissionRate: decimal("commission_rate").notNull().default('0.25'), // YANGI: 25% savdodan (Starter Pro default)
  isApproved: boolean("is_approved").notNull().default(false),
  approvedAt: timestamp("approved_at"),
  approvedBy: varchar("approved_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Contact forms table
export const contactForms = pgTable("contact_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  businessCategory: varchar("business_category"),
  monthlyRevenue: decimal("monthly_revenue"),
  notes: text("notes"),
  status: varchar("status").notNull().default('new'),
  processedBy: varchar("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Pricing tiers configuration
export const pricingTiers = pgTable("pricing_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tier: varchar("tier").notNull().unique(),
  nameUz: varchar("name_uz").notNull(),
  fixedCost: decimal("fixed_cost").notNull(),
  commissionMin: decimal("commission_min").notNull(),
  commissionMax: decimal("commission_max").notNull(),
  minRevenue: decimal("min_revenue").notNull(),
  maxRevenue: decimal("max_revenue"),
  features: text("features").notNull(), // JSON as text
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Products with inventory tracking
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  name: varchar("name").notNull(),
  category: categoryEnum("category").notNull(),
  description: text("description"),
  price: decimal("price").notNull(),
  costPrice: decimal("cost_price"),
  sku: varchar("sku").unique(),
  barcode: varchar("barcode"),
  weight: decimal("weight"),
  dimensions: text("dimensions"), // JSON as text {length, width, height}
  images: text("images").default('[]'), // JSON array as text
  
  // Inventory Management Fields
  currentStock: integer("current_stock").notNull().default(0),
  reservedStock: integer("reserved_stock").notNull().default(0),
  availableStock: integer("available_stock").notNull().default(0),
  minStockLevel: integer("min_stock_level").default(10),
  maxStockLevel: integer("max_stock_level").default(1000),
  reorderQuantity: integer("reorder_quantity").default(50),
  stockStatus: stockStatusEnum("stock_status").notNull().default('out_of_stock'),
  
  // Additional product info
  manufacturer: varchar("manufacturer"),
  brand: varchar("brand"),
  model: varchar("model"),
  
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
  lastStockUpdate: timestamp("last_stock_update").default(sql`now()`),
});

// Marketplace integrations
export const marketplaceIntegrations = pgTable("marketplace_integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  marketplace: marketplaceEnum("marketplace").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  apiCredentials: text("api_credentials"), // encrypted credentials as JSON text
  lastSync: timestamp("last_sync"),
  syncStatus: varchar("sync_status").default('pending'),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Fulfillment requests
export const fulfillmentRequests = pgTable("fulfillment_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  productId: varchar("product_id").references(() => products.id),
  requestType: varchar("request_type").notNull(), // 'product_preparation', 'logistics', 'marketplace_listing'
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  priority: varchar("priority").notNull().default('medium'),
  status: varchar("status").notNull().default('pending'), // 'pending', 'approved', 'in_progress', 'completed', 'cancelled'
  estimatedCost: decimal("estimated_cost"),
  actualCost: decimal("actual_cost"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  metadata: text("metadata"), // additional request-specific data as JSON text
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Analytics data
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  date: timestamp("date").notNull(),
  revenue: decimal("revenue").notNull().default('0'),
  orders: integer("orders").notNull().default(0),
  profit: decimal("profit").notNull().default('0'),
  commissionPaid: decimal("commission_paid").notNull().default('0'),
  marketplace: marketplaceEnum("marketplace"),
  category: categoryEnum("category"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Notifications system
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // 'order_update', 'fulfillment_status', 'profit_alert', 'trending_product'
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  data: text("data"), // additional data for the notification as JSON text
  isRead: boolean("is_read").notNull().default(false),
  priority: varchar("priority").notNull().default('normal'), // 'low', 'normal', 'high', 'urgent'
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Messages/Chat
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  partner: one(partners, {
    fields: [users.id],
    references: [partners.userId],
  }),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
}));

export const partnersRelations = relations(partners, ({ one, many }) => ({
  user: one(users, {
    fields: [partners.userId],
    references: [users.id],
  }),
  products: many(products),
  fulfillmentRequests: many(fulfillmentRequests),
  marketplaceIntegrations: many(marketplaceIntegrations),
  analytics: many(analytics),
  approver: one(users, {
    fields: [partners.approvedBy],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  partner: one(partners, {
    fields: [products.partnerId],
    references: [partners.id],
  }),
  fulfillmentRequests: many(fulfillmentRequests),
}));

export const fulfillmentRequestsRelations = relations(fulfillmentRequests, ({ one }) => ({
  partner: one(partners, {
    fields: [fulfillmentRequests.partnerId],
    references: [partners.id],
  }),
  product: one(products, {
    fields: [fulfillmentRequests.productId],
    references: [products.id],
  }),
  assignee: one(users, {
    fields: [fulfillmentRequests.assignedTo],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  fromUser: one(users, {
    fields: [messages.fromUserId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  toUser: one(users, {
    fields: [messages.toUserId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
  approvedBy: true,
});

export const insertProductSchema = createInsertSchema(products, {
  price: z.string().min(1, "Narx kiritilishi shart"),
  costPrice: z.string().optional(),
  weight: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFulfillmentRequestSchema = createInsertSchema(fulfillmentRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username kiritilishi shart"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

export const partnerRegistrationSchema = insertPartnerSchema.extend({
  firstName: z.string().min(1, "Ism kiritilishi shart"),
  lastName: z.string().min(1, "Familiya kiritilishi shart"),
  email: z.string().email("Email manzil noto'g'ri"),
  phone: z.string().min(9, "Telefon raqam noto'g'ri"),
  username: z.string().min(3, "Username kamida 3 ta belgidan iborat bo'lishi kerak"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  businessName: z.string().min(1, "Biznes nomi kiritilishi shart"),
  businessCategory: z.enum(['electronics', 'clothing', 'home', 'sports', 'beauty']),
  monthlyRevenue: z.string().min(1, "Oylik aylanma kiritilishi shart"),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type FulfillmentRequest = typeof fulfillmentRequests.$inferSelect;
export type InsertFulfillmentRequest = z.infer<typeof insertFulfillmentRequestSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type PricingTier = typeof pricingTiers.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type PartnerRegistrationData = z.infer<typeof partnerRegistrationSchema>;

// Additional tables that might be referenced
export const tierUpgradeRequests = pgTable("tier_upgrade_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  currentTier: varchar("current_tier").notNull(),
  requestedTier: varchar("requested_tier").notNull(),
  reason: text("reason"),
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected
  requestedAt: timestamp("requested_at").default(sql`now()`),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").default(sql`now()`),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
});

export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: varchar("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  settingType: varchar("setting_type").notNull().default('string'), // string, number, boolean, json
  category: varchar("category").notNull(), // commission, spt, general, marketplace
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertTierUpgradeRequestSchema = createInsertSchema(tierUpgradeRequests).omit({
  id: true,
  requestedAt: true,
  reviewedAt: true,
  createdAt: true,
  approvedAt: true,
  rejectedAt: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type TierUpgradeRequest = typeof tierUpgradeRequests.$inferSelect;
export type InsertTierUpgradeRequest = z.infer<typeof insertTierUpgradeRequestSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;

// Add other tables needed by storage
export const sptCosts = pgTable("spt_costs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productCategory: categoryEnum("product_category"),
  weightRangeMin: decimal("weight_range_min").default('0'),
  weightRangeMax: decimal("weight_range_max"),
  dimensionCategory: varchar("dimension_category"), // small, medium, large, extra_large
  costPerUnit: decimal("cost_per_unit").notNull(),
  marketplace: marketplaceEnum("marketplace"),
  isActive: boolean("is_active").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const commissionSettings = pgTable("commission_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").references(() => partners.id),
  category: categoryEnum("category"),
  marketplace: marketplaceEnum("marketplace"),
  commissionRate: decimal("commission_rate").notNull(),
  minOrderValue: decimal("min_order_value"),
  maxOrderValue: decimal("max_order_value"),
  isActive: boolean("is_active").notNull().default(true),
  validFrom: timestamp("valid_from").default(sql`now()`),
  validTo: timestamp("valid_to"),
  notes: text("notes"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const chatRooms = pgTable("chat_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name"),
  type: varchar("type").notNull().default('direct'), // direct, group
  participants: text("participants").notNull(), // JSON array of user IDs as text
  lastMessageAt: timestamp("last_message_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const enhancedMessages = pgTable("enhanced_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatRoomId: varchar("chat_room_id").notNull().references(() => chatRooms.id),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  messageType: varchar("message_type").notNull().default('text'), // text, file, image
  content: text("content").notNull(),
  fileUrl: varchar("file_url"),
  fileName: varchar("file_name"),
  fileSize: integer("file_size"),
  isRead: boolean("is_read").notNull().default(false),
  readBy: text("read_by").default('[]'), // JSON array of user IDs as text
  isEdited: boolean("is_edited").notNull().default(false),
  editedAt: timestamp("edited_at"),
  replyToMessageId: varchar("reply_to_message_id"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const marketplaceApiConfigs = pgTable("marketplace_api_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  marketplace: marketplaceEnum("marketplace").notNull(),
  apiKey: varchar("api_key"),
  apiSecret: varchar("api_secret"),
  shopId: varchar("shop_id"),
  additionalData: text("additional_data"), // JSON as text
  status: varchar("status").notNull().default('disconnected'), // connected, disconnected, error
  lastSync: timestamp("last_sync"),
  syncErrors: text("sync_errors"), // JSON as text
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const excelImports = pgTable("excel_imports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  marketplace: marketplaceEnum("marketplace").notNull(),
  fileName: varchar("file_name").notNull(),
  fileSize: integer("file_size"),
  importType: varchar("import_type").notNull(),
  status: varchar("status").default('processing'),
  recordsProcessed: integer("records_processed").default(0),
  recordsTotal: integer("records_total").default(0),
  errorCount: integer("error_count").default(0),
  successCount: integer("success_count").default(0),
  errorDetails: text("error_details").default('[]'),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const excelTemplates = pgTable("excel_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  marketplace: marketplaceEnum("marketplace").notNull(),
  templateType: varchar("template_type").notNull(),
  columns: text("columns").notNull(), // JSON as text
  requiredColumns: text("required_columns").notNull(), // JSON as text
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertSptCostSchema = createInsertSchema(sptCosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommissionSettingSchema = createInsertSchema(commissionSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnhancedMessageSchema = createInsertSchema(enhancedMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketplaceApiConfigSchema = createInsertSchema(marketplaceApiConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExcelImportSchema = createInsertSchema(excelImports).omit({
  id: true,
  createdAt: true,
});

export const insertExcelTemplateSchema = createInsertSchema(excelTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SptCost = typeof sptCosts.$inferSelect;
export type InsertSptCost = z.infer<typeof insertSptCostSchema>;
export type CommissionSetting = typeof commissionSettings.$inferSelect;
export type InsertCommissionSetting = z.infer<typeof insertCommissionSettingSchema>;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;
export type EnhancedMessage = typeof enhancedMessages.$inferSelect;
export type InsertEnhancedMessage = z.infer<typeof insertEnhancedMessageSchema>;
export type MarketplaceApiConfig = typeof marketplaceApiConfigs.$inferSelect;
export type InsertMarketplaceApiConfig = z.infer<typeof insertMarketplaceApiConfigSchema>;
export type ExcelImport = typeof excelImports.$inferSelect;
export type InsertExcelImport = z.infer<typeof insertExcelImportSchema>;
export type ExcelTemplate = typeof excelTemplates.$inferSelect;
export type InsertExcelTemplate = z.infer<typeof insertExcelTemplateSchema>;

// Additional tables from database
export const profitBreakdown = pgTable("profit_breakdown", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  date: timestamp("date").notNull(),
  marketplace: marketplaceEnum("marketplace").notNull(),
  category: categoryEnum("category").notNull().default('electronics'),
  totalRevenue: varchar("total_revenue").default('0'),
  fulfillmentCosts: varchar("fulfillment_costs").default('0'),
  marketplaceCommission: varchar("marketplace_commission").default('0'),
  productCosts: varchar("product_costs").default('0'),
  taxCosts: varchar("tax_costs").default('0'),
  logisticsCosts: varchar("logistics_costs").default('0'),
  sptCosts: varchar("spt_costs").default('0'),
  netProfit: varchar("net_profit").default('0'),
  profitMargin: varchar("profit_margin").default('0'),
  ordersCount: integer("orders_count").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const trendingProducts = pgTable("trending_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productName: varchar("product_name").notNull(),
  category: categoryEnum("category").notNull(),
  description: text("description"),
  sourceMarket: varchar("source_market").notNull(), // amazon, aliexpress, shopify, ebay
  sourceUrl: varchar("source_url"),
  currentPrice: varchar("current_price"),
  estimatedCostPrice: varchar("estimated_cost_price"),
  estimatedSalePrice: varchar("estimated_sale_price"),
  profitPotential: varchar("profit_potential"),
  searchVolume: integer("search_volume"),
  trendScore: integer("trend_score").default(0),
  competitionLevel: varchar("competition_level").default('medium'), // low, medium, high
  keywords: text("keywords").default('[]'), // JSON array as text
  images: text("images").default('[]'), // JSON array as text
  isActive: boolean("is_active").default(true),
  scannedAt: timestamp("scanned_at").default(sql`now()`),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export type ProfitBreakdown = typeof profitBreakdown.$inferSelect;
export type TrendingProduct = typeof trendingProducts.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type AdminPermission = typeof adminPermissions.$inferSelect;

// ==================== INVENTORY MANAGEMENT SYSTEM ====================

// Warehouses
export const warehouses = pgTable("warehouses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  code: varchar("code").notNull().unique(),
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  region: varchar("region"),
  capacity: integer("capacity").notNull().default(10000),
  currentUtilization: decimal("current_utilization").default('0'),
  isActive: boolean("is_active").notNull().default(true),
  managerId: varchar("manager_id").references(() => users.id),
  contactPhone: varchar("contact_phone"),
  operatingHours: text("operating_hours"), // JSON
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Warehouse Stock (product quantities per warehouse)
export const warehouseStock = pgTable("warehouse_stock", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  warehouseId: varchar("warehouse_id").notNull().references(() => warehouses.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(0),
  reservedQuantity: integer("reserved_quantity").notNull().default(0),
  availableQuantity: integer("available_quantity").notNull().default(0),
  location: varchar("location"), // e.g., "A-12-3" (aisle-rack-shelf)
  lastCounted: timestamp("last_counted"),
  lastMovement: timestamp("last_movement").default(sql`now()`),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Stock Movements (complete audit trail)
export const stockMovements = pgTable("stock_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  warehouseId: varchar("warehouse_id").notNull().references(() => warehouses.id),
  movementType: movementTypeEnum("movement_type").notNull(),
  quantity: integer("quantity").notNull(),
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  reason: varchar("reason").notNull(),
  referenceType: varchar("reference_type"), // 'purchase_order', 'sale_order', 'transfer', 'adjustment'
  referenceId: varchar("reference_id"),
  performedBy: varchar("performed_by").notNull().references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Orders (complete order management)
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number").notNull().unique(),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  customerId: varchar("customer_id"),
  customerName: varchar("customer_name"),
  customerPhone: varchar("customer_phone"),
  customerEmail: varchar("customer_email"),
  
  // Marketplace info
  marketplace: marketplaceEnum("marketplace").notNull(),
  marketplaceOrderId: varchar("marketplace_order_id"),
  
  // Status tracking
  orderDate: timestamp("order_date").notNull().default(sql`now()`),
  status: orderStatusEnum("status").notNull().default('pending'),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default('pending'),
  fulfillmentStatus: fulfillmentStatusEnum("fulfillment_status").notNull().default('pending'),
  
  // Financial
  subtotal: decimal("subtotal").notNull().default('0'),
  shippingCost: decimal("shipping_cost").default('0'),
  tax: decimal("tax").default('0'),
  marketplaceCommission: decimal("marketplace_commission").default('0'),
  fulfillmentFee: decimal("fulfillment_fee").default('0'),
  totalAmount: decimal("total_amount").notNull().default('0'),
  
  // Shipping
  shippingAddress: text("shipping_address"), // JSON
  shippingMethod: varchar("shipping_method"),
  trackingNumber: varchar("tracking_number"),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  
  // Warehouse operations
  warehouseId: varchar("warehouse_id").references(() => warehouses.id),
  pickedBy: varchar("picked_by").references(() => users.id),
  packedBy: varchar("packed_by").references(() => users.id),
  pickedAt: timestamp("picked_at"),
  packedAt: timestamp("packed_at"),
  shippedAt: timestamp("shipped_at"),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  productName: varchar("product_name").notNull(),
  sku: varchar("sku"),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price").notNull(),
  discount: decimal("discount").default('0'),
  tax: decimal("tax").default('0'),
  totalPrice: decimal("total_price").notNull(),
  status: varchar("status").default('pending'), // 'pending', 'picked', 'packed', 'shipped'
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Customers (end customers who buy from marketplaces)
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email"),
  phone: varchar("phone").notNull(),
  
  // Purchase history
  totalOrders: integer("total_orders").default(0),
  totalSpent: decimal("total_spent").default('0'),
  averageOrderValue: decimal("average_order_value").default('0'),
  lastOrderDate: timestamp("last_order_date"),
  
  // Segmentation
  customerSegment: varchar("customer_segment").default('new'), // 'new', 'regular', 'vip', 'at_risk'
  lifetimeValue: decimal("lifetime_value").default('0'),
  
  // Addresses
  defaultShippingAddress: text("default_shipping_address"), // JSON
  billingAddress: text("billing_address"), // JSON
  
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Stock Alerts
export const stockAlerts = pgTable("stock_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  alertType: varchar("alert_type").notNull(), // 'low_stock', 'out_of_stock', 'overstock', 'expiry_warning'
  severity: varchar("severity").notNull().default('medium'), // 'low', 'medium', 'high', 'critical'
  message: text("message").notNull(),
  currentStock: integer("current_stock"),
  threshold: integer("threshold"),
  isResolved: boolean("is_resolved").notNull().default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Inventory Reports
export const inventoryReports = pgTable("inventory_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportType: varchar("report_type").notNull(), // 'valuation', 'movement', 'turnover', 'accuracy'
  partnerId: varchar("partner_id").references(() => partners.id),
  warehouseId: varchar("warehouse_id").references(() => warehouses.id),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  reportData: text("report_data").notNull(), // JSON with report metrics
  generatedBy: varchar("generated_by").notNull().references(() => users.id),
  fileUrl: varchar("file_url"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Zod schemas for new tables
export const insertWarehouseSchema = createInsertSchema(warehouses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWarehouseStockSchema = createInsertSchema(warehouseStock).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStockAlertSchema = createInsertSchema(stockAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertInventoryReportSchema = createInsertSchema(inventoryReports).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type Warehouse = typeof warehouses.$inferSelect;
export type InsertWarehouse = z.infer<typeof insertWarehouseSchema>;
export type WarehouseStock = typeof warehouseStock.$inferSelect;
export type InsertWarehouseStock = z.infer<typeof insertWarehouseStockSchema>;
export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type StockAlert = typeof stockAlerts.$inferSelect;
export type InsertStockAlert = z.infer<typeof insertStockAlertSchema>;
export type InventoryReport = typeof inventoryReports.$inferSelect;
export type InsertInventoryReport = z.infer<typeof insertInventoryReportSchema>;