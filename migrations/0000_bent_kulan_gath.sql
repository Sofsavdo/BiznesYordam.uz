CREATE TYPE "public"."fulfillment_status" AS ENUM('pending', 'approved', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."marketplace" AS ENUM('uzum', 'wildberries', 'yandex', 'ozon');--> statement-breakpoint
CREATE TYPE "public"."pricing_tier" AS ENUM('starter_pro', 'business_standard', 'professional_plus', 'enterprise_elite');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('electronics', 'clothing', 'home', 'sports', 'beauty');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'partner', 'customer');--> statement-breakpoint
CREATE TABLE "admin_permissions" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"can_manage_admins" boolean DEFAULT false NOT NULL,
	"can_manage_content" boolean DEFAULT false NOT NULL,
	"can_manage_chat" boolean DEFAULT false NOT NULL,
	"can_view_reports" boolean DEFAULT false NOT NULL,
	"can_receive_products" boolean DEFAULT false NOT NULL,
	"can_activate_partners" boolean DEFAULT false NOT NULL,
	"can_manage_integrations" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "analytics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"revenue" numeric(15, 2) DEFAULT '0' NOT NULL,
	"orders" integer DEFAULT 0 NOT NULL,
	"profit" numeric(15, 2) DEFAULT '0' NOT NULL,
	"commission_paid" numeric(15, 2) DEFAULT '0' NOT NULL,
	"marketplace" "marketplace",
	"category" "product_category",
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" varchar(100),
	"payload" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_rooms" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200),
	"type" varchar(20) DEFAULT 'direct' NOT NULL,
	"participants" jsonb NOT NULL,
	"last_message_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "commission_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar,
	"category" "product_category",
	"marketplace" "marketplace",
	"commission_rate" numeric(5, 4) NOT NULL,
	"min_order_value" numeric(12, 2),
	"max_order_value" numeric(12, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"valid_from" timestamp DEFAULT now(),
	"valid_to" timestamp,
	"notes" text,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "enhanced_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_room_id" varchar NOT NULL,
	"from_user_id" varchar NOT NULL,
	"message_type" varchar(20) DEFAULT 'text' NOT NULL,
	"content" text NOT NULL,
	"file_url" varchar(500),
	"file_name" varchar(200),
	"file_size" integer,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_by" jsonb DEFAULT '[]',
	"is_edited" boolean DEFAULT false NOT NULL,
	"edited_at" timestamp,
	"reply_to_message_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "excel_imports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"marketplace" "marketplace" NOT NULL,
	"file_name" varchar(200) NOT NULL,
	"file_size" integer,
	"import_type" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'processing' NOT NULL,
	"records_processed" integer DEFAULT 0,
	"records_total" integer DEFAULT 0,
	"error_count" integer DEFAULT 0,
	"success_count" integer DEFAULT 0,
	"error_details" jsonb DEFAULT '[]',
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "excel_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"marketplace" "marketplace",
	"template_type" varchar(50) NOT NULL,
	"columns" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fulfillment_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"product_id" varchar,
	"request_type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"priority" varchar(20) DEFAULT 'medium' NOT NULL,
	"status" "fulfillment_status" DEFAULT 'pending' NOT NULL,
	"estimated_cost" numeric(12, 2),
	"actual_cost" numeric(12, 2),
	"assigned_to" varchar,
	"due_date" timestamp,
	"completed_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "marketplace_api_configs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"marketplace" "marketplace" NOT NULL,
	"api_key" varchar(500),
	"api_secret" varchar(500),
	"shop_id" varchar(100),
	"additional_data" jsonb,
	"status" varchar(50) DEFAULT 'disconnected' NOT NULL,
	"last_sync" timestamp,
	"sync_errors" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "marketplace_integrations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"marketplace" "marketplace" NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"api_credentials" jsonb,
	"last_sync" timestamp,
	"sync_status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_user_id" varchar NOT NULL,
	"to_user_id" varchar NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"priority" varchar(20) DEFAULT 'normal' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"business_name" varchar(200),
	"business_category" "product_category" NOT NULL,
	"monthly_revenue" numeric(15, 2),
	"pricing_tier" "pricing_tier" DEFAULT 'starter_pro' NOT NULL,
	"commission_rate" numeric(5, 4) DEFAULT '0.30' NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"approved_at" timestamp,
	"approved_by" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricing_tiers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" "pricing_tier" NOT NULL,
	"name_uz" varchar(100) NOT NULL,
	"fixed_cost" numeric(15, 2) NOT NULL,
	"commission_min" numeric(5, 4) NOT NULL,
	"commission_max" numeric(5, 4) NOT NULL,
	"min_revenue" numeric(15, 2) NOT NULL,
	"max_revenue" numeric(15, 2),
	"features" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pricing_tiers_tier_unique" UNIQUE("tier")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"name" varchar(200) NOT NULL,
	"category" "product_category" NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"cost_price" numeric(12, 2),
	"sku" varchar(100),
	"barcode" varchar(100),
	"weight" numeric(8, 3),
	"dimensions" jsonb,
	"images" jsonb DEFAULT '[]',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profit_breakdown" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"marketplace" "marketplace" NOT NULL,
	"total_revenue" numeric(15, 2) DEFAULT '0' NOT NULL,
	"fulfillment_costs" numeric(15, 2) DEFAULT '0' NOT NULL,
	"marketplace_commission" numeric(15, 2) DEFAULT '0' NOT NULL,
	"platform_commission" numeric(15, 2) DEFAULT '0' NOT NULL,
	"product_costs" numeric(15, 2) DEFAULT '0' NOT NULL,
	"net_profit" numeric(15, 2) DEFAULT '0' NOT NULL,
	"profit_margin" numeric(5, 2) DEFAULT '0' NOT NULL,
	"orders_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spt_costs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_category" "product_category",
	"weight_range_min" numeric(8, 3) DEFAULT '0',
	"weight_range_max" numeric(8, 3),
	"dimension_category" varchar(50),
	"cost_per_unit" numeric(10, 2) NOT NULL,
	"marketplace" "marketplace",
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"setting_key" varchar(100) NOT NULL,
	"setting_value" text NOT NULL,
	"setting_type" varchar(50) DEFAULT 'string' NOT NULL,
	"category" varchar(50) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "tier_upgrade_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" varchar NOT NULL,
	"current_tier" "pricing_tier" NOT NULL,
	"requested_tier" "pricing_tier" NOT NULL,
	"reason" text,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"requested_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"reviewed_by" varchar,
	"admin_notes" text
);
--> statement-breakpoint
CREATE TABLE "trending_products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_name" varchar(200) NOT NULL,
	"category" "product_category" NOT NULL,
	"description" text,
	"source_market" varchar(50) NOT NULL,
	"source_url" varchar(500),
	"current_price" numeric(12, 2),
	"estimated_cost_price" numeric(12, 2),
	"estimated_sale_price" numeric(12, 2),
	"profit_potential" numeric(12, 2),
	"search_volume" integer,
	"trend_score" integer DEFAULT 0 NOT NULL,
	"competition_level" varchar(20) DEFAULT 'medium',
	"seasonality" jsonb,
	"keywords" jsonb DEFAULT '[]',
	"images" jsonb DEFAULT '[]',
	"is_active" boolean DEFAULT true NOT NULL,
	"scanned_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255),
	"password" text NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(20),
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_settings" ADD CONSTRAINT "commission_settings_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_settings" ADD CONSTRAINT "commission_settings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enhanced_messages" ADD CONSTRAINT "enhanced_messages_chat_room_id_chat_rooms_id_fk" FOREIGN KEY ("chat_room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enhanced_messages" ADD CONSTRAINT "enhanced_messages_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "excel_imports" ADD CONSTRAINT "excel_imports_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "excel_templates" ADD CONSTRAINT "excel_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment_requests" ADD CONSTRAINT "fulfillment_requests_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment_requests" ADD CONSTRAINT "fulfillment_requests_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fulfillment_requests" ADD CONSTRAINT "fulfillment_requests_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_api_configs" ADD CONSTRAINT "marketplace_api_configs_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_integrations" ADD CONSTRAINT "marketplace_integrations_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profit_breakdown" ADD CONSTRAINT "profit_breakdown_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_upgrade_requests" ADD CONSTRAINT "tier_upgrade_requests_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_upgrade_requests" ADD CONSTRAINT "tier_upgrade_requests_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_comm_partner" ON "commission_settings" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "IDX_marketplace_partner" ON "marketplace_api_configs" USING btree ("partner_id","marketplace");--> statement-breakpoint
CREATE INDEX "IDX_marketplace_status" ON "marketplace_api_configs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "IDX_spt_active" ON "spt_costs" USING btree ("is_active");