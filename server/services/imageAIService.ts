// Image AI Service - Flux.1 + Ideogram AI
// Flux.1: Product photos (photorealistic)
// Ideogram AI: Infographics with text (marketplace cards)

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || ''
});

export interface ImageGenerationOptions {
  prompt: string;
  type: 'product_photo' | 'infographic' | 'lifestyle' | 'banner';
  aspectRatio?: '1:1' | '4:3' | '16:9' | '9:16';
  style?: 'photorealistic' | 'minimalist' | 'vibrant' | 'professional';
  includeText?: boolean;
  textContent?: string;
}

export interface ImageEnhancementOptions {
  removeBackground?: boolean;
  upscale?: boolean;
  enhanceQuality?: boolean;
  adjustColors?: boolean;
  addWatermark?: boolean;
}

export interface GeneratedImage {
  url: string;
  width: number;
  height: number;
  format: string;
  aiModel: string;
  cost: number;
}

class ImageAIService {
  private fluxEnabled: boolean;
  private ideogramEnabled: boolean;

  constructor() {
    this.fluxEnabled = !!process.env.REPLICATE_API_KEY;
    this.ideogramEnabled = !!process.env.IDEOGRAM_API_KEY;
    
    if (!this.fluxEnabled && !this.ideogramEnabled) {
      console.warn('⚠️  No image AI services enabled. Using fallback.');
    } else {
      console.log('✅ Image AI Services:');
      if (this.fluxEnabled) console.log('   - Flux.1 (Product Photos)');
      if (this.ideogramEnabled) console.log('   - Ideogram AI (Infographics)');
    }
  }

  // ==================== IMAGE GENERATION ====================

  async generateProductImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
    console.log(`🎨 Generating ${options.type} image...`);

    // Use Ideogram for infographics with text
    if (options.type === 'infographic' && options.includeText && this.ideogramEnabled) {
      return await this.generateWithIdeogram(options);
    }

    // Use Flux.1 for product photos
    if (this.fluxEnabled) {
      return await this.generateWithFlux(options);
    }

