-- Migration: Subscriptions & Add-on Services
-- Description: Tarif obunalari va qo'shimcha xizmatlar tizimi (chegirma bilan)
-- Created: 2024-11-23

-- Add-on Services - Qo'shimcha xizmatlar
CREATE TABLE IF NOT EXISTS "addon_services" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(100) NOT NULL,
  "name_uz" varchar(100) NOT NULL,
  "name_ru" varchar(100),
  "name_en" varchar(100),
  "description" text,
  "category" varchar(50) NOT NULL,
  "base_price_monthly" numeric(12, 2) NOT NULL,
  "base_price_quarterly" numeric(12, 2),
  "base_price_yearly" numeric(12, 2),
  "discount_3months" numeric(5, 2) DEFAULT '5',
  "discount_6months" numeric(5, 2) DEFAULT '10',
  "discount_yearly" numeric(5, 2) DEFAULT '20',
  "features" jsonb NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "min_tier_required" varchar(50),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Partner Subscriptions - Hamkor obunalari
CREATE TABLE IF NOT EXISTS "partner_subscriptions" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "partner_id" varchar NOT NULL,
  "subscription_type" varchar(50) NOT NULL,
  "item_id" varchar NOT NULL,
  "billing_period" varchar(20) NOT NULL,
  "start_date" timestamp NOT NULL,
  "end_date" timestamp NOT NULL,
  "auto_renew" boolean DEFAULT true NOT NULL,
  "status" varchar(50) DEFAULT 'active' NOT NULL,
  "amount" numeric(12, 2) NOT NULL,
  "discount_applied" numeric(12, 2) DEFAULT '0',
  "next_billing_date" timestamp,
  "cancelled_at" timestamp,
  "cancellation_reason" text,
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Subscription Payments - Obuna to'lovlari
CREATE TABLE IF NOT EXISTS "subscription_payments" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "subscription_id" varchar NOT NULL,
  "partner_id" varchar NOT NULL,
  "amount" numeric(12, 2) NOT NULL,
  "payment_method" varchar(50),
  "status" varchar(50) DEFAULT 'pending' NOT NULL,
  "payment_date" timestamp,
  "billing_period_start" timestamp NOT NULL,
  "billing_period_end" timestamp NOT NULL,
  "invoice_number" varchar(50),
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS "IDX_subscription_partner" ON "partner_subscriptions" ("partner_id", "status");
CREATE INDEX IF NOT EXISTS "IDX_payment_subscription" ON "subscription_payments" ("subscription_id");
CREATE INDEX IF NOT EXISTS "IDX_addon_category" ON "addon_services" ("category", "is_active");

-- Foreign Keys (for PostgreSQL)
-- ALTER TABLE "partner_subscriptions" ADD CONSTRAINT "partner_subscriptions_partner_id_fk" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE;
-- ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "partner_subscriptions"("id") ON DELETE CASCADE;
-- ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_partner_id_fk" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE;
