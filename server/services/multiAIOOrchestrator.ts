// server/services/multiAIOOrchestrator.ts
// Multi-AI Ecosystem Orchestrator

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Midjourney } from 'midjourney';
import { RunwayML } from '@runwayml/sdk';
import { PerplexityAI } from 'perplexity-ai';
import { CanvaAPI } from 'canva-api';

export interface AIRequest {
  type: 'text' | 'image' | 'video' | 'content' | 'design';
  prompt: string;
  context?: any;
  options?: {
    model?: string;
    quality?: string;
    style?: string;
    format?: string;
  };
}

export interface AIResponse {
  success: boolean;
  data: any;
  metadata: {
    aiService: string;
    model: string;
    tokensUsed?: number;
    cost?: number;
    processingTime: number;
  };
  error?: string;
}

// Configuration
const config = {
  openai: { apiKey: process.env.OPENAI_API_KEY },
  anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
  midjourney: { apiKey: process.env.MIDJOURNEY_API_KEY },
  runwayml: { apiKey: process.env.RUNWAYML_API_KEY },
  perplexity: { apiKey: process.env.PERPLEXITY_API_KEY },
  canva: { apiKey: process.env.CANVA_API_KEY },
};

// Initialize AI clients
const openai = new OpenAI(config.openai);
const anthropic = new Anthropic(config.anthropic);
const midjourney = new Midjourney(config.midjourney);
const runwayml = new RunwayML(config.runwayml);
const perplexity = new PerplexityAI(config.perplexity);
const canva = new CanvaAPI(config.canva);

export class MultiAIOOrchestrator {
  private static instance: MultiAIOOrchestrator;

  static getInstance(): MultiAIOOrchestrator {
    if (!MultiAIOOrchestrator.instance) {
      MultiAIOOrchestrator.instance = new MultiAIOOrchestrator();
    }
    return MultiAIOOrchestrator.instance;
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      switch (request.type) {
        case 'text':
          return await this.processTextRequest(request, startTime);
        case 'image':
          return await this.processImageRequest(request, startTime);
        case 'video':
          return await this.processVideoRequest(request, startTime);
        case 'content':
          return await this.processContentRequest(request, startTime);
        case 'design':
          return await this.processDesignRequest(request, startTime);
        default:
          throw new Error(`Unsupported AI request type: ${request.type}`);
      }
    } catch (error: any) {
      return {
        success: false,
        data: null,
        metadata: {
          aiService: 'unknown',
          model: 'unknown',
          processingTime: Date.now() - startTime,
        },
        error: error.message,
      };
    }
  }

  private async processTextRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    // Use Claude for complex reasoning, GPT-4 for general tasks
    const useClaude = request.prompt.includes('reasoning') ||
                     request.prompt.includes('analysis') ||
                     request.prompt.length > 1000;

    if (useClaude && config.anthropic.apiKey) {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: request.prompt }],
      });

      return {
        success: true,
        data: {
          text: response.content[0].type === 'text' ? response.content[0].text : '',
          reasoning: 'Advanced reasoning with Claude 3.5 Sonnet',
        },
        metadata: {
          aiService: 'anthropic',
          model: 'claude-3-5-sonnet-20241022',
          tokensUsed: response.usage?.input_tokens + (response.usage?.output_tokens || 0),
          cost: this.calculateAnthropicCost(response.usage),
          processingTime: Date.now() - startTime,
        },
      };
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: request.prompt }],
        max_tokens: 4000,
      });

      return {
        success: true,
        data: {
          text: response.choices[0].message.content,
          reasoning: 'Fast processing with GPT-4 Turbo',
        },
        metadata: {
          aiService: 'openai',
          model: 'gpt-4-turbo-preview',
          tokensUsed: response.usage?.total_tokens,
          cost: this.calculateOpenAICost(response.usage?.total_tokens || 0, 'gpt-4'),
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  private async processImageRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    // Use Midjourney for high-quality artistic images, DALL-E for general images
    const useMidjourney = request.prompt.includes('artistic') ||
                         request.prompt.includes('portrait') ||
                         request.options?.style === 'artistic';

    if (useMidjourney && config.midjourney.apiKey) {
      const response = await midjourney.generate({
        prompt: request.prompt,
        style: request.options?.style || 'vivid',
        quality: request.options?.quality || 'standard',
      });

      return {
        success: true,
        data: {
          imageUrl: response.imageUrl,
          style: response.style,
        },
        metadata: {
          aiService: 'midjourney',
          model: 'midjourney-v6',
          processingTime: Date.now() - startTime,
        },
      };
    } else {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: request.prompt,
        size: '1024x1024',
        quality: 'standard',
      });

      return {
        success: true,
        data: {
          imageUrl: response.data[0].url,
          revisedPrompt: response.data[0].revised_prompt,
        },
        metadata: {
          aiService: 'openai',
          model: 'dall-e-3',
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  private async processVideoRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    // Use Runway ML for video generation
    if (!config.runwayml.apiKey) {
      throw new Error('Runway ML API key not configured');
    }

    const response = await runwayml.generateVideo({
      prompt: request.prompt,
      model: request.options?.model || 'gen-3-alpha-turbo',
      duration: '5s',
    });

    return {
      success: true,
      data: {
        videoUrl: response.videoUrl,
        thumbnailUrl: response.thumbnailUrl,
      },
      metadata: {
        aiService: 'runwayml',
        model: request.options?.model || 'gen-3-alpha-turbo',
        processingTime: Date.now() - startTime,
      },
    };
  }

  private async processContentRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    // Use Perplexity AI for research and content creation
    if (!config.perplexity.apiKey) {
      throw new Error('Perplexity AI API key not configured');
    }

    const response = await perplexity.search({
      query: request.prompt,
      model: 'sonar-pro',
      max_tokens: 4000,
    });

    return {
      success: true,
      data: {
        content: response.content,
        sources: response.sources,
        citations: response.citations,
      },
      metadata: {
        aiService: 'perplexity',
        model: 'sonar-pro',
        tokensUsed: response.usage?.total_tokens,
        processingTime: Date.now() - startTime,
      },
    };
  }

  private async processDesignRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    // Use Canva API for design creation
    if (!config.canva.apiKey) {
      throw new Error('Canva API key not configured');
    }

    const response = await canva.createDesign({
      prompt: request.prompt,
      format: request.options?.format || 'social_media',
      style: request.options?.style || 'modern',
    });

    return {
      success: true,
      data: {
        designUrl: response.designUrl,
        thumbnailUrl: response.thumbnailUrl,
        editUrl: response.editUrl,
      },
      metadata: {
        aiService: 'canva',
        model: 'canva-ai-design',
        processingTime: Date.now() - startTime,
      },
    };
  }

  private calculateOpenAICost(tokens: number, model: string): number {
    const costPer1kTokens = model.includes('gpt-4') ? 0.01 : 0.002;
    return (tokens / 1000) * costPer1kTokens;
  }

  private calculateAnthropicCost(usage: any): number {
    if (!usage) return 0;
    const inputCost = (usage.input_tokens / 1000000) * 3; // $3 per million input tokens
    const outputCost = (usage.output_tokens / 1000000) * 15; // $15 per million output tokens
    return inputCost + outputCost;
  }
}

// Export singleton instance
export const multiAIOrchestrator = MultiAIOOrchestrator.getInstance();
