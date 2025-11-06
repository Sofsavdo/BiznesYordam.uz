import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import { Pool } from 'pg';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

// Load environment variables
config();

let db: any;
let isPostgreSQL = false;

// Check if we have a real PostgreSQL DATABASE_URL
const connectionString = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

// In production, prefer PostgreSQL but allow SQLite fallback
if (isProduction && (!connectionString || !connectionString.includes('postgresql://'))) {
  console.warn('⚠️  WARNING: No PostgreSQL DATABASE_URL found in production mode');
  console.warn('⚠️  Falling back to SQLite (not recommended for production)');
  console.warn('⚠️  Set DATABASE_URL environment variable to a PostgreSQL connection string for better performance');
}

if (connectionString && connectionString.includes('postgresql://') && !connectionString.includes('memory:memory')) {
  try {
    // Use PostgreSQL with connection pooling
    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Test connection
    await pool.query('SELECT 1');
    db = drizzle(pool, { schema });
    isPostgreSQL = true;
    console.log('✅ PostgreSQL database connection established with pg driver');
  } catch (error) {
    if (isProduction) {
      console.error('❌ CRITICAL: PostgreSQL connection failed in production mode');
      console.error('Error details:', error);
      throw new Error('Failed to connect to PostgreSQL database in production mode');
    }
    console.error('PostgreSQL connection failed, falling back to SQLite:', error);
    await initializeSQLite();
  }
} else {
  await initializeSQLite();
}

