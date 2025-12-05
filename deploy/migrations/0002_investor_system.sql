-- Migration: Investor System
-- Description: Investor kapitali va shaffoflik tizimi
-- Created: 2024-11-23

-- Investors - Investorlar
CREATE TABLE IF NOT EXISTS "investors" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar NOT NULL,
  "investor_type" varchar(50) DEFAULT 'individual' NOT NULL,
  "total_invested" numeric(15, 2) DEFAULT '0' NOT NULL,
  "total_profit" numeric(15, 2) DEFAULT '0' NOT NULL,
  "current_balance" numeric(15, 2) DEFAULT '0' NOT NULL,
  "risk_level" varchar(20) DEFAULT 'medium',
  "preferred_categories" jsonb DEFAULT '[]',
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Investment Transactions - Investitsiya tranzaksiyalari
CREATE TABLE IF NOT EXISTS "investment_transactions" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "investor_id" varchar NOT NULL,
  "transaction_type" varchar(50) NOT NULL,
  "amount" numeric(15, 2) NOT NULL,
  "related_product_id" varchar,
  "related_inventory_id" varchar,
  "description" text,
  "status" varchar(50) DEFAULT 'completed' NOT NULL,
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp DEFAULT now()
);

-- Investor Dashboard Stats - Real-time statistika
CREATE TABLE IF NOT EXISTS "investor_stats" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "investor_id" varchar NOT NULL,
  "date" timestamp NOT NULL,
  "total_items" integer DEFAULT 0,
  "items_in_warehouse" integer DEFAULT 0,
  "items_in_marketplace" integer DEFAULT 0,
  "items_sold" integer DEFAULT 0,
  "daily_revenue" numeric(15, 2) DEFAULT '0',
  "daily_profit" numeric(15, 2) DEFAULT '0',
  "roi_percentage" numeric(5, 2) DEFAULT '0',
  "created_at" timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS "IDX_investor_user" ON "investors" ("user_id");
CREATE INDEX IF NOT EXISTS "IDX_investment_investor" ON "investment_transactions" ("investor_id");
CREATE INDEX IF NOT EXISTS "IDX_investor_stats_date" ON "investor_stats" ("investor_id", "date");

-- Foreign Keys (for PostgreSQL)
-- ALTER TABLE "investors" ADD CONSTRAINT "investors_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
-- ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_investor_id_fk" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE;
-- ALTER TABLE "investor_stats" ADD CONSTRAINT "investor_stats_investor_id_fk" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE CASCADE;
