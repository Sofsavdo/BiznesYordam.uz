// client/src/pages/PartnerDashboard.tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/Navigation';
import { LoginForm } from '@/components/LoginForm';
import { PartnerStats } from '@/components/PartnerStats';
import { ProductForm } from '@/components/ProductForm';
import { FulfillmentRequestForm } from '@/components/FulfillmentRequestForm';
import { ProfitDashboard } from '@/components/ProfitDashboard';
import { TrendingProducts } from '@/components/TrendingProducts';
import { ChatSystem } from '@/components/ChatSystem';
import { TierSelectionModal } from '@/components/TierSelectionModal';
import { useAuth } from '@/hooks/useAuth';
import { useTierAccess } from '@/hooks/useTierAccess';
import { useLocation } from 'wouter';
import { formatCurrency } from '@/lib/currency';
import { apiRequest } from '@/lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';
import {
  Package, TrendingUp, MessageCircle, Settings, Crown, BarChart3, DollarSign,
  Target, Zap, CheckCircle, Clock, AlertTriangle, User, Building, CreditCard,
  Globe, Truck, Star, ArrowRight, Plus, Eye, Edit, Trash2, Download, Upload, RefreshCw
} from 'lucide-react';

interface Product { id: string; name: string; category: string; description: string; price: string; costPrice: string; sku: string; barcode: string; weight: string; isActive: boolean; createdAt: string; }
interface FulfillmentRequest { id: string; title: string; description: string; status: string; priority: string; estimatedCost: string; actualCost: string; createdAt: string; }
interface Analytics { id: string; date: string; revenue: string; orders: number; profit: string; commissionPaid: string; marketplace: string; category: string; }

export default function PartnerDashboard() {
  const { user, partner, isLoading: authLoading } = useAuth();
  const tierAccess = useTierAccess();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showTierModal, setShowTierModal] = useState(false);

  // YANGI: Auth yuklanayotganda loading ko‘rsatish
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLocation('/login');
    } else if (user.role !== 'partner') {
      setLocation('/'); // yoki boshqa sahifa
    }
  }, [user, authLoading, setLocation]);

  // Agar hali yuklanayotgan bo‘lsa — loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Agar user yo‘q bo‘lsa
  if (!user || user.role !== 'partner') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoginForm />
      </div>
    );
  }

  // Data queries
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/products');
      return response.json();
    },
    enabled: !!user,
  });

  const { data: fulfillmentRequests = [], isLoading: requestsLoading } = useQuery<FulfillmentRequest[]>({
    queryKey: ['/api/fulfillment-requests'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/fulfillment-requests');
      return response.json();
    },
    enabled: !!user,
  });

  const { data: analytics = [], isLoading: analyticsLoading } = useQuery<Analytics[]>({
    queryKey: ['/api/analytics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/analytics');
      return response.json();
    },
    enabled: !!user,
  });

  const stats = {
    totalRevenue: analytics.reduce((sum, item) => sum + parseFloat(item.revenue || '0'), 0),
    totalOrders: analytics.reduce((sum, item) => sum + (item.orders || 0), 0),
    totalProfit: analytics.reduce((sum, item) => sum + parseFloat(item.profit || '0'), 0),
    activeProducts: products.filter(p => p.isActive).length,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Kutilmoqda', variant: 'secondary' as const, icon: Clock },
      approved: { label: 'Tasdiqlangan', variant: 'default' as const, icon: CheckCircle },
      in_progress: { label: 'Jarayonda', variant: 'secondary' as const, icon: RefreshCw },
      completed: { label: 'Yakunlangan', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Bekor qilingan', variant: 'destructive' as const, icon: AlertTriangle }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getTierName = (tier: string) => {
    const tierNames = {
      starter_pro: 'Starter Pro',
      business_standard: 'Business Standard',
      professional_plus: 'Professional Plus',
      enterprise_elite: 'Enterprise Elite'
    };
    return tierNames[tier as keyof typeof tierNames] || tier;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gradient-business">Partner Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Salom, {user.firstName || user.username}! Biznesingizni boshqaring.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Crown className="w-3 h-3 mr-1" />
                  {getTierName(partner?.pricingTier || 'starter_pro')}
                </Badge>
                <Button onClick={() => setShowTierModal(true)} variant="premium" size="sm" className="hover-lift">
                  <Crown className="w-4 h-4 mr-2" />
                  Tarifni Yangilash
                </Button>
              </div>
            </div>
          </div>

          {partner && !partner.isApproved && (
            <Card className="mb-8 border-orange-200 bg-orange-50 animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800">Tasdiqlanish kutilmoqda</h3>
                    <p className="text-orange-700">
                      Sizning hamkorlik arizangiz admin tomonidan ko'rib chiqilmoqda.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-8">
            <PartnerStats stats={stats} />
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview"><BarChart3 className="w-4 h-4 mr-2" />Umumiy</TabsTrigger>
              <TabsTrigger value="products"><Package className="w-4 h-4 mr-2" />Mahsulotlar</TabsTrigger>
              <TabsTrigger value="requests"><Truck className="w-4 h-4 mr-2" />So'rovlar</TabsTrigger>
              <TabsTrigger value="profit"><DollarSign className="w-4 h-4 mr-2" />Foyda</TabsTrigger>
              <TabsTrigger value="trends"><TrendingUp className="w-4 h-4 mr-2" />Trendlar</TabsTrigger>
              <TabsTrigger value="chat"><MessageCircle className="w-4 h-4 mr-2" />Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* ... barcha kontent qoladi ... */}
              <div className="equal-grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><Package className="w-5 h-5" />So'nggi Mahsulotlar</span>
                      <Button onClick={() => setSelectedTab('products')} variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />Barchasini ko'rish
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(parseFloat(p.price))}</p>
                          </div>
                          <Badge variant={p.isActive ? 'default' : 'secondary'}>{p.isActive ? 'Faol' : 'Nofaol'}</Badge>
                        </div>
                      ))}
                      {products.length === 0 && <p className="text-center py-8 text-muted-foreground">Mahsulot yo‘q</p>}
                    </div>
                  </CardContent>
                </Card>
                {/* So'rovlar kartasi ham xuddi shunday */}
              </div>
            </TabsContent>

            {/* Boshqa tablar ham qoladi — ularni o‘chirib qisqartirdim, lekin saqlang */}
            <TabsContent value="products">{/* Mahsulotlar */}</TabsContent>
            <TabsContent value="requests">{/* So'rovlar */}</TabsContent>
            <TabsContent value="profit"><ProfitDashboard /></TabsContent>
            <TabsContent value="trends"><TrendingProducts /></TabsContent>
            <TabsContent value="chat">
              <Card className="h-[600px]">
                <CardHeader><CardTitle><MessageCircle className="w-5 h-5 inline mr-2" />Admin bilan Chat</CardTitle></CardHeader>
                <CardContent className="p-0 h-full">
                  <ChatSystem partnerId={partner?.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <TierSelectionModal
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/partners/me'] });
          setShowTierModal(false);
        }}
        currentTier={partner?.pricingTier || 'starter_pro'}
      />
    </div>
  );
}
