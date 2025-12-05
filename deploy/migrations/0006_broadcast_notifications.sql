-- Migration: Enhanced Notifications & Broadcast System
-- Description: To'liq bildirishnomalar va ommaviy xabarlar tizimi
-- Created: 2024-11-23

-- Broadcast Messages - Barcha hamkorlarga xabar
CREATE TABLE IF NOT EXISTS "broadcast_messages" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "sender_id" varchar NOT NULL,
  "title" varchar(200) NOT NULL,
  "content" text NOT NULL,
  "target_audience" varchar(50) NOT NULL,
  "target_tiers" jsonb DEFAULT '[]',
  "target_partners" jsonb DEFAULT '[]',
  "channel" varchar(20) DEFAULT 'in_app' NOT NULL,
  "priority" varchar(20) DEFAULT 'normal' NOT NULL,
  "scheduled_at" timestamp,
  "sent_at" timestamp,
  "status" varchar(50) DEFAULT 'draft' NOT NULL,
  "recipients_count" integer DEFAULT 0,
  "read_count" integer DEFAULT 0,
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp DEFAULT now()
);

-- Notification Templates - Bildirishnoma shablonlari
CREATE TABLE IF NOT EXISTS "notification_templates" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(100) NOT NULL,
  "template_type" varchar(50) NOT NULL,
  "subject" varchar(200),
  "body_template" text NOT NULL,
  "variables" jsonb DEFAULT '[]',
  "channel" varchar(20) NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS "IDX_broadcast_status" ON "broadcast_messages" ("status", "scheduled_at");
CREATE INDEX IF NOT EXISTS "IDX_broadcast_sender" ON "broadcast_messages" ("sender_id");
CREATE INDEX IF NOT EXISTS "IDX_notification_template_type" ON "notification_templates" ("template_type", "is_active");

-- Foreign Keys (for PostgreSQL)
-- ALTER TABLE "broadcast_messages" ADD CONSTRAINT "broadcast_messages_sender_id_fk" FOREIGN KEY ("sender_id") REFERENCES "users"("id");
