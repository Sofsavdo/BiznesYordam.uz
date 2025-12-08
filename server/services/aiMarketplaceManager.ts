// AI Marketplace Manager - Core Service (LEGACY)
// ⚠️ DEPRECATED: Use emergentAI.ts and productCardAI.ts instead
// This file is kept for backward compatibility

import emergentAI from './emergentAI';

// AI Review Response Generator
export async function generateReviewResponse(
  reviewText: string,
  rating: number,
  productName: string,
  language: 'uz' | 'ru' | 'en' = 'uz'
): Promise<string> {
  const sentiment = rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative';
  
  const prompt = `Sen professional marketplace manager san. Mijoz sharhiga javob yoz.

Mahsulot: ${productName}
Sharh: "${reviewText}"
Reyting: ${rating}/5
Sentiment: ${sentiment}
Til: ${language}

Talablar:
- Professional va do'stona
- ${sentiment === 'negative' ? 'Muammoni tan ol va yechim taklif qil' : 'Minnatdorchilik bildir'}
- Qisqa va aniq (2-3 jumla)
- Emoji ishlatma
- Faqat javobni yoz, boshqa hech narsa`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

// AI Product Card Creator
export async function createProductCard(
  productInfo: {
    name: string;
    category: string;
    features: string[];
    targetAudience: string;
  },
  marketplace: 'uzum' | 'wildberries' | 'yandex' | 'ozon'
): Promise<{
  title: string;
  description: string;
  keywords: string[];
  seoScore: number;
}> {
  const prompt = `Sen professional marketplace SEO mutaxassisi san. Mahsulot kartochkasini yarat.

Mahsulot: ${productInfo.name}
Kategoriya: ${productInfo.category}
Xususiyatlar: ${productInfo.features.join(', ')}
Maqsadli auditoriya: ${productInfo.targetAudience}
Marketplace: ${marketplace}

Quyidagilarni yarat:
1. SEO-optimizatsiyalangan sarlavha (60-80 belgi)
2. To'liq tavsif (500-800 so'z, kalit so'zlar bilan)
3. 10 ta asosiy kalit so'z
4. SEO ball (1-100)

Format (JSON):
{
  "title": "...",
  "description": "...",
  "keywords": ["...", "..."],
  "seoScore": 85
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  return JSON.parse(text);
}

// AI Competitor Analysis
export async function analyzeCompetitor(
  competitorData: {
    productName: string;
    price: number;
    rating: number;
    reviewsCount: number;
    description: string;
  },
  myProduct: {
    name: string;
    price: number;
  }
): Promise<{
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  priceStrategy: string;
}> {
  const prompt = `Sen marketplace strategist san. Raqobatchini tahlil qil.

Raqobatchi:
- Mahsulot: ${competitorData.productName}
- Narx: ${competitorData.price} so'm
- Reyting: ${competitorData.rating}/5
- Sharhlar: ${competitorData.reviewsCount}

Bizning mahsulot:
- Nomi: ${myProduct.name}
- Narx: ${myProduct.price} so'm

Tahlil qil va JSON formatda ber:
{
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "recommendations": ["...", "..."],
  "priceStrategy": "..."
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  return JSON.parse(text);
}

// AI SEO Optimizer
export async function optimizeSEO(
  currentTitle: string,
  currentDescription: string,
  marketplace: string
): Promise<{
  optimizedTitle: string;
  optimizedDescription: string;
  keywords: string[];
  improvements: string[];
}> {
  const prompt = `Sen SEO expert san. Mahsulot kartochkasini optimizatsiya qil.

Hozirgi sarlavha: ${currentTitle}
Hozirgi tavsif: ${currentDescription}
Marketplace: ${marketplace}

Optimizatsiya qil va JSON ber:
{
  "optimizedTitle": "...",
  "optimizedDescription": "...",
  "keywords": ["...", "..."],
  "improvements": ["...", "..."]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  return JSON.parse(text);
}

// AI Ad Campaign Creator
export async function createAdCampaign(
  productInfo: {
    name: string;
    category: string;
    price: number;
    targetAudience: string;
  },
  budget: number,
  marketplace: string
): Promise<{
  campaignName: string;
  keywords: string[];
  bidStrategy: string;
  dailyBudget: number;
  targetingRecommendations: string[];
}> {
  const prompt = `Sen marketplace reklama mutaxassisi san. Reklama kampaniyasini yarat.

Mahsulot: ${productInfo.name}
Kategoriya: ${productInfo.category}
Narx: ${productInfo.price} so'm
Auditoriya: ${productInfo.targetAudience}
Budget: ${budget} so'm
Marketplace: ${marketplace}

Kampaniya strategiyasini JSON formatda ber:
{
  "campaignName": "...",
  "keywords": ["...", "..."],
  "bidStrategy": "...",
  "dailyBudget": 0,
  "targetingRecommendations": ["...", "..."]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  return JSON.parse(text);
}

// AI Report Generator
export async function generateReport(
  reportData: {
    period: string;
    sales: number;
    revenue: number;
    orders: number;
    avgRating: number;
    topProducts: string[];
  }
): Promise<{
  summary: string;
  insights: string[];
  recommendations: string[];
  nextSteps: string[];
}> {
  const prompt = `Sen marketplace analyst san. Hisobot tayyorla.

Davr: ${reportData.period}
Savdo: ${reportData.sales} dona
Daromad: ${reportData.revenue} so'm
Buyurtmalar: ${reportData.orders}
O'rtacha reyting: ${reportData.avgRating}/5
Top mahsulotlar: ${reportData.topProducts.join(', ')}

Professional hisobot yarat (JSON):
{
  "summary": "...",
  "insights": ["...", "..."],
  "recommendations": ["...", "..."],
  "nextSteps": ["...", "..."]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  return JSON.parse(text);
}
