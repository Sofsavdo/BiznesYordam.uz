// REFERRAL SYSTEM CONFIG - SellerCloudX
// No Lifetime - Clear & Simple

export const REFERRAL_CONFIG = {
  // REQUIREMENTS
  minSubscription: 6, // 6-month Premium required
  minActiveReferrals: 3, // Minimum to qualify for withdrawal
  minWithdrawal: 100, // $100 USD
  maxWithdrawalPercent: 50, // 50% of total bonus per month
  
  // BONUS RATES by Referred Contract Type
  contractBonuses: {
    '1_month': {
      rate: 0.10, // 10% of platform profit
      duration: 3, // 3 months max
      description: 'Longevity-based',
      schedule: [
        { month: 1, rate: 0.05 }, // 5% first month (low commitment)
        { month: 2, rate: 0.10 }, // 10% if they stay
        { month: 3, rate: 0.10 }  // 10% third month
      ]
    },
    '3_month': {
      rate: 0.20, // 20% of platform profit
      duration: 3, // 3 months
      description: 'Standard bonus',
      instantBonus: 30 // $30 signup bonus
    },
    '6_month': {
      rate: 0.25, // 25% of platform profit
      duration: 3, // 3 months (not 6!)
      description: 'Premium bonus',
      instantBonus: 75 // $75 signup bonus
    }
  },
  
  // TIER SYSTEM (Based on Total Referrals)
  tiers: {
    bronze: {
      name: 'Bronze',
      nameUz: 'Bronza',
      minReferrals: 1,
      maxReferrals: 5,
      multiplier: 1.0, // No bonus
      benefits: [
        'Standard bonus rates',
        '$100 minimal yechib olish'
      ],
      icon: '🥉',
      color: '#CD7F32'
    },
    silver: {
      name: 'Silver',
      nameUz: 'Kumush',
      minReferrals: 6,
      maxReferrals: 15,
      multiplier: 1.1, // +10% bonus
      benefits: [
        '+10% bonus barcha referrallar',
        '+1 oy bepul obuna',
        'Priority support'
      ],
      icon: '🥈',
      color: '#C0C0C0'
    },
    gold: {
      name: 'Gold',
      nameUz: 'Oltin',
      minReferrals: 16,
      maxReferrals: 999,
      multiplier: 1.25, // +25% bonus
      benefits: [
        '+25% bonus barcha referrallar',
        '+3 oy bepul obuna',
        'VIP support',
        'Shaxsiy account manager'
      ],
      icon: '🥇',
      color: '#FFD700'
    }
  },
  
  // WITHDRAWAL OPTIONS
  withdrawalMethods: {
    bank_transfer: {
      name: 'Bank Transfer',
      fee: 5, // $5
      processingDays: 7,
      minAmount: 100
    },
    click: {
      name: 'Click',
      fee: 2, // $2
      processingDays: 3,
      minAmount: 50
    },
    payme: {
      name: 'Payme',
      fee: 2, // $2
      processingDays: 3,
      minAmount: 50
    },
    balance: {
      name: 'Account Balance',
      fee: 0, // Free!
      processingDays: 0,
      minAmount: 10,
      description: 'Faqat obuna uzaytirish uchun',
      bonus: 0.10 // +10% if reinvested!
    }
  },
  
  // PAYOUT SCHEDULE
  payoutSchedule: {
    calculationPeriod: [1, 15], // 1-15 kun - calculation
    verificationPeriod: [16, 20], // 16-20 - verification
    payoutPeriod: [21, 25], // 21-25 - payout
    availablePeriod: [26, 30] // 26-30 - available for withdrawal
  },
  
  // ANTI-FRAUD
  verification: {
    emailVerification: true,
    businessVerification: true, // For 10+ referrals
    minActiveMonths: 1, // Referred partner must be active 1+ month
    maxChurnRate: 0.20, // 20% max cancellation rate
    fraudPenalty: 'permanent_ban'
  },
  
  // BONUSES & ACHIEVEMENTS
  achievements: {
    first_referral: { name: 'First Blood', bonus: 10, icon: '🎯' },
    five_in_month: { name: 'Rising Star', bonus: 50, icon: '⭐' },
    ten_total: { name: 'Team Builder', bonus: 100, icon: '👥' },
    fifty_total: { name: 'Empire Creator', bonus: 500, icon: '🏰' }
  }
};

// HELPER FUNCTIONS

// REFERRAL BONUS CALCULATION RULES
// CRITICAL: Bonus faqat referred partner 1+ oy to'lov qilgandan keyin hisoblanadi!\n\nexport function calculateReferralBonus(
  platformProfit: number,
  contractType: '1_month' | '3_month' | '6_month',
  referrerTier: 'bronze' | 'silver' | 'gold',
  monthNumber: number,
  referredPartnerPaidMonths: number // YANGI: Necha oy to'lov qilgan
): number {\n  // CRITICAL CHECK: Faqat 1+ oy to'lov qilgan bo'lsa bonus\n  if (referredPartnerPaidMonths < 1) {\n    return 0; // Hali to'lov qilmagan - bonus yo'q!\n  }\n  \n  const contract = REFERRAL_CONFIG.contractBonuses[contractType];\n  const tier = REFERRAL_CONFIG.tiers[referrerTier];\n  \n  let baseRate = contract.rate;\n  \n  // For 1-month, use schedule\n  if (contractType === '1_month' && contract.schedule) {\n    const scheduleItem = contract.schedule.find(s => s.month === monthNumber);\n    baseRate = scheduleItem?.rate || 0;\n  }\n  \n  const baseBonus = platformProfit * baseRate;\n  const multipliedBonus = baseBonus * tier.multiplier;\n  \n  return multipliedBonus;\n}

export function getReferrerTier(totalReferrals: number): 'bronze' | 'silver' | 'gold' {
  if (totalReferrals >= 16) return 'gold';
  if (totalReferrals >= 6) return 'silver';
  return 'bronze';
}

export function canWithdraw(referrer: any): { can: boolean; reason?: string } {
  if (!referrer.isPremium || referrer.subscriptionMonths < 6) {
    return { can: false, reason: '6-oylik Premium shart' };
  }
  
  if (referrer.activeReferrals < 3) {
    return { can: false, reason: 'Minimum 3 ta aktiv referral kerak' };
  }
  
  if (referrer.availableBonus < REFERRAL_CONFIG.minWithdrawal) {
    return { can: false, reason: `Minimal $${REFERRAL_CONFIG.minWithdrawal}` };
  }
  
  return { can: true };
}

export function calculateTotalBonus(referrals: any[]): number {
  return referrals.reduce((total, ref) => total + (ref.bonusEarned || 0), 0);
}
