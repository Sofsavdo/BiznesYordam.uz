// Referral API Routes - SellerCloudX (REAL IMPLEMENTATION)
import express, { Request, Response } from 'express';
import { asyncHandler } from '../errorHandler';
import { db } from '../db';
import { referrals, partners, referralEarnings, withdrawals } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const router = express.Router();

// Referral Tiers Configuration
const REFERRAL_TIERS = {
  bronze: { min: 0, max: 9, commission: 0.10, name: 'Bronze', icon: '🥉', bonus: 0 },
  silver: { min: 10, max: 24, commission: 0.15, name: 'Silver', icon: '🥈', bonus: 50 },
  gold: { min: 25, max: 49, commission: 0.20, name: 'Gold', icon: '🥇', bonus: 150 },
  platinum: { min: 50, max: 99, commission: 0.25, name: 'Platinum', icon: '💎', bonus: 500 },
  diamond: { min: 100, max: Infinity, commission: 0.30, name: 'Diamond', icon: '👑', bonus: 1500 }
};

// Commission Rates by Plan
const COMMISSION_RATES = {
  starter_pro: 2.90,    // $29 × 10%
  growth_pro: 9.90,     // $99 × 10%
  enterprise_pro: 29.90 // $299 × 10%
};

// Calculate tier based on referral count
function calculateTier(referralCount: number) {
  for (const [key, tier] of Object.entries(REFERRAL_TIERS)) {
    if (referralCount >= tier.min && referralCount <= tier.max) {
      return { key, ...tier };
    }
  }
  return { key: 'bronze', ...REFERRAL_TIERS.bronze };
}

