// CORRECT PRICING - SellerCloudX
// Updated: December 2024

export const SAAS_AI_PLANS = {
  ai_starter: {
    id: 'ai_starter',
    name: 'AI Starter',
    nameUz: 'AI Starter',
    monthlyFee: 349,
    currency: 'USD',
    revenueCommission: 0.015, // 1.5%
    skuLimit: 100,
    
    features: {
      included: [
        'AI Mahsulot kartochkalari yaratish',
        'Marketplace avtomatik yuklash',
        'SEO optimizatsiya',
        'Narx monitoring',
        'Buyurtma boshqaruvi',
        'Basic analytics',
        'Email support'
      ],
      restricted: [
        'Trend Hunter (yopiq)',
        'Sof foyda analizi (yopiq)',
        'Advanced analytics (yopiq)',
        'Marketplace soni cheklangan (2 ta)'
      ]
    },
    
    limits: {
      sku: 100,
      marketplaces: 2,
      trendHunter: false,
      profitAnalysis: false,
      advancedAnalytics: false
    }
  },
  
  ai_manager_pro: {
    id: 'ai_manager_pro',
    name: 'AI Manager Pro',
    nameUz: 'AI Manager Pro',
    monthlyFee: 899,
    currency: 'USD',
    revenueCommission: 0.01, // 1%
    skuLimit: 250,
    
    features: {
      included: [
        'BARCHA AI Starter features',
        'Trend Hunter FULL',
        'Sof foyda analizi',
        'Advanced analytics',
        'Cheksiz marketplace',
        'Priority support',
        'API access',
        'Custom integrations'
      ],
      note: '250+ SKU - alohida kelishuv va qo\'shimcha xizmat'
    },
    
    limits: {
      sku: 250,
      marketplaces: 999,
      trendHunter: true,
      profitAnalysis: true,
      advancedAnalytics: true
    }
  }
};

export const FULFILLMENT_AI_TIERS = {
  starter_pro: {
    id: 'starter_pro',
    name: 'Starter Pro',
    monthlyFee: 3000000, // 3M so'm
    profitShareRate: 0.50, // 50% foydadan
    skuLimit: 100,
    
    features: [
      '1 marketplace',
      '100 SKU',
      'AI Manager FULL (qayta to\'lov yo\'q)',
      'Fulfillment: qabul, saqlash, qadoqlash, markirovka',
      'Marketplace ga yetkazish',
      'Basic analytics',
      'Email support (48h)'
    ],
    
    fulfillment: {
      warehouseKg: 100,
      qualityControl: 'basic',
      packaging: 'standard',
      marketplaceDelivery: true,
      customerDelivery: false // Marketplace delivers to customer
    }
  },
  
  business_standard: {
    id: 'business_standard',
    name: 'Business Standard',
    monthlyFee: 8000000, // 8M so'm
    profitShareRate: 0.25, // 25% foydadan
    skuLimit: 500,
    
    features: [
      '2 marketplace',
      '500 SKU',
      'AI Manager FULL',
      'Advanced fulfillment',
      'Foyda/zarar tahlili',
      'Trend Hunter',
      'Phone support (24h)',
      'Oylik konsultatsiya'
    ],
    
    fulfillment: {
      warehouseKg: 500,
      qualityControl: 'advanced',
      packaging: 'premium',
      marketplaceDelivery: true,
      customerDelivery: false
    }
  },
  
  professional_plus: {
    id: 'professional_plus',
    name: 'Professional Plus',
    monthlyFee: 18000000, // 18M so'm
    profitShareRate: 0.15, // 15% foydadan
    skuLimit: 2000,
    
    features: [
      '4 marketplace',
      '2000 SKU',
      'AI Manager + Custom AI',
      'Premium fulfillment',
      'Dedicated manager',
      '24/7 support (1h)',
      'Haftalik konsultatsiya'
    ],
    
    fulfillment: {
      warehouseKg: 2000,
      qualityControl: 'premium',
      packaging: 'custom',
      marketplaceDelivery: true,
      customerDelivery: false
    }
  },
  
  enterprise_elite: {
    id: 'enterprise_elite',
    name: 'Enterprise Elite',
    monthlyFee: 25000000, // 25M so'm
    profitShareRate: 0.10, // 10% foydadan
    skuLimit: 999999,
    
    features: [
      'Barcha marketplace',
      'Cheksiz SKU',
      'Enterprise AI',
      'VIP fulfillment',
      'Dedicated team',
      '24/7 VIP support (30min)'
    ],
    
    fulfillment: {
      warehouseKg: 999999,
      qualityControl: 'vip',
      packaging: 'white-label',
      marketplaceDelivery: true,
      customerDelivery: false
    }
  }
};

// NOTES:
// - AI xarajatlari barcha tariflarda biz qoplaymiz
// - Fulfillment: marketplace ga yetkazamiz (mijozga emas!)
// - SAAS model: partner o'zi tayyorlaydi va yetkazadi
