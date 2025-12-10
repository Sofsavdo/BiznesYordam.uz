// Referral API Routes - SellerCloudX
import express, { Request, Response } from 'express';
import { asyncHandler } from '../errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Generate promo code
router.post('/generate-code', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const promoCode = `SCX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  res.json({
    promoCode,
    shareUrl: `https://sellercloudx.onrender.com/partner-registration?ref=${promoCode}`,
    message: 'Promo kod yaratildi'
  });
}));

// Get referral stats
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  res.json({
    tier: 'bronze',
    tierName: 'Bronze',
    tierIcon: '🥉',
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarned: 0,
    available: 0,
    canWithdraw: false
  });
}));

// Withdrawal request
router.post('/withdraw', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { amount, method } = req.body;

  res.json({
    message: "So'rov yuborildi",
    withdrawalId: uuidv4(),
    amount,
    method,
    status: 'pending'
  });
}));

// Leaderboard
router.get('/leaderboard', asyncHandler(async (req: Request, res: Response) => {
  const leaderboard = [
    { rank: 1, name: 'Rustam K.', referrals: 47, earnings: 1247 },
    { rank: 2, name: 'Nilufar R.', referrals: 38, earnings: 987 },
    { rank: 3, name: 'Sardor T.', referrals: 29, earnings: 734 }
  ];

  res.json({ leaderboard });
}));

export default router;
