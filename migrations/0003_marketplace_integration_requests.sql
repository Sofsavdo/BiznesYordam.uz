-- Migration: Marketplace Integration Requests (Gibrid System)
-- Description: Hamkor so'rovi + Admin tasdiq tizimi
-- Created: 2024-11-23

-- Integration Requests - Ulanish so'rovlari
CREATE TABLE IF NOT EXISTS "marketplace_integration_requests" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "partner_id" varchar NOT NULL,
  "marketplace" varchar(50) NOT NULL,
  "request_type" varchar(50) DEFAULT 'new' NOT NULL,
  "status" varchar(50) DEFAULT 'pending' NOT NULL,
  "api_key" varchar(500),
  "api_secret" varchar(500),
  "shop_id" varchar(100),
  "shop_name" varchar(200),
  "additional_credentials" jsonb DEFAULT '{}',
  "test_results" jsonb,
  "submitted_at" timestamp DEFAULT now(),
  "reviewed_at" timestamp,
  "reviewed_by" varchar,
  "admin_notes" text,
  "rejection_reason" text,
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Marketplace Sync History - Sinxronizatsiya tarixi
CREATE TABLE IF NOT EXISTS "marketplace_sync_history" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "integration_id" varchar NOT NULL,
  "sync_type" varchar(50) NOT NULL,
  "status" varchar(50) NOT NULL,
  "records_synced" integer DEFAULT 0,
  "errors" jsonb DEFAULT '[]',
  "started_at" timestamp NOT NULL,
  "completed_at" timestamp,
  "metadata" jsonb DEFAULT '{}'
);

-- Indexes
CREATE INDEX IF NOT EXISTS "IDX_integration_request_partner" ON "marketplace_integration_requests" ("partner_id", "status");
CREATE INDEX IF NOT EXISTS "IDX_sync_history_integration" ON "marketplace_sync_history" ("integration_id");

-- Foreign Keys (for PostgreSQL)
-- ALTER TABLE "marketplace_integration_requests" ADD CONSTRAINT "marketplace_integration_requests_partner_id_fk" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE;
-- ALTER TABLE "marketplace_integration_requests" ADD CONSTRAINT "marketplace_integration_requests_reviewed_by_fk" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id");
-- ALTER TABLE "marketplace_sync_history" ADD CONSTRAINT "marketplace_sync_history_integration_id_fk" FOREIGN KEY ("integration_id") REFERENCES "marketplace_integrations"("id") ON DELETE CASCADE;
