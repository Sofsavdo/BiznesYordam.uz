# 🗄️ Database Migration Guide

## Current Status

### Existing Migration
- File: `migrations/0000_bent_kulan_gath.sql`
- Created: Nov 6, 2025
- Status: ⚠️ **OUTDATED** - Missing new inventory tables

### New Schema Changes
The following tables and enums are missing from current migration:

#### New Enums:
```sql
CREATE TYPE "stock_status" AS ENUM('in_stock', 'low_stock', 'out_of_stock', 'discontinued');
CREATE TYPE "movement_type" AS ENUM('inbound', 'outbound', 'transfer', 'adjustment', 'return');
CREATE TYPE "order_status" AS ENUM('pending', 'confirmed', 'picking', 'packed', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE "payment_status" AS ENUM('pending', 'paid', 'refunded', 'failed');
CREATE TYPE "fulfillment_status" AS ENUM('pending', 'processing', 'ready', 'shipped', 'completed');
```

#### New Tables:
1. **warehouses** - Multi-warehouse support
2. **warehouse_stock** - Stock per warehouse
3. **stock_movements** - Complete audit trail
4. **orders** - Order management
5. **order_items** - Order line items
6. **customers** - Customer database
7. **stock_alerts** - Automated alerts
8. **inventory_reports** - Analytics reports

#### Updated Tables:
**products** table now includes:
```sql
current_stock INTEGER DEFAULT 0
reserved_stock INTEGER DEFAULT 0
available_stock INTEGER DEFAULT 0
min_stock_level INTEGER DEFAULT 10
max_stock_level INTEGER DEFAULT 1000
reorder_quantity INTEGER DEFAULT 50
stock_status stock_status DEFAULT 'out_of_stock'
last_stock_update TIMESTAMP DEFAULT now()
```

---

## Migration Options

### Option 1: Generate New Migration (RECOMMENDED)
```bash
# Generate migration from schema
npm run db:generate

# This will create a new migration file with all changes
# Review the generated SQL before applying
```

### Option 2: Manual Migration
If you prefer manual control, create migration file:

```sql
-- File: migrations/0001_inventory_system.sql

-- Add new enums
CREATE TYPE "stock_status" AS ENUM('in_stock', 'low_stock', 'out_of_stock', 'discontinued');
CREATE TYPE "movement_type" AS ENUM('inbound', 'outbound', 'transfer', 'adjustment', 'return');
CREATE TYPE "order_status" AS ENUM('pending', 'confirmed', 'picking', 'packed', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE "payment_status" AS ENUM('pending', 'paid', 'refunded', 'failed');
CREATE TYPE "fulfillment_status" AS ENUM('pending', 'processing', 'ready', 'shipped', 'completed');

-- Update products table
ALTER TABLE products 
ADD COLUMN current_stock INTEGER DEFAULT 0,
ADD COLUMN reserved_stock INTEGER DEFAULT 0,
ADD COLUMN available_stock INTEGER DEFAULT 0,
ADD COLUMN min_stock_level INTEGER DEFAULT 10,
ADD COLUMN max_stock_level INTEGER DEFAULT 1000,
ADD COLUMN reorder_quantity INTEGER DEFAULT 50,
ADD COLUMN stock_status stock_status DEFAULT 'out_of_stock',
ADD COLUMN last_stock_update TIMESTAMP DEFAULT now(),
ADD COLUMN manufacturer VARCHAR(255),
ADD COLUMN brand VARCHAR(255),
ADD COLUMN model VARCHAR(255);

-- Create warehouses table
CREATE TABLE warehouses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  capacity INTEGER DEFAULT 10000,
  current_utilization NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  manager_id VARCHAR REFERENCES users(id),
  contact_phone VARCHAR(20),
  operating_hours TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create warehouse_stock table
CREATE TABLE warehouse_stock (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id VARCHAR NOT NULL REFERENCES warehouses(id),
  product_id VARCHAR NOT NULL REFERENCES products(id),
  quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  available_quantity INTEGER DEFAULT 0,
  location VARCHAR(50),
  last_counted TIMESTAMP,
  last_movement TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create stock_movements table
CREATE TABLE stock_movements (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR NOT NULL REFERENCES products(id),
  warehouse_id VARCHAR NOT NULL REFERENCES warehouses(id),
  movement_type movement_type NOT NULL,
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  reference_type VARCHAR(50),
  reference_id VARCHAR(100),
  performed_by VARCHAR NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  partner_id VARCHAR NOT NULL REFERENCES partners(id),
  customer_id VARCHAR,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(255),
  marketplace marketplace NOT NULL,
  marketplace_order_id VARCHAR(100),
  order_date TIMESTAMP DEFAULT now(),
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  fulfillment_status fulfillment_status DEFAULT 'pending',
  subtotal NUMERIC(15,2) DEFAULT 0,
  shipping_cost NUMERIC(15,2) DEFAULT 0,
  tax NUMERIC(15,2) DEFAULT 0,
  marketplace_commission NUMERIC(15,2) DEFAULT 0,
  fulfillment_fee NUMERIC(15,2) DEFAULT 0,
  total_amount NUMERIC(15,2) DEFAULT 0,
  shipping_address TEXT,
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(100),
  estimated_delivery TIMESTAMP,
  actual_delivery TIMESTAMP,
  warehouse_id VARCHAR REFERENCES warehouses(id),
  picked_by VARCHAR REFERENCES users(id),
  packed_by VARCHAR REFERENCES users(id),
  picked_at TIMESTAMP,
  packed_at TIMESTAMP,
  shipped_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR NOT NULL REFERENCES orders(id),
  product_id VARCHAR NOT NULL REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(15,2) NOT NULL,
  discount NUMERIC(15,2) DEFAULT 0,
  tax NUMERIC(15,2) DEFAULT 0,
  total_price NUMERIC(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- Create customers table
CREATE TABLE customers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC(15,2) DEFAULT 0,
  average_order_value NUMERIC(15,2) DEFAULT 0,
  last_order_date TIMESTAMP,
  customer_segment VARCHAR(50) DEFAULT 'new',
  lifetime_value NUMERIC(15,2) DEFAULT 0,
  default_shipping_address TEXT,
  billing_address TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create stock_alerts table
CREATE TABLE stock_alerts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR NOT NULL REFERENCES products(id),
  partner_id VARCHAR NOT NULL REFERENCES partners(id),
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  message TEXT NOT NULL,
  current_stock INTEGER,
  threshold INTEGER,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  resolved_by VARCHAR REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Create inventory_reports table
CREATE TABLE inventory_reports (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(50) NOT NULL,
  partner_id VARCHAR REFERENCES partners(id),
  warehouse_id VARCHAR REFERENCES warehouses(id),
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  report_data TEXT NOT NULL,
  generated_by VARCHAR NOT NULL REFERENCES users(id),
  file_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_warehouse_stock_warehouse ON warehouse_stock(warehouse_id);
CREATE INDEX idx_warehouse_stock_product ON warehouse_stock(product_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_warehouse ON stock_movements(warehouse_id);
CREATE INDEX idx_stock_movements_created ON stock_movements(created_at DESC);
CREATE INDEX idx_orders_partner ON orders(partner_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_stock_alerts_partner ON stock_alerts(partner_id);
CREATE INDEX idx_stock_alerts_resolved ON stock_alerts(is_resolved);
```