    // Fallback
    return this.fallbackGenerate(options);
  }

  // Generate with Flux.1 (via Replicate)
  private async generateWithFlux(options: ImageGenerationOptions): Promise<GeneratedImage> {
    try {
      console.log('🚀 Generating with Flux.1...');

      const aspectRatioMap: Record<string, string> = {
        '1:1': '1024x1024',
        '4:3': '1024x768',
        '16:9': '1024x576',
        '9:16': '576x1024'
      };

      const size = aspectRatioMap[options.aspectRatio || '1:1'];
      const [width, height] = size.split('x').map(Number);

      // Enhance prompt based on style
      let enhancedPrompt = options.prompt;
      if (options.style === 'photorealistic') {
        enhancedPrompt += ', professional product photography, studio lighting, white background, high resolution, 8k';
      } else if (options.style === 'minimalist') {
        enhancedPrompt += ', minimalist style, clean background, simple composition';
      } else if (options.style === 'vibrant') {
        enhancedPrompt += ', vibrant colors, eye-catching, dynamic composition';
      }

      const output = await replicate.run(
        "black-forest-labs/flux-1.1-pro",
        {
          input: {
            prompt: enhancedPrompt,
            width: width,
            height: height,
            num_outputs: 1,
            guidance_scale: 3.5,
            num_inference_steps: 28,
            output_format: "png",
            output_quality: 90
          }
        }
      );

      const imageUrl = Array.isArray(output) ? output[0] : output;

      console.log('✅ Flux.1 image generated');

      return {
        url: imageUrl as string,
        width,
        height,
        format: 'png',
        aiModel: 'flux-1.1-pro',
        cost: 0.04 // $0.04 per image
      };

    } catch (error: any) {
      console.error('❌ Flux.1 generation error:', error.message);
      return this.fallbackGenerate(options);
    }
  }

  // Generate with Ideogram AI (for infographics with text)
  private async generateWithIdeogram(options: ImageGenerationOptions): Promise<GeneratedImage> {
    try {
      console.log('🎯 Generating infographic with Ideogram AI...');

      // Ideogram API call
      const response = await fetch('https://api.ideogram.ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.IDEOGRAM_API_KEY || ''
        },
        body: JSON.stringify({
          prompt: options.prompt,
          text: options.textContent || '',
          aspect_ratio: options.aspectRatio || '1:1',
          style: 'design',
          magic_prompt_option: 'AUTO'
        })
      });

      if (!response.ok) {
        throw new Error(`Ideogram API error: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;

      console.log('✅ Ideogram infographic generated');

      return {
        url: imageUrl,
        width: 1024,
        height: 1024,
        format: 'png',
        aiModel: 'ideogram-v2',
        cost: 0.08 // $0.08 per image
      };

    } catch (error: any) {
      console.error('❌ Ideogram generation error:', error.message);
      
      // Fallback to Flux if Ideogram fails
      if (this.fluxEnabled) {
        console.log('⚠️  Falling back to Flux.1...');
        return await this.generateWithFlux(options);
      }
      
      return this.fallbackGenerate(options);
    }
  }

  // ==================== IMAGE ENHANCEMENT ====================

  async enhanceImage(imageUrl: string, options: ImageEnhancementOptions): Promise<GeneratedImage> {
    console.log('✨ Enhancing image...');

    if (!this.fluxEnabled) {
      return this.fallbackEnhance(imageUrl);
    }

    try {
      let processedUrl = imageUrl;

      // Remove background
      if (options.removeBackground) {
        console.log('🔲 Removing background...');
        const output = await replicate.run(
          "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
          {
            input: {
              image: imageUrl
            }
          }
        );
        processedUrl = output as string;
      }

      // Upscale image
      if (options.upscale) {
        console.log('📈 Upscaling image...');
        const output = await replicate.run(
          "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
          {
            input: {
              image: processedUrl,
              scale: 2,
              face_enhance: false
            }
          }
        );
        processedUrl = output as string;
      }

      // Enhance quality
      if (options.enhanceQuality) {
        console.log('💎 Enhancing quality...');
        // Use Flux img2img for quality enhancement
        const output = await replicate.run(
          "black-forest-labs/flux-1.1-pro",
          {
            input: {
              prompt: "enhance quality, professional product photo, high resolution",
              image: processedUrl,
              prompt_strength: 0.3,
              num_inference_steps: 28
            }
          }
        );
        processedUrl = Array.isArray(output) ? output[0] : output as string;
      }

      console.log('✅ Image enhancement complete');

      return {
        url: processedUrl,
        width: 2048,
        height: 2048,
        format: 'png',
        aiModel: 'flux-enhancement',
        cost: 0.06 // $0.06 for enhancement
      };

    } catch (error: any) {
      console.error('❌ Image enhancement error:', error.message);
      return this.fallbackEnhance(imageUrl);
    }
  }

  // ==================== BATCH PROCESSING ====================

  async batchGenerateImages(
    requests: ImageGenerationOptions[]
  ): Promise<GeneratedImage[]> {
    console.log(`📦 Batch generating ${requests.length} images...`);

    const results = await Promise.all(
      requests.map(async (options) => {
        try {
          return await this.generateProductImage(options);
        } catch (error) {
          console.error('Failed to generate image:', error);
          return this.fallbackGenerate(options);
        }
      })
    );

    const totalCost = results.reduce((sum, img) => sum + img.cost, 0);
    console.log(`✅ Batch complete. Total cost: $${totalCost.toFixed(2)}`);

    return results;
  }

  // ==================== MARKETPLACE-SPECIFIC IMAGES ====================

  async generateMarketplaceImages(
    productName: string,
    marketplace: 'wildberries' | 'uzum' | 'ozon' | 'trendyol'
  ): Promise<{
    mainImage: GeneratedImage;
    additionalImages: GeneratedImage[];
    infographic: GeneratedImage;
  }> {
    console.log(`🏪 Generating images for ${marketplace}...`);

    const marketplaceSpecs = {
      wildberries: {
        mainSize: '1:1',
        style: 'photorealistic' as const,
        requiresWhiteBg: true
      },
      uzum: {
        mainSize: '1:1',
        style: 'professional' as const,
        requiresWhiteBg: true
      },
      ozon: {
        mainSize: '1:1',
        style: 'photorealistic' as const,
        requiresWhiteBg: true
      },
      trendyol: {
        mainSize: '4:3',
        style: 'vibrant' as const,
        requiresWhiteBg: false
      }
    };

    const spec = marketplaceSpecs[marketplace];

    // Main product image
    const mainImage = await this.generateProductImage({
      prompt: `${productName}, ${spec.requiresWhiteBg ? 'white background' : 'lifestyle background'}`,
      type: 'product_photo',
      aspectRatio: spec.mainSize as any,
      style: spec.style
    });

    // Additional lifestyle images
    const additionalImages = await this.batchGenerateImages([
      {
        prompt: `${productName} in use, lifestyle photo`,
        type: 'lifestyle',
        aspectRatio: '4:3',
        style: 'photorealistic'
      },
      {
        prompt: `${productName} detail shot, close-up`,
        type: 'product_photo',
        aspectRatio: '1:1',
        style: 'photorealistic'
      }
    ]);

    // Infographic with product features
    const infographic = await this.generateProductImage({
      prompt: `Product infographic for ${productName}, features and benefits`,
      type: 'infographic',
      aspectRatio: '1:1',
      style: 'professional',
      includeText: true,
      textContent: `${productName}\nKey Features\nHigh Quality\nFast Delivery`
    });

    return {
      mainImage,
      additionalImages,
      infographic
    };
  }

  // ==================== FALLBACK METHODS ====================

  private fallbackGenerate(options: ImageGenerationOptions): GeneratedImage {
    console.log('⚠️  Using fallback image generation');
    
    // Return placeholder image
    return {
      url: `https://via.placeholder.com/1024x1024/CCCCCC/333333?text=${encodeURIComponent(options.prompt.substring(0, 50))}`,
      width: 1024,
      height: 1024,
      format: 'png',
      aiModel: 'fallback',
      cost: 0
    };
  }

  private fallbackEnhance(imageUrl: string): GeneratedImage {
    console.log('⚠️  Using fallback image enhancement');
    
    return {
      url: imageUrl,
      width: 1024,
      height: 1024,
      format: 'png',
      aiModel: 'fallback',
      cost: 0
    };
  }

  // ==================== STATUS & COST ====================

  getStatus() {
    return {
      flux: {
        enabled: this.fluxEnabled,
        model: 'flux-1.1-pro',
        costPerImage: 0.04
      },
      ideogram: {
        enabled: this.ideogramEnabled,
        model: 'ideogram-v2',
        costPerImage: 0.08
      },
      recommendations: {
        productPhotos: 'Flux.1 (photorealistic, fast)',
        infographics: 'Ideogram AI (best text rendering)',
        enhancement: 'Flux.1 (upscale, background removal)'
      }
    };
  }

  async estimateCost(imageCount: number, type: 'product' | 'infographic' | 'enhancement'): Promise<number> {
    const costs = {
      product: 0.04, // Flux.1
      infographic: 0.08, // Ideogram
      enhancement: 0.06 // Flux enhancement
    };

    return imageCount * costs[type];
  }

  isEnabled(): boolean {
    return this.fluxEnabled || this.ideogramEnabled;
  }
}

// Export singleton instance
export const imageAIService = new ImageAIService();
