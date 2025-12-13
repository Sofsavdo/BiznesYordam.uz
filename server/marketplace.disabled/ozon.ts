import type { MarketplaceCredentials, MarketplaceProduct, MarketplaceOrder, MarketplaceStats } from './index';
import { MarketplaceIntegration } from './index';

/**
 * Ozon Seller API Integration
 * Official API: https://docs.ozon.ru/api/seller/
 * 
 * Required credentials:
 * - apiKey: Client-Id from seller cabinet
 * - sellerId: Api-Key from seller cabinet
 */
export class OzonIntegration extends MarketplaceIntegration {
  private readonly baseUrl = 'https://api-seller.ozon.ru';

  constructor(credentials: MarketplaceCredentials) {
    super('Ozon', credentials);
  }

  protected async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.credentials.apiKey,
          'Api-Key': this.credentials.sellerId || '',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      this.logError(`Ozon API request failed`, error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.log('Testing Ozon API connection...');
      
      const response = await this.makeRequest(`${this.baseUrl}/v1/product/list`, {
        method: 'POST',
        body: JSON.stringify({
          filter: {},
          page: 1,
          page_size: 1,
        }),
      });
      
      this.log('Connection successful', { 
        totalProducts: response.result?.total || 0 
      });
      
      return true;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      this.log('Fetching products from Ozon...');
      
      const response = await this.makeRequest(`${this.baseUrl}/v2/product/list`, {
        method: 'POST',
        body: JSON.stringify({
          filter: {
            visibility: 'ALL'
          },
          last_id: '',
          limit: 1000,
        }),
      });

      const products: MarketplaceProduct[] = (response.result?.items || []).map((p: any) => ({
        id: p.product_id?.toString() || p.offer_id,
        name: p.name,
        price: parseFloat(p.old_price || p.price || '0'),
        stock: p.stocks?.present || p.stocks?.coming || 0,
        sku: p.offer_id || p.sku,
        status: p.visible && p.is_archived === false ? 'active' : 'inactive',
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
      this.log('Fetching orders from Ozon...', { startDate, endDate });

      const filter: any = {
        status: ''
      };
      if (startDate || endDate) {
        filter.since = startDate?.toISOString();
        filter.to = endDate?.toISOString();
      }

      // Get FBS orders (Fulfillment by Seller)
      const response = await this.makeRequest(`${this.baseUrl}/v3/posting/fbs/list`, {
        method: 'POST',
        body: JSON.stringify({
          dir: 'ASC',
          filter,
          limit: 1000,
          offset: 0,
          with: {
            analytics_data: true,
            financial_data: true
          }
        }),
      });

      const orders: MarketplaceOrder[] = (response.result?.postings || []).map((o: any) => ({
        id: o.posting_number,
        orderNumber: o.order_number || o.posting_number,
        date: new Date(o.created_at || o.in_process_at),
        status: this.mapOrderStatus(o.status),
        total: parseFloat(o.financial_data?.products_price || o.price || '0'),
        items: (o.products || []).map((item: any) => ({
          productId: item.offer_id || item.sku,
          quantity: item.quantity || 1,
          price: parseFloat(item.price || '0'),
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
      'awaiting_packaging': 'new',
      'awaiting_deliver': 'confirmed',
      'arbitration': 'disputed',
      'delivering': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'not_accepted': 'cancelled'
    };
    return statusMap[status] || status?.toLowerCase() || 'unknown';
  }

  async getStats(): Promise<MarketplaceStats> {
    try {
      this.log('Fetching statistics from Ozon...');
      
      // Get products count
      const products = await this.getProducts();
      
      // Get orders for revenue calculation
      const orders = await this.getOrders(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

      const stats: MarketplaceStats = {
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalProducts: products.length,
        activeProducts: products.filter(p => p.status === 'active').length,
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
      this.log('Syncing product to Ozon...', { productId, data });

      const updateData: any = {
        offer_id: data.sku || productId
      };
      
      if (data.name) updateData.name = data.name;
      if (data.price) updateData.old_price = data.price.toString();
      if (data.stock !== undefined) updateData.stocks = [{ stock: data.stock }];

      await this.makeRequest(`${this.baseUrl}/v2/product/update`, {
        method: 'POST',
        body: JSON.stringify({
          items: [updateData]
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
