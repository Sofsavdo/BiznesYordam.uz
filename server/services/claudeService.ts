// Claude 3.5 Sonnet Service - Primary AI for Text Generation
// Faster and cheaper than GPT-4, same quality

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

export interface ProductAnalysisResult {
  category: string;
  subcategory: string;
  keywords: string[];
  targetAudience: string;
  marketSuitability: {
    wildberries: number;
    uzum: number;
    ozon: number;
    trendyol: number;
  };
  suggestedPrice: {
    min: number;
    optimal: number;
    max: number;
  };
  confidence: number;
}

export interface SEOOptimizationResult {
  title: string;
  description: string;
  bulletPoints: string[];
  keywords: string[];
  confidence: number;
}

export interface MultiLanguageContent {
  russian: {
    title: string;
    description: string;
    bulletPoints: string[];
  };
  uzbek: {
    title: string;
    description: string;
    bulletPoints: string[];
  };
  turkish: {
    title: string;
    description: string;
    bulletPoints: string[];
  };
}

class ClaudeService {
  private enabled: boolean;

  constructor() {
    this.enabled = !!process.env.ANTHROPIC_API_KEY;
    if (!this.enabled) {
      console.warn('⚠️  Anthropic API key not found. Claude AI disabled.');
    } else {
      console.log('✅ Claude 3.5 Sonnet AI enabled');
    }
  }

