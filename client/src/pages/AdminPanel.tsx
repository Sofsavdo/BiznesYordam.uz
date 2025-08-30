import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LoginForm } from '@/components/LoginForm';
import { Navigation } from '@/components/Navigation';
import { TrendingProducts } from '@/components/TrendingProducts';
import { ApiKeyForm } from '@/components/ApiKeyForm';
import { ApiDocumentationManager } from '@/components/ApiDocumentationManager';
import { ExcelDataManager } from '@/components/ExcelDataManager';
import { MarketplaceApiConfig } from '@/components/MarketplaceApiConfig';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatNumber } from '@/lib/currency';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  User,
  BarChart3,
  BarChart,
  Package, 
  ClipboardList, 
  CheckCircle, 
  Clock,
  AlertCircle,
  XCircle,
  UserCheck,
  TrendingUp,
  DollarSign,
  Award,
  Settings,
  Database,
  Globe,
  Target,
  Zap,
  PieChart,
  LineChart,
  Activity,
  Wifi,
  WifiOff,
  Star,
  ArrowUpDown,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Briefcase,
  Shield,
  ShoppingCart,
  MessageCircle,
  Send,
  Plus,
  Minus,
  Calendar,
  Building,
  CreditCard,
  FileText,
  FileSpreadsheet,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Layers,
  RotateCcw,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
  RefreshCw,
  Save
} from 'lucide-react';

// Types
interface OverallStats {
  totalPartners: number;
  totalRevenue: string;
  totalOrders: number;
  avgProfit: string;
}

interface Partner {
  id: string;
  businessName: string;
  isApproved: boolean;
  pricingTier: string;
  businessCategory: string;
  monthlyRevenue: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface FulfillmentRequest {
  id: string;
  title: string;
  status: string;
  priority: string;
  estimatedCost: string;
  createdAt: string;
  partner: {
    businessName: string;
  };
}

interface TierUpgradeRequest {
  id: string;
  partnerId: string;
  fromTier: string;
  toTier: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  partner: {
    businessName: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

interface MarketplaceIntegration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  partnersCount: number;
  lastSync: string;
  apiHealth: 'healthy' | 'warning' | 'error';
}

interface AnalyticsData {
  revenue: {
    daily: Array<{ date: string; amount: number; }>;
    monthly: Array<{ month: string; amount: number; }>;
  };
  partnerPerformance: Array<{
    partnerId: string;
    businessName: string;
    revenue: number;
    profitMargin: number;
    ordersCount: number;
    tier: string;
  }>;
}

export default function AdminPanel() {
  const { user, isLoading: authLoading, refetch, permissions } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // All useState hooks together at the top
  const [activeTab, setActiveTab] = useState('dashboard');
  const can = (key: string) => Boolean((permissions as any)?.[key]);
  // Admin management state
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', firstName: '', lastName: '', email: '' });
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [showPartnerDetails, setShowPartnerDetails] = useState(false);
  const [showPartnerEdit, setShowPartnerEdit] = useState(false);
  const [showPartnerProducts, setShowPartnerProducts] = useState(false);
  const [showMarketplaceSettings, setShowMarketplaceSettings] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [showApiDocumentationManager, setShowApiDocumentationManager] = useState(false);
  const [showExcelDataManager, setShowExcelDataManager] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('');
  const [apiKeyData, setApiKeyData] = useState({ key: '', secret: '', shopId: '' });
  const [partnersFilter, setPartnersFilter] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatPartner, setSelectedChatPartner] = useState<any>(null);
  const [commissionOverride, setCommissionOverride] = useState<string>('');
  // System settings state
  const [sptCostsList, setSptCostsList] = useState<any[]>([]);
  const [commissionList, setCommissionList] = useState<any[]>([]);
  const [isLoadingSystem, setIsLoadingSystem] = useState(false);
  const [newSptJson, setNewSptJson] = useState<string>(JSON.stringify({
    category: "electronics",
    price: 4500,
    marketplace: "uzum",
    active: true
  }, null, 2));
  const [newCommissionJson, setNewCommissionJson] = useState<string>(JSON.stringify({
    partnerId: null,
    category: "electronics",
    marketplace: "uzum",
    rate: 0.15,
    active: true
  }, null, 2));