// Generate promo code
router.post('/generate-code', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = (req as any).partner;
  
  if (!user || !partner) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Generate unique promo code
  const promoCode = `SCX-${nanoid(6).toUpperCase()}`;
  
  // Get base URL from environment or request
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const shareUrl = `${baseUrl}/partner-registration?ref=${promoCode}`;
  
  res.json({
    promoCode,
    shareUrl,
    message: 'Promo kod yaratildi',
    socialShare: {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('SellerCloudX bilan qo\'shiling!')}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`SellerCloudX bilan qo'shiling! ${shareUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    }
  });
}));

// Get referral stats
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = (req as any).partner;
  
  if (!user || !partner) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Get all referrals
    const allReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerPartnerId, partner.id));

    // Count active referrals (paid at least 1 month)
    const activeReferrals = allReferrals.filter(r => 
      r.status === 'active' || r.status === 'paid_1month'
    );

    // Get earnings
    const earnings = await db
      .select({
        total: sql<number>`COALESCE(SUM(amount), 0)`,
        paid: sql<number>`COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)`,
        pending: sql<number>`COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0)`
      })
      .from(referralEarnings)
      .where(eq(referralEarnings.referrerPartnerId, partner.id));

    const totalEarned = earnings[0]?.total || 0;
    const totalPaid = earnings[0]?.paid || 0;
    const available = earnings[0]?.pending || 0;

    // Calculate tier
    const tier = calculateTier(activeReferrals.length);

    res.json({
      tier: tier.key,
      tierName: tier.name,
      tierIcon: tier.icon,
      tierProgress: {
        current: activeReferrals.length,
        next: tier.max + 1,
        percentage: Math.min((activeReferrals.length / (tier.max + 1)) * 100, 100)
      },
      totalReferrals: allReferrals.length,
      activeReferrals: activeReferrals.length,
      totalEarned: totalEarned,
      totalPaid: totalPaid,
      available: available,
      canWithdraw: available >= 50, // Minimum $50
      commission: tier.commission * 100,
      nextTierBonus: tier.max < Infinity ? REFERRAL_TIERS[Object.keys(REFERRAL_TIERS)[Object.keys(REFERRAL_TIERS).indexOf(tier.key) + 1]]?.bonus : 0
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
}));

// Get referral list
router.get('/list', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = (req as any).partner;
  
  if (!user || !partner) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const referralList = await db
      .select({
        id: referrals.id,
        referredPartner: {
          id: partners.id,
          businessName: partners.businessName,
          pricingTier: partners.pricingTier
        },
        status: referrals.status,
        bonusEarned: referrals.bonusEarned,
        bonusPaid: referrals.bonusPaid,
        createdAt: referrals.createdAt,
        activatedAt: referrals.activatedAt
      })
      .from(referrals)
      .leftJoin(partners, eq(referrals.referredPartnerId, partners.id))
      .where(eq(referrals.referrerPartnerId, partner.id))
      .orderBy(sql`${referrals.createdAt} DESC`);

    res.json({ referrals: referralList });
  } catch (error) {
    console.error('Referral list error:', error);
    res.status(500).json({ message: 'Failed to fetch referrals' });
  }
}));

// Withdrawal request
router.post('/withdraw', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = (req as any).partner;
  
  if (!user || !partner) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { amount, method, accountDetails } = req.body;

  if (!amount || amount < 50) {
    return res.status(400).json({ message: 'Minimum withdrawal amount is $50' });
  }

  if (!method) {
    return res.status(400).json({ message: 'Payment method required' });
  }

  try {
    // Check available balance
    const earnings = await db
      .select({
        available: sql<number>`COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0)`
      })
      .from(referralEarnings)
      .where(eq(referralEarnings.referrerPartnerId, partner.id));

    const available = earnings[0]?.available || 0;

    if (amount > available) {
      return res.status(400).json({ 
        message: 'Insufficient balance',
        available 
      });
    }

    // Create withdrawal request
    const withdrawalId = `wd_${nanoid()}`;
    
    await db.insert(withdrawals).values({
      id: withdrawalId,
      partnerId: partner.id,
      amount,
      method,
      accountDetails: JSON.stringify(accountDetails),
      status: 'pending',
      createdAt: new Date()
    });

    res.json({
      message: "Pul yechish so'rovi yuborildi",
      withdrawalId,
      amount,
      method,
      status: 'pending',
      estimatedProcessing: '3-5 business days'
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ message: 'Failed to process withdrawal' });
  }
}));

// Get withdrawal history
router.get('/withdrawals', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = (req as any).partner;
  
  if (!user || !partner) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const withdrawalHistory = await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.partnerId, partner.id))
      .orderBy(sql`${withdrawals.createdAt} DESC`);

    res.json({ withdrawals: withdrawalHistory });
  } catch (error) {
    console.error('Withdrawal history error:', error);
    res.status(500).json({ message: 'Failed to fetch withdrawals' });
  }
}));

// Leaderboard
router.get('/leaderboard', asyncHandler(async (req: Request, res: Response) => {
  try {
    const leaderboard = await db
      .select({
        partnerId: referrals.referrerPartnerId,
        businessName: partners.businessName,
        referralCount: sql<number>`COUNT(*)`,
        totalEarnings: sql<number>`COALESCE(SUM(${referrals.bonusEarned}), 0)`
      })
      .from(referrals)
      .leftJoin(partners, eq(referrals.referrerPartnerId, partners.id))
      .where(eq(referrals.status, 'active'))
      .groupBy(referrals.referrerPartnerId, partners.businessName)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(10);

    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      name: entry.businessName || 'Anonymous',
      referrals: entry.referralCount,
      earnings: entry.totalEarnings
    }));

    res.json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
}));

// Validate promo code
router.get('/validate/:code', asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;

  try {
    // Check if code exists and is valid
    const referral = await db
      .select({
        referrer: {
          id: partners.id,
          businessName: partners.businessName
        }
      })
      .from(referrals)
      .leftJoin(partners, eq(referrals.referrerPartnerId, partners.id))
      .where(eq(referrals.promoCode, code))
      .limit(1);

    if (referral.length === 0) {
      return res.status(404).json({ 
        valid: false,
        message: 'Invalid promo code' 
      });
    }

    res.json({
      valid: true,
      referrer: referral[0].referrer,
      discount: 5, // $5 discount for new user
      message: 'Valid promo code'
    });
  } catch (error) {
    console.error('Validate code error:', error);
    res.status(500).json({ message: 'Failed to validate code' });
  }
}));

export default router;
