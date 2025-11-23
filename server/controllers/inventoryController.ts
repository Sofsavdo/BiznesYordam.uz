// Inventory Tracking Controller
// Real-time tovar kuzatuvi API

import { Request, Response } from 'express';
import { db } from '../db';
import { nanoid } from 'nanoid';

// Barcha inventory items
export async function getInventoryItems(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const items = await db.query(
      `SELECT i.*, p.name as product_name, p.category
       FROM inventory_items i
       JOIN products p ON i.product_id = p.id
       WHERE i.partner_id = ?
       ORDER BY i.created_at DESC`,
      [partnerId]
    );

    res.json(items);
  } catch (error: any) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: error.message });
  }
}

// Inventory item qo'shish
export async function createInventoryItem(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const {
      productId,
      uniqueCode,
      batchNumber,
      locationType,
      currentLocation,
      marketplace,
      warehouseZone,
      shelfNumber,
      purchasePrice,
      investorId,
      purchaseDate
    } = req.body;

    const id = nanoid();
    const now = new Date().toISOString();

    await db.query(
      `INSERT INTO inventory_items (
        id, product_id, partner_id, unique_code, batch_number,
        location_type, current_location, marketplace, warehouse_zone,
        shelf_number, status, purchase_price, investor_id, purchase_date,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, productId, partnerId, uniqueCode, batchNumber || null,
        locationType, currentLocation || null, marketplace || null,
        warehouseZone || null, shelfNumber || null, 'available',
        purchasePrice, investorId || null, purchaseDate, now, now
      ]
    );

    // Movement qo'shish
    await createMovement({
      inventoryItemId: id,
      toLocation: currentLocation || 'warehouse',
      movementType: 'receiving',
      performedBy: (req.user as any)?.id,
      notes: 'Tovar qabul qilindi'
    });

    res.status(201).json({ id, message: 'Inventory item yaratildi' });
  } catch (error: any) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: error.message });
  }
}

// Inventory item joylashuvini yangilash
export async function updateInventoryLocation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { locationType, currentLocation, marketplace, warehouseZone, shelfNumber, status } = req.body;

    const item = await db.query('SELECT * FROM inventory_items WHERE id = ?', [id]);
    if (!item || item.length === 0) {
      return res.status(404).json({ error: 'Item topilmadi' });
    }

    const oldLocation = item[0].current_location;
    const now = new Date().toISOString();

    await db.query(
      `UPDATE inventory_items
       SET location_type = ?, current_location = ?, marketplace = ?,
           warehouse_zone = ?, shelf_number = ?, status = ?, updated_at = ?
       WHERE id = ?`,
      [
        locationType || item[0].location_type,
        currentLocation || item[0].current_location,
        marketplace || item[0].marketplace,
        warehouseZone || item[0].warehouse_zone,
        shelfNumber || item[0].shelf_number,
        status || item[0].status,
        now,
        id
      ]
    );

    // Movement qo'shish
    await createMovement({
      inventoryItemId: id,
      fromLocation: oldLocation,
      toLocation: currentLocation || item[0].current_location,
      movementType: 'transfer',
      performedBy: (req.user as any)?.id,
      notes: 'Joylashuv yangilandi'
    });

    res.json({ message: 'Joylashuv yangilandi' });
  } catch (error: any) {
    console.error('Error updating inventory location:', error);
    res.status(500).json({ error: error.message });
  }
}

// Inventory item sotilganda
export async function markAsSold(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { salePrice, marketplace } = req.body;
    const now = new Date().toISOString();

    await db.query(
      `UPDATE inventory_items
       SET status = 'sold', sale_price = ?, sold_date = ?, 
           location_type = 'sold', marketplace = ?, updated_at = ?
       WHERE id = ?`,
      [salePrice, now, marketplace, now, id]
    );

    // Movement qo'shish
    await createMovement({
      inventoryItemId: id,
      toLocation: `marketplace:${marketplace}`,
      movementType: 'sale',
      performedBy: (req.user as any)?.id,
      notes: `Sotildi: ${salePrice} so'm`
    });

    res.json({ message: 'Tovar sotilgan deb belgilandi' });
  } catch (error: any) {
    console.error('Error marking as sold:', error);
    res.status(500).json({ error: error.message });
  }
}

// Inventory movements
export async function getInventoryMovements(req: Request, res: Response) {
  try {
    const { inventoryItemId } = req.params;

    const movements = await db.query(
      `SELECT m.*, u.first_name, u.last_name
       FROM inventory_movements m
       JOIN users u ON m.performed_by = u.id
       WHERE m.inventory_item_id = ?
       ORDER BY m.created_at DESC`,
      [inventoryItemId]
    );

    res.json(movements);
  } catch (error: any) {
    console.error('Error fetching movements:', error);
    res.status(500).json({ error: error.message });
  }
}

// Warehouse zones
export async function getWarehouseZones(req: Request, res: Response) {
  try {
    const zones = await db.query(
      'SELECT * FROM warehouse_zones WHERE is_active = ? ORDER BY code',
      [true]
    );
    res.json(zones);
  } catch (error: any) {
    console.error('Error fetching warehouse zones:', error);
    res.status(500).json({ error: error.message });
  }
}

// Helper function - movement yaratish
async function createMovement(data: {
  inventoryItemId: string;
  fromLocation?: string;
  toLocation: string;
  movementType: string;
  performedBy: string;
  notes?: string;
}) {
  const id = nanoid();
  const now = new Date().toISOString();

  await db.query(
    `INSERT INTO inventory_movements (
      id, inventory_item_id, from_location, to_location,
      movement_type, performed_by, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.inventoryItemId,
      data.fromLocation || null,
      data.toLocation,
      data.movementType,
      data.performedBy,
      data.notes || null,
      now
    ]
  );
}
