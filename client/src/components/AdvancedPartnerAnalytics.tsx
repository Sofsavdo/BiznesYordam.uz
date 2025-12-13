// ADVANCED PARTNER ANALYTICS - Admin Panel
// Detailed breakdown of profit sources per partner

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  Users,
  Brain,
  ShoppingCart,
  BarChart3,
  Target,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle,
  Zap,
  Globe,
  Package
} from 'lucide-react';

interface Partner {
  id: string;
  businessName: string;
  pricingTier: string;
  monthlyRevenue: number;
  monthlyFee: number;
  profitShareRate: number;
}

// Mock data - in production, fetch from API
const generatePartnerData = () => {
  const partners: Partner[] = [
    {
      id: '1',
      businessName: 'Texno Savdo',
      pricingTier: 'business_standard',
      monthlyRevenue: 85000000,
      monthlyFee: 8000000,
      profitShareRate: 0.25
    },
    {
      id: '2',
      businessName: 'Fashion Hub',
      pricingTier: 'professional_plus',
      monthlyRevenue: 150000000,
      monthlyFee: 18000000,
      profitShareRate: 0.15
    },
    {
      id: '3',
      businessName: 'Kiyim Bozori',
      pricingTier: 'starter_pro',
      monthlyRevenue: 25000000,
      monthlyFee: 3000000,
      profitShareRate: 0.50
    },
    {
      id: '4',
      businessName: 'Smart Electronics',
      pricingTier: 'enterprise_elite',
      monthlyRevenue: 450000000,
      monthlyFee: 25000000,
      profitShareRate: 0.10
    },
    {
      id: '5',
      businessName: 'Uy-Ro\'zg\'or',
      pricingTier: 'business_standard',
      monthlyRevenue: 95000000,
      monthlyFee: 8000000,
      profitShareRate: 0.25
    }
  ];

  return partners.map(partner => {
    // Calculate profit components
    const netProfit = partner.monthlyRevenue * 0.20; // 20% net profit margin
    const profitShareAmount = netProfit * partner.profitShareRate;
    const totalProfit = partner.monthlyFee + profitShareAmount;

    // AI Usage (mock data based on tier)
    const aiUsage = {
      seoOptimization: Math.floor(Math.random() * 50) + 20,
      contentGeneration: Math.floor(Math.random() * 100) + 50,
      imageOptimization: Math.floor(Math.random() * 150) + 100,
      marketAnalysis: Math.floor(Math.random() * 30) + 10,
      priceOptimization: Math.floor(Math.random() * 40) + 20
    };

    const aiCost = 
      aiUsage.seoOptimization * 50000 +
      aiUsage.contentGeneration * 20000 +
      aiUsage.imageOptimization * 10000 +
      aiUsage.marketAnalysis * 100000 +
      aiUsage.priceOptimization * 30000;

    const aiProfit = aiCost * 0.30; // 30% profit margin on AI services

    // Marketplace breakdown
    const marketplaces = {
      uzum: {
        revenue: partner.monthlyRevenue * 0.45,
        orders: Math.floor(Math.random() * 500) + 200
      },
      wildberries: {
        revenue: partner.monthlyRevenue * 0.30,
        orders: Math.floor(Math.random() * 400) + 150
      },
      yandex: {
        revenue: partner.monthlyRevenue * 0.15,
        orders: Math.floor(Math.random() * 200) + 50
      },
      ozon: {
        revenue: partner.monthlyRevenue * 0.10,
        orders: Math.floor(Math.random() * 150) + 30
      }
    };

    return {
      ...partner,
      netProfit,
      profitShareAmount,
      totalProfit,
      aiUsage,
      aiCost,
      aiProfit,
      marketplaces,
      profitBreakdown: {
        monthlyFee: partner.monthlyFee,
        profitShare: profitShareAmount,
        aiServices: aiProfit
      }
    };
  });
};

