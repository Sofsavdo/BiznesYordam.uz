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

interface Partner {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  pricingTier: string;
  isApproved: boolean;
  isActive: boolean;
  joinedAt: string;
  totalRevenue?: number;
  totalOrders?: number;
  totalProducts?: number;
  commissionPaid?: number;
}

const TIER_NAMES: Record<string, string> = {
  starter_pro: 'Starter Pro',
  business_standard: 'Business Standard',
  professional_plus: 'Professional Plus',
  enterprise_elite: 'Enterprise Elite'
};

export function AdminPartnersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false);
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
      const response = await apiRequest('POST', `/api/admin/partners/${partnerId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Tasdiqlandi!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/partners'] });
    }
  });

  const blockMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const response = await apiRequest('POST', `/api/admin/partners/${partnerId}/block`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Bloklandi" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/partners'] });
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
    approved: partners.filter(p => p.isApproved).length,
    pending: partners.filter(p => !p.isApproved).length,
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
                        {!p.isApproved && <Badge variant="secondary">Kutilmoqda</Badge>}
                        {!p.isActive && <Badge variant="destructive">Bloklangan</Badge>}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {p.ownerName}
                      </p>
                    </div>
                    <Badge variant="outline">
                      <Crown className="w-3 h-3 mr-1" />
                      {TIER_NAMES[p.pricingTier]}
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
                  <Button onClick={() => { setSelectedPartner(p); setShowMessageModal(true); }} variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Xabar
                  </Button>
                  {!p.isApproved && (
                    <Button onClick={() => approveMutation.mutate(p.id)} size="sm" className="bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Tasdiqlash
                    </Button>
                  )}
                  <Button onClick={() => blockMutation.mutate(p.id)} variant="destructive" size="sm">
                    <Ban className="w-4 h-4 mr-2" />
                    {p.isActive ? 'Bloklash' : 'Faollashtirish'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
