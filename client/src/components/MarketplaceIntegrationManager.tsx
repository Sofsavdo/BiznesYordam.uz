import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Plus,
  Check,
  X,
  Clock,
  Globe,
  Key,
  Link,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';

interface MarketplaceRequest {
  id: string;
  partnerId: string;
  marketplace: string;
  requestType: 'connect' | 'disconnect' | 'update';
  status: 'pending' | 'approved' | 'rejected' | 'testing';
  credentials: {
    apiKey?: string;
    apiSecret?: string;
    sellerId?: string;
    shopUrl?: string;
  };
  businessJustification: string;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  testResults?: any;
}

interface MarketplaceIntegrationManagerProps {
  isPartnerView?: boolean;
}

const MARKETPLACES = [
  {
    id: 'uzum',
    name: 'Uzum Market',
    icon: '🛍️',
    description: 'O\'zbekistondagi yetakchi marketplace',
    color: 'purple'
  },
  {
    id: 'wildberries',
    name: 'Wildberries',
    icon: '🇷🇺',
    description: 'MDH mintaqasining eng katta marketplace',
    color: 'pink'
  },
  {
    id: 'ozon',
    name: 'Ozon',
    icon: '🔵',
    description: 'Rossiya marketplace',
    color: 'blue'
  },
  {
    id: 'yandex',
    name: 'Yandex Market',
    icon: '🟡',
    description: 'Yandex ekotizimi',
    color: 'yellow'
  }
];