async function initializeSQLite() {
  console.log('🔧 Initializing SQLite database...');
  
  const isTestEnv = process.env.NODE_ENV === 'test';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Use in-memory DB for tests, file for dev/production
  const dbPath = isTestEnv ? ':memory:' : (isProduction ? './data/production.db' : './dev.db');
  
  // Create data directory in production
  if (isProduction) {
    const fs = await import('fs');
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data', { recursive: true });
    }
  }
  
  const sqlite = new Database(dbPath);
  db = drizzleSQLite(sqlite, { schema });
  
  // Initialize SQLite tables for development
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
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
      business_name TEXT,
      business_category TEXT NOT NULL,
      monthly_revenue TEXT,
      pricing_tier TEXT NOT NULL DEFAULT 'starter_pro',
      commission_rate TEXT NOT NULL DEFAULT '0.30',
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

    CREATE TABLE IF NOT EXISTS pricing_tiers (
      id TEXT PRIMARY KEY,
      tier TEXT UNIQUE NOT NULL,
      name_uz TEXT NOT NULL,
      fixed_cost TEXT NOT NULL,
      commission_min TEXT NOT NULL,
      commission_max TEXT NOT NULL,
      min_revenue TEXT NOT NULL,
      max_revenue TEXT,
      features TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tier_upgrade_requests (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL,
      current_tier TEXT NOT NULL,
      requested_tier TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'pending',
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      reviewed_by TEXT,
      admin_notes TEXT,
      FOREIGN KEY (partner_id) REFERENCES partners(id),
      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS trending_products (
      id TEXT PRIMARY KEY,
      product_name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      source_market TEXT NOT NULL,
      source_url TEXT,
      current_price TEXT,
      estimated_cost_price TEXT,
      estimated_sale_price TEXT,
      profit_potential TEXT,
      search_volume INTEGER,
      trend_score INTEGER DEFAULT 0,
      competition_level TEXT DEFAULT 'medium',
      keywords TEXT DEFAULT '[]',
      images TEXT DEFAULT '[]',
      is_active BOOLEAN DEFAULT true,
      scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profit_breakdown (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL,
      date DATETIME NOT NULL,
      marketplace TEXT NOT NULL,
      total_revenue TEXT DEFAULT '0',
      fulfillment_costs TEXT DEFAULT '0',
      marketplace_commission TEXT DEFAULT '0',
      product_costs TEXT DEFAULT '0',
      tax_costs TEXT DEFAULT '0',
      logistics_costs TEXT DEFAULT '0',
      spt_costs TEXT DEFAULT '0',
      net_profit TEXT DEFAULT '0',
      profit_margin TEXT DEFAULT '0',
      orders_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    );

    CREATE TABLE IF NOT EXISTS admin_permissions (
      user_id TEXT PRIMARY KEY,
      can_manage_admins BOOLEAN NOT NULL DEFAULT 0,
      can_manage_content BOOLEAN NOT NULL DEFAULT 0,
      can_manage_chat BOOLEAN NOT NULL DEFAULT 0,
      can_view_reports BOOLEAN NOT NULL DEFAULT 0,
      can_receive_products BOOLEAN NOT NULL DEFAULT 0,
      can_activate_partners BOOLEAN NOT NULL DEFAULT 0,
      can_manage_integrations BOOLEAN NOT NULL DEFAULT 0,
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
  
  // Seed initial data for SQLite (skip in tests)
  if (!isTestEnv) {
    await seedSQLiteData(sqlite);
  }
  
  console.log('✅ SQLite database connection established (development mode)');
}

async function seedSQLiteData(sqlite: Database.Database) {
  try {
    // Check if admin exists
    const adminExists = sqlite.prepare('SELECT id FROM users WHERE username = ?').get('admin');
    
    if (!adminExists) {
      const adminPassword = await bcrypt.hash("BiznesYordam2024!", 10);
      const adminId = nanoid();
      
      sqlite.prepare(`
        INSERT INTO users (id, username, email, password, first_name, last_name, phone, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(adminId, 'admin', 'admin@biznesyordam.uz', adminPassword, 'Bosh', 'Admin', '+998901234567', 'admin', 1);
      
      // Create admin permissions
      sqlite.prepare(`
        INSERT INTO admin_permissions (user_id, can_manage_admins, can_manage_content, can_manage_chat, can_view_reports, can_receive_products, can_activate_partners, can_manage_integrations)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(adminId, 1, 1, 1, 1, 1, 1, 1);
      
      // Create test partner
      const partnerPassword = await bcrypt.hash("Partner2024!", 10);
      const partnerUserId = nanoid();
      const partnerId = nanoid();
      
      sqlite.prepare(`
        INSERT INTO users (id, username, email, password, first_name, last_name, phone, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(partnerUserId, 'testpartner', 'partner@biznesyordam.uz', partnerPassword, 'Test', 'Partner', '+998901234567', 'partner', 1);
      
      sqlite.prepare(`
        INSERT INTO partners (id, user_id, business_name, business_category, monthly_revenue, pricing_tier, commission_rate, is_approved, approved_by, approved_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(partnerId, partnerUserId, 'Test Biznes', 'electronics', '25000000', 'business_standard', '0.20', 1, adminId, new Date().toISOString());
      
      // Create pricing tiers
      const tiers = [
        {
          id: nanoid(),
          tier: 'starter_pro',
          nameUz: 'Starter Pro',
          fixedCost: '0',
          commissionMin: '0.30',
          commissionMax: '0.45',
          minRevenue: '0',
          maxRevenue: '50000000',
          features: JSON.stringify(['45-30% komissiya', 'Asosiy fulfillment', '1 marketplace', 'Email qo\'llab-quvvatlash'])
        },
        {
          id: nanoid(),
          tier: 'business_standard',
          nameUz: 'Business Standard',
          fixedCost: '4500000',
          commissionMin: '0.18',
          commissionMax: '0.25',
          minRevenue: '10000000',
          maxRevenue: '200000000',
          features: JSON.stringify(['25-18% komissiya', 'Professional fulfillment', '3 marketplace', 'Telefon qo\'llab-quvvatlash'])
        },
        {
          id: nanoid(),
          tier: 'professional_plus',
          nameUz: 'Professional Plus',
          fixedCost: '8500000',
          commissionMin: '0.15',
          commissionMax: '0.20',
          minRevenue: '50000000',
          maxRevenue: '500000000',
          features: JSON.stringify(['20-15% komissiya', 'Premium fulfillment', 'Barcha marketplace', '24/7 qo\'llab-quvvatlash'])
        },
        {
          id: nanoid(),
          tier: 'enterprise_elite',
          nameUz: 'Enterprise Elite',
          fixedCost: '0',
          commissionMin: '0.12',
          commissionMax: '0.18',
          minRevenue: '100000000',
          maxRevenue: null,
          features: JSON.stringify(['18-12% komissiya', 'VIP fulfillment', 'Custom integrations', 'Dedicated manager'])
        }
      ];
      
      for (const tier of tiers) {
        sqlite.prepare(`
          INSERT INTO pricing_tiers (id, tier, name_uz, fixed_cost, commission_min, commission_max, min_revenue, max_revenue, features, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(tier.id, tier.tier, tier.nameUz, tier.fixedCost, tier.commissionMin, tier.commissionMax, tier.minRevenue, tier.maxRevenue || null, tier.features, 1);
      }
      
      // Create sample trending products
      const trendingProductsData = [
        {
          id: nanoid(),
          productName: 'Wireless Bluetooth Earbuds Pro',
          category: 'electronics',
          description: 'Premium wireless earbuds with active noise cancellation and 30-hour battery life',
          sourceMarket: 'amazon',
          sourceUrl: 'https://amazon.com/example-product',
          currentPrice: '45',
          estimatedCostPrice: '15',
          estimatedSalePrice: '65',
          profitPotential: '35',
          searchVolume: 125000,
          trendScore: 85,
          competitionLevel: 'medium',
          keywords: JSON.stringify(['wireless earbuds', 'bluetooth headphones', 'noise cancelling']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'])
        },
        {
          id: nanoid(),
          productName: 'Smart Home Security Camera 4K',
          category: 'electronics',
          description: 'WiFi-enabled 4K security camera with night vision and mobile app control',
          sourceMarket: 'aliexpress',
          sourceUrl: 'https://aliexpress.com/example-camera',
          currentPrice: '75',
          estimatedCostPrice: '25',
          estimatedSalePrice: '120',
          profitPotential: '70',
          searchVolume: 89000,
          trendScore: 78,
          competitionLevel: 'low',
          keywords: JSON.stringify(['security camera', 'smart home', '4k camera', 'wifi camera']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'])
        }
      ];
      
      for (const product of trendingProductsData) {
        sqlite.prepare(`
          INSERT INTO trending_products (id, product_name, category, description, source_market, source_url, current_price, estimated_cost_price, estimated_sale_price, profit_potential, search_volume, trend_score, competition_level, keywords, images)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(product.id, product.productName, product.category, product.description, product.sourceMarket, product.sourceUrl, product.currentPrice, product.estimatedCostPrice, product.estimatedSalePrice, product.profitPotential, product.searchVolume, product.trendScore, product.competitionLevel, product.keywords, product.images);
      }
      
      // Create sample profit breakdown
      const profitData = {
        id: nanoid(),
        partnerId: partnerId,
        date: new Date().toISOString(),
        marketplace: 'uzum',
        totalRevenue: '5440000',
        fulfillmentCosts: '752000',
        marketplaceCommission: '544000',
        productCosts: '2176000',
        taxCosts: '163200',
        logisticsCosts: '320000',
        sptCosts: '180000',
        netProfit: '1304800',
        profitMargin: '24.0',
        ordersCount: 96
      };
      
      sqlite.prepare(`
        INSERT INTO profit_breakdown (id, partner_id, date, marketplace, total_revenue, fulfillment_costs, marketplace_commission, product_costs, tax_costs, logistics_costs, spt_costs, net_profit, profit_margin, orders_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(profitData.id, profitData.partnerId, profitData.date, profitData.marketplace, profitData.totalRevenue, profitData.fulfillmentCosts, profitData.marketplaceCommission, profitData.productCosts, profitData.taxCosts, profitData.logisticsCosts, profitData.sptCosts, profitData.netProfit, profitData.profitMargin, profitData.ordersCount);
      
      console.log('✅ SQLite initial data seeded');
    }
  } catch (error) {
    console.error('Error seeding SQLite data:', error);
  }
}

// Export database info
export function getDatabaseInfo() {
  return {
    type: isPostgreSQL ? 'postgresql' : 'sqlite',
    isConnected: !!db,
    connectionString: isPostgreSQL ? 'PostgreSQL' : 'SQLite'
  };
}
export { db };