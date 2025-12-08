// SMART TEMPLATE SYSTEM - 90% Cost Reduction
// Caching, reusability, optimization

interface Template {
  id: string;
  category: string;
  marketplace: string;
  type: 'product_card' | 'review_response' | 'seo_description';
  template: string;
  variables: string[];
  useCount: number;
  createdAt: Date;
  lastUsed: Date;
}

const templateCache = new Map<string, Template>();

// ========================================
// PRODUCT CARD TEMPLATES
// ========================================

const PRODUCT_CARD_TEMPLATES: Record<string, Record<string, string>> = {
  electronics: {
    uzum: `**{{productName}}** - {{mainFeature}}\n\n🔥 XUSUSIYATLARI:\n{{features}}\n\n✅ KAFOLAT: {{warranty}}\n📦 YETKAZIB BERISH: Bepul\n⭐ REYTING: 4.8/5\n\n{{callToAction}}`,
    wildberries: `{{productName}} | {{mainFeature}}\n\nТехнические характеристики:\n{{features}}\n\nГарантия: {{warranty}}\nДоставка: Бесплатно\n\n{{callToAction}}`,
  },
  clothing: {
    uzum: `**{{productName}}** - {{style}}\n\n👗 TAFSILOTLAR:\n{{details}}\n\n📏 O'LCHAMLAR: {{sizes}}\n🎨 RANGLAR: {{colors}}\n✨ SIFAT: Premium\n\n{{callToAction}}`,
  },
  home: {
    uzum: `**{{productName}}** - {{benefit}}\n\n🏠 UYINGIZ UCHUN:\n{{features}}\n\n✅ SIFAT KAFOLATI\n📦 TEZKOR YETKAZIB BERISH\n\n{{callToAction}}`,
  },
};

// ========================================
// REVIEW RESPONSE TEMPLATES
// ========================================

const REVIEW_RESPONSES: Record<string, string[]> = {
  positive: [
    'Rahmat {{customerName}}! Sizning fikr-mulohazangiz biz uchun juda qimmatli. 🙏',
    'Ajoyib! Mahsulotimiz yoqqanidan xursandmiz, {{customerName}}! ⭐',
    'Rahmat sizga! Doimo eng yaxshi xizmatni ko\'rsatishga intilamiz! 💚',
  ],
  neutral: [
    'Rahmat fikr-mulohazangiz uchun, {{customerName}}. Yaxshilash ustida ishlayapmiz!',
    'Taklifingiz uchun minnatdormiz! Inobatga olamiz. 🙏',
  ],
  negative: [
    'Kechirasiz {{customerName}}, muammo yuzaga keldi. Darhol hal qilamiz va sizga aloqaga chiqamiz. 📞',
    'Uzr so\'raymiz! Muammoni hal qilish uchun qo\'ng\'iroq qilamiz. Sizning qoniqishingiz biz uchun muhim! 🙏',
  ],
};

// ========================================
// SEO TEMPLATES
// ========================================

const SEO_TEMPLATES: Record<string, string> = {
  title: '{{productName}} | {{mainKeyword}} | {{marketplace}} | Toshkent',
  metaDescription: '{{productName}} - {{benefit}}. ✅ {{feature1}}, {{feature2}}, {{feature3}}. 📦 Tezkor yetkazib berish. ⭐ Kafolat. Buyurtma bering!',
  keywords: '{{productName}}, {{category}}, {{marketplace}}, {{location}}, sotib olish, arzon, sifatli',
};

// ========================================
// TEMPLATE RENDERING
// ========================================

export function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  
  return result;
}

// ========================================
// PRODUCT CARD GENERATOR (Template-based)
// ========================================

export function generateProductCardFromTemplate(
  category: string,
  marketplace: string,
  variables: Record<string, string>
): string | null {
  const template = PRODUCT_CARD_TEMPLATES[category]?.[marketplace];
  
  if (!template) {
    return null; // Fall back to AI generation
  }
  
  return renderTemplate(template, variables);
}

// ========================================
// REVIEW RESPONSE GENERATOR (Template-based)
// ========================================

export function generateReviewResponseFromTemplate(
  sentiment: 'positive' | 'neutral' | 'negative',
  customerName: string
): string {
  const templates = REVIEW_RESPONSES[sentiment];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return renderTemplate(template, { customerName });
}

// ========================================
// SEO GENERATOR (Template-based)
// ========================================

export function generateSEOFromTemplate(
  type: 'title' | 'metaDescription' | 'keywords',
  variables: Record<string, string>
): string {
  const template = SEO_TEMPLATES[type];
  return renderTemplate(template, variables);
}

// ========================================
// SMART DECISION: Template vs AI
// ========================================

export interface SmartGenerationOptions {
  useTemplate: boolean; // Force template usage
  category: string;
  marketplace: string;
  productData: Record<string, any>;
}

export function shouldUseTemplate(
  category: string,
  marketplace: string
): boolean {
  // Use template if available (90% cost reduction)
  return PRODUCT_CARD_TEMPLATES[category]?.[marketplace] !== undefined;
}

// ========================================
// COST ESTIMATION
// ========================================

export function estimateCost(
  operation: 'product_card' | 'review_response' | 'seo',
  useTemplate: boolean
): number {
  if (useTemplate) {
    return 0.001; // Template: ~$0.001
  }
  
  const costs = {
    product_card: 0.05,    // AI: ~$0.05
    review_response: 0.01, // AI: ~$0.01
    seo: 0.02,             // AI: ~$0.02
  };
  
  return costs[operation] || 0.05;
}

// ========================================
// TEMPLATE ANALYTICS
// ========================================

export function getTemplateUsageStats() {
  return {
    totalTemplates: templateCache.size,
    categories: Object.keys(PRODUCT_CARD_TEMPLATES),
    marketplaces: ['uzum', 'wildberries', 'yandex', 'ozon'],
    estimatedSavings: templateCache.size * 0.049, // $0.05 - $0.001
  };
}

// ========================================
// EXPORTS
// ========================================

export const smartTemplates = {
  renderTemplate,
  generateProductCardFromTemplate,
  generateReviewResponseFromTemplate,
  generateSEOFromTemplate,
  shouldUseTemplate,
  estimateCost,
  getTemplateUsageStats,
};

export default smartTemplates;
