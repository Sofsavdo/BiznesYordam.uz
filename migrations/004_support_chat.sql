ALTER TABLE "messages"
  ADD COLUMN "message_type" varchar(20) DEFAULT 'text';--> statement-breakpoint
ALTER TABLE "messages"
  ADD COLUMN "file_url" text;--> statement-breakpoint
ALTER TABLE "messages"
  ADD COLUMN "file_name" varchar(255);--> statement-breakpoint
ALTER TABLE "messages"
  ADD COLUMN "file_size" integer;
