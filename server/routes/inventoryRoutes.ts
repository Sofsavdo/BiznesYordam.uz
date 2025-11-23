// Inventory Tracking Routes

import { Router } from 'express';
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryLocation,
  markAsSold,
  getInventoryMovements,
  getWarehouseZones
} from '../controllers/inventoryController';

const router = Router();

// Inventory items
router.get('/items', getInventoryItems);
router.post('/items', createInventoryItem);
router.put('/items/:id/location', updateInventoryLocation);
router.put('/items/:id/sold', markAsSold);

// Movements
router.get('/items/:inventoryItemId/movements', getInventoryMovements);

// Warehouse zones
router.get('/zones', getWarehouseZones);

export default router;
