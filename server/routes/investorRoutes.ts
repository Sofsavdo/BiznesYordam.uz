// Investor Routes

import { Router } from 'express';
import {
  getInvestorProfile,
  getInvestorDashboard,
  createInvestment,
  getInvestorStats,
  createInvestor
} from '../controllers/investorController';

const router = Router();

// Investor profile
router.get('/profile', getInvestorProfile);
router.get('/dashboard', getInvestorDashboard);
router.get('/stats', getInvestorStats);

// Transactions
router.post('/investments', createInvestment);

// Admin only
router.post('/create', createInvestor);

export default router;
