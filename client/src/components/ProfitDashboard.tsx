import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/currency';
import { useTierAccess, getRequiredTierForFeature } from '@/hooks/useTierAccess';
import { useAuth } from '@/hooks/useAuth';
import { TierUpgradePrompt } from './TierUpgradePrompt';
import { apiRequest } from '@/lib/queryClient';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator,
  PieChart,
  BarChart3,
  Download,
  Calendar,
  Target,
  Lightbulb,
  Star
} from 'lucide-react';

interface ProfitData {
  totalRevenue: string;
  fulfillmentCosts: string;
  marketplaceCommission: string;
  productCosts: string;
  taxCosts: string;
  logisticsCosts: string;
  sptCosts: string;
  netProfit: string;
  profitMargin: string;
  marketplace: string;
  ordersCount: number;
  date: string;
}

export function ProfitDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const tierAccess = useTierAccess();
  const { user } = useAuth();

  const { data: profitData, isLoading } = useQuery<ProfitData[]>({
    queryKey: ['/api/profit-breakdown', selectedPeriod, selectedMarketplace],
    queryFn: async () => {
      const url = `/api/profit-breakdown?period=${selectedPeriod}&marketplace=${selectedMarketplace}`;
      const response = await apiRequest('GET', url);
      return response.json();
    },
    retry: false,
    enabled: !!user && (user.role === 'admin' || tierAccess.hasProfitDashboard),
  });

  // Calculate real profit data based on actual costs including tax, logistics and SPT
  const calculateProfitData = (data: any): ProfitData[] => {
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map((item: any) => {
      const revenue = parseFloat(item.totalRevenue || '0');
      const fulfillment = parseFloat(item.fulfillmentCosts || '0');
      const commission = parseFloat(item.marketplaceCommission || '0');
      const productCost = parseFloat(item.productCosts || '0');
      const taxCosts = parseFloat(item.taxCosts || '0');
      const logisticsCosts = parseFloat(item.logisticsCosts || '0');
      const sptCosts = parseFloat(item.sptCosts || '0');
      
      const totalCosts = fulfillment + commission + productCost + taxCosts + logisticsCosts + sptCosts;
      const netProfit = revenue - totalCosts;
      const margin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(2) : '0';
      
      return {
        ...item,
        taxCosts: taxCosts.toString(),
        logisticsCosts: logisticsCosts.toString(),
        sptCosts: sptCosts.toString(),
        netProfit: netProfit.toString(),
        profitMargin: margin,
      };
    });
  };

  const displayData = calculateProfitData(profitData);
  const todayData = displayData && displayData.length > 0 ? displayData[0] : null;

  const profitTrend = todayData && parseFloat(todayData.profitMargin) > 25 ? 'up' : 'down';

  // Show locked content if user doesn't have access (skip for admins)
  if (!user || (user.role !== 'admin' && !tierAccess.hasProfitDashboard)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Sof Foyda Dashboard</h2>
            <p className="text-muted-foreground">
              Batafsil foyda tahlili va xarajat taqsimoti
            </p>
          </div>
        </div>
        
        <TierUpgradePrompt
          currentTier={tierAccess.tier}
          requiredTier={getRequiredTierForFeature('profit')}
          featureName="Sof Foyda Dashboard"
          description="Batafsil foyda tahlili va xarajat taqsimoti"
          benefits={[
            'Real vaqtda foyda hisob-kitobi',
            'Marketplace bo\'yicha tahlil',
            'Xarajatlar taqsimoti',
            'Optimallashtirish takliflari',
            'Export va hisobot yaratish'
          ]}
        />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ma'lumotlar yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!todayData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Sof Foyda Dashboard</h2>
            <p className="text-slate-600 mt-1">Batafsil foyda tahlili va xarajat taqsimoti</p>
          </div>
        </div>
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PieChart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Hali ma'lumotlar yo'q</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Foyda ma'lumotlarini ko'rish uchun, avval buyurtmalar va xarajatlar haqida ma'lumotlarni kiriting.
              Tizim avtomatik ravishda foyda hisobini amalga oshiradi.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Sof Foyda Dashboard</h2>
          <p className="text-slate-600 mt-1">Batafsil foyda tahlili va xarajat taqsimoti</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="7days">So'nggi 7 kun</option>
            <option value="30days">So'nggi 30 kun</option>
            <option value="90days">So'nggi 3 oy</option>
            <option value="1year">So'nggi yil</option>
          </select>
          <select 
            value={selectedMarketplace}
            onChange={(e) => setSelectedMarketplace(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="all">Barcha marketplace</option>
            <option value="uzum">Uzum Market</option>
            <option value="wildberries">Wildberries</option>
            <option value="yandex">Yandex Market</option>
          </select>
          <Button variant="outline" data-testid="button-export-profit">
            <Download className="w-4 h-4 mr-2" />
            Hisobot yuklab olish
          </Button>
        </div>
      </div>

      {/* Main Profit Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Profit */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Sof Foyda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-2">
              {formatCurrency(parseFloat(todayData.netProfit))}
            </div>
            <div className="flex items-center gap-1">
              {profitTrend === 'up' ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Yaxshi natija</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Yaxshilash kerak</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profit Margin */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Foyda Darajasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {todayData.profitMargin}%
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{width: `${Math.min(parseFloat(todayData.profitMargin), 100)}%`}}
              ></div>
            </div>
            <p className="text-xs text-blue-600 mt-1">Maqsad: 30%</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Umumiy Savdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-2">
              {formatCurrency(parseFloat(todayData.totalRevenue))}
            </div>
            <div className="text-sm text-purple-700">
              {todayData.ordersCount} ta buyurtma
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Buyurtmalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-2">
              {todayData.ordersCount}
            </div>
            <div className="text-sm text-orange-700">
              O'rtacha: {formatCurrency(parseFloat(todayData.totalRevenue) / todayData.ordersCount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Xarajatlar Taqsimoti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cost Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Mahsulot tannarxi</span>
                </div>
                <span className="font-bold">{formatCurrency(parseFloat(todayData.productCosts))}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Fulfillment va platform xarajatlari</span>
                </div>
                <span className="font-bold">{formatCurrency(parseFloat(todayData.fulfillmentCosts))}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Marketplace komissiyasi</span>
                </div>
                <span className="font-bold">{formatCurrency(parseFloat(todayData.marketplaceCommission))}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Soliq (3%)</span>
                </div>
                <span className="font-bold">{formatCurrency(parseFloat(todayData.taxCosts))}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Logistika xarajatlari</span>
                </div>
                <span className="font-bold">{formatCurrency(parseFloat(todayData.logisticsCosts))}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">SPT harajatlari</span>
                </div>
                <span className="font-bold">{formatCurrency(parseFloat(todayData.sptCosts))}</span>
              </div>
              
            </div>

            {/* Visual Breakdown */}
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="w-full h-full bg-gradient-conic from-blue-500 via-green-500 via-yellow-500 via-red-500 via-orange-500 via-purple-500 to-blue-500 rounded-full opacity-80"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {todayData.profitMargin}%
                    </div>
                    <div className="text-sm text-slate-600">Foyda</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Growth Suggestions */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            Biznes rivojlantirish takliflari
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tierAccess.tier === 'starter_pro' && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Business Standard'ga o'ting</p>
                    <p className="text-sm text-blue-700">Komissiyani 30% dan 20% gacha pasaytiring va professional fulfillment oling</p>
                  </div>
                </div>
              </div>
            )}
            {tierAccess.tier === 'business_standard' && (
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Professional Plus'ga o'ting</p>
                    <p className="text-sm text-purple-700">Trend Hunter bilan yangi imkoniyatlarni kashf eting va komissiyani 15% gacha pasaytiring</p>
                  </div>
                </div>
              </div>
            )}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-green-800">Savdo lifehacklari</p>
                  <p className="text-sm text-green-700">Seasonal trendlardan foydalaning - qish kiyimlari 40% ko'proq sotiladi</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-amber-800">Portfel kengaytirish</p>
                  <p className="text-sm text-amber-700">3+ marketpleyslarda sotish orqali riskni kamaytiring va daromadni 60% oshiring</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}