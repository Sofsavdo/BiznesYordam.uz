-- AI AUTONOMOUS MANAGER SYSTEM
-- Migration: 0007_ai_manager_system.sql

-- ================================================================
-- 1. AI MANAGER CONFIG
-- ================================================================
CREATE TABLE ai_manager_config (
  id SERIAL PRIMARY KEY,
  is_enabled BOOLEAN DEFAULT true,
  ai_model VARCHAR(50) DEFAULT 'gpt-4-turbo', -- 'gpt-4-turbo', 'claude-3-opus'
  max_daily_api_calls INTEGER DEFAULT 10000,
  current_daily_calls INTEGER DEFAULT 0,
  auto_product_creation BOOLEAN DEFAULT true,
  auto_price_optimization BOOLEAN DEFAULT true,
  auto_inventory_sync BOOLEAN DEFAULT true,
  auto_customer_support BOOLEAN DEFAULT false, -- hozircha off
  monitoring_interval_minutes INTEGER DEFAULT 15, -- har 15 daqiqada tekshirish
  last_sync TIMESTAMP DEFAULT NOW(),
  config_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Default config
INSERT INTO ai_manager_config (id) VALUES (1);

-- ================================================================
-- 2. MARKETPLACE CREDENTIALS (hamkorlardan olinadi)
-- ================================================================
CREATE TABLE marketplace_credentials (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
  marketplace_type VARCHAR(50) NOT NULL, -- 'uzum', 'wildberries', 'yandex', 'ozon'
  
  -- API credentials (encrypted)
  api_key TEXT,
  api_secret TEXT,
  seller_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_verified TIMESTAMP,
  
  -- Integration info
  integration_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'error', 'suspended'
  last_sync TIMESTAMP,
  sync_frequency_minutes INTEGER DEFAULT 30,
  auto_sync_enabled BOOLEAN DEFAULT true,
  
  -- Stats
  total_products_synced INTEGER DEFAULT 0,
  total_orders_synced INTEGER DEFAULT 0,
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_marketplace_credentials_partner ON marketplace_credentials(partner_id);
CREATE INDEX idx_marketplace_credentials_type ON marketplace_credentials(marketplace_type);

-- ================================================================
-- 3. AI TASKS QUEUE (AI bajaradigan vazifalar navbati)
-- ================================================================
CREATE TABLE ai_tasks (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
  marketplace_type VARCHAR(50),
  
  -- Task info
  task_type VARCHAR(50) NOT NULL, -- 'product_creation', 'seo_optimization', 'price_optimization', 'inventory_sync', 'analytics'
  priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high, 4=critical
  
  -- Input/Output
  input_data JSONB NOT NULL,
  output_data JSONB,
  
  -- AI execution
  ai_model_used VARCHAR(50),
  tokens_used INTEGER,
  execution_time_seconds INTEGER,
  api_cost DECIMAL(10, 4), -- dollar
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'retry'
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  error_message TEXT,
  
  -- Timestamps
  scheduled_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX idx_ai_tasks_partner ON ai_tasks(partner_id);
CREATE INDEX idx_ai_tasks_type ON ai_tasks(task_type);
CREATE INDEX idx_ai_tasks_scheduled ON ai_tasks(scheduled_at);

-- ================================================================
-- 4. AI GENERATED PRODUCTS (AI yaratgan mahsulotlar)
-- ================================================================
CREATE TABLE ai_generated_products (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
  marketplace_type VARCHAR(50) NOT NULL,
  
  -- Raw input
  raw_product_name TEXT NOT NULL,
  raw_description TEXT,
  raw_category TEXT,
  raw_price DECIMAL(15, 2),
  raw_images TEXT[], -- URL array
  
  -- AI Generated content
  ai_title TEXT, -- SEO optimized
  ai_description TEXT, -- Full optimized description
  ai_short_description TEXT,
  ai_keywords TEXT[], -- kalit so'zlar
  ai_category_suggestions TEXT[],
  ai_tags TEXT[],
  
  -- SEO scoring
  seo_score INTEGER, -- 0-100
  seo_issues JSONB, -- muammolar ro'yxati
  seo_suggestions JSONB, -- tavsiyalar
  
  -- Price optimization
  suggested_price DECIMAL(15, 2),
  competitor_prices JSONB, -- raqobatchilar narxlari
  price_rationale TEXT, -- narx asoslash
  
  -- Marketplace specific
  marketplace_specific_data JSONB, -- har bir marketplace uchun alohida formatlar
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'review', 'approved', 'published', 'rejected'
  uploaded_to_marketplace BOOLEAN DEFAULT false,
  marketplace_product_id TEXT,
  
  -- Quality
  ai_confidence_score DECIMAL(5, 2), -- 0-100
  human_reviewed BOOLEAN DEFAULT false,
  human_reviewer_id INTEGER,
  human_notes TEXT,
  
  -- Timestamps
  generated_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_products_partner ON ai_generated_products(partner_id);
CREATE INDEX idx_ai_products_marketplace ON ai_generated_products(marketplace_type);
CREATE INDEX idx_ai_products_status ON ai_generated_products(status);

-- ================================================================
-- 5. AI ACTIONS LOG (AI qilgan barcha amallar tarixi)
-- ================================================================
CREATE TABLE ai_actions_log (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
  marketplace_type VARCHAR(50),
  
  -- Action details
  action_type VARCHAR(50) NOT NULL, -- 'product_created', 'price_updated', 'inventory_synced', 'issue_detected', 'issue_resolved'
  action_description TEXT,
  
  -- Before/After
  before_state JSONB,
  after_state JSONB,
  
  -- Impact
  impact_level VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
  estimated_impact TEXT, -- "Savdo 15% oshishi mumkin"
  
  -- AI reasoning
  ai_reasoning TEXT, -- AI nima uchun shunday qilganini tushuntirish
  confidence_level DECIMAL(5, 2), -- 0-100
  
  -- Result
  was_successful BOOLEAN,
  actual_result TEXT,
  
  -- Timestamps
  executed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_log_partner ON ai_actions_log(partner_id);
CREATE INDEX idx_ai_log_action ON ai_actions_log(action_type);
CREATE INDEX idx_ai_log_executed ON ai_actions_log(executed_at);

-- ================================================================
-- 6. AI MONITORING ALERTS (AI aniqlagan muammolar)
-- ================================================================
CREATE TABLE ai_monitoring_alerts (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
  marketplace_type VARCHAR(50),
  
  -- Alert info
  alert_type VARCHAR(50) NOT NULL, -- 'low_stock', 'price_too_high', 'seo_issue', 'competitor_alert', 'sales_drop'
  severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT,
  
  -- Detection
  detected_at TIMESTAMP DEFAULT NOW(),
  detected_by VARCHAR(20) DEFAULT 'ai', -- 'ai' or 'human'
  
  -- AI Suggestion
  ai_suggested_action TEXT,
  ai_estimated_impact TEXT,
  auto_fix_available BOOLEAN DEFAULT false,
  
  -- Resolution
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'ignored'
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(20), -- 'ai' or 'admin'
  resolution_notes TEXT,
  
  -- Related data
  related_product_id INTEGER,
  related_data JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_partner ON ai_monitoring_alerts(partner_id);
CREATE INDEX idx_alerts_status ON ai_monitoring_alerts(status);
CREATE INDEX idx_alerts_severity ON ai_monitoring_alerts(severity);

-- ================================================================
-- 7. AI PERFORMANCE METRICS (AI samaradorligi)
-- ================================================================
CREATE TABLE ai_performance_metrics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Task execution
  total_tasks_executed INTEGER DEFAULT 0,
  successful_tasks INTEGER DEFAULT 0,
  failed_tasks INTEGER DEFAULT 0,
  
  -- By type
  products_created INTEGER DEFAULT 0,
  prices_optimized INTEGER DEFAULT 0,
  inventory_synced INTEGER DEFAULT 0,
  issues_detected INTEGER DEFAULT 0,
  issues_resolved INTEGER DEFAULT 0,
  
  -- Quality metrics
  average_seo_score DECIMAL(5, 2),
  average_confidence_score DECIMAL(5, 2),
  human_approval_rate DECIMAL(5, 2), -- necha foiz human tomonidan tasdiqlandi
  
  -- Cost
  total_api_calls INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10, 2) DEFAULT 0,
  
  -- Impact
  estimated_revenue_increase DECIMAL(15, 2),
  time_saved_hours DECIMAL(10, 2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date)
);

CREATE INDEX idx_ai_metrics_date ON ai_performance_metrics(date);

-- ================================================================
-- 8. MARKETPLACE PRODUCT SYNC (marketplace mahsulotlari sync)
-- ================================================================
CREATE TABLE marketplace_products (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
  marketplace_type VARCHAR(50) NOT NULL,
  marketplace_product_id TEXT NOT NULL, -- marketplace'dagi ID
  
  -- Product info (cached from marketplace)
  title TEXT,
  description TEXT,
  price DECIMAL(15, 2),
  stock_quantity INTEGER,
  category TEXT,
  images TEXT[],
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  status VARCHAR(50), -- 'active', 'out_of_stock', 'suspended'
  
  -- Stats (from marketplace)
  views_count INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  revenue_total DECIMAL(15, 2) DEFAULT 0,
  rating DECIMAL(3, 2),
  reviews_count INTEGER DEFAULT 0,
  
  -- AI analysis
  ai_analyzed BOOLEAN DEFAULT false,
  ai_suggestions JSONB,
  needs_optimization BOOLEAN DEFAULT false,
  
  -- Sync info
  last_synced_at TIMESTAMP,
  sync_errors INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(partner_id, marketplace_type, marketplace_product_id)
);

CREATE INDEX idx_marketplace_products_partner ON marketplace_products(partner_id);
CREATE INDEX idx_marketplace_products_marketplace ON marketplace_products(marketplace_type);
CREATE INDEX idx_marketplace_products_sync ON marketplace_products(last_synced_at);

-- ================================================================
-- COMMENTS
-- ================================================================
COMMENT ON TABLE ai_manager_config IS 'AI Manager global sozlamalar';
COMMENT ON TABLE marketplace_credentials IS 'Hamkorlarning marketplace API credentials';
COMMENT ON TABLE ai_tasks IS 'AI bajaradigan vazifalar navbati';
COMMENT ON TABLE ai_generated_products IS 'AI tomonidan yaratilgan mahsulotlar';
COMMENT ON TABLE ai_actions_log IS 'AI qilgan barcha amallar tarixi';
COMMENT ON TABLE ai_monitoring_alerts IS 'AI aniqlagan muammolar va ogohlantirishlar';
COMMENT ON TABLE ai_performance_metrics IS 'AI samaradorlik ko\'rsatkichlari';
COMMENT ON TABLE marketplace_products IS 'Marketplace mahsulotlari sync cache';
