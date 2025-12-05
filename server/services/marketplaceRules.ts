// Marketplace Rules - Har bir marketplace'ning qoidalari
// AI bu qoidalar asosida ishlaydi

export interface MarketplaceRules {
  name: string;
  productCard: {
    title: { maxLength: number; required: boolean };
    description: { maxLength: number; required: boolean };
    images: {
      minWidth: number;
      minHeight: number;
      maxSize: number; // KB
      format: string[];
      background: string;
      count: { min: number; max: number };
    };
    price: { required: boolean; minPrice: number };
    category: { required: boolean };
    attributes: { required: boolean };
    barcode: { required: boolean };
  };
  reviews: {
    responseMaxLength: number;
    responseTimeLimit: number; // hours
    allowEmoji: boolean;
    autoResponseAllowed: boolean;
  };
  seo: {
    keywordsMax: number;
    titleOptimal: number;
    descriptionOptimal: number;
  };
  advertising: {
    types: string[];
    minBudget: number;
    maxBudget: number;
  };
}

// UZUM MARKET
export const UZUM_RULES: MarketplaceRules = {
  name: 'Uzum Market',
  productCard: {
    title: {
      maxLength: 100,
      required: true,
    },
    description: {
      maxLength: 2000,
      required: true,
    },
    images: {
      minWidth: 1000,
      minHeight: 1000,
      maxSize: 5000, // 5MB
      format: ['JPG', 'PNG', 'WEBP'],
      background: 'white', // oq fon majburiy
      count: { min: 3, max: 10 },
    },
    price: {
      required: true,
      minPrice: 1000, // minimal 1000 so'm
    },
    category: {
      required: true,
    },
    attributes: {
      required: true, // har bir kategoriya uchun majburiy atributlar
    },
    barcode: {
      required: false,
    },
  },
  reviews: {
    responseMaxLength: 500,
    responseTimeLimit: 24, // 24 soat ichida javob berish tavsiya etiladi
    allowEmoji: false,
    autoResponseAllowed: true,
  },
  seo: {
    keywordsMax: 15,
    titleOptimal: 80,
    descriptionOptimal: 1500,
  },
  advertising: {
    types: ['search', 'catalog', 'banner'],
    minBudget: 100000, // 100k so'm
    maxBudget: 10000000, // 10M so'm
  },
};

// WILDBERRIES
export const WILDBERRIES_RULES: MarketplaceRules = {
  name: 'Wildberries',
  productCard: {
    title: {
      maxLength: 60,
      required: true,
    },
    description: {
      maxLength: 1000,
      required: true,
    },
    images: {
      minWidth: 900,
      minHeight: 1200,
      maxSize: 10000, // 10MB
      format: ['JPG', 'PNG'],
      background: 'white',
      count: { min: 4, max: 15 },
    },
    price: {
      required: true,
      minPrice: 100,
    },
    category: {
      required: true,
    },
    attributes: {
      required: true,
    },
    barcode: {
      required: true, // WB'da barkod majburiy!
    },
  },
  reviews: {
    responseMaxLength: 1000,
    responseTimeLimit: 48,
    allowEmoji: true,
    autoResponseAllowed: true,
  },
  seo: {
    keywordsMax: 20,
    titleOptimal: 50,
    descriptionOptimal: 800,
  },
  advertising: {
    types: ['automatic', 'search', 'catalog', 'carousel'],
    minBudget: 50000,
    maxBudget: 5000000,
  },
};

