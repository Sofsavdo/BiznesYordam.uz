import { logger } from '../logger';

export interface MarketplaceCredentials {
  apiKey: string;
  sellerId?: string;
  supplierId?: string;
  campaignId?: string;
  apiUrl?: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  date: Date;
  status: string;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface MarketplaceStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
}

export abstract class MarketplaceIntegration {
  protected credentials: MarketplaceCredentials;
  protected marketplace: string;

  constructor(marketplace: string, credentials: MarketplaceCredentials) {
    this.marketplace = marketplace;
    this.credentials = credentials;
  }

  // Abstract methods that each marketplace must implement
  abstract testConnection(): Promise<boolean>;
  abstract getProducts(): Promise<MarketplaceProduct[]>;
  abstract getOrders(startDate?: Date, endDate?: Date): Promise<MarketplaceOrder[]>;
  abstract getStats(): Promise<MarketplaceStats>;
  abstract syncProduct(productId: string, data: Partial<MarketplaceProduct>): Promise<boolean>;
  abstract updateStock(productId: string, stock: number): Promise<boolean>;

  // Common helper methods
  protected async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.credentials.apiKey}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      logger.error(`Marketplace API request failed: ${this.marketplace}`, error);
      throw error;
    }
  }

  protected log(message: string, data?: any) {
    logger.info(`[${this.marketplace}] ${message}`, data);
  }

  protected logError(message: string, error?: any) {
    logger.error(`[${this.marketplace}] ${message}`, error);
  }
}
