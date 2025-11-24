// MARKETPLACE AUTOMATION SERVICE
// AI-powered seller cabinet automation with Puppeteer

import puppeteer, { Browser, Page } from 'puppeteer';
import { encryption } from './encryptionService';
import { log } from '../utils/logger';

interface MarketplaceCredentials {
  username: string;
  password: string;
  twoFactorSecret?: string;
}

interface ProductCard {
  title: string;
  description: string;
  price: number;
  images: string[];
  video?: string;
  category: string;
  specifications: Record<string, string>;
  keywords: string[];
}

export class MarketplaceAutomation {
  private browser: Browser | null = null;
  private activeSessions: Map<string, Page> = new Map();

  // Initialize browser
  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      });
      log.info('🤖 Puppeteer browser initialized');
    }
    return this.browser;
  }

  // Login to marketplace
  async login(marketplace: string, encryptedCredentials: string): Promise<boolean> {
    try {
      const credentials = encryption.decryptCredentials(encryptedCredentials);
      const browser = await this.initialize();
      const page = await browser.newPage();

      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate based on marketplace
      const loginUrl = this.getLoginUrl(marketplace);
      await page.goto(loginUrl, { waitUntil: 'networkidle2' });

      // Marketplace-specific login
      const success = await this.performLogin(page, marketplace, credentials);

      if (success) {
        // Store session
        this.activeSessions.set(marketplace, page);
        log.auth('Marketplace login', marketplace, true);
        return true;
      }

      await page.close();
      return false;

    } catch (error: any) {
      log.error('Marketplace login failed', error);
      return false;
    }
  }

  // Perform login (marketplace-specific)
  private async performLogin(
    page: Page, 
    marketplace: string, 
    credentials: MarketplaceCredentials
  ): Promise<boolean> {
    try {
      switch (marketplace) {
        case 'uzum':
          return await this.loginUzum(page, credentials);
        case 'wildberries':
          return await this.loginWildberries(page, credentials);
        case 'yandex':
          return await this.loginYandex(page, credentials);
        case 'ozon':
          return await this.loginOzon(page, credentials);
        default:
          throw new Error(`Unknown marketplace: ${marketplace}`);
      }
    } catch (error: any) {
      log.error(`Login failed for ${marketplace}`, error);
      return false;
    }
  }

  // UZUM MARKET LOGIN
  private async loginUzum(page: Page, creds: MarketplaceCredentials): Promise<boolean> {
    // Wait for login form
    await page.waitForSelector('input[name="username"], input[type="email"]', { timeout: 10000 });

    // Fill username
    await page.type('input[name="username"], input[type="email"]', creds.username);
    await page.waitForTimeout(500);

    // Fill password
    await page.type('input[name="password"], input[type="password"]', creds.password);
    await page.waitForTimeout(500);

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation or 2FA
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});

    // Check if 2FA required
    const needs2FA = await page.$('input[name="code"], input[placeholder*="код"]');
    
    if (needs2FA && creds.twoFactorSecret) {
      const code = this.generate2FACode(creds.twoFactorSecret);
      await page.type('input[name="code"], input[placeholder*="код"]', code);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }

    // Verify login success
    const isLoggedIn = await page.evaluate(() => {
      return !window.location.href.includes('/login');
    });

    return isLoggedIn;
  }

  // WILDBERRIES LOGIN
  private async loginWildberries(page: Page, creds: MarketplaceCredentials): Promise<boolean> {
    await page.waitForSelector('input[type="tel"], input[type="email"]');
    await page.type('input[type="tel"], input[type="email"]', creds.username);
    await page.waitForTimeout(500);
    
    await page.type('input[type="password"]', creds.password);
    await page.waitForTimeout(500);
    
    await page.click('button[type="submit"], button.login-btn');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    return !await page.url().includes('/login');
  }

  // YANDEX MARKET LOGIN
  private async loginYandex(page: Page, creds: MarketplaceCredentials): Promise<boolean> {
    await page.waitForSelector('#passp-field-login');
    await page.type('#passp-field-login', creds.username);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    await page.waitForSelector('#passp-field-passwd');
    await page.type('#passp-field-passwd', creds.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    return !await page.url().includes('/auth');
  }

  // OZON LOGIN
  private async loginOzon(page: Page, creds: MarketplaceCredentials): Promise<boolean> {
    await page.waitForSelector('input[name="login"]');
    await page.type('input[name="login"]', creds.username);
    await page.waitForTimeout(500);
    
    await page.type('input[name="password"]', creds.password);
    await page.waitForTimeout(500);
    
    await page.click('button.login-form__submit');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    return !await page.url().includes('/login');
  }

  // CREATE PRODUCT CARD
  async createProductCard(
    marketplace: string,
    productCard: ProductCard
  ): Promise<{ success: boolean; productId?: string; error?: string }> {
    try {
      const page = this.activeSessions.get(marketplace);
      
      if (!page) {
        throw new Error(`No active session for ${marketplace}`);
      }

      log.info(`🎨 Creating product card on ${marketplace}`);

      // Navigate to create product page
      await this.navigateToCreateProduct(page, marketplace);

      // Fill product form (marketplace-specific)
      await this.fillProductForm(page, marketplace, productCard);

      // Upload images
      await this.uploadImages(page, marketplace, productCard.images);

      // Upload video (if exists)
      if (productCard.video) {
        await this.uploadVideo(page, marketplace, productCard.video);
      }

      // Submit
      const productId = await this.submitProduct(page, marketplace);

      log.info(`✅ Product created on ${marketplace}: ${productId}`);

      return { success: true, productId };

    } catch (error: any) {
      log.error(`Failed to create product on ${marketplace}`, error);
      return { success: false, error: error.message };
    }
  }

  // Navigate to create product page
  private async navigateToCreateProduct(page: Page, marketplace: string) {
    const urls = {
      uzum: 'https://seller.uzum.uz/products/create',
      wildberries: 'https://seller.wildberries.ru/new-goods/goods-list',
      yandex: 'https://partner.market.yandex.ru/products/new',
      ozon: 'https://seller.ozon.ru/app/products/create'
    };

    await page.goto(urls[marketplace as keyof typeof urls], { 
      waitUntil: 'networkidle2' 
    });
  }

  // Fill product form (marketplace-specific)
  private async fillProductForm(
    page: Page, 
    marketplace: string, 
    card: ProductCard
  ) {
    switch (marketplace) {
      case 'uzum':
        await this.fillUzumForm(page, card);
        break;
      case 'wildberries':
        await this.fillWildberriesForm(page, card);
        break;
      case 'yandex':
        await this.fillYandexForm(page, card);
        break;
      case 'ozon':
        await this.fillOzonForm(page, card);
        break;
    }
  }

  // UZUM form filling
  private async fillUzumForm(page: Page, card: ProductCard) {
    // Title
    await page.waitForSelector('input[name="title"]');
    await page.type('input[name="title"]', card.title);

    // Category
    await page.click('select[name="category"]');
    await page.select('select[name="category"]', card.category);

    // Price
    await page.type('input[name="price"]', card.price.toString());

    // Description
    await page.type('textarea[name="description"]', card.description);

    // Specifications
    for (const [key, value] of Object.entries(card.specifications)) {
      await page.type(`input[name="spec_${key}"]`, value);
    }

    // Keywords
    await page.type('input[name="keywords"]', card.keywords.join(', '));
  }

  // Upload images
  private async uploadImages(page: Page, marketplace: string, images: string[]) {
    const input = await page.$('input[type="file"][accept*="image"]');
    
    if (input) {
      // Download images to temp folder
      const localPaths = await this.downloadImages(images);
      
      // Upload all at once
      await input.uploadFile(...localPaths);
      
      // Wait for upload completion
      await page.waitForTimeout(2000 * images.length);
      
      // Cleanup temp files
      await this.cleanupTempFiles(localPaths);
    }
  }

  // Generate 2FA code
  private generate2FACode(secret: string): string {
    const speakeasy = require('speakeasy');
    return speakeasy.totp({
      secret: secret,
      encoding: 'base32'
    });
  }

  // Get login URL
  private getLoginUrl(marketplace: string): string {
    const urls = {
      uzum: 'https://seller.uzum.uz/login',
      wildberries: 'https://seller.wildberries.ru/login',
      yandex: 'https://partner.market.yandex.ru/login',
      ozon: 'https://seller.ozon.ru/login'
    };
    return urls[marketplace as keyof typeof urls] || '';
  }

  // Cleanup
  async cleanup() {
    for (const [marketplace, page] of this.activeSessions) {
      await page.close();
      log.info(`Closed session for ${marketplace}`);
    }
    this.activeSessions.clear();

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      log.info('Browser closed');
    }
  }

  // Helper: Download images to temp
  private async downloadImages(urls: string[]): Promise<string[]> {
    // Implementation: download images to temp folder
    return [];
  }

  // Helper: Cleanup temp files
  private async cleanupTempFiles(paths: string[]) {
    // Implementation: delete temp files
  }

  // Helper: Submit product
  private async submitProduct(page: Page, marketplace: string): Promise<string> {
    // Click submit button
    await page.click('button[type="submit"], button.submit-btn');
    
    // Wait for success
    await page.waitForSelector('.success-message, .product-id', { timeout: 30000 });
    
    // Extract product ID
    const productId = await page.evaluate(() => {
      const el = document.querySelector('.product-id, [data-product-id]');
      return el?.textContent || el?.getAttribute('data-product-id') || 'unknown';
    });
    
    return productId;
  }

  // Helper: Fill Wildberries form
  private async fillWildberriesForm(page: Page, card: ProductCard) {
    // Wildberries-specific selectors
    await page.type('input.product-name', card.title);
    await page.type('textarea.product-description', card.description);
    await page.type('input.product-price', card.price.toString());
  }

  // Helper: Fill Yandex form
  private async fillYandexForm(page: Page, card: ProductCard) {
    // Yandex-specific selectors
    await page.type('#product-name', card.title);
    await page.type('#product-description', card.description);
    await page.type('#product-price', card.price.toString());
  }

  // Helper: Fill Ozon form
  private async fillOzonForm(page: Page, card: ProductCard) {
    // Ozon-specific selectors
    await page.type('input[placeholder="Название товара"]', card.title);
    await page.type('textarea[placeholder="Описание"]', card.description);
    await page.type('input[placeholder="Цена"]', card.price.toString());
  }

  // Helper: Upload video
  private async uploadVideo(page: Page, marketplace: string, videoUrl: string) {
    const input = await page.$('input[type="file"][accept*="video"]');
    if (input) {
      // Download video to temp
      const localPath = await this.downloadVideo(videoUrl);
      await input.uploadFile(localPath);
      await page.waitForTimeout(5000);
      await this.cleanupTempFiles([localPath]);
    }
  }

  // Helper: Download video
  private async downloadVideo(url: string): Promise<string> {
    // Implementation
    return '';
  }
}

// Singleton
export const marketplaceAutomation = new MarketplaceAutomation();
