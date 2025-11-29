import { MarketplaceIntegration, MarketplaceCredentials, MarketplaceProduct, MarketplaceOrder, MarketplaceStats } from './index';

export class YandexIntegration extends MarketplaceIntegration {
  constructor(credentials: MarketplaceCredentials) {
    super('Yandex Market', credentials);
  }

  async testConnection(): Promise<boolean> {
    try {
      this.log('Testing connection...');
      const apiUrl = this.credentials.apiUrl || 'https://api.partner.market.yandex.ru/v2';
      const response = await this.makeRequest(`${apiUrl}/campaigns/${this.credentials.campaignId}/info`);
      this.log('Connection successful', { campaignId: response.campaign?.id });
      return true;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      this.log('Fetching products...');
      const apiUrl = this.credentials.apiUrl || 'https://api.partner.market.yandex.ru/v2';
      const response = await this.makeRequest(`${apiUrl}/campaigns/${this.credentials.campaignId}/offers`);

      const products: MarketplaceProduct[] = response.offers.map((p: any) => ({
        id: p.offer.id,
        name: p.offer.name,
        price: parseFloat(p.offer.price),
        stock: p.offer.availability?.count || 0,
        sku: p.offer.shopSku,
        status: p.offer.availability?.available ? 'active' : 'inactive',
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
      const apiUrl = this.credentials.apiUrl || 'https://api.partner.market.yandex.ru/v2';

      const params = new URLSearchParams({
        campaignId: this.credentials.campaignId || '',
      });

      if (startDate) params.append('fromDate', startDate.toISOString());
      if (endDate) params.append('toDate', endDate.toISOString());

      const response = await this.makeRequest(`${apiUrl}/campaigns/${this.credentials.campaignId}/orders?${params.toString()}`);

      const orders: MarketplaceOrder[] = response.orders.map((o: any) => ({
        id: o.id,
        orderNumber: o.fake ? `fake_${o.id}` : o.id.toString(),
        date: new Date(o.creationDate),
        status: o.status,
        total: parseFloat(o.price),
        items: o.items.map((item: any) => ({
          productId: item.offerId,
          quantity: item.count,
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
      const apiUrl = this.credentials.apiUrl || 'https://api.partner.market.yandex.ru/v2';
      const response = await this.makeRequest(`${apiUrl}/campaigns/${this.credentials.campaignId}/stats`);

      const stats: MarketplaceStats = {
        totalOrders: response.stats?.totalOrders || 0,
        totalRevenue: parseFloat(response.stats?.totalRevenue || '0'),
        totalProducts: response.stats?.totalOffers || 0,
        activeProducts: response.stats?.activeOffers || 0,
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
      const apiUrl = this.credentials.apiUrl || 'https://api.partner.market.yandex.ru/v2';

      await this.makeRequest(`${apiUrl}/campaigns/${this.credentials.campaignId}/offers/${productId}`, {
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
      const apiUrl = this.credentials.apiUrl || 'https://api.partner.market.yandex.ru/v2';

      await this.makeRequest(`${apiUrl}/campaigns/${this.credentials.campaignId}/offers/stocks`, {
        method: 'PUT',
        body: JSON.stringify({
          skus: [{
            sku: productId,
            warehouseId: this.credentials.supplierId,
            items: [{
              count: stock,
              type: 'FIT',
            }],
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
      const apiUrl = this.credentials.apiUrl || 'https://api.partner.market.yandex.ru/v2';

      const response = await this.makeRequest(`${apiUrl}/campaigns/${this.credentials.campaignId}/offers`, {
        method: 'POST',
        body: JSON.stringify({
          offers: [productData],
        }),
      });

      const productId = response.result?.offers?.[0]?.offerId;
      this.log('Product created successfully', { productId });
      return productId;
    } catch (error) {
      this.logError('Failed to create product', error);
      throw error;
    }
  }
}
