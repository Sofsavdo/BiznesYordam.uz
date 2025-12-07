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
    // For now, only admins can view all AI product cards
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const { status, marketplace } = req.query;

    let sqlQuery = `
      SELECT 
        p.id,
        p.account_id,
        p.marketplace,
        p.base_product_name,
        p.optimized_title AS ai_title,
        p.optimized_description AS ai_description,
        p.seo_score,
        p.price AS suggested_price,
        p.status,
        p.created_at
      FROM ai_product_cards p
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      sqlQuery += ' AND p.status = ?';
      params.push(status);
    }

    if (marketplace) {
      sqlQuery += ' AND p.marketplace = ?';
      params.push(marketplace);
    }

    sqlQuery += ' ORDER BY p.created_at DESC LIMIT 100';

    const products = await db.all(sqlQuery, params);

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

    // In the new schema we keep status on ai_product_cards.
    const result = await db.run(
      `UPDATE ai_product_cards 
       SET status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [newStatus, parseInt(id, 10)]
    );

    res.json({ success: true, status: newStatus, updated: (result as any).changes ?? 0 });
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

    if (!productId || !marketplaceType) {
      return res.status(400).json({ error: 'productId va marketplaceType majburiy' });
    }

    // NOTE: In the current SQLite/0008 demo setup we do not execute real
    // marketplace API uploads. That logic is only enabled in full production
    // environments with proper API credentials.
    res.json({
      success: false,
      message:
        "Marketplace'ga avtomatik yuklash faqat production integratsiya bilan ishlaydi (demo rejimida o'chirilgan).",
    });
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

    if (!productId || !marketplaceType) {
      return res.status(400).json({ error: 'productId va marketplaceType majburiy' });
    }

    // Lightweight, non-AI placeholder so the endpoint is stable in demo mode.
    const result = {
      recommendedPrice: null,
      priceChange: 0,
      priceChangePercent: 0,
      reasoning: "Narx optimizatsiyasi demo rejimida faqat hisobot sifatida ishlaydi.",
      expectedImpact: "Hech qanday o'zgarish kiritilmaydi.",
      competitorAnalysis: null,
      confidenceLevel: 0,
      risks: [],
      alternativePrices: [],
    };

    res.json({ success: true, data: result });
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
    const requestUserPartnerId = req.user?.partnerId;

    // Check authorization (admin or own partner id)
    if (
      req.user?.role !== 'admin' &&
      String(requestUserPartnerId ?? '') !== String(partnerId)
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // In the new AI Manager architecture, detailed monitoring is handled
    // by background tasks and the dedicated partner AI dashboard.
    // Here we simply acknowledge the request so the UI can show success.
    res.json({
      success: true,
      message: 'AI monitoring background rejimda ishlamoqda (demo).',
    });
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
    // For now we derive "alerts" from failed AI tasks in ai_tasks.
    // This keeps the dashboard functional without the legacy
    // ai_monitoring_alerts table.

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const rows = await db.all(
      `SELECT id, task_type, status, error_message, created_at
       FROM ai_tasks
       WHERE status = 'failed'
       ORDER BY created_at DESC
       LIMIT 100`
    );

    const alerts = rows.map((row: any) => ({
      id: row.id,
      title: `AI task failed: ${row.task_type}`,
      description: row.error_message || 'Noma\'lum xato',
      ai_suggested_action: "Xatoni loglardan tekshiring yoki vazifani qayta ishga tushiring.",
      severity: 'high',
      status: 'open',
      created_at: row.created_at,
    }));

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
    // Alerts are derived from tasks; there is nothing to persist here.
    // We still return success so the UI flow remains smooth.
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
    const { status, taskType } = req.query;

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    let sqlQuery = `
      SELECT 
        t.*, 
        a.marketplace,
        a.account_name
      FROM ai_tasks t
      LEFT JOIN ai_marketplace_accounts a ON t.account_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      sqlQuery += ' AND t.status = ?';
      params.push(status);
    }

    if (taskType) {
      sqlQuery += ' AND t.task_type = ?';
      params.push(taskType);
    }

    sqlQuery += ' ORDER BY t.created_at DESC LIMIT 100';

    const tasks = await db.all(sqlQuery, params);

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
    const { taskType, status, limit = 50 } = req.query;

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    let sqlQuery = `
      SELECT 
        t.*, 
        a.marketplace,
        a.account_name
      FROM ai_tasks t
      LEFT JOIN ai_marketplace_accounts a ON t.account_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (taskType) {
      sqlQuery += ' AND t.task_type = ?';
      params.push(taskType);
    }

    if (status) {
      sqlQuery += ' AND t.status = ?';
      params.push(status);
    }

    sqlQuery += ' ORDER BY t.created_at DESC LIMIT ?';
    params.push(parseInt(limit as string, 10) || 50);

    const actions = await db.all(sqlQuery, params);

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

    const days = parseInt((req.query.days as string) || '7', 10);

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceDate = since.toISOString().split('T')[0];

    const metrics = await db.all(
      `SELECT 
         metric_date,
         marketplace,
         total_tasks,
         completed_tasks,
         failed_tasks,
         reviews_responded,
         products_optimized,
         revenue_impact
       FROM ai_performance_metrics
       WHERE metric_date >= ?
       ORDER BY metric_date DESC`,
      [sinceDate]
    );

    // Calculate totals in a shape that is easy for dashboards to consume
    const totals = (metrics as any[]).reduce(
      (acc, m) => ({
        totalTasks: acc.totalTasks + (m.total_tasks || 0),
        successfulTasks: acc.successfulTasks + (m.completed_tasks || 0),
        failedTasks: acc.failedTasks + (m.failed_tasks || 0),
        reviewsResponded: acc.reviewsResponded + (m.reviews_responded || 0),
        productsOptimized: acc.productsOptimized + (m.products_optimized || 0),
        revenueImpact: acc.revenueImpact + (m.revenue_impact || 0),
      }),
      {
        totalTasks: 0,
        successfulTasks: 0,
        failedTasks: 0,
        reviewsResponded: 0,
        productsOptimized: 0,
        revenueImpact: 0,
      }
    );

    const successRate =
      totals.totalTasks > 0
        ? ((totals.successfulTasks / totals.totalTasks) * 100).toFixed(2)
        : 0;

    res.json({
      metrics,
      totals,
      successRate,
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

    // Simple in-memory style config for demo/local SQLite mode.
    res.json({
      is_enabled: true,
      mode: 'auto',
      max_parallel_tasks: 100,
    });
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

    // Accept config payload but do not persist it in SQLite demo mode.
    const updates = req.body || {};
    res.json({ success: true, config: updates });
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
    const userId = req.user?.id;
    const { marketplaceType, apiKey, apiSecret, sellerId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!marketplaceType) {
      return res.status(400).json({ error: 'marketplaceType majburiy' });
    }

    const accountName = `Default ${marketplaceType} account`;

    // Check if account already exists for this user + marketplace
    const existing = await db.get(
      `SELECT id FROM ai_marketplace_accounts WHERE partner_id = ? AND marketplace = ?`,
      [userId, marketplaceType]
    );

    if (existing) {
      await db.run(
        `UPDATE ai_marketplace_accounts
         SET seller_id = ?, api_token = ?, api_secret = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [sellerId || null, apiKey || null, apiSecret || null, existing.id]
      );
    } else {
      await db.run(
        `INSERT INTO ai_marketplace_accounts (
           partner_id, marketplace, account_name, seller_id, api_token, api_secret, account_status, ai_enabled
         ) VALUES (?, ?, ?, ?, ?, ?, 'active', 1)`,
        [userId, marketplaceType, accountName, sellerId || null, apiKey || null, apiSecret || null]
      );
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
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const accounts = await db.all(
      `SELECT id, marketplace, account_name, account_status, ai_enabled, last_sync_at, sync_status
       FROM ai_marketplace_accounts
       WHERE partner_id = ?`,
      [userId]
    );

    const safeCredentials = (accounts as any[]).map((a) => ({
      id: a.id,
      marketplace_type: a.marketplace,
      account_name: a.account_name,
      account_status: a.account_status,
      ai_enabled: !!a.ai_enabled,
      last_sync: a.last_sync_at,
      integration_status: a.sync_status,
      has_credentials: true,
    }));

    res.json(safeCredentials);
  } catch (error: any) {
    console.error('Get Marketplace Credentials Error:', error);
    res.status(500).json({ error: error.message });
  }
}
