-- AI Marketplace Manager System
-- Migration: 0008
-- Created: 2024-12-01
-- Purpose: Complete AI automation for marketplace operations

-- ============================================
-- MARKETPLACE ACCOUNTS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_marketplace_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partner_id INTEGER NOT NULL,
    marketplace TEXT NOT NULL CHECK(marketplace IN ('uzum', 'wildberries', 'yandex', 'ozon')),
    account_name TEXT NOT NULL,
    seller_id TEXT,
    api_token TEXT,
    api_secret TEXT,
    account_status TEXT DEFAULT 'active' CHECK(account_status IN ('active', 'inactive', 'error', 'suspended')),
    ai_enabled BOOLEAN DEFAULT 1,
    auto_response_enabled BOOLEAN DEFAULT 1,
    auto_seo_enabled BOOLEAN DEFAULT 1,
    auto_ads_enabled BOOLEAN DEFAULT 0,
    last_sync_at TIMESTAMP,
    sync_status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_accounts_partner ON ai_marketplace_accounts(partner_id);
CREATE INDEX IF NOT EXISTS idx_ai_accounts_marketplace ON ai_marketplace_accounts(marketplace);

-- ============================================
-- AI TASKS QUEUE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    task_type TEXT NOT NULL CHECK(task_type IN (
        'review_response',
        'question_response', 
        'product_card_creation',
        'seo_optimization',
        'competitor_analysis',
        'ad_campaign_creation',
        'infographic_generation',
        'niche_analysis',
        'report_generation',
        'price_optimization',
        'inventory_alert'
    )),
    priority INTEGER DEFAULT 5 CHECK(priority BETWEEN 1 AND 10),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    input_data TEXT NOT NULL,
    output_data TEXT,
    error_message TEXT,
    ai_model TEXT DEFAULT 'claude-3-5-sonnet',
    processing_time_ms INTEGER,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES ai_marketplace_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_tasks_account ON ai_tasks(account_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_type ON ai_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_created ON ai_tasks(created_at);

-- ============================================
-- AI REVIEW RESPONSES
-- ============================================
CREATE TABLE IF NOT EXISTS ai_review_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    marketplace TEXT NOT NULL,
    review_id TEXT NOT NULL,
    review_text TEXT NOT NULL,
    review_rating INTEGER CHECK(review_rating BETWEEN 1 AND 5),
    review_date TIMESTAMP,
    customer_name TEXT,
    product_id TEXT,
    product_name TEXT,
    ai_response TEXT NOT NULL,
    response_status TEXT DEFAULT 'draft' CHECK(response_status IN ('draft', 'approved', 'sent', 'failed')),
    sentiment TEXT CHECK(sentiment IN ('positive', 'neutral', 'negative')),
    auto_sent BOOLEAN DEFAULT 0,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES ai_marketplace_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_reviews_account ON ai_review_responses(account_id);
CREATE INDEX IF NOT EXISTS idx_ai_reviews_status ON ai_review_responses(response_status);
CREATE INDEX IF NOT EXISTS idx_ai_reviews_sentiment ON ai_review_responses(sentiment);

-- ============================================
-- AI PRODUCT CARDS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_product_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    marketplace TEXT NOT NULL,
    product_id TEXT,
    base_product_name TEXT NOT NULL,
    optimized_title TEXT NOT NULL,
    optimized_description TEXT NOT NULL,
    seo_keywords TEXT,
    category TEXT,
    attributes TEXT,
    price REAL,
    images_data TEXT,
    seo_score REAL,
    performance_score REAL,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'pending_approval', 'approved', 'published', 'rejected')),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES ai_marketplace_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_products_account ON ai_product_cards(account_id);
CREATE INDEX IF NOT EXISTS idx_ai_products_marketplace ON ai_product_cards(marketplace);
CREATE INDEX IF NOT EXISTS idx_ai_products_status ON ai_product_cards(status);

