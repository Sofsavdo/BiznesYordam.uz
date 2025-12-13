import type { MarketplaceCredentials, MarketplaceProduct, MarketplaceOrder, MarketplaceStats } from './index';
import { MarketplaceIntegration } from './index';

/**
 * Yandex Market API Integration
 * Official API: https://yandex.ru/dev/market/partner-api/doc/
 * 
 * Required credentials:
 * - apiKey: OAuth token from partner.market.yandex.ru
 * - campaignId: Campaign ID from seller cabinet
 * - supplierId: Business ID (optional)
 */
export class YandexIntegration extends MarketplaceIntegration {
  private readonly baseUrl = 'https://api.partner.market.yandex.ru';

  constructor(credentials: MarketplaceCredentials) {
    super('Yandex Market', credentials);
  }

  protected async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `OAuth ${this.credentials.apiKey}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      this.logError(`Yandex Market API request failed`, error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.log('Testing Yandex Market API connection...');
      
      // Test with campaign info endpoint
      const response = await this.makeRequest(
        `${this.baseUrl}/campaigns/${this.credentials.campaignId}`
      );
      
      this.log('Connection successful', { 
        campaignId: response.result?.id,
        domain: response.result?.domain
      });
      
      return true;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      this.log('Fetching products from Yandex Market...');
      
      // Get offers list - API v2.1
      const response = await this.makeRequest(
        `${this.baseUrl}/campaigns/${this.credentials.campaignId}/offer-mapping-entries`,
        {
          method: 'POST',
          body: JSON.stringify({
            limit: 1000,
            offset: 0
          })
        }
      );

      const products: MarketplaceProduct[] = (response.result?.offerMappingEntries || []).map((entry: any) => {
        const offer = entry.offer;
        return {
          id: offer.shopSku || offer.marketSku,
          name: offer.name || 'Unknown',
          price: offer.price?.value || 0,
          stock: offer.availability?.available ? 999 : 0, // Yandex doesn't return exact stock
          sku: offer.shopSku,
          status: offer.availability?.available ? 'active' : 'inactive',
        };
      });

      this.log(`Fetched ${products.length} products`);
      return products;
    } catch (error) {
      this.logError('Failed to fetch products', error);
      return [];
    }
  }

  async getOrders(startDate?: Date, endDate?: Date): Promise<MarketplaceOrder[]> {
    try {
      this.log('Fetching orders from Yandex Market...', { startDate, endDate });

      const fromDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const toDate = endDate || new Date();

      // Get orders - API v2
      const response = await this.makeRequest(
        `${this.baseUrl}/campaigns/${this.credentials.campaignId}/orders`,
        {
          method: 'POST',
          body: JSON.stringify({
            fromDate: fromDate.toISOString().split('T')[0],
            toDate: toDate.toISOString().split('T')[0],
            status: 'PROCESSING,DELIVERY,DELIVERED',
            limit: 1000
          })
        }
      );

      const orders: MarketplaceOrder[] = (response.result?.orders || []).map((o: any) => ({
        id: o.id?.toString(),
        orderNumber: o.id?.toString(),
        date: new Date(o.creationDate),
        status: this.mapOrderStatus(o.status),
        total: o.itemsTotal || 0,
        items: (o.items || []).map((item: any) => ({
          productId: item.offerId || item.shopSku,
          quantity: item.count || 1,
          price: item.price || 0,
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
      'PLACING': 'new',
      'RESERVED': 'confirmed',
      'PROCESSING': 'processing',
      'DELIVERY': 'shipped',
      'PICKUP': 'ready',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled',
      'RETURNED': 'returned'
    };
    return statusMap[status] || status?.toLowerCase() || 'unknown';
  }

  async getStats(): Promise<MarketplaceStats> {
    try {
      this.log('Fetching statistics from Yandex Market...');
      
      // Get products count
      const products = await this.getProducts();
      
      // Get orders for revenue calculation (last 30 days)
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
      this.log('Syncing product to Yandex Market...', { productId, data });

      // Update offer using API v2
      const updateData: any = {
        shopSku: productId
      };
      
      if (data.name) updateData.name = data.name;
      if (data.price) updateData.price = { value: data.price, currencyId: 'RUR' };

      await this.makeRequest(
        `${this.baseUrl}/campaigns/${this.credentials.campaignId}/offers/update`,
        {
          method: 'POST',
          body: JSON.stringify({
            offers: [updateData]
          }),
        }
      );

      this.log('Product synced successfully', { productId });
      return true;
    } catch (error) {
      this.logError('Failed to sync product', error);
      return false;
    }
  }

  async updateStock(productId: string, stock: number): Promise<boolean> {
    try {
      this.log('Updating stock on Yandex Market...', { productId, stock });

      // Update stocks using API v2
      await this.makeRequest(
        `${this.baseUrl}/campaigns/${this.credentials.campaignId}/offers/stocks`,
        {
          method: 'PUT',
          body: JSON.stringify({
            skus: [{
              sku: productId,
              warehouseId: this.credentials.supplierId || 0,
              items: [{
                count: stock,
                type: 'FIT',
                updatedAt: new Date().toISOString()
              }]
            }]
          }),
        }
      );

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
      this.log('Updating price on Yandex Market...', { productId, price });

      await this.makeRequest(
        `${this.baseUrl}/campaigns/${this.credentials.campaignId}/offer-prices/updates`,
        {
          method: 'POST',
          body: JSON.stringify({
            offers: [{
              id: productId,
              price: {
                value: price,
                currencyId: 'RUR'
              }
            }]
          }),
        }
      );

      this.log('Price updated successfully', { productId, price });
      return true;
    } catch (error) {
      this.logError('Failed to update price', error);
      return false;
    }
  }

  /**
   * Create new product on Yandex Market
   */
  async createProduct(productData: any): Promise<string> {
    try {
      this.log('Creating product on Yandex Market...', { name: productData.name });

      const response = await this.makeRequest(
        `${this.baseUrl}/campaigns/${this.credentials.campaignId}/offers`,
        {
          method: 'POST',
          body: JSON.stringify({
            offers: [{
              shopSku: productData.sku || `sku_${Date.now()}`,
              name: productData.name,
              category: productData.category,
              price: {
                value: productData.price,
                currencyId: 'RUR'
              },
              pictures: productData.images || [],
              vendor: productData.brand || '',
              description: productData.description || ''
            }]
          }),
        }
      );

      const productId = response.result?.offers?.[0]?.shopSku;
      this.log('Product created successfully', { productId });
      return productId;
    } catch (error) {
      this.logError('Failed to create product', error);
      throw error;
    }
  }

  /**
   * Get warehouses list
   */
  async getWarehouses(): Promise<any[]> {
    try {
      this.log('Fetching warehouses...');
      
      const response = await this.makeRequest(
        `${this.baseUrl}/campaigns/${this.credentials.campaignId}/warehouses`
      );
      
      this.log(`Fetched ${response.result?.warehouses?.length || 0} warehouses`);
      return response.result?.warehouses || [];
    } catch (error) {
      this.logError('Failed to fetch warehouses', error);
      return [];
    }
  }
}
