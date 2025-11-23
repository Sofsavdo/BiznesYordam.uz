-- Migration: Add Profit Share Model v4.0.0
-- Date: 2025-11-24
-- Description: Adds monthly_fee and profit_share_rate columns to partners table

-- Add new columns to partners table
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS monthly_fee DECIMAL DEFAULT 3000000,
ADD COLUMN IF NOT EXISTS profit_share_rate DECIMAL DEFAULT 0.50;

-- Update existing partners based on their current tier
UPDATE partners 
SET 
  monthly_fee = CASE pricing_tier
    WHEN 'starter_pro' THEN 3000000
    WHEN 'business_standard' THEN 8000000
    WHEN 'professional_plus' THEN 18000000
    WHEN 'enterprise_elite' THEN 25000000
    ELSE 3000000
  END,
  profit_share_rate = CASE pricing_tier
    WHEN 'starter_pro' THEN 0.50
    WHEN 'business_standard' THEN 0.25
    WHEN 'professional_plus' THEN 0.15
    WHEN 'enterprise_elite' THEN 0.10
    ELSE 0.50
  END,
  commission_rate = CASE pricing_tier
    WHEN 'starter_pro' THEN 0.50
    WHEN 'business_standard' THEN 0.25
    WHEN 'professional_plus' THEN 0.15
    WHEN 'enterprise_elite' THEN 0.10
    ELSE 0.50
  END
WHERE monthly_fee IS NULL OR profit_share_rate IS NULL;

-- Make columns NOT NULL after setting defaults
ALTER TABLE partners 
ALTER COLUMN monthly_fee SET NOT NULL,
ALTER COLUMN profit_share_rate SET NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_partners_pricing_tier ON partners(pricing_tier);
CREATE INDEX IF NOT EXISTS idx_partners_monthly_fee ON partners(monthly_fee);
CREATE INDEX IF NOT EXISTS idx_partners_profit_share_rate ON partners(profit_share_rate);

-- Update pricing_tiers table if exists
ALTER TABLE pricing_tiers 
ADD COLUMN IF NOT EXISTS monthly_fee DECIMAL,
ADD COLUMN IF NOT EXISTS profit_share_rate DECIMAL;

UPDATE pricing_tiers 
SET 
  monthly_fee = CASE tier
    WHEN 'starter_pro' THEN 3000000
    WHEN 'business_standard' THEN 8000000
    WHEN 'professional_plus' THEN 18000000
    WHEN 'enterprise_elite' THEN 25000000
  END,
  profit_share_rate = CASE tier
    WHEN 'starter_pro' THEN 0.50
    WHEN 'business_standard' THEN 0.25
    WHEN 'professional_plus' THEN 0.15
    WHEN 'enterprise_elite' THEN 0.10
  END
WHERE monthly_fee IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN partners.monthly_fee IS 'Fixed monthly subscription fee in UZS (v4.0.0)';
COMMENT ON COLUMN partners.profit_share_rate IS 'Percentage of net profit shared with platform (v4.0.0)';
COMMENT ON COLUMN partners.commission_rate IS 'Legacy commission rate (kept for backward compatibility)';
