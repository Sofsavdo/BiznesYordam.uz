import type { MarketplaceCredentials, MarketplaceProduct, MarketplaceOrder, MarketplaceStats } from './index';
import { MarketplaceIntegration } from './index';

/**
 * Uzum Market API Integration
 * Official API: https://seller.uzum.uz/
 * 
 * Required credentials:
 * - apiKey: API token from seller cabinet
 * - sellerId: Seller ID
 */
export class UzumIntegration extends MarketplaceIntegration {
  private readonly baseUrl = 'https://api-seller.uzum.uz';

  constructor(credentials: MarketplaceCredentials) {
    super('Uzum', credentials);
  }

  async testConnection(): Promise<boolean> {
    try {
      this.log('Testing Uzum API connection...');
      
      // Test with seller info endpoint
      const response = await this.makeRequest(`${this.baseUrl}/api/v1/seller/profile`);
      
      this.log('Connection successful', { 
        sellerId: response.id || response.sellerId,
        name: response.name || response.companyName
      });
      
      return true;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      this.log('Fetching products from Uzum...');
      
      const response = await this.makeRequest(
        `${this.baseUrl}/api/v1/product/list`,
        {
          method: 'POST',
          body: JSON.stringify({
            limit: 1000,
            offset: 0
          })
        }
      );
      
      const products: MarketplaceProduct[] = (response.products || response.items || []).map((p: any) => ({
        id: p.productId?.toString() || p.id?.toString(),
        name: p.title || p.name,
        price: p.price || p.sellingPrice || 0,
        stock: p.quantity || p.stock || 0,
        sku: p.sku || p.vendorCode || p.productId?.toString(),
        status: p.status === 'ACTIVE' || p.isActive ? 'active' : 'inactive',
      }));

      this.log(`Fetched ${products.length} products`);
      return products;
    } catch (error) {
      this.logError('Failed to fetch products', error);
      return [];
    }
  }

  async getOrders(startDate?: Date, endDate?: Date): Promise<MarketplaceOrder[]> {
    try {
      this.log('Fetching orders from Uzum...', { startDate, endDate });
      
      const dateFrom = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = endDate || new Date();
      
      const response = await this.makeRequest(
        `${this.baseUrl}/api/v1/order/list`,
        {
          method: 'POST',
          body: JSON.stringify({
            filter: {
              dateFrom: dateFrom.toISOString(),
              dateTo: dateTo.toISOString()
            },
            limit: 1000,
            offset: 0
          })
        }
      );
      
      const orders: MarketplaceOrder[] = (response.orders || response.items || []).map((o: any) => ({
        id: o.orderId?.toString() || o.id?.toString(),
        orderNumber: o.orderNumber || o.orderId?.toString(),
        date: new Date(o.createdAt || o.orderDate),
        status: this.mapOrderStatus(o.status),
        total: o.totalPrice || o.total || 0,
        items: (o.items || o.products || []).map((item: any) => ({
          productId: item.productId?.toString() || item.skuId?.toString(),
          quantity: item.quantity || 1,
          price: item.price || item.sellingPrice || 0,
        })),
      }));

      this.log(`Fetched ${orders.length} orders`);
      return orders;
    } catch (error) {
      this.logError('Failed to fetch orders', error);
      return [];
    }
  }

  private mapOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'NEW': 'new',
      'CONFIRMED': 'confirmed',
      'READY_FOR_PICKUP': 'ready',
      'IN_DELIVERY': 'shipped',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled',
      'RETURNED': 'returned'
    };
    return statusMap[status] || status?.toLowerCase() || 'unknown';
  }

  async getStats(): Promise<MarketplaceStats> {
    try {
      this.log('Fetching statistics from Uzum...');
      
      const response = await this.makeRequest(
        `${this.baseUrl}/api/v1/analytics/dashboard`
      );
      
      const stats: MarketplaceStats = {
        totalOrders: response.totalOrders || 0,
        totalRevenue: parseFloat(response.totalRevenue || '0'),
        totalProducts: response.totalProducts || 0,
        activeProducts: response.activeProducts || 0,
      };

      this.log('Stats fetched', stats);
      return stats;
    } catch (error) {
      this.logError('Failed to fetch stats', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        activeProducts: 0,
      };
    }
  }

  async syncProduct(productId: string, data: Partial<MarketplaceProduct>): Promise<boolean> {
    try {
      this.log('Syncing product to Uzum...', { productId, data });
      
      const updateData: any = {
        productId: parseInt(productId)
      };
      
      if (data.name) updateData.title = data.name;
      if (data.price) updateData.price = data.price;
      if (data.stock !== undefined) updateData.quantity = data.stock;
      
      await this.makeRequest(`${this.baseUrl}/api/v1/product/update`, {
        method: 'POST',
        body: JSON.stringify(updateData),
      });

      this.log('Product synced successfully', { productId });
      return true;
    } catch (error) {
      this.logError('Failed to sync product', error);
      return false;
    }
  }

  async updateStock(productId: string, stock: number): Promise<boolean> {
    try {
      this.log('Updating stock on Uzum...', { productId, stock });
      
      await this.makeRequest(`${this.baseUrl}/api/v1/product/stock/update`, {
        method: 'POST',
        body: JSON.stringify({
          productId: parseInt(productId),
          quantity: stock
        }),
      });

      this.log('Stock updated successfully', { productId, stock });
      return true;
    } catch (error) {
      this.logError('Failed to update stock', error);
      return false;
    }
  }

  /**
   * Update product price
   */
  async updatePrice(productId: string, price: number): Promise<boolean> {
    try {
      this.log('Updating price on Uzum...', { productId, price });
      
      await this.makeRequest(`${this.baseUrl}/api/v1/product/price/update`, {
        method: 'POST',
        body: JSON.stringify({
          productId: parseInt(productId),
          price: price
        }),
      });

      this.log('Price updated successfully', { productId, price });
      return true;
    } catch (error) {
      this.logError('Failed to update price', error);
      return false;
    }
  }
}
