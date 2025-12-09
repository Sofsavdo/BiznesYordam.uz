// SQLite-Compatible Schema for BiznesYordam
import { sql, relations } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  real
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').unique(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  role: text('role').notNull().default('customer'), // 'customer', 'partner', 'admin'
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Partners table
export const partners = sqliteTable('partners', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id),
  businessName: text('business_name').notNull(),
  businessAddress: text('business_address'),
  businessCategory: text('business_category'), // 'electronics', 'clothing', etc.
  inn: text('inn').unique(),
  phone: text('phone').notNull(),
  website: text('website'),
  monthlyRevenue: text('monthly_revenue'), // stored as text for flexibility
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

// Products table
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  name: text('name').notNull(),
  sku: text('sku').unique(),
  description: text('description'),
  category: text('category'),
  brand: text('brand'),
  price: real('price').notNull(),
  costPrice: real('cost_price'),
  stockQuantity: integer('stock_quantity').default(0),
  lowStockThreshold: integer('low_stock_threshold').default(10),
  optimizedTitle: text('optimized_title'), // AI-generated
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// Orders table
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

// Audit Logs
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

// AI Tables
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

// Analytics
export const analytics = sqliteTable('analytics', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(() => partners.id),
  metricType: text('metric_type').notNull(),
  value: real('value').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Validation Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertPartnerSchema = createInsertSchema(partners);
export const selectPartnerSchema = createSelectSchema(partners);

// FIXED: Partner Registration Schema (userId NOT required)
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

// FIXED: Product Creation Schema (partnerId NOT required - from session)
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  partnerId: true, // Will be added from session
  createdAt: true,
  updatedAt: true,
});

export const selectProductSchema = createSelectSchema(products);

// Login schema
export const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(1),
}).refine(data => data.username || data.email, {
  message: "Username yoki email talab qilinadi",
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
