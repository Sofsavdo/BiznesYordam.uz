// Autonomous AI Routes - Zero-Command Product Creation
import express, { Request, Response } from 'express';
import { asyncHandler } from '../errorHandler';
import { autonomousAIManager } from '../services/autonomousAIManager';

const router = express.Router();

// Create product with minimal input - AI does everything
router.post('/create-product', asyncHandler(async (req: Request, res: Response) => {
  const partner = (req as any).partner;
  
  if (!partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }

  const { name, image, description, costPrice, stockQuantity } = req.body;

  // Validate minimal input
  if (!name || !image || !description || !costPrice || !stockQuantity) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      required: ['name', 'image', 'description', 'costPrice', 'stockQuantity']
    });
  }

  console.log('🤖 Autonomous AI: Processing product creation...');

  // Let AI handle everything
  const result = await autonomousAIManager.processProduct({
    name,
    image,
    description,
    costPrice: Number(costPrice),
    stockQuantity: Number(stockQuantity),
    partnerId: partner.id
  });

  if (!result.success) {
    return res.status(400).json({
      message: 'AI processing failed',
      errors: result.errors,
      decisions: result.decisions
    });
  }

  res.status(201).json({
    message: 'Product created successfully by AI',
    product: result.product,
    aiDecisions: result.decisions,
    summary: {
      totalDecisions: result.decisions.length,
      averageConfidence: Math.round(
        result.decisions.reduce((sum, d) => sum + d.confidence, 0) / result.decisions.length
      ),
      modules: [...new Set(result.decisions.map(d => d.module))]
    }
  });
}));

// Get AI decision log
router.get('/decisions', asyncHandler(async (req: Request, res: Response) => {
  const decisions = autonomousAIManager.getDecisions();
  res.json({
    total: decisions.length,
    decisions
  });
}));

// Clear AI decision log
router.delete('/decisions', asyncHandler(async (req: Request, res: Response) => {
  autonomousAIManager.clearDecisions();
  res.json({ message: 'Decision log cleared' });
}));

export default router;
