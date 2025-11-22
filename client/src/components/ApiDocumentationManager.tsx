import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Upload,
  Settings,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  BookOpen,
  Code,
  Database,
  Shield
} from 'lucide-react';

interface ApiDocumentation {
  id: string;
  marketplace: string;
  partnerId: string;
  apiDocumentationUrl: string;
  shopId?: string;
  status: 'active' | 'pending' | 'error';
  lastVerified: string;
  verificationStatus: 'verified' | 'unverified' | 'failed';
  notes?: string;
  createdAt: string;
}

interface MarketplaceApiInfo {
  name: string;
  baseUrl: string;
  documentationUrl: string;
  apiVersion: string;
  endpoints: string[];
  authentication: string;
  rateLimits: string;
}

const MARKETPLACE_API_INFO: Record<string, MarketplaceApiInfo> = {
  uzum: {
    name: 'Uzum Market',
    baseUrl: 'https://api-seller.uzum.uz',
    documentationUrl: 'https://api-seller.uzum.uz/api/seller-openapi/swagger/swagger-ui/webjars/swagger-ui/index.html',
    apiVersion: 'v1',
    endpoints: ['/orders', '/products', '/analytics', '/payments'],
    authentication: 'Bearer Token',
    rateLimits: '1000 requests/hour'
  },
  wildberries: {
    name: 'Wildberries',
    baseUrl: 'https://suppliers-api.wildberries.ru',
    documentationUrl: 'https://suppliers-api.wildberries.ru/swagger/index.html',
    apiVersion: 'v3',
    endpoints: ['/api/v3/supplies', '/api/v3/orders', '/api/v3/products'],
    authentication: 'API Key',
    rateLimits: '500 requests/minute'
  },
  yandex: {
    name: 'Yandex Market',
    baseUrl: 'https://api.partner.market.yandex.ru',
    documentationUrl: 'https://yandex.ru/dev/market/partner-api/',
    apiVersion: 'v2',
    endpoints: ['/campaigns', '/orders', '/products', '/prices'],
    authentication: 'OAuth 2.0',
    rateLimits: '2000 requests/day'
  },
  ozon: {
    name: 'Ozon',
    baseUrl: 'https://api-seller.ozon.ru',
    documentationUrl: 'https://docs.ozon.ru/api/seller/en/',
    apiVersion: 'v3',
    endpoints: ['/v3/product', '/v3/order', '/v3/analytics'],
    authentication: 'Client ID + Secret',
    rateLimits: '100 requests/second'
  }
};

