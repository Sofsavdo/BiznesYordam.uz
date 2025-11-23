-- Migration: Inventory Tracking System
-- Description: Har bir tovar birligini real-time kuzatish tizimi
-- Created: 2024-11-23

-- Inventory Items - Har bir tovar birligi
CREATE TABLE IF NOT EXISTS "inventory_items" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" varchar NOT NULL,
  "partner_id" varchar NOT NULL,
  "unique_code" varchar(100) UNIQUE NOT NULL,
  "batch_number" varchar(50),
  "location_type" varchar(50) NOT NULL DEFAULT 'warehouse',
  "current_location" varchar(200),
  "marketplace" varchar(50),
  "warehouse_zone" varchar(50),
  "shelf_number" varchar(50),
  "status" varchar(50) DEFAULT 'available' NOT NULL,
  "purchase_price" numeric(12, 2) NOT NULL,
  "sale_price" numeric(12, 2),
  "investor_id" varchar,
  "purchase_date" timestamp NOT NULL,
  "sold_date" timestamp,
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Inventory Movements - Har bir harakatni kuzatish
CREATE TABLE IF NOT EXISTS "inventory_movements" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "inventory_item_id" varchar NOT NULL,
  "from_location" varchar(200),
  "to_location" varchar(200) NOT NULL,
  "movement_type" varchar(50) NOT NULL,
  "quantity" integer DEFAULT 1 NOT NULL,
  "performed_by" varchar NOT NULL,
  "notes" text,
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp DEFAULT now()
);

-- Warehouse Zones - Ombor zonalari
CREATE TABLE IF NOT EXISTS "warehouse_zones" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(100) NOT NULL,
  "code" varchar(20) UNIQUE NOT NULL,
  "capacity" integer NOT NULL,
  "current_occupancy" integer DEFAULT 0,
  "zone_type" varchar(50),
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS "IDX_inventory_partner" ON "inventory_items" ("partner_id");
CREATE INDEX IF NOT EXISTS "IDX_inventory_location" ON "inventory_items" ("location_type", "status");
CREATE INDEX IF NOT EXISTS "IDX_inventory_code" ON "inventory_items" ("unique_code");
CREATE INDEX IF NOT EXISTS "IDX_inventory_movement" ON "inventory_movements" ("inventory_item_id");

-- Foreign Keys (for PostgreSQL)
-- ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;
-- ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_partner_id_fk" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE;
-- ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_item_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE;
-- ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_user_id_fk" FOREIGN KEY ("performed_by") REFERENCES "users"("id");
