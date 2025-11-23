// server/routes/trendingRoutes.ts
// TRENDING PRODUCTS API ROUTES

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../errorHandler';
import trendingAnalytics from '../services/trendingAnalytics';
import { storage } from '../storage';

const router = Router();

// ================================================================
// TRENDING ANALYTICS ROUTES
// ================================================================

/**
 * POST /api/trending/scan
 * Scan markets for new trending products
 */
router.post('/scan', asyncHandler(async (req: Request, res: Response) => {
  const { sourceMarkets, categories, minTrendScore, limit } = req.body;

  const results = await trendingAnalytics.scanTrendingProducts({
    sourceMarkets: sourceMarkets || ['amazon_us', 'aliexpress'],
    categories: categories || ['electronics'],
    minTrendScore: minTrendScore || 70,
    limit: limit || 10,
  });

  res.json({
    success: true,
    found: results.length,
    products: results,
  });
}));

/**
 * POST /api/trending/analyze
 * Analyze a specific product
 */
router.post('/analyze', asyncHandler(async (req: Request, res: Response) => {
  const { productName, sourceMarket } = req.body;

  if (!productName || !sourceMarket) {
    return res.status(400).json({
      message: 'productName va sourceMarket talab qilinadi',
      code: 'MISSING_PARAMS',
    });
  }

  const analysis = await trendingAnalytics.analyzeTrendingProduct(
    productName,
    sourceMarket
  );

  res.json(analysis);
}));

/**
 * POST /api/trending/calculate-profit
 * Calculate profit for a product
 */
router.post('/calculate-profit', asyncHandler(async (req: Request, res: Response) => {
  const { sourcePrice, weight, category, targetMarketplace, exchangeRate } = req.body;

  if (!sourcePrice || !weight || !category) {
    return res.status(400).json({
      message: 'sourcePrice, weight, category talab qilinadi',
      code: 'MISSING_PARAMS',
    });
  }

  const profitCalc = trendingAnalytics.calculateProductProfit({
    sourcePrice: parseFloat(sourcePrice),
    weight: parseFloat(weight),
    category,
    targetMarketplace: targetMarketplace || 'uzum',
    exchangeRate: exchangeRate ? parseFloat(exchangeRate) : undefined,
  });

  res.json(profitCalc);
}));

/**
 * POST /api/trending/predict
 * AI prediction for a product trend
 */
router.post('/predict', asyncHandler(async (req: Request, res: Response) => {
  const { productName, category, currentSearchVolume, priceRange, sourceMarket } = req.body;

  const prediction = await trendingAnalytics.predictTrendWithAI({
    productName,
    category,
    currentSearchVolume,
    priceRange,
    sourceMarket,
  });

  res.json(prediction);
}));

/**
 * GET /api/trending/stats
 * Get trending statistics
 */
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const allProducts = await storage.getTrendingProducts();

  const stats = {
    totalProducts: allProducts.length,
    averageTrendScore: allProducts.length > 0
      ? Math.round(allProducts.reduce((sum, p) => sum + (p.trendScore || 0), 0) / allProducts.length)
      : 0,
    highProfitProducts: allProducts.filter(
      (p) => parseFloat(p.profitPotential || '0') > 500000
    ).length,
    lowCompetitionProducts: allProducts.filter(
      (p) => p.competitionLevel === 'low'
    ).length,
    topCategories: getTopCategories(allProducts),
    topMarkets: getTopMarkets(allProducts),
  };

  res.json(stats);
}));

/**
 * DELETE /api/trending/:id
 * Delete a trending product
 */
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // In production, implement proper delete in storage
  // For now, just return success
  res.json({ success: true, message: 'Mahsulot o\'chirildi' });
}));

// ================================================================
// HELPER FUNCTIONS
// ================================================================

function getTopCategories(products: any[]) {
  const categoryCounts: Record<string, number> = {};

  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
}

function getTopMarkets(products: any[]) {
  const marketCounts: Record<string, number> = {};

  products.forEach((p) => {
    marketCounts[p.sourceMarket] = (marketCounts[p.sourceMarket] || 0) + 1;
  });

  return Object.entries(marketCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([market, count]) => ({ market, count }));
}

export default router;
