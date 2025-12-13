import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatCurrency } from '@/lib/currency';
import {
  Users, MessageSquare, Bell, Ban, TrendingUp, DollarSign, Package, Eye, Send,
  CheckCircle, AlertTriangle, BarChart3, Mail, Phone, Building, MapPin, Calendar,
  Crown, Trash2, ShoppingCart, Zap
} from 'lucide-react';

import { AI_MANAGER_PLANS } from '../../../NEW_PRICING_CONFIG';

interface Partner {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  pricingTier: string;
  approved: boolean; // Changed from isApproved to match backend
  isActive: boolean;
  joinedAt: string;
  totalRevenue?: number;
  totalOrders?: number;
  totalProducts?: number;
  commissionPaid?: number;
  planType?: string;
  aiPlanCode?: string;
  aiEnabled?: boolean;
}

const TIER_NAMES: Record<string, string> = {
  starter_pro: 'Starter Pro',
  business_standard: 'Business Standard',
  professional_plus: 'Professional Plus',
  enterprise_elite: 'Enterprise Elite'
};

const getPlanTypeLabel = (planType?: string) => {
  if (!planType || planType === 'local_full_service') return 'Local Full-service';
  if (planType === 'remote_ai_saas') return 'Remote AI Manager SaaS';
  return planType;
};

const getAIPlanInfo = (partner: Partner): string | null => {
  if (partner.planType !== 'remote_ai_saas' || !partner.aiPlanCode) return null;
  const plan = AI_MANAGER_PLANS[partner.aiPlanCode as keyof typeof AI_MANAGER_PLANS];
  if (!plan) return partner.aiPlanCode;
  return `${plan.name} - $${plan.monthlyFee}/oy`;
};

