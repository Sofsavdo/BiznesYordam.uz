import { MarketplaceIntegration, MarketplaceCredentials, MarketplaceProduct, MarketplaceOrder, MarketplaceStats } from './index';

export class WildberriesIntegration extends MarketplaceIntegration {
  constructor(credentials: MarketplaceCredentials) {
    super('Wildberries', credentials);
  }

  async testConnection(): Promise<boolean> {
    try {
      this.log('Testing connection...');
      const apiUrl = this.credentials.apiUrl || 'https://suppliers-api.wildberries.ru/api/v2';
      const response = await this.makeRequest(`${apiUrl}/supplier`);
      this.log('Connection successful', { supplierId: response.supplierId });
      return true;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      this.log('Fetching products...');
      const apiUrl = this.credentials.apiUrl || 'https://suppliers-api.wildberries.ru/api/v2';
      const response = await this.makeRequest(`${apiUrl}/goods`);
      
      const products: MarketplaceProduct[] = response.data.map((p: any) => ({
        id: p.nmId.toString(),
        name: p.name,
        price: parseFloat(p.price),
        stock: p.quantity || 0,
        sku: p.vendorCode,
        status: p.isVisible ? 'active' : 'inactive',
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
      const apiUrl = this.credentials.apiUrl || 'https://suppliers-api.wildberries.ru/api/v2';
      
      const params = new URLSearchParams();
      if (startDate) params.append('dateFrom', startDate.toISOString().split('T')[0]);
      if (endDate) params.append('dateTo', endDate.toISOString().split('T')[0]);

      const response = await this.makeRequest(`${apiUrl}/orders?${params.toString()}`);
      
      const orders: MarketplaceOrder[] = response.orders.map((o: any) => ({
        id: o.gNumber,
        orderNumber: o.gNumber,
        date: new Date(o.date),
        status: o.status,
        total: parseFloat(o.totalPrice),
        items: [{
          productId: o.nmId.toString(),
          quantity: 1,
          price: parseFloat(o.totalPrice),
        }],
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
      const apiUrl = this.credentials.apiUrl || 'https://suppliers-api.wildberries.ru/api/v2';
      const response = await this.makeRequest(`${apiUrl}/statistics`);
      
      const stats: MarketplaceStats = {
        totalOrders: response.ordersCount || 0,
        totalRevenue: parseFloat(response.revenue || '0'),
        totalProducts: response.goodsCount || 0,
        activeProducts: response.activeGoodsCount || 0,
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
      const apiUrl = this.credentials.apiUrl || 'https://suppliers-api.wildberries.ru/api/v2';
      
      await this.makeRequest(`${apiUrl}/goods/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
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
      const apiUrl = this.credentials.apiUrl || 'https://suppliers-api.wildberries.ru/api/v2';
      
      await this.makeRequest(`${apiUrl}/stocks`, {
        method: 'PUT',
        body: JSON.stringify({
          stocks: [{
            nmId: parseInt(productId),
            quantity: stock,
          }],
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
