// ENHANCED AI DASHBOARD - Cost-Optimized, Real-time
// Hamkor AI usage, cost tracking, optimization recommendations

import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  TrendingUp, 
  DollarSign,
  Zap,
  Image,
  MessageSquare,
  Package,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function EnhancedAIDashboard() {
  const { toast } = useToast();
  const [productForm, setProductForm] = useState({
    productName: '',
    category: 'electronics',
    marketplace: 'uzum',
    features: '',
    price: '',
    brand: '',
    generateImages: false,
  });

  // Fetch dashboard data
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['ai-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/ai/dashboard', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch cost analytics
  const { data: costAnalytics } = useQuery({
    queryKey: ['ai-cost-analytics'],
    queryFn: async () => {
      const res = await fetch('/api/ai/cost-analytics', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch cost analytics');
      return res.json();
    },
  });

  // Create product card mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/ai/create-product-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create product card');
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: '✅ Mahsulot kartochkasi yaratildi',
        description: `Harajat: $${data.productCard.cost.toFixed(4)}`,
      });
      setProductForm({
        productName: '',
        category: 'electronics',
        marketplace: 'uzum',
        features: '',
        price: '',
        brand: '',
        generateImages: false,
      });
    },
    onError: (error: any) => {
      toast({
        title: '❌ Xatolik',
        description: error.message,
        variant: 'destructive',
      });
    },
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

  const stats = dashboard?.stats || {};
  const recommendations = dashboard?.recommendations || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🚀 AI Manager (Optimized)
            </h1>
            <p className="text-muted-foreground mt-2">
              90% arzon • Template-based • Real-time cost tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-4 py-2">
              Tier: {dashboard?.tier?.toUpperCase() || 'STARTER'}
            </Badge>
            {dashboard?.aiEnabled ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">AI Faol</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
                <AlertCircle className="w-4 h-4 text-yellow-700" />
                <span className="text-sm font-medium text-yellow-700">AI O'chiq</span>
              </div>
            )}
          </div>
        </div>

        {/* Cost Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bugun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${(stats.today?.cost || 0).toFixed(4)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.today?.operations || 0} operatsiya
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bu Hafta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${(stats.week?.cost || 0).toFixed(4)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.week?.operations || 0} operatsiya
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bu Oy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${(stats.month?.cost || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.month?.operations || 0} operatsiya
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Qolgan Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${(stats.month?.remainingBudget || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(stats.month?.utilizationPercent || 0).toFixed(0)}% ishlatilgan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Optimization Recommendations */}
        {recommendations.length > 0 && (
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-orange-600" />
                💡 Optimizatsiya Tavsiyalari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.map((rec: string, index: number) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-orange-50 border border-orange-200"
                  >
                    <p className="text-sm font-medium">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Template Stats */}
        {dashboard?.templateStats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Template System Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {dashboard.templateStats.totalTemplates}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Templates mavjud</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${dashboard.templateStats.estimatedSavings.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Tejash (est.)</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    90%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Harajat tejash</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Product Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              🎨 Mahsulot Kartochkasi Yaratish
            </CardTitle>
            <CardDescription>
              AI yoki template yordamida professional mahsulot kartochkasi yarating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Mahsulot nomi</label>
                  <Input
                    value={productForm.productName}
                    onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                    placeholder="Masalan: Smart Watch Pro"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Kategoriya</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home</option>
                    <option value="sports">Sports</option>
                    <option value="beauty">Beauty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Marketplace</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={productForm.marketplace}
                    onChange={(e) => setProductForm({ ...productForm, marketplace: e.target.value })}
                  >
                    <option value="uzum">Uzum</option>
                    <option value="wildberries">Wildberries</option>
                    <option value="yandex">Yandex</option>
                    <option value="ozon">Ozon</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Narx (so'm)</label>
                  <Input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="250000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Brand (optional)</label>
                  <Input
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Samsung"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Xususiyatlar (har bir qatorda)</label>
                <Textarea
                  value={productForm.features}
                  onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                  placeholder="5.5 inch display&#10;Water resistant&#10;Heart rate monitor&#10;30 days battery"
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productForm.generateImages}
                  onChange={(e) => setProductForm({ ...productForm, generateImages: e.target.checked })}
                  id="generateImages"
                />
                <label htmlFor="generateImages" className="text-sm font-medium">
                  Rasm generatsiya qilish (+$0.04)
                </label>
              </div>

              <Button
                onClick={() => {
                  const features = productForm.features.split('\n').filter(f => f.trim());
                  createProductMutation.mutate({
                    ...productForm,
                    features,
                    price: parseFloat(productForm.price),
                  });
                }}
                disabled={createProductMutation.isPending || !productForm.productName || !productForm.price}
                className="w-full"
              >
                {createProductMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Yaratilmoqda...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Mahsulot Kartochkasini Yarat
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
