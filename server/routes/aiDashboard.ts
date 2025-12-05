// AI Dashboard Routes - Partner view-only dashboard

import { Router, Request, Response, NextFunction } from 'express';

// Auth middleware (inline since we don't have separate auth middleware file)
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ 
      message: "Avtorizatsiya yo'q",
      code: "UNAUTHORIZED"
    });
  }
  next();
}
import {
  getPartnerDashboard,
  getAIActivityLog,
  getTrendRecommendations,
  getInventoryAlerts,
  getPerformanceMetrics,
  getAIReports,
} from '../controllers/partnerAIDashboardController';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Dashboard overview
router.get('/dashboard', getPartnerDashboard);

// AI activity log
router.get('/activity', getAIActivityLog);

// Trend recommendations
router.get('/trends', getTrendRecommendations);

// Inventory alerts
router.get('/inventory-alerts', getInventoryAlerts);

// Performance metrics
router.get('/metrics', getPerformanceMetrics);

// AI reports
router.get('/reports', getAIReports);

export default router;
