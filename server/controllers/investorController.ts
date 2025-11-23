// Investor Controller
// Investor kapitali va shaffoflik tizimi API

import { Request, Response } from 'express';
import { db } from '../db';
import { nanoid } from 'nanoid';

// Investor profili
export async function getInvestorProfile(req: Request, res: Response) {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(403).json({ error: 'User ID topilmadi' });
    }

    const investor = await db.query(
      'SELECT * FROM investors WHERE user_id = ?',
      [userId]
    );

    if (!investor || investor.length === 0) {
      return res.status(404).json({ error: 'Investor profili topilmadi' });
    }

    res.json(investor[0]);
  } catch (error: any) {
    console.error('Error fetching investor profile:', error);
    res.status(500).json({ error: error.message });
  }
}

// Investor dashboard statistikasi
export async function getInvestorDashboard(req: Request, res: Response) {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(403).json({ error: 'User ID topilmadi' });
    }

    const investor = await db.query('SELECT * FROM investors WHERE user_id = ?', [userId]);
    if (!investor || investor.length === 0) {
      return res.status(404).json({ error: 'Investor profili topilmadi' });
    }

    const investorId = investor[0].id;

    // Har bir tovar birligi bo'yicha ma'lumot
    const inventoryItems = await db.query(
      `SELECT i.*, p.name as product_name, p.category
       FROM inventory_items i
       JOIN products p ON i.product_id = p.id
       WHERE i.investor_id = ?
       ORDER BY i.created_at DESC`,
      [investorId]
    );

    // Joylashuv bo'yicha statistika
    const locationStats = await db.query(
      `SELECT 
         location_type,
         status,
         COUNT(*) as count,
         SUM(purchase_price) as total_invested,
         SUM(CASE WHEN sale_price IS NOT NULL THEN sale_price - purchase_price ELSE 0 END) as total_profit
       FROM inventory_items
       WHERE investor_id = ?
       GROUP BY location_type, status`,
      [investorId]
    );

    // So'nggi tranzaksiyalar
    const transactions = await db.query(
      `SELECT *
       FROM investment_transactions
       WHERE investor_id = ?
       ORDER BY created_at DESC
       LIMIT 20`,
      [investorId]
    );

    // ROI hisoblash
    const stats = await db.query(
      `SELECT 
         COUNT(*) as total_items,
         SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as items_available,
         SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as items_sold,
         SUM(CASE WHEN location_type = 'warehouse' THEN 1 ELSE 0 END) as items_in_warehouse,
         SUM(CASE WHEN location_type = 'marketplace' THEN 1 ELSE 0 END) as items_in_marketplace,
         SUM(purchase_price) as total_invested,
         SUM(CASE WHEN sale_price IS NOT NULL THEN sale_price ELSE 0 END) as total_revenue,
         SUM(CASE WHEN sale_price IS NOT NULL THEN sale_price - purchase_price ELSE 0 END) as total_profit
       FROM inventory_items
       WHERE investor_id = ?`,
      [investorId]
    );

    const roi = stats[0].total_invested > 0 
      ? ((stats[0].total_profit / stats[0].total_invested) * 100).toFixed(2)
      : '0.00';

    res.json({
      investor: investor[0],
      inventoryItems,
      locationStats,
      transactions,
      stats: {
        ...stats[0],
        roi_percentage: roi
      }
    });
  } catch (error: any) {
    console.error('Error fetching investor dashboard:', error);
    res.status(500).json({ error: error.message });
  }
}

// Investitsiya qo'shish
export async function createInvestment(req: Request, res: Response) {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(403).json({ error: 'User ID topilmadi' });
    }

    const investor = await db.query('SELECT * FROM investors WHERE user_id = ?', [userId]);
    if (!investor || investor.length === 0) {
      return res.status(404).json({ error: 'Investor profili topilmadi' });
    }

    const investorId = investor[0].id;
    const { amount, description, relatedProductId } = req.body;

    const id = nanoid();
    const now = new Date().toISOString();

    await db.query(
      `INSERT INTO investment_transactions (
        id, investor_id, transaction_type, amount, description,
        related_product_id, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, investorId, 'investment', amount, description, relatedProductId || null, 'completed', now]
    );

    // Investor balansini yangilash
    await db.query(
      `UPDATE investors
       SET total_invested = total_invested + ?,
           current_balance = current_balance + ?,
           updated_at = ?
       WHERE id = ?`,
      [amount, amount, now, investorId]
    );

    res.status(201).json({ id, message: 'Investitsiya qo\'shildi' });
  } catch (error: any) {
    console.error('Error creating investment:', error);
    res.status(500).json({ error: error.message });
  }
}

// Kunlik statistika olish
export async function getInvestorStats(req: Request, res: Response) {
  try {
    const userId = (req.user as any)?.id;
    const { period = '30' } = req.query; // Last N days

    const investor = await db.query('SELECT * FROM investors WHERE user_id = ?', [userId]);
    if (!investor || investor.length === 0) {
      return res.status(404).json({ error: 'Investor profili topilmadi' });
    }

    const stats = await db.query(
      `SELECT *
       FROM investor_stats
       WHERE investor_id = ? AND date >= datetime('now', '-${period} days')
       ORDER BY date DESC`,
      [investor[0].id]
    );

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching investor stats:', error);
    res.status(500).json({ error: error.message });
  }
}

// Investor yaratish (admin uchun)
export async function createInvestor(req: Request, res: Response) {
  try {
    const { userId, investorType, riskLevel, preferredCategories } = req.body;

    const id = nanoid();
    const now = new Date().toISOString();

    await db.query(
      `INSERT INTO investors (
        id, user_id, investor_type, risk_level, preferred_categories,
        total_invested, total_profit, current_balance, is_active,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        investorType || 'individual',
        riskLevel || 'medium',
        JSON.stringify(preferredCategories || []),
        0,
        0,
        0,
        true,
        now,
        now
      ]
    );

    res.status(201).json({ id, message: 'Investor yaratildi' });
  } catch (error: any) {
    console.error('Error creating investor:', error);
    res.status(500).json({ error: error.message });
  }
}