export function AdvancedPartnerAnalytics() {
  const { data: partnersData = [], isLoading } = useQuery({
    queryKey: ['admin-partner-analytics'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/admin/partner-analytics', { credentials: 'include' });
        if (!res.ok) {
          // Fallback to generated data if API not ready
          return generatePartnerData();
        }
        return res.json();
      } catch (error) {
        console.error('Partner analytics fetch error:', error);
        return generatePartnerData();
      }
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (partnersData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Hozircha hamkor ma'lumotlari yo'q</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const totals = partnersData.reduce((acc, partner) => ({
    totalRevenue: acc.totalRevenue + partner.monthlyRevenue,
    totalProfit: acc.totalProfit + partner.totalProfit,
    totalMonthlyFees: acc.totalMonthlyFees + partner.monthlyFee,
    totalProfitShare: acc.totalProfitShare + partner.profitShareAmount,
    totalAICost: acc.totalAICost + partner.aiCost,
    totalAIProfit: acc.totalAIProfit + partner.aiProfit
  }), {
    totalRevenue: 0,
    totalProfit: 0,
    totalMonthlyFees: 0,
    totalProfitShare: 0,
    totalAICost: 0,
    totalAIProfit: 0
  });

  // Sort partners by profit
  const topPartners = [...partnersData].sort((a, b) => b.totalProfit - a.totalProfit);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8" />
              <Badge className="bg-white/20">Jami</Badge>
            </div>
            <div className="text-3xl font-bold">
              {(totals.totalProfit / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm opacity-90">Jami Foyda (oylik)</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-8 w-8" />
              <Badge className="bg-white/20">Abonent</Badge>
            </div>
            <div className="text-3xl font-bold">
              {(totals.totalMonthlyFees / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm opacity-90">Oylik to'lovlar</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8" />
              <Badge className="bg-white/20">Profit Share</Badge>
            </div>
            <div className="text-3xl font-bold">
              {(totals.totalProfitShare / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm opacity-90">Foyda ulushi</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Brain className="h-8 w-8" />
              <Badge className="bg-white/20">AI</Badge>
            </div>
            <div className="text-3xl font-bold">
              {(totals.totalAIProfit / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm opacity-90">AI foydasi</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Partner Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Hamkorlar bo'yicha Foyda Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Barcha Hamkorlar</TabsTrigger>
              <TabsTrigger value="top">Top 3</TabsTrigger>
              <TabsTrigger value="marketplaces">Marketplace</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {partnersData.map((partner) => (
                <Card key={partner.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{partner.businessName}</h3>
                        <Badge variant="outline">{partner.pricingTier}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {(partner.totalProfit / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-sm text-slate-600">Jami foyda</div>
                      </div>
                    </div>

                    {/* Profit Breakdown */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-semibold">Oylik to'lov</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {(partner.monthlyFee / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-slate-600">
                          {((partner.monthlyFee / partner.totalProfit) * 100).toFixed(0)}% jami foydadan
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-semibold">Profit Share</span>
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                          {(partner.profitShareAmount / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-slate-600">
                          {(partner.profitShareRate * 100)}% dan {(partner.netProfit / 1000000).toFixed(1)}M foyda
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-semibold">AI Foydasi</span>
                        </div>
                        <div className="text-xl font-bold text-orange-600">
                          {(partner.aiProfit / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-slate-600">
                          AI harajat: {(partner.aiCost / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>

                    {/* Marketplace Breakdown */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Marketplace bo'yicha
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(partner.marketplaces).map(([name, data]) => (
                          <div key={name} className="text-center">
                            <div className="text-sm font-semibold capitalize mb-1">{name}</div>
                            <div className="font-bold text-slate-900">
                              {(data.revenue / 1000000).toFixed(1)}M
                            </div>
                            <div className="text-xs text-slate-600">{data.orders} buyurtma</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Usage Details */}
                    <div className="mt-4 bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        AI Foydalanish
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-slate-600">SEO</div>
                          <div className="font-semibold">{partner.aiUsage.seoOptimization}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Kontent</div>
                          <div className="font-semibold">{partner.aiUsage.contentGeneration}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Rasm</div>
                          <div className="font-semibold">{partner.aiUsage.imageOptimization}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Tahlil</div>
                          <div className="font-semibold">{partner.aiUsage.marketAnalysis}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Narx</div>
                          <div className="font-semibold">{partner.aiUsage.priceOptimization}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="top" className="space-y-4 mt-6">
              {topPartners.slice(0, 3).map((partner, index) => (
                <Card key={partner.id} className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl font-bold text-yellow-600">#{index + 1}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{partner.businessName}</h3>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-green-600">
                            {(partner.totalProfit / 1000000).toFixed(1)}M foyda
                          </Badge>
                          <Badge variant="outline">{partner.pricingTier}</Badge>
                        </div>
                      </div>
                      <Award className="h-12 w-12 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="marketplaces" className="mt-6">
              {/* Marketplace comparison across all partners */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['uzum', 'wildberries', 'yandex', 'ozon'].map(marketplace => {
                  const totalRevenue = partnersData.reduce((sum, p) => 
                    sum + (p.marketplaces[marketplace as keyof typeof p.marketplaces]?.revenue || 0), 0
                  );
                  const totalOrders = partnersData.reduce((sum, p) => 
                    sum + (p.marketplaces[marketplace as keyof typeof p.marketplaces]?.orders || 0), 0
                  );

                  return (
                    <Card key={marketplace} className="bg-gradient-to-br from-blue-50 to-cyan-50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Globe className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                          <h3 className="text-lg font-bold capitalize mb-2">{marketplace}</h3>
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {(totalRevenue / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-slate-600">{totalOrders} buyurtma</div>
                          <div className="mt-2 text-xs text-slate-500">
                            {((totalRevenue / totals.totalRevenue) * 100).toFixed(0)}% jami aylanmadan
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
