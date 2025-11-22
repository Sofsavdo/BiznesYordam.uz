import { MarketplaceIntegration, MarketplaceCredentials, MarketplaceProduct, MarketplaceOrder, MarketplaceStats } from './index';

export class UzumIntegration extends MarketplaceIntegration {
  constructor(credentials: MarketplaceCredentials) {
    super('Uzum', credentials);
  }

  async testConnection(): Promise<boolean> {
    try {
      this.log('Testing connection...');
      const apiUrl = this.credentials.apiUrl || 'https://api.uzum.uz/api/v1';
      const response = await this.makeRequest(`${apiUrl}/seller/info`);
      this.log('Connection successful', { sellerId: response.sellerId });
      return true;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      this.log('Fetching products...');
      const apiUrl = this.credentials.apiUrl || 'https://api.uzum.uz/api/v1';
      const response = await this.makeRequest(`${apiUrl}/products?sellerId=${this.credentials.sellerId}`);
      
      const products: MarketplaceProduct[] = response.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        stock: p.stock || 0,
        sku: p.sku,
        status: p.isActive ? 'active' : 'inactive',
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
      this.log('Fetching orders...', { startDate, endDate });
      const apiUrl = this.credentials.apiUrl || 'https://api.uzum.uz/api/v1';
      
      const params = new URLSearchParams({
        sellerId: this.credentials.sellerId || '',
      });
      
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await this.makeRequest(`${apiUrl}/orders?${params.toString()}`);
      
      const orders: MarketplaceOrder[] = response.orders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        date: new Date(o.createdAt),
        status: o.status,
        total: parseFloat(o.total),
        items: o.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
      }));

      this.log(`Fetched ${orders.length} orders`);
      return orders;
    } catch (error) {
      this.logError('Failed to fetch orders', error);
      return [];
    }
  }

  async getStats(): Promise<MarketplaceStats> {
    try {
      this.log('Fetching stats...');
      const apiUrl = this.credentials.apiUrl || 'https://api.uzum.uz/api/v1';
      const response = await this.makeRequest(`${apiUrl}/stats?sellerId=${this.credentials.sellerId}`);
      
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
      this.log('Syncing product...', { productId, data });
      const apiUrl = this.credentials.apiUrl || 'https://api.uzum.uz/api/v1';
      
      await this.makeRequest(`${apiUrl}/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          sellerId: this.credentials.sellerId,
          ...data,
        }),
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
      this.log('Updating stock...', { productId, stock });
      const apiUrl = this.credentials.apiUrl || 'https://api.uzum.uz/api/v1';
      
      await this.makeRequest(`${apiUrl}/products/${productId}/stock`, {
        method: 'PUT',
        body: JSON.stringify({
          sellerId: this.credentials.sellerId,
          stock,
        }),
      });

      this.log('Stock updated successfully', { productId, stock });
      return true;
    } catch (error) {
      this.logError('Failed to update stock', error);
      return false;
    }
  }
}
