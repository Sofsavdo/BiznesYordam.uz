import { MarketplaceIntegration, MarketplaceCredentials, MarketplaceProduct, MarketplaceOrder, MarketplaceStats } from './index';

export class OzonIntegration extends MarketplaceIntegration {
  constructor(credentials: MarketplaceCredentials) {
    super('Ozon', credentials);
  }

  async testConnection(): Promise<boolean> {
    try {
      this.log('Testing connection...');
      const response = await this.makeRequest('https://api-seller.ozon.ru/v1/product/list', {
        method: 'POST',
        body: JSON.stringify({
          filter: {},
          page: 1,
          page_size: 1,
        }),
      });
      this.log('Connection successful');
      return true;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      this.log('Fetching products...');
      const response = await this.makeRequest('https://api-seller.ozon.ru/v1/product/list', {
        method: 'POST',
        body: JSON.stringify({
          filter: {},
          page: 1,
          page_size: 1000,
        }),
      });

      const products: MarketplaceProduct[] = response.result?.items?.map((p: any) => ({
        id: p.product_id.toString(),
        name: p.name,
        price: parseFloat(p.price?.price || '0'),
        stock: p.stocks?.present || 0,
        sku: p.sku,
        status: p.visible ? 'active' : 'inactive',
      })) || [];

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

      const filter: any = {};
      if (startDate || endDate) {
        filter.since = startDate?.toISOString();
        filter.to = endDate?.toISOString();
      }

      const response = await this.makeRequest('https://api-seller.ozon.ru/v2/posting/fbo/list', {
        method: 'POST',
        body: JSON.stringify({
          filter,
          limit: 1000,
        }),
      });

      const orders: MarketplaceOrder[] = response.result?.map((o: any) => ({
        id: o.posting_number,
        orderNumber: o.order_number,
        date: new Date(o.created_at),
        status: o.status,
        total: parseFloat(o.price),
        items: o.products?.map((item: any) => ({
          productId: item.sku,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })) || [],
      })) || [];

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
      const response = await this.makeRequest('https://api-seller.ozon.ru/v1/analytics/stock_on_warehouses', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const stats: MarketplaceStats = {
        totalOrders: 0, // Would need separate analytics call
        totalRevenue: 0, // Would need separate analytics call
        totalProducts: response.result?.total_products || 0,
        activeProducts: response.result?.active_products || 0,
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

      await this.makeRequest('https://api-seller.ozon.ru/v1/product/update', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
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

      await this.makeRequest('https://api-seller.ozon.ru/v1/product/update/stock', {
        method: 'POST',
        body: JSON.stringify({
          stocks: [{
            product_id: productId,
            stock,
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

  async createProduct(productData: any): Promise<string> {
    try {
      this.log('Creating product...', { name: productData.name });

      const response = await this.makeRequest('https://api-seller.ozon.ru/v1/product/import', {
        method: 'POST',
        body: JSON.stringify({
          items: [productData],
        }),
      });

      const productId = response.result?.[0]?.product_id?.toString();
      this.log('Product created successfully', { productId });
      return productId;
    } catch (error) {
      this.logError('Failed to create product', error);
      throw error;
    }
  }
}
