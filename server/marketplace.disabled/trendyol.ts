import type { MarketplaceCredentials, MarketplaceProduct, MarketplaceOrder, MarketplaceStats } from './index';
import { MarketplaceIntegration } from './index';

/**
 * Trendyol Seller API Integration
 * Official API: https://developers.trendyol.com/
 * 
 * Required credentials:
 * - apiKey: API Key from seller panel
 * - sellerId: Supplier ID from seller panel
 */
export class TrendyolIntegration extends MarketplaceIntegration {
  private readonly baseUrl = 'https://api.trendyol.com/sapigw';

  constructor(credentials: MarketplaceCredentials) {
    super('Trendyol', credentials);
  }

  protected async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const auth = Buffer.from(`${this.credentials.sellerId}:${this.credentials.apiKey}`).toString('base64');
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
          'User-Agent': 'SellerCloudX - Trendyol Integration',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      this.logError(`Trendyol API request failed`, error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.log('Testing Trendyol API connection...');
      
      // Test with brands endpoint (simple endpoint that doesn't require parameters)
      const response = await this.makeRequest(
        `${this.baseUrl}/suppliers/${this.credentials.sellerId}/products?page=0&size=1`
      );
      
      this.log('Connection successful', { 
        totalProducts: response.totalElements || 0 
      });
      
      return true;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      this.log('Fetching products from Trendyol...');
      
      let allProducts: MarketplaceProduct[] = [];
      let page = 0;
      const size = 200;
      let hasMore = true;

      while (hasMore && page < 10) { // Limit to 10 pages (2000 products)
        const response = await this.makeRequest(
          `${this.baseUrl}/suppliers/${this.credentials.sellerId}/products?page=${page}&size=${size}&approved=true`
        );

        const products: MarketplaceProduct[] = (response.content || []).map((p: any) => ({
          id: p.productCode || p.barcode,
          name: p.title,
          price: p.salePrice || p.listPrice || 0,
          stock: p.quantity || 0,
          sku: p.stockCode || p.barcode,
          status: p.approved && !p.archived ? 'active' : 'inactive',
        }));

        allProducts = allProducts.concat(products);
        
        hasMore = response.content && response.content.length === size;
        page++;
      }

      this.log(`Fetched ${allProducts.length} products`);
      return allProducts;
    } catch (error) {
      this.logError('Failed to fetch products', error);
      return [];
    }
  }

  async getOrders(startDate?: Date, endDate?: Date): Promise<MarketplaceOrder[]> {
    try {
      this.log('Fetching orders from Trendyol...', { startDate, endDate });
      
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate || new Date();
      
      let allOrders: MarketplaceOrder[] = [];
      let page = 0;
      const size = 200;
      let hasMore = true;

      while (hasMore && page < 10) { // Limit to 10 pages
        const response = await this.makeRequest(
          `${this.baseUrl}/suppliers/${this.credentials.sellerId}/orders?` +
          `startDate=${start.getTime()}&endDate=${end.getTime()}&page=${page}&size=${size}`
        );

        const orders: MarketplaceOrder[] = (response.content || []).map((o: any) => ({
          id: o.orderNumber?.toString(),
          orderNumber: o.orderNumber?.toString(),
          date: new Date(o.orderDate),
          status: this.mapOrderStatus(o.status),
          total: o.totalPrice || o.grossAmount || 0,
          items: (o.lines || []).map((item: any) => ({
            productId: item.productCode || item.barcode,
            quantity: item.quantity || 1,
            price: item.price || item.amount || 0,
          })),
        }));

        allOrders = allOrders.concat(orders);
        
        hasMore = response.content && response.content.length === size;
        page++;
      }

      this.log(`Fetched ${allOrders.length} orders`);
      return allOrders;
    } catch (error) {
      this.logError('Failed to fetch orders', error);
      return [];
    }
  }

  private mapOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'Created': 'new',
      'Picking': 'confirmed',
      'Invoiced': 'confirmed',
      'Shipped': 'shipped',
      'Delivered': 'delivered',
      'Cancelled': 'cancelled',
      'Returned': 'returned',
      'Repack': 'processing'
    };
    return statusMap[status] || status?.toLowerCase() || 'unknown';
  }

  async getStats(): Promise<MarketplaceStats> {
    try {
      this.log('Fetching statistics from Trendyol...');
      
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
      this.log('Syncing product to Trendyol...', { productId, data });

      const updateData: any = {
        items: [{
          barcode: productId,
        }]
      };
      
      if (data.price) updateData.items[0].salePrice = data.price;
      if (data.stock !== undefined) updateData.items[0].quantity = data.stock;

      await this.makeRequest(
        `${this.baseUrl}/suppliers/${this.credentials.sellerId}/products/price-and-inventory`,
        {
          method: 'POST',
          body: JSON.stringify(updateData),
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
      this.log('Updating stock on Trendyol...', { productId, stock });
      
      await this.makeRequest(
        `${this.baseUrl}/suppliers/${this.credentials.sellerId}/products/price-and-inventory`,
        {
          method: 'POST',
          body: JSON.stringify({
            items: [{
              barcode: productId,
              quantity: stock
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
      this.log('Updating price on Trendyol...', { productId, price });
      
      await this.makeRequest(
        `${this.baseUrl}/suppliers/${this.credentials.sellerId}/products/price-and-inventory`,
        {
          method: 'POST',
          body: JSON.stringify({
            items: [{
              barcode: productId,
              salePrice: price
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
   * Get shipment providers
   */
  async getShipmentProviders(): Promise<any[]> {
    try {
      this.log('Fetching shipment providers...');
      
      const response = await this.makeRequest(
        `${this.baseUrl}/suppliers/${this.credentials.sellerId}/shipment-providers`
      );
      
      this.log(`Fetched ${response.length || 0} shipment providers`);
      return response || [];
    } catch (error) {
      this.logError('Failed to fetch shipment providers', error);
      return [];
    }
  }
}
