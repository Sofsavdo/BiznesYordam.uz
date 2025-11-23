// server/services/priceCalculationService.ts
// INTELLIGENT PRICE CALCULATION - Narx strategiyasi

import { NEW_PRICING_TIERS } from '../../NEW_PRICING_CONFIG';

interface PriceCalculationInput {
  costPrice: number; // Tannarx (hamkordan)
  productCategory: string;
  marketplaceType: 'uzum' | 'wildberries' | 'yandex' | 'ozon';
  partnerTier: string; // starter_pro, business_standard, etc.
  competitorPrices?: number[]; // Raqobatchilar narxlari (opsional)
  targetMargin?: number; // Maqsadli foyda foizi (default: 30%)
}

interface PriceCalculationResult {
  recommendedPrice: number;
  breakdown: {
    costPrice: number;
    marketplaceCommission: number;
    logisticsPercentage: number;
    ourCommissionPercentage: number;
    ourCommissionAmount: number;
    totalCosts: number;
    profitMargin: number;
    profitAmount: number;
  };
  competitiveAnalysis: {
    averageMarketPrice: number;
    minCompetitorPrice: number;
    maxCompetitorPrice: number;
    ourPosition: string; // 'lower', 'average', 'higher'
  } | null;
  priceRange: {
    minimum: number; // Minimal qoplash narxi
    optimal: number; // Optimal raqobatbardosh narx
    premium: number; // Premium strategiya narxi
  };
  strategy: string;
  warnings: string[];
}

// Marketplace komissiyalari (o'rtacha foizlar)
const MARKETPLACE_COMMISSIONS: Record<string, number> = {
  uzum: 0.15, // 15%
  wildberries: 0.12, // 12%
  yandex: 0.13, // 13%
  ozon: 0.14, // 14%
};

// Logistika xarajatlari (narxdan foiz)
const LOGISTICS_PERCENTAGE = 0.05; // 5%

// Kategoriya bo'yicha qo'shimcha koeffitsientlar
const CATEGORY_MULTIPLIERS: Record<string, number> = {
  electronics: 1.2,
  fashion: 1.15,
  home: 1.1,
  beauty: 1.25,
  sports: 1.12,
  toys: 1.18,
  books: 1.05,
  food: 1.08,
  default: 1.15,
};

