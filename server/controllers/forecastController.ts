// Forecast & Business Intelligence Controller
// AI/ML asosida prognozlar va biznes tahlillari

import { Request, Response } from 'express';
import { db } from '../db';
import { nanoid } from 'nanoid';

// Savdo prognozlarini olish
export async function getSalesForecasts(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const { period = 'month' } = req.query; // 'week', 'month', 'quarter', 'year'

    const forecasts = await db.query(
      `SELECT * FROM sales_forecasts
       WHERE partner_id = ? AND forecast_period = ?
       ORDER BY forecast_date DESC
       LIMIT 30`,
      [partnerId, period]
    );

    res.json(forecasts);
  } catch (error: any) {
    console.error('Error fetching forecasts:', error);
    res.status(500).json({ error: error.message });
  }
}

// Prognoz yaratish (AI/ML simulatsiya)
export async function generateForecast(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const { forecastPeriod, marketplace, category } = req.body;

    // O'tgan oy ma'lumotlarini olish
    const historicalData = await db.query(
      `SELECT 
         SUM(total_revenue) as total_revenue,
         SUM(net_profit) as net_profit,
         SUM(orders_count) as orders_count
       FROM profit_breakdown
       WHERE partner_id = ? AND date >= datetime('now', '-30 days')`,
      [partnerId]
    );

    if (!historicalData || historicalData.length === 0 || !historicalData[0].total_revenue) {
      return res.status(400).json({ 
        error: 'Prognoz uchun yetarli tarixiy ma\'lumot yo\'q' 
      });
    }

    // Oddiy prognoz algoritmi (haqiqiy AI/ML kelajakda qo'shiladi)
    const baseRevenue = parseFloat(historicalData[0].total_revenue || '0');
    const baseProfit = parseFloat(historicalData[0].net_profit || '0');
    const baseOrders = historicalData[0].orders_count || 0;

    // O'sish koeffitsienti (5-15% o'sish)
    const growthRate = 1 + (Math.random() * 0.10 + 0.05);
    
    const predictedRevenue = baseRevenue * growthRate;
    const predictedProfit = baseProfit * growthRate;
    const predictedOrders = Math.round(baseOrders * growthRate);
    const confidenceLevel = Math.round(70 + Math.random() * 20); // 70-90%

    // Prognoz saqlash
    const id = nanoid();
    const now = new Date();
    let forecastDate = new Date(now);

    if (forecastPeriod === 'week') {
      forecastDate.setDate(forecastDate.getDate() + 7);
    } else if (forecastPeriod === 'month') {
      forecastDate.setMonth(forecastDate.getMonth() + 1);
    } else if (forecastPeriod === 'quarter') {
      forecastDate.setMonth(forecastDate.getMonth() + 3);
    } else if (forecastPeriod === 'year') {
      forecastDate.setFullYear(forecastDate.getFullYear() + 1);
    }

    const factors = {
      historical_revenue: baseRevenue,
      growth_rate: growthRate,
      seasonality: 'normal',
      market_trends: 'positive'
    };

    await db.query(
      `INSERT INTO sales_forecasts (
        id, partner_id, forecast_period, forecast_date,
        predicted_revenue, predicted_profit, predicted_orders,
        confidence_level, marketplace, category, model_version, factors, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, partnerId, forecastPeriod, forecastDate.toISOString(),
        predictedRevenue, predictedProfit, predictedOrders,
        confidenceLevel, marketplace || null, category || null,
        'v1.0', JSON.stringify(factors), now.toISOString()
      ]
    );

    res.status(201).json({
      id,
      forecast: {
        period: forecastPeriod,
        date: forecastDate,
        predictedRevenue,
        predictedProfit,
        predictedOrders,
        confidenceLevel
      }
    });
  } catch (error: any) {
    console.error('Error generating forecast:', error);
    res.status(500).json({ error: error.message });
  }
}

// Biznes tahlillarini olish
export async function getBusinessInsights(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const insights = await db.query(
      `SELECT * FROM business_insights
       WHERE partner_id = ? AND is_dismissed = ?
       ORDER BY priority DESC, impact_score DESC, created_at DESC`,
      [partnerId, false]
    );

    res.json(insights);
  } catch (error: any) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: error.message });
  }
}

// Tahlil yaratish (AI tavsiyalar)
export async function generateInsights(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    // O'tgan oy statistikasini olish
    const stats = await db.query(
      `SELECT 
         marketplace,
         SUM(total_revenue) as revenue,
         SUM(net_profit) as profit,
         AVG(profit_margin) as avg_margin,
         SUM(orders_count) as orders
       FROM profit_breakdown
       WHERE partner_id = ? AND date >= datetime('now', '-30 days')
       GROUP BY marketplace`,
      [partnerId]
    );

    const insights = [];

    // Oddiy tahlil logikasi
    for (const stat of stats) {
      if (parseFloat(stat.avg_margin) < 15) {
        insights.push({
          type: 'warning',
          title: `${stat.marketplace} - Past foyda marjasi`,
          description: `Sizning ${stat.marketplace} dagi foyda marjangiz ${stat.avg_margin}%. Narxlarni qayta ko'rib chiqing.`,
          priority: 'high',
          impact_score: 85
        });
      }

      if (stat.orders < 50) {
        insights.push({
          type: 'opportunity',
          title: `${stat.marketplace} - Savdoni oshirish imkoniyati`,
          description: `${stat.marketplace} da oylik ${stat.orders} ta buyurtma. Marketing strategiyasini yaxshilang.`,
          priority: 'medium',
          impact_score: 70
        });
      }
    }

    // Tahlillarni saqlash
    const now = new Date().toISOString();
    for (const insight of insights) {
      const id = nanoid();
      await db.query(
        `INSERT INTO business_insights (
          id, partner_id, insight_type, title, description,
          priority, impact_score, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, partnerId, insight.type, insight.title, insight.description,
          insight.priority, insight.impact_score, now
        ]
      );
    }

    res.json({ message: `${insights.length} ta yangi tahlil yaratildi`, insights });
  } catch (error: any) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: error.message });
  }
}

// Tahlilni o'qilgan deb belgilash
export async function markInsightAsRead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    await db.query(
      'UPDATE business_insights SET is_read = ?, updated_at = ? WHERE id = ?',
      [true, now, id]
    );

    res.json({ message: 'O\'qilgan deb belgilandi' });
  } catch (error: any) {
    console.error('Error marking insight as read:', error);
    res.status(500).json({ error: error.message });
  }
}

// Performance benchmarks
export async function getPerformanceBenchmarks(req: Request, res: Response) {
  try {
    const { category, marketplace } = req.query;

    let query = 'SELECT * FROM performance_benchmarks WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (marketplace) {
      query += ' AND marketplace = ?';
      params.push(marketplace);
    }

    query += ' ORDER BY date DESC LIMIT 30';

    const benchmarks = await db.query(query, params);
    res.json(benchmarks);
  } catch (error: any) {
    console.error('Error fetching benchmarks:', error);
    res.status(500).json({ error: error.message });
  }
}
