// Inventory Forecasting - AI-Powered Demand Prediction
// Simple but effective forecasting using moving averages and trends

import { storage } from '../storage';

export interface ForecastResult {
  productId: string;
  productName: string;
  currentStock: number;
  averageDailySales: number;
  forecastedDemand: {
    next7Days: number;
    next14Days: number;
    next30Days: number;
  };
  reorderPoint: number;
  reorderQuantity: number;
  daysUntilStockout: number;
  recommendation: 'urgent' | 'soon' | 'ok' | 'overstocked';
  confidence: number;
}

class InventoryForecasting {
  // Calculate moving average
  private calculateMovingAverage(values: number[], period: number): number {
    if (values.length === 0) return 0;
    const relevantValues = values.slice(-period);
    const sum = relevantValues.reduce((a, b) => a + b, 0);
    return sum / relevantValues.length;
  }

  // Calculate trend (simple linear regression)
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const xSum = (n * (n + 1)) / 2; // Sum of 1, 2, 3, ..., n
    const ySum = values.reduce((a, b) => a + b, 0);
    const xySum = values.reduce((sum, y, i) => sum + (i + 1) * y, 0);
    const x2Sum = (n * (n + 1) * (2 * n + 1)) / 6; // Sum of 1², 2², 3², ..., n²

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
    return slope;
  }

  // Get historical sales data
  private async getHistoricalSales(productId: string, days: number): Promise<number[]> {
    try {
      // Get orders from last N days
      const orders = await storage.getOrdersByProduct(productId, days);
      
      // Group by day and sum quantities
      const dailySales: { [key: string]: number } = {};
      
      orders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        const items = order.items as any[];
        if (items) {
          items.forEach(item => {
            if (item.productId === productId) {
              dailySales[date] = (dailySales[date] || 0) + (item.quantity || 0);
            }
          });
        }
      });

      // Convert to array (fill missing days with 0)
      const salesArray: number[] = [];
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        salesArray.push(dailySales[dateStr] || 0);
      }

      return salesArray;
    } catch (error) {
      console.error('Error getting historical sales:', error);
      return [];
    }
  }

  // Forecast demand for a product
  async forecastProduct(productId: string): Promise<ForecastResult | null> {
    try {
      // Get product info
      const product = await storage.getProductById(productId);
      if (!product) return null;

      // Get historical sales (last 30 days)
      const historicalSales = await this.getHistoricalSales(productId, 30);
      
      if (historicalSales.length === 0) {
        // No sales history - return default forecast
        return {
          productId,
          productName: product.name,
          currentStock: product.stockQuantity || 0,
          averageDailySales: 0,
          forecastedDemand: {
            next7Days: 0,
            next14Days: 0,
            next30Days: 0
          },
          reorderPoint: product.lowStockThreshold || 10,
          reorderQuantity: 50,
          daysUntilStockout: 999,
          recommendation: 'ok',
          confidence: 0
        };
      }

      // Calculate metrics
      const averageDailySales = this.calculateMovingAverage(historicalSales, 7);
      const trend = this.calculateTrend(historicalSales);
      
      // Forecast future demand (with trend adjustment)
      const forecast7Days = Math.max(0, Math.round(averageDailySales * 7 + trend * 7));
      const forecast14Days = Math.max(0, Math.round(averageDailySales * 14 + trend * 14));
      const forecast30Days = Math.max(0, Math.round(averageDailySales * 30 + trend * 30));

      // Calculate reorder point (safety stock + lead time demand)
      const leadTimeDays = 7; // Assume 7 days lead time
      const safetyStock = Math.ceil(averageDailySales * 3); // 3 days safety stock
      const reorderPoint = Math.ceil(averageDailySales * leadTimeDays + safetyStock);

      // Calculate reorder quantity (Economic Order Quantity simplified)
      const reorderQuantity = Math.max(50, Math.ceil(forecast30Days * 1.2)); // 20% buffer

      // Calculate days until stockout
      const currentStock = product.stockQuantity || 0;
      const daysUntilStockout = averageDailySales > 0 
        ? Math.floor(currentStock / averageDailySales)
        : 999;

      // Determine recommendation
      let recommendation: 'urgent' | 'soon' | 'ok' | 'overstocked';
      if (currentStock <= reorderPoint * 0.5) {
        recommendation = 'urgent';
      } else if (currentStock <= reorderPoint) {
        recommendation = 'soon';
      } else if (currentStock > forecast30Days * 2) {
        recommendation = 'overstocked';
      } else {
        recommendation = 'ok';
      }

      // Calculate confidence (based on data consistency)
      const variance = historicalSales.reduce((sum, val) => {
        const diff = val - averageDailySales;
        return sum + diff * diff;
      }, 0) / historicalSales.length;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = averageDailySales > 0 ? stdDev / averageDailySales : 1;
      const confidence = Math.max(0, Math.min(100, Math.round((1 - coefficientOfVariation) * 100)));

      return {
        productId,
        productName: product.name,
        currentStock,
        averageDailySales: Math.round(averageDailySales * 10) / 10,
        forecastedDemand: {
          next7Days: forecast7Days,
          next14Days: forecast14Days,
          next30Days: forecast30Days
        },
        reorderPoint,
        reorderQuantity,
        daysUntilStockout,
        recommendation,
        confidence
      };
    } catch (error) {
      console.error('Error forecasting product:', error);
      return null;
    }
  }

  // Forecast all products for a partner
  async forecastAllProducts(partnerId: string): Promise<ForecastResult[]> {
    try {
      const products = await storage.getProductsByPartnerId(partnerId);
      const forecasts: ForecastResult[] = [];

      for (const product of products) {
        const forecast = await this.forecastProduct(product.id);
        if (forecast) {
          forecasts.push(forecast);
        }
      }

      // Sort by urgency
      return forecasts.sort((a, b) => {
        const urgencyOrder = { urgent: 0, soon: 1, ok: 2, overstocked: 3 };
        return urgencyOrder[a.recommendation] - urgencyOrder[b.recommendation];
      });
    } catch (error) {
      console.error('Error forecasting all products:', error);
      return [];
    }
  }

  // Get products that need reordering
  async getReorderList(partnerId: string): Promise<ForecastResult[]> {
    const forecasts = await this.forecastAllProducts(partnerId);
    return forecasts.filter(f => f.recommendation === 'urgent' || f.recommendation === 'soon');
  }

  // Get overstocked products
  async getOverstockedProducts(partnerId: string): Promise<ForecastResult[]> {
    const forecasts = await this.forecastAllProducts(partnerId);
    return forecasts.filter(f => f.recommendation === 'overstocked');
  }
}

// Export singleton instance
export const inventoryForecasting = new InventoryForecasting();

// Export for testing
export { InventoryForecasting };
