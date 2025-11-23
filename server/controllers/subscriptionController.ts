// Subscription & Add-ons Controller
// Tarif obunalari va qo'shimcha xizmatlar

import { Request, Response } from 'express';
import { db } from '../db';
import { nanoid } from 'nanoid';

// Barcha add-on xizmatlarni olish
export async function getAddonServices(req: Request, res: Response) {
  try {
    const addons = await db.query(
      `SELECT * FROM addon_services WHERE is_active = ? ORDER BY category, name`,
      [true]
    );
    res.json(addons);
  } catch (error: any) {
    console.error('Error fetching addon services:', error);
    res.status(500).json({ error: error.message });
  }
}

// Hamkor obunalarini olish
export async function getPartnerSubscriptions(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const subscriptions = await db.query(
      `SELECT * FROM partner_subscriptions
       WHERE partner_id = ? AND status = 'active'
       ORDER BY created_at DESC`,
      [partnerId]
    );

    res.json(subscriptions);
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: error.message });
  }
}

// Add-on obuna qo'shish
export async function subscribeToAddon(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const { addonId, billingPeriod } = req.body; // 'monthly', 'quarterly', 'yearly'

    // Add-on ma'lumotini olish
    const addon = await db.query('SELECT * FROM addon_services WHERE id = ?', [addonId]);
    if (!addon || addon.length === 0) {
      return res.status(404).json({ error: 'Add-on topilmadi' });
    }

    const addonData = addon[0];

    // Narx va chegirmani hisoblash
    let amount = parseFloat(addonData.base_price_monthly);
    let discountApplied = 0;

    if (billingPeriod === 'quarterly') {
      amount = parseFloat(addonData.base_price_quarterly || addonData.base_price_monthly * 3);
      discountApplied = (parseFloat(addonData.base_price_monthly) * 3) - amount;
    } else if (billingPeriod === 'yearly') {
      amount = parseFloat(addonData.base_price_yearly || addonData.base_price_monthly * 12);
      discountApplied = (parseFloat(addonData.base_price_monthly) * 12) - amount;
    }

    // Obuna yaratish
    const id = nanoid();
    const now = new Date();
    const startDate = now.toISOString();
    let endDate = new Date(now);

    if (billingPeriod === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingPeriod === 'quarterly') {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (billingPeriod === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    await db.query(
      `INSERT INTO partner_subscriptions (
        id, partner_id, subscription_type, item_id, billing_period,
        start_date, end_date, auto_renew, status, amount, discount_applied,
        next_billing_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, partnerId, 'addon', addonId, billingPeriod,
        startDate, endDate.toISOString(), true, 'active', amount, discountApplied,
        endDate.toISOString(), startDate, startDate
      ]
    );

    res.status(201).json({ 
      id, 
      message: 'Add-on obunasi yaratildi', 
      amount, 
      discountApplied 
    });
  } catch (error: any) {
    console.error('Error subscribing to addon:', error);
    res.status(500).json({ error: error.message });
  }
}

// Obunani bekor qilish
export async function cancelSubscription(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const now = new Date().toISOString();

    await db.query(
      `UPDATE partner_subscriptions
       SET status = 'cancelled', cancelled_at = ?, cancellation_reason = ?, updated_at = ?
       WHERE id = ?`,
      [now, cancellationReason, now, id]
    );

    res.json({ message: 'Obuna bekor qilindi' });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: error.message });
  }
}

// To'lov tarixi
export async function getPaymentHistory(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const payments = await db.query(
      `SELECT * FROM subscription_payments
       WHERE partner_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [partnerId]
    );

    res.json(payments);
  } catch (error: any) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: error.message });
  }
}
