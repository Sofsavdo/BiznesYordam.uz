// server/services/trendingAnalytics.ts
// ADVANCED TRENDING PRODUCTS ANALYTICS ENGINE
// Bu servis xalqaro bozorlarni tahlil qiladi va O'zbekistonga mos trendlarni topadi

import OpenAI from 'openai';
import { db } from '../db';
import { storage } from '../storage';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

// ================================================================
// 1. MARKET DATA SOURCES
// ================================================================

interface MarketSource {
  id: string;
  name: string;
  region: string;
  apiAvailable: boolean;
}

const MARKET_SOURCES: MarketSource[] = [
  { id: 'amazon_us', name: 'Amazon USA', region: 'USA', apiAvailable: true },
  { id: 'amazon_eu', name: 'Amazon Europe', region: 'EU', apiAvailable: true },
  { id: 'aliexpress', name: 'AliExpress', region: 'China', apiAvailable: true },
  { id: 'alibaba', name: 'Alibaba', region: 'China', apiAvailable: false },
  { id: 'ebay', name: 'eBay', region: 'Global', apiAvailable: true },
  { id: 'shopify', name: 'Shopify Trends', region: 'Global', apiAvailable: false },
  { id: 'google_trends', name: 'Google Trends', region: 'Global', apiAvailable: true },
];

// ================================================================
// 2. TREND SCORING ALGORITHM
// ================================================================

interface TrendFactors {
  searchVolume: number;        // 0-100
  priceCompetitiveness: number; // 0-100
  profitMargin: number;         // 0-100
  marketSaturation: number;     // 0-100 (lower is better)
  growthRate: number;           // -100 to +100
  seasonality: number;          // 0-100
  shippingFeasibility: number;  // 0-100
  localDemand: number;          // 0-100 (O'zbekiston market)
}

export function calculateTrendScore(factors: TrendFactors): number {
  // Weighted average formula
  const weights = {
    searchVolume: 0.20,          // 20%
    priceCompetitiveness: 0.15,  // 15%
    profitMargin: 0.25,          // 25% - ENG MUHIM!
    marketSaturation: 0.10,      // 10%
    growthRate: 0.15,            // 15%
    seasonality: 0.05,           // 5%
    shippingFeasibility: 0.05,   // 5%
    localDemand: 0.05,           // 5%
  };

  const score = 
    factors.searchVolume * weights.searchVolume +
    factors.priceCompetitiveness * weights.priceCompetitiveness +
    factors.profitMargin * weights.profitMargin +
    (100 - factors.marketSaturation) * weights.marketSaturation + // Inverted
    (factors.growthRate + 100) / 2 * weights.growthRate +
    factors.seasonality * weights.seasonality +
    factors.shippingFeasibility * weights.shippingFeasibility +
    factors.localDemand * weights.localDemand;

  return Math.round(score);
}

// ================================================================
// 3. PROFIT CALCULATOR FOR TRENDING PRODUCTS
// ================================================================

interface ProfitCalculation {
  costPrice: number;           // Xitoydan olib kelish narxi
  shippingCost: number;        // Yetkazib berish
  customsDuty: number;         // Bojxona
  localShipping: number;       // O'zbekistonda yetkazish
  marketplaceFee: number;      // Marketplace komissiya
  ourCommission: number;       // BiznesYordam komissiya
  recommendedPrice: number;    // Tavsiya qilinadigan narx
  profitMargin: number;        // Foyda %
  estimatedProfit: number;     // Foyda so'mda
  breakEvenUnits: number;      // Qancha sotilsa o'taydi
  riskLevel: 'low' | 'medium' | 'high';
}

