-- Migration: Forecasting & Business Intelligence System
-- Description: AI/ML asosida savdo prognozlari va biznes tahlillari
-- Created: 2024-11-23

-- Sales Forecasts - Savdo prognozlari
CREATE TABLE IF NOT EXISTS "sales_forecasts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "partner_id" varchar NOT NULL,
  "forecast_period" varchar(20) NOT NULL,
  "forecast_date" timestamp NOT NULL,
  "predicted_revenue" numeric(15, 2) NOT NULL,
  "predicted_profit" numeric(15, 2) NOT NULL,
  "predicted_orders" integer NOT NULL,
  "confidence_level" numeric(5, 2) NOT NULL,
  "marketplace" varchar(50),
  "category" varchar(50),
  "model_version" varchar(50),
  "factors" jsonb,
  "actual_revenue" numeric(15, 2),
  "actual_profit" numeric(15, 2),
  "accuracy_score" numeric(5, 2),
  "created_at" timestamp DEFAULT now()
);

-- Business Insights - Biznes tahlillari va tavsiyalar
CREATE TABLE IF NOT EXISTS "business_insights" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "partner_id" varchar,
  "insight_type" varchar(50) NOT NULL,
  "title" varchar(200) NOT NULL,
  "description" text NOT NULL,
  "priority" varchar(20) DEFAULT 'medium' NOT NULL,
  "impact_score" numeric(5, 2),
  "action_items" jsonb DEFAULT '[]',
  "is_read" boolean DEFAULT false NOT NULL,
  "is_dismissed" boolean DEFAULT false NOT NULL,
  "valid_until" timestamp,
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp DEFAULT now()
);

-- Performance Benchmarks - Ish natijalarini taqqoslash
CREATE TABLE IF NOT EXISTS "performance_benchmarks" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "date" timestamp NOT NULL,
  "category" varchar(50),
  "marketplace" varchar(50),
  "avg_conversion_rate" numeric(5, 2),
  "avg_order_value" numeric(12, 2),
  "avg_profit_margin" numeric(5, 2),
  "top_performer_revenue" numeric(15, 2),
  "industry_avg_revenue" numeric(15, 2),
  "created_at" timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS "IDX_forecast_partner" ON "sales_forecasts" ("partner_id", "forecast_date");
CREATE INDEX IF NOT EXISTS "IDX_insight_partner" ON "business_insights" ("partner_id", "is_read");
CREATE INDEX IF NOT EXISTS "IDX_benchmark_date" ON "performance_benchmarks" ("date", "category");

-- Foreign Keys (for PostgreSQL)
-- ALTER TABLE "sales_forecasts" ADD CONSTRAINT "sales_forecasts_partner_id_fk" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE;
-- ALTER TABLE "business_insights" ADD CONSTRAINT "business_insights_partner_id_fk" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE;
