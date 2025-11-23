// Marketplace Integration Routes (Gibrid System)

import { Router } from 'express';
import {
  submitIntegrationRequest,
  getPartnerRequests,
  getAllIntegrationRequests,
  testIntegrationRequest,
  approveIntegrationRequest,
  rejectIntegrationRequest,
  getSyncHistory,
  triggerSync
} from '../controllers/marketplaceIntegrationController';

const router = Router();

// Partner routes
router.post('/requests', submitIntegrationRequest);
router.get('/requests/my', getPartnerRequests);

// Admin routes
router.get('/requests/all', getAllIntegrationRequests);
router.post('/requests/:id/test', testIntegrationRequest);
router.post('/requests/:id/approve', approveIntegrationRequest);
router.post('/requests/:id/reject', rejectIntegrationRequest);

// Sync
router.get('/integrations/:integrationId/sync-history', getSyncHistory);
router.post('/integrations/:integrationId/sync', triggerSync);

export default router;