// YANDEX MARKET
export const YANDEX_RULES: MarketplaceRules = {
  name: 'Yandex Market',
  productCard: {
    title: {
      maxLength: 150,
      required: true,
    },
    description: {
      maxLength: 3000,
      required: true,
    },
    images: {
      minWidth: 600,
      minHeight: 600,
      maxSize: 8000,
      format: ['JPG', 'PNG', 'WEBP'],
      background: 'any', // har qanday fon
      count: { min: 2, max: 10 },
    },
    price: {
      required: true,
      minPrice: 1,
    },
    category: {
      required: true,
    },
    attributes: {
      required: true,
    },
    barcode: {
      required: false,
    },
  },
  reviews: {
    responseMaxLength: 2000,
    responseTimeLimit: 72,
    allowEmoji: false,
    autoResponseAllowed: true,
  },
  seo: {
    keywordsMax: 25,
    titleOptimal: 120,
    descriptionOptimal: 2500,
  },
  advertising: {
    types: ['direct', 'market_ads', 'display'],
    minBudget: 200000,
    maxBudget: 20000000,
  },
};

// OZON
export const OZON_RULES: MarketplaceRules = {
  name: 'Ozon',
  productCard: {
    title: {
      maxLength: 500,
      required: true,
    },
    description: {
      maxLength: 4000,
      required: true,
    },
    images: {
      minWidth: 1200,
      minHeight: 1200,
      maxSize: 10000,
      format: ['JPG', 'PNG'],
      background: 'white',
      count: { min: 3, max: 15 },
    },
    price: {
      required: true,
      minPrice: 1,
    },
    category: {
      required: true,
    },
    attributes: {
      required: true,
    },
    barcode: {
      required: true,
    },
  },
  reviews: {
    responseMaxLength: 1500,
    responseTimeLimit: 48,
    allowEmoji: true,
    autoResponseAllowed: true,
  },
  seo: {
    keywordsMax: 30,
    titleOptimal: 200,
    descriptionOptimal: 3500,
  },
  advertising: {
    types: ['premium', 'search', 'boost', 'banner'],
    minBudget: 100000,
    maxBudget: 15000000,
  },
};

// Get rules by marketplace
export function getMarketplaceRules(marketplace: string): MarketplaceRules {
  switch (marketplace.toLowerCase()) {
    case 'uzum':
      return UZUM_RULES;
    case 'wildberries':
    case 'wb':
      return WILDBERRIES_RULES;
    case 'yandex':
      return YANDEX_RULES;
    case 'ozon':
      return OZON_RULES;
    default:
      throw new Error(`Unknown marketplace: ${marketplace}`);
  }
}

// Validate product card against rules
export function validateProductCard(
  productCard: any,
  marketplace: string
): { valid: boolean; errors: string[] } {
  const rules = getMarketplaceRules(marketplace);
  const errors: string[] = [];

  // Title validation
  if (rules.productCard.title.required && !productCard.title) {
    errors.push('Title is required');
  }
  if (productCard.title && productCard.title.length > rules.productCard.title.maxLength) {
    errors.push(`Title too long (max ${rules.productCard.title.maxLength} characters)`);
  }

  // Description validation
  if (rules.productCard.description.required && !productCard.description) {
    errors.push('Description is required');
  }
  if (productCard.description && productCard.description.length > rules.productCard.description.maxLength) {
    errors.push(`Description too long (max ${rules.productCard.description.maxLength} characters)`);
  }

  // Price validation
  if (rules.productCard.price.required && !productCard.price) {
    errors.push('Price is required');
  }
  if (productCard.price && productCard.price < rules.productCard.price.minPrice) {
    errors.push(`Price too low (min ${rules.productCard.price.minPrice})`);
  }

  // Barcode validation
  if (rules.productCard.barcode.required && !productCard.barcode) {
    errors.push('Barcode is required for this marketplace');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Generate marketplace-specific product card
export async function generateMarketplaceCard(
  baseProduct: {
    name: string;
    description: string;
    price: number;
    category: string;
    features: string[];
  },
  marketplace: string
): Promise<any> {
  const rules = getMarketplaceRules(marketplace);
  
  // AI will generate optimized card based on rules
  // This is a placeholder - actual implementation uses AI
  
  return {
    marketplace,
    title: baseProduct.name.substring(0, rules.productCard.title.maxLength),
    description: baseProduct.description.substring(0, rules.productCard.description.maxLength),
    price: baseProduct.price,
    category: baseProduct.category,
    optimizedForRules: true,
  };
}
