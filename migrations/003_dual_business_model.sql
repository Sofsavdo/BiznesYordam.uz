ALTER TABLE "partners"
  ADD COLUMN "plan_type" varchar(50) DEFAULT 'local_full_service' NOT NULL;--> statement-breakpoint
ALTER TABLE "partners"
  ADD COLUMN "ai_plan_code" varchar(100);
