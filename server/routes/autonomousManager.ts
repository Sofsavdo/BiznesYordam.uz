// Autonomous Manager Routes - Zero Human Intervention
// Partner just enables automation, AI does everything

import express, { Request, Response } from 'express';
import { autonomousProductManager } from '../services/autonomousProductManager';
// Lazy load marketplace manager to avoid circular dependencies
let marketplaceManager: any = null;
async function getMarketplaceManager() {
  if (!marketplaceManager) {
    const module = await import('../marketplace/manager');
    marketplaceManager = module.marketplaceManager;
  }
  return marketplaceManager;
}

const router = express.Router();

// ==================== AUTOMATION CONTROL ====================

/**
 * Start autonomous automation for partner
 * POST /api/autonomous/start
 */
router.post('/start', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      enabledMarketplaces = ['wildberries', 'uzum', 'ozon', 'trendyol'],
      autoSync = true,
      autoGenerateCards = true,
      autoPublish = false,
      syncInterval = 60 // minutes
    } = req.body;

    await autonomousProductManager.startAutomation({
      partnerId,
      enabledMarketplaces,
      autoSync,
      autoGenerateCards,
      autoPublish,
      syncInterval
    });

    res.json({
      success: true,
      message: 'Autonomous automation started',
      config: {
        enabledMarketplaces,
        autoSync,
        autoGenerateCards,
        autoPublish,
        syncInterval
      }
    });

  } catch (error: any) {
    console.error('Start automation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Stop autonomous automation
 * POST /api/autonomous/stop
 */
router.post('/stop', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    autonomousProductManager.stopAutomation(partnerId);

    res.json({
      success: true,
      message: 'Autonomous automation stopped'
    });

  } catch (error: any) {
    console.error('Stop automation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get automation status
 * GET /api/autonomous/status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const status = autonomousProductManager.getAutomationStatus(partnerId);

    res.json({
      success: true,
      status
    });

  } catch (error: any) {
    console.error('Get status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== MANUAL TRIGGERS ====================

/**
 * Manually trigger product sync
 * POST /api/autonomous/sync
 */
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { marketplaces = ['wildberries', 'uzum', 'ozon', 'trendyol'] } = req.body;

    const result = await autonomousProductManager.manualSync(partnerId, marketplaces);

    res.json({
      success: true,
      ...result
    });

  } catch (error: any) {
    console.error('Manual sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Manually generate cards for products
 * POST /api/autonomous/generate-cards
 */
router.post('/generate-cards', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      productIds,
      targetMarketplaces = ['wildberries', 'uzum', 'ozon', 'trendyol']
    } = req.body;

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ error: 'Product IDs array required' });
    }

    const results = await autonomousProductManager.manualGenerateCards(
      partnerId,
      productIds,
      targetMarketplaces
    );

    const totalCost = results.reduce((sum, r) => sum + r.totalCost, 0);
    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount,
        totalCost
      }
    });

  } catch (error: any) {
    console.error('Generate cards error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate single product card set
 * POST /api/autonomous/generate-single
 */
router.post('/generate-single', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      product,
      targetMarketplaces = ['wildberries', 'uzum', 'ozon', 'trendyol']
    } = req.body;

    if (!product) {
      return res.status(400).json({ error: 'Product data required' });
    }

    const result = await autonomousProductManager.generateProductCardSet(
      partnerId,
      product,
      targetMarketplaces
    );

    res.json({
      success: result.success,
      result
    });

  } catch (error: any) {
    console.error('Generate single card error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== MARKETPLACE STATS ====================

/**
 * Get combined marketplace statistics
 * GET /api/autonomous/marketplace-stats
 */
router.get('/marketplace-stats', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const manager = await getMarketplaceManager();
    const stats = await manager.getCombinedStats(partnerId);

    res.json({
      success: true,
      stats
    });

  } catch (error: any) {
    console.error('Get marketplace stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all active automations (admin only)
 * GET /api/autonomous/all-active
 */
router.get('/all-active', async (req: Request, res: Response) => {
  try {
    const role = (req.user as any)?.role;
    
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const activeAutomations = autonomousProductManager.getAllActiveAutomations();

    res.json({
      success: true,
      activeAutomations,
      count: activeAutomations.length
    });

  } catch (error: any) {
    console.error('Get all active error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
