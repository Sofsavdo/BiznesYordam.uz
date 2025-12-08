// Quick migration script for development
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '../shared/schema';

const sqlite = new Database('./dev.db');
const db = drizzle(sqlite, { schema });

console.log('🔧 Running migrations...');

try {
  // Create tables from schema
  sqlite.exec(`
    -- Create all tables if they don't exist
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
      userId TEXT NOT NULL UNIQUE REFERENCES users(id),
      businessName TEXT NOT NULL,
      businessAddress TEXT,
      inn TEXT UNIQUE,
      phone TEXT NOT NULL,
      website TEXT,
      approved INTEGER DEFAULT 0,
      pricingTier TEXT DEFAULT 'starter_pro',
      monthlyFee INTEGER,
      profitSharePercent INTEGER,
      aiEnabled INTEGER DEFAULT 0,
      warehouseSpaceKg INTEGER,
      createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
      lastActivityAt INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      partnerId TEXT NOT NULL REFERENCES partners(id),
      name TEXT NOT NULL,
      sku TEXT UNIQUE,
      description TEXT,
      category TEXT,
      brand TEXT,
      price REAL NOT NULL,
      costPrice REAL,
      stockQuantity INTEGER DEFAULT 0,
      lowStockThreshold INTEGER DEFAULT 10,
      createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
      updatedAt INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      partnerId TEXT NOT NULL REFERENCES partners(id),
      orderNumber TEXT UNIQUE NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT,
      customerPhone TEXT,
      marketplace TEXT,
      status TEXT DEFAULT 'pending',
      totalAmount REAL NOT NULL,
      shippingAddress TEXT,
      trackingNumber TEXT,
      createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
      updatedAt INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS orderItems (
      id TEXT PRIMARY KEY,
      orderId TEXT NOT NULL REFERENCES orders(id),
      productId TEXT NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      createdAt INTEGER NOT NULL DEFAULT (unixepoch())
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
    
    CREATE TABLE IF NOT EXISTS auditLogs (
      id TEXT PRIMARY KEY,
      userId TEXT REFERENCES users(id),
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
  `);
  
  console.log('✅ All tables created successfully!');
  
  // Insert default admin if not exists
  const adminExists = sqlite.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin') as { count: number };
  
  if (adminExists.count === 0) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminId = 'admin-' + Date.now();
    sqlite.prepare(`
      INSERT INTO users (id, username, email, password, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(adminId, 'admin', 'admin@biznesyordam.uz', hashedPassword, 'admin', Date.now());
    
    console.log('✅ Default admin user created (email: admin@biznesyordam.uz, password: admin123)');
  }
  
  console.log('\n🎉 Database migration completed!\n');
  process.exit(0);
  
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}