-- ============================================
-- AI COMPETITOR ANALYSIS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_competitor_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    marketplace TEXT NOT NULL,
    our_product_id TEXT,
    our_product_name TEXT,
    competitor_product_id TEXT NOT NULL,
    competitor_seller TEXT,
    competitor_product_name TEXT,
    competitor_price REAL,
    competitor_rating REAL,
    competitor_reviews_count INTEGER,
    competitor_sales_estimate INTEGER,
    seo_comparison TEXT,
    strengths TEXT,
    weaknesses TEXT,
    recommendations TEXT,
    price_strategy TEXT,
    action_items TEXT,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES ai_marketplace_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_competitor_account ON ai_competitor_analysis(account_id);
CREATE INDEX IF NOT EXISTS idx_ai_competitor_marketplace ON ai_competitor_analysis(marketplace);

-- ============================================
-- AI ADVERTISING CAMPAIGNS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_ad_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    marketplace TEXT NOT NULL,
    campaign_id TEXT,
    campaign_name TEXT NOT NULL,
    campaign_type TEXT CHECK(campaign_type IN ('search', 'catalog', 'banner', 'automatic', 'external')),
    product_ids TEXT,
    keywords TEXT,
    bid_strategy TEXT,
    daily_budget REAL,
    total_budget REAL,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend REAL DEFAULT 0,
    revenue REAL DEFAULT 0,
    roi REAL,
    ctr REAL,
    cpc REAL,
    cpa REAL,
    optimization_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES ai_marketplace_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_campaigns_account ON ai_ad_campaigns(account_id);
CREATE INDEX IF NOT EXISTS idx_ai_campaigns_status ON ai_ad_campaigns(status);

-- ============================================
-- AI REPORTS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    report_type TEXT NOT NULL CHECK(report_type IN ('daily', 'weekly', 'monthly', 'custom', 'performance', 'competitor')),
    report_period_start TIMESTAMP NOT NULL,
    report_period_end TIMESTAMP NOT NULL,
    summary TEXT,
    key_metrics TEXT,
    insights TEXT,
    recommendations TEXT,
    action_items TEXT,
    trends TEXT,
    report_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES ai_marketplace_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_reports_account ON ai_reports(account_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_type ON ai_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_ai_reports_period ON ai_reports(report_period_start, report_period_end);

-- ============================================
-- AI PERFORMANCE METRICS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    metric_date DATE NOT NULL,
    marketplace TEXT NOT NULL,
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    failed_tasks INTEGER DEFAULT 0,
    avg_processing_time_ms INTEGER,
    reviews_responded INTEGER DEFAULT 0,
    products_optimized INTEGER DEFAULT 0,
    competitors_analyzed INTEGER DEFAULT 0,
    campaigns_managed INTEGER DEFAULT 0,
    revenue_impact REAL DEFAULT 0,
    cost_savings REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES ai_marketplace_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_metrics_account ON ai_performance_metrics(account_id);
CREATE INDEX IF NOT EXISTS idx_ai_metrics_date ON ai_performance_metrics(metric_date);

-- ============================================
-- AI SETTINGS (Per Tier)
-- ============================================
CREATE TABLE IF NOT EXISTS ai_tier_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tier TEXT NOT NULL UNIQUE CHECK(tier IN ('starter_pro', 'business_standard', 'professional_plus', 'enterprise_elite')),
    review_response_enabled BOOLEAN DEFAULT 0,
    review_response_limit INTEGER,
    product_card_enabled BOOLEAN DEFAULT 0,
    product_card_limit INTEGER,
    seo_optimization_enabled BOOLEAN DEFAULT 0,
    seo_optimization_limit INTEGER,
    competitor_analysis_enabled BOOLEAN DEFAULT 0,
    competitor_analysis_limit INTEGER,
    ad_management_enabled BOOLEAN DEFAULT 0,
    ad_management_limit INTEGER,
    infographic_enabled BOOLEAN DEFAULT 0,
    infographic_limit INTEGER,
    reports_enabled BOOLEAN DEFAULT 0,
    reports_frequency TEXT,
    ai_model TEXT DEFAULT 'claude-3-5-sonnet',
    priority_level INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tier settings
INSERT OR IGNORE INTO ai_tier_settings (tier, review_response_enabled, review_response_limit, product_card_enabled, product_card_limit, seo_optimization_enabled, seo_optimization_limit, priority_level) VALUES
('starter_pro', 1, 100, 0, 0, 0, 0, 3),
('business_standard', 1, 500, 1, 50, 1, 20, 5),
('professional_plus', 1, 2000, 1, 200, 1, 100, 8),
('enterprise_elite', 1, NULL, 1, NULL, 1, NULL, 10);

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Partner AI Summary View
CREATE VIEW IF NOT EXISTS v_partner_ai_summary AS
SELECT 
    u.id as partner_id,
    u.username,
    u.tier,
    COUNT(DISTINCT ama.id) as marketplace_accounts,
    COUNT(DISTINCT CASE WHEN ama.ai_enabled = 1 THEN ama.id END) as ai_enabled_accounts,
    COUNT(DISTINCT at.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN at.status = 'completed' THEN at.id END) as completed_tasks,
    COUNT(DISTINCT CASE WHEN at.status = 'failed' THEN at.id END) as failed_tasks,
    AVG(CASE WHEN at.status = 'completed' THEN at.processing_time_ms END) as avg_processing_time,
    MAX(at.created_at) as last_task_date
FROM users u
LEFT JOIN ai_marketplace_accounts ama ON u.id = ama.partner_id
LEFT JOIN ai_tasks at ON ama.id = at.account_id
GROUP BY u.id;

-- Daily AI Activity View
CREATE VIEW IF NOT EXISTS v_daily_ai_activity AS
SELECT 
    DATE(at.created_at) as activity_date,
    ama.marketplace,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN at.status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN at.status = 'failed' THEN 1 END) as failed,
    COUNT(CASE WHEN at.task_type = 'review_response' THEN 1 END) as reviews,
    COUNT(CASE WHEN at.task_type = 'product_card_creation' THEN 1 END) as products,
    COUNT(CASE WHEN at.task_type = 'seo_optimization' THEN 1 END) as seo,
    AVG(at.processing_time_ms) as avg_time
