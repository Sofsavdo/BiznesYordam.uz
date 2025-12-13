// Partner Advanced Features Routes - For Partner Dashboard
// Inventory Forecasting, Advanced Reporting (Both Local & SaaS models)

import express, { Request, Response } from 'express';
import { asyncHandler } from '../errorHandler';
import { inventoryForecasting } from '../services/inventoryForecasting';
import { advancedReporting } from '../services/advancedReporting';

const router = express.Router();

// ==================== INVENTORY FORECASTING ====================
// Available for both Local Full-Service and Remote AI SaaS

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
// Available for both Local Full-Service and Remote AI SaaS

// Generate sales report
router.post('/reports/sales', asyncHandler(async (req: Request, res: Response) => {
  const partner = (req as any).partner;
  const config = req.body;
  
  // Add partner filter
  if (!config.filters) {
    config.filters = {};
  }
  config.filters.partnerId = partner.id;
  
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
