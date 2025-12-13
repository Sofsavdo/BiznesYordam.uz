import { MarketplaceIntegration, MarketplaceCredentials } from './index';
import { UzumIntegration } from './uzum';
import { WildberriesIntegration } from './wildberries';
import { OzonIntegration } from './ozon';
import { TrendyolIntegration } from './trendyol';
import { YandexIntegration } from './yandex';
import { logger } from '../logger';

export type MarketplaceName = 'uzum' | 'wildberries' | 'ozon' | 'trendyol' | 'yandex';

export class MarketplaceManager {
  private integrations: Map<string, MarketplaceIntegration> = new Map();

  /**
   * Initialize marketplace integration for a partner
   */
  async initializeIntegration(
    partnerId: string,
    marketplace: MarketplaceName,
    credentials: MarketplaceCredentials
  ): Promise<boolean> {
    try {
      const key = `${partnerId}:${marketplace}`;
      
      let integration: MarketplaceIntegration;
      
      switch (marketplace) {
        case 'uzum':
          integration = new UzumIntegration(credentials);
          break;
        case 'wildberries':
          integration = new WildberriesIntegration(credentials);
          break;
        case 'ozon':
          integration = new OzonIntegration(credentials);
          break;
        case 'trendyol':
          integration = new TrendyolIntegration(credentials);
          break;
        case 'yandex':
          integration = new YandexIntegration(credentials);
          break;
        default:
          logger.error(`Unknown marketplace: ${marketplace}`);
          return false;
      }

      // Test connection
      const isConnected = await integration.testConnection();
      if (!isConnected) {
        logger.error(`Failed to connect to ${marketplace} for partner ${partnerId}`);
        return false;
      }

      // Store integration
      this.integrations.set(key, integration);
      logger.info(`Marketplace integration initialized: ${key}`);
      
      return true;
    } catch (error) {
      logger.error(`Failed to initialize ${marketplace} integration for partner ${partnerId}`, error);
      return false;
    }
  }

  /**
   * Get integration for a partner and marketplace
   */
  getIntegration(partnerId: string, marketplace: MarketplaceName): MarketplaceIntegration | null {
    const key = `${partnerId}:${marketplace}`;
    return this.integrations.get(key) || null;
  }

  /**
   * Remove integration
   */
  removeIntegration(partnerId: string, marketplace: MarketplaceName): void {
    const key = `${partnerId}:${marketplace}`;
    this.integrations.delete(key);
    logger.info(`Marketplace integration removed: ${key}`);
  }

  /**
   * Get all integrations for a partner
   */
  getPartnerIntegrations(partnerId: string): Array<{ marketplace: MarketplaceName; integration: MarketplaceIntegration }> {
    const result: Array<{ marketplace: MarketplaceName; integration: MarketplaceIntegration }> = [];
    
    for (const [key, integration] of this.integrations.entries()) {
      if (key.startsWith(`${partnerId}:`)) {
        const marketplace = key.split(':')[1] as MarketplaceName;
        result.push({ marketplace, integration });
      }
    }
    
    return result;
  }

  /**
   * Sync all products for a partner across all marketplaces
   */
  async syncAllProducts(partnerId: string): Promise<void> {
    const integrations = this.getPartnerIntegrations(partnerId);
    
    for (const { marketplace, integration } of integrations) {
      try {
        logger.info(`Syncing products for ${marketplace}...`);
        const products = await integration.getProducts();
        logger.info(`Synced ${products.length} products from ${marketplace}`);
        // TODO: Update database with synced products
      } catch (error) {
        logger.error(`Failed to sync products from ${marketplace}`, error);
      }
    }
  }

  /**
   * Sync all orders for a partner across all marketplaces
   */
  async syncAllOrders(partnerId: string, startDate?: Date, endDate?: Date): Promise<void> {
    const integrations = this.getPartnerIntegrations(partnerId);
    
    for (const { marketplace, integration } of integrations) {
      try {
        logger.info(`Syncing orders for ${marketplace}...`);
        const orders = await integration.getOrders(startDate, endDate);
        logger.info(`Synced ${orders.length} orders from ${marketplace}`);
        // TODO: Update database with synced orders
      } catch (error) {
        logger.error(`Failed to sync orders from ${marketplace}`, error);
      }
    }
  }

  /**
   * Get combined stats for a partner across all marketplaces
   */
  async getCombinedStats(partnerId: string) {
    const integrations = this.getPartnerIntegrations(partnerId);
    
    const stats = {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      activeProducts: 0,
      byMarketplace: {} as Record<string, any>,
    };

    for (const { marketplace, integration } of integrations) {
      try {
        const marketplaceStats = await integration.getStats();
        stats.totalOrders += marketplaceStats.totalOrders;
        stats.totalRevenue += marketplaceStats.totalRevenue;
        stats.totalProducts += marketplaceStats.totalProducts;
        stats.activeProducts += marketplaceStats.activeProducts;
        stats.byMarketplace[marketplace] = marketplaceStats;
      } catch (error) {
        logger.error(`Failed to get stats from ${marketplace}`, error);
      }
    }

    return stats;
  }
}

// Singleton instance
export const marketplaceManager = new MarketplaceManager();
