// Subscription & Add-ons Routes

import { Router } from 'express';
import {
  getAddonServices,
  getPartnerSubscriptions,
  subscribeToAddon,
  cancelSubscription,
  getPaymentHistory
} from '../controllers/subscriptionController';

const router = Router();

// Add-on services
router.get('/addons', getAddonServices);

// Partner subscriptions
router.get('/my-subscriptions', getPartnerSubscriptions);
router.post('/subscribe', subscribeToAddon);
router.put('/subscriptions/:id/cancel', cancelSubscription);

// Payment history
router.get('/payments', getPaymentHistory);

export default router;