export function calculateProductProfit(params: {
  sourcePrice: number;        // Dollar/Yuan
  weight: number;             // kg
  category: string;
  targetMarketplace: string;
  exchangeRate?: number;
}): ProfitCalculation {
  const { sourcePrice, weight, category, targetMarketplace } = params;
  const exchangeRate = params.exchangeRate || 12500; // 1 USD = 12,500 UZS

  // 1. Source price in UZS
  const costPriceUZS = sourcePrice * exchangeRate;

  // 2. Shipping cost (international)
  // Approximation: $5-15 per kg from China
  const shippingPerKg = weight < 1 ? 8 : weight < 5 ? 6 : 5;
  const shippingCost = weight * shippingPerKg * exchangeRate;

  // 3. Customs duty (15-30% in Uzbekistan)
  const customsRate = category === 'electronics' ? 0.30 : 0.15;
  const customsDuty = costPriceUZS * customsRate;

  // 4. Local shipping in Uzbekistan
  const localShipping = 30000; // Average 30k per delivery

  // 5. Marketplace fee
  const marketplaceFees: Record<string, number> = {
    uzum: 0.15,
    wildberries: 0.12,
    yandex: 0.13,
    ozon: 0.14,
  };
  const marketplaceFeeRate = marketplaceFees[targetMarketplace] || 0.15;

  // 6. Total cost
  const totalCost = costPriceUZS + shippingCost + customsDuty + localShipping;

  // 7. Recommended price (cost + 50% markup + fees)
  const basePrice = totalCost * 1.5;
  const recommendedPrice = basePrice / (1 - marketplaceFeeRate - 0.10); // 10% our commission

  const marketplaceFee = recommendedPrice * marketplaceFeeRate;
  const ourCommission = recommendedPrice * 0.10;

  // 8. Profit calculation
  const estimatedProfit = recommendedPrice - totalCost - marketplaceFee - ourCommission;
  const profitMargin = (estimatedProfit / recommendedPrice) * 100;

  // 9. Break-even calculation
  const fixedCosts = 500000; // Setup costs (warehouse, marketing)
  const breakEvenUnits = Math.ceil(fixedCosts / estimatedProfit);

  // 10. Risk assessment
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  if (profitMargin > 30 && breakEvenUnits < 20) riskLevel = 'low';
  if (profitMargin < 15 || breakEvenUnits > 50) riskLevel = 'high';

  return {
    costPrice: totalCost,
    shippingCost,
    customsDuty,
    localShipping,
    marketplaceFee,
    ourCommission,
    recommendedPrice: Math.round(recommendedPrice),
    profitMargin: Math.round(profitMargin * 10) / 10,
    estimatedProfit: Math.round(estimatedProfit),
    breakEvenUnits,
    riskLevel,
  };
}

// ================================================================
// 4. AI TREND PREDICTOR
// ================================================================

