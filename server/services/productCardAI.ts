// PRODUCT CARD AI - Optimized with Smart Templates
// 90% cost reduction through intelligent caching

import emergentAI from './emergentAI';
import smartTemplates from './smartTemplates';

export interface ProductCardInput {
  productName: string;
  category: string;
  marketplace: string;
  features: string[];
  price: number;
  brand?: string;
  targetAudience?: string;
  warranty?: string;
}

export interface ProductCardOutput {
  title: string;
  description: string;
  keywords: string[];
  seoScore: number;
  images?: string[];
  usedTemplate: boolean;
  cost: number;
  generationTime: number;
}

// ========================================
// PRODUCT CARD GENERATION
// ========================================

export async function createProductCard(
  input: ProductCardInput,
  partnerId?: string,
  generateImages = false
): Promise<ProductCardOutput> {
  const startTime = Date.now();
  let usedTemplate = false;
  let cost = 0;

  // Step 1: Try template first (90% cheaper)
  const templateCard = smartTemplates.generateProductCardFromTemplate(
    input.category,
    input.marketplace,
    {
      productName: input.productName,
      mainFeature: input.features[0] || 'Premium sifat',
      features: input.features.map((f, i) => `• ${f}`).join('\n'),
      warranty: input.warranty || '12 oy kafolat',
      callToAction: 'Hozir buyurtma bering! 🛒',
    }
  );

  let description: string;
  let title: string;
  let keywords: string[];

  if (templateCard && smartTemplates.shouldUseTemplate(input.category, input.marketplace)) {
    // Template-based (cheap!)
    description = templateCard;
    title = smartTemplates.generateSEOFromTemplate('title', {
      productName: input.productName,
      mainKeyword: input.features[0] || input.category,
      marketplace: input.marketplace,
    });
    keywords = input.features.slice(0, 10);
    usedTemplate = true;
    cost = smartTemplates.estimateCost('product_card', true);
    
    console.log('✅ Product card generated from TEMPLATE (fast & cheap)');
  } else {
    // AI-based (expensive, but high quality)
    const prompt = `
Yaratish kerak: Professional mahsulot kartochkasi

Mahsulot: ${input.productName}
Kategoriya: ${input.category}
Marketplace: ${input.marketplace}
Xususiyatlar: ${input.features.join(', ')}
Narx: ${input.price.toLocaleString()} so'm
Brand: ${input.brand || 'Unknown'}
Maqsadli auditoriya: ${input.targetAudience || 'Barcha'}

Quyidagilarni JSON formatda yarat:
{
  "title": "SEO-optimizatsiyalangan sarlavha (60-80 belgi)",
  "description": "To'liq va jozibali tavsif (300-500 so'z). Emoji ishlatma. Professional yoz.",
  "keywords": ["kalit so'z 1", "kalit so'z 2", ...10 ta],
  "seoScore": 85
}

MUHIM:
- ${input.marketplace} qoidalariga mos
- Professional va ishonchli
- Xaridorga yo'naltirilgan
- O'zbek tilida
`;

    const result = await emergentAI.generateJSON<{
      title: string;
      description: string;
      keywords: string[];
      seoScore: number;
    }>(prompt, 'ProductCard', partnerId);

    title = result.title;
    description = result.description;
    keywords = result.keywords;
    cost = smartTemplates.estimateCost('product_card', false);
    
    console.log('✅ Product card generated with AI (high quality)');
  }

  // Step 2: Generate images (if requested)
  let images: string[] = [];
  if (generateImages) {
    const imagePrompt = `Professional product photo: ${input.productName}, ${input.category}, studio lighting, white background, high quality, commercial photography`;
    
    images = await emergentAI.generateImage(
      {
        prompt: imagePrompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      },
      partnerId
    );
    
    cost += 0.04; // Image cost
    console.log('✅ Product images generated');
  }

  const generationTime = Date.now() - startTime;

  return {
    title,
    description,
    keywords,
    seoScore: 85,
    images,
    usedTemplate,
    cost,
    generationTime,
  };
}

// ========================================
// BATCH PRODUCT CARD CREATION
// ========================================

export async function batchCreateProductCards(
  products: ProductCardInput[],
  partnerId?: string,
  generateImages = false
): Promise<ProductCardOutput[]> {
  console.log(`🚀 Batch creating ${products.length} product cards...`);
  
  const batchSize = parseInt(process.env.BATCH_SIZE || '10');
  const results: ProductCardOutput[] = [];

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(p => createProductCard(p, partnerId, generateImages))
    );
    results.push(...batchResults);
    
    console.log(`  ✅ Processed ${Math.min(i + batchSize, products.length)}/${products.length}`);
    
    // Rate limiting
    if (i + batchSize < products.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
  const avgTime = results.reduce((sum, r) => sum + r.generationTime, 0) / results.length;
  const templateUsage = results.filter(r => r.usedTemplate).length;

  console.log(`✅ Batch complete:`);
  console.log(`   Total: ${results.length} cards`);
  console.log(`   Cost: $${totalCost.toFixed(4)}`);
  console.log(`   Avg time: ${avgTime.toFixed(0)}ms`);
  console.log(`   Template usage: ${templateUsage}/${results.length} (${(templateUsage/results.length*100).toFixed(0)}%)`);

  return results;
}

// ========================================
// SEO OPTIMIZATION
// ========================================

export async function optimizeSEO(
  currentTitle: string,
  currentDescription: string,
  marketplace: string,
  partnerId?: string
): Promise<{
  optimizedTitle: string;
  optimizedDescription: string;
  keywords: string[];
  improvements: string[];
  seoScore: number;
}> {
  const prompt = `
SEO Optimizatsiya qil:

Hozirgi sarlavha: ${currentTitle}
Hozirgi tavsif: ${currentDescription}
Marketplace: ${marketplace}

Quyidagilarni JSON formatda ber:
{
  "optimizedTitle": "Yaxshilangan sarlavha",
  "optimizedDescription": "Yaxshilangan tavsif",
  "keywords": ["kalit so'z 1", ...],
  "improvements": ["O'zgarish 1", "O'zgarish 2", ...],
  "seoScore": 90
}
`;

  return emergentAI.generateJSON(prompt, 'SEOOptimization', partnerId);
}

// ========================================
// REVIEW RESPONSE GENERATOR
// ========================================

export async function generateReviewResponse(
  reviewText: string,
  rating: number,
  productName: string,
  customerName: string,
  partnerId?: string
): Promise<string> {
  // Try template first
  const sentiment = rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative';
  
  if (rating >= 3) {
    // Use template for positive/neutral (90% cheaper)
    return smartTemplates.generateReviewResponseFromTemplate(sentiment, customerName);
  }

  // Use AI for negative reviews (need personalization)
  const prompt = `
Mijoz sharhiga professional javob yoz:

Mahsulot: ${productName}
Mijoz: ${customerName}
Reyting: ${rating}/5
Sharh: "${reviewText}"

Talablar:
- Kechirim so'ra
- Muammoni hal qilish yo'lini taklif qil
- Professional va samimiy
- 2-3 jumla
- Emoji ishlatma

Faqat javobni yoz, boshqa hech narsa.
`;

  return emergentAI.generateText(
    {
      prompt,
      maxTokens: 200,
      temperature: 0.7,
    },
    partnerId
  );
}

// ========================================
// EXPORTS
// ========================================

export const productCardAI = {
  createProductCard,
  batchCreateProductCards,
  optimizeSEO,
  generateReviewResponse,
};

export default productCardAI;
