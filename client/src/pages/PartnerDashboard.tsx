import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/LoginForm';
import { PartnerStats } from '@/components/PartnerStats';
import { FulfillmentRequestForm } from '@/components/FulfillmentRequestForm';
import { ProductForm } from '@/components/ProductForm';
import { Navigation } from '@/components/Navigation';
import { ProfitDashboard } from '@/components/ProfitDashboard';
import { TrendingProducts } from '@/components/TrendingProducts';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/currency';
import { toast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Package, 
  ClipboardList, 
  Store, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Award,
  Download,
  MessageCircle,
  Warehouse,
  UserCheck,
  Send,
  Eye,
  AlertTriangle,
  Truck,
  RefreshCw,
  Target
} from 'lucide-react';

// Types
interface Analytics {
  id: string;
  revenue: string;
  orders: number;
  profit: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  isActive: boolean;
  category: string;
}

interface FulfillmentRequest {
  id: string;
  title: string;
  status: string;
  priority: string;
  estimatedCost: string;
  createdAt: string;
}

interface Partner {
  id: string;
  businessName: string;
  isApproved: boolean;
  pricingTier: string;
}

export default function PartnerDashboard() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('analytics');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleSendMessage = () => {
    if (!chatMessage.trim() || sendingMessage || !ws || !user) return;
    
    setSendingMessage(true);
    
    // Send message via WebSocket
    const messageData = {
      type: 'chat_message',
      fromUserId: user.id,
      toUserId: 'admin', // Send to admin
      content: chatMessage.trim(),
      messageType: 'text'
    };
    
    ws.send(JSON.stringify(messageData));
    
    // Add message to local state immediately
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: chatMessage.trim(),
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      time: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
    setSendingMessage(false);
  };

  // WebSocket connection setup
  useEffect(() => {
    if (user && user.role === 'partner') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const websocket = new WebSocket(wsUrl);
      
      websocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        // Authenticate user
        websocket.send(JSON.stringify({
          type: 'authenticate',
          userId: user.id
        }));
      };
      
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'authenticated') {
          console.log('User authenticated via WebSocket');
        }
        
        if (data.type === 'new_message') {
          // Add incoming message to chat
          const newMessage = {
            id: data.id,
            sender: data.senderType || 'admin',
            message: data.content,
            timestamp: new Date(data.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
            time: new Date(data.createdAt)
          };
          setChatMessages(prev => [...prev, newMessage]);
        }
        
        if (data.type === 'api_docs_uploaded') {
          // Show notification when API docs are uploaded
          toast({
            title: "API Hujjatlari Yuklandi",
            description: data.message,
            duration: 5000
          });
        }
        
        if (data.type === 'fulfillment_status_updated') {
          // Show notification when fulfillment status changes
          toast({
            title: "So'rov Holati O'zgartirildi",
            description: data.message,
            duration: 5000
          });
        }
        
        if (data.type === 'tier_upgrade_approved') {
          // Show notification when tier upgrade is approved
          toast({
            title: "Tarif Yangilandi",
            description: data.message,
            duration: 8000
          });
        }
      };
      
      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      setWs(websocket);
      
      return () => {
        websocket.close();
      };
    }
  }, [user]);
  
  // Load chat messages on mount
  useEffect(() => {
    if (user && user.role === 'partner') {
      // Load existing chat messages from admin
      // In a real app, you'd make an API call to get chat history
      // For now, we'll let WebSocket handle real-time messages
    }
  }, [user]);

  const { data: partner } = useQuery<Partner>({
    queryKey: ['/api/partners/me'],
    enabled: !!user && user.role === 'partner',
    retry: false,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: !!user && user.role === 'partner',
  });

  const { data: fulfillmentRequests = [] } = useQuery<FulfillmentRequest[]>({
    queryKey: ['/api/fulfillment-requests'],
    enabled: !!user && user.role === 'partner',
  });

  const { data: analytics = null } = useQuery<any>({
    queryKey: ['/api/analytics/partner'],
    enabled: !!user && user.role === 'partner',
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: dashboardStats } = useQuery<any>({
    queryKey: ['/api/dashboard/stats'],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Ensure arrays are never null
  const safeFulfillmentRequests = fulfillmentRequests || [];
  const safeChatMessages = chatMessages || [];
  const safeProducts = products || [];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'partner') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="pt-20 pb-16 flex items-center justify-center min-h-screen">
          <LoginForm 
            onSuccess={() => window.location.reload()}
            isAdmin={false}
          />
        </div>
      </div>
    );
  }

  // Calculate stats with proper typing - analytics is an object, not an array
  const stats = {
    totalRevenue: analytics?.totalRevenue || 0,
    totalOrders: analytics?.requestCount || 0,
    totalProfit: analytics?.totalProfit || 0,
    activeProducts: safeProducts.filter((p: Product) => p.isActive).length,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "secondary" | "default" | "destructive"; icon: any }> = {
      pending: { label: 'Kutilmoqda', variant: 'secondary', icon: Clock },
      approved: { label: 'Tasdiqlandi', variant: 'default', icon: CheckCircle },
      in_progress: { label: 'Jarayonda', variant: 'default', icon: AlertCircle },
      completed: { label: 'Yakunlandi', variant: 'default', icon: CheckCircle },
      cancelled: { label: 'Bekor qilindi', variant: 'destructive', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { label: string; variant: "secondary" | "default" | "destructive" }> = {
      low: { label: 'Past', variant: 'secondary' },
      medium: { label: "O'rta", variant: 'default' },
      high: { label: 'Yuqori', variant: 'default' },
      urgent: { label: 'Shoshilinch', variant: 'destructive' },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Professional Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">BiznesYordam Dashboard</h1>
                  <p className="text-sm text-slate-600">Professional marketplace management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-600">
                  {partner?.businessName || 'Professional Partner'}
                </p>
              </div>
              {partner && (
                <div>
                  {partner.isApproved ? (
                    <Badge variant="default" className="text-sm px-4 py-2 bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Tasdiqlangan hamkor
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-sm px-4 py-2 bg-yellow-100 text-yellow-800">
                      <Clock className="w-4 h-4 mr-2" />
                      Tasdiq kutilmoqda
                    </Badge>
                  )}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  try {
                    await logout();
                    setLocation('/');
                  } catch (error) {
                    console.error('Logout error:', error);
                    setLocation('/');
                  }
                }}
              >
                Chiqish
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {partner && !partner.isApproved && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Tasdiq kutilmoqda</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Sizning hamkorlik arizangiz ko'rib chiqilmoqda. Tez orada javob beramiz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Stats Cards with Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Oylik Aylanma</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(stats.totalRevenue)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-xs text-blue-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% o'tgan oydan
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-green-600">Sof Foyda</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(stats.totalProfit)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-xs text-green-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3% o'tgan oydan
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Faol Buyurtmalar</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.totalOrders}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-xs text-purple-700">
                  <Clock className="h-3 w-3 mr-1" />
                  3 ta kutilmoqda
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Faol Mahsulotlar</p>
                    <p className="text-2xl font-bold text-orange-900">{stats.activeProducts}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-xs text-orange-700">
                  <Award className="h-3 w-3 mr-1" />
                  97% faollik darajasi
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-slate-100 p-1 rounded-lg">
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 px-3 py-3 rounded-md transition-all text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold"
              >
                <BarChart3 className="w-4 h-4" />
                Statistikalar
              </TabsTrigger>
              <TabsTrigger 
                value="profit" 
                className="flex items-center gap-2 px-3 py-3 rounded-md transition-all text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold"
              >
                <DollarSign className="w-4 h-4" />
                Sof Foyda
              </TabsTrigger>
              <TabsTrigger 
                value="trending" 
                className="flex items-center gap-2 px-3 py-3 rounded-md transition-all text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold"
              >
                <TrendingUp className="w-4 h-4" />
                Trend Hunter
              </TabsTrigger>
              <TabsTrigger 
                value="warehouse" 
                className="flex items-center gap-2 px-3 py-3 rounded-md transition-all text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold"
              >
                <Warehouse className="w-4 h-4" />
                My Sklad
              </TabsTrigger>
              <TabsTrigger 
                value="requests" 
                className="flex items-center gap-2 px-3 py-3 rounded-md transition-all text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold"
              >
                <ClipboardList className="w-4 h-4" />
                So'rovlar
              </TabsTrigger>
              <TabsTrigger 
                value="activation" 
                className="flex items-center gap-2 px-3 py-3 rounded-md transition-all text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold"
              >
                <UserCheck className="w-4 h-4" />
                Aktivlashtirish
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="flex items-center gap-2 px-3 py-3 rounded-md transition-all text-slate-600 hover:text-slate-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                Admin Chat
              </TabsTrigger>
            </TabsList>

            {/* Combined Analytics Tab (was overview + analytics) */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Filters and Export */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Statistikalar va Tahlil</h2>
                <div className="flex flex-wrap gap-3">
                  <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                    <option>So'nggi 7 kun</option>
                    <option>So'nggi 30 kun</option>
                    <option>So'nggi 3 oy</option>
                    <option>So'nggi yil</option>
                  </select>
                  <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                    <option>Barcha hizmatlar</option>
                    <option>Faqat sotuvlar</option>
                    <option>Faqat fulfillment</option>
                  </select>
                  <Button variant="outline" data-testid="button-export-excel">
                    <Download className="w-4 h-4 mr-2" />
                    Excel yuklab olish
                  </Button>
                </div>
              </div>

              {/* Charts and Marketplace Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Kunlik Savdo Grafigi</CardTitle>
                    <p className="text-sm text-slate-600">Umumiy savdo summasi va buyurtmalar soni</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600">Kunlik savdo grafigi</p>
                        <p className="text-xs text-slate-500 mt-1">Buyurtmalar soni va jami summa</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Marketplace Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Marketplace Ko'rsatkichlari</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Uzum Market</span>
                        <span className="font-semibold">{formatCurrency(2500000)}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">65% jami savdodan</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Wildberries</span>
                        <span className="font-semibold">{formatCurrency(950000)}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">25% jami savdodan</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Yandex Market</span>
                        <span className="font-semibold">{formatCurrency(380000)}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">10% jami savdodan</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Statistics Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Kunlik Hisobot</CardTitle>
                  <p className="text-sm text-slate-600">Har kungi savdo va buyurtmalar ma'lumoti</p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left p-3 font-medium text-slate-700">Sana</th>
                          <th className="text-left p-3 font-medium text-slate-700">Jami Savdo</th>
                          <th className="text-left p-3 font-medium text-slate-700">Buyurtmalar</th>
                          <th className="text-left p-3 font-medium text-slate-700">Marketplace</th>
                          <th className="text-left p-3 font-medium text-slate-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="p-3">2025-01-24</td>
                          <td className="p-3 font-medium">{formatCurrency(850000)}</td>
                          <td className="p-3">12 ta</td>
                          <td className="p-3">Uzum Market</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Faol
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="p-3">2025-01-23</td>
                          <td className="p-3 font-medium">{formatCurrency(720000)}</td>
                          <td className="p-3">8 ta</td>
                          <td className="p-3">Wildberries</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Faol
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="p-3">2025-01-22</td>
                          <td className="p-3 font-medium">{formatCurrency(950000)}</td>
                          <td className="p-3">15 ta</td>
                          <td className="p-3">Uzum Market</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Faol
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Fulfillment So'rovlari</h2>
                <FulfillmentRequestForm products={safeProducts as { id: string; name: string }[]} />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Barcha So'rovlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safeFulfillmentRequests.map((request: FulfillmentRequest) => (
                      <div key={request.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900 mb-2">{request.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>Narx: {formatCurrency(parseFloat(request.estimatedCost || '0'))}</span>
                              <span>Sana: {new Date(request.createdAt).toLocaleDateString('uz-UZ')}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {safeFulfillmentRequests.length === 0 && (
                      <p className="text-center text-slate-500 py-8">
                        Hozircha fulfillment so'rovlari yo'q. Yangi so'rov yarating.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Combined Analytics Tab (was overview + analytics) */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Filters and Export */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Statistikalar va Tahlil</h2>
                <div className="flex flex-wrap gap-3">
                  <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                    <option>So'nggi 7 kun</option>
                    <option>So'nggi 30 kun</option>
                    <option>So'nggi 3 oy</option>
                    <option>So'nggi yil</option>
                  </select>
                  <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                    <option>Barcha hizmatlar</option>
                    <option>Faqat sotuvlar</option>
                    <option>Faqat fulfillment</option>
                  </select>
                  <Button variant="outline" data-testid="button-export-excel">
                    <Download className="w-4 h-4 mr-2" />
                    Excel yuklab olish
                  </Button>
                </div>
              </div>
              
              {/* Charts and Performance Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Daromad Grafigi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600">Daromad grafigi bu yerda ko'rsatiladi</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ko'rsatkichlar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Mijoz qoniqishi</span>
                        <span className="font-semibold">98%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Buyurtma bajarish</span>
                        <span className="font-semibold">95%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Mahsulot mavjudligi</span>
                        <span className="font-semibold">87%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Best Selling Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Eng Yaxshi Sotilayotgan Mahsulotlar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900">iPhone 15 Pro</h4>
                          <p className="text-sm text-slate-600">45 ta sotildi</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(15000000)}</p>
                          <p className="text-xs text-green-600">+15%</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900">Samsung Galaxy S24</h4>
                          <p className="text-sm text-slate-600">32 ta sotildi</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(12000000)}</p>
                          <p className="text-xs text-green-600">+8%</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900">MacBook Air M2</h4>
                          <p className="text-sm text-slate-600">18 ta sotildi</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(18000000)}</p>
                          <p className="text-xs text-green-600">+12%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Partner Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hamkor Talablari</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900">Telefon aksessuarlari</h4>
                        <p className="text-sm text-blue-700">Yuqori talab - tezda yetkazib bering</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900">Wireless quloqchinlar</h4>
                        <p className="text-sm text-green-700">O'rta talab - barqaror sotish</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-900">Smart soatlar</h4>
                        <p className="text-sm text-yellow-700">Kamaygan talab - narxni ko'rib chiqing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </TabsContent>

            {/* Activation Request Tab */}
            <TabsContent value="activation" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Aktivlashtirish So'rovi</h2>
              </div>
              
              {partner?.isApproved ? (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center text-center py-8">
                      <div>
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                          Hamkor sifatida tasdiqlangansiz!
                        </h3>
                        <p className="text-green-700">
                          Barcha funktsiyalar sizga ochiq. Marketplace bilan ishlashni boshlashingiz mumkin.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Tariff Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Tarif Tanlang
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                          <div className="text-center">
                            <h4 className="font-semibold text-slate-900 mb-2">Boshlang'ich</h4>
                            <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(500000)}</div>
                            <p className="text-sm text-slate-600 mb-4">oyiga</p>
                            <ul className="text-xs text-slate-600 space-y-1">
                              <li>• 100 ta mahsulot</li>
                              <li>• Asosiy analytics</li>
                              <li>• Email support</li>
                            </ul>
                          </div>
                        </div>
                        <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50 cursor-pointer">
                          <div className="text-center">
                            <h4 className="font-semibold text-blue-900 mb-2">Professional</h4>
                            <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(1200000)}</div>
                            <p className="text-sm text-blue-600 mb-4">oyiga</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                              <li>• 500 ta mahsulot</li>
                              <li>• Kengaytirilgan analytics</li>
                              <li>• 24/7 support</li>
                              <li>• Priority fulfillment</li>
                            </ul>
                          </div>
                        </div>
                        <div className="border border-slate-200 rounded-lg p-4 hover:border-purple-300 cursor-pointer">
                          <div className="text-center">
                            <h4 className="font-semibold text-slate-900 mb-2">Enterprise</h4>
                            <div className="text-2xl font-bold text-purple-600 mb-2">{formatCurrency(2500000)}</div>
                            <p className="text-sm text-slate-600 mb-4">oyiga</p>
                            <ul className="text-xs text-slate-600 space-y-1">
                              <li>• Cheksiz mahsulotlar</li>
                              <li>• Custom analytics</li>
                              <li>• Dedicated manager</li>
                              <li>• API access</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Legal Information Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        Yuridik Ma'lumotlar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Korxona nomi
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="MChJ 'Test Biznes'"
                            data-testid="input-company-name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            STIR raqami
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123456789"
                            data-testid="input-tax-id"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Manzil
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Toshkent shahar, ..."
                            data-testid="input-address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Telefon raqami
                          </label>
                          <input 
                            type="tel" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+998 90 123 45 67"
                            data-testid="input-phone"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bank Account Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Bank Hisob Ma'lumotlari
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Bank nomi
                          </label>
                          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Bankni tanlang</option>
                            <option>Aloqabank</option>
                            <option>Uzpromstroybank</option>
                            <option>Xalq Bank</option>
                            <option>TBC Bank</option>
                            <option>Kapital Bank</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Hisob raqami
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="20208000000000000000"
                            data-testid="input-account-number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            MFO kod
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="00014"
                            data-testid="input-mfo"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Bank hisob egasi
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="MChJ 'Test Biznes'"
                            data-testid="input-account-holder"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h4 className="font-semibold text-blue-900 mb-4">
                          Aktivlashtirish So'rovini Yuborish
                        </h4>
                        <p className="text-sm text-blue-700 mb-6">
                          Barcha ma'lumotlarni to'ldirganingizdan so'ng, so'rovni yuboring. 
                          Admin tomonidan ko'rib chiqilish jarayoni 24-48 soat davom etadi.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-submit-activation">
                          <Send className="w-4 h-4 mr-2" />
                          So'rov Yuborish
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* My Sklad Tab - Fulfillment focused */}
            <TabsContent value="warehouse" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">My Sklad - Fulfillment Kuzatuvi</h2>
                <p className="text-slate-600">Fulfillmentga topshirilgan mahsulotlar nazorati</p>
              </div>
              
              {/* Fulfillment Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Fulfillmentda Jami</p>
                        <p className="text-3xl font-bold text-blue-900">156</p>
                        <p className="text-xs text-blue-700">dona mahsulot</p>
                      </div>
                      <div className="h-16 w-16 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Sotildi</p>
                        <p className="text-3xl font-bold text-green-900">89</p>
                        <p className="text-xs text-green-700">dona mahsulot</p>
                      </div>
                      <div className="h-16 w-16 bg-green-500 rounded-xl flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">Qolgan</p>
                        <p className="text-3xl font-bold text-yellow-900">67</p>
                        <p className="text-xs text-yellow-700">dona mahsulot</p>
                      </div>
                      <div className="h-16 w-16 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Qayta Ishlanayotgan</p>
                        <p className="text-3xl font-bold text-purple-900">8</p>
                        <p className="text-xs text-purple-700">jarayonda</p>
                      </div>
                      <div className="h-16 w-16 bg-purple-500 rounded-xl flex items-center justify-center">
                        <Truck className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Fulfillment Status Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle>Fulfillmentdagi Mahsulotlar</CardTitle>
                  <p className="text-sm text-slate-600">Fulfillmentga topshirilgan va faoliyat ko'rsatayotgan mahsulotlar</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">iPhone 15 Pro Max</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span>Topshirildi: 50 dona</span>
                          <span>Sotildi: 32 dona</span>
                          <span>Qolgan: 18 dona</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Fulfillmentda
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">Samsung Galaxy S24 Ultra</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span>Topshirildi: 30 dona</span>
                          <span>Sotildi: 25 dona</span>
                          <span>Qolgan: 5 dona</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          Kam qoldi
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">MacBook Air M2</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span>Topshirildi: 20 dona</span>
                          <span>Sotildi: 12 dona</span>
                          <span>Qolgan: 8 dona</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Fulfillmentda
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">AirPods Pro 3</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span>Topshirildi: 40 dona</span>
                          <span>Sotildi: 20 dona</span>
                          <span>Qolgan: 20 dona</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          Qayta ishlanayotgan
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">iPad Air</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <span>Topshirildi: 15 dona</span>
                          <span>Sotildi: 15 dona</span>
                          <span>Qolgan: 0 dona</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          Tugadi
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Marketplace Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Marketplace bo'yicha Natijalar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Uzum Market</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Sotildi:</span>
                          <span className="font-medium">45 dona</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Summa:</span>
                          <span className="font-medium">{formatCurrency(2500000)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Wildberries</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Sotildi:</span>
                          <span className="font-medium">28 dona</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Summa:</span>
                          <span className="font-medium">{formatCurrency(950000)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Yandex Market</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Sotildi:</span>
                          <span className="font-medium">16 dona</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Summa:</span>
                          <span className="font-medium">{formatCurrency(380000)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profit Dashboard Tab */}
            <TabsContent value="profit" className="space-y-6">
              <ProfitDashboard />
            </TabsContent>

            {/* Trending Products Tab */}
            <TabsContent value="trending" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Trend Hunter</h2>
                  <p className="text-slate-600">Xalqaro bozorlardan eng mashhur mahsulotlarni toping</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Yangilash
                  </Button>
                </div>
              </div>
              
              <TrendingProducts />
            </TabsContent>

            {/* Admin Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Admin bilan Muloqot</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Messages */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Chat Xabarlari
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 border border-slate-200 rounded-lg p-4 overflow-y-auto custom-scrollbar space-y-4">
                      {isConnected && (
                        <div className="mb-4 text-center">
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">● Real-time chat faol</span>
                        </div>
                      )}
                      {!isConnected && (
                        <div className="mb-4 text-center">
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">● Ulanmoqda...</span>
                        </div>
                      )}
                      {safeChatMessages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            msg.sender === 'admin' ? 'bg-blue-500' : 'bg-green-500'
                          }`}>
                            <span className="text-white text-xs font-medium">
                              {msg.sender === 'admin' ? 'A' : 'H'}
                            </span>
                          </div>
                          <div className={`rounded-lg p-3 flex-1 max-w-[80%] ${
                            msg.sender === 'admin' 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'bg-green-50 border border-green-200'
                          }`}>
                            <div className={`text-sm ${
                              msg.sender === 'admin' ? 'text-blue-900' : 'text-green-900'
                            }`}>
                              {msg.message}
                            </div>
                            <div className={`text-xs mt-1 ${
                              msg.sender === 'admin' ? 'text-blue-600' : 'text-green-600'
                            }`}>
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                      {safeChatMessages.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Hozircha xabarlar yo'q. Birinchi xabaringizni yozing!</p>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="mt-4">
                      <div className="flex gap-3">
                        <Input
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Xabar yozing..."
                          className="flex-1"
                          data-testid="input-chat-message"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!chatMessage.trim() || sendingMessage}
                          data-testid="button-send-message"
                        >
                          {sendingMessage ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Enter tugmasini bosing yoki Send tugmasini bosing
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tezkor Harakatlar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Aktivlashtirish haqida
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Mahsulot qo'shish
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Warehouse className="w-4 h-4 mr-2" />
                      Ombor masalasi
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      To'lov masalasi
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}