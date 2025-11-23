// client/src/components/TrendingProductsDashboard.tsx
// ADVANCED TRENDING PRODUCTS DASHBOARD

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp, TrendingDown, DollarSign, Search, Package,
  AlertTriangle, CheckCircle, BarChart3, Globe, Zap, Target,
  RefreshCw, Filter, ArrowRight, ExternalLink, Star
} from 'lucide-react';

interface TrendingProduct {
  id: string;
  product_name: string;
  category: string;
  description?: string;
  source_market: string;
  source_url?: string;
  current_price: string;
  estimated_cost_price: string;
  estimated_sale_price: string;
  profit_potential: string;
  search_volume: number;
  trend_score: number;
  competition_level: string;
  keywords: string;
  images: string;
  scanned_at: string;
}

export function TrendingProductsDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    category: 'all',
    market: 'all',
    minScore: '70',
  });

  // Fetch trending products
  const { data: products = [], isLoading } = useQuery<TrendingProduct[]>({
    queryKey: ['trending-products', filters],
    queryFn: async () => {
      const response = await fetch(
        `/api/trending-products/${filters.category}/${filters.market}/${filters.minScore}`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('TIER_REQUIRED');
        }
        throw new Error('Failed to fetch');
      }
      return response.json();
    },
    retry: false,
  });

  // Scan for new trends
  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/trending/scan', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceMarkets: ['amazon_us', 'aliexpress'],
          categories: ['electronics'],
          minTrendScore: 70,
        }),
      });
      if (!response.ok) throw new Error('Scan failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trending-products'] });
      toast({ title: '✅ Yangi trendlar topildi!' });
    },
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(parseFloat(price));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            Trending Mahsulotlar
          </h1>
          <p className="text-muted-foreground mt-1">
            🌍 Xalqaro bozorlardan eng yaxshi imkoniyatlarni toping
          </p>
        </div>
        <Button
          onClick={() => scanMutation.mutate()}
          disabled={scanMutation.isPending}
          className="bg-gradient-to-r from-green-600 to-blue-600"
        >
          {scanMutation.isPending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Qidirilmoqda...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Yangi Trendlarni Qidirish
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami Trendlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Faol mahsulotlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              O'rtacha Trend Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.length > 0
                ? Math.round(products.reduce((sum, p) => sum + p.trend_score, 0) / products.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">100 dan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yuqori Foyda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter((p) => parseInt(p.profit_potential) > 500000).length}
            </div>
            <p className="text-xs text-muted-foreground">500K+ foyda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Past Raqobat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {products.filter((p) => p.competition_level === 'low').length}
            </div>
            <p className="text-xs text-muted-foreground">Osongina kirish mumkin</p>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Kategoriya</label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Hammasi</SelectItem>
                  <SelectItem value="electronics">Elektronika</SelectItem>
                  <SelectItem value="fashion">Kiyim</SelectItem>
                  <SelectItem value="home">Uy-ro'zg'or</SelectItem>
                  <SelectItem value="beauty">Go'zallik</SelectItem>
                  <SelectItem value="sports">Sport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bozor</label>
              <Select
                value={filters.market}
                onValueChange={(value) => setFilters({ ...filters, market: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Hammasi</SelectItem>
                  <SelectItem value="amazon">🇺🇸 Amazon USA</SelectItem>
                  <SelectItem value="aliexpress">🇨🇳 AliExpress</SelectItem>
                  <SelectItem value="ebay">🌐 eBay</SelectItem>
                  <SelectItem value="shopify">🛍️ Shopify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Min Trend Score</label>
              <Select
                value={filters.minScore}
                onValueChange={(value) => setFilters({ ...filters, minScore: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50+</SelectItem>
                  <SelectItem value="60">60+</SelectItem>
                  <SelectItem value="70">70+</SelectItem>
                  <SelectItem value="80">80+ (Eng yaxshi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const profitMargin = (
            (parseFloat(product.profit_potential) / parseFloat(product.estimated_sale_price)) *
            100
          ).toFixed(1);

          return (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {product.product_name}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      {product.source_market}
                    </CardDescription>
                  </div>
                  <Badge className={`${getScoreColor(product.trend_score)} font-bold`}>
                    {product.trend_score}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Search Volume */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Search className="w-4 h-4" />
                    Qidiruv:
                  </span>
                  <span className="font-semibold">
                    {formatNumber(product.search_volume)}/oy
                  </span>
                </div>

                {/* Competition */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    Raqobat:
                  </span>
                  <Badge className={getRiskColor(product.competition_level)}>
                    {product.competition_level === 'low' && 'Past'}
                    {product.competition_level === 'medium' && 'O\'rtacha'}
                    {product.competition_level === 'high' && 'Yuqori'}
                  </Badge>
                </div>

                {/* Prices */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tannarx:</span>
                    <span className="font-medium">
                      {formatPrice(product.estimated_cost_price)} so'm
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sotuv narxi:</span>
                    <span className="font-semibold text-blue-600">
                      {formatPrice(product.estimated_sale_price)} so'm
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Foyda:</span>
                    <span className="font-bold text-green-600">
                      {formatPrice(product.profit_potential)} so'm ({profitMargin}%)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(product.source_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Ko'rish
                  </Button>
                  <Button size="sm" className="flex-1 bg-green-600">
                    <Star className="w-4 h-4 mr-1" />
                    Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Hech qanday trend topilmadi</h3>
            <p className="text-muted-foreground mb-4">
              Filtrlarni o'zgartiring yoki yangi trendlarni qidiring
            </p>
            <Button onClick={() => scanMutation.mutate()}>
              <Search className="w-4 h-4 mr-2" />
              Qidirishni Boshlash
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
