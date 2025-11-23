import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Key,
  RefreshCw,
  TestTube,
  Shield,
  AlertTriangle,
  User,
  Calendar
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
  partnerData?: {
    businessName: string;
    pricingTier: string;
  };
}

const MARKETPLACES = {
  uzum: { name: 'Uzum Market', icon: '🛍️', color: 'purple' },
  wildberries: { name: 'Wildberries', icon: '🇷🇺', color: 'pink' },
  ozon: { name: 'Ozon', icon: '🔵', color: 'blue' },
  yandex: { name: 'Yandex Market', icon: '🟡', color: 'yellow' }
};

export function AdminMarketplaceIntegration() {
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // So'rovlarni olish
  const { data: requests = [], isLoading } = useQuery<MarketplaceRequest[]>({
    queryKey: ['/api/admin/marketplace-integration/requests'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/marketplace-integration/requests');
      return response.json();
    }
  });

  // So'rovni tasdiqlash
  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const response = await apiRequest('POST', `/api/admin/marketplace-integration/requests/${id}/approve`, {
        adminNotes: notes
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tasdiqlandi!",
        description: "Marketplace integratsiyasi tasdiqlandi va faollashtirildi.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketplace-integration/requests'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // So'rovni rad etish
  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const response = await apiRequest('POST', `/api/admin/marketplace-integration/requests/${id}/reject`, {
        adminNotes: notes
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Rad etildi",
        description: "Marketplace integratsiya so'rovi rad etildi.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketplace-integration/requests'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Test qilish
  const testMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/admin/marketplace-integration/requests/${id}/test`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Test muvaffaqiyatli!" : "Test muvaffaqiyatsiz",
        description: data.message || "Ulanish testi yakunlandi",
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketplace-integration/requests'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Kutilmoqda', variant: 'secondary' as const, icon: Clock, color: 'bg-orange-100 text-orange-700 border-orange-300' },
      approved: { label: 'Tasdiqlandi', variant: 'default' as const, icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-300' },
      rejected: { label: 'Rad etildi', variant: 'destructive' as const, icon: XCircle, color: 'bg-red-100 text-red-700 border-red-300' },
      testing: { label: 'Test', variant: 'secondary' as const, icon: TestTube, color: 'bg-blue-100 text-blue-700 border-blue-300' }
    };
    const { label, icon: Icon, color } = config[status as keyof typeof config];
    return (
      <Badge className={`${color} flex items-center gap-1 px-3 py-1 border`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const testingRequests = requests.filter(r => r.status === 'testing');
  const reviewedRequests = requests.filter(r => r.status === 'approved' || r.status === 'rejected');

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Kutilayotgan</p>
                <p className="text-3xl font-bold text-orange-900">{pendingRequests.length}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Test qilinmoqda</p>
                <p className="text-3xl font-bold text-blue-900">{testingRequests.length}</p>
              </div>
              <TestTube className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Ko'rib chiqilgan</p>
                <p className="text-3xl font-bold text-green-900">{reviewedRequests.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold">Kutilayotgan So'rovlar</h3>
            <Badge variant="secondary">{pendingRequests.length}</Badge>
          </div>

          <div className="grid gap-4">
            {pendingRequests.map((request) => {
              const marketplace = MARKETPLACES[request.marketplace as keyof typeof MARKETPLACES];
              return (
                <Card key={request.id} className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">{marketplace?.icon || '🛍️'}</div>
                          <div>
                            <h4 className="text-xl font-bold flex items-center gap-3">
                              {marketplace?.name || request.marketplace}
                              {getStatusBadge(request.status)}
                            </h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {request.partnerData?.businessName || 'Partner'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(request.requestedAt).toLocaleDateString('uz-UZ')}
                              </div>
                              <Badge variant="outline">{request.partnerData?.pricingTier || 'starter_pro'}</Badge>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {request.requestType}
                        </Badge>
                      </div>

                      {/* Business Justification */}
                      <div className="p-4 bg-muted/50 rounded-lg border">
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Biznes sabablari:
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {request.businessJustification}
                        </p>
                      </div>

                      {/* Credentials (agar mavjud bo'lsa) */}
                      {(request.credentials.apiKey || request.credentials.sellerId) && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Taqdim etilgan API ma'lumotlari:
                          </p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {request.credentials.apiKey && (
                              <div className="flex items-center gap-2">
                                <span className="text-blue-700">API Key:</span>
                                <code className="bg-white px-2 py-1 rounded text-xs">
                                  {request.credentials.apiKey.substring(0, 8)}...
                                </code>
                              </div>
                            )}
                            {request.credentials.sellerId && (
                              <div className="flex items-center gap-2">
                                <span className="text-blue-700">Seller ID:</span>
                                <code className="bg-white px-2 py-1 rounded text-xs">
                                  {request.credentials.sellerId}
                                </code>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Admin Notes Input */}
                      <div>
                        <Label htmlFor={`notes-${request.id}`} className="font-semibold">
                          Admin Izohi (Ixtiyoriy)
                        </Label>
                        <Textarea
                          id={`notes-${request.id}`}
                          value={adminNotes[request.id] || ''}
                          onChange={(e) => setAdminNotes({...adminNotes, [request.id]: e.target.value})}
                          placeholder="So'rov haqida izohlar, test natijalari, qo'shimcha ko'rsatmalar..."
                          className="mt-2 min-h-[80px]"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={() => testMutation.mutate(request.id)}
                          disabled={testMutation.isPending}
                          variant="outline"
                          className="flex-1"
                        >
                          <TestTube className="w-4 h-4 mr-2" />
                          {testMutation.isPending ? 'Test qilinmoqda...' : 'Ulanishni Test Qilish'}
                        </Button>
                        <Button
                          onClick={() => approveMutation.mutate({
                            id: request.id,
                            notes: adminNotes[request.id] || ''
                          })}
                          disabled={approveMutation.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Tasdiqlash
                        </Button>
                        <Button
                          onClick={() => rejectMutation.mutate({
                            id: request.id,
                            notes: adminNotes[request.id] || ''
                          })}
                          disabled={rejectMutation.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rad Etish
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Testing Requests */}
      {testingRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TestTube className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold">Test Qilinayotgan So'rovlar</h3>
            <Badge variant="secondary">{testingRequests.length}</Badge>
          </div>

          <div className="grid gap-4">
            {testingRequests.map((request) => {
              const marketplace = MARKETPLACES[request.marketplace as keyof typeof MARKETPLACES];
              return (
                <Card key={request.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{marketplace?.icon || '🛍️'}</div>
                        <div>
                          <h4 className="text-lg font-bold">{marketplace?.name || request.marketplace}</h4>
                          <p className="text-sm text-muted-foreground">{request.partnerData?.businessName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                        <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviewed Requests */}
      {reviewedRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold">Ko'rib Chiqilgan So'rovlar</h3>
            <Badge variant="secondary">{reviewedRequests.length}</Badge>
          </div>

          <div className="grid gap-4">
            {reviewedRequests.map((request) => {
              const marketplace = MARKETPLACES[request.marketplace as keyof typeof MARKETPLACES];
              return (
                <Card key={request.id} className={`border-l-4 ${request.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{marketplace?.icon || '🛍️'}</div>
                        <div>
                          <h4 className="text-lg font-bold flex items-center gap-2">
                            {marketplace?.name || request.marketplace}
                            {getStatusBadge(request.status)}
                          </h4>
                          <p className="text-sm text-muted-foreground">{request.partnerData?.businessName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Ko'rib chiqildi: {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString('uz-UZ') : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {request.adminNotes && (
                      <div className={`p-3 rounded-lg border ${
                        request.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}>
                        <p className="text-sm font-medium mb-1">Admin izohi:</p>
                        <p className="text-sm">{request.adminNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-bold mb-2">So'rovlar yo'q</h3>
            <p className="text-muted-foreground">
              Hamkorlardan marketplace integratsiya so'rovlari kelganda bu yerda ko'rsatiladi
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
