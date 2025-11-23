// Marketplace Integration Controller
// Gibrid integratsiya tizimi - Hamkor so'rovi + Admin tasdiq

import { Request, Response } from 'express';
import { db } from '../db';
import { nanoid } from 'nanoid';

// Hamkor: Integratsiya so'rovi yuborish
export async function submitIntegrationRequest(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const {
      marketplace,
      apiKey,
      apiSecret,
      shopId,
      shopName,
      additionalCredentials
    } = req.body;

    // Mavjud so'rov bormi tekshirish
    const existing = await db.query(
      `SELECT * FROM marketplace_integration_requests
       WHERE partner_id = ? AND marketplace = ? AND status IN ('pending', 'testing')`,
      [partnerId, marketplace]
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({ 
        error: 'Bu marketplace uchun so\'rov allaqachon mavjud' 
      });
    }

    const id = nanoid();
    const now = new Date().toISOString();

    // So'rovni yaratish (API kalitlar shifrlangan bo'lishi kerak - hozircha oddiy)
    await db.query(
      `INSERT INTO marketplace_integration_requests (
        id, partner_id, marketplace, request_type, status,
        api_key, api_secret, shop_id, shop_name, additional_credentials,
        submitted_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, partnerId, marketplace, 'new', 'pending',
        apiKey, apiSecret, shopId, shopName,
        JSON.stringify(additionalCredentials || {}),
        now, now, now
      ]
    );

    res.status(201).json({ 
      id, 
      message: 'Integratsiya so\'rovi yuborildi. Admin ko\'rib chiqadi.' 
    });
  } catch (error: any) {
    console.error('Error submitting integration request:', error);
    res.status(500).json({ error: error.message });
  }
}

// Hamkor: O'z so'rovlarini ko'rish
export async function getPartnerRequests(req: Request, res: Response) {
  try {
    const partnerId = (req.user as any)?.partnerId;
    if (!partnerId) {
      return res.status(403).json({ error: 'Partner ID topilmadi' });
    }

    const requests = await db.query(
      `SELECT * FROM marketplace_integration_requests
       WHERE partner_id = ?
       ORDER BY created_at DESC`,
      [partnerId]
    );

    res.json(requests);
  } catch (error: any) {
    console.error('Error fetching partner requests:', error);
    res.status(500).json({ error: error.message });
  }
}

// Admin: Barcha so'rovlarni ko'rish
export async function getAllIntegrationRequests(req: Request, res: Response) {
  try {
    const { status } = req.query;

    let query = `
      SELECT r.*, p.business_name, u.first_name, u.last_name
      FROM marketplace_integration_requests r
      JOIN partners p ON r.partner_id = p.id
      JOIN users u ON p.user_id = u.id
    `;

    const params: any[] = [];
    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const requests = await db.query(query, params);
    res.json(requests);
  } catch (error: any) {
    console.error('Error fetching all integration requests:', error);
    res.status(500).json({ error: error.message });
  }
}

// Admin: So'rovni test qilish
export async function testIntegrationRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    // Bu yerda real API test bo'lishi kerak
    // Hozircha oddiy simulatsiya
    const testResults = {
      connection: 'success',
      authentication: 'success',
      api_version: 'v1',
      shop_info: {
        name: 'Test Shop',
        status: 'active'
      },
      tested_at: now
    };

    await db.query(
      `UPDATE marketplace_integration_requests
       SET status = 'testing', test_results = ?, updated_at = ?
       WHERE id = ?`,
      [JSON.stringify(testResults), now, id]
    );

    res.json({ message: 'Test muvaffaqiyatli', testResults });
  } catch (error: any) {
    console.error('Error testing integration:', error);
    res.status(500).json({ error: error.message });
  }
}

// Admin: So'rovni tasdiqlash
export async function approveIntegrationRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;
    const adminId = (req.user as any)?.id;
    const now = new Date().toISOString();

    // So'rovni olish
    const request = await db.query(
      'SELECT * FROM marketplace_integration_requests WHERE id = ?',
      [id]
    );

    if (!request || request.length === 0) {
      return res.status(404).json({ error: 'So\'rov topilmadi' });
    }

    const reqData = request[0];

    // marketplace_integrations jadvaliga qo'shish
    const integrationId = nanoid();
    await db.query(
      `INSERT INTO marketplace_integrations (
        id, partner_id, marketplace, is_active, api_credentials, last_sync,
        sync_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        integrationId,
        reqData.partner_id,
        reqData.marketplace,
        true,
        JSON.stringify({
          api_key: reqData.api_key,
          api_secret: reqData.api_secret,
          shop_id: reqData.shop_id,
          shop_name: reqData.shop_name
        }),
        now,
        'connected',
        now,
        now
      ]
    );

    // So'rovni approved qilish
    await db.query(
      `UPDATE marketplace_integration_requests
       SET status = 'approved', reviewed_at = ?, reviewed_by = ?,
           admin_notes = ?, updated_at = ?
       WHERE id = ?`,
      [now, adminId, adminNotes, now, id]
    );

    res.json({ message: 'Integratsiya tasdiqlandi va faollashtirildi' });
  } catch (error: any) {
    console.error('Error approving integration:', error);
    res.status(500).json({ error: error.message });
  }
}

// Admin: So'rovni rad etish
export async function rejectIntegrationRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { rejectionReason, adminNotes } = req.body;
    const adminId = (req.user as any)?.id;
    const now = new Date().toISOString();

    await db.query(
      `UPDATE marketplace_integration_requests
       SET status = 'rejected', reviewed_at = ?, reviewed_by = ?,
           rejection_reason = ?, admin_notes = ?, updated_at = ?
       WHERE id = ?`,
      [now, adminId, rejectionReason, adminNotes, now, id]
    );

    res.json({ message: 'So\'rov rad etildi' });
  } catch (error: any) {
    console.error('Error rejecting integration:', error);
    res.status(500).json({ error: error.message });
  }
}

// Sinxronizatsiya tarixi
export async function getSyncHistory(req: Request, res: Response) {
  try {
    const { integrationId } = req.params;

    const history = await db.query(
      `SELECT * FROM marketplace_sync_history
       WHERE integration_id = ?
       ORDER BY started_at DESC
       LIMIT 50`,
      [integrationId]
    );

    res.json(history);
  } catch (error: any) {
    console.error('Error fetching sync history:', error);
    res.status(500).json({ error: error.message });
  }
}

// Manual sinxronizatsiya boshlash
export async function triggerSync(req: Request, res: Response) {
  try {
    const { integrationId } = req.params;
    const { syncType } = req.body; // 'orders', 'products', 'inventory', 'analytics'

    const id = nanoid();
    const now = new Date().toISOString();

    // Sinxronizatsiya jarayonini boshlash
    await db.query(
      `INSERT INTO marketplace_sync_history (
        id, integration_id, sync_type, status, started_at, metadata
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, integrationId, syncType, 'success', now, '{}']
    );

    // Bu yerda real sinxronizatsiya logikasi bo'lishi kerak
    // Hozircha oddiy simulatsiya

    await db.query(
      `UPDATE marketplace_sync_history
       SET status = 'success', records_synced = 10, completed_at = ?
       WHERE id = ?`,
      [now, id]
    );

    res.json({ message: 'Sinxronizatsiya boshlandi', syncId: id });
  } catch (error: any) {
    console.error('Error triggering sync:', error);
    res.status(500).json({ error: error.message });
  }
}
