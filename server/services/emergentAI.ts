// EMERGENT AI SERVICE - Unified AI Integration
// Cost-optimized, scalable, production-ready

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize clients with Emergent LLM key
const EMERGENT_KEY = process.env.EMERGENT_LLM_KEY || '';

// OpenAI client (for image generation and GPT models)
const openai = new OpenAI({
  apiKey: EMERGENT_KEY,
  baseURL: 'https://api.openai.com/v1', // Emergent routes through this
});

// Anthropic client (for Claude models)
const anthropic = new Anthropic({
  apiKey: EMERGENT_KEY,
});

// ========================================
// COST TRACKING
// ========================================

interface CostEntry {
  partnerId: string;
  model: string;
  operation: string;
  tokensUsed?: number;
  imagesGenerated?: number;
  cost: number;
  timestamp: Date;
}

const costLog: CostEntry[] = [];

function logCost(entry: CostEntry) {
  costLog.push(entry);
  // TODO: Save to database for persistent tracking
}

export function getPartnerCosts(partnerId: string, startDate: Date, endDate: Date) {
  return costLog
    .filter(e => 
      e.partnerId === partnerId && 
      e.timestamp >= startDate && 
      e.timestamp <= endDate
    )
    .reduce((sum, e) => sum + e.cost, 0);
}

// ========================================
// TEXT GENERATION (Claude 4 Sonnet)
// ========================================

export interface TextGenerationOptions {
  prompt: string;
  systemMessage?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export async function generateText(
  options: TextGenerationOptions,
  partnerId?: string
): Promise<string> {
  const {
    prompt,
    systemMessage = 'Sen professional marketplace AI assistant san.',
    maxTokens = 2000,
    temperature = 0.7,
    model = 'claude-4-sonnet-20250514',
  } = options;

  try {
    const startTime = Date.now();
    
    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const duration = Date.now() - startTime;

    // Cost calculation (Claude 4 Sonnet: ~$3/1M input, ~$15/1M output)
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const cost = (inputTokens * 0.000003) + (outputTokens * 0.000015);

    if (partnerId) {
      logCost({
        partnerId,
        model,
        operation: 'text_generation',
        tokensUsed: inputTokens + outputTokens,
        cost,
        timestamp: new Date(),
      });
    }

    console.log(`✅ Text generated (${duration}ms, $${cost.toFixed(4)}, ${inputTokens + outputTokens} tokens)`);

    return text;
  } catch (error: any) {
    console.error('❌ Text generation error:', error.message);
    throw new Error(`AI text generation failed: ${error.message}`);
  }
}

// ========================================
// IMAGE GENERATION (gpt-image-1)
// ========================================

export interface ImageGenerationOptions {
  prompt: string;
  size?: '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  n?: number;
  model?: string;
}

export async function generateImage(
  options: ImageGenerationOptions,
  partnerId?: string
): Promise<string[]> {
  const {
    prompt,
    size = '1024x1024',
    quality = 'standard',
    n = 1,
    model = 'gpt-image-1',
  } = options;

  try {
    const startTime = Date.now();

    const response = await openai.images.generate({
      model,
      prompt,
      n,
      size,
      quality,
      response_format: 'url',
    });

    const urls = response.data.map(img => img.url || '');
    const duration = Date.now() - startTime;

    // Cost calculation (gpt-image-1: ~$0.04 per standard image, ~$0.08 per HD)
    const costPerImage = quality === 'hd' ? 0.08 : 0.04;
    const totalCost = costPerImage * n;

    if (partnerId) {
      logCost({
        partnerId,
        model,
        operation: 'image_generation',
        imagesGenerated: n,
        cost: totalCost,
        timestamp: new Date(),
      });
    }

    console.log(`✅ Images generated (${duration}ms, $${totalCost.toFixed(4)}, ${n} images)`);

    return urls;
  } catch (error: any) {
    console.error('❌ Image generation error:', error.message);
    throw new Error(`AI image generation failed: ${error.message}`);
  }
}

// ========================================
// JSON GENERATION (Structured Output)
// ========================================

export async function generateJSON<T>(
  prompt: string,
  schema: string,
  partnerId?: string
): Promise<T> {
  const fullPrompt = `${prompt}\n\nRespond with valid JSON only. Schema: ${schema}`;
  
  const text = await generateText(
    {
      prompt: fullPrompt,
      systemMessage: 'You are a JSON API. Return only valid JSON, no explanation.',
      temperature: 0.3,
    },
    partnerId
  );

  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    return JSON.parse(jsonText.trim());
  } catch (error) {
    console.error('❌ JSON parse error:', text);
    throw new Error('Failed to parse AI response as JSON');
  }
}

// ========================================
// BATCH PROCESSING
// ========================================

export async function batchGenerateText(
  prompts: Array<{ prompt: string; systemMessage?: string }>,
  partnerId?: string
): Promise<string[]> {
  const batchSize = parseInt(process.env.BATCH_SIZE || '10');
  const results: string[] = [];

  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(p => generateText(p, partnerId))
    );
    results.push(...batchResults);
    
    // Rate limiting
    if (i + batchSize < prompts.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// ========================================
// EXPORTS
// ========================================

export const emergentAI = {
  generateText,
  generateImage,
  generateJSON,
  batchGenerateText,
  getPartnerCosts,
};

export default emergentAI;
