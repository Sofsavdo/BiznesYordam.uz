// client/src/pages/AdminPanel.tsx
import { useState, useEffect, Suspense, lazy } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Navigation } from '@/components/Navigation';
import { LoginForm } from '@/components/LoginForm';
import { TrendingProducts } from '@/components/TrendingProducts';
import { MarketplaceApiConfig } from '@/components/MarketplaceApiConfig';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';
import {
  Users,
  Package,
  TrendingUp,
  MessageCircle,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Crown,
  Shield,
  BarChart3,
  DollarSign,
  Target,
  Zap,
  Globe,
  Database,
  FileText,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

// CHAT faqat "Chat" tabida yuklansin
const ChatSystem = lazy(() => import('@/components/ChatSystem'));

interface Partner {
  id: string;
  userId: string;
  businessName: string;
  businessCategory: string;
  monthlyRevenue: string;
  pricingTier: string;
  commissionRate: string;
  isApproved: boolean;
  approvedAt: string | null;
  approvedBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  userData?: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    isActive: boolean;
  };
}

interface FulfillmentRequest {
  id: string;
  partnerId: string;
  productId: string | null;
  requestType: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  estimatedCost: string | null;
  actualCost: string | null;
  assignedTo: string | null;
  dueDate: string | null;
  completedAt: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface TierUpgradeRequest {
  id: string;
  partnerId: string;
  currentTier: string;
  requestedTier: string;
  reason: string | null;
  status: string;
  requestedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  adminNotes: string | null;
}

export default function AdminPanel() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Auth tekshiruvi + redirect
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLocation('/login');
    } else if (user.role !== 'admin') {
      setLocation('/');
    }
  }, [user, authLoading, setLocation]);

  // Loading holati
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-xl font-medium">Admin panel yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Ruxsat yo‘q
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ruxsat yo'q</h2>
            <p className="text-muted-foreground mb-6">
              Bu sahifaga kirish uchun admin huquqi kerak.
            </p>
            <Button onClick={() => setLocation('/')} variant="outline">
              Bosh sahifaga qaytish
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Data queries
  const { data: partners = [], isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ['/api/admin/partners'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/partners');
      return response.json();
    },
    enabled: !!user && user.role === 'admin',
  });

  const { data: fulfillmentRequests = [], isLoading: requestsLoading } = useQuery<FulfillmentRequest[]>({
    queryKey: ['/api/fulfillment-requests'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/fulfillment-requests');
      return response.json();
    },
    enabled: !!user && user.role === 'admin',
  });

  const { data: tierUpgradeRequests = [], isLoading: tierRequestsLoading } = useQuery<TierUpgradeRequest[]>({
    queryKey: ['/api/admin/tier-upgrade-requests'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/tier-upgrade-requests');
      return response.json();
    },
    enabled: !!user && user.role === 'admin',
  });

  // Mutations
  const approvePartnerMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const response = await apiRequest('PUT', `/api/admin/partners/${partnerId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Hamkor tasdiqlandi",
        description: "Hamkor muvaffaqiyatli tasdiqlandi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/partners'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFulfillmentRequestMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await apiRequest('PUT', `/api/fulfillment-requests/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "So'rov yangilandi",
        description: "Fulfillment so'rovi muvaffaqiyatli yangilandi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/fulfillment-requests'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTierRequestMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) => {
      const response = await apiRequest('PUT', `/api/admin/tier-upgrade-requests/${id}`, {
        status,
        adminNotes
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tarif so'rovi yangilandi",
        description: "Tarif yangilash so'rovi ko'rib chiqildi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tier-upgrade-requests'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Kutilmoqda', variant: 'secondary' as const, icon: Clock },
      approved: { label: 'Tasdiqlangan', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rad etilgan', variant: 'destructive' as const, icon: XCircle },
      completed: { label: 'Yakunlangan', variant: 'default' as const, icon: CheckCircle },
      in_progress: { label: 'Jarayonda', variant: 'secondary' as const, icon: RefreshCw }
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

  const getTierName = (tier: string) => {
    const tierNames = {
      starter_pro: 'Starter Pro',
      business_standard: 'Business Standard',
      professional_plus: 'Professional Plus',
      enterprise_elite: 'Enterprise Elite'
    };
    return tierNames[tier as keyof typeof tierNames] || tier;
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

  // Filter data
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = !searchTerm ||
      partner.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.userData?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.userData?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
   
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'approved' && partner.isApproved) ||
      (filterStatus === 'pending' && !partner.isApproved);
   
    return matchesSearch && matchesStatus;
  });

  const filteredRequests = fulfillmentRequests.filter(request => {
    const matchesSearch = !searchTerm ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
   
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
   
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    totalPartners: partners.length,
    approvedPartners: partners.filter(p => p.isApproved).length,
    pendingPartners: partners.filter(p => !p.isApproved).length,
    totalRequests: fulfillmentRequests.length,
    pendingRequests: fulfillmentRequests.filter(r => r.status === 'pending').length,
    completedRequests: fulfillmentRequests.filter(r => r.status === 'completed').length,
    tierUpgradeRequests: tierUpgradeRequests.filter(r => r.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
     
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gradient-business">Admin Panel</h1>
                <p className="text-muted-foreground mt-2">
                  Platform boshqaruvi va hamkorlar nazorati
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
                <Badge variant="secondary">
                  {user.firstName} {user.lastName}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="equal-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover-lift animate-scale-in equal-card">
              <CardContent className="p-6 equal-card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Jami Hamkorlar</p>
                    <p className="text-3xl font-bold text-primary">{stats.totalPartners}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift animate-scale-in equal-card" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 equal-card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tasdiqlangan</p>
                    <p className="text-3xl font-bold text-accent">{stats.approvedPartners}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift animate-scale-in equal-card" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 equal-card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Kutilayotgan</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.pendingPartners}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift animate-scale-in equal-card" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6 equal-card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">So'rovlar</p>
                    <p className="text-3xl font-bold text-secondary">{stats.totalRequests}</p>
                  </div>
                  <Package className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-  w-4 h-4" />
                Umumiy
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Hamkorlar
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                So'rovlar
              </TabsTrigger>
              <TabsTrigger value="tiers" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Tariflar
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
                {/* Recent Activity */}
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      So'nggi Faoliyat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {partners.slice(0, 5).map((partner) => (
                        <div key={partner.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium">{partner.businessName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(partner.createdAt).toLocaleDateString('uz-UZ')}
                            </p>
                          </div>
                          {getStatusBadge(partner.isApproved ? 'approved' : 'pending')}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Tezkor Amallar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button onClick={() => setSelectedTab('partners')} variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Hamkorlarni boshqarish
                      </Button>
                      <Button onClick={() => setSelectedTab('requests')} variant="outline" className="w-full justify-start">
                        <Package className="w-4 h-4 mr-2" />
                        So'rovlarni ko'rib chiqish
                      </Button>
                      <Button onClick={() => setSelectedTab('tiers')} variant="outline" className="w-full justify-start">
                        <Crown className="w-4 h-4 mr-2" />
                        Tarif so'rovlari
                      </Button>
                      <Button onClick={() => setSelectedTab('chat')} variant="outline" className="w-full justify-start">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat boshqaruvi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Partners Tab */}
            <TabsContent value="partners" className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Hamkorlar Boshqaruvi</h2>
                  <p className="text-muted-foreground">Hamkorlarni tasdiqlash va boshqarish</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Hamkor qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-input rounded-lg bg-background"
                  >
                    <option value="all">Barchasi</option>
                    <option value="approved">Tasdiqlangan</option>
                    <option value="pending">Kutilayotgan</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-6">
                {filteredPartners.map((partner) => (
                  <Card key={partner.id} className="shadow-elegant hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold">
                              {partner.businessName?.charAt(0) || 'H'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{partner.businessName}</h3>
                            <p className="text-muted-foreground">
                              {partner.userData?.firstName} {partner.userData?.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {partner.userData?.email} • {partner.userData?.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(partner.isApproved ? 'approved' : 'pending')}
                          <Badge variant="outline">
                            {getTierName(partner.pricingTier)}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Kategoriya</p>
                          <p className="font-medium">{partner.businessCategory}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Oylik Aylanma</p>
                          <p className="font-medium">{formatCurrency(parseFloat(partner.monthlyRevenue || '0'))}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ro'yxatdan o'tgan</p>
                          <p className="font-medium">
                            {new Date(partner.createdAt).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                      </div>
                      {partner.notes && (
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Izohlar:</p>
                          <p className="text-sm">{partner.notes}</p>
                        </div>
                      )}
                      {!partner.isApproved && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => approvePartnerMutation.mutate(partner.id)}
                            disabled={approvePartnerMutation.isPending}
                            variant="success"
                            size="sm"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Tasdiqlash
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Rad etish
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Fulfillment Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Fulfillment So'rovlari</h2>
                  <p className="text-muted-foreground">Hamkorlardan kelgan so'rovlarni boshqarish</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="So'rov qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-input rounded-lg bg-background"
                  >
                    <option value="all">Barchasi</option>
                    <option value="pending">Kutilayotgan</option>
                    <option value="approved">Tasdiqlangan</option>
                    <option value="in_progress">Jarayonda</option>
                    <option value="completed">Yakunlangan</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-6">
                {filteredRequests.map((request) => (
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
                              <p className="text-muted-foreground">Turi:</p>
                              <p className="font-medium">{request.requestType}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Taxminiy xarajat:</p>
                              <p className="font-medium">
                                {request.estimatedCost ? formatCurrency(parseFloat(request.estimatedCost)) : 'Belgilanmagan'}
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
                      {request.status === 'pending' && (
                        <div className="flex gap-2 pt-4 border-t">
                          <Button
                            onClick={() => updateFulfillmentRequestMutation.mutate({
                              id: request.id,
                              updates: { status: 'approved' }
                            })}
                            disabled={updateFulfillmentRequestMutation.isPending}
                            variant="success"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Tasdiqlash
                          </Button>
                          <Button
                            onClick={() => updateFulfillmentRequestMutation.mutate({
                              id: request.id,
                              updates: { status: 'in_progress' }
                            })}
                            disabled={updateFulfillmentRequestMutation.isPending}
                            variant="outline"
                            size="sm"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Jarayonga o'tkazish
                          </Button>
                          <Button
                            onClick={() => updateFulfillmentRequestMutation.mutate({
                              id: request.id,
                              updates: { status: 'cancelled' }
                            })}
                            disabled={updateFulfillmentRequestMutation.isPending}
                            variant="destructive"
                            size="sm"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Bekor qilish
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tier Upgrade Requests Tab */}
            <TabsContent value="tiers" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Tarif Yangilash So'rovlari</h2>
                  <p className="text-muted-foreground">Hamkorlardan kelgan tarif yangilash so'rovlari</p>
                </div>
                <Badge variant="secondary">
                  {stats.tierUpgradeRequests} ta yangi so'rov
                </Badge>
              </div>
              <div className="grid gap-6">
                {tierUpgradeRequests.map((request) => (
                  <Card key={request.id} className="shadow-elegant hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Crown className="w-6 h-6 text-primary" />
                            <div>
                              <h3 className="text-lg font-semibold">
                                {getTierName(request.currentTier)} → {getTierName(request.requestedTier)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.requestedAt).toLocaleDateString('uz-UZ')}
                              </p>
                            </div>
                          </div>
                         
                          {request.reason && (
                            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Sabab:</p>
                              <p className="text-sm">{request.reason}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Admin izohi..."
                            className="min-h-[80px]"
                            id={`admin-notes-${request.id}`}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                const textarea = document.getElementById(`admin-notes-${request.id}`) as HTMLTextAreaElement;
                                updateTierRequestMutation.mutate({
                                  id: request.id,
                                  status: 'approved',
                                  adminNotes: textarea?.value || ''
                                });
                              }}
                              disabled={updateTierRequestMutation.isPending}
                              variant="success"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Tasdiqlash
                            </Button>
                            <Button
                              onClick={() => {
                                const textarea = document.getElementById(`admin-notes-${request.id}`) as HTMLTextAreaElement;
                                updateTierRequestMutation.mutate({
                                  id: request.id,
                                  status: 'rejected',
                                  adminNotes: textarea?.value || ''
                                });
                              }}
                              disabled={updateTierRequestMutation.isPending}
                              variant="destructive"
                              size="sm"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Rad etish
                            </Button>
                          </div>
                        </div>
                      )}
                      {request.adminNotes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium mb-1">Admin izohi:</p>
                          <p className="text-sm text-blue-800">{request.adminNotes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Trending Products Tab */}
            <TabsContent value="trends" className="space-y-6">
              <TrendingProducts />
            </TabsContent>

            {/* Chat Tab — faqat shu yerda yuklansin */}
            <TabsContent value="chat" className="space-y-6">
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Hamkorlar bilan Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-full">
                  <Suspense fallback={
                    <div className="h-full flex items-center justify-center bg-muted/10">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
                        <p className="text-muted-foreground">Chat yuklanmoqda...</p>
                      </div>
                    </div>
                  }>
                    <ChatSystem isAdmin={true} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
