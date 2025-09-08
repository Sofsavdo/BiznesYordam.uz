import { useState } from 'react';
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
import { 
  Package, 
  TrendingUp, 
  MessageCircle, 
  Settings,
  Crown,
  BarChart3,
  DollarSign,
  Target,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Building,
  CreditCard,
  Globe,
  Truck,
  Star,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  costPrice: string;
  sku: string;
  barcode: string;
  weight: string;
  isActive: boolean;
  createdAt: string;
}

interface FulfillmentRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  estimatedCost: string;
  actualCost: string;
  createdAt: string;
}

interface Analytics {
  id: string;
  date: string;
  revenue: string;
  orders: number;
  profit: string;
  commissionPaid: string;
  marketplace: string;
  category: string;
}

export default function PartnerDashboard() {
  const { user, partner } = useAuth();
  const tierAccess = useTierAccess();
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showTierModal, setShowTierModal] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoginForm />
      </div>
    );
  }

  // Redirect if not partner
  if (user.role !== 'partner') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Partner hisobi kerak</h2>
            <p className="text-muted-foreground mb-6">
              Bu sahifaga kirish uchun partner hisobi kerak.
            </p>
            <Button onClick={() => setLocation('/partner-registration')} variant="premium">
              Hamkor bo'lish
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Data queries
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: fulfillmentRequests = [], isLoading: requestsLoading } = useQuery<FulfillmentRequest[]>({
    queryKey: ['/api/fulfillment-requests'],
  });

  const { data: analytics = [], isLoading: analyticsLoading } = useQuery<Analytics[]>({
    queryKey: ['/api/analytics'],
  });

  // Calculate stats
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
          {/* Header */}
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
                <Button
                  onClick={() => setShowTierModal(true)}
                  variant="premium"
                  size="sm"
                  className="hover-lift"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Tarifni Yangilash
                </Button>
              </div>
            </div>
          </div>

          {/* Partner Status Alert */}
          {partner && !partner.isApproved && (
            <Card className="mb-8 border-orange-200 bg-orange-50 animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800">Tasdiqlanish kutilmoqda</h3>
                    <p className="text-orange-700">
                      Sizning hamkorlik arizangiz admin tomonidan ko'rib chiqilmoqda. 
                      Tez orada sizga javob beramiz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Overview */}
          <div className="mb-8">
            <PartnerStats stats={stats} />
          </div>

          {/* Main Content */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Umumiy
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Mahsulotlar
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                So'rovlar
              </TabsTrigger>
              <TabsTrigger value="profit" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Foyda
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trendlar
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Products */}
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        So'nggi Mahsulotlar
                      </span>
                      <Button 
                        onClick={() => setSelectedTab('products')}
                        variant="ghost" 
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Barchasini ko'rish
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(parseFloat(product.price || '0'))}
                            </p>
                          </div>
                          <Badge variant={product.isActive ? 'default' : 'secondary'}>
                            {product.isActive ? 'Faol' : 'Nofaol'}
                          </Badge>
                        </div>
                      ))}
                      {products.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>Hozircha mahsulotlar yo'q</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Requests */}
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        So'nggi So'rovlar
                      </span>
                      <Button 
                        onClick={() => setSelectedTab('requests')}
                        variant="ghost" 
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Barchasini ko'rish
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {fulfillmentRequests.slice(0, 5).map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium">{request.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.createdAt).toLocaleDateString('uz-UZ')}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                      ))}
                      {fulfillmentRequests.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Truck className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>Hozircha so'rovlar yo'q</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Tezkor Amallar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ProductForm products={products} />
                    <FulfillmentRequestForm products={products} />
                    <Button 
                      onClick={() => setSelectedTab('profit')}
                      variant="outline" 
                      className="justify-start"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Foyda Tahlili
                    </Button>
                    <Button 
                      onClick={() => setSelectedTab('trends')}
                      variant="outline" 
                      className="justify-start"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Trend Hunter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Mahsulotlar</h2>
                  <p className="text-muted-foreground">Mahsulotlaringizni boshqaring</p>
                </div>
                <ProductForm products={products} />
              </div>

              <div className="grid gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="shadow-elegant hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <Badge variant={product.isActive ? 'default' : 'secondary'}>
                              {product.isActive ? 'Faol' : 'Nofaol'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{product.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Narx:</p>
                              <p className="font-medium">{formatCurrency(parseFloat(product.price || '0'))}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Tannarx:</p>
                              <p className="font-medium">
                                {product.costPrice ? formatCurrency(parseFloat(product.costPrice)) : 'Belgilanmagan'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Kategoriya:</p>
                              <p className="font-medium">{product.category}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">SKU:</p>
                              <p className="font-medium">{product.sku || 'Yo\'q'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {products.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Mahsulotlar yo'q</h3>
                      <p className="text-muted-foreground mb-6">
                        Hozircha mahsulotlar qo'shilmagan. Birinchi mahsulotingizni qo'shing.
                      </p>
                      <ProductForm products={products} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Fulfillment Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Fulfillment So'rovlari</h2>
                  <p className="text-muted-foreground">Mahsulot tayyorlash va fulfillment so'rovlari</p>
                </div>
                <FulfillmentRequestForm products={products} />
              </div>

              <div className="grid gap-6">
                {fulfillmentRequests.map((request) => (
                  <Card key={request.id} className="shadow-elegant hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{request.title}</h3>
                            <Badge className={getPriorityColor(request.priority)}>
                              {request.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{request.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Taxminiy xarajat:</p>
                              <p className="font-medium">
                                {request.estimatedCost ? formatCurrency(parseFloat(request.estimatedCost)) : 'Belgilanmagan'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Haqiqiy xarajat:</p>
                              <p className="font-medium">
                                {request.actualCost ? formatCurrency(parseFloat(request.actualCost)) : 'Hali yo\'q'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Yaratilgan:</p>
                              <p className="font-medium">
                                {new Date(request.createdAt).toLocaleDateString('uz-UZ')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {fulfillmentRequests.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">So'rovlar yo'q</h3>
                      <p className="text-muted-foreground mb-6">
                        Hozircha fulfillment so'rovlari yo'q. Birinchi so'rovingizni yuboring.
                      </p>
                      <FulfillmentRequestForm products={products} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Profit Dashboard Tab */}
            <TabsContent value="profit" className="space-y-6">
              <ProfitDashboard />
            </TabsContent>

            {/* Trending Products Tab */}
            <TabsContent value="trends" className="space-y-6">
              <TrendingProducts />
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Admin bilan Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-full">
                  <ChatSystem partnerId={partner?.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Tier Selection Modal */}
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