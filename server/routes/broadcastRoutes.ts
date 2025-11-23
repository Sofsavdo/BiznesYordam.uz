// Broadcast & Notifications Routes

import { Router } from 'express';
import {
  getAllBroadcasts,
  createBroadcast,
  sendBroadcast,
  deleteBroadcast,
  getPartnerNotifications,
  markNotificationAsRead
} from '../controllers/broadcastController';

const router = Router();

// Admin: Broadcast management
router.get('/broadcasts', getAllBroadcasts);
router.post('/broadcasts', createBroadcast);
router.post('/broadcasts/:id/send', sendBroadcast);
router.delete('/broadcasts/:id', deleteBroadcast);

// Partner: Notifications
router.get('/notifications', getPartnerNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

export default router;
