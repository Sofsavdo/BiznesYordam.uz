// Admin Advanced Features Routes - For Internal Operations
// Order Rule Engine, Warehouse Management (Local Full-Service only)

import express, { Request, Response } from 'express';
import { asyncHandler } from '../errorHandler';
import { orderRuleEngine } from '../services/orderRuleEngine';
import { warehouseManagement } from '../services/warehouseManagement';

const router = express.Router();

// ==================== ORDER RULE ENGINE (ADMIN ONLY) ====================
// For internal fulfillment automation

// Get all rules
router.get('/order-rules', asyncHandler(async (req: Request, res: Response) => {
  const rules = orderRuleEngine.getRules();
  res.json(rules);
}));

// Add custom rule
router.post('/order-rules', asyncHandler(async (req: Request, res: Response) => {
  const rule = req.body;
  orderRuleEngine.addRule(rule);
  res.status(201).json({ message: 'Rule added successfully', rule });
}));

// Update rule
router.put('/order-rules/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  orderRuleEngine.updateRule(id, updates);
  res.json({ message: 'Rule updated successfully' });
}));

// Delete rule
router.delete('/order-rules/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  orderRuleEngine.deleteRule(id);
  res.json({ message: 'Rule deleted successfully' });
}));

// Toggle rule
router.patch('/order-rules/:id/toggle', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { enabled } = req.body;
  orderRuleEngine.toggleRule(id, enabled);
  res.json({ message: 'Rule toggled successfully' });
}));

// Process order through rule engine
router.post('/order-rules/process', asyncHandler(async (req: Request, res: Response) => {
  const order = req.body;
  const result = await orderRuleEngine.processOrder(order);
  res.json(result);
}));

// ==================== WAREHOUSE MANAGEMENT (ADMIN ONLY) ====================
// For Local Full-Service model only

// Generate barcode for product
router.post('/warehouse/barcode/generate', asyncHandler(async (req: Request, res: Response) => {
  const { productId, sku } = req.body;
  const barcode = warehouseManagement.generateBarcode(productId, sku);
  res.json({ barcode });
}));

// Scan barcode
router.post('/warehouse/barcode/scan', asyncHandler(async (req: Request, res: Response) => {
  const { barcode } = req.body;
  const product = await warehouseManagement.scanBarcode(barcode);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
}));

// Generate pick list for order
router.post('/warehouse/pick-list/generate', asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const pickList = await warehouseManagement.generatePickList(orderId);
  res.json(pickList);
}));

// Mark item as picked
router.post('/warehouse/pick-list/:id/pick', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;
  await warehouseManagement.markItemPicked(id, productId, quantity);
  res.json({ message: 'Item marked as picked' });
}));

// Complete pick list
router.post('/warehouse/pick-list/:id/complete', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await warehouseManagement.completePickList(id);
  res.json({ message: 'Pick list completed' });
}));

// Generate packing slip
router.post('/warehouse/packing-slip/generate', asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const packingSlip = await warehouseManagement.generatePackingSlip(orderId);
  res.json(packingSlip);
}));

// Print packing slip
router.get('/warehouse/packing-slip/:id/print', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const html = await warehouseManagement.printPackingSlip(id);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}));

// Get warehouse zones
router.get('/warehouse/zones', asyncHandler(async (req: Request, res: Response) => {
  const zones = await warehouseManagement.getWarehouseZones();
  res.json(zones);
}));

// Get zone utilization
router.get('/warehouse/zones/:id/utilization', asyncHandler(async (req: Request, res: Response) => {
  const zones = await warehouseManagement.getWarehouseZones();
  const zone = zones.find(z => z.id === req.params.id);
  
  if (!zone) {
    return res.status(404).json({ message: 'Zone not found' });
  }
  
  const utilization = warehouseManagement.getZoneUtilization(zone);
  res.json({ zone: zone.name, utilization });
}));

// Record inventory movement
router.post('/warehouse/movement', asyncHandler(async (req: Request, res: Response) => {
  const { productId, fromLocation, toLocation, quantity, reason } = req.body;
  await warehouseManagement.recordMovement(productId, fromLocation, toLocation, quantity, reason);
  res.json({ message: 'Movement recorded successfully' });
}));

// Get warehouse performance metrics
router.get('/warehouse/performance', asyncHandler(async (req: Request, res: Response) => {
  const metrics = await warehouseManagement.getPerformanceMetrics();
  res.json(metrics);
}));

export default router;
