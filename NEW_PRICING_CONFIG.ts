// NEW PRICING CONFIGURATION - PROFIT SHARE MODEL
// Updated: 24-Nov-2025
// Version: 4.0.0 - WIN-WIN Model

export const NEW_PRICING_TIERS = {
  starter_pro: {
    id: 'starter_pro',
    name: 'Starter Pro',
    nameUz: 'Starter Pro',
    nameRu: 'Starter Pro',
    nameEn: 'Starter Pro',
    
    // PROFIT SHARE MODEL: Abonent + Foydadan %
    monthlyFee: 3000000, // 3,000,000 so'm oylik abonent
    
    // YANGI: Profit share (foydadan %)
    profitShareRate: 0.50, // 50% foydadan
    commissionRate: 0.50, // Legacy compat
    
    // Maqsadli aylanma
    minRevenue: 20000000, // 20M
    maxRevenue: 50000000, // 50M
    
    // Cheklovlar
    limits: {
      marketplaces: 1,
      products: 100,
      warehouseKg: 100,
      supportResponseTime: '48h',
      consultationHours: 0,
    },
    
    // Xizmatlar
    features: [
      '1 ta marketplace (Uzum yoki Wildberries)',
      '100 tagacha mahsulot',
      'Basic dashboard',
      'Mahsulot yuklash va boshqarish',
      'Buyurtmalarni qayta ishlash',
      'Asosiy hisobotlar',
      'Email yordam (48 soat)',
      'Ombor xizmati (100 kg)',
      'Asosiy CRM',
    ],
    
    // Qo'shimcha ma'lumotlar
    description: 'Yangi boshlovchilar - past risk, yuqori profit share',
    popular: false,
    color: 'blue',
    badge: 'Low Risk'
  },
  
  business_standard: {
    id: 'business_standard',
    name: 'Business Standard',
    nameUz: 'Business Standard',
    nameRu: 'Business Standard',
    nameEn: 'Business Standard',
    
    // PROFIT SHARE MODEL: Abonent + Foydadan %
    monthlyFee: 8000000, // 8,000,000 so'm oylik abonent
    
    // YANGI: Profit share (foydadan %)
    profitShareRate: 0.25, // 25% foydadan
    commissionRate: 0.25, // Legacy compat
    
    // Maqsadli aylanma
    minRevenue: 50000000, // 50M
    maxRevenue: 150000000, // 150M
    
    // Cheklovlar
    limits: {
      marketplaces: 2,
      products: 500,
      warehouseKg: 500,
      supportResponseTime: '24h',
      consultationHours: 2,
    },
    
    // Xizmatlar
    features: [
      '2 ta marketplace (Uzum + Wildberries)',
      '500 tagacha mahsulot',
      'To\'liq dashboard',
      'Foyda/zarar tahlili',
      'Kengaytirilgan hisobotlar',
      'Prognozlar',
      'Telefon yordam (24 soat)',
      'Ombor xizmati (500 kg)',
      'To\'liq CRM',
      'Asosiy marketing',
      'Oylik konsultatsiya (2 soat)',
      'Raqobatchilar tahlili',
      'Narx optimizatsiyasi',
      'Sharh boshqaruvi',
    ],
    
    description: 'O\'sib borayotgan biznes - muvozanatlangan model',
    popular: true,
    color: 'green',
    badge: 'Recommended'
  },
  
  professional_plus: {
    id: 'professional_plus',
    name: 'Professional Plus',
    nameUz: 'Professional Plus',
    nameRu: 'Professional Plus',
    nameEn: 'Professional Plus',
    
    // PROFIT SHARE MODEL: Abonent + Foydadan %
    monthlyFee: 18000000, // 18,000,000 so'm oylik abonent
    
    // YANGI: Profit share (foydadan %)
    profitShareRate: 0.15, // 15% foydadan
    commissionRate: 0.15, // Legacy compat
    
    // Maqsadli aylanma
    minRevenue: 150000000, // 150M
    maxRevenue: 400000000, // 400M
    
    // Cheklovlar
    limits: {
      marketplaces: 4,
      products: 2000,
      warehouseKg: 2000,
      supportResponseTime: '1h',
      consultationHours: 4,
    },
    
    // Xizmatlar
    features: [
      '4 ta marketplace (Uzum + Wildberries + Yandex + Ozon)',
      '2,000 tagacha mahsulot',
      'Premium dashboard',
      'AI-powered tahlil',
      'Trend hunter',
      'Real-time prognozlar',
      'Shaxsiy menejer',
      '24/7 yordam (1 soat)',
      'Ombor xizmati (2,000 kg)',
      'Premium CRM',
      'To\'liq marketing xizmati',
      'Haftalik konsultatsiya (4 soat/oy)',
      'A/B testing',
      'Influencer marketing',
      'Professional fotosurat',
      'Video kontent',
      'SEO optimizatsiya',
      'Reklama boshqaruvi',
    ],
    
    description: 'Katta biznes - yuqori to\'lov, past profit share',
    popular: false,
    color: 'purple',
    badge: 'High Volume'
  },
  
  enterprise_elite: {
    id: 'enterprise_elite',
    name: 'Enterprise Elite',
    nameUz: 'Enterprise Elite',
    nameRu: 'Enterprise Elite',
    nameEn: 'Enterprise Elite',
    
    // PROFIT SHARE MODEL: Abonent + Foydadan %
    monthlyFee: 25000000, // 25,000,000 so'm oylik abonent
    
    // YANGI: Profit share (foydadan %)
    profitShareRate: 0.10, // 10% foydadan
    commissionRate: 0.10, // Legacy compat
    
    // Maqsadli aylanma
    minRevenue: 500000000, // 500M
    maxRevenue: null, // Cheksiz
    
    // Cheklovlar
    limits: {
      marketplaces: 999, // Barchasi
      products: 999999, // Cheksiz
      warehouseKg: 999999, // Cheksiz
      supportResponseTime: '30min',
      consultationHours: 20,
    },
    
    // Xizmatlar
    features: [
      'Barcha marketplace\'lar',
      'Cheksiz mahsulot',
      'Enterprise dashboard',
      'Maxsus AI tahlil',
      'Shaxsiy jamoa (3-5 kishi)',
      '24/7 VIP yordam (30 daqiqa)',
      'Cheksiz ombor',
      'Enterprise CRM',
      'To\'liq marketing va branding',
      'Kunlik konsultatsiya (20 soat/oy)',
      'Maxsus integratsiyalar',
      'White-label yechimlar',
      'Yuridik yordam',
      'Moliyaviy maslahat',
      'Strategik rejalashtirish',
      'Xalqaro kengayish',
      'Investor munosabatlari',
    ],
    
    description: 'Korporate - maksimal stabillik, minimal share',
    popular: false,
    color: 'gold',
    badge: 'VIP'
  },
};

// YANGI v4: Profit share hisoblash (foydadan %)
// netProfit = revenue - costs - marketplace fees
export function calculateProfitShare(netProfit: number, tier: string): number {
  const tierConfig = NEW_PRICING_TIERS[tier as keyof typeof NEW_PRICING_TIERS];
  if (!tierConfig) return 0;
  
  return netProfit * (tierConfig.profitShareRate || tierConfig.commissionRate);
}

// Legacy compat: Komissiya hisoblash (eski model)
export function calculateCommission(revenue: number, tier: string): number {
  const tierConfig = NEW_PRICING_TIERS[tier as keyof typeof NEW_PRICING_TIERS];
  if (!tierConfig) return 0;
  
  // Legacy: savdodan % (eski model)
  return revenue * (tierConfig.profitShareRate || tierConfig.commissionRate);
}

// YANGI: Oylik to'lov olish
export function getMonthlyFee(tier: string): number {
  const tierConfig = NEW_PRICING_TIERS[tier as keyof typeof NEW_PRICING_TIERS];
  if (!tierConfig) return 0;
  
  return tierConfig.monthlyFee;
}

// YANGI v4: Umumiy to'lov hisoblash (PROFIT SHARE MODEL)
export function calculateTotalPayment(
  revenue: number, 
  netProfit: number, 
  tier: string
): {
  monthlyFee: number;
  profitShare: number;
  commission: number; // Legacy compat
  total: number;
} {
  const monthlyFee = getMonthlyFee(tier);
  const profitShare = calculateProfitShare(netProfit, tier);
  
  return {
    monthlyFee,
    profitShare,
    commission: profitShare, // Legacy compat
    total: monthlyFee + profitShare,
  };
}

// YANGI v4: Hamkor foydasi hisoblash (PROFIT SHARE MODEL)
export function calculatePartnerProfit(
  revenue: number,
  productCost: number,
  marketplaceFees: number,
  tier: string
): {
  revenue: number;
  productCost: number;
  marketplaceFees: number;
  grossProfit: number;
  monthlyFee: number;
  profitShare: number;
  totalFulfillmentFee: number;
  netProfit: number;
  profitMargin: number;
} {
  // 1. Gross profit (avval marketplace fees ayiramiz)
  const grossProfit = revenue - productCost - marketplaceFees;
  
  // 2. Fulfillment fees (abonent + profit share)
  const payment = calculateTotalPayment(revenue, grossProfit, tier);
  
  // 3. Net profit (gross - fulfillment)
  const netProfit = grossProfit - payment.total;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  
  return {
    revenue,
    productCost,
    marketplaceFees,
    grossProfit,
    monthlyFee: payment.monthlyFee,
    profitShare: payment.profitShare,
    totalFulfillmentFee: payment.total,
    netProfit,
    profitMargin,
  };
}

export const AI_MANAGER_PLANS = {
  ai_starter: {
    id: 'ai_starter',
    name: 'AI Starter',
    nameUz: 'AI Starter',
    monthlyFee: 349,
    currency: 'USD',
    revenueCommission: 0.015, // 1.5%
    skuLimit: 100,
    
    features: {
      included: [
        'AI kartochka yaratish',
        'Marketplace avtomatik yuklash',
        'SEO optimizatsiya',
        'Narx monitoring',
        'Buyurtma boshqaruvi',
        'Basic analytics',
        'Email support'
      ],
      restricted: [
        'Trend Hunter (yopiq)',
        'Sof foyda analizi (yopiq)',
        'Advanced analytics (yopiq)',
        'Marketplace soni: 2 ta max'
      ]
    },
    
    limits: {
      sku: 100,
      marketplaces: 2,
      trendHunter: false,
      profitAnalysis: false,
      advancedAnalytics: false
    },
    
    note: 'AI xarajatlari biz qoplaymiz - qayta to\'lov yo\'q!'
  },
  
  ai_manager_pro: {
    id: 'ai_manager_pro',
    name: 'AI Manager Pro',
    nameUz: 'AI Manager Pro',
    monthlyFee: 899,
    currency: 'USD',
    revenueCommission: 0.01, // 1%
    skuLimit: 250,
    
    features: {
      included: [
        'BARCHA AI Starter features',
        'Trend Hunter FULL',
        'Sof foyda analizi',
        'Advanced analytics',
        'Cheksiz marketplace',
        'Priority support',
        'API access',
        'Custom integrations'
      ],
      note: '250+ SKU - alohida kelishuv va qo\'shimcha xizmat'
    },
    
    limits: {
      sku: 250,
      marketplaces: 999,
      trendHunter: true,
      profitAnalysis: true,
      advancedAnalytics: true
    },
    
    note: 'FULL variant - barcha funksiyalar. AI xarajatlari biz qoplaymiz!'
  }
};

export function getAIManagerPlan(planCode: string): (typeof AI_MANAGER_PLANS)[keyof typeof AI_MANAGER_PLANS] | null {
  const plan = AI_MANAGER_PLANS[planCode as keyof typeof AI_MANAGER_PLANS];
  return plan || null;
}

export function getAIManagerMonthlyFee(planCode: string): number {
  const plan = getAIManagerPlan(planCode);
  if (!plan) return 0;
  return plan.monthlyFee;
}

export function calculateAIManagerCommission(revenue: number, planCode: string): number {
  const plan = getAIManagerPlan(planCode);
  if (!plan) return 0;
  return revenue * (plan.revenueCommissionRate || 0);
}

// Export default
export default NEW_PRICING_TIERS;
