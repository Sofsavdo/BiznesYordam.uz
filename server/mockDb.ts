import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

// Create in-memory SQLite database for development
const sqlite = new Database(':memory:');
export const db = drizzle(sqlite, { schema });

// Initialize database with tables
export function initMockDatabase() {
  try {
    // Create tables based on schema
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'partner',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS partners (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        business_name TEXT NOT NULL,
        business_category TEXT NOT NULL,
        monthly_revenue TEXT,
        pricing_tier TEXT NOT NULL DEFAULT 'basic',
        commission_rate TEXT NOT NULL DEFAULT '0.15',
        is_approved BOOLEAN NOT NULL DEFAULT false,
        approved_by TEXT,
        approved_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (approved_by) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price TEXT NOT NULL,
        quantity INTEGER DEFAULT 0,
        category TEXT,
        marketplace TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (partner_id) REFERENCES partners(id)
      );

      CREATE TABLE IF NOT EXISTS fulfillment_requests (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        estimated_cost TEXT,
        actual_cost TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (partner_id) REFERENCES partners(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        from_user_id TEXT NOT NULL,
        to_user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_user_id) REFERENCES users(id),
        FOREIGN KEY (to_user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL,
        date DATETIME NOT NULL,
        revenue TEXT NOT NULL,
        orders INTEGER DEFAULT 0,
        profit TEXT NOT NULL,
        commission_paid TEXT NOT NULL,
        marketplace TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (partner_id) REFERENCES partners(id)
      );

      CREATE TABLE IF NOT EXISTS marketplace_integrations (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL,
        marketplace TEXT NOT NULL,
        is_active BOOLEAN DEFAULT false,
        api_credentials TEXT,
        api_documentation_url TEXT,
        shop_id TEXT,
        webhook_url TEXT,
        auto_sync_enabled BOOLEAN DEFAULT true,
        sync_interval INTEGER DEFAULT 3600,
        last_sync_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (partner_id) REFERENCES partners(id)
      );

      CREATE TABLE IF NOT EXISTS excel_imports (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL,
        marketplace TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_size INTEGER,
        import_type TEXT NOT NULL,
        status TEXT DEFAULT 'processing',
        records_processed INTEGER DEFAULT 0,
        records_total INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        success_count INTEGER DEFAULT 0,
        error_details TEXT,
        processed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (partner_id) REFERENCES partners(id)
      );

      CREATE TABLE IF NOT EXISTS excel_templates (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        marketplace TEXT NOT NULL,
        template_type TEXT NOT NULL,
        columns TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (partner_id) REFERENCES partners(id)
      );

      CREATE TABLE IF NOT EXISTS admin_permissions (
        user_id TEXT PRIMARY KEY,
        can_manage_admins BOOLEAN NOT NULL DEFAULT false,
        can_manage_content BOOLEAN NOT NULL DEFAULT false,
        can_manage_chat BOOLEAN NOT NULL DEFAULT false,
        can_view_reports BOOLEAN NOT NULL DEFAULT false,
        can_receive_products BOOLEAN NOT NULL DEFAULT false,
        can_activate_partners BOOLEAN NOT NULL DEFAULT false,
        can_manage_integrations BOOLEAN NOT NULL DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        payload TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    console.log("✅ Mock database initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize mock database:", error);
    return false;
  }
}

// Seed initial data
export async function seedMockData() {
  try {
    const bcrypt = await import('bcryptjs');
    
    // Create admin user
    const adminPassword = await bcrypt.hash("BiznesYordam2024!", 10);
    sqlite.exec(`
      INSERT OR IGNORE INTO users (id, username, email, password, first_name, last_name, phone, role, is_active)
      VALUES (
        'admin-001',
        'admin',
        'admin@biznesyordam.uz',
        '${adminPassword}',
        'Bosh',
        'Admin',
        '+998901234567',
        'admin',
        true
      );
    `);

    // Create test partner user
    const partnerPassword = await bcrypt.hash("Partner2024!", 10);
    sqlite.exec(`
      INSERT OR IGNORE INTO users (id, username, email, password, first_name, last_name, phone, role, is_active)
      VALUES (
        'partner-001',
        'testpartner',
        'partner@biznesyordam.uz',
        '${partnerPassword}',
        'Test',
        'Partner',
        '+998901234567',
        'partner',
        true
      );
    `);

    // Create partner profile
    sqlite.exec(`
      INSERT OR IGNORE INTO partners (id, user_id, business_name, business_category, monthly_revenue, pricing_tier, commission_rate, is_approved, approved_by, approved_at)
      VALUES (
        'partner-profile-001',
        'partner-001',
        'Test Biznes',
        'electronics',
        '25000000',
        'business_standard',
        '0.20',
        true,
        'admin-001',
        CURRENT_TIMESTAMP
      );
    `);

    // Create sample products
    sqlite.exec(`
      INSERT OR IGNORE INTO products (id, partner_id, name, description, price, quantity, category, marketplace, status)
      VALUES 
        ('product-001', 'partner-profile-001', 'Samsung Galaxy S24', 'Yangi smartfon modeli', '15000000', 10, 'electronics', 'uzum', 'active'),
        ('product-002', 'partner-profile-001', 'Lenovo ThinkPad', 'Biznes noutbuk', '8500000', 5, 'electronics', 'wildberries', 'active'),
        ('product-003', 'partner-profile-001', 'Apple Watch', 'Aqlli soat', '3500000', 15, 'electronics', 'yandex', 'active');
    `);

    // Create sample fulfillment requests
    sqlite.exec(`
      INSERT OR IGNORE INTO fulfillment_requests (id, partner_id, title, description, status, priority, estimated_cost, actual_cost)
      VALUES 
        ('request-001', 'partner-profile-001', 'Smartfon Samsung Galaxy S24', 'Yangi smartfon modelini marketplace ga joylash', 'pending', 'high', '15000000', NULL),
        ('request-002', 'partner-profile-001', 'Noutbuk Lenovo ThinkPad', 'Biznes noutbukini sotishga tayyorlash', 'approved', 'medium', '8500000', '8200000'),
        ('request-003', 'partner-profile-001', 'Aqlli soat Apple Watch', 'Aksessuarlar kategoriyasiga qo''shish', 'completed', 'low', '3500000', '3400000');
    `);

    // Create sample analytics
    sqlite.exec(`
      INSERT OR IGNORE INTO analytics (id, partner_id, date, revenue, orders, profit, commission_paid, marketplace, category)
      VALUES 
        ('analytics-001', 'partner-profile-001', CURRENT_TIMESTAMP, '54400000', 96, '16320000', '5440000', 'uzum', 'electronics'),
        ('analytics-002', 'partner-profile-001', DATE('now', '-1 day'), '32000000', 45, '9600000', '3200000', 'wildberries', 'electronics'),
        ('analytics-003', 'partner-profile-001', DATE('now', '-2 day'), '28000000', 38, '8400000', '2800000', 'yandex', 'electronics');
    `);

    // Create admin permissions for admin user
    sqlite.exec(`
      INSERT OR IGNORE INTO admin_permissions (user_id, can_manage_admins, can_manage_content, can_manage_chat, can_view_reports, can_receive_products, can_activate_partners, can_manage_integrations)
      VALUES (
        'admin-001',
        true,
        true,
        true,
        true,
        true,
        true,
        true
      );
    `);

    console.log("✅ Mock data seeded successfully");
    console.log("🔑 Admin Login Credentials:");
    console.log("   Username: admin");
    console.log("   Password: BiznesYordam2024!");
    console.log("   Email: admin@biznesyordam.uz");
    console.log("");
    console.log("🔑 Partner Login Credentials:");
    console.log("   Username: testpartner");
    console.log("   Password: Partner2024!");
    console.log("   Email: partner@biznesyordam.uz");
    
    return true;
  } catch (error) {
    console.error("❌ Failed to seed mock data:", error);
    return false;
  }
}
