-- Migration: Add AI Services fields to partners table
-- Date: 2025-01-24
-- Description: Add optional AI services tracking with admin approval workflow

-- Add AI-related columns to partners table
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS ai_enabled BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_requested_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS ai_approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS ai_approved_by VARCHAR REFERENCES users(id);

-- Add comment to columns for documentation
COMMENT ON COLUMN partners.ai_enabled IS 'Whether AI services are enabled for this partner (1M/month)';
COMMENT ON COLUMN partners.ai_requested_at IS 'When the partner requested AI services activation';
COMMENT ON COLUMN partners.ai_approved_at IS 'When admin approved AI services';
COMMENT ON COLUMN partners.ai_approved_by IS 'Admin user ID who approved AI services';

-- Create index for AI-enabled partners (for analytics)
CREATE INDEX IF NOT EXISTS idx_partners_ai_enabled ON partners(ai_enabled) WHERE ai_enabled = TRUE;

-- Create index for AI approval tracking
CREATE INDEX IF NOT EXISTS idx_partners_ai_approval ON partners(ai_approved_by, ai_approved_at);