  // Analyze product using Claude 3.5 Sonnet
  async analyzeProduct(
    name: string,
    description: string,
    imageUrl?: string
  ): Promise<ProductAnalysisResult> {
    if (!this.enabled) {
      return this.fallbackAnalyzeProduct(name, description);
    }

    try {
      const prompt = `Analyze this product for e-commerce marketplace:

Product Name: ${name}
Description: ${description}

Provide analysis in JSON format:
{
  "category": "main category",
  "subcategory": "subcategory",
  "keywords": ["keyword1", "keyword2", ...],
  "targetAudience": "description of target audience",
  "marketSuitability": {
    "wildberries": 0-100,
    "uzum": 0-100,
    "ozon": 0-100,
    "trendyol": 0-100
  },
  "suggestedPrice": {
    "min": number,
    "optimal": number,
    "max": number
  },
  "confidence": 0-100
}`;

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        system: 'You are an expert e-commerce product analyst. Analyze products and provide detailed insights for marketplace optimization. Always respond with valid JSON.'
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const result = JSON.parse(content.text);
        console.log('✅ Claude product analysis complete');
        return result;
      }

      throw new Error('Unexpected response format');

    } catch (error: any) {
      console.error('❌ Claude analysis error:', error.message);
      return this.fallbackAnalyzeProduct(name, description);
    }
  }

  // Generate SEO-optimized listing using Claude 3.5 Sonnet
  async generateSEOListing(
    name: string,
    description: string,
    category: string,
    keywords: string[],
    marketplace: 'wildberries' | 'uzum' | 'ozon' | 'trendyol'
  ): Promise<SEOOptimizationResult> {
    if (!this.enabled) {
      return this.fallbackGenerateSEO(name, description, keywords);
    }

    try {
      const marketplaceRules = {
        wildberries: 'Russian language, professional tone, focus on quality and features',
        uzum: 'Uzbek or Russian language, simple and clear, focus on benefits',
        ozon: 'Russian language, detailed descriptions, technical specifications',
        trendyol: 'Turkish language, modern style, focus on trends and fashion'
      };

      const prompt = `Create SEO-optimized product listing for ${marketplace}:

Product: ${name}
Description: ${description}
Category: ${category}
Keywords: ${keywords.join(', ')}

Marketplace rules: ${marketplaceRules[marketplace]}

Generate in JSON format:
{
  "title": "SEO-optimized title (max 200 chars)",
  "description": "Professional description (200-500 words)",
  "bulletPoints": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "keywords": ["optimized keyword 1", "optimized keyword 2", ...],
  "confidence": 0-100
}`;

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        system: 'You are an expert SEO copywriter specializing in e-commerce marketplace listings. Create compelling, keyword-rich content that converts. Always respond with valid JSON.'
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const result = JSON.parse(content.text);
        console.log('✅ Claude SEO listing generated');
        return result;
      }

      throw new Error('Unexpected response format');

    } catch (error: any) {
      console.error('❌ Claude SEO generation error:', error.message);
      return this.fallbackGenerateSEO(name, description, keywords);
    }
  }

  // Generate multi-language content for all marketplaces
  async generateMultiLanguageContent(
    name: string,
    description: string,
    category: string
  ): Promise<MultiLanguageContent> {
    if (!this.enabled) {
      return this.fallbackMultiLanguage(name, description);
    }

    try {
      const prompt = `Create multi-language product content for marketplaces:

Product: ${name}
Description: ${description}
Category: ${category}

Generate content in 3 languages (Russian for Wildberries/Ozon, Uzbek for Uzum, Turkish for Trendyol):

{
  "russian": {
    "title": "SEO title in Russian (max 200 chars)",
    "description": "Professional description in Russian (200-300 words)",
    "bulletPoints": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"]
  },
  "uzbek": {
    "title": "SEO title in Uzbek (max 200 chars)",
    "description": "Professional description in Uzbek (200-300 words)",
    "bulletPoints": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"]
  },
  "turkish": {
    "title": "SEO title in Turkish (max 200 chars)",
    "description": "Professional description in Turkish (200-300 words)",
    "bulletPoints": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"]
  }
}`;

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        system: 'You are a professional multilingual copywriter specializing in e-commerce. Create compelling product content in Russian, Uzbek, and Turkish. Always respond with valid JSON.'
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const result = JSON.parse(content.text);
        console.log('✅ Claude multi-language content generated');
        return result;
      }

      throw new Error('Unexpected response format');

    } catch (error: any) {
      console.error('❌ Claude multi-language error:', error.message);
      return this.fallbackMultiLanguage(name, description);
    }
  }

  // Validate listing against marketplace rules
  async validateListing(
    title: string,
    description: string,
    marketplace: string
  ): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  }> {
    if (!this.enabled) {
      return this.fallbackValidateListing(title, description);
    }

    try {
      const prompt = `Validate this product listing for ${marketplace} marketplace:

Title: ${title}
Description: ${description}

Check for:
1. Prohibited words (best, guaranteed, 100%, free shipping, etc.)
2. Medical/health claims
3. Trademark violations
4. Misleading information
5. Length requirements
6. Marketplace-specific rules

Provide validation in JSON format:
{
  "valid": true/false,
  "errors": ["critical error 1", ...],
  "warnings": ["warning 1", ...],
  "suggestions": ["suggestion 1", ...]
}`;

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        system: 'You are an expert in marketplace compliance and content moderation. Validate listings against marketplace rules. Always respond with valid JSON.'
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const result = JSON.parse(content.text);
        console.log('✅ Claude listing validation complete');
        return result;
      }

      throw new Error('Unexpected response format');

    } catch (error: any) {
      console.error('❌ Claude validation error:', error.message);
      return this.fallbackValidateListing(title, description);
    }
  }

  // ==================== FALLBACK METHODS ====================

  private fallbackAnalyzeProduct(name: string, description: string): ProductAnalysisResult {
    console.log('⚠️  Using fallback product analysis');
    
    const text = (name + ' ' + description).toLowerCase();
    
    let category = 'General';
    let subcategory = 'Other';
    
    if (text.includes('phone') || text.includes('smartphone')) {
      category = 'Electronics';
      subcategory = 'Mobile Phones';
    } else if (text.includes('watch') || text.includes('smartwatch')) {
      category = 'Electronics';
      subcategory = 'Wearables';
    } else if (text.includes('laptop') || text.includes('computer')) {
      category = 'Electronics';
      subcategory = 'Computers';
    } else if (text.includes('clothes') || text.includes('shirt')) {
      category = 'Fashion';
      subcategory = 'Clothing';
    }

    const words = text.split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with'];
    const keywords = words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 10);

    return {
      category,
      subcategory,
      keywords,
      targetAudience: 'General consumers',
      marketSuitability: {
        wildberries: 85,
        uzum: 80,
        ozon: 85,
        trendyol: 75
      },
      suggestedPrice: {
        min: 50,
        optimal: 100,
        max: 150
      },
      confidence: 70
    };
  }

  private fallbackGenerateSEO(
    name: string,
    description: string,
    keywords: string[]
  ): SEOOptimizationResult {
    console.log('⚠️  Using fallback SEO generation');
    
    const title = `${name} ${keywords.slice(0, 3).join(' ')}`.substring(0, 200);
    const desc = `${description} Perfect for those looking for ${keywords.slice(0, 3).join(', ')}.`;
    
    return {
      title,
      description: desc,
      bulletPoints: [
        `High quality ${name}`,
        `Perfect for daily use`,
        `Durable and reliable`,
        `Great value for money`,
        `Fast delivery available`
      ],
      keywords: keywords.slice(0, 10),
      confidence: 60
    };
  }

  private fallbackMultiLanguage(name: string, description: string): MultiLanguageContent {
    console.log('⚠️  Using fallback multi-language generation');
    
    return {
      russian: {
        title: name,
        description: description,
        bulletPoints: [
          'Высокое качество',
          'Быстрая доставка',
          'Гарантия качества',
          'Доступная цена',
          'Отличный выбор'
        ]
      },
      uzbek: {
        title: name,
        description: description,
        bulletPoints: [
          'Yuqori sifat',
          'Tez yetkazib berish',
          'Sifat kafolati',
          'Qulay narx',
          'Ajoyib tanlov'
        ]
      },
      turkish: {
        title: name,
        description: description,
        bulletPoints: [
          'Yüksek kalite',
          'Hızlı teslimat',
          'Kalite garantisi',
          'Uygun fiyat',
          'Mükemmel seçim'
        ]
      }
    };
  }

  private fallbackValidateListing(title: string, description: string): any {
    console.log('⚠️  Using fallback validation');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (title.length < 10) {
      errors.push('Title too short (minimum 10 characters)');
    }
    if (title.length > 200) {
      errors.push('Title too long (maximum 200 characters)');
    }
    if (description.length < 50) {
      warnings.push('Description too short (recommended 50+ characters)');
    }

    const prohibited = ['best', 'guaranteed', '100%', 'free shipping'];
    prohibited.forEach(word => {
      if (title.toLowerCase().includes(word) || description.toLowerCase().includes(word)) {
        warnings.push(`Consider removing "${word}" - may violate marketplace rules`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  // Check if Claude is enabled
  isEnabled(): boolean {
    return this.enabled;
  }

  // Get API status
  getStatus(): { enabled: boolean; model: string } {
    return {
      enabled: this.enabled,
      model: this.enabled ? 'claude-3-5-sonnet-20241022' : 'fallback'
    };
  }
}

// Export singleton instance
export const claudeService = new ClaudeService();