export async function predictTrendWithAI(productData: {
  productName: string;
  category: string;
  currentSearchVolume: number;
  priceRange: string;
  sourceMarket: string;
}): Promise<{
  prediction: string;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  estimatedGrowth: number; // % growth in next 3 months
}> {
  try {
    const prompt = `
Analyze this product trend for the Uzbekistan market:

Product: ${productData.productName}
Category: ${productData.category}
Current Search Volume: ${productData.currentSearchVolume}/month
Price Range: ${productData.priceRange}
Source Market: ${productData.sourceMarket}

Context:
- Uzbekistan population: 35M, median age: 28
- Growing middle class, increasing online shopping
- Popular categories: electronics, fashion, home goods
- Competitors: Uzum Market, Wildberries, Baraka Market

Provide analysis in JSON format:
{
  "prediction": "rising|stable|declining",
  "confidence": 0-100,
  "reasoning": "detailed explanation in Uzbek",
  "recommendations": ["action 1", "action 2", "action 3"],
  "estimatedGrowth": -50 to +200 (% in next 3 months),
  "targetAudience": "description",
  "marketingStrategy": "brief strategy",
  "seasonality": "Q1|Q2|Q3|Q4 or year-round"
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert market analyst specializing in e-commerce trends in Central Asia.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      prediction: result.prediction || 'stable',
      confidence: result.confidence || 50,
      reasoning: result.reasoning || 'Ma\'lumot yetarli emas',
      recommendations: result.recommendations || [],
      estimatedGrowth: result.estimatedGrowth || 0,
    };
  } catch (error: any) {
    console.error('AI trend prediction error:', error.message);
    return {
      prediction: 'stable',
      confidence: 50,
      reasoning: 'AI tahlil qilishda xatolik',
      recommendations: ['Manual tahlil qilish tavsiya etiladi'],
      estimatedGrowth: 0,
    };
  }
}

// ================================================================
// 5. COMPREHENSIVE TREND ANALYSIS
// ================================================================

export async function analyzeTrendingProduct(productName: string, sourceMarket: string) {
  console.log(`🔍 Analyzing trend: ${productName} from ${sourceMarket}`);

  // Step 1: Mock data (in real app, fetch from APIs)
  const mockData = {
    searchVolume: Math.floor(Math.random() * 100000) + 10000,
    currentPrice: Math.floor(Math.random() * 50) + 10,
    weight: Math.random() * 3 + 0.5,
    category: 'electronics',
    growthRate: Math.floor(Math.random() * 150) - 20,
    competitorCount: Math.floor(Math.random() * 50) + 5,
  };

  // Step 2: Calculate profit
  const profitCalc = calculateProductProfit({
    sourcePrice: mockData.currentPrice,
    weight: mockData.weight,
    category: mockData.category,
    targetMarketplace: 'uzum',
  });

  // Step 3: Calculate trend score
  const trendScore = calculateTrendScore({
    searchVolume: Math.min((mockData.searchVolume / 1000), 100),
    priceCompetitiveness: profitCalc.profitMargin > 25 ? 80 : 50,
    profitMargin: Math.min(profitCalc.profitMargin * 2, 100),
    marketSaturation: Math.min((mockData.competitorCount / 50) * 100, 100),
    growthRate: mockData.growthRate,
    seasonality: 75,
    shippingFeasibility: mockData.weight < 2 ? 90 : 60,
    localDemand: 70,
  });

  // Step 4: AI prediction
  const aiPrediction = await predictTrendWithAI({
    productName,
    category: mockData.category,
    currentSearchVolume: mockData.searchVolume,
    priceRange: `$${mockData.currentPrice}`,
    sourceMarket,
  });

  // Step 5: Generate comprehensive analysis
  const analysis = {
    productName,
    sourceMarket,
    trendScore,
    searchVolume: mockData.searchVolume,
    currentPrice: mockData.currentPrice,
    profitAnalysis: profitCalc,
    aiPrediction,
    competitorCount: mockData.competitorCount,
    riskLevel: profitCalc.riskLevel,
    recommendation: trendScore > 75 ? 'STRONG BUY' : trendScore > 60 ? 'BUY' : 'CONSIDER',
    estimatedROI: Math.round((profitCalc.estimatedProfit / profitCalc.costPrice) * 100),
    timeToMarket: '14-21 days', // Shipping + customs
  };

  console.log(`✅ Analysis complete. Trend score: ${trendScore}`);
  return analysis;
}

// ================================================================
// 6. BATCH TREND SCANNER
// ================================================================

export async function scanTrendingProducts(params: {
  sourceMarkets: string[];
  categories: string[];
  minTrendScore?: number;
  limit?: number;
}) {
  const { sourceMarkets, categories, minTrendScore = 70, limit = 50 } = params;

  console.log('🔍 Starting trend scan...');
  console.log(`Markets: ${sourceMarkets.join(', ')}`);
  console.log(`Categories: ${categories.join(', ')}`);

  // In production, this would:
  // 1. Call Amazon Product Advertising API
  // 2. Call AliExpress Affiliate API
  // 3. Scrape Google Trends
  // 4. Check eBay trending
  // 5. Monitor social media (TikTok, Instagram)

  // For now, mock trending products
  const mockProducts = [
    'Smart Watch with Heart Rate Monitor',
    'Portable Power Bank 20000mAh',
    'LED Strip Lights RGB',
    'Wireless Phone Charger',
    'Bluetooth Speaker Waterproof',
    'Security Camera WiFi',
    'Electric Kettle Smart',
    'Air Purifier HEPA',
    'Gaming Mouse RGB',
    'USB-C Hub Multiport',
  ];

  const results = [];

  for (const productName of mockProducts.slice(0, limit)) {
    const sourceMarket = sourceMarkets[Math.floor(Math.random() * sourceMarkets.length)];
    const analysis = await analyzeTrendingProduct(productName, sourceMarket);

    if (analysis.trendScore >= minTrendScore) {
      results.push(analysis);

      // Save to database
      await storage.createTrendingProduct({
        productName: analysis.productName,
        category: 'electronics',
        description: `Trending product from ${analysis.sourceMarket}`,
        sourceMarket: analysis.sourceMarket,
        currentPrice: analysis.currentPrice.toString(),
        estimatedCostPrice: Math.round(analysis.profitAnalysis.costPrice).toString(),
        estimatedSalePrice: analysis.profitAnalysis.recommendedPrice.toString(),
        profitPotential: analysis.profitAnalysis.estimatedProfit.toString(),
        searchVolume: analysis.searchVolume,
        trendScore: analysis.trendScore,
        competitionLevel: analysis.competitorCount < 20 ? 'low' : analysis.competitorCount < 40 ? 'medium' : 'high',
        keywords: [`trending ${new Date().getFullYear()}`, 'best seller', analysis.sourceMarket],
        images: [],
      });
    }
  }

  console.log(`✅ Scan complete. Found ${results.length} trending products`);
  return results;
}

// ================================================================
// EXPORTS
// ================================================================

export default {
  calculateTrendScore,
  calculateProductProfit,
  predictTrendWithAI,
  analyzeTrendingProduct,
  scanTrendingProducts,
};
