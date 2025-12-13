// Marketplace Integration - Stub for production build
export interface MarketplaceCredentials {
  apiKey: string;
  sellerId?: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface MarketplaceOrder {
  id: string;
  total: number;
}

export interface MarketplaceStats {
  totalOrders: number;
  totalRevenue: number;
}

export class MarketplaceIntegration {
  constructor(marketplace: string, credentials: MarketplaceCredentials) {}
  async testConnection() { return false; }
  async getProducts() { return []; }
  async getOrders() { return []; }
  async getStats() { return { totalOrders: 0, totalRevenue: 0, totalProducts: 0, activeProducts: 0 }; }
  async syncProduct() { return false; }
  async updateStock() { return false; }
}

export class UzumIntegration extends MarketplaceIntegration {}
export class WildberriesIntegration extends MarketplaceIntegration {}
export class OzonIntegration extends MarketplaceIntegration {}
export class TrendyolIntegration extends MarketplaceIntegration {}
export class YandexIntegration extends MarketplaceIntegration {}
