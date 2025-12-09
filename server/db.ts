import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';
import bcrypt from 'bcryptjs';

// NOTE:
// Lokal rivojlanish va demo uchun biz SQLite (better-sqlite3) dan foydalanamiz.
// Drizzle ORM asosiy jadval va typelarga ishlaydi, lekin ayrim controllerlar
// xom SQL bilan `db.query`, `db.all`, `db.get` funksiyalarini ham chaqiradi.
// Shu sababli bu yerda ikkala uslubni ham qo'llab-quvvatlaydigan bitta db obyektini
// hosil qilamiz.

// Asosiy SQLite connection
const sqlite = new Database('dev.db');

// AUTO-MIGRATION: Database jadvallarini avtomatik yaratish
console.log('🔧 Checking database tables...');
try {
  // Check if users table exists
  const tableCheck = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
  
  if (!tableCheck) {
    console.log('📦 Creating database tables...');
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'customer',
        is_active INTEGER DEFAULT 1,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS partners (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
        business_name TEXT NOT NULL,
        business_address TEXT,
        business_category TEXT,
        inn TEXT UNIQUE,
        phone TEXT NOT NULL,
        website TEXT,
        monthly_revenue TEXT,
        approved INTEGER DEFAULT 0,
        pricing_tier TEXT DEFAULT 'starter_pro',
        monthly_fee INTEGER,
        profit_share_percent INTEGER,
        ai_enabled INTEGER DEFAULT 0,
        warehouse_space_kg INTEGER,
        notes TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        last_activity_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        name TEXT NOT NULL,
        sku TEXT UNIQUE,
        description TEXT,
        category TEXT,
        brand TEXT,
        price REAL NOT NULL,
        cost_price REAL,
        stock_quantity INTEGER DEFAULT 0,
        low_stock_threshold INTEGER DEFAULT 10,
        optimized_title TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        order_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        customer_phone TEXT,
        marketplace TEXT,
        status TEXT DEFAULT 'pending',
        total_amount REAL NOT NULL,
        shipping_address TEXT,
        tracking_number TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS orderItems (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL REFERENCES orders(id),
        product_id TEXT NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS warehouses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        current_load INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS warehouseStock (
        id TEXT PRIMARY KEY,
        warehouse_id TEXT NOT NULL REFERENCES warehouses(id),
        product_id TEXT NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL DEFAULT 0,
        location TEXT,
        last_updated INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS stockMovements (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL REFERENCES products(id),
        warehouse_id TEXT REFERENCES warehouses(id),
        movement_type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        reason TEXT,
        performed_by TEXT REFERENCES users(id),
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        address TEXT,
        total_orders INTEGER DEFAULT 0,
        total_spent REAL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        last_order_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS stockAlerts (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL REFERENCES products(id),
        alert_type TEXT NOT NULL,
        message TEXT NOT NULL,
        resolved INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        resolved_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS inventoryReports (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        report_type TEXT NOT NULL,
        start_date INTEGER NOT NULL,
        end_date INTEGER NOT NULL,
        data TEXT NOT NULL,
        generated_by TEXT REFERENCES users(id),
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS marketplaceIntegrations (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        marketplace TEXT NOT NULL,
        api_key TEXT,
        api_secret TEXT,
        active INTEGER DEFAULT 0,
        last_sync_at INTEGER,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS fulfillmentRequests (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        estimated_cost TEXT,
        actual_cost TEXT,
        assigned_to TEXT REFERENCES users(id),
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER,
        completed_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        metric_type TEXT NOT NULL,
        value REAL NOT NULL,
        date INTEGER NOT NULL,
        metadata TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS profitBreakdown (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        orderId TEXT REFERENCES orders(id),
        revenue REAL NOT NULL,
        costs REAL NOT NULL,
        platform_fee REAL NOT NULL,
        profit_share REAL NOT NULL,
        net_profit REAL NOT NULL,
        date INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS trendingProducts (
        id TEXT PRIMARY KEY,
        marketplace TEXT NOT NULL,
        category TEXT NOT NULL,
        product_name TEXT NOT NULL,
        price REAL,
        sales_count INTEGER,
        rating REAL,
        trend_score INTEGER NOT NULL,
        image_url TEXT,
        product_url TEXT,
        analyzed_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS chatRooms (
        id TEXT PRIMARY KEY,
        partner_id TEXT REFERENCES partners(id),
        admin_id TEXT REFERENCES users(id),
        status TEXT DEFAULT 'active',
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        last_message_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS enhancedMessages (
        id TEXT PRIMARY KEY,
        chat_room_id TEXT NOT NULL REFERENCES chatRooms(id),
        sender_id TEXT NOT NULL REFERENCES users(id),
        sender_role TEXT NOT NULL,
        content TEXT NOT NULL,
        message_type TEXT DEFAULT 'text',
        attachment_url TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        read_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS tierUpgradeRequests (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        current_tier TEXT NOT NULL,
        requested_tier TEXT NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        requested_at INTEGER NOT NULL DEFAULT (unixepoch()),
        reviewed_at INTEGER,
        reviewed_by TEXT REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        changes TEXT,
        payload TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS systemSettings (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_by TEXT REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS ai_tasks (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        account_id TEXT REFERENCES ai_marketplace_accounts(id),
        task_type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        input_data TEXT,
        output_data TEXT,
        error_message TEXT,
        started_at INTEGER,
        completed_at INTEGER,
        estimated_cost REAL,
        actual_cost REAL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS ai_product_cards (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        product_id TEXT REFERENCES products(id),
        account_id TEXT REFERENCES ai_marketplace_accounts(id),
        base_product_name TEXT,
        marketplace TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        bullet_points TEXT,
        seo_keywords TEXT,
        image_prompts TEXT,
        generated_images TEXT,
        status TEXT DEFAULT 'draft',
        quality_score INTEGER,
        ai_model TEXT,
        generation_cost REAL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER,
        published_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS ai_marketplace_accounts (
        id TEXT PRIMARY KEY,
        partner_id TEXT NOT NULL REFERENCES partners(id),
        marketplace TEXT NOT NULL,
        account_name TEXT NOT NULL,
        credentials_encrypted TEXT,
        is_active INTEGER DEFAULT 1,
        last_synced_at INTEGER,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER
      );
    `);
    
    console.log('✅ All tables created successfully!');
    
    // Create or update default admin user
    const adminCheck = sqlite.prepare('SELECT id, password FROM users WHERE username = ?').get('admin') as any;
    
    if (!adminCheck) {
      // Create new admin
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      const admin_id = 'admin-' + Date.now();
      
      sqlite.prepare(`
        INSERT INTO users (id, username, email, password, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(admin_id, 'admin', 'admin@biznesyordam.uz', hashedPassword, 'admin', Date.now());
      
      console.log('✅ Default admin user created');
      console.log('   📧 Email: admin@biznesyordam.uz');
      console.log('   👤 Username: admin');
      console.log('   🔑 Password: admin123');
    } else {
      // Update existing admin password
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      sqlite.prepare(`
        UPDATE users SET password = ?, updated_at = ? WHERE username = ?
      `).run(hashedPassword, Date.now(), 'admin');
      
      console.log('✅ Admin password updated');
      console.log('   👤 Username: admin');
      console.log('   🔑 Password: admin123');
    }
    
    // Create or update test partner user
    const partnerCheck = sqlite.prepare('SELECT id FROM users WHERE username = ?').get('testpartner') as any;
    
    if (!partnerCheck) {
      const hashedPassword = bcrypt.hashSync('partner123', 10);
      const partnerId = 'partner-' + Date.now();
      const userId = 'user-' + Date.now();
      
      // Create partner user
      sqlite.prepare(`
        INSERT INTO users (id, username, email, password, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(userId, 'testpartner', 'partner@test.uz', hashedPassword, 'partner', Date.now());
      
      // Create partner profile
      sqlite.prepare(`
        INSERT INTO partners (id, user_id, business_name, business_category, phone, approved, pricing_tier, ai_enabled, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(partnerId, userId, 'Test Biznes', 'electronics', '+998901234567', 1, 'starter_pro', 1, Date.now());
      
      console.log('✅ Test partner user created');
      console.log('   📧 Email: partner@test.uz');
      console.log('   👤 Username: testpartner');
      console.log('   🔑 Password: partner123');
    } else {
      // Update existing partner password
      const hashedPassword = bcrypt.hashSync('partner123', 10);
      sqlite.prepare(`
        UPDATE users SET password = ?, updated_at = ? WHERE username = ?
      `).run(hashedPassword, Date.now(), 'testpartner');
      
      console.log('✅ Partner password updated');
      console.log('   👤 Username: testpartner');
      console.log('   🔑 Password: partner123');
    }
    
    console.log('🎉 Database initialization completed!\n');
  } else {
    console.log('✅ Database tables already exist\n');
  }
} catch (error) {
  console.error('❌ Database initialization error:', error);
}

// Drizzle ORM instansiyasi (typed schema bilan)
const drizzleDb = drizzle(sqlite, { schema });

// Drizzle obyektini kengaytirib, xom SQL helperlarini qo'shamiz
const db: any = drizzleDb;

// Simple helper: SELECT/INSERT/UPDATE uchun .query (hamma natijalar)
db.query = (sql: string, params?: any[]) => {
  const stmt = sqlite.prepare(sql);
  return params && params.length > 0 ? stmt.all(...params) : stmt.all();
};

// .all alias (SQLite style)
db.all = (sql: string, params?: any[]) => {
  const stmt = sqlite.prepare(sql);
  return params && params.length > 0 ? stmt.all(...params) : stmt.all();
};

// .get helper – bitta qator qaytarish uchun
db.get = (sql: string, params?: any[]) => {
  const stmt = sqlite.prepare(sql);
  return params && params.length > 0 ? stmt.get(...params) : stmt.get();
};

// .run helper – INSERT/UPDATE/DELETE uchun (better-sqlite3 style)
db.run = (sql: string, params?: any[]) => {
  const stmt = sqlite.prepare(sql);
  const info = params && params.length > 0 ? stmt.run(...params) : stmt.run();
  return info;
};

// Database haqida ma’lumot qaytaruvchi helper
export function getDatabaseInfo() {
  return {
    type: 'sqlite',
    isConnected: !!db,
    connectionString: 'SQLite',
  };
}

export { db, sqlite };