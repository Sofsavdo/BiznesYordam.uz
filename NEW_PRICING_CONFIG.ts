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
  ai_local_starter: {
    id: 'ai_local_starter',
    segment: 'local',
    name: 'AI Local Starter',
    nameUz: 'AI Local Starter',
    nameRu: 'AI Local Starter',
    nameEn: 'AI Local Starter',
    monthlyFee: 299,
    currency: 'USD',
    revenueCommissionRate: 0.015,
    maxBrands: 1,
    maxMarketplaces: 2,
    maxProducts: 1000,
    features: [
      '1 brand',
      '1-2 lokal marketplace',
      '1000 tagacha mahsulot',
      'AI listing va narx optimizatsiya',
      'AI review va messaging yordamchisi',
      'Asosiy analytics dashboard',
    ],
  },
  ai_local_pro: {
    id: 'ai_local_pro',
    segment: 'local',
    name: 'AI Local Pro',
    nameUz: 'AI Local Pro',
    nameRu: 'AI Local Pro',
    nameEn: 'AI Local Pro',
    monthlyFee: 699,
    currency: 'USD',
    revenueCommissionRate: 0.015,
    maxBrands: 3,
    maxMarketplaces: 3,
    maxProducts: 5000,
    features: [
      '2-3 brand',
      '2-3 lokal marketplace',
      '5000 tagacha mahsulot',
      'Kengaytirilgan AI optimizatsiya',
      'AI Trend tavsiyalari',
      'Prioritet support',
    ],
  },
  ai_global_starter: {
    id: 'ai_global_starter',
    segment: 'global',
    name: 'AI Global Starter',
    nameUz: 'AI Global Starter',
    nameRu: 'AI Global Starter',
    nameEn: 'AI Global Starter',
    monthlyFee: 599,
    currency: 'USD',
    revenueCommissionRate: 0.01,
    maxBrands: 2,
    maxMarketplaces: 3,
    maxProducts: 3000,
    features: [
      '1-2 brand',
      '2-3 global marketplace',
      'AI listing va narx global bozor uchun',
      'Raqobatchi monitoringi',
      'Asosiy global analytics',
    ],
  },
  ai_global_scale: {
    id: 'ai_global_scale',
    segment: 'global',
    name: 'AI Global Scale',
    nameUz: 'AI Global Scale',
    nameRu: 'AI Global Scale',
    nameEn: 'AI Global Scale',
    monthlyFee: 1099,
    currency: 'USD',
    revenueCommissionRate: 0.01,
    maxBrands: 5,
    maxMarketplaces: 5,
    maxProducts: 20000,
    features: [
      '3+ brand',
      '4+ global marketplace',
      'Katta hajm uchun AI strategiya',
      'Kengaytirilgan analytics va reporting',
      'Dedicated success manager',
    ],
  },
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