export function AdminPartnersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ['/api/admin/partners'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/partners');
      return response.json();
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      console.log('🔄 Approving partner:', partnerId);
      const response = await apiRequest('PUT', `/api/admin/partners/${partnerId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "✅ Tasdiqlandi!",
        description: "Hamkor muvaffaqiyatli tasdiqlandi"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/partners'] });
    },
    onError: (error: Error) => {
      console.error('❌ Approve error:', error);
      toast({ 
        title: "❌ Xatolik",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const blockMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      console.log('🔄 Blocking partner:', partnerId);
      const response = await apiRequest('PUT', `/api/admin/partners/${partnerId}/block`);
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "🚫 Bloklandi",
        description: "Hamkor bloklandi"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/partners'] });
    },
    onError: (error: Error) => {
      console.error('❌ Block error:', error);
      toast({ 
        title: "❌ Xatolik",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { partnerId: string; subject: string; body: string }) => {
      const response = await apiRequest('POST', '/api/admin/notifications/send', data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Yuborildi!" });
      setMessageSubject('');
      setMessageBody('');
      setShowMessageModal(false);
    }
  });

  const sendBulkMessageMutation = useMutation({
    mutationFn: async (data: { subject: string; body: string }) => {
      const response = await apiRequest('POST', '/api/admin/notifications/broadcast', data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Ommaviy xabar yuborildi!" });
      setMessageSubject('');
      setMessageBody('');
      setShowBulkMessageModal(false);
    }
  });

  const filteredPartners = partners.filter(p =>
    p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: partners.length,
    approved: partners.filter(p => p.approved).length,
    pending: partners.filter(p => !p.approved).length,
    active: partners.filter(p => p.isActive).length,
    blocked: partners.filter(p => !p.isActive).length
  };

  const statCards = [
    { label: 'Jami', value: stats.total, icon: Users, cardClass: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200', textClass: 'text-blue-700', valueClass: 'text-blue-900', iconClass: 'text-blue-600' },
    { label: 'Tasdiqlangan', value: stats.approved, icon: CheckCircle, cardClass: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200', textClass: 'text-green-700', valueClass: 'text-green-900', iconClass: 'text-green-600' },
    { label: 'Kutilmoqda', value: stats.pending, icon: AlertTriangle, cardClass: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200', textClass: 'text-orange-700', valueClass: 'text-orange-900', iconClass: 'text-orange-600' },
    { label: 'Faol', value: stats.active, icon: Zap, cardClass: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200', textClass: 'text-purple-700', valueClass: 'text-purple-900', iconClass: 'text-purple-600' },
    { label: 'Bloklangan', value: stats.blocked, icon: Ban, cardClass: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200', textClass: 'text-red-700', valueClass: 'text-red-900', iconClass: 'text-red-600' }
  ];

  const quickStats = [
    { label: 'Aylanma', getValue: (p: Partner) => formatCurrency(p.totalRevenue || 0), icon: DollarSign, cardClass: 'bg-green-50 border-green-200', iconClass: 'text-green-600', textClass: 'text-green-700', valueClass: 'text-green-900' },
    { label: 'Buyurtmalar', getValue: (p: Partner) => p.totalOrders || 0, icon: ShoppingCart, cardClass: 'bg-blue-50 border-blue-200', iconClass: 'text-blue-600', textClass: 'text-blue-700', valueClass: 'text-blue-900' },
    { label: 'Mahsulotlar', getValue: (p: Partner) => p.totalProducts || 0, icon: Package, cardClass: 'bg-purple-50 border-purple-200', iconClass: 'text-purple-600', textClass: 'text-purple-700', valueClass: 'text-purple-900' },
    { label: 'Komissiya', getValue: (p: Partner) => formatCurrency(p.commissionPaid || 0), icon: TrendingUp, cardClass: 'bg-amber-50 border-amber-200', iconClass: 'text-amber-600', textClass: 'text-amber-700', valueClass: 'text-amber-900' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className={stat.cardClass}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textClass}`}>{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.valueClass}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.iconClass} opacity-50`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-4 flex gap-4">
          <Input
            placeholder="Qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => setShowBulkMessageModal(true)}>
            <Send className="w-4 h-4 mr-2" />
            Ommaviy Xabar
          </Button>
        </CardContent>
      </Card>

      {/* Partners List */}
      <div className="grid gap-4">
        {filteredPartners.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        {p.businessName}
                        {!p.approved && <Badge variant="secondary">Kutilmoqda</Badge>}
                        {!p.isActive && <Badge variant="destructive">Bloklangan</Badge>}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {p.ownerName}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {getPlanTypeLabel((p as any).planType)}
                        </Badge>
                        {getAIPlanInfo(p as any) && (
                          <Badge variant="outline" className="text-xs">
                            {getAIPlanInfo(p as any)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">
                      <Crown className="w-3 h-3 mr-1" />
                      {TIER_NAMES[p.pricingTier] || p.pricingTier || 'Tarif yo\'q'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{p.email}</div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{p.phone}</div>
                    <div className="flex items-center gap-2 col-span-2"><MapPin className="w-4 h-4" />{p.address}</div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(p.joinedAt).toLocaleDateString('uz-UZ')}</div>
                  </div>
                </div>

                <div className="lg:col-span-4 grid grid-cols-2 gap-3">
                  {quickStats.map((s, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${s.cardClass}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <s.icon className={`w-4 h-4 ${s.iconClass}`} />
                        <span className={`text-xs font-medium ${s.textClass}`}>{s.label}</span>
                      </div>
                      <p className={`text-lg font-bold ${s.valueClass}`}>{s.getValue(p)}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-3 flex flex-col gap-2">
                  <Button 
                    onClick={() => { setSelectedPartner(p); setShowDetailsModal(true); }} 
                    variant="outline" 
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ko'rish
                  </Button>
                  <Button 
                    onClick={() => { setSelectedPartner(p); setShowMessageModal(true); }} 
                    variant="outline" 
                    size="sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Xabar
                  </Button>
                  {!p.approved && (
                    <Button 
                      onClick={() => approveMutation.mutate(p.id)} 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {approveMutation.isPending ? 'Tasdiqlanmoqda...' : 'Tasdiqlash'}
                    </Button>
                  )}
                  <Button 
                    onClick={() => blockMutation.mutate(p.id)} 
                    variant="destructive" 
                    size="sm"
                    disabled={blockMutation.isPending}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    {blockMutation.isPending ? 'Jarayonda...' : (p.isActive ? 'Bloklash' : 'Faollashtirish')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partner Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedPartner?.businessName}
            </DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Egasi</Label>
                  <p className="font-medium">{selectedPartner.ownerName}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{selectedPartner.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Telefon</Label>
                  <p className="font-medium">{selectedPartner.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Manzil</Label>
                  <p className="font-medium">{selectedPartner.address || 'Kiritilmagan'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Tarif</Label>
                  <p className="font-medium">{TIER_NAMES[selectedPartner.pricingTier] || selectedPartner.pricingTier}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <Badge variant={selectedPartner.approved ? "default" : "secondary"}>
                    {selectedPartner.approved ? 'Tasdiqlangan' : 'Kutilmoqda'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-500">Qo'shilgan sana</Label>
                  <p className="font-medium">{new Date(selectedPartner.joinedAt).toLocaleDateString('uz-UZ')}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Plan turi</Label>
                  <p className="font-medium">{getPlanTypeLabel(selectedPartner.planType)}</p>
                </div>
              </div>
              
              {selectedPartner.planType === 'remote_ai_saas' && selectedPartner.aiPlanCode && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Label className="text-purple-700 font-semibold">AI Manager Plan</Label>
                  <p className="text-purple-900 font-medium">{getAIPlanInfo(selectedPartner)}</p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Package className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                  <p className="text-2xl font-bold">{selectedPartner.totalProducts || 0}</p>
                  <p className="text-xs text-gray-500">Mahsulotlar</p>
                </div>
                <div className="text-center">
                  <ShoppingCart className="w-6 h-6 mx-auto mb-1 text-green-600" />
                  <p className="text-2xl font-bold">{selectedPartner.totalOrders || 0}</p>
                  <p className="text-xs text-gray-500">Buyurtmalar</p>
                </div>
                <div className="text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
                  <p className="text-2xl font-bold">{formatCurrency(selectedPartner.totalRevenue || 0)}</p>
                  <p className="text-xs text-gray-500">Daromad</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                  <p className="text-2xl font-bold">{formatCurrency(selectedPartner.commissionPaid || 0)}</p>
                  <p className="text-xs text-gray-500">Komissiya</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xabar - {selectedPartner?.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Mavzu</Label>
              <Input value={messageSubject} onChange={(e) => setMessageSubject(e.target.value)} />
            </div>
            <div>
              <Label>Xabar</Label>
              <Textarea value={messageBody} onChange={(e) => setMessageBody(e.target.value)} className="min-h-[150px]" />
            </div>
            <Button onClick={() => {
              if (selectedPartner && messageSubject && messageBody) {
                sendMessageMutation.mutate({ partnerId: selectedPartner.id, subject: messageSubject, body: messageBody });
              }
            }} className="w-full">
              <Send className="w-4 h-4 mr-2" />Yuborish
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Message Modal */}
      <Dialog open={showBulkMessageModal} onOpenChange={setShowBulkMessageModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ommaviy Xabar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Mavzu</Label>
              <Input value={messageSubject} onChange={(e) => setMessageSubject(e.target.value)} />
            </div>
            <div>
              <Label>Xabar</Label>
              <Textarea value={messageBody} onChange={(e) => setMessageBody(e.target.value)} className="min-h-[150px]" />
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Barcha <strong>{stats.total}</strong> ta hamkorga yuboriladi!
            </div>
            <Button onClick={() => {
              if (messageSubject && messageBody) {
                sendBulkMessageMutation.mutate({ subject: messageSubject, body: messageBody });
              }
            }} className="w-full">
              <Send className="w-4 h-4 mr-2" />Yuborish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
