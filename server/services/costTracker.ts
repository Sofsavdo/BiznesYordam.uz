// COST TRACKER - Real-time AI Usage Monitoring
// Track, limit, and optimize AI costs per partner

import { storage } from '../storage';

export interface CostRecord {
  id: string;
  partnerId: string;
  operation: string;
  model: string;
  tokensUsed?: number;
  imagesGenerated?: number;
  cost: number;
  tier: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UsageSummary {
  partnerId: string;
  tier: string;
  periodStart: Date;
  periodEnd: Date;
  totalCost: number;
  operationBreakdown: Record<string, { count: number; cost: number }>;
  remainingBudget: number;
  budgetLimit: number;
  utilizationPercent: number;
}

// Monthly budget limits per tier (USD)
const TIER_LIMITS: Record<string, number> = {
  starter_pro: 10,
  business_standard: 20,
  professional_plus: 30,
  enterprise_elite: 50,
};

// In-memory cache (TODO: move to Redis for production)
const costCache = new Map<string, CostRecord[]>();

// ========================================
// COST LOGGING
// ========================================

export async function logCost(record: Omit<CostRecord, 'id' | 'timestamp'>): Promise<void> {
  const fullRecord: CostRecord = {
    ...record,
    id: `cost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };

  // Add to cache
  const partnerCosts = costCache.get(record.partnerId) || [];
  partnerCosts.push(fullRecord);
  costCache.set(record.partnerId, partnerCosts);

  // TODO: Save to database
  // await storage.createCostRecord(fullRecord);

  console.log(`📊 Cost logged: ${record.partnerId} | ${record.operation} | $${record.cost.toFixed(4)}`);
}

// ========================================
// USAGE SUMMARY
// ========================================

export async function getUsageSummary(
  partnerId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<UsageSummary> {
  // Get partner tier
  const partner = await storage.getPartnerById(partnerId);
  const tier = partner?.pricingTier || 'starter_pro';
  const budgetLimit = TIER_LIMITS[tier] || 10;

  // Get costs from cache (or database)
  const costs = costCache.get(partnerId) || [];
  const periodCosts = costs.filter(
    c => c.timestamp >= periodStart && c.timestamp <= periodEnd
  );

  // Calculate totals
  const totalCost = periodCosts.reduce((sum, c) => sum + c.cost, 0);

  // Breakdown by operation
  const operationBreakdown: Record<string, { count: number; cost: number }> = {};
  periodCosts.forEach(c => {
    if (!operationBreakdown[c.operation]) {
      operationBreakdown[c.operation] = { count: 0, cost: 0 };
    }
    operationBreakdown[c.operation].count++;
    operationBreakdown[c.operation].cost += c.cost;
  });

  const remainingBudget = Math.max(0, budgetLimit - totalCost);
  const utilizationPercent = (totalCost / budgetLimit) * 100;

  return {
    partnerId,
    tier,
    periodStart,
    periodEnd,
    totalCost,
    operationBreakdown,
    remainingBudget,
    budgetLimit,
    utilizationPercent,
  };
}

// ========================================
// BUDGET CHECK
// ========================================

export async function checkBudget(
  partnerId: string,
  estimatedCost: number
): Promise<{ allowed: boolean; remainingBudget: number; message?: string }> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const summary = await getUsageSummary(partnerId, monthStart, monthEnd);

  if (summary.totalCost + estimatedCost > summary.budgetLimit) {
    return {
      allowed: false,
      remainingBudget: summary.remainingBudget,
      message: `Budget limit exceeded. Limit: $${summary.budgetLimit}, Used: $${summary.totalCost.toFixed(2)}, Remaining: $${summary.remainingBudget.toFixed(2)}`,
    };
  }

  return {
    allowed: true,
    remainingBudget: summary.remainingBudget - estimatedCost,
  };
}

// ========================================
// OPTIMIZATION RECOMMENDATIONS
// ========================================

export async function getOptimizationRecommendations(
  partnerId: string
): Promise<string[]> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const summary = await getUsageSummary(partnerId, monthStart, now);

  const recommendations: string[] = [];

  // Check utilization
  if (summary.utilizationPercent > 80) {
    recommendations.push(`⚠️ Budget ${summary.utilizationPercent.toFixed(0)}% ishlatilgan. Upgrade qilish tavsiya etiladi.`);
  }

  // Check operation costs
  Object.entries(summary.operationBreakdown).forEach(([op, data]) => {
    if (data.cost > summary.budgetLimit * 0.5) {
      recommendations.push(`📊 ${op} uchun harajatlar yuqori ($${data.cost.toFixed(2)}). Template ishlatishni ko'rib chiqing.`);
    }
  });

  // Template usage recommendation
  const productCardCost = summary.operationBreakdown['product_card_creation']?.cost || 0;
  if (productCardCost > 5) {
    recommendations.push(`💡 Product card template ishlatish $${(productCardCost * 0.9).toFixed(2)} tejaydi!`);
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ AI usage optimal! Davom eting.');
  }

  return recommendations;
}

// ========================================
// DASHBOARD STATS
// ========================================

export async function getDashboardStats(partnerId: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todaySummary = await getUsageSummary(partnerId, today, now);
  const weekSummary = await getUsageSummary(partnerId, weekAgo, now);
  const monthSummary = await getUsageSummary(partnerId, monthStart, now);

  return {
    today: {
      cost: todaySummary.totalCost,
      operations: Object.values(todaySummary.operationBreakdown).reduce((sum, op) => sum + op.count, 0),
    },
    week: {
      cost: weekSummary.totalCost,
      operations: Object.values(weekSummary.operationBreakdown).reduce((sum, op) => sum + op.count, 0),
    },
    month: {
      cost: monthSummary.totalCost,
      operations: Object.values(monthSummary.operationBreakdown).reduce((sum, op) => sum + op.count, 0),
      remainingBudget: monthSummary.remainingBudget,
      utilizationPercent: monthSummary.utilizationPercent,
    },
  };
}

// ========================================
// EXPORTS
// ========================================

export const costTracker = {
  logCost,
  getUsageSummary,
  checkBudget,
  getOptimizationRecommendations,
  getDashboardStats,
};

export default costTracker;