FROM ai_tasks at
JOIN ai_marketplace_accounts ama ON at.account_id = ama.id
GROUP BY DATE(at.created_at), ama.marketplace;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update ai_marketplace_accounts updated_at
CREATE TRIGGER IF NOT EXISTS update_ai_accounts_timestamp 
AFTER UPDATE ON ai_marketplace_accounts
BEGIN
    UPDATE ai_marketplace_accounts 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Update ai_product_cards updated_at
CREATE TRIGGER IF NOT EXISTS update_ai_products_timestamp 
AFTER UPDATE ON ai_product_cards
BEGIN
    UPDATE ai_product_cards 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

-- Auto-update performance metrics when task completes
CREATE TRIGGER IF NOT EXISTS update_performance_on_task_complete
AFTER UPDATE OF status ON ai_tasks
WHEN NEW.status = 'completed'
BEGIN
    INSERT INTO ai_performance_metrics (
        account_id, 
        metric_date, 
        marketplace,
        total_tasks,
        completed_tasks
    )
    SELECT 
        NEW.account_id,
        DATE('now'),
        ama.marketplace,
        1,
        1
    FROM ai_marketplace_accounts ama
    WHERE ama.id = NEW.account_id
    ON CONFLICT(account_id, metric_date, marketplace) DO UPDATE SET
        total_tasks = total_tasks + 1,
        completed_tasks = completed_tasks + 1;
END;

-- ============================================
-- COMMENTS
-- ============================================
-- This migration creates the complete AI Marketplace Manager system
-- Features:
-- 1. Multi-marketplace account management
-- 2. Parallel AI task processing
-- 3. Automated review responses
-- 4. AI-powered product card creation
-- 5. SEO optimization
-- 6. Competitor analysis
-- 7. Ad campaign management
-- 8. Performance tracking and reporting
-- 9. Tier-based feature access
-- 10. Comprehensive analytics

-- ============================================
-- END OF MIGRATION
-- ============================================
