// AI Services Routes - Real AI Integration
// Claude 3.5 Sonnet, GPT-4 Vision, Flux.1, Ideogram

import express, { Request, Response } from 'express';
import { aiOrchestrator } from '../services/aiOrchestrator';
import { remoteAccessService } from '../services/remoteAccessService';

const router = express.Router();

// ==================== AI STATUS ====================

router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = aiOrchestrator.getStatus();
    
    res.json({
      success: true,
      ...status
    });
  } catch (error: any) {
    console.error('AI status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRODUCT ANALYSIS ====================

router.post('/analyze-product', async (req: Request, res: Response) => {
  try {
    const { name, description, imageUrl } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Product name and description required' });
    }

    const analysis = await aiOrchestrator.analyzeProduct(name, description, imageUrl);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error: any) {
    console.error('Product analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SEO GENERATION ====================

router.post('/generate-seo', async (req: Request, res: Response) => {
  try {
    const { name, description, category, keywords, marketplace } = req.body;
    
    if (!name || !description || !marketplace) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const seo = await aiOrchestrator.generateSEOListing(
      name,
      description,
      category || 'General',
      keywords || [],
      marketplace
    );
    
    res.json({
      success: true,
      seo
    });
  } catch (error: any) {
    console.error('SEO generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== MULTI-LANGUAGE CONTENT ====================

router.post('/generate-multilanguage', async (req: Request, res: Response) => {
  try {
    const { name, description, category } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Product name and description required' });
    }

    const content = await aiOrchestrator.generateMultiLanguageContent(
      name,
      description,
      category || 'General'
    );
    
    res.json({
      success: true,
      content
    });
  } catch (error: any) {
    console.error('Multi-language generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== IMAGE GENERATION ====================

router.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, type, options } = req.body;
    
    if (!prompt || !type) {
      return res.status(400).json({ error: 'Prompt and type required' });
    }

    const image = await aiOrchestrator.generateProductImage(prompt, type, options);
    
    res.json({
      success: true,
      image
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== IMAGE ENHANCEMENT ====================

router.post('/enhance-image', async (req: Request, res: Response) => {
  try {
    const { imageUrl, options } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL required' });
    }

    const enhanced = await aiOrchestrator.enhanceImage(imageUrl, options || {});
    
    res.json({
      success: true,
      enhanced
    });
  } catch (error: any) {
    console.error('Image enhancement error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== MARKETPLACE IMAGES ====================

router.post('/generate-marketplace-images', async (req: Request, res: Response) => {
  try {
    const { productName, marketplace } = req.body;
    
    if (!productName || !marketplace) {
      return res.status(400).json({ error: 'Product name and marketplace required' });
    }

    const images = await aiOrchestrator.generateMarketplaceImages(productName, marketplace);
    
    res.json({
      success: true,
      images
    });
  } catch (error: any) {
    console.error('Marketplace images error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== IMAGE ANALYSIS ====================

router.post('/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL required' });
    }

    const analysis = await aiOrchestrator.analyzeImage(imageUrl);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error: any) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== LISTING VALIDATION ====================

router.post('/validate-listing', async (req: Request, res: Response) => {
  try {
    const { title, description, marketplace } = req.body;
    
    if (!title || !description || !marketplace) {
      return res.status(400).json({ error: 'Title, description, and marketplace required' });
    }

    const validation = await aiOrchestrator.validateListing(title, description, marketplace);
    
    res.json({
      success: true,
      validation
    });
  } catch (error: any) {
    console.error('Listing validation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== BATCH OPERATIONS ====================

router.post('/batch-analyze', async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Products array required' });
    }

    const results = await aiOrchestrator.batchAnalyzeProducts(products);
    
    res.json({
      success: true,
      results,
      count: results.length
    });
  } catch (error: any) {
    console.error('Batch analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/batch-generate-seo', async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Products array required' });
    }

    const results = await aiOrchestrator.batchGenerateSEO(products);
    
    res.json({
      success: true,
      results,
      count: results.length
    });
  } catch (error: any) {
    console.error('Batch SEO generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== COST ESTIMATION ====================

router.post('/estimate-cost', async (req: Request, res: Response) => {
  try {
    const { operation, count } = req.body;
    
    if (!operation || !count) {
      return res.status(400).json({ error: 'Operation and count required' });
    }

    const cost = await aiOrchestrator.estimateCost(operation, count);
    
    res.json({
      success: true,
      operation,
      count,
      estimatedCost: cost,
      costPer1000: (cost / count) * 1000
    });
  } catch (error: any) {
    console.error('Cost estimation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== REMOTE ACCESS ====================

router.post('/remote-access/request', async (req: Request, res: Response) => {
  try {
    const partnerId = (req.user as any)?.partnerId;
    const { purpose } = req.body;
    
    if (!partnerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!purpose) {
      return res.status(400).json({ error: 'Purpose required' });
    }

    const result = await remoteAccessService.requestRemoteAccess({
      partnerId,
      purpose,
      requestedBy: (req.user as any)?.username || 'Unknown'
    });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Remote access request error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/remote-access/connect', async (req: Request, res: Response) => {
  try {
    const adminId = (req.user as any)?.id;
    const { sessionCode } = req.body;
    
    if (!adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!sessionCode) {
      return res.status(400).json({ error: 'Session code required' });
    }

    const result = await remoteAccessService.connectToSession(sessionCode, adminId);
    
    res.json(result);
  } catch (error: any) {
    console.error('Remote access connect error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/remote-access/end', async (req: Request, res: Response) => {
  try {
    const { sessionCode, endedBy } = req.body;
    
    if (!sessionCode || !endedBy) {
      return res.status(400).json({ error: 'Session code and endedBy required' });
    }

    await remoteAccessService.endSession(sessionCode, endedBy);
    
    res.json({
      success: true,
      message: 'Session ended'
    });
  } catch (error: any) {
    console.error('Remote access end error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/remote-access/sessions', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let sessions;
    if (status === 'active') {
      sessions = await remoteAccessService.getActiveSessions();
    } else if (status === 'pending') {
      sessions = await remoteAccessService.getPendingSessions();
    } else {
      const active = await remoteAccessService.getActiveSessions();
      const pending = await remoteAccessService.getPendingSessions();
      sessions = [...active, ...pending];
    }
    
    res.json({
      success: true,
      sessions
    });
  } catch (error: any) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/remote-access/stats', async (req: Request, res: Response) => {
  try {
    const stats = await remoteAccessService.getSessionStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error('Remote access stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
