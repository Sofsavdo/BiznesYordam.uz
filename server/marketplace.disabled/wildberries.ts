import type { MarketplaceCredentials, MarketplaceProduct, MarketplaceOrder, MarketplaceStats } from './index';
import { MarketplaceIntegration } from './index';

/**
 * Wildberries API Integration
 * Official API: https://openapi.wildberries.ru/
 * 
 * Required credentials:
 * - apiKey: Standard or Statistics API token from seller cabinet
 * - supplierId: Seller ID (optional, auto-detected)
 */
export class WildberriesIntegration extends MarketplaceIntegration {
  private readonly baseUrl = 'https://suppliers-api.wildberries.ru';
  private readonly contentUrl = 'https://content-api.wildberries.ru';
  private readonly statisticsUrl = 'https://statistics-api.wildberries.ru';

  constructor(credentials: MarketplaceCredentials) {
    super('Wildberries', credentials);
  }

  async testConnection(): Promise<boolean> {
    try {
      this.log('Testing Wildberries API connection...');
      
      // Test with supplier info endpoint
      const response = await this.makeRequest(`${this.baseUrl}/api/v3/supplier`);
      
      this.log('Connection successful', { 
        supplierId: response.id || response.supplierId,
        name: response.name 
      });
      
      return true;
    } catch (error) {
      this.logError('Connection test failed', error);
      return false;
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      this.log('Fetching products from Wildberries...');
      
      // Get list of cards (products) - Content API v2
      const response = await this.makeRequest(
        `${this.contentUrl}/content/v2/get/cards/list`,
        {
          method: 'POST',
          body: JSON.stringify({
            settings: {
              cursor: {
                limit: 1000
              },
              filter: {
                withPhoto: -1 // All products
              }
            }
          })
        }
      );
      
      const products: MarketplaceProduct[] = (response.cards || []).map((card: any) => ({
        id: card.nmID?.toString() || card.nmId?.toString(),
        name: card.object || card.title || 'Unknown',
        price: card.sizes?.[0]?.price || 0,
        stock: this.calculateTotalStock(card.sizes),
        sku: card.vendorCode || card.nmID?.toString(),
        status: card.uploadID ? 'active' : 'inactive',
      }));

      this.log(`Fetched ${products.length} products`);
      return products;
    } catch (error) {
      this.logError('Failed to fetch products', error);
      return [];
    }
  }

  private calculateTotalStock(sizes: any[]): number {
    if (!sizes || !Array.isArray(sizes)) return 0;
    return sizes.reduce((total, size) => {
      const stocks = size.stocks || [];
      const sizeStock = stocks.reduce((sum: number, stock: any) => sum + (stock.qty || 0), 0);
      return total + sizeStock;
    }, 0);
  }

  async getOrders(startDate?: Date, endDate?: Date): Promise<MarketplaceOrder[]> {
    try {
      this.log('Fetching orders from Wildberries...', { startDate, endDate });
      
      // Use Marketplace API v3 for orders (FBS)
      const dateFrom = startDate ? startDate.toISOString() : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const response = await this.makeRequest(
        `${this.baseUrl}/api/v3/orders?dateFrom=${dateFrom}&flag=0`
      );
      
      const orders: MarketplaceOrder[] = (response.orders || []).map((o: any) => ({
        id: o.id?.toString() || o.orderId?.toString(),
        orderNumber: o.rid || o.id?.toString(),
        date: new Date(o.createdAt || o.date),
        status: this.mapOrderStatus(o.wbStatus || o.status),
        total: o.convertedPrice || o.totalPrice || 0,
        items: [{
          productId: o.nmId?.toString() || o.article,
          quantity: 1,
          price: o.convertedPrice || o.totalPrice || 0,
        }],
      }));

      this.log(`Fetched ${orders.length} orders`);
      return orders;
    } catch (error) {
      this.logError('Failed to fetch orders', error);
      return [];
    }
  }

  private mapOrderStatus(wbStatus: number | string): string {
    const statusMap: Record<number, string> = {
      0: 'new',
      1: 'confirmed',
      2: 'assembled',
      3: 'shipped',
      4: 'delivered',
      5: 'cancelled'
    };
    
    if (typeof wbStatus === 'number') {
      return statusMap[wbStatus] || 'unknown';
    }
    return wbStatus?.toString().toLowerCase() || 'unknown';
  }

  async getStats(): Promise<MarketplaceStats> {
    try {
      this.log('Fetching statistics from Wildberries...');
      
      // Get sales statistics from Statistics API
      const dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await this.makeRequest(
        `${this.statisticsUrl}/api/v1/supplier/sales?dateFrom=${dateFrom}`
      );
      
      const sales = response || [];
      const totalRevenue = sales.reduce((sum: number, sale: any) => 
        sum + (sale.finishedPrice || sale.priceWithDisc || 0), 0
      );
      
      // Get products count
      const products = await this.getProducts();
      
      const stats: MarketplaceStats = {
        totalOrders: sales.length,
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
      this.log('Syncing product to Wildberries...', { productId, data });
      
      // Update card using Content API v2
      const updateData: any = {
        nmID: parseInt(productId)
      };
      
      if (data.name) updateData.object = data.name;
      if (data.price) updateData.sizes = [{ price: data.price }];
      
      await this.makeRequest(`${this.contentUrl}/content/v2/cards/update`, {
        method: 'POST',
        body: JSON.stringify([updateData]),
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
      this.log('Updating stock on Wildberries...', { productId, stock });
      
      // Update stocks using Marketplace API v3
      await this.makeRequest(`${this.baseUrl}/api/v3/stocks/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          stocks: [{
            sku: productId,
            amount: stock
          }]
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
      this.log('Updating price on Wildberries...', { productId, price });
      
      await this.makeRequest(`${this.baseUrl}/public/api/v1/prices`, {
        method: 'POST',
        body: JSON.stringify([{
          nmId: parseInt(productId),
          price: price
        }]),
      });

      this.log('Price updated successfully', { productId, price });
      return true;
    } catch (error) {
      this.logError('Failed to update price', error);
      return false;
    }
  }

  /**
   * Get warehouse list
   */
  async getWarehouses(): Promise<any[]> {
    try {
      this.log('Fetching warehouses...');
      
      const response = await this.makeRequest(`${this.baseUrl}/api/v3/warehouses`);
      
      this.log(`Fetched ${response.length} warehouses`);
      return response || [];
    } catch (error) {
      this.logError('Failed to fetch warehouses', error);
      return [];
    }
  }
}
