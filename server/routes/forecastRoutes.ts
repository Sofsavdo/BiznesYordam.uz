// Forecast & Business Intelligence Routes

import { Router } from 'express';
import {
  getSalesForecasts,
  generateForecast,
  getBusinessInsights,
  generateInsights,
  markInsightAsRead,
  getPerformanceBenchmarks
} from '../controllers/forecastController';

const router = Router();

// Sales forecasts
router.get('/forecasts', getSalesForecasts);
router.post('/forecasts/generate', generateForecast);

// Business insights
router.get('/insights', getBusinessInsights);
router.post('/insights/generate', generateInsights);
router.put('/insights/:id/read', markInsightAsRead);

// Benchmarks
router.get('/benchmarks', getPerformanceBenchmarks);

export default router;