interface ApiDocumentationManagerProps {
  partnerId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApiDocumentationManager({ 
  partnerId, 
  isOpen, 
  onClose, 
  onSuccess 
}: ApiDocumentationManagerProps) {
  const { toast } = useToast();
  const [documentations, setDocumentations] = useState<ApiDocumentation[]>([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('');
  const [apiDocUrl, setApiDocUrl] = useState<string>('');
  const [shopId, setShopId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && partnerId) {
      loadDocumentations();
    }
  }, [isOpen, partnerId]);

  const loadDocumentations = async () => {
    try {
      const response = await apiRequest('GET', `/api/partners/${partnerId}/api-documentations`);
      const data = await response.json();
      setDocumentations(data);
    } catch (error) {
      console.error('Failed to load API documentations:', error);
    }
  };

  const handleAddDocumentation = async () => {
    if (!selectedMarketplace || !apiDocUrl) {
      toast({
        title: "Ma'lumotlar to'liq emas",
        description: "Marketplace va API hujjat URL manzilini kiriting",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', `/api/partners/${partnerId}/api-documentations`, {
        marketplace: selectedMarketplace,
        apiDocumentationUrl: apiDocUrl,
        shopId: shopId || undefined,
        notes: notes || undefined
      });

      const newDoc = await response.json();
      setDocumentations(prev => [...prev, newDoc]);
      
      toast({
        title: "API hujjat qo'shildi",
        description: `${MARKETPLACE_API_INFO[selectedMarketplace as keyof typeof MARKETPLACE_API_INFO]?.name || selectedMarketplace} uchun API hujjat muvaffaqiyatli qo'shildi`,
      });

      // Reset form
      setSelectedMarketplace('');
      setApiDocUrl('');
      setShopId('');
      setNotes('');
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "API hujjat qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDocumentation = async (docId: string) => {
    setIsVerifying(docId);
    try {
      const response = await apiRequest('POST', `/api/api-documentations/${docId}/verify`);
      const result = await response.json();
      
      if (result.verified) {
        toast({
          title: "Hujjat tasdiqlandi",
          description: "API hujjat muvaffaqiyatli tasdiqlandi",
        });
      } else {
        toast({
          title: "Tasdiqlash muvaffaqiyatsiz",
          description: result.error || "API hujjatni tasdiqlashda xatolik",
          variant: "destructive",
        });
      }
      
      // Refresh list
      loadDocumentations();
    } catch (error: any) {
      toast({
        title: "Tasdiqlash xatoligi",
        description: error.message || "API hujjatni tasdiqlashda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(null);
    }
  };

  const handleDeleteDocumentation = async (docId: string) => {
    if (!confirm("Bu API hujjatni o'chirishni xohlaysizmi?")) return;

    try {
      await apiRequest('DELETE', `/api/api-documentations/${docId}`);
      setDocumentations(prev => prev.filter(doc => doc.id !== docId));
      
      toast({
        title: "API hujjat o'chirildi",
        description: "API hujjat muvaffaqiyatli o'chirildi",
      });
    } catch (error: any) {
      toast({
        title: "O'chirish xatoligi",
        description: error.message || "API hujjatni o'chirishda xatolik",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Faol', variant: 'default' as const, icon: CheckCircle },
      pending: { label: 'Kutilmoqda', variant: 'secondary' as const, icon: AlertTriangle },
      error: { label: 'Xatolik', variant: 'destructive' as const, icon: XCircle }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pending;
    const Icon = statusConfig.icon;
    
    return (
      <Badge variant={statusConfig.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">API Hujjatlar Boshqaruvi</h2>
              <p className="text-slate-600">Hamkor marketplace API hujjatlarini boshqarish</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <XCircle className="w-4 h-4 mr-2" />
              Yopish
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Documentation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Yangi API Hujjat Qo'shish
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="marketplace">Marketplace</Label>
                  <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
                    <SelectTrigger>
                      <SelectValue placeholder="Marketplace tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MARKETPLACE_API_INFO).map(([key, info]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            {info.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="shopId">Do'kon ID (ixtiyoriy)</Label>
                  <Input
                    id="shopId"
                    value={shopId}
                    onChange={(e) => setShopId(e.target.value)}
                    placeholder="Do'kon identifikatori"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="apiDocUrl">API Hujjat URL</Label>
                  <Input
                    id="apiDocUrl"
                    value={apiDocUrl}
                    onChange={(e) => setApiDocUrl(e.target.value)}
                    placeholder="https://api-seller.uzum.uz/api/seller-openapi/swagger/..."
                  />
                  {selectedMarketplace && MARKETPLACE_API_INFO[selectedMarketplace] && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {MARKETPLACE_API_INFO[selectedMarketplace].name} API Ma'lumotlari
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-blue-700">
                        <div>Base URL: {MARKETPLACE_API_INFO[selectedMarketplace].baseUrl}</div>
                        <div>API Version: {MARKETPLACE_API_INFO[selectedMarketplace].apiVersion}</div>
                        <div>Auth: {MARKETPLACE_API_INFO[selectedMarketplace].authentication}</div>
                      </div>
                      <div className="mt-2">
                        <a 
                          href={MARKETPLACE_API_INFO[selectedMarketplace as keyof typeof MARKETPLACE_API_INFO]?.documentationUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Rasmiy hujjatlarni ko'rish
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Izohlar (ixtiyoriy)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="API hujjat haqida qo'shimcha ma'lumotlar..."
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button 
                    onClick={handleAddDocumentation}
                    disabled={isLoading || !selectedMarketplace || !apiDocUrl}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Qo'shilmoqda...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        API Hujjat Qo'shish
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Documentations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Mavjud API Hujjatlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documentations.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Hozircha API hujjatlar yo'q</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documentations.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {MARKETPLACE_API_INFO[doc.marketplace as keyof typeof MARKETPLACE_API_INFO]?.name || doc.marketplace}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {doc.shopId ? `Do'kon ID: ${doc.shopId}` : "Do'kon ID kiritilmagan"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(doc.status)}
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyDocumentation(doc.id)}
                              disabled={isVerifying === doc.id}
                            >
                              {isVerifying === doc.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(doc.apiDocumentationUrl, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteDocumentation(doc.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">API URL:</p>
                          <p className="font-mono text-xs break-all">{doc.apiDocumentationUrl}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">So'nggi tekshiruv:</p>
                          <p>{new Date(doc.lastVerified).toLocaleDateString('uz-UZ')}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Tasdiqlash holati:</p>
                          <Badge variant={doc.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                            {doc.verificationStatus === 'verified' ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}
                          </Badge>
                        </div>
                      </div>

                      {doc.notes && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">{doc.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Marketplace API Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Marketplace API Ma'lumotlari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(MARKETPLACE_API_INFO).map(([key, info]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {info.name.charAt(0)}
                        </span>
                      </div>
                      <h4 className="font-semibold">{info.name}</h4>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Base URL:</span>
                        <span className="font-mono text-xs">{info.baseUrl}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">API Version:</span>
                        <span>{info.apiVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Autentifikatsiya:</span>
                        <span>{info.authentication}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cheklovlar:</span>
                        <span>{info.rateLimits}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-slate-500 mb-2">Mavjud endpointlar:</p>
                      <div className="flex flex-wrap gap-1">
                        {info.endpoints.map((endpoint, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {endpoint}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <a
                        href={info.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Rasmiy hujjatlarni ko'rish
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
