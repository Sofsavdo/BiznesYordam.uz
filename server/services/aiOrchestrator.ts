// AI Orchestrator - Manages all AI services
// Routes requests to optimal AI based on task type

import { claudeService } from './claudeService';
import { openaiService } from './openaiService';

export type AIProvider = 'claude' | 'openai' | 'fallback';

export interface AIConfig {
  textAI: AIProvider;
  imageAnalysisAI: AIProvider;
  preferClaude: boolean;
}

class AIOrchestrator {
  private config: AIConfig;

  constructor() {
    this.config = {
      textAI: claudeService.isEnabled() ? 'claude' : openaiService.isEnabled() ? 'openai' : 'fallback',
      imageAnalysisAI: openaiService.isEnabled() ? 'openai' : 'fallback',
      preferClaude: true // Claude is faster and cheaper
    };

    this.logStatus();
  }

  private logStatus() {
    console.log('\n🤖 AI Orchestrator Status:');
    console.log(`  Text AI: ${this.config.textAI.toUpperCase()}`);
    console.log(`  Image Analysis: ${this.config.imageAnalysisAI.toUpperCase()}`);
    console.log(`  Claude Status: ${claudeService.getStatus().model}`);
    console.log(`  OpenAI Status: ${openaiService.getStatus().model}\n`);
  }

  // ==================== PRODUCT ANALYSIS ====================

  async analyzeProduct(name: string, description: string, imageUrl?: string) {
    console.log(`🔍 Analyzing product with ${this.config.textAI.toUpperCase()}...`);
    
    if (this.config.textAI === 'claude') {
      return await claudeService.analyzeProduct(name, description, imageUrl);
    } else if (this.config.textAI === 'openai') {
      return await openaiService.analyzeProduct(name, description, imageUrl);
    }
    
    throw new Error('No AI provider available for product analysis');
  }

  // ==================== SEO GENERATION ====================

  async generateSEOListing(
    name: string,
    description: string,
    category: string,
    keywords: string[],
    marketplace: 'wildberries' | 'uzum' | 'ozon' | 'trendyol'
  ) {
    console.log(`✍️  Generating SEO listing with ${this.config.textAI.toUpperCase()}...`);
    
    if (this.config.textAI === 'claude') {
      return await claudeService.generateSEOListing(name, description, category, keywords, marketplace);
    } else if (this.config.textAI === 'openai') {
      return await openaiService.generateSEOListing(name, description, category, keywords, marketplace);
    }
    
    throw new Error('No AI provider available for SEO generation');
  }

  // ==================== MULTI-LANGUAGE CONTENT ====================

  async generateMultiLanguageContent(
    name: string,
    description: string,
    category: string
  ) {
    console.log(`🌍 Generating multi-language content with ${this.config.textAI.toUpperCase()}...`);
    
    if (this.config.textAI === 'claude') {
      return await claudeService.generateMultiLanguageContent(name, description, category);
    }
    
    // Fallback: generate for each marketplace separately
    const russian = await this.generateSEOListing(name, description, category, [], 'wildberries');
    const uzbek = await this.generateSEOListing(name, description, category, [], 'uzum');
    const turkish = await this.generateSEOListing(name, description, category, [], 'trendyol');
    
    return {
      russian: {
        title: russian.title,
        description: russian.description,
        bulletPoints: russian.bulletPoints
      },
      uzbek: {
        title: uzbek.title,
        description: uzbek.description,
        bulletPoints: uzbek.bulletPoints
      },
      turkish: {
        title: turkish.title,
        description: turkish.description,
        bulletPoints: turkish.bulletPoints
      }
    };
  }

  // ==================== IMAGE ANALYSIS ====================

  async analyzeImage(imageUrl: string) {
    console.log(`🖼️  Analyzing image with ${this.config.imageAnalysisAI.toUpperCase()}...`);
    
    if (this.config.imageAnalysisAI === 'openai') {
      return await openaiService.analyzeImage(imageUrl);
    }
    
    throw new Error('No AI provider available for image analysis');
  }

  // ==================== LISTING VALIDATION ====================

  async validateListing(
    title: string,
    description: string,
    marketplace: string
  ) {
    console.log(`✅ Validating listing with ${this.config.textAI.toUpperCase()}...`);
    
    if (this.config.textAI === 'claude') {
      return await claudeService.validateListing(title, description, marketplace);
    } else if (this.config.textAI === 'openai') {
      return await openaiService.validateListing(title, description, marketplace);
    }
    
    throw new Error('No AI provider available for validation');
  }

  // ==================== BATCH PROCESSING ====================

  async batchAnalyzeProducts(products: Array<{ name: string; description: string; imageUrl?: string }>) {
    console.log(`📦 Batch analyzing ${products.length} products...`);
    
    const results = await Promise.all(
      products.map(async (product) => {
        try {
          return await this.analyzeProduct(product.name, product.description, product.imageUrl);
        } catch (error) {
          console.error(`Failed to analyze product: ${product.name}`, error);
          return null;
        }
      })
    );
    
    return results.filter(r => r !== null);
  }

  async batchGenerateSEO(
    products: Array<{
      name: string;
      description: string;
      category: string;
      keywords: string[];
      marketplace: 'wildberries' | 'uzum' | 'ozon' | 'trendyol';
    }>
  ) {
    console.log(`📦 Batch generating SEO for ${products.length} products...`);
    
    const results = await Promise.all(
      products.map(async (product) => {
        try {
          return await this.generateSEOListing(
            product.name,
            product.description,
            product.category,
            product.keywords,
            product.marketplace
          );
        } catch (error) {
          console.error(`Failed to generate SEO for: ${product.name}`, error);
          return null;
        }
      })
    );
    
    return results.filter(r => r !== null);
  }

  // ==================== COST TRACKING ====================

  async estimateCost(operation: string, count: number): Promise<number> {
    // Cost per 1000 operations based on AI_COMPARISON_ANALYSIS.md
    const costs = {
      claude_text: 0.025, // $25/month for 1000 products
      openai_text: 0.050, // $50/month for 1000 products
      openai_vision: 0.015, // $15/month for 1000 images
      flux_image: 0.020, // $20/month for 1000 images
      ideogram_image: 0.075 // $75/month for 1000 infographics
    };

    let costPer1000 = 0;
    
    if (operation.includes('text') || operation.includes('seo')) {
      costPer1000 = this.config.textAI === 'claude' ? costs.claude_text : costs.openai_text;
    } else if (operation.includes('image_analysis')) {
      costPer1000 = costs.openai_vision;
    } else if (operation.includes('image_generation')) {
      costPer1000 = costs.flux_image;
    } else if (operation.includes('infographic')) {
      costPer1000 = costs.ideogram_image;
    }

    return (count / 1000) * costPer1000;
  }

  // ==================== STATUS & CONFIG ====================

  getStatus() {
    return {
      config: this.config,
      providers: {
        claude: claudeService.getStatus(),
        openai: openaiService.getStatus()
      },
      recommendations: {
        textAI: 'Claude 3.5 Sonnet (faster, cheaper)',
        imageAnalysis: 'GPT-4 Vision (best quality)',
        imageGeneration: 'Flux.1 for photos, Ideogram for infographics',
        videoGeneration: 'Haiper AI (best value)'
      }
    };
  }

  updateConfig(newConfig: Partial<AIConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.logStatus();
  }
}

// Export singleton instance
export const aiOrchestrator = new AIOrchestrator();