export function calculateOptimalPrice(input: PriceCalculationInput): PriceCalculationResult {
  const {
    costPrice,
    productCategory,
    marketplaceType,
    partnerTier,
    competitorPrices = [],
    targetMargin = 0.3, // 30% default profit margin
  } = input;

  // 1. Get partner's commission rate from tier
  const tierConfig = NEW_PRICING_TIERS[partnerTier as keyof typeof NEW_PRICING_TIERS];
  if (!tierConfig) {
    throw new Error(`Noma'lum tarif: ${partnerTier}`);
  }

  const ourCommissionRate = tierConfig.commissionRate; // Bizning komissiya foizimiz

  // 2. Get marketplace commission
  const marketplaceCommission = MARKETPLACE_COMMISSIONS[marketplaceType] || 0.15;

  // 3. Category multiplier
  const categoryMultiplier =
    CATEGORY_MULTIPLIERS[productCategory.toLowerCase()] ||
    CATEGORY_MULTIPLIERS.default;

  // 4. Calculate base price with all costs
  const logisticsPercentage = LOGISTICS_PERCENTAGE;

  // Formula:
  // Sotish Narxi = Tannarx / (1 - Marketplace% - Logistika% - Bizning%)
  // Bu formulada barcha xarajatlar hisobga olinadi
  
  const totalCommissionRate =
    marketplaceCommission + logisticsPercentage + ourCommissionRate;

  // Minimum price to cover costs
  const minimumPrice = costPrice / (1 - totalCommissionRate);

  // Optimal price with target margin
  const optimalPrice = costPrice / (1 - totalCommissionRate - targetMargin);

  // Premium strategy (higher margin)
  const premiumPrice = optimalPrice * categoryMultiplier;

  // 5. Competitor analysis
  let competitiveAnalysis = null;
  if (competitorPrices.length > 0) {
    const avgMarketPrice =
      competitorPrices.reduce((sum, p) => sum + p, 0) / competitorPrices.length;
    const minPrice = Math.min(...competitorPrices);
    const maxPrice = Math.max(...competitorPrices);

    let position = 'average';
    if (optimalPrice < avgMarketPrice * 0.9) position = 'lower';
    if (optimalPrice > avgMarketPrice * 1.1) position = 'higher';

    competitiveAnalysis = {
      averageMarketPrice: avgMarketPrice,
      minCompetitorPrice: minPrice,
      maxCompetitorPrice: maxPrice,
      ourPosition: position,
    };
  }

  // 6. Choose final recommended price
  let recommendedPrice = optimalPrice;
  let strategy = 'Optimal - Muvozanatli foyda va raqobat';

  if (competitiveAnalysis) {
    // Agar bozor narxi bizning optimal narxdan past bo'lsa
    if (competitiveAnalysis.averageMarketPrice < optimalPrice) {
      recommendedPrice = Math.max(
        competitiveAnalysis.averageMarketPrice * 0.95,
        minimumPrice * 1.1
      );
      strategy = 'Raqobatbardosh - Bozor narxiga moslashtirilgan';
    }
    // Agar bozorda joy bo'lsa, premium strategiya
    else if (competitiveAnalysis.averageMarketPrice > optimalPrice * 1.2) {
      recommendedPrice = premiumPrice;
      strategy = 'Premium - Yuqori foyda strategiyasi';
    }
  }

  // Round to nearest 1000
  recommendedPrice = Math.round(recommendedPrice / 1000) * 1000;
  const minimumPriceRounded = Math.round(minimumPrice / 1000) * 1000;
  const premiumPriceRounded = Math.round(premiumPrice / 1000) * 1000;

  // 7. Calculate breakdown
  const ourCommissionAmount = recommendedPrice * ourCommissionRate;
  const marketplaceCommissionAmount = recommendedPrice * marketplaceCommission;
  const logisticsAmount = recommendedPrice * logisticsPercentage;
  const totalCosts =
    costPrice + marketplaceCommissionAmount + logisticsAmount + ourCommissionAmount;
  const profitAmount = recommendedPrice - totalCosts;
  const profitMargin = (profitAmount / recommendedPrice) * 100;

  // 8. Warnings
  const warnings: string[] = [];
  
  if (profitMargin < 10) {
    warnings.push('⚠️ Foyda juda kam! Narxni oshirish tavsiya etiladi.');
  }
  
  if (competitiveAnalysis && competitiveAnalysis.ourPosition === 'higher') {
    warnings.push('⚠️ Narx raqobatchilardan yuqori. Sotish qiyinroq bo\'lishi mumkin.');
  }
  
  if (recommendedPrice < minimumPriceRounded * 1.05) {
    warnings.push('⚠️ Narx minimal chegara yaqinida. Zarar bo\'lish xavfi.');
  }

  return {
    recommendedPrice,
    breakdown: {
      costPrice,
      marketplaceCommission: marketplaceCommissionAmount,
      logisticsPercentage: logisticsAmount,
      ourCommissionPercentage: ourCommissionRate * 100,
      ourCommissionAmount,
      totalCosts,
      profitMargin,
      profitAmount,
    },
    competitiveAnalysis,
    priceRange: {
      minimum: minimumPriceRounded,
      optimal: Math.round(optimalPrice / 1000) * 1000,
      premium: premiumPriceRounded,
    },
    strategy,
    warnings,
  };
}

// Example usage and test
export function testPriceCalculation() {
  const result = calculateOptimalPrice({
    costPrice: 50000, // 50,000 so'm tannarx
    productCategory: 'electronics',
    marketplaceType: 'uzum',
    partnerTier: 'business_standard',
    competitorPrices: [95000, 110000, 105000, 98000],
    targetMargin: 0.25, // 25% foyda
  });

  console.log('💰 NARX KALKULYATSIYASI:');
  console.log('Tavsiya etilgan narx:', result.recommendedPrice, 'so\'m');
  console.log('Strategiya:', result.strategy);
  console.log('Foyda:', result.breakdown.profitAmount, 'so\'m');
  console.log('Foyda foizi:', result.breakdown.profitMargin.toFixed(2), '%');
  
  if (result.warnings.length > 0) {
    console.log('\nOGOHLANTIRISHLAR:');
    result.warnings.forEach(w => console.log(w));
  }

  return result;
}
