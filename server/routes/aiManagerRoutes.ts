// server/routes/aiManagerRoutes.ts
// AI AUTONOMOUS MANAGER - Routes

import { Router } from 'express';
import * as aiController from '../controllers/aiManagerController';

const router = Router();

// ================================================================
// AI PRODUCT GENERATION
// ================================================================
router.post('/products/generate', aiController.createAIProductCard);
router.get('/products', aiController.getAIGeneratedProducts);
router.post('/products/:id/review', aiController.reviewAIProduct);
router.post('/products/upload', aiController.uploadToMarketplace);

// ================================================================
// AI OPTIMIZATION
// ================================================================
router.post('/optimize/price', aiController.optimizePrice);

// ================================================================
// AI MONITORING
// ================================================================
router.post('/monitor/partner/:partnerId', aiController.monitorPartner);
router.get('/alerts', aiController.getAIAlerts);
router.post('/alerts/:id/resolve', aiController.resolveAlert);

// ================================================================
// AI TASKS & LOGS
// ================================================================
router.get('/tasks', aiController.getAITasks);
router.get('/actions-log', aiController.getAIActionsLog);

// ================================================================
// AI METRICS & CONFIG (Admin only)
// ================================================================
router.get('/metrics', aiController.getAIPerformanceMetrics);
router.get('/config', aiController.getAIManagerConfig);
router.put('/config', aiController.updateAIManagerConfig);

// ================================================================
// MARKETPLACE CREDENTIALS
// ================================================================
router.post('/credentials', aiController.saveMarketplaceCredentials);
router.get('/credentials', aiController.getMarketplaceCredentials);

export default router;
