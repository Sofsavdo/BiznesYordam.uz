// ENHANCED AI ROUTES - Production Ready
// Combines Emergent AI + Legacy AI Manager

import { Router, Request, Response } from 'express';
import emergentAI from '../services/emergentAI';
import productCardAI from '../services/productCardAI';
import costTracker from '../services/costTracker';
import smartTemplates from '../services/smartTemplates';
import { storage } from '../storage';

const router = Router();

// ==================== DASHBOARD ====================

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await costTracker.getDashboardStats(partnerId);
    const recommendations = await costTracker.getOptimizationRecommendations(partnerId);
    const templateStats = smartTemplates.getTemplateUsageStats();
    const partner = await storage.getPartnerById(partnerId);

    res.json({
      success: true,
      stats,
      recommendations,
      templateStats,
      tier: partner?.pricingTier || 'starter_pro',
      aiEnabled: partner?.aiEnabled || false,
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== COST ANALYTICS ====================

router.get('/cost-analytics', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const summary = await costTracker.getUsageSummary(partnerId, start, end);

    res.json({ success: true, summary });
  } catch (error: any) {
    console.error('Cost analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CREATE PRODUCT CARD ====================

router.post('/create-product-card', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productName, category, marketplace, features, price, brand, generateImages } = req.body;

    if (!productName || !category || !marketplace || !features || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const estimatedCost = generateImages ? 0.09 : 0.05;
    const budgetCheck = await costTracker.checkBudget(partnerId, estimatedCost);

    if (!budgetCheck.allowed) {
      return res.status(429).json({
        error: 'Budget limit exceeded',
        message: budgetCheck.message,
        remainingBudget: budgetCheck.remainingBudget,
      });
    }

    const result = await productCardAI.createProductCard(
      { productName, category, marketplace, features: Array.isArray(features) ? features : [features], price, brand },
      partnerId,
      generateImages
    );

    await costTracker.logCost({
      partnerId,
      operation: 'product_card_creation',
      model: result.usedTemplate ? 'template' : 'claude-4-sonnet',
      cost: result.cost,
      tier: (await storage.getPartnerById(partnerId))?.pricingTier || 'starter_pro',
      metadata: { generateImages },
    });

    res.json({
      success: true,
      productCard: result,
      remainingBudget: budgetCheck.remainingBudget - result.cost,
    });
  } catch (error: any) {
    console.error('Product card creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== BATCH CREATE ====================

router.post('/batch-create-cards', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { products, generateImages } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array required' });
    }

    const estimatedCost = products.length * (generateImages ? 0.09 : 0.05);
    const budgetCheck = await costTracker.checkBudget(partnerId, estimatedCost);

    if (!budgetCheck.allowed) {
      return res.status(429).json({ error: 'Budget limit exceeded', message: budgetCheck.message });
    }

    const results = await productCardAI.batchCreateProductCards(products, partnerId, generateImages);
    const totalCost = results.reduce((sum, r) => sum + r.cost, 0);

    await costTracker.logCost({
      partnerId,
      operation: 'batch_product_card_creation',
      model: 'mixed',
      cost: totalCost,
      tier: (await storage.getPartnerById(partnerId))?.pricingTier || 'starter_pro',
      metadata: { count: products.length, generateImages },
    });

    res.json({ success: true, results, totalCost, processed: results.length });
  } catch (error: any) {
    console.error('Batch creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== REVIEW RESPONSE ====================

router.post('/generate-review-response', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { reviewText, rating, productName, customerName } = req.body;

    if (!reviewText || !rating || !productName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const estimatedCost = rating >= 3 ? 0.001 : 0.01;
    const budgetCheck = await costTracker.checkBudget(partnerId, estimatedCost);

    if (!budgetCheck.allowed) {
      return res.status(429).json({ error: 'Budget limit exceeded' });
    }

    const response = await productCardAI.generateReviewResponse(
      reviewText,
      rating,
      productName,
      customerName || 'Mijoz',
      partnerId
    );

    await costTracker.logCost({
      partnerId,
      operation: 'review_response',
      model: rating >= 3 ? 'template' : 'claude-4-sonnet',
      cost: estimatedCost,
      tier: (await storage.getPartnerById(partnerId))?.pricingTier || 'starter_pro',
    });

    res.json({ success: true, response, usedTemplate: rating >= 3 });
  } catch (error: any) {
    console.error('Review response error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SEO OPTIMIZATION ====================

router.post('/optimize-seo', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentTitle, currentDescription, marketplace } = req.body;

    if (!currentTitle || !currentDescription || !marketplace) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const budgetCheck = await costTracker.checkBudget(partnerId, 0.02);
    if (!budgetCheck.allowed) {
      return res.status(429).json({ error: 'Budget limit exceeded' });
    }

    const result = await productCardAI.optimizeSEO(currentTitle, currentDescription, marketplace, partnerId);

    await costTracker.logCost({
      partnerId,
      operation: 'seo_optimization',
      model: 'claude-4-sonnet',
      cost: 0.02,
      tier: (await storage.getPartnerById(partnerId))?.pricingTier || 'starter_pro',
    });

    res.json({ success: true, optimization: result });
  } catch (error: any) {
    console.error('SEO optimization error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== IMAGE GENERATION ====================

router.post('/generate-images', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { prompt, count = 1, quality = 'standard' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt required' });
    }

    const costPerImage = quality === 'hd' ? 0.08 : 0.04;
    const totalCost = costPerImage * count;
    const budgetCheck = await costTracker.checkBudget(partnerId, totalCost);

    if (!budgetCheck.allowed) {
      return res.status(429).json({ error: 'Budget limit exceeded' });
    }

    const images = await emergentAI.generateImage({ prompt, n: count, quality }, partnerId);

    await costTracker.logCost({
      partnerId,
      operation: 'image_generation',
      model: 'gpt-image-1',
      imagesGenerated: count,
      cost: totalCost,
      tier: (await storage.getPartnerById(partnerId))?.pricingTier || 'starter_pro',
    });

    res.json({ success: true, images, cost: totalCost });
  } catch (error: any) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
