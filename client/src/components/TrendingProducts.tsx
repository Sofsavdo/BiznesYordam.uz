import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/currency';
import { useTierAccess, getRequiredTierForFeature } from '@/hooks/useTierAccess';
import { TierUpgradePrompt } from './TierUpgradePrompt';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { 
  TrendingUp, 
  Star, 
  Globe,
  Search,
  DollarSign,
  Target,
  Eye,
  Filter,
  Zap,
  ExternalLink,
  Lightbulb,
  BarChart,
  Heart,
  Plus,
  ShoppingCart,
  MessageCircle
} from 'lucide-react';

interface TrendingProduct {
  id: string;
  productName: string;
  category: string;
  description: string;
  sourceMarket: string;
  sourceUrl: string;
  currentPrice: string;
  estimatedCostPrice: string;
  estimatedSalePrice: string;
  profitPotential: string;
  searchVolume: number;
  trendScore: number;
  competitionLevel: string;
  keywords: string[] | string; // Can be array or JSON string
  images: string[] | string; // Can be array or JSON string
  scannedAt: string;
}

export function TrendingProducts() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [minTrendScore, setMinTrendScore] = useState(70);
  const tierAccess = useTierAccess();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Admin has full access, partners need tier access
  const isAdmin = user?.role === 'admin';
  const hasAccess = isAdmin || tierAccess.hasTrendHunter;
  
  // Use different endpoint for admin vs partner
  const apiUrl = isAdmin 
    ? '/api/admin/trending-products'
    : `/api/trending-products/${selectedCategory}/${selectedMarket}/${minTrendScore}`;

  // Real trending products data from API
  const { data: trendingProducts, isLoading } = useQuery<TrendingProduct[]>({
    queryKey: [apiUrl, selectedCategory, selectedMarket, minTrendScore],
    queryFn: async () => {
      const response = await apiRequest('GET', apiUrl);
      return response.json();
    },
    retry: false,
    enabled: hasAccess && !!user, // Admin or users with tier access
  });

  // Mutations for trending product actions
  // Note: Watchlist feature is not yet implemented in backend
  const addToWatchlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      // TODO: Implement watchlist endpoint in backend
      // For now, just show a toast message
      console.log('Watchlist feature coming soon:', productId);
      return { success: true, message: 'Watchlist funksiyasi tez orada qo\'shiladi' };
    },
    onSuccess: () => {
      // Toast notification will be shown by the calling component
    },
  });

  const createFulfillmentRequestMutation = useMutation({
    mutationFn: async (product: TrendingProduct) => {
      const response = await apiRequest('POST', '/api/fulfillment-requests', {
        productName: product.productName,
        category: product.category,
        description: product.description,
        estimatedCostPrice: product.estimatedCostPrice,
        estimatedSalePrice: product.estimatedSalePrice,
        sourceUrl: product.sourceUrl,
          keywords: (typeof product.keywords === 'string' 
            ? (() => { try { return JSON.parse(product.keywords).join(', '); } catch { return product.keywords; } })()
            : Array.isArray(product.keywords) ? product.keywords.join(', ') : ''),
        priority: 'high',
        requestType: 'trending_product',
        title: `${product.productName} - Fulfillment so'rovi`,
        estimatedCost: product.estimatedCostPrice,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fulfillment-requests'] });
    },
  });

  // New mutation for contacting admin about trending products
  const contactAdminMutation = useMutation({
    mutationFn: async (product: TrendingProduct) => {
      // Use fulfillment request to contact admin about trending product
      const response = await apiRequest('POST', '/api/fulfillment-requests', {
        requestType: 'trending_product_inquiry',
        title: `Trending mahsulot so'rovi: ${product.productName}`,
        description: `Men bu trending mahsulotni optom sotib olishni xohlayman.\n\nMahsulot: ${product.productName}\nHozirgi narx: ${product.currentPrice}\nFoyda potentsiali: ${product.profitPotential}\nManba: ${product.sourceMarket}\n\nIltimos, yordam bering.`,
        priority: 'high',
        estimatedCost: product.estimatedCostPrice,
        metadata: {
          trendingProductId: product.id,
          sourceUrl: product.sourceUrl,
          category: product.category,
          profitPotential: product.profitPotential
        }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fulfillment-requests'] });
      console.log('Admin bilan bog\'landingiz. Tez orada javob beradi.');
    },
  });

  // Real trending products will be loaded from API - no mock data needed

  const displayData = trendingProducts || [];

  const getSourceIcon = (source: string) => {
    switch(source) {
      case 'amazon': return '🛒';
      case 'aliexpress': return '🌟';
      case 'shopify': return '🛍️';
      default: return '🌐';
    }
  };

  const getCompetitionColor = (level: string) => {
    switch(level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  // Show locked content with background data if user doesn't have access (skip for admins)
  if (!isAdmin && !tierAccess.hasTrendHunter) {
    return (
      <div className="relative">
        {/* Background content with mock data */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Trend Hunter</h2>
              <p className="text-muted-foreground">
                Xalqaro bozorlardan eng mashhur mahsulotlarni toping
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="category">Kategoriya</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategoriya tanlang" />
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="market">Bozor</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Bozor tanlang" />
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="min-score">Min. trend ball</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Minimum ball" />
                    </SelectTrigger>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button disabled className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Qidiruv
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mock trending products for locked view */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: '1',
                productName: 'Wireless Bluetooth Earbuds',
                category: 'Electronics',
                description: 'High-quality wireless earbuds with noise cancellation',
                estimatedCostPrice: '15',
                estimatedSalePrice: '45',
                profitPotential: '30',
                trendScore: 85,
                competitionLevel: 'medium'
              },
              {
                id: '2',
                productName: 'Smart Home Security Camera',
                category: 'Electronics', 
                description: 'WiFi enabled security camera with mobile app',
                estimatedCostPrice: '25',
                estimatedSalePrice: '70',
                profitPotential: '45',
                trendScore: 78,
                competitionLevel: 'low'
              },
              {
                id: '3',
                productName: 'LED Strip Lights',
                category: 'Home',
                description: 'RGB LED strips for room decoration',
                estimatedCostPrice: '8',
                estimatedSalePrice: '25',
                profitPotential: '17',
                trendScore: 72,
                competitionLevel: 'high'
              }
            ].slice(0, 6).map((product) => (
              <Card key={product.id} className="overflow-hidden opacity-70">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge 
                        variant={
                          product.trendScore >= 80 ? "default" : 
                          product.trendScore >= 60 ? "secondary" : "outline"
                        }
                      >
                        Trend: {product.trendScore}
                      </Badge>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg leading-tight mb-2">
                        {product.productName}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Xarid narxi:</span>
                        <p className="font-medium">{formatCurrency(parseFloat(product.estimatedCostPrice || '0') * 12700)} so'm</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sotuv narxi:</span>
                        <p className="font-medium">{formatCurrency(parseFloat(product.estimatedSalePrice || '0') * 12700)} so'm</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Foyda:</span>
                        <p className="font-medium text-green-600">{formatCurrency(parseFloat(product.profitPotential || '0') * 12700)} so'm</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Raqobat:</span>
                        <p className="font-medium">{product.competitionLevel}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button disabled size="sm" className="flex-1">
                        <Heart className="mr-2 h-4 w-4" />
                        Kuzatish
                      </Button>
                      <Button disabled size="sm" variant="outline" className="flex-1">
                        <Plus className="mr-2 h-4 w-4" />
                        So'rov
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Overlay with upgrade prompt */}
        <div className="absolute inset-0">
          <TierUpgradePrompt
            currentTier={tierAccess.tier}
            requiredTier={getRequiredTierForFeature('trends')}
            featureName="Trend Hunter"
            description="Global trendlarni kuzatish va yangi imkoniyatlarni aniqlash"
            benefits={[
              'Dunyodagi trending mahsulotlar',
              'Foyda potentsiali tahlili',
              'Raqobat darajasi baholash',
              'Avtomatik fulfillment so\'rov yaratish',
              'Watchlist va kuzatuv tizimi'
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Trend Hunter
          </h2>
          <p className="text-slate-600 mt-1">Xalqaro bozordan daromadli mahsulotlarni aniqlash</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <TrendingUp className="w-3 h-3 mr-1" />
            {displayData.length} ta yangi imkoniyat
          </Badge>
          <Button 
            variant="outline" 
            data-testid="button-refresh-trends"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: [apiUrl] });
            }}
          >
            <Search className="w-4 h-4 mr-2" />
            Yangilash
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtrlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Kategoriya</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="all">Barcha kategoriyalar</option>
                <option value="electronics">Elektronika</option>
                <option value="clothing">Kiyim</option>
                <option value="home">Uy-ro'zg'or</option>
                <option value="beauty">Go'zallik</option>
                <option value="sports">Sport</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Manba bozor</label>
              <select 
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="all">Barcha bozorlar</option>
                <option value="amazon">Amazon</option>
                <option value="aliexpress">AliExpress</option>
                <option value="shopify">Shopify</option>
                <option value="ebay">eBay</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Min trend score</label>
              <select 
                value={minTrendScore}
                onChange={(e) => setMinTrendScore(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="50">50+ (Barcha)</option>
                <option value="70">70+ (Yaxshi)</option>
                <option value="80">80+ (Ajoyib)</option>
                <option value="90">90+ (Top trend)</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Qidirish
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">{displayData.length}</div>
                <div className="text-sm text-blue-700">Aniqlangan imkoniyatlar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(displayData.length > 0 ? displayData.reduce((sum, p) => sum + parseFloat(p.profitPotential || '0'), 0) / displayData.length : 0)}
                </div>
                <div className="text-sm text-green-700">O'rtacha foyda potentsiali</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BarChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  {Math.round(displayData.length > 0 ? displayData.reduce((sum, p) => sum + (p.trendScore || 0), 0) / displayData.length : 0)}
                </div>
                <div className="text-sm text-purple-700">O'rtacha trend score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-900">
                  {Math.round(displayData.length > 0 ? displayData.reduce((sum, p) => sum + (p.searchVolume || 0), 0) / displayData.length / 1000 : 0)}K
                </div>
                <div className="text-sm text-orange-700">O'rtacha qidiruv hajmi</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayData.map((product) => (
          <Card key={product.id} className="relative hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-400">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.productName}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getSourceIcon(product.sourceMarket)}</span>
                    <span className="text-sm text-slate-600 capitalize">{product.sourceMarket}</span>
                    <Badge variant="outline" className={getCompetitionColor(product.competitionLevel)}>
                      {product.competitionLevel === 'low' && 'Past raqobat'}
                      {product.competitionLevel === 'medium' && 'O\'rta raqobat'}
                      {product.competitionLevel === 'high' && 'Yuqori raqobat'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl font-bold ${getTrendScoreColor(product.trendScore)}`}>
                      {product.trendScore || 0}
                    </div>
                    <div className="text-sm text-slate-600">
                      <div>{(product.searchVolume || 0).toLocaleString()} qidiruv/oy</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
              
              {/* Financial Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-slate-600">Hozirgi narx</div>
                  <div className="font-semibold">{formatCurrency(parseFloat(product.currentPrice || '0') * 12700)} so'm</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xs text-green-600">Foyda potentsiali</div>
                  <div className="font-semibold text-green-800">{formatCurrency(parseFloat(product.profitPotential || '0') * 12700)} so'm</div>
                </div>
              </div>
              
              {/* Keywords */}
              <div>
                <div className="text-xs text-slate-600 mb-1">Kalit so'zlar:</div>
                <div className="flex flex-wrap gap-1">
                  {(() => {
                    try {
                      const keywords = typeof product.keywords === 'string' 
                        ? JSON.parse(product.keywords) 
                        : (Array.isArray(product.keywords) ? product.keywords : []);
                      return keywords.slice(0, 3).map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      )).concat(
                        keywords.length > 3 ? (
                          <Badge key="more" variant="secondary" className="text-xs">
                            +{keywords.length - 3}
                          </Badge>
                        ) : []
                      );
                    } catch {
                      return <Badge variant="secondary" className="text-xs">Kalit so'zlar yo'q</Badge>;
                    }
                  })()}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(product.sourceUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Ko'rish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToWatchlistMutation.mutate(product.id)}
                    disabled={addToWatchlistMutation.isPending}
                    className="absolute top-3 right-3 p-2 w-10 h-10 rounded-full bg-white shadow-md hover:bg-red-50"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => createFulfillmentRequestMutation.mutate(product)}
                  disabled={createFulfillmentRequestMutation.isPending}
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Fulfillment
                </Button>
                {!isAdmin && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => contactAdminMutation.mutate(product)}
                    disabled={contactAdminMutation.isPending}
                    className="bg-orange-600 hover:bg-orange-700 flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayData.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Hech narsa topilmadi</h3>
            <p className="text-slate-600">Filtrlarni o'zgartirib, yana urinib ko'ring.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}