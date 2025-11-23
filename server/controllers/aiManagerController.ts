// server/controllers/aiManagerController.ts
// AI AUTONOMOUS MANAGER - API Controllers

import { Request, Response } from 'express';
import { db } from '../db';
import aiManagerService from '../services/aiManagerService';

// ================================================================
// 1. CREATE AI PRODUCT CARD
// ================================================================
export async function createAIProductCard(req: Request, res: Response) {
  try {
    const { name, category, description, price, images, targetMarketplace } = req.body;
    const partnerId = req.user?.partnerId;

    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name || !targetMarketplace) {
      return res.status(400).json({ error: 'name va targetMarketplace majburiy' });
    }

    const result = await aiManagerService.generateProductCard(
      {
        name,
        category,
        description,
        price,
        images,
        targetMarketplace,
      },
      partnerId
    );

    res.json(result);
  } catch (error: any) {
    console.error('AI Product Card Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 2. GET AI GENERATED PRODUCTS
// ================================================================
export async function getAIGeneratedProducts(req: Request, res: Response) {
  try {
    const partnerId = req.user?.partnerId;
    const { status, marketplace } = req.query;

    if (!partnerId && req.user?.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let query = db.select().from('ai_generated_products');

    if (partnerId) {
      query = query.where({ partner_id: partnerId });
    }

    if (status) {
      query = query.where({ status: status as string });
    }

    if (marketplace) {
      query = query.where({ marketplace_type: marketplace as string });
    }

    const products = await query.orderBy('created_at', 'desc');

    res.json(products);
  } catch (error: any) {
    console.error('Get AI Products Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 3. APPROVE/REJECT AI PRODUCT
// ================================================================
export async function reviewAIProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // 'approve' or 'reject'
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    await db
      .update('ai_generated_products')
      .set({
        status: newStatus,
        human_reviewed: true,
        human_reviewer_id: userId,
        human_notes: notes,
        reviewed_at: new Date(),
      })
      .where({ id: parseInt(id) });

    res.json({ success: true, status: newStatus });
  } catch (error: any) {
    console.error('Review AI Product Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 4. AUTO-UPLOAD TO MARKETPLACE
// ================================================================
export async function uploadToMarketplace(req: Request, res: Response) {
  try {
    const { productId, marketplaceType } = req.body;
    const partnerId = req.user?.partnerId;

    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get marketplace credentials
    const [credentials] = await db
      .select()
      .from('marketplace_credentials')
      .where({
        partner_id: partnerId,
        marketplace_type: marketplaceType,
        is_active: true,
      });

    if (!credentials) {
      return res.status(400).json({
        error: 'Marketplace credentials topilmadi. Avval integratsiya qiling.',
      });
    }

    const result = await aiManagerService.autoUploadToMarketplace(
      productId,
      marketplaceType,
      credentials
    );

    res.json(result);
  } catch (error: any) {
    console.error('Upload to Marketplace Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 5. OPTIMIZE PRICE
// ================================================================
export async function optimizePrice(req: Request, res: Response) {
  try {
    const { productId, marketplaceType } = req.body;
    const partnerId = req.user?.partnerId;

    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await aiManagerService.optimizePrice(
      partnerId,
      productId,
      marketplaceType
    );

    res.json(result);
  } catch (error: any) {
    console.error('Optimize Price Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 6. MONITOR PARTNER (Admin or Partner)
// ================================================================
export async function monitorPartner(req: Request, res: Response) {
  try {
    const { partnerId } = req.params;
    const requestUserId = req.user?.id;
    const requestUserPartnerId = req.user?.partnerId;

    // Check authorization
    if (
      req.user?.role !== 'admin' &&
      requestUserPartnerId !== parseInt(partnerId)
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = await aiManagerService.monitorPartnerProducts(
      parseInt(partnerId)
    );

    res.json(result);
  } catch (error: any) {
    console.error('Monitor Partner Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 7. GET AI ALERTS
// ================================================================
export async function getAIAlerts(req: Request, res: Response) {
  try {
    const partnerId = req.user?.partnerId;
    const { status, severity } = req.query;

    if (!partnerId && req.user?.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let query = db.select().from('ai_monitoring_alerts');

    if (partnerId) {
      query = query.where({ partner_id: partnerId });
    }

    if (status) {
      query = query.where({ status: status as string });
    }

    if (severity) {
      query = query.where({ severity: severity as string });
    }

    const alerts = await query.orderBy('created_at', 'desc').limit(100);

    res.json(alerts);
  } catch (error: any) {
    console.error('Get AI Alerts Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 8. RESOLVE AI ALERT
// ================================================================
export async function resolveAlert(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { resolution, resolvedBy } = req.body;

    await db
      .update('ai_monitoring_alerts')
      .set({
        status: 'resolved',
        resolved_at: new Date(),
        resolved_by: resolvedBy || 'admin',
        resolution_notes: resolution,
      })
      .where({ id: parseInt(id) });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Resolve Alert Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 9. GET AI TASKS
// ================================================================
export async function getAITasks(req: Request, res: Response) {
  try {
    const { status, taskType, partnerId } = req.query;

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    let query = db.select().from('ai_tasks');

    if (status) {
      query = query.where({ status: status as string });
    }

    if (taskType) {
      query = query.where({ task_type: taskType as string });
    }

    if (partnerId) {
      query = query.where({ partner_id: parseInt(partnerId as string) });
    }

    const tasks = await query.orderBy('created_at', 'desc').limit(100);

    res.json(tasks);
  } catch (error: any) {
    console.error('Get AI Tasks Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 10. GET AI ACTIONS LOG
// ================================================================
export async function getAIActionsLog(req: Request, res: Response) {
  try {
    const { partnerId, actionType, limit = 50 } = req.query;

    if (req.user?.role !== 'admin' && !req.user?.partnerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    let query = db.select().from('ai_actions_log');

    if (partnerId) {
      query = query.where({ partner_id: parseInt(partnerId as string) });
    } else if (req.user?.partnerId) {
      query = query.where({ partner_id: req.user.partnerId });
    }

    if (actionType) {
      query = query.where({ action_type: actionType as string });
    }

    const actions = await query
      .orderBy('executed_at', 'desc')
      .limit(parseInt(limit as string));

    res.json(actions);
  } catch (error: any) {
    console.error('Get AI Actions Log Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 11. GET AI PERFORMANCE METRICS
// ================================================================
export async function getAIPerformanceMetrics(req: Request, res: Response) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const { days = 7 } = req.query;

    const metrics = await db
      .select()
      .from('ai_performance_metrics')
      .orderBy('date', 'desc')
      .limit(parseInt(days as string));

    // Calculate totals
    const totals = metrics.reduce(
      (acc, m) => ({
        totalTasks: acc.totalTasks + (m.total_tasks_executed || 0),
        successfulTasks: acc.successfulTasks + (m.successful_tasks || 0),
        failedTasks: acc.failedTasks + (m.failed_tasks || 0),
        totalCost: acc.totalCost + parseFloat(m.total_cost_usd || '0'),
        productsCreated: acc.productsCreated + (m.products_created || 0),
        pricesOptimized: acc.pricesOptimized + (m.prices_optimized || 0),
        issuesDetected: acc.issuesDetected + (m.issues_detected || 0),
        issuesResolved: acc.issuesResolved + (m.issues_resolved || 0),
      }),
      {
        totalTasks: 0,
        successfulTasks: 0,
        failedTasks: 0,
        totalCost: 0,
        productsCreated: 0,
        pricesOptimized: 0,
        issuesDetected: 0,
        issuesResolved: 0,
      }
    );

    res.json({
      metrics,
      totals,
      successRate:
        totals.totalTasks > 0
          ? ((totals.successfulTasks / totals.totalTasks) * 100).toFixed(2)
          : 0,
    });
  } catch (error: any) {
    console.error('Get AI Metrics Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 12. GET AI MANAGER CONFIG
// ================================================================
export async function getAIManagerConfig(req: Request, res: Response) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const [config] = await db.select().from('ai_manager_config').where({ id: 1 });

    res.json(config || {});
  } catch (error: any) {
    console.error('Get AI Config Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 13. UPDATE AI MANAGER CONFIG
// ================================================================
export async function updateAIManagerConfig(req: Request, res: Response) {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const updates = req.body;

    await db
      .update('ai_manager_config')
      .set({ ...updates, updated_at: new Date() })
      .where({ id: 1 });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Update AI Config Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 14. SAVE MARKETPLACE CREDENTIALS
// ================================================================
export async function saveMarketplaceCredentials(req: Request, res: Response) {
  try {
    const partnerId = req.user?.partnerId;
    const { marketplaceType, apiKey, apiSecret, sellerId } = req.body;

    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!marketplaceType || !apiKey) {
      return res.status(400).json({ error: 'marketplaceType va apiKey majburiy' });
    }

    // Check if exists
    const [existing] = await db
      .select()
      .from('marketplace_credentials')
      .where({
        partner_id: partnerId,
        marketplace_type: marketplaceType,
      });

    if (existing) {
      // Update
      await db
        .update('marketplace_credentials')
        .set({
          api_key: apiKey,
          api_secret: apiSecret,
          seller_id: sellerId,
          updated_at: new Date(),
        })
        .where({ id: existing.id });
    } else {
      // Insert
      await db.insert('marketplace_credentials').values({
        partner_id: partnerId,
        marketplace_type: marketplaceType,
        api_key: apiKey,
        api_secret: apiSecret,
        seller_id: sellerId,
      });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Save Marketplace Credentials Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ================================================================
// 15. GET MARKETPLACE CREDENTIALS
// ================================================================
export async function getMarketplaceCredentials(req: Request, res: Response) {
  try {
    const partnerId = req.user?.partnerId;

    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const credentials = await db
      .select()
      .from('marketplace_credentials')
      .where({ partner_id: partnerId });

    // Don't send sensitive data to frontend
    const safeCredentials = credentials.map((c) => ({
      id: c.id,
      marketplace_type: c.marketplace_type,
      is_active: c.is_active,
      is_verified: c.is_verified,
      last_verified: c.last_verified,
      integration_status: c.integration_status,
      last_sync: c.last_sync,
      seller_id: c.seller_id,
      has_credentials: !!c.api_key,
    }));

    res.json(safeCredentials);
  } catch (error: any) {
    console.error('Get Marketplace Credentials Error:', error);
    res.status(500).json({ error: error.message });
  }
}
