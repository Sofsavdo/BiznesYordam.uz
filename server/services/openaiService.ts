// OpenAI GPT-4 Service - Real AI Integration
// Replaces mock AI with actual GPT-4 API

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
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

export interface ImageAnalysisResult {
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  suggestions: string[];
  marketplaceCompliance: {
    wildberries: boolean;
    uzum: boolean;
    ozon: boolean;
    trendyol: boolean;
  };
}

class OpenAIService {
  private enabled: boolean;

  constructor() {
    this.enabled = !!process.env.OPENAI_API_KEY;
    if (!this.enabled) {
      console.warn('⚠️  OpenAI API key not found. Using fallback AI.');
    }
  }

  // Analyze product using GPT-4
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

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert e-commerce product analyst. Analyze products and provide detailed insights for marketplace optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('✅ GPT-4 product analysis complete');
      return result;

    } catch (error: any) {
      console.error('❌ GPT-4 analysis error:', error.message);
      return this.fallbackAnalyzeProduct(name, description);
    }
  }

  // Generate SEO-optimized listing using GPT-4
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

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO copywriter specializing in e-commerce marketplace listings. Create compelling, keyword-rich content that converts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('✅ GPT-4 SEO listing generated');
      return result;

    } catch (error: any) {
      console.error('❌ GPT-4 SEO generation error:', error.message);
      return this.fallbackGenerateSEO(name, description, keywords);
    }
  }

  // Analyze image using GPT-4 Vision
  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
    if (!this.enabled) {
      return this.fallbackAnalyzeImage();
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in e-commerce product photography. Analyze images for marketplace compliance and quality.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this product image for marketplace compliance. Check:
1. Image quality (resolution, lighting, focus)
2. Background (should be white or clean)
3. Product visibility (clear, centered, no obstructions)
4. Prohibited elements (watermarks, text overlays, contact info)
5. Marketplace compliance (Wildberries, Uzum, Ozon, Trendyol standards)

Provide analysis in JSON format:
{
  "quality": "excellent|good|fair|poor",
  "issues": ["issue 1", "issue 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "marketplaceCompliance": {
    "wildberries": true/false,
    "uzum": true/false,
    "ozon": true/false,
    "trendyol": true/false
  }
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('✅ GPT-4 Vision image analysis complete');
      return result;

    } catch (error: any) {
      console.error('❌ GPT-4 Vision error:', error.message);
      return this.fallbackAnalyzeImage();
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

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in marketplace compliance and content moderation. Validate listings against marketplace rules.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      console.log('✅ GPT-4 listing validation complete');
      return result;

    } catch (error: any) {
      console.error('❌ GPT-4 validation error:', error.message);
      return this.fallbackValidateListing(title, description);
    }
  }

  // ==================== FALLBACK METHODS ====================

  private fallbackAnalyzeProduct(name: string, description: string): ProductAnalysisResult {
    console.log('⚠️  Using fallback product analysis');
    
    const text = (name + ' ' + description).toLowerCase();
    
    // Simple category detection
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

    // Extract keywords
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
    
    // Simple SEO title
    const title = `${name} ${keywords.slice(0, 3).join(' ')}`.substring(0, 200);
    
    // Simple description
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

  private fallbackAnalyzeImage(): ImageAnalysisResult {
    console.log('⚠️  Using fallback image analysis');
    
    return {
      quality: 'good',
      issues: [],
      suggestions: ['Consider using white background', 'Ensure good lighting'],
      marketplaceCompliance: {
        wildberries: true,
        uzum: true,
        ozon: true,
        trendyol: true
      }
    };
  }

  private fallbackValidateListing(title: string, description: string): any {
    console.log('⚠️  Using fallback validation');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Basic validation
    if (title.length < 10) {
      errors.push('Title too short (minimum 10 characters)');
    }
    if (title.length > 200) {
      errors.push('Title too long (maximum 200 characters)');
    }
    if (description.length < 50) {
      warnings.push('Description too short (recommended 50+ characters)');
    }

    // Check prohibited words
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

  // Check if OpenAI is enabled
  isEnabled(): boolean {
    return this.enabled;
  }

  // Get API status
  getStatus(): { enabled: boolean; model: string } {
    return {
      enabled: this.enabled,
      model: this.enabled ? 'gpt-4-turbo-preview' : 'fallback'
    };
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();
