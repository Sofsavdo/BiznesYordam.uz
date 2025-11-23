// Broadcast Message Controller
// Admin uchun ommaviy xabarlar yuborish tizimi

import { Request, Response } from 'express';
import { db } from '../db';
import { nanoid } from 'nanoid';

// Admin: Barcha broadcast xabarlarni ko'rish
export async function getAllBroadcasts(req: Request, res: Response) {
  try {
    const broadcasts = await db.query(
      `SELECT b.*, u.first_name, u.last_name
       FROM broadcast_messages b
       JOIN users u ON b.sender_id = u.id
       ORDER BY b.created_at DESC`,
      []
    );

    res.json(broadcasts);
  } catch (error: any) {
    console.error('Error fetching broadcasts:', error);
    res.status(500).json({ error: error.message });
  }
}

// Admin: Yangi broadcast yaratish
export async function createBroadcast(req: Request, res: Response) {
  try {
    const adminId = (req.user as any)?.id;
    if (!adminId) {
      return res.status(403).json({ error: 'Admin ID topilmadi' });
    }

    const {
      title,
      content,
      targetAudience, // 'all_partners', 'specific_tier', 'specific_partners'
      targetTiers,
      targetPartners,
      channel, // 'in_app', 'email', 'sms'
      priority,
      scheduledAt
    } = req.body;

    const id = nanoid();
    const now = new Date().toISOString();

    await db.query(
      `INSERT INTO broadcast_messages (
        id, sender_id, title, content, target_audience,
        target_tiers, target_partners, channel, priority,
        scheduled_at, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, adminId, title, content, targetAudience,
        JSON.stringify(targetTiers || []),
        JSON.stringify(targetPartners || []),
        channel || 'in_app',
        priority || 'normal',
        scheduledAt || null,
        scheduledAt ? 'scheduled' : 'draft',
        now
      ]
    );

    res.status(201).json({ id, message: 'Broadcast xabar yaratildi' });
  } catch (error: any) {
    console.error('Error creating broadcast:', error);
    res.status(500).json({ error: error.message });
  }
}

// Admin: Broadcast yuborish
export async function sendBroadcast(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    // Broadcast ma'lumotini olish
    const broadcast = await db.query(
      'SELECT * FROM broadcast_messages WHERE id = ?',
      [id]
    );

    if (!broadcast || broadcast.length === 0) {
      return res.status(404).json({ error: 'Broadcast topilmadi' });
    }

    const broadcastData = broadcast[0];

    // Qabul qiluvchilarni aniqlash
    let recipients: any[] = [];

    if (broadcastData.target_audience === 'all_partners') {
      recipients = await db.query('SELECT user_id FROM partners WHERE is_approved = ?', [true]);
    } else if (broadcastData.target_audience === 'specific_tier') {
      const tiers = JSON.parse(broadcastData.target_tiers || '[]');
      if (tiers.length > 0) {
        const placeholders = tiers.map(() => '?').join(',');
        recipients = await db.query(
          `SELECT user_id FROM partners WHERE pricing_tier IN (${placeholders}) AND is_approved = ?`,
          [...tiers, true]
        );
      }
    } else if (broadcastData.target_audience === 'specific_partners') {
      const partnerIds = JSON.parse(broadcastData.target_partners || '[]');
      if (partnerIds.length > 0) {
        const placeholders = partnerIds.map(() => '?').join(',');
        recipients = await db.query(
          `SELECT user_id FROM partners WHERE id IN (${placeholders})`,
          partnerIds
        );
      }
    }

    // Har bir qabul qiluvchiga notification yaratish
    const notificationId = nanoid();
    for (const recipient of recipients) {
      const notifId = nanoid();
      await db.query(
        `INSERT INTO notifications (
          id, user_id, type, title, message, channel, priority, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          notifId,
          recipient.user_id,
          'broadcast',
          broadcastData.title,
          broadcastData.content,
          broadcastData.channel,
          broadcastData.priority,
          now
        ]
      );
    }

    // Broadcast statusini yangilash
    await db.query(
      `UPDATE broadcast_messages
       SET status = 'sent', sent_at = ?, recipients_count = ?
       WHERE id = ?`,
      [now, recipients.length, id]
    );

    res.json({ 
      message: 'Xabar yuborildi', 
      recipientsCount: recipients.length 
    });
  } catch (error: any) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ error: error.message });
  }
}

// Admin: Broadcast o'chirish
export async function deleteBroadcast(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM broadcast_messages WHERE id = ?', [id]);

    res.json({ message: 'Broadcast o\'chirildi' });
  } catch (error: any) {
    console.error('Error deleting broadcast:', error);
    res.status(500).json({ error: error.message });
  }
}

// Hamkor: O'z xabarlarini ko'rish
export async function getPartnerNotifications(req: Request, res: Response) {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(403).json({ error: 'User ID topilmadi' });
    }

    const notifications = await db.query(
      `SELECT * FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    res.json(notifications);
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: error.message });
  }
}

// Hamkor: Notification o'qilgan deb belgilash
export async function markNotificationAsRead(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await db.query(
      'UPDATE notifications SET is_read = ? WHERE id = ?',
      [true, id]
    );

    res.json({ message: 'O\'qilgan deb belgilandi' });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: error.message });
  }
}
