// NEW PRICING CONFIGURATION
// Updated: 6-Nov-2025
// Version: 3.0.0

export const NEW_PRICING_TIERS = {
  starter_pro: {
    id: 'starter_pro',
    name: 'Starter Pro',
    nameUz: 'Starter Pro',
    nameRu: 'Starter Pro',
    nameEn: 'Starter Pro',
    
    // YANGI: Oylik to'lov
    monthlyFee: 2500000, // 2,500,000 so'm
    
    // YANGI: Komissiya savdodan (oldin foyda edi)
    commissionRate: 0.25, // 25%
    commissionMin: 0.25,
    commissionMax: 0.25,
    
    // Maqsadli aylanma
    minRevenue: 10000000, // 10M
    maxRevenue: 30000000, // 30M
    
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
    description: 'Yangi boshlovchilar va kichik bizneslar uchun',
    popular: false,
    color: 'blue',
  },
  
  business_standard: {
    id: 'business_standard',
    name: 'Business Standard',
    nameUz: 'Business Standard',
    nameRu: 'Business Standard',
    nameEn: 'Business Standard',
    
    // YANGI: Oylik to'lov
    monthlyFee: 5000000, // 5,000,000 so'm
    
    // YANGI: Komissiya savdodan
    commissionRate: 0.20, // 20%
    commissionMin: 0.20,
    commissionMax: 0.20,
    
    // Maqsadli aylanma
    minRevenue: 30000000, // 30M
    maxRevenue: 100000000, // 100M
    
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
    
    description: 'O\'sib borayotgan bizneslar uchun',
    popular: true,
    color: 'green',
  },
  
  professional_plus: {
    id: 'professional_plus',
    name: 'Professional Plus',
    nameUz: 'Professional Plus',
    nameRu: 'Professional Plus',
    nameEn: 'Professional Plus',
    
    // YANGI: Oylik to'lov
    monthlyFee: 10000000, // 10,000,000 so'm
    
    // YANGI: Komissiya savdodan
    commissionRate: 0.15, // 15%
    commissionMin: 0.15,
    commissionMax: 0.15,
    
    // Maqsadli aylanma
    minRevenue: 100000000, // 100M
    maxRevenue: 300000000, // 300M
    
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
    
    description: 'Katta bizneslar va professionallar uchun',
    popular: false,
    color: 'purple',
  },
  
  enterprise_elite: {
    id: 'enterprise_elite',
    name: 'Enterprise Elite',
    nameUz: 'Enterprise Elite',
    nameRu: 'Enterprise Elite',
    nameEn: 'Enterprise Elite',
    
    // YANGI: Oylik to'lov
    monthlyFee: 20000000, // 20,000,000 so'm
    
    // YANGI: Komissiya savdodan
    commissionRate: 0.10, // 10%
    commissionMin: 0.10,
    commissionMax: 0.10,
    
    // Maqsadli aylanma
    minRevenue: 300000000, // 300M
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
    
    description: 'Yirik kompaniyalar va investorlar uchun',
    popular: false,
    color: 'gold',
  },
};

// YANGI: Komissiya hisoblash funksiyasi (savdodan)
export function calculateCommission(revenue: number, tier: string): number {
  const tierConfig = NEW_PRICING_TIERS[tier as keyof typeof NEW_PRICING_TIERS];
  if (!tierConfig) return 0;
  
  return revenue * tierConfig.commissionRate;
}

// YANGI: Oylik to'lov olish
export function getMonthlyFee(tier: string): number {
  const tierConfig = NEW_PRICING_TIERS[tier as keyof typeof NEW_PRICING_TIERS];
  if (!tierConfig) return 0;
  
  return tierConfig.monthlyFee;
}

// YANGI: Umumiy to'lov hisoblash
export function calculateTotalPayment(revenue: number, tier: string): {
  monthlyFee: number;
  commission: number;
  total: number;
} {
  const monthlyFee = getMonthlyFee(tier);
  const commission = calculateCommission(revenue, tier);
  
  return {
    monthlyFee,
    commission,
    total: monthlyFee + commission,
  };
}

// YANGI: Hamkor foydasi hisoblash
export function calculatePartnerProfit(
  revenue: number,
  productCost: number,
  tier: string
): {
  revenue: number;
  productCost: number;
  monthlyFee: number;
  commission: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;
} {
  const payment = calculateTotalPayment(revenue, tier);
  const totalCosts = productCost + payment.total;
  const netProfit = revenue - totalCosts;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  
  return {
    revenue,
    productCost,
    monthlyFee: payment.monthlyFee,
    commission: payment.commission,
    totalCosts,
    netProfit,
    profitMargin,
  };
}

// YANGI: Tejamkorlik hisoblash
export function calculateSavings(revenue: number, tier: string): {
  ourCost: number;
  selfCost: number;
  savings: number;
  savingsPercent: number;
} {
  const payment = calculateTotalPayment(revenue, tier);
  
  // Agar o'zi qilsa (o'rtacha xarajatlar)
  const selfCost = {
    starter_pro: 17500000, // 15M jamoa + 2M ombor + 0.5M platforma
    business_standard: 37000000, // 27M jamoa + 10M reklama
    professional_plus: 65000000, // 40M jamoa + 20M marketing + 5M texnologiya
    enterprise_elite: 145000000, // 80M jamoa + 50M marketing + 10M texnologiya + 5M yuridik
  };
  
  const selfCostAmount = selfCost[tier as keyof typeof selfCost] || 0;
  const savings = selfCostAmount - payment.total;
  const savingsPercent = selfCostAmount > 0 ? (savings / selfCostAmount) * 100 : 0;
  
  return {
    ourCost: payment.total,
    selfCost: selfCostAmount,
    savings,
    savingsPercent,
  };
}

// Export default
export default NEW_PRICING_TIERS;