export function MarketplaceIntegrationManager({ isPartnerView = true }: MarketplaceIntegrationManagerProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState('');
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    sellerId: '',
    shopUrl: '',
    businessJustification: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // So'rovlarni olish
  const { data: requests = [], isLoading } = useQuery<MarketplaceRequest[]>({
    queryKey: ['/api/marketplace-integration/requests'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/marketplace-integration/requests');
      return response.json();
    }
  });

  // Yangi so'rov yaratish
  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/marketplace-integration/requests', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "So'rov yuborildi!",
        description: "Marketplace integratsiyasi so'rovingiz admin ko'rib chiqishi uchun yuborildi.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace-integration/requests'] });
      setShowRequestModal(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      apiKey: '',
      apiSecret: '',
      sellerId: '',
      shopUrl: '',
      businessJustification: ''
    });
    setSelectedMarketplace('');
  };

  const handleSubmit = () => {
    if (!selectedMarketplace || !formData.businessJustification) {
      toast({
        title: "Ma'lumotlar to'liq emas",
        description: "Marketplace va sabab maydonlarini to'ldiring",
        variant: "destructive",
      });
      return;
    }

    createRequestMutation.mutate({
      marketplace: selectedMarketplace,
      requestType: 'connect',
      credentials: {
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        sellerId: formData.sellerId,
        shopUrl: formData.shopUrl
      },
      businessJustification: formData.businessJustification
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Kutilmoqda', variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
      approved: { label: 'Tasdiqlandi', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rejected: { label: 'Rad etildi', variant: 'destructive' as const, icon: X, color: 'text-red-600' },
      testing: { label: 'Test qilinmoqda', variant: 'secondary' as const, icon: RefreshCw, color: 'text-blue-600' }
    };
    const { label, variant, icon: Icon, color } = config[status as keyof typeof config];
    return (
      <Badge variant={variant} className={`${color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Marketplace Integratsiyasi
          </h3>
          <p className="text-muted-foreground mt-1">
            {isPartnerView 
              ? 'Mahsulotlaringizni boshqa platformalarga ulang (Admin tasdig\'i talab etiladi)'
              : 'Hamkorlardan kelgan marketplace ulanish so\'rovlari'
            }
          </p>
        </div>
        {isPartnerView && (
          <Button onClick={() => setShowRequestModal(true)} className="hover-lift">
            <Plus className="w-4 h-4 mr-2" />
            Yangi So'rov
          </Button>
        )}
      </div>

      {/* Available Marketplaces - faqat hamkor uchun */}
      {isPartnerView && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKETPLACES.map((marketplace) => (
            <Card key={marketplace.id} className="hover-lift cursor-pointer transition-all">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{marketplace.icon}</div>
                <h4 className="font-semibold mb-1">{marketplace.name}</h4>
                <p className="text-xs text-muted-foreground">{marketplace.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* So'rovlar ro'yxati */}
      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {isPartnerView ? 'Yuborilgan So\'rovlar' : 'Barcha So\'rovlar'}
        </h4>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p>Yuklanmoqda...</p>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium mb-2">So'rovlar yo'q</p>
              <p className="text-muted-foreground">
                {isPartnerView 
                  ? 'Marketplace integratsiyasi uchun yangi so\'rov yuboring'
                  : 'Hali hech qanday so\'rov kelmagan'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => {
              const marketplace = MARKETPLACES.find(m => m.id === request.marketplace);
              return (
                <Card key={request.id} className="hover-lift shadow-elegant">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{marketplace?.icon || '🛍️'}</div>
                        <div>
                          <h4 className="text-lg font-semibold flex items-center gap-2">
                            {marketplace?.name || request.marketplace}
                            {getStatusBadge(request.status)}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            So'rov: {new Date(request.requestedAt).toLocaleDateString('uz-UZ', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {request.requestType}
                      </Badge>
                    </div>

                    {/* Business Justification */}
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">Sabab:</p>
                      <p className="text-sm text-muted-foreground">{request.businessJustification}</p>
                    </div>

                    {/* Credentials (faqat tasdiqlangan so'rovlar uchun) */}
                    {request.status === 'approved' && request.credentials && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          Ulanish ma'lumotlari:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {request.credentials.sellerId && (
                            <div>
                              <span className="text-green-600">Seller ID:</span>
                              <span className="font-mono ml-2">{request.credentials.sellerId}</span>
                            </div>
                          )}
                          {request.credentials.shopUrl && (
                            <div>
                              <span className="text-green-600">Shop URL:</span>
                              <a href={request.credentials.shopUrl} target="_blank" rel="noopener noreferrer" 
                                 className="ml-2 text-blue-600 hover:underline inline-flex items-center gap-1">
                                Ochish <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Admin notes */}
                    {request.adminNotes && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-1">Admin izohi:</p>
                        <p className="text-sm text-blue-700">{request.adminNotes}</p>
                      </div>
                    )}

                    {/* Test results */}
                    {request.testResults && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-800 mb-1 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Test natijalari:
                        </p>
                        <p className="text-sm text-purple-700">
                          {request.testResults.success ? '✅ Ulanish muvaffaqiyatli' : '❌ Ulanishda xatolik'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Yangi so'rov modali */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Globe className="w-6 h-6 text-primary" />
              Marketplace Ulanish So'rovi
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Marketplace tanlash */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Marketplace tanlang *</Label>
              <div className="grid grid-cols-2 gap-3">
                {MARKETPLACES.map((marketplace) => (
                  <Card 
                    key={marketplace.id}
                    className={`cursor-pointer transition-all ${
                      selectedMarketplace === marketplace.id 
                        ? 'ring-2 ring-primary border-primary shadow-lg' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMarketplace(marketplace.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{marketplace.icon}</div>
                      <h4 className="font-semibold text-sm">{marketplace.name}</h4>
                      {selectedMarketplace === marketplace.id && (
                        <Check className="w-5 h-5 text-primary mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* API Ma'lumotlari */}
            {selectedMarketplace && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API Ma'lumotlari (Ixtiyoriy)
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiSecret">API Secret</Label>
                    <Input
                      id="apiSecret"
                      type="password"
                      value={formData.apiSecret}
                      onChange={(e) => setFormData({...formData, apiSecret: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellerId">Seller ID</Label>
                    <Input
                      id="sellerId"
                      value={formData.sellerId}
                      onChange={(e) => setFormData({...formData, sellerId: e.target.value})}
                      placeholder="12345"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shopUrl">Shop URL</Label>
                    <Input
                      id="shopUrl"
                      value={formData.shopUrl}
                      onChange={(e) => setFormData({...formData, shopUrl: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business Justification */}
            <div>
              <Label htmlFor="justification" className="text-base font-semibold">
                Nima uchun bu marketplace kerak? *
              </Label>
              <Textarea
                id="justification"
                value={formData.businessJustification}
                onChange={(e) => setFormData({...formData, businessJustification: e.target.value})}
                placeholder="Biznes ehtiyojlaringiz, qo'shimcha sotish kanallari kerakligi, maqsadli auditoriya va boshqa sabablarni batafsil yozing..."
                className="mt-2 min-h-[120px]"
              />
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                <strong>Eslatma:</strong> Barcha so'rovlar admin tomonidan ko'rib chiqiladi. 
                Tasdiqlanganidan keyin marketplace bilan avtomatik integratsiya o'rnatiladi.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-4 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowRequestModal(false);
                  resetForm();
                }}
              >
                Bekor qilish
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createRequestMutation.isPending || !selectedMarketplace || !formData.businessJustification}
                className="min-w-[150px]"
              >
                {createRequestMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    So'rov Yuborish
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
