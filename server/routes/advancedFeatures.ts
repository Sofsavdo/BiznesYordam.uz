// Advanced Features Routes - Order Rules, Forecasting, Reporting
import express, { Request, Response } from 'express';
import { asyncHandler } from '../errorHandler';
import { orderRuleEngine } from '../services/orderRuleEngine';
import { inventoryForecasting } from '../services/inventoryForecasting';
import { advancedReporting } from '../services/advancedReporting';

const router = express.Router();

// ==================== ORDER RULE ENGINE ====================

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

// Process order through rule engine (for testing)
router.post('/order-rules/process', asyncHandler(async (req: Request, res: Response) => {
  const order = req.body;
  const result = await orderRuleEngine.processOrder(order);
  res.json(result);
}));

// ==================== INVENTORY FORECASTING ====================

// Forecast single product
router.get('/inventory-forecast/:productId', asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const forecast = await inventoryForecasting.forecastProduct(productId);
  
  if (!forecast) {
    return res.status(404).json({ message: 'Product not found or no data available' });
  }
  
  res.json(forecast);
}));

// Forecast all products for partner
router.get('/inventory-forecast', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = (req as any).partner;
  
  if (!partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }
  
  const forecasts = await inventoryForecasting.forecastAllProducts(partner.id);
  res.json(forecasts);
}));

// Get reorder list
router.get('/inventory-forecast/reorder-list', asyncHandler(async (req: Request, res: Response) => {
  const partner = (req as any).partner;
  
  if (!partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }
  
  const reorderList = await inventoryForecasting.getReorderList(partner.id);
  res.json(reorderList);
}));

// Get overstocked products
router.get('/inventory-forecast/overstocked', asyncHandler(async (req: Request, res: Response) => {
  const partner = (req as any).partner;
  
  if (!partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }
  
  const overstocked = await inventoryForecasting.getOverstockedProducts(partner.id);
  res.json(overstocked);
}));

// ==================== ADVANCED REPORTING ====================

// Generate sales report
router.post('/reports/sales', asyncHandler(async (req: Request, res: Response) => {
  const config = req.body;
  const report = await advancedReporting.generateSalesReport(config);
  res.json(report);
}));

// Generate inventory report
router.get('/reports/inventory', asyncHandler(async (req: Request, res: Response) => {
  const partner = (req as any).partner;
  
  if (!partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }
  
  const report = await advancedReporting.generateInventoryReport(partner.id);
  res.json(report);
}));

// Generate performance report
router.post('/reports/performance', asyncHandler(async (req: Request, res: Response) => {
  const partner = (req as any).partner;
  const config = req.body;
  
  if (!partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }
  
  const report = await advancedReporting.generatePerformanceReport(partner.id, config);
  res.json(report);
}));

// Export report to Excel
router.post('/reports/export/excel', asyncHandler(async (req: Request, res: Response) => {
  const reportData = req.body;
  const buffer = await advancedReporting.exportToExcel(reportData);
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${reportData.title}.xlsx"`);
  res.send(buffer);
}));

// Export report to PDF
router.post('/reports/export/pdf', asyncHandler(async (req: Request, res: Response) => {
  const reportData = req.body;
  const buffer = await advancedReporting.exportToPDF(reportData);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${reportData.title}.pdf"`);
  res.send(buffer);
}));

export default router;