### Option 3: Use Drizzle Push (Development Only)
```bash
# Push schema directly to database (no migration file)
npm run db:push

# ⚠️ WARNING: Only use in development
# This will sync schema without creating migration files
```

---

## Applying Migration

### For Fresh Database:
```bash
# Run all migrations
npm run db:migrate

# Or push schema
npm run db:push
```

### For Existing Database:
```bash
# 1. Backup database first!
pg_dump $DATABASE_URL > backup.sql

# 2. Generate migration
npm run db:generate

# 3. Review generated SQL
cat migrations/0001_*.sql

# 4. Apply migration
npm run db:migrate

# 5. Verify tables created
psql $DATABASE_URL -c "\dt"
```

---

## Rollback Plan

If migration fails:

### Option 1: Restore from Backup
```bash
psql $DATABASE_URL < backup.sql
```

### Option 2: Drop New Tables
```sql
DROP TABLE IF EXISTS inventory_reports CASCADE;
DROP TABLE IF EXISTS stock_alerts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS warehouse_stock CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;

DROP TYPE IF EXISTS fulfillment_status;
DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS order_status;
DROP TYPE IF EXISTS movement_type;
DROP TYPE IF EXISTS stock_status;

-- Revert products table changes
ALTER TABLE products 
DROP COLUMN IF EXISTS current_stock,
DROP COLUMN IF EXISTS reserved_stock,
DROP COLUMN IF EXISTS available_stock,
DROP COLUMN IF EXISTS min_stock_level,
DROP COLUMN IF EXISTS max_stock_level,
DROP COLUMN IF EXISTS reorder_quantity,
DROP COLUMN IF EXISTS stock_status,
DROP COLUMN IF EXISTS last_stock_update,
DROP COLUMN IF EXISTS manufacturer,
DROP COLUMN IF EXISTS brand,
DROP COLUMN IF EXISTS model;
```

---

## Verification

After migration, verify:

```sql
-- Check new enums
SELECT typname FROM pg_type WHERE typname IN (
  'stock_status', 'movement_type', 'order_status', 
  'payment_status', 'fulfillment_status'
);

-- Check new tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'warehouses', 'warehouse_stock', 'stock_movements',
  'orders', 'order_items', 'customers',
  'stock_alerts', 'inventory_reports'
);

-- Check products table columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN (
  'current_stock', 'reserved_stock', 'available_stock',
  'stock_status', 'min_stock_level'
);

-- Count records
SELECT 
  (SELECT COUNT(*) FROM warehouses) as warehouses,
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM orders) as orders;
```

---

## Production Deployment

### Before Deploy:
1. ✅ Backup production database
2. ✅ Test migration on staging database
3. ✅ Review all SQL statements
4. ✅ Plan rollback strategy
5. ✅ Schedule maintenance window

### During Deploy:
1. Put site in maintenance mode (optional)
2. Run migration
3. Verify tables created
4. Test critical endpoints
5. Remove maintenance mode

### After Deploy:
1. Monitor error logs
2. Check database performance
3. Verify data integrity
4. Test all features

---

## Notes

- Migration adds ~8 new tables
- Adds ~5 new enums
- Updates products table with ~11 new columns
- Creates ~15 indexes for performance
- Estimated migration time: 1-2 minutes
- Database size increase: ~50MB (empty tables)

**Always backup before migrating!** 🔒