  // WebSocket connection setup with reconnect backoff
  useEffect(() => {
    if (user && user.role === 'admin') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      let socket: WebSocket | null = null;
      let attempts = 0;
      const connect = () => {
        attempts += 1;
        socket = new WebSocket(wsUrl);
        socket.onopen = () => {
          attempts = 0;
          setIsConnected(true);
          socket!.send(JSON.stringify({ type: 'authenticate', userId: user.id }));
        };
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'new_message') {
            const newMessage = {
              id: data.id,
              sender: data.senderType === 'admin' ? 'admin' : 'partner',
              message: data.content,
              timestamp: new Date(data.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
              time: new Date(data.createdAt),
              fromUserId: data.fromUserId,
              toUserId: data.toUserId
            };
            setChatMessages(prev => [...prev, newMessage]);
          }
        };
        socket.onclose = () => {
          setIsConnected(false);
          const timeout = Math.min(10000, 500 * Math.pow(2, attempts));
          setTimeout(connect, timeout);
        };
        socket.onerror = () => {
          try { socket?.close(); } catch {}
        };
      };
      connect();
      setWs(socket);
      return () => { try { socket?.close(); } catch {} };
    }
  }, [user]);

  // Load admins list if can manage admins
  useEffect(() => {
    (async () => {
      if (user?.role === 'admin' && can('canManageAdmins')) {
        try {
          setIsLoadingAdmins(true);
          const res = await apiRequest('GET', '/api/admins');
          setAdmins(await res.json());
        } catch (e) {
          // ignore
        } finally {
          setIsLoadingAdmins(false);
        }
      }
    })();
  }, [user, permissions]);

  // Load system settings (SPT and Commission)
  useEffect(() => {
    (async () => {
      if (user?.role === 'admin') {
        try {
          setIsLoadingSystem(true);
          const [sptRes, comRes] = await Promise.all([
            apiRequest('GET', '/api/spt-costs'),
            apiRequest('GET', '/api/commission-settings'),
          ]);
          setSptCostsList(await sptRes.json());
          setCommissionList(await comRes.json());
        } catch {
          // ignore
        } finally {
          setIsLoadingSystem(false);
        }
      }
    })();
  }, [user]);
  
  // Load chat messages when partner is selected
  useEffect(() => {
    if (selectedChatPartner && user) {
      // Load chat messages for this partner
      const loadMessages = async () => {
        try {
          const response = await apiRequest('GET', `/api/admin/chats/${selectedChatPartner.id}/messages`);
          const messages = await response.json();
          setChatMessages(messages.map((msg: any) => ({
            id: msg.id,
            sender: msg.fromUserId === user.id ? 'admin' : 'partner',
            message: msg.content,
            messageType: msg.messageType || 'text',
            fileUrl: msg.fileUrl,
            fileName: msg.fileName,
            timestamp: new Date(msg.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
            time: new Date(msg.createdAt)
          })));
        } catch (error) {
          console.error('Failed to load messages:', error);
        }
      };
      loadMessages();
    }
  }, [selectedChatPartner, user]);

  // All useQuery hooks together
  const { data: overallStats } = useQuery<OverallStats>({
    queryKey: ['/api/analytics/overview'],
    enabled: !!user && user.role === 'admin',
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ['/api/partners'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: pendingPartners = [] } = useQuery<Partner[]>({
    queryKey: ['/api/partners/pending'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: fulfillmentRequests = [] } = useQuery<FulfillmentRequest[]>({
    queryKey: ['/api/fulfillment-requests'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: tierUpgradeRequests = [] } = useQuery<TierUpgradeRequest[]>({
    queryKey: ['/api/tier-upgrade-requests'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: marketplaceIntegrations = [] } = useQuery<MarketplaceIntegration[]>({
    queryKey: ['/api/marketplace-integrations'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: analyticsData } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics/detailed'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: chatPartners = [] } = useQuery<any[]>({
    queryKey: ['/api/admin/chat-partners'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: contactForms = [] } = useQuery<any[]>({
    queryKey: ['/api/contact-forms'],
    enabled: !!user && user.role === 'admin',
  });

  // All useMutation hooks together
  const approvePartnerMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const response = await apiRequest('POST', `/api/partners/${partnerId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Partner tasdiqlandi",
        description: "Partner muvaffaqiyatli tasdiqlandi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/partners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/partners/pending'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Chat message sending function
  const sendChatMessage = async (partnerId: string, message: string, messageType = 'text', fileUrl?: string, fileName?: string) => {
    if (!message.trim() || !user) return;
    
    try {
      const response = await apiRequest('POST', `/api/chat/partners/${partnerId}/message`, {
        message: message.trim(),
        messageType,
        fileUrl,
        fileName
      });
      
      const result = await response.json();
      
      // Add to local state immediately
      const newMessage = {
        id: result.newMessage.id,
        sender: 'admin',
        message: message.trim(),
        messageType,
        fileUrl,
        fileName,
        timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        time: new Date()
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Xabar yuborishda xatolik",
        description: "Xabar yuborilmadi",
        variant: "destructive",
      });
    }
  };
  
  const updateFulfillmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/fulfillment-requests/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status yangilandi",
        description: "So'rov statusi muvaffaqiyatli yangilandi",
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

  // Export partners mutation
  const exportPartnersMutation = useMutation({
    mutationFn: async () => {
      try {
        const csvData = partners.map(partner => ({
          'Biznes nomi': partner.businessName,
          'Kategoriya': partner.businessCategory,
          'Ism Familiya': `${partner.user?.firstName || ''} ${partner.user?.lastName || ''}`.trim(),
          'Email': partner.user?.email || '',
          'Telefon': partner.user?.phone || '',
          'Tarif': partner.pricingTier,
          'Status': partner.isApproved ? 'Tasdiqlangan' : 'Kutilmoqda',
          'Oylik aylanma': partner.monthlyRevenue || '0'
        }));
        
        const headers = Object.keys(csvData[0] || {});
        const csvContent = [
          headers.join(','),
          ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hamkorlar_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        return { success: true };
      } catch (error) {
        throw new Error('Eksport qilishda xatolik');
      }
    },
    onSuccess: () => {
      toast({
        title: "Eksport muvaffaqiyatli",
        description: "Hamkorlar ro'yxati yuklandi",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eksport xatoligi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Contact form action mutation
  const contactFormActionMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest('PUT', `/api/contact-forms/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status yangilandi",
        description: "Ariza statusi muvaffaqiyatli yangilandi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-forms'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Approve tier upgrade mutation
  const approveTierUpgradeMutation = useMutation({
    mutationFn: async ({ requestId, adminNotes }: { requestId: string; adminNotes?: string }) => {
      const response = await apiRequest('POST', `/api/tier-upgrade-requests/${requestId}/approve`, { adminNotes });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tarif yaxshilandi",
        description: "Hamkor tarifi muvaffaqiyatli yangilandi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tier-upgrade-requests'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reject tier upgrade mutation
  const rejectTierUpgradeMutation = useMutation({
    mutationFn: async ({ requestId, adminNotes }: { requestId: string; adminNotes?: string }) => {
      const response = await apiRequest('POST', `/api/tier-upgrade-requests/${requestId}/reject`, { adminNotes });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "So'rov rad etildi",
        description: "Tarif yaxshilash so'rovi rad etildi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tier-upgrade-requests'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Marketplace connection mutation
  const connectMarketplaceMutation = useMutation({
    mutationFn: async ({ partnerId, marketplace, apiKey, apiSecret, shopId, additionalData }: {
      partnerId: string;
      marketplace: string;
      apiKey: string;
      apiSecret: string;
      shopId?: string;
      additionalData?: any;
    }) => {
      const response = await apiRequest('POST', `/api/partners/${partnerId}/marketplace/connect`, {
        marketplace,
        apiKey,
        apiSecret,
        shopId,
        additionalData
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Marketplace ulandi",
        description: "Marketplace muvaffaqiyatli ulandi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace-integrations'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Ulanish xatoligi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Retry marketplace connection mutation
  const retryMarketplaceMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const response = await apiRequest('POST', `/api/marketplace-integrations/${integrationId}/retry`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Qayta urinish",
        description: "Marketplace ulanishi qayta urinildi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace-integrations'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // System backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/system/backup');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Backup yaratildi",
        description: "Tizim backup muvaffaqiyatli yaratildi",
      });
      // Download backup file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onError: (error: Error) => {
      toast({
        title: "Backup xatoligi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update system settings mutation
  const updateSystemSettingsMutation = useMutation({
    mutationFn: async (settings: Record<string, any>) => {
      const response = await apiRequest('POST', '/api/system/settings', settings);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sozlamalar yangilandi",
        description: "Tizim sozlamalari muvaffaqiyatli yangilandi",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Yangilash xatoligi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // useEffect hooks
  // Removed self-redirect loop to '/admin-panel'. We show the <LoginForm /> below instead.

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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="pt-20 pb-16 flex items-center justify-center min-h-screen">
          <LoginForm 
            onSuccess={() => {
              // Force refetch after successful login
              refetch();
            }}
            isAdmin={true}
          />
        </div>
      </div>
    );
  }

  // Helper functions
  const handleViewPartner = (partner: any) => {
    setSelectedPartner(partner);
    setShowPartnerDetails(true);
  };

  const handleEditPartner = (partner: any) => {
    setSelectedPartner(partner);
    setShowPartnerEdit(true);
  };

  const handleViewProducts = (partner: any) => {
    setSelectedPartner(partner);
    setShowPartnerProducts(true);
  };

  const handleMarketplaceSettings = (partner: any) => {
    setSelectedPartner(partner);
    setShowMarketplaceSettings(true);
  };

  const handleContactFormAction = async (id: string, status: string) => {
    try {
      await contactFormActionMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error('Contact form action error:', error);
    }
  };

  // Filter partners based on search
  const filteredPartners = partners.filter(partner =>
    (partner.businessName || '').toLowerCase().includes(partnersFilter.toLowerCase()) ||
    (partner.businessCategory || '').toLowerCase().includes(partnersFilter.toLowerCase()) ||
    ((partner.user?.firstName || '') + ' ' + (partner.user?.lastName || '')).toLowerCase().includes(partnersFilter.toLowerCase())
  );

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
    <>
      <ApiKeyForm 
        isOpen={showApiKeyForm}
        onClose={() => setShowApiKeyForm(false)}
        partnerId={selectedPartner?.id || ''}
        marketplace={selectedMarketplace}
      />
      
      <ApiDocumentationManager
        isOpen={showApiDocumentationManager}
        onClose={() => setShowApiDocumentationManager(false)}
        partnerId={selectedPartner?.id || ''}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/marketplace-integrations'] });
        }}
      />
      
      <ExcelDataManager
        isOpen={showExcelDataManager}
        onClose={() => setShowExcelDataManager(false)}
        partnerId={selectedPartner?.id || ''}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/analytics/overview'] });
        }}
      />
      
      <div className="min-h-screen bg-slate-50">
        <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Administrator Paneli
                </h1>
                <p className="text-slate-600">
                  BiznesYordam platformasini boshqaring va hamkorlarni kuzatib boring.
                </p>
              </div>
              
              <div className="mt-4 lg:mt-0">
                <Badge variant="default" className="text-sm px-4 py-2">
                  <Settings className="w-4 h-4 mr-2" />
                  Administrator
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {overallStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Umumiy Hamkorlar</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {overallStats.totalPartners}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Umumiy Aylanma</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(parseFloat(overallStats.totalRevenue || '0'))}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Umumiy Buyurtmalar</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {overallStats.totalOrders}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">O'rtacha Foyda</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatCurrency(parseFloat(overallStats.avgProfit || '0'))}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pending Partners Alert */}
          {pendingPartners.length > 0 && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">
                      {pendingPartners.length} ta hamkor tasdiq kutmoqda
                    </h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Yangi hamkorlar ro'yxatdan o'tishni kutmoqda. Ularni ko'rib chiqing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-8 bg-white shadow-sm">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                data-testid="tab-dashboard"
              >
                <BarChart3 className="w-4 h-4" />
                Boshqaruv
              </TabsTrigger>
              <TabsTrigger 
                value="partners" 
                className="flex items-center gap-2 text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                data-testid="tab-partners"
              >
                <Users className="w-4 h-4" />
                Hamkorlar
              </TabsTrigger>
              <TabsTrigger 
                value="requests" 
                className="flex items-center gap-2 text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                data-testid="tab-requests"
              >
                <ClipboardList className="w-4 h-4" />
                So'rovlar
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="flex items-center gap-2 text-xs data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900"
                data-testid="tab-products"
              >
                <Zap className="w-4 h-4" />
                Product Hunter
              </TabsTrigger>
              <TabsTrigger 
                value="marketplace" 
                className="flex items-center gap-2 text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                data-testid="tab-marketplace"
              >
                <Globe className="w-4 h-4" />
                Marketplace
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="flex items-center gap-2 text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                data-testid="tab-chat"
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="contact-forms" 
                className="flex items-center gap-2 text-xs data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
                data-testid="tab-contact-forms"
              >
                <FileText className="w-4 h-4" />
                Hamkor Arizalari
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="flex items-center gap-2 text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                data-testid="tab-system"
              >
                <Settings className="w-4 h-4" />
                Tizim
              </TabsTrigger>
              {can('canManageAdmins') && (
                <TabsTrigger 
                  value="admins" 
                  className="flex items-center gap-2 text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                  data-testid="tab-admins"
                >
                  <Users className="w-4 h-4" />
                  Adminlar
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6" data-testid="content-dashboard">

              {/* Chuqur Tahlil va Ma'lumotlar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Eng Yaxshi Hamkorlar */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Eng Yaxshi Hamkorlar (Bu Oy)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData?.partnerPerformance?.slice(0, 5).map((partner: any, index: number) => (
                        <div key={partner.partnerId} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-amber-600 text-white' :
                              'bg-slate-300 text-slate-700'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">{partner.businessName}</h4>
                              <p className="text-sm text-slate-600">{partner.tier} rejasi</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">{formatCurrency(partner.revenue)}</p>
                            <p className="text-sm text-green-600">{partner.profitMargin}% foyda</p>
                            <p className="text-xs text-slate-500">{partner.ordersCount} buyurtma</p>
                          </div>
                        </div>
                      )) || []}
                    </div>
                  </CardContent>
                </Card>

                {/* Tezkor Harakatlar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Tezkor Harakatlar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Tasdiq Kutayotganlar ({pendingPartners.length})
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Yangi So'rovlar ({fulfillmentRequests.filter(r => r.status === 'pending').length})
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Diqqat Talab Etuvchi (3)
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Hisobot Eksport Qilish
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* So'nggi Faoliyat va Marketplace Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* So'nggi Faoliyat */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      So'nggi Faoliyat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Yangi hamkor tasdiqlandi</p>
                          <p className="text-xs text-slate-500">Megapolis Store - 5 daqiqa oldin</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Package className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Yangi mahsulot qo'shildi</p>
                          <p className="text-xs text-slate-500">Samarqand Tekstil - 12 daqiqa oldin</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">API xatoligi qayd etildi</p>
                          <p className="text-xs text-slate-500">Wildberries API - 25 daqiqa oldin</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Marketplace Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Marketplace Holati
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketplaceIntegrations.map((integration) => (
                        <div key={integration.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              integration.status === 'connected' ? 'bg-green-500' :
                              integration.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-slate-900">{integration.name}</p>
                              <p className="text-xs text-slate-500">{integration.partnersCount} hamkor</p>
                            </div>
                          </div>
                          <Badge variant={integration.apiHealth === 'healthy' ? 'default' : 'destructive'}>
                            {integration.apiHealth === 'healthy' ? 'Sog\'lom' : 'Xatolik'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Admin management */}
            {can('canManageAdmins') && (
              <TabsContent value="admins" className="space-y-6" data-testid="content-admins">
                <Card>
                  <CardHeader>
                    <CardTitle>Adminlar ro'yxati</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                        <Input placeholder="Username" value={newAdmin.username} onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })} />
                        <Input type="password" placeholder="Parol" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
                        <Input placeholder="Ism" value={newAdmin.firstName} onChange={e => setNewAdmin({ ...newAdmin, firstName: e.target.value })} />
                        <Input placeholder="Familiya" value={newAdmin.lastName} onChange={e => setNewAdmin({ ...newAdmin, lastName: e.target.value })} />
                        <Input placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
                      </div>
                      <Button
                        onClick={async () => {
                          try {
                            setIsLoadingAdmins(true);
                            const res = await apiRequest('POST', '/api/admins', newAdmin);
                            const data = await res.json();
                            toast({ title: 'Admin yaratildi' });
                            setNewAdmin({ username: '', password: '', firstName: '', lastName: '', email: '' });
                            // refresh list
                            const listRes = await apiRequest('GET', '/api/admins');
                            setAdmins(await listRes.json());
                          } catch (e: any) {
                            toast({ title: 'Xatolik', description: e.message, variant: 'destructive' });
                          } finally {
                            setIsLoadingAdmins(false);
                          }
                        }}
                        disabled={isLoadingAdmins || !newAdmin.username || !newAdmin.password}
                      >
                        Yangi admin qo'shish
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-600">
                            <th className="py-2 pr-4">Foydalanuvchi</th>
                            <th className="py-2 pr-4">Email</th>
                            <th className="py-2 pr-4">Ruxsatlar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.map((a) => (
                            <tr key={a.id} className="border-t">
                              <td className="py-2 pr-4">{a.firstName || ''} {a.lastName || ''} <span className="text-slate-500">(@{a.username})</span></td>
                              <td className="py-2 pr-4">{a.email || '-'}</td>
                              <td className="py-2 pr-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {[
                                    ['canManageAdmins','Adminlar'],
                                    ['canManageContent','Kontent'],
                                    ['canManageChat','Chat'],
                                    ['canViewReports','Hisobotlar'],
                                    ['canReceiveProducts','Qabul qilish'],
                                    ['canActivatePartners','Aktivatsiya'],
                                    ['canManageIntegrations','Integratsiya'],
                                  ].map(([key,label]) => (
                                    <label key={key as string} className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={Boolean(a.permissions?.[key as string])}
                                        onChange={async (e) => {
                                          const updated = { ...(a.permissions || {}), [key as string]: e.target.checked };
                                          try {
                                            const res = await apiRequest('POST', `/api/admins/${a.id}/permissions`, updated);
                                            const { permissions: perms } = await res.json();
                                            setAdmins(prev => prev.map(x => x.id === a.id ? { ...x, permissions: perms } : x));
                                            toast({ title: 'Ruxsat yangilandi' });
                                          } catch (err: any) {
                                            toast({ title: 'Xatolik', description: err.message, variant: 'destructive' });
                                          }
                                        }}
                                      />
                                      <span>{label}</span>
                                    </label>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="products" className="space-y-6" data-testid="content-products">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Product Hunter</h2>
                  <p className="text-slate-600">Global trendlarni kuzatish va yangi imkoniyatlarni aniqlash</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Yangilash
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Sozlamalar
                  </Button>
                </div>
              </div>
              
              {/* Admin-specific trending products controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Trend Hunter Boshqaruvi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Jami Mahsulotlar</h4>
                      <p className="text-2xl font-bold text-blue-600">1,247</p>
                      <p className="text-sm text-blue-700">+12% o'tgan haftadan</p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900">Yuqori Potensial</h4>
                      <p className="text-2xl font-bold text-green-600">89</p>
                      <p className="text-sm text-green-700">80%+ foyda potensiali</p>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-900">Aktiv So'rovlar</h4>
                      <p className="text-2xl font-bold text-purple-600">23</p>
                      <p className="text-sm text-purple-700">Hamkorlar tomonidan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <TrendingProducts />
            </TabsContent>

            <TabsContent value="partners" className="space-y-6" data-testid="content-partners">
              {/* Partners Section Header with Controls */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Hamkorlar Boshqaruvi</h2>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Hamkor qidirish..."
                    value={partnersFilter}
                    onChange={(e) => setPartnersFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-64"
                    data-testid="input-partners-filter"
                  />
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => exportPartnersMutation.mutate()}
                    disabled={exportPartnersMutation.isPending}
                    data-testid="button-export-partners"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {exportPartnersMutation.isPending ? 'Yuklanmoqda...' : 'Eksport'}
                  </Button>
                </div>
              </div>

              {/* Enhanced Partners Grid */}
              <div className="grid gap-6">
                {filteredPartners.map((partner: any) => (
                  <Card key={partner.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{partner.businessName}</h3>
                            <p className="text-sm text-slate-600">{partner.businessCategory}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={partner.isApproved ? "default" : "secondary"}>
                            {partner.isApproved ? "Faol" : "Kutilmoqda"}
                          </Badge>
                          <Badge variant="outline">{partner.pricingTier || 'Starter Pro'}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Basic Info Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Partner Info */}
                        <div className="lg:col-span-1 space-y-2">
                          <h4 className="font-semibold text-slate-700">Aloqa Ma'lumotlari</h4>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-400" />
                              {partner.userData?.firstName || 'N/A'} {partner.userData?.lastName || ''}
                            </p>
                            <p className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              {partner.userData?.email || 'N/A'}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-slate-400" />
                              {partner.userData?.phone || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Financial Info */}
                        <div className="lg:col-span-1 space-y-2">
                          <h4 className="font-semibold text-slate-700">Moliyaviy Ko'rsatkichlar</h4>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              Oylik: {formatCurrency(parseFloat(partner.monthlyRevenue || '0'))}
                            </p>
                            <p className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-500" />
                              Foyda: 18.5%
                            </p>
                            <p className="flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4 text-purple-500" />
                              Buyurtmalar: 234
                            </p>
                          </div>
                        </div>

                        {/* Products & Sales */}
                        <div className="lg:col-span-1 space-y-2">
                          <h4 className="font-semibold text-slate-700">Mahsulotlar</h4>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-orange-500" />
                              Jami: 156 mahsulot
                            </p>
                            <p className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Faol: 142
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-yellow-500" />
                              Kutilmoqda: 14
                            </p>
                          </div>
                        </div>

                        {/* Marketplace Status */}
                        <div className="lg:col-span-1 space-y-2">
                          <h4 className="font-semibold text-slate-700">Marketplace</h4>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Uzum Market
                            </p>
                            <p className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              Wildberries
                            </p>
                            <p className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              Yandex Market
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewPartner(partner)} data-testid={`button-view-${partner.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Batafsil Ko'rish
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleViewProducts(partner)} data-testid={`button-products-${partner.id}`}>
                            <Package className="w-4 h-4 mr-2" />
                            Mahsulotlar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              toast({
                                title: "To'lovlar bo'limi",
                                description: "To'lovlar tarixini ko'rish va boshqarish",
                              });
                            }}
                            data-testid={`button-payments-${partner.id}`}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            To'lovlar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleMarketplaceSettings(partner)} data-testid={`button-marketplace-${partner.id}`}>
                            <Globe className="w-4 h-4 mr-2" />
                            Marketplace
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setSelectedPartner(partner);
                              setShowApiDocumentationManager(true);
                            }}
                            data-testid={`button-api-docs-${partner.id}`}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            API Hujjatlar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setSelectedPartner(partner);
                              setShowExcelDataManager(true);
                            }}
                            data-testid={`button-excel-${partner.id}`}
                          >
                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                            Excel
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          {!partner.isApproved && (
                            <Button
                              size="sm"
                              onClick={() => approvePartnerMutation.mutate(partner.id)}
                              disabled={approvePartnerMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Tasdiqlash
                            </Button>
                          )}
                          {partner.isApproved && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedChatPartner(partner);
                                setActiveTab('chat');
                              }}
                              data-testid={`button-chat-${partner.id}`}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleEditPartner(partner)} data-testid={`button-edit-${partner.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Tahrirlash
                          </Button>
                        </div>
                      </div>

                      {/* Marketplace Integration Management */}
                      {partner.isApproved && (
                        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-slate-700">Marketplace Integratsiya Boshqaruvi</h4>
                            <Button 
                              size="sm" 
                              onClick={() => {
                                const marketplace = prompt("Marketplace tanlang (uzum/wildberries/yandex/ozon):");
                                const apiDocUrl = prompt("API hujjat URL kiriting:");
                                if (marketplace && apiDocUrl) {
                                  fetch(`/api/partners/${partner.id}/api-docs`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ marketplace, apiDocUrl })
                                  }).then(() => {
                                    toast({
                                      title: "Muvaffaqiyatli",
                                      description: "API hujjatlari yuklandi va hamkorga bildirishnoma yuborildi"
                                    });
                                  });
                                }
                              }}
                            >
                              API Hujjat Biriktirish
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-white border">
                              <CardContent className="pt-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">U</span>
                                    </div>
                                    <span className="font-medium">Uzum Market</span>
                                  </div>
                                  <Badge variant="default" className="bg-green-100 text-green-800">Ulangan</Badge>
                                </div>
                                <div className="space-y-2 text-xs text-slate-600">
                                  <p>API Key: ••••••••••••••45</p>
                                  <p>So'nggi Sync: 2 soat oldin</p>
                                  <p>Mahsulotlar: 89 / 156</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="w-full mt-3"
                                  onClick={() => {
                                    toast({
                                      title: "Uzum Market",
                                      description: "Sozlamalar oynasi ochilmoqda...",
                                    });
                                  }}
                                >
                                  <Settings className="w-3 h-3 mr-1" />
                                  Sozlash
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className="bg-white border">
                              <CardContent className="pt-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">W</span>
                                    </div>
                                    <span className="font-medium">Wildberries</span>
                                  </div>
                                  <Badge variant="secondary">Tayyorlanmoqda</Badge>
                                </div>
                                <div className="space-y-2 text-xs text-slate-600">
                                  <p>API Key: Kiritilmagan</p>
                                  <p>Status: Hujjatlar kutilmoqda</p>
                                  <p>Mahsulotlar: 0 / 156</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  className="w-full mt-3"
                                  onClick={() => {
                                    setSelectedPartner(partner);
                                    setSelectedMarketplace('Wildberries');
                                    setShowApiKeyForm(true);
                                  }}
                                  data-testid={`button-connect-${partner.id}-wildberries`}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Ulash
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className="bg-white border">
                              <CardContent className="pt-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">Y</span>
                                    </div>
                                    <span className="font-medium">Yandex Market</span>
                                  </div>
                                  <Badge variant="destructive">Xatolik</Badge>
                                </div>
                                <div className="space-y-2 text-xs text-slate-600">
                                  <p>API Key: ••••••••••••••78</p>
                                  <p>Status: Ulanish xatoligi</p>
                                  <p>Mahsulotlar: 45 / 156</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  className="w-full mt-3"
                                  onClick={() => {
                                    retryMarketplaceMutation.mutate(`${partner.id}-yandex`);
                                  }}
                                  disabled={retryMarketplaceMutation.isPending}
                                >
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  {retryMarketplaceMutation.isPending ? 'Urinilmoqda...' : 'Qayta Urinish'}
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {partners.length === 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-slate-500 py-8">
                        Hozircha hamkorlar yo'q
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6" data-testid="content-requests">
              {/* Requests Header with Filters */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">So'rovlar Boshqaruvi</h2>
                <div className="flex gap-3">
                  <select className="px-4 py-2 border rounded-lg">
                    <option value="">Barcha kategoriyalar</option>
                    <option value="product_placement">Mahsulot joylash</option>
                    <option value="activation">Aktivatsiya/Ro'yxat</option>
                    <option value="support">Yordam</option>
                  </select>
                  <select className="px-4 py-2 border rounded-lg">
                    <option value="">Barcha statuslar</option>
                    <option value="pending">Kutilmoqda</option>
                    <option value="in_review">Ko'rib chiqilmoqda</option>
                    <option value="approved">Tasdiqlangan</option>
                    <option value="rejected">Rad etilgan</option>
                  </select>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      try {
                        const requestsData = fulfillmentRequests.map(request => ({
                          'ID': request.id,
                          'Sarlavha': request.title,
                          'Hamkor': request.partner?.businessName || 'N/A',
                          'Status': request.status,
                          'Muhimlik': request.priority,
                          'Taxminiy narx': request.estimatedCost,
                          'Yaratilgan sana': new Date(request.createdAt).toLocaleDateString('uz-UZ')
                        }));
                        
                        const headers = Object.keys(requestsData[0] || {});
                        const csvContent = [
                          headers.join(','),
                          ...requestsData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
                        ].join('\n');
                        
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `so'rovlar_${new Date().toISOString().split('T')[0]}.csv`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        
                        toast({
                          title: "Eksport muvaffaqiyatli",
                          description: "So'rovlar Excel faylga yuklandi",
                        });
                      } catch (error) {
                        toast({
                          title: "Eksport xatoligi",
                          description: "So'rovlarni eksport qilishda xatolik yuz berdi",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Eksport
                  </Button>
                </div>
              </div>

              {/* Request Categories Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Mahsulot Joylash</p>
                        <p className="text-2xl font-bold text-blue-900">23</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Aktivatsiya</p>
                        <p className="text-2xl font-bold text-green-900">18</p>
                      </div>
                      <UserCheck className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Yordam</p>
                        <p className="text-2xl font-bold text-orange-900">12</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Jami Kutilmoqda</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {fulfillmentRequests.filter(r => r.status === 'pending').length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Requests Grid */}
              <div className="grid gap-6">
                {/* Product Placement Requests */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-500" />
                      Mahsulot Joylash So'rovlari
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fulfillmentRequests.slice(0, 3).map((request: any) => (
                      <div key={request.id} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">{request.title}</h4>
                              <p className="text-sm text-slate-600">{request.partnerData?.businessName || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Mahsulot tafsilotlari:</p>
                            <p className="font-medium">Smartfon Samsung Galaxy</p>
                            <p className="text-slate-600">Kategoriya: Elektronika</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Narx ma'lumotlari:</p>
                            <p className="font-medium">{formatCurrency(parseFloat(request.estimatedCost || '0'))}</p>
                            <p className="text-slate-600">Miqdor: 50 dona</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Marketplace:</p>
                            <p className="font-medium">Uzum Market</p>
                            <p className="text-slate-600">Kutilayotgan muddat: 5-7 kun</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t mt-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Ko'rish
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-2" />
                              Tahrirlash
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Izoh
                            </Button>
                          </div>
                          
                          <div className="flex gap-2">
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateFulfillmentMutation.mutate({ id: request.id, status: 'approved' })}
                                  disabled={updateFulfillmentMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Tasdiqlash
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateFulfillmentMutation.mutate({ id: request.id, status: 'rejected' })}
                                  disabled={updateFulfillmentMutation.isPending}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Rad etish
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Activation/Registration Requests */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-green-500" />
                      Aktivatsiya va Ro'yxatdan O'tish So'rovlari
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingPartners.slice(0, 2).map((partner: any) => (
                      <div key={partner.id} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Building className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">{partner.businessName}</h4>
                              <p className="text-sm text-slate-600">{partner.businessCategory}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Yangi</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Aloqa:</p>
                            <p className="font-medium">{partner.userData?.firstName} {partner.userData?.lastName}</p>
                            <p className="text-slate-600">{partner.userData?.email}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Biznes ma'lumotlari:</p>
                            <p className="font-medium">{formatCurrency(parseFloat(partner.monthlyRevenue || '0'))}</p>
                            <p className="text-slate-600">Oylik aylanma</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Tarif rejasi:</p>
                            <p className="font-medium">{partner.pricingTier}</p>
                            <p className="text-slate-600">Tanlangan paket</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t mt-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Hujjatlar
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-2" />
                              Tahrirlash
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Qo'ng'iroq
                            </Button>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => approvePartnerMutation.mutate(partner.id)}
                              disabled={approvePartnerMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Tasdiqlash
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="w-4 h-4 mr-2" />
                              Rad etish
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Support Requests */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      Yordam So'rovlari
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">API ulanish muammosi</h4>
                            <p className="text-sm text-slate-600">Tech Solutions LLC</p>
                          </div>
                        </div>
                        <Badge variant="destructive">Muhim</Badge>
                      </div>

                      <div className="text-sm text-slate-600 mb-4">
                        "Wildberries API bilan ulanishda xatolik yuz bermoqda. 401 Unauthorized xatosi qaytarilmoqda..."
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Batafsil
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Loglar
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Javob berish
                          </Button>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Uzatish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Advanced Analytics</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Platform Revenue</p>
                        <p className="text-3xl font-bold text-blue-900">₹2.4M</p>
                        <p className="text-sm text-green-600">+18% this month</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-green-600">Platform Profit</p>
                        <p className="text-3xl font-bold text-green-900">₹485K</p>
                        <p className="text-sm text-green-600">+25% this month</p>
                      </div>
                      <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Active Partners</p>
                        <p className="text-3xl font-bold text-purple-900">{overallStats?.totalPartners || 0}</p>
                        <p className="text-sm text-green-600">+12% this month</p>
                      </div>
                      <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Partner Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData?.partnerPerformance?.slice(0, 5).map((partner) => (
                        <div key={partner.partnerId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{partner.businessName}</h4>
                            <p className="text-sm text-slate-600">
                              {formatCurrency(partner.revenue)} • {partner.profitMargin}% margin
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={partner.tier === 'Enterprise Elite' ? 'default' : 'secondary'}>
                              {partner.tier}
                            </Badge>
                            <div className="text-right">
                              <p className="text-sm font-medium">{partner.ordersCount}</p>
                              <p className="text-xs text-slate-500">orders</p>
                            </div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-center text-slate-500 py-8">No performance data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      Revenue Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                        <p className="font-medium">Revenue Chart</p>
                        <p className="text-sm">Monthly trends visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Marketplace Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Marketplace Integrations</h2>
                <Button>
                  <Globe className="w-4 h-4 mr-2" />
                  Add Integration
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">U</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Uzum Market</h3>
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <Wifi className="w-3 h-3" />
                            Connected
                          </p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Healthy
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Partners:</span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Sync:</span>
                        <span className="font-medium">2 min ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Status:</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">W</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Wildberries</h3>
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <Wifi className="w-3 h-3" />
                            Connected
                          </p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                        Warning
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Partners:</span>
                        <span className="font-medium">32</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Sync:</span>
                        <span className="font-medium">15 min ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Status:</span>
                        <span className="text-yellow-600 font-medium">Slow Response</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">Y</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">Yandex Market</h3>
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <WifiOff className="w-3 h-3" />
                            Disconnected
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        Error
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Partners:</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Sync:</span>
                        <span className="font-medium">2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Status:</span>
                        <span className="text-red-600 font-medium">Connection Failed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Health Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-medium">API Performance</h4>
                          <p className="text-sm text-slate-600">Average response time: 250ms</p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Excellent
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Sync Status</h4>
                          <p className="text-sm text-slate-600">Last full sync: 30 minutes ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Force Sync
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management Tab */}
            <TabsContent value="data" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Data Management</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Products</p>
                        <p className="text-2xl font-bold text-slate-900">2,547</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Orders Today</p>
                        <p className="text-2xl font-bold text-slate-900">148</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Trending Items</p>
                        <p className="text-2xl font-bold text-slate-900">89</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Data Health</p>
                        <p className="text-2xl font-bold text-green-600">98%</p>
                      </div>
                      <Shield className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Product Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'Electronics', count: 856, trend: '+12%' },
                        { name: 'Fashion', count: 642, trend: '+8%' },
                        { name: 'Home & Garden', count: 498, trend: '+15%' },
                        { name: 'Sports', count: 325, trend: '+5%' },
                        { name: 'Books', count: 226, trend: '+3%' },
                      ].map((category) => (
                        <div key={category.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-900">{category.name}</h4>
                            <p className="text-sm text-slate-600">{category.count} products</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">{category.trend}</p>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Data Quality Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Product Data Completeness</span>
                        <span className="text-sm font-bold text-green-600">96%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Price Accuracy</span>
                        <span className="text-sm font-bold text-green-600">98%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Image Quality</span>
                        <span className="text-sm font-bold text-yellow-600">89%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Inventory Sync</span>
                        <span className="text-sm font-bold text-green-600">94%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Settings Tab */}
            <TabsContent value="system" className="space-y-6" data-testid="content-system">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Tizim Sozlamalari</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      try {
                        const response = await apiRequest('POST', '/api/system/backup', {});
                        const result = await response.json();
                        toast({
                          title: "Backup yaratildi",
                          description: `Backup ID: ${result.backup.id}`,
                        });
                      } catch (error) {
                        toast({
                          title: "Backup xatoligi",
                          description: "Backup yaratishda xatolik yuz berdi",
                          variant: "destructive",
                        });
                      }
                    }}
                    data-testid="button-system-backup"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Backup
                  </Button>
                  <Button 
                    onClick={async () => {
                      try {
                        const settings = {
                          commissionRates: {
                            'Starter Pro': '30-45%',
                            'Business Standard': '18-25%',
                            'Professional Plus': '12-18%',
                            'Enterprise Elite': '8-15%'
                          },
                          updatedBy: 'admin'
                        };
                        
                        const response = await apiRequest('POST', '/api/system/settings', settings);
                        const result = await response.json();
                        toast({
                          title: "Sozlamalar saqlandi",
                          description: "Tizim sozlamalari muvaffaqiyatli yangilandi",
                        });
                      } catch (error) {
                        toast({
                          title: "Sozlash xatoligi",
                          description: "Sozlamalarni saqlashda xatolik yuz berdi",
                          variant: "destructive",
                        });
                      }
                    }}
                    data-testid="button-system-save"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    O'zgarishlarni Saqlash
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Komissiya Sozlamalari
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Starter Pro</span>
                        <span className="text-slate-600">30-45%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Business Standard</span>
                        <span className="text-slate-600">18-25%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Professional Plus</span>
                        <span className="text-slate-600">12-18%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Enterprise Elite</span>
                        <span className="text-slate-600">8-15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Platforma Salomatligi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Ma'lumotlar Bazasi</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Sog'lom
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">API Xizmatlari</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Faol
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium">Kesh Tizimi</span>
                      </div>
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                        Ogohlantirish
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Xotira</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        85% Bo'sh
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6" data-testid="content-chat">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Admin Chat Markazi</h2>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Load all partners for chat
                      queryClient.invalidateQueries({ queryKey: ['/api/admin/chat-partners'] });
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Yangilash
                  </Button>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Partners List */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Hamkorlar ({chatPartners.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {chatPartners.map((partner) => (
                        <div
                          key={partner.id}
                          onClick={() => setSelectedChatPartner(partner)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedChatPartner?.id === partner.id
                              ? 'bg-blue-100 border-blue-300'
                              : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {partner.businessName?.charAt(0) || 'H'}
                                </span>
                              </div>
                              {partner.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 truncate">
                                {partner.businessName}
                              </h4>
                              <p className="text-sm text-slate-600 truncate">
                                {partner.userData?.firstName} {partner.userData?.lastName}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Messages */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      {selectedChatPartner ? `Chat: ${selectedChatPartner.businessName}` : 'Chat'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedChatPartner ? (
                      <div className="flex flex-col h-96">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-50 rounded-lg">
                          {chatMessages.length > 0 ? (
                            chatMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                                    msg.sender === 'admin'
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-white border border-slate-200'
                                  }`}
                                >
                                  {msg.messageType === 'file' ? (
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4" />
                                      <a
                                        href={msg.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline hover:no-underline"
                                      >
                                        {msg.fileName || 'Fayl'}
                                      </a>
                                    </div>
                                  ) : (
                                    <p className="text-sm">{msg.message}</p>
                                  )}
                                  <p className={`text-xs mt-1 ${
                                    msg.sender === 'admin' ? 'text-blue-100' : 'text-slate-500'
                                  }`}>
                                    {msg.timestamp}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-slate-500 py-8">
                              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                              <p>Hali xabar yo'q</p>
                            </div>
                          )}
                        </div>

                        {/* Message Input */}
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Xabar yozing..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (newMessage.trim()) {
                                  sendChatMessage(selectedChatPartner.id, newMessage);
                                }
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              if (newMessage.trim()) {
                                sendChatMessage(selectedChatPartner.id, newMessage);
                              }
                            }}
                            disabled={!newMessage.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 py-16">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p className="text-lg font-medium mb-2">Chat tanlang</p>
                        <p className="text-sm">Hamkor bilan suhbatlashish uchun chap tomondan hamkorni tanlang</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-6" data-testid="content-products">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Product Hunter - Admin</h2>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      try {
                        // Export trending products data
                        const productsData = [
                          {
                            'Mahsulot nomi': 'Smart LED Strip 5M RGB WiFi',
                            'Kategoriya': 'Elektronika',
                            'Trend ball': '95',
                            'Raqobat': 'O\'rtacha',
                            'Narx': '330,000 so\'m',
                            'Foyda': '362,000,000 so\'m',
                            'Qidiruv hajmi': '12,500',
                            'Manbaa': 'Amazon'
                          },
                          {
                            'Mahsulot nomi': 'Wireless Earbuds Pro',
                            'Kategoriya': 'Audio',
                            'Trend ball': '88',
                            'Raqobat': 'Yuqori',
                            'Narx': '584,000 so\'m',
                            'Foyda': '445,000,000 so\'m',
                            'Qidiruv hajmi': '8,900',
                            'Manbaa': 'AliExpress'
                          }
                        ];
                        
                        const headers = Object.keys(productsData[0]);
                        const csvContent = [
                          headers.join(','),
                          ...productsData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
                        ].join('\n');
                        
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `product_hunter_${new Date().toISOString().split('T')[0]}.csv`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        
                        toast({
                          title: "Eksport muvaffaqiyatli",
                          description: "Product Hunter ma'lumotlari Excel faylga yuklandi",
                        });
                      } catch (error) {
                        toast({
                          title: "Eksport xatoligi",
                          description: "Ma'lumotlarni eksport qilishda xatolik yuz berdi",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Eksport
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Sozlamalar
                  </Button>
                </div>
              </div>

              {/* Admin Product Hunter Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">Jami Trendlar</p>
                        <p className="text-2xl font-bold text-yellow-900">1,248</p>
                      </div>
                      <Zap className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Bugun Qo'shilgan</p>
                        <p className="text-2xl font-bold text-green-900">67</p>
                      </div>
                      <Plus className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Eng Yuqori Trend</p>
                        <p className="text-2xl font-bold text-blue-900">95</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Hamkor So'rovlari</p>
                        <p className="text-2xl font-bold text-purple-900">34</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

            </TabsContent>

            {/* Contact Forms Tab */}
            <TabsContent value="contact-forms" className="space-y-6" data-testid="content-contact-forms">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Hamkor Arizalari</h2>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      queryClient.invalidateQueries({ queryKey: ['/api/contact-forms'] });
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Yangilash
                  </Button>
                </div>
              </div>

              {/* Contact Forms List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Yangi Hamkor Arizalari ({contactForms.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contactForms.length > 0 ? (
                      contactForms.map((form) => (
                        <div key={form.id} className="border rounded-lg p-4 hover:bg-slate-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {form.firstName} {form.lastName}
                                </h3>
                                <Badge variant={form.status === 'new' ? 'default' : 'secondary'}>
                                  {form.status === 'new' ? 'Yangi' : form.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><strong>Email:</strong> {form.email}</p>
                                  <p><strong>Telefon:</strong> {form.phone}</p>
                                  <p><strong>Biznes turi:</strong> {form.businessCategory}</p>
                                </div>
                                <div>
                                  <p><strong>Oylik aylanma:</strong> {formatCurrency(parseFloat(form.monthlyRevenue))}</p>
                                  <p><strong>Sana:</strong> {new Date(form.createdAt).toLocaleDateString('uz-UZ')}</p>
                                  {form.notes && (
                                    <p><strong>Izoh:</strong> {form.notes}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleContactFormAction(form.id, 'contacted')}
                                disabled={form.status !== 'new'}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                Bog'lanish
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleContactFormAction(form.id, 'approved')}
                                disabled={form.status !== 'new'}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Tasdiqlash
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleContactFormAction(form.id, 'rejected')}
                                disabled={form.status !== 'new'}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Rad etish
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Hozircha yangi arizalar yo'q</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Marketplace Tab */}
            <TabsContent value="marketplace" className="space-y-6" data-testid="content-marketplace">
              <MarketplaceApiConfig />
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6" data-testid="content-system">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Tizim Boshqaruvi</h2>
                <div className="flex gap-3">
                  <Button variant="outline" data-testid="button-add-marketplace">
                    <Plus className="w-4 h-4 mr-2" />
                    Yangi Marketplace
                  </Button>
                  <Button variant="outline" data-testid="button-global-settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Global Sozlamalar
                  </Button>
                  <Button variant="outline" data-testid="button-api-logs">
                    <Database className="w-4 h-4 mr-2" />
                    API Loglar
                  </Button>
                </div>
              </div>

              {/* Marketplace Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-blue-600">Ulangan Marketplace</div>
                        <div className="text-3xl font-bold text-blue-900">3</div>
                        <div className="text-sm text-green-600">+1 bu oy</div>
                      </div>
                      <Globe className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-green-600">Jami Mahsulotlar</div>
                        <div className="text-3xl font-bold text-green-900">2,847</div>
                        <div className="text-sm text-green-600">+245 bu hafta</div>
                      </div>
                      <Package className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-purple-600">Bugungi Sync</div>
                        <div className="text-3xl font-bold text-purple-900">156</div>
                        <div className="text-sm text-green-600">So'nggi 24 soat</div>
                      </div>
                      <RotateCcw className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-orange-600">API Xatoliklar</div>
                        <div className="text-3xl font-bold text-orange-900">12</div>
                        <div className="text-sm text-red-600">Bu kun ichida</div>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Marketplace Management Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Uzum Market */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">U</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Uzum Market</h3>
                          <div className="text-sm text-slate-600">uzbekistan.uzum.uz</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Faol</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">Hamkorlar:</div>
                        <div className="font-semibold text-lg">67</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Mahsulotlar:</div>
                        <div className="font-semibold text-lg">1,234</div>
                      </div>
                      <div>
                        <div className="text-slate-500">API Status:</div>
                        <div className="font-semibold text-green-600">Sog'lom</div>
                      </div>
                      <div>
                        <div className="text-slate-500">So'nggi Sync:</div>
                        <div className="font-semibold">3 min oldin</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sync muvaffaqiyati:</span>
                        <span className="font-medium">98.5%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <Button size="sm" variant="outline" data-testid="button-uzum-view">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-uzum-settings">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-uzum-sync">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Wildberries */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">W</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Wildberries</h3>
                          <div className="text-sm text-slate-600">wildberries.ru</div>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Xatolik</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">Hamkorlar:</div>
                        <div className="font-semibold text-lg">42</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Mahsulotlar:</div>
                        <div className="font-semibold text-lg">876</div>
                      </div>
                      <div>
                        <div className="text-slate-500">API Status:</div>
                        <div className="font-semibold text-red-600">Xatolik</div>
                      </div>
                      <div>
                        <div className="text-slate-500">So'nggi Sync:</div>
                        <div className="font-semibold">1 soat oldin</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sync muvaffaqiyati:</span>
                        <span className="font-medium">78.2%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '78.2%' }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <Button size="sm" variant="outline" data-testid="button-wildberries-view">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-wildberries-settings">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" data-testid="button-wildberries-reconnect">
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Yandex Market */}
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Y</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Yandex Market</h3>
                          <div className="text-sm text-slate-600">market.yandex.ru</div>
                        </div>
                      </div>
                      <Badge variant="destructive">Xatolik</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">Hamkorlar:</div>
                        <div className="font-semibold text-lg">25</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Mahsulotlar:</div>
                        <div className="font-semibold text-lg">543</div>
                      </div>
                      <div>
                        <div className="text-slate-500">API Status:</div>
                        <div className="font-semibold text-red-600">Xatolik</div>
                      </div>
                      <div>
                        <div className="text-slate-500">So'nggi Sync:</div>
                        <div className="font-semibold text-red-600">2 soat oldin</div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-red-800">API Xatoligi</div>
                          <div className="text-xs text-red-600">401 Unauthorized - API kalit yangilanishi kerak</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button size="sm" variant="destructive">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6" data-testid="content-system">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Tizim Sozlamalari</h2>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Backup
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Global
                  </Button>
                </div>
              </div>

              {/* System Settings Tabs */}
              <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">Umumiy</TabsTrigger>
                  <TabsTrigger value="spt">SPT Tariflar</TabsTrigger>
                  <TabsTrigger value="commission">Komissiyalar</TabsTrigger>
                  <TabsTrigger value="backup">Backup</TabsTrigger>
                </TabsList>

                {/* General System Settings */}
                <TabsContent value="general" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Umumiy Tizim Sozlamalari</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">Komissiya Sozlamalari</h4>
                          <div className="space-y-3">
                            <div>
                              <Label>Standart Komissiya Stavkasi (%)</Label>
                              <Input type="number" step="0.01" defaultValue="30" />
                            </div>
                            <div>
                              <Label>Avtomatik Hamkor Tasdiqlash</Label>
                              <select className="w-full px-3 py-2 border rounded-lg">
                                <option value="false">O'chiq</option>
                                <option value="true">Yoqiq</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold">SPT Sozlamalari</h4>
                          <div className="space-y-3">
                            <div>
                              <Label>Standart SPT Narxi (so'm)</Label>
                              <Input type="number" defaultValue="3500" />
                            </div>
                            <div>
                              <Label>Minimum Buyurtma Miqdori</Label>
                              <Input type="number" defaultValue="1" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Sozlamalarni Saqlash
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SPT Costs Management */}
                <TabsContent value="spt" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">SPT Tariflar Boshqaruvi</h3>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Yangi Tarif
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Jami Tariflar</p>
                            <p className="text-2xl font-bold text-blue-900">{sptCostsList.length}</p>
                          </div>
                          <Package className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Faol Tariflar</p>
                            <p className="text-2xl font-bold text-green-900">{sptCostsList.filter((x:any)=>x.active).length}</p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-600">O'rtacha Narx</p>
                            <p className="text-2xl font-bold text-orange-900">{(() => { const a=sptCostsList.filter((x:any)=>Number(x.price)>0).map((x:any)=>Number(x.price)); return a.length? Math.round(a.reduce((s,n)=>s+n,0)/a.length):0; })()}</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>SPT Tariflar Ro'yxati</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sptCostsList.map((item:any) => (
                          <div key={item.id || JSON.stringify(item)} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{item.name || item.title || item.category || 'Tarif'}</h4>
                                <p className="text-sm text-slate-600">{item.marketplace || 'all'} • {item.category || 'category'} {item.weight ? `• ${item.weight}kg` : ''}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-bold text-lg">{item.price ? `${item.price} so'm` : '-'}</p>
                                  <Badge variant="default">{item.active ? 'Faol' : 'Ochiq'}</Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="destructive" disabled={!can('canManageIntegrations') || !item.id} onClick={async()=>{
                                    if(!item.id) return;
                                    try{
                                      await apiRequest('DELETE', `/api/spt-costs/${item.id}`);
                                      const res = await apiRequest('GET','/api/spt-costs');
                                      setSptCostsList(await res.json());
                                      toast({title:'O\'chirildi'});
                                    }catch(err:any){
                                      toast({title:'Xatolik', description: err.message, variant:'destructive'});
                                    }
                                  }}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {sptCostsList.length===0 && (
                          <div className="text-slate-500 text-sm">Hozircha tariflar yo'q</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Yangi SPT Tarif qo'shish (JSON)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea rows={6} value={newSptJson} onChange={(e)=>setNewSptJson(e.target.value)} />
                      <Button disabled={!can('canManageIntegrations')} onClick={async()=>{
                        try{
                          const body = JSON.parse(newSptJson);
                          await apiRequest('POST','/api/spt-costs', body);
                          const res = await apiRequest('GET','/api/spt-costs');
                          setSptCostsList(await res.json());
                          toast({title:'Tarif qo\'shildi'});
                        }catch(err:any){
                          toast({title:'Xatolik', description: err.message, variant:'destructive'});
                        }
                      }}>Saqlash</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Commission Settings */}
                <TabsContent value="commission" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Tarif Komissiya Sozlamalari</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">Jami Sozlamalar</p>
                            <p className="text-2xl font-bold text-purple-900">{commissionList.length}</p>
                          </div>
                          <CreditCard className="h-8 w-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Maxsus Kelishuvlar</p>
                            <p className="text-2xl font-bold text-green-900">3</p>
                          </div>
                          <Star className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">O'rtacha Stavka</p>
                            <p className="text-2xl font-bold text-blue-900">22%</p>
                          </div>
                          <Award className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Starter Pro Tier */}
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-green-700">Starter Pro</CardTitle>
                        <p className="text-sm text-slate-600">Risksiz tarif - 0 so'm</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">0-10M so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="45" className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">10M-50M so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="35" className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">50M+ so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="30" className="h-8" />
                        </div>
                        <Button size="sm" className="w-full mt-3" disabled={!can('canManageIntegrations')}>
                          <Save className="w-4 h-4 mr-2" />
                          Saqlash
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Business Standard Tier */}
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-700">Business Standard</CardTitle>
                        <p className="text-sm text-slate-600">4.5M so'm fiksa</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">0-20M so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="25" className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">20M-100M so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="20" className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">100M+ so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="18" className="h-8" />
                        </div>
                        <Button size="sm" className="w-full mt-3" disabled={!can('canManageIntegrations')}>
                          <Save className="w-4 h-4 mr-2" />
                          Saqlash
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Professional Plus Tier */}
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-purple-700">Professional Plus</CardTitle>
                        <p className="text-sm text-slate-600">8.5M so'm fiksa</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">0-50M so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="20" className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">50M-200M so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="17" className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">200M+ so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="15" className="h-8" />
                        </div>
                        <Button size="sm" className="w-full mt-3" disabled={!can('canManageIntegrations')}>
                          <Save className="w-4 h-4 mr-2" />
                          Saqlash
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Enterprise Elite Tier */}
                    <Card className="border-amber-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-amber-700">Enterprise Elite</CardTitle>
                        <p className="text-sm text-slate-600">Kelishuv asosida</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">0-100M so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="18" className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">100M-500M so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="15" className="h-8" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">500M+ so'm uchun foiz (%)</Label>
                          <Input type="number" defaultValue="12" className="h-8" />
                        </div>
                        <Button size="sm" className="w-full mt-3" disabled={!can('canManageIntegrations')}>
                          <Save className="w-4 h-4 mr-2" />
                          Saqlash
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Joriy Komissiya Sozlamalari</CardTitle>
                      <p className="text-sm text-slate-600">Har bir tarif uchun joriy belgilangan komissiya foizlari</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {commissionList.map((item:any) => (
                          <div key={item.id || JSON.stringify(item)} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{item.name || item.category || item.marketplace || 'Komissiya'}</h4>
                                <p className="text-sm text-slate-600">{item.partnerId ? `Hamkor: ${item.partnerId}` : 'Barcha hamkorlar'} • {item.category || 'category'} • {item.marketplace || 'all'}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="font-bold text-lg">{item.rate ? `${Math.round(Number(item.rate)*100)}%` : '-'}</p>
                                  <Badge variant="default">{item.active ? 'Faol' : 'Nofaol'}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {commissionList.length===0 && (
                          <div className="text-slate-500 text-sm">Hozircha komissiya sozlamalari yo'q</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Backup Management */}
                <TabsContent value="backup" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tizim Backup Boshqaruvi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800">Avtomatik Backup</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Tizim har kuni soat 02:00 da avtomatik backup yaratadi. Oxirgi backup: bugun 02:15.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Button 
                          size="lg" 
                          className="h-20 flex-col gap-2"
                          onClick={async () => {
                            try {
                              const response = await apiRequest('POST', '/api/system/backup');
                              const result = await response.json();
                              
                              toast({
                                title: "Backup yaratildi",
                                description: `Backup muvaffaqiyatli yaratildi: ${result.backup.size}`,
                              });
                            } catch (error) {
                              toast({
                                title: "Backup xatoligi",
                                description: "Backup yaratishda xatolik yuz berdi",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Database className="w-6 h-6" />
                          Zudlik bilan Backup Yaratish
                        </Button>

                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="h-20 flex-col gap-2"
                          onClick={() => {
                            toast({
                              title: "Backup'lar ro'yxati",
                              description: "Backup'lar ro'yxati ochilmoqda...",
                            });
                          }}
                        >
                          <FileText className="w-6 h-6" />
                          Backup'lar Tarixi
                        </Button>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">So'nggi Backup'lar</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium">2025-01-15_02-15_full_backup.sql</p>
                              <p className="text-sm text-slate-600">To'liq tizim backup • 2.8 MB</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Yuklab olish
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium">2025-01-14_02-15_full_backup.sql</p>
                              <p className="text-sm text-slate-600">To'liq tizim backup • 2.7 MB</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Yuklab olish
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Tasdiq Kutayotgan Hamkorlar</h2>
              
              <div className="grid gap-6">
                {pendingPartners.map((partner: any) => (
                  <Card key={partner.id} className="border-yellow-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {partner.businessName}
                            </h3>
                            <Badge variant="secondary">Kutilmoqda</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                            <div>
                              <p><strong>Ism:</strong> {partner.userData?.firstName || 'N/A'} {partner.userData?.lastName || ''}</p>
                              <p><strong>Email:</strong> {partner.userData?.email || 'N/A'}</p>
                              <p><strong>Telefon:</strong> {partner.userData?.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <p><strong>Kategoriya:</strong> {partner.businessCategory}</p>
                              <p><strong>Oylik aylanma:</strong> {formatCurrency(parseFloat(partner.monthlyRevenue || '0'))}</p>
                              <p><strong>Tarif rejasi:</strong> {partner.pricingTier}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => approvePartnerMutation.mutate(partner.id)}
                            disabled={approvePartnerMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Tasdiqlash
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={approvePartnerMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rad etish
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {pendingPartners.length === 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Barcha hamkorlar tasdiqlangan
                        </h3>
                        <p className="text-slate-600">
                          Hozircha tasdiq kutayotgan hamkorlar yo'q
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>

      {/* Partner Details Modal */}
    {showPartnerDetails && selectedPartner && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedPartner.businessName} - Batafsil Ma'lumot
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPartnerDetails(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Biznes Ma'lumotlari
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Biznes nomi</Label>
                    <p className="text-lg font-semibold">{selectedPartner.businessName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Kategoriya</Label>
                    <p>{selectedPartner.businessCategory}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Oylik aylanma</Label>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(parseFloat(selectedPartner.monthlyRevenue || '0'))}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Tarif rejasi</Label>
                    <Badge variant={selectedPartner.pricingTier === 'premium' ? 'default' : 'secondary'}>
                      {selectedPartner.pricingTier}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Status</Label>
                    <Badge variant={selectedPartner.isApproved ? 'default' : 'destructive'}>
                      {selectedPartner.isApproved ? 'Tasdiqlangan' : 'Kutilmoqda'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Shaxsiy Ma'lumotlar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">To'liq ism</Label>
                    <p className="text-lg">
                      {selectedPartner.userData?.firstName || 'N/A'} {selectedPartner.userData?.lastName || ''}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Email</Label>
                    <p className="text-blue-600">{selectedPartner.userData?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Telefon</Label>
                    <p>{selectedPartner.userData?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Ro'yxatdan o'tgan</Label>
                    <p>{new Date(selectedPartner.createdAt || '2024-01-01').toLocaleDateString('uz-UZ')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Statistikalar va Faoliyat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-600">Jami Buyurtmalar</div>
                    <div className="text-2xl font-bold text-blue-900">47</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-green-600">Muvaffaqiyatli</div>
                    <div className="text-2xl font-bold text-green-900">42</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-orange-600">Jarayonda</div>
                    <div className="text-2xl font-bold text-orange-900">3</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-purple-600">Bekor qilingan</div>
                    <div className="text-2xl font-bold text-purple-900">2</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketplace Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Marketplace Integratsiyalari
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">U</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Uzum Market</h4>
                        <p className="text-sm text-slate-600">API ulangan</p>
                      </div>
                    </div>
                    <Badge variant="default">Faol</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">W</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Wildberries</h4>
                        <p className="text-sm text-slate-600">API kutilmoqda</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Kutilmoqda</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowPartnerDetails(false);
                    setShowPartnerEdit(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Tahrirlash
                </Button>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat Boshlash
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Hisobot Yuklab Olish
                </Button>
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowPartnerDetails(false)}
              >
                Yopish
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Partner Edit Modal */}
    {showPartnerEdit && selectedPartner && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedPartner.businessName} - Tahrirlash
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPartnerEdit(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Biznes nomi</Label>
                <Input defaultValue={selectedPartner.businessName} />
              </div>
              <div>
                <Label>Kategoriya</Label>
                <select className="w-full px-3 py-2 border rounded-lg" defaultValue={selectedPartner.businessCategory}>
                  <option value="electronics">Elektronika</option>
                  <option value="clothing">Kiyim-kechak</option>
                  <option value="home">Uy jihozlari</option>
                  <option value="beauty">Go'zallik</option>
                </select>
              </div>
              <div>
                <Label>Tarif rejasi</Label>
                <select className="w-full px-3 py-2 border rounded-lg" defaultValue={selectedPartner.pricingTier}>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <Label>Status</Label>
                <select className="w-full px-3 py-2 border rounded-lg" defaultValue={selectedPartner.isApproved ? 'approved' : 'pending'}>
                  <option value="pending">Kutilmoqda</option>
                  <option value="approved">Tasdiqlangan</option>
                  <option value="rejected">Rad etilgan</option>
                </select>
              </div>
              <div>
                <Label>Joriy komissiya (%)</Label>
                <Input value={commissionOverride} onChange={(e) => setCommissionOverride(e.target.value)} placeholder={selectedPartner.commissionRate || 'masalan: 0.22'} />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      if (!commissionOverride) return;
                      const res = await apiRequest('PUT', `/api/partners/${selectedPartner.id}/commission`, { commissionRate: commissionOverride });
                      const data = await res.json();
                      toast({ title: 'Komissiya yangilandi' });
                      setSelectedPartner({ ...selectedPartner, commissionRate: data.commissionRate });
                    } catch (err: any) {
                      toast({ title: 'Xatolik', description: err.message, variant: 'destructive' });
                    }
                  }}
                >
                  Komissiyani yangilash
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline"
                onClick={() => setShowPartnerEdit(false)}
              >
                Bekor qilish
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "O'zgarishlar saqlandi",
                    description: "Hamkor ma'lumotlari muvaffaqiyatli yangilandi",
                  });
                  setShowPartnerEdit(false);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Saqlash
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Partner Products Modal */}
    {showPartnerProducts && selectedPartner && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedPartner.businessName} - Mahsulotlar
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPartnerProducts(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Jami Mahsulotlar</p>
                      <p className="text-2xl font-bold text-blue-900">23</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Faol Mahsulotlar</p>
                      <p className="text-2xl font-bold text-green-900">18</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Kutayotgan</p>
                      <p className="text-2xl font-bold text-orange-900">5</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Smart LED Strip 5M RGB WiFi</h4>
                    <p className="text-sm text-slate-600">Kategoriya: Elektronika • SKU: LED-5M-RGB-001</p>
                    <p className="text-sm text-green-600 font-medium mt-1">45,000 so'm</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="default">Faol</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Wireless Bluetooth Earbuds</h4>
                    <p className="text-sm text-slate-600">Kategoriya: Audio • SKU: EAR-BT-PRO-002</p>
                    <p className="text-sm text-green-600 font-medium mt-1">89,000 so'm</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">Kutilmoqda</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline"
                onClick={() => setShowPartnerProducts(false)}
              >
                Yopish
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}