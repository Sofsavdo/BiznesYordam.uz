// Partner AI Dashboard - View-Only, Beautiful, Real-time
// Hamkor faqat kuzatadi, hech narsa qilmaydi

import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Package,
  MessageSquare,
  Search,
  Zap,
  BarChart3,
  Clock,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function PartnerAIDashboard() {
  const [, setLocation] = useLocation();
  // Fetch dashboard data (faqat bir marta)
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['ai-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/ai-dashboard/dashboard', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      return res.json();
    },
    refetchInterval: false, // Orqa fonda avtomatik yangilanish o'chirildi
    staleTime: 5 * 60 * 1000, // 5 daqiqa yangi deb hisoblanadi
  });

  // Fetch recent activity (orqa fonda yangilanadi, lekin page yopilmaydi)
  const { data: activity } = useQuery({
    queryKey: ['ai-activity'],
    queryFn: async () => {
      const res = await fetch('/api/ai-dashboard/activity?limit=10', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch activity');
      return res.json();
    },
    refetchInterval: 30000, // Har 30 sekundda yangilanadi (oldingisi 10 sek edi)
    refetchIntervalInBackground: false, // Background da yangilanmaydi
  });

  // Fetch trends
  const { data: trends } = useQuery({
    queryKey: ['ai-trends'],
    queryFn: async () => {
      const res = await fetch('/api/ai-dashboard/trends', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch trends');
      return res.json();
    },
    refetchInterval: false, // Avtomatik yangilanish o'chirildi
    staleTime: 10 * 60 * 1000, // 10 daqiqa
  });

  // Fetch inventory alerts
  const { data: inventory } = useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: async () => {
      const res = await fetch('/api/ai-dashboard/inventory-alerts', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch inventory');
      return res.json();
    },
    refetchInterval: false, // Avtomatik yangilanish o'chirildi
    staleTime: 5 * 60 * 1000, // 5 daqiqa
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-muted-foreground">AI Dashboard yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Manager Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              AI 24/7 sizning biznesingiz uchun ishlayapti
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">AI Faol</span>
            </div>
            <Button
              onClick={() => setLocation('/partner-dashboard')}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Orqaga
            </Button>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bugun
              </CardTitle>
              <Activity className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard?.today?.tasks || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                AI tasklari bajarildi
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {dashboard?.today?.completed || 0} muvaffaqiyatli
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sharhlar
              </CardTitle>
              <MessageSquare className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard?.today?.reviews || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Avtomatik javob berildi
              </p>
              <div className="mt-2 text-xs text-green-600 font-medium">
                100% professional javoblar
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                SEO
              </CardTitle>
              <Search className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboard?.today?.products || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Mahsulot optimizatsiya qilindi
              </p>
              <div className="mt-2 text-xs text-purple-600 font-medium">
                Reyting oshmoqda ↗️
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Daromad Ta'siri
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(dashboard?.today?.revenue || 0).toLocaleString()} so'm
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                AI orqali qo'shimcha daromad
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Week & Month Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Bu Hafta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Jami tasklar</span>
                <span className="text-2xl font-bold">{dashboard?.week?.tasks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sharhlar</span>
                <span className="text-xl font-semibold text-green-600">
                  {dashboard?.week?.reviews || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Mahsulotlar</span>
                <span className="text-xl font-semibold text-purple-600">
                  {dashboard?.week?.products || 0}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Daromad ta'siri</span>
                  <span className="text-xl font-bold text-orange-600">
                    {(dashboard?.week?.revenue || 0).toLocaleString()} so'm
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Bu Oy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Jami tasklar</span>
                <span className="text-2xl font-bold">{dashboard?.month?.tasks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sharhlar</span>
                <span className="text-xl font-semibold text-green-600">
                  {dashboard?.month?.reviews || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Mahsulotlar</span>
                <span className="text-xl font-semibold text-purple-600">
                  {dashboard?.month?.products || 0}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Daromad ta'siri</span>
                  <span className="text-xl font-bold text-orange-600">
                    {(dashboard?.month?.revenue || 0).toLocaleString()} so'm
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketplace Breakdown */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Marketplace Bo'yicha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboard?.marketplaces?.map((mp: any) => (
                <div
                  key={mp.marketplace}
                  className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold capitalize">{mp.marketplace}</span>
                    {mp.ai_enabled ? (
                      <Badge className="bg-green-500">
                        <Zap className="w-3 h-3 mr-1" />
                        AI Faol
                      </Badge>
                    ) : (
                      <Badge variant="secondary">O'chiq</Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{mp.accounts}</div>
                  <p className="text-xs text-muted-foreground">Akkauntlar</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent AI Activity */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              So'nggi AI Faoliyati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activity?.tasks?.slice(0, 10).map((task: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : task.status === 'failed' ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {task.type === 'review_response' && 'Sharhga javob'}
                        {task.type === 'product_card_creation' && 'Mahsulot kartochkasi'}
                        {task.type === 'seo_optimization' && 'SEO optimizatsiya'}
                        {task.type === 'competitor_analysis' && 'Raqobatchi tahlili'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.marketplace} • {new Date(task.createdAt).toLocaleTimeString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.status === 'completed'
                        ? 'default'
                        : task.status === 'failed'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {task.status === 'completed' && 'Bajarildi'}
                    {task.status === 'failed' && 'Xato'}
                    {task.status === 'processing' && 'Jarayonda'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trend Recommendations */}
        {trends?.recommendations && trends.recommendations.length > 0 && (
          <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                🔥 Trend Tavsiyalar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trends.recommendations.map((rec: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold">{rec.category}</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      +{rec.demandIncrease}%
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                    <div className="text-xs font-medium text-orange-700">
                      Potentsial: {(rec.potentialRevenue / 1000000).toFixed(1)}M so'm/oy
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Alerts */}
        {inventory?.alerts && inventory.alerts.length > 0 && (
          <Card className="hover:shadow-lg transition-shadow border-2 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                ⚠️ Inventar Ogohlantirishlari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventory.alerts.map((alert: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.status === 'critical'
                        ? 'bg-red-50 border-l-red-500'
                        : 'bg-yellow-50 border-l-yellow-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{alert.productName}</span>
                      <Badge
                        variant={alert.status === 'critical' ? 'destructive' : 'default'}
                        className={alert.status === 'warning' ? 'bg-yellow-500' : ''}
                      >
                        {alert.daysRemaining} kun qoldi
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                      <div>
                        <p className="text-muted-foreground">Qoldiq</p>
                        <p className="font-semibold">{alert.currentStock} dona</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Kunlik savdo</p>
                        <p className="font-semibold">{alert.dailySales} dona</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Yetadi</p>
                        <p className="font-semibold">{alert.daysRemaining} kun</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-700 bg-blue-100 p-2 rounded">
                      💡 {alert.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
