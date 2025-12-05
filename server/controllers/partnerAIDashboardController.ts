// Partner AI Dashboard Controller
// View-only dashboard for partners - no actions, just monitoring

import { Request, Response } from 'express';
import { db } from '../db';

// ============================================
// PARTNER DASHBOARD - REAL-TIME STATS
// ============================================
export async function getPartnerDashboard(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.id;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get all marketplace accounts
    const accounts = await db.all(
      `SELECT * FROM ai_marketplace_accounts WHERE partner_id = ? AND account_status = 'active'`,
      [partnerId]
    );

    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayStats = await db.get(
      `SELECT 
        SUM(total_tasks) as tasks,
        SUM(completed_tasks) as completed,
        SUM(reviews_responded) as reviews,
        SUM(products_optimized) as products,
        SUM(revenue_impact) as revenue
      FROM ai_performance_metrics 
      WHERE account_id IN (SELECT id FROM ai_marketplace_accounts WHERE partner_id = ?)
      AND metric_date = ?`,
      [partnerId, today]
    );

    // Get this week's stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStats = await db.get(
      `SELECT 
        SUM(total_tasks) as tasks,
        SUM(completed_tasks) as completed,
        SUM(reviews_responded) as reviews,
        SUM(products_optimized) as products,
        SUM(revenue_impact) as revenue
      FROM ai_performance_metrics 
      WHERE account_id IN (SELECT id FROM ai_marketplace_accounts WHERE partner_id = ?)
      AND metric_date >= ?`,
      [partnerId, weekAgo.toISOString().split('T')[0]]
    );

    // Get this month's stats
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStats = await db.get(
      `SELECT 
        SUM(total_tasks) as tasks,
        SUM(completed_tasks) as completed,
        SUM(reviews_responded) as reviews,
        SUM(products_optimized) as products,
        SUM(revenue_impact) as revenue
      FROM ai_performance_metrics 
      WHERE account_id IN (SELECT id FROM ai_marketplace_accounts WHERE partner_id = ?)
      AND metric_date >= ?`,
      [partnerId, monthStart.toISOString().split('T')[0]]
    );

    // Get marketplace breakdown
    const marketplaceBreakdown = await db.all(
      `SELECT 
        marketplace,
        COUNT(*) as accounts,
        SUM(CASE WHEN ai_enabled = 1 THEN 1 ELSE 0 END) as ai_enabled
      FROM ai_marketplace_accounts 
      WHERE partner_id = ? AND account_status = 'active'
      GROUP BY marketplace`,
      [partnerId]
    );

    // Get recent AI activity
    const recentActivity = await db.all(
      `SELECT 
        at.task_type,
        at.status,
        at.created_at,
        at.completed_at,
        ama.marketplace
      FROM ai_tasks at
      JOIN ai_marketplace_accounts ama ON at.account_id = ama.id
      WHERE ama.partner_id = ?
      ORDER BY at.created_at DESC
      LIMIT 20`,
      [partnerId]
    );

    res.json({
      accounts: accounts.length,
      today: todayStats || { tasks: 0, completed: 0, reviews: 0, products: 0, revenue: 0 },
      week: weekStats || { tasks: 0, completed: 0, reviews: 0, products: 0, revenue: 0 },
      month: monthStats || { tasks: 0, completed: 0, reviews: 0, products: 0, revenue: 0 },
      marketplaces: marketplaceBreakdown,
      recentActivity: recentActivity.map((a: any) => ({
        type: a.task_type,
        status: a.status,
        marketplace: a.marketplace,
        createdAt: a.created_at,
        completedAt: a.completed_at,
      })),
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// AI ACTIVITY LOG
// ============================================
export async function getAIActivityLog(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.id;
    const { limit = 50, offset = 0, taskType, status } = req.query;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let query = `
      SELECT 
        at.*,
        ama.marketplace,
        ama.account_name
      FROM ai_tasks at
      JOIN ai_marketplace_accounts ama ON at.account_id = ama.id
      WHERE ama.partner_id = ?
    `;
    
    const params: any[] = [partnerId];

    if (taskType) {
      query += ` AND at.task_type = ?`;
      params.push(taskType);
    }

    if (status) {
      query += ` AND at.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY at.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const tasks = await db.all(query, params);

    res.json({
      tasks: tasks.map((t: any) => ({
        id: t.id,
        type: t.task_type,
        status: t.status,
        marketplace: t.marketplace,
        accountName: t.account_name,
        createdAt: t.created_at,
        completedAt: t.completed_at,
        processingTime: t.processing_time_ms,
      })),
      total: tasks.length,
    });
  } catch (error: any) {
    console.error('Activity log error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// TREND RECOMMENDATIONS
// ============================================
export async function getTrendRecommendations(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.id;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock data - real implementation would use trend analysis service
    const recommendations = [
      {
        category: 'Qishki kiyimlar',
        trend: 'up',
        demandIncrease: 35,
        potentialRevenue: 150000000,
        confidence: 0.85,
        reason: 'Qish faslining boshlanishi, talab keskin oshmoqda',
      },
      {
        category: 'Smartfon aksessuarlari',
        trend: 'up',
        demandIncrease: 28,
        potentialRevenue: 80000000,
        confidence: 0.78,
        reason: 'Yangi telefon modellari chiqishi',
      },
      {
        category: 'Sport oziq-ovqatlari',
        trend: 'up',
        demandIncrease: 22,
        potentialRevenue: 120000000,
        confidence: 0.72,
        reason: 'Yangi yil rezolyutsiyalari, fitness trend',
      },
    ];

    res.json({ recommendations });
  } catch (error: any) {
    console.error('Trends error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// INVENTORY ALERTS
// ============================================
export async function getInventoryAlerts(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.id;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock data - real implementation would query inventory system
    const alerts = [
      {
        productName: 'Mahsulot A',
        currentStock: 150,
        dailySales: 15,
        daysRemaining: 10,
        status: 'warning',
        recommendation: '200 dona buyurtma qiling',
      },
      {
        productName: 'Mahsulot C',
        currentStock: 25,
        dailySales: 12,
        daysRemaining: 2,
        status: 'critical',
        recommendation: 'TEZKOR: 150 dona buyurtma qiling!',
      },
    ];

    res.json({ alerts });
  } catch (error: any) {
    console.error('Inventory alerts error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// PERFORMANCE METRICS
// ============================================
export async function getPerformanceMetrics(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.id;
    const { period = '30' } = req.query; // days
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(period));

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
      WHERE account_id IN (SELECT id FROM ai_marketplace_accounts WHERE partner_id = ?)
      AND metric_date >= ?
      ORDER BY metric_date DESC`,
      [partnerId, daysAgo.toISOString().split('T')[0]]
    );

    // Calculate totals
    const totals = metrics.reduce((acc: any, m: any) => ({
      tasks: acc.tasks + m.total_tasks,
      completed: acc.completed + m.completed_tasks,
      failed: acc.failed + m.failed_tasks,
      reviews: acc.reviews + m.reviews_responded,
      products: acc.products + m.products_optimized,
      revenue: acc.revenue + m.revenue_impact,
    }), { tasks: 0, completed: 0, failed: 0, reviews: 0, products: 0, revenue: 0 });

    // Calculate success rate
    const successRate = totals.tasks > 0 
      ? ((totals.completed / totals.tasks) * 100).toFixed(1)
      : 0;

    res.json({
      period: Number(period),
      metrics,
      totals,
      successRate,
    });
  } catch (error: any) {
    console.error('Performance metrics error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ============================================
// AI REPORTS
// ============================================
export async function getAIReports(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.id;
    const { type = 'monthly', limit = 10 } = req.query;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const reports = await db.all(
      `SELECT 
        r.*
      FROM ai_reports r
      JOIN ai_marketplace_accounts ama ON r.account_id = ama.id
      WHERE ama.partner_id = ?
      AND r.report_type = ?
      ORDER BY r.created_at DESC
      LIMIT ?`,
      [partnerId, type, Number(limit)]
    );

    res.json({
      reports: reports.map((r: any) => ({
        id: r.id,
        type: r.report_type,
        periodStart: r.report_period_start,
        periodEnd: r.report_period_end,
        summary: r.summary,
        insights: r.insights ? JSON.parse(r.insights) : [],
        recommendations: r.recommendations ? JSON.parse(r.recommendations) : [],
        createdAt: r.created_at,
      })),
    });
  } catch (error: any) {
    console.error('Reports error:', error);
    res.status(500).json({ error: error.message });
  }
}
