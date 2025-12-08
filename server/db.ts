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
        inn TEXT UNIQUE,
        phone TEXT NOT NULL,
        website TEXT,
        approved INTEGER DEFAULT 0,
        pricing_tier TEXT DEFAULT 'starter_pro',
        monthly_fee INTEGER,
        profit_share_percent INTEGER,
        ai_enabled INTEGER DEFAULT 0,
        warehouse_space_kg INTEGER,
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
        currentLoad INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS warehouseStock (
        id TEXT PRIMARY KEY,
        warehouseId TEXT NOT NULL REFERENCES warehouses(id),
        productId TEXT NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL DEFAULT 0,
        location TEXT,
        lastUpdated INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS stockMovements (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL REFERENCES products(id),
        warehouseId TEXT REFERENCES warehouses(id),
        movementType TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        reason TEXT,
        performedBy TEXT REFERENCES users(id),
        createdAt INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        partnerId TEXT NOT NULL REFERENCES partners(id),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        address TEXT,
        totalOrders INTEGER DEFAULT 0,
        totalSpent REAL DEFAULT 0,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
        lastOrderAt INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS stockAlerts (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL REFERENCES products(id),
        alertType TEXT NOT NULL,
        message TEXT NOT NULL,
        resolved INTEGER DEFAULT 0,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
        resolvedAt INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS inventoryReports (
        id TEXT PRIMARY KEY,
        partnerId TEXT NOT NULL REFERENCES partners(id),
        reportType TEXT NOT NULL,
        startDate INTEGER NOT NULL,
        endDate INTEGER NOT NULL,
        data TEXT NOT NULL,
        generatedBy TEXT REFERENCES users(id),
        createdAt INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS marketplaceIntegrations (
        id TEXT PRIMARY KEY,
        partnerId TEXT NOT NULL REFERENCES partners(id),
        marketplace TEXT NOT NULL,
        apiKey TEXT,
        apiSecret TEXT,
        active INTEGER DEFAULT 0,
        lastSyncAt INTEGER,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS fulfillmentRequests (
        id TEXT PRIMARY KEY,
        partnerId TEXT NOT NULL REFERENCES partners(id),
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        estimatedCost TEXT,
        actualCost TEXT,
        assignedTo TEXT REFERENCES users(id),
        createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
        updatedAt INTEGER,
        completedAt INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        partnerId TEXT NOT NULL REFERENCES partners(id),
        metricType TEXT NOT NULL,
        value REAL NOT NULL,
        date INTEGER NOT NULL,
        metadata TEXT,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS profitBreakdown (
        id TEXT PRIMARY KEY,
        partnerId TEXT NOT NULL REFERENCES partners(id),
        orderId TEXT REFERENCES orders(id),
        revenue REAL NOT NULL,
        costs REAL NOT NULL,
        platformFee REAL NOT NULL,
        profitShare REAL NOT NULL,
        netProfit REAL NOT NULL,
        date INTEGER NOT NULL,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS trendingProducts (
        id TEXT PRIMARY KEY,
        marketplace TEXT NOT NULL,
        category TEXT NOT NULL,
        productName TEXT NOT NULL,
        price REAL,
        salesCount INTEGER,
        rating REAL,
        trendScore INTEGER NOT NULL,
        imageUrl TEXT,
        productUrl TEXT,
        analyzedAt INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS chatRooms (
        id TEXT PRIMARY KEY,
        partnerId TEXT REFERENCES partners(id),
        adminId TEXT REFERENCES users(id),
        status TEXT DEFAULT 'active',
        createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
        lastMessageAt INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS enhancedMessages (
        id TEXT PRIMARY KEY,
        chatRoomId TEXT NOT NULL REFERENCES chatRooms(id),
        senderId TEXT NOT NULL REFERENCES users(id),
        senderRole TEXT NOT NULL,
        content TEXT NOT NULL,
        messageType TEXT DEFAULT 'text',
        attachmentUrl TEXT,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
        readAt INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS tierUpgradeRequests (
        id TEXT PRIMARY KEY,
        partnerId TEXT NOT NULL REFERENCES partners(id),
        currentTier TEXT NOT NULL,
        requestedTier TEXT NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        requestedAt INTEGER NOT NULL DEFAULT (unixepoch()),
        reviewedAt INTEGER,
        reviewedBy TEXT REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        action TEXT NOT NULL,
        entityType TEXT NOT NULL,
        entityId TEXT,
        changes TEXT,
        ipAddress TEXT,
        userAgent TEXT,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch())
      );
      
      CREATE TABLE IF NOT EXISTS systemSettings (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        updatedAt INTEGER NOT NULL DEFAULT (unixepoch()),
        updatedBy TEXT REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS ai_tasks (
        id TEXT PRIMARY KEY,
        partnerId TEXT NOT NULL REFERENCES partners(id),
        taskType TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        inputData TEXT,
        outputData TEXT,
        errorMessage TEXT,
        startedAt INTEGER,
        completedAt INTEGER,
        estimatedCost REAL,
        actualCost REAL,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
        updatedAt INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS ai_product_cards (
        id TEXT PRIMARY KEY,
        partnerId TEXT NOT NULL REFERENCES partners(id),
        productId TEXT REFERENCES products(id),
        marketplace TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        bulletPoints TEXT,
        seoKeywords TEXT,
        imagePrompts TEXT,
        generatedImages TEXT,
        status TEXT DEFAULT 'draft',
        qualityScore INTEGER,
        aiModel TEXT,
        generationCost REAL,
        createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
        updatedAt INTEGER,
        publishedAt INTEGER
      );
    `);
    
    console.log('✅ All tables created successfully!');
    
    // Create or update default admin user
    const adminCheck = sqlite.prepare('SELECT id, password FROM users WHERE username = ?').get('admin') as any;
    
    if (!adminCheck) {
      // Create new admin
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      const adminId = 'admin-' + Date.now();
      
      sqlite.prepare(`
        INSERT INTO users (id, username, email, password, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(adminId, 'admin', 'admin@biznesyordam.uz', hashedPassword, 'admin', Date.now());
      
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
        INSERT INTO partners (id, user_id, businessName, phone, approved, pricingTier, aiEnabled, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(partnerId, userId, 'Test Biznes', '+998901234567', 1, 'starter_pro', 1, Date.now());
      
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