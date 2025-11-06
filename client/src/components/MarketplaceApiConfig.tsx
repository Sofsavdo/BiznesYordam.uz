import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Zap, 
  Settings, 
  Globe, 
  Key, 
  Wifi, 
  WifiOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Database,
  Shield
} from 'lucide-react';

interface ApiConfig {
  id: string;
  marketplace: string;
  apiKey: string;
  apiSecret: string;
  shopId: string;
  baseUrl: string;
  webhookUrl: string;
  isActive: boolean;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  errorMessage?: string;
  rateLimit: number;
  timeout: number;
}

export function MarketplaceApiConfig() {
  const [selectedMarketplace, setSelectedMarketplace] = useState('uzum');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all marketplace API configurations
  const { data: apiConfigs = [], isLoading } = useQuery<ApiConfig[]>({
    queryKey: ['/api/admin/marketplace-configs'],
  });

  // Test API connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: async (marketplace: string) => {
      const response = await fetch(`/api/admin/marketplace-configs/${marketplace}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Ulanish test qilishda xatolik');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Ulanish muvaffaqiyatli",
        description: `${data.marketplace} bilan ulanish ishlaydi`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketplace-configs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Ulanish xatosi",
        description: error.message || "API ulanishini test qilishda muammo",
        variant: "destructive"
      });
    },
  });

  // Save API configuration mutation
  const saveConfigMutation = useMutation({
    mutationFn: async (config: Partial<ApiConfig>) => {
      const response = await fetch(`/api/admin/marketplace-configs/${config.marketplace}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Konfiguratsiyani saqlashda xatolik');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Saqlandi",
        description: "API konfiguratsiya muvaffaqiyatli saqlandi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketplace-configs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Saqlash xatosi",
        description: error.message || "Konfiguratsiyani saqlashda muammo",
        variant: "destructive"
      });
    },
  });

  // Sync marketplace data mutation
  const syncDataMutation = useMutation({
    mutationFn: async (marketplace: string) => {
      const response = await fetch(`/api/admin/marketplace-configs/${marketplace}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Ma\'lumotlarni sinxronlashda xatolik');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sinxronlash boshlandi",
        description: `${data.marketplace} ma'lumotlari yangilanmoqda`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketplace-configs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Sinxronlash xatosi",
        description: error.message || "Ma'lumotlarni sinxronlashda muammo",
        variant: "destructive"
      });
    },
  });

  const marketplaces = [
    { id: 'uzum', name: 'Uzum Market', icon: '🛍️' },
    { id: 'wildberries', name: 'Wildberries', icon: '🟣' },
    { id: 'yandex', name: 'Yandex Market', icon: '🟡' },
    { id: 'aliexpress', name: 'AliExpress', icon: '🔸' },
    { id: 'amazon', name: 'Amazon', icon: '📦' },
    { id: 'ozon', name: 'Ozon', icon: '🔵' }
  ];

  const selectedConfig = apiConfigs.find(config => config.marketplace === selectedMarketplace);

  const handleSaveConfig = (formData: FormData) => {
    const config = {
      marketplace: selectedMarketplace,
      apiKey: formData.get('apiKey') as string,
      apiSecret: formData.get('apiSecret') as string,
      shopId: formData.get('shopId') as string,
      baseUrl: formData.get('baseUrl') as string,
      webhookUrl: formData.get('webhookUrl') as string,
      isActive: formData.get('isActive') === 'on',
      rateLimit: parseInt(formData.get('rateLimit') as string) || 1000,
      timeout: parseInt(formData.get('timeout') as string) || 30000,
    };
    saveConfigMutation.mutate(config);
  };

  if (isLoading) {
    return <div className="animate-pulse bg-slate-200 h-96 rounded-lg"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Marketplace API Konfiguratsiyasi</h2>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/marketplace-configs'] })}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Yangilash
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marketplace Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Marketplace Holati
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketplaces.map(marketplace => {
              const config = apiConfigs.find(c => c.marketplace === marketplace.id);
              return (
                <div 
                  key={marketplace.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedMarketplace === marketplace.id ? 'bg-primary/10 border-primary' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedMarketplace(marketplace.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{marketplace.icon}</span>
                    <div>
                      <p className="font-medium">{marketplace.name}</p>
                      {config?.lastSync && (
                        <p className="text-sm text-slate-500">
                          Oxirgi sinxron: {new Date(config.lastSync).toLocaleDateString('uz-UZ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {config?.status === 'connected' && <Wifi className="w-4 h-4 text-green-500" />}
                    {config?.status === 'disconnected' && <WifiOff className="w-4 h-4 text-slate-400" />}
                    {config?.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    <Badge 
                      variant={config?.status === 'connected' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {config?.status === 'connected' ? 'Ulangan' : 
                       config?.status === 'error' ? 'Xato' : 'Ulanmagan'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* API Configuration Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {marketplaces.find(m => m.id === selectedMarketplace)?.name} API Sozlamalari
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveConfig(formData);
            }} className="space-y-6">
              
              <Tabs defaultValue="credentials" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="credentials">API Ma'lumotlari</TabsTrigger>
                  <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
                  <TabsTrigger value="testing">Test va Monitoring</TabsTrigger>
                </TabsList>
                
                <TabsContent value="credentials" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        name="apiKey"
                        type="password"
                        placeholder="API kalitingizni kiriting"
                        defaultValue={selectedConfig?.apiKey || ''}
                        data-testid="input-api-key"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apiSecret">API Secret</Label>
                      <Input
                        id="apiSecret"
                        name="apiSecret"
                        type="password"
                        placeholder="API secret kiriting"
                        defaultValue={selectedConfig?.apiSecret || ''}
                        data-testid="input-api-secret"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shopId">Shop ID</Label>
                      <Input
                        id="shopId"
                        name="shopId"
                        placeholder="Do'kon ID kiriting"
                        defaultValue={selectedConfig?.shopId || ''}
                        data-testid="input-shop-id"
                      />
                    </div>
                    <div>
                      <Label htmlFor="baseUrl">Base URL</Label>
                      <Input
                        id="baseUrl"
                        name="baseUrl"
                        placeholder="https://api.marketplace.com"
                        defaultValue={selectedConfig?.baseUrl || ''}
                        data-testid="input-base-url"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      name="webhookUrl"
                      placeholder="https://biznesyordam.uz/webhooks/marketplace"
                      defaultValue={selectedConfig?.webhookUrl || ''}
                      data-testid="input-webhook-url"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isActive" 
                      name="isActive"
                      defaultChecked={selectedConfig?.isActive || false}
                      data-testid="switch-is-active"
                    />
                    <Label htmlFor="isActive">API faol</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rateLimit">So'rovlar chegarasi (soatiga)</Label>
                      <Input
                        id="rateLimit"
                        name="rateLimit"
                        type="number"
                        placeholder="1000"
                        defaultValue={selectedConfig?.rateLimit || 1000}
                        data-testid="input-rate-limit"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeout">Timeout (millisekund)</Label>
                      <Input
                        id="timeout"
                        name="timeout"
                        type="number"
                        placeholder="30000"
                        defaultValue={selectedConfig?.timeout || 30000}
                        data-testid="input-timeout"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="testing" className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Ulanish holati</h4>
                    <div className="flex items-center gap-4 mb-4">
                      {selectedConfig?.status === 'connected' && (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-green-700">Muvaffaqiyatli ulangan</span>
                        </>
                      )}
                      {selectedConfig?.status === 'error' && (
                        <>
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="text-red-700">Ulanish xatosi</span>
                        </>
                      )}
                      {!selectedConfig?.status && (
                        <>
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          <span className="text-yellow-700">Hali test qilinmagan</span>
                        </>
                      )}
                    </div>
                    
                    {selectedConfig?.errorMessage && (
                      <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                        <p className="text-red-700 text-sm">{selectedConfig.errorMessage}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => testConnectionMutation.mutate(selectedMarketplace)}
                        disabled={testConnectionMutation.isPending}
                        data-testid="button-test-connection"
                      >
                        {testConnectionMutation.isPending ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4 mr-2" />
                        )}
                        Ulanishni Test Qilish
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => syncDataMutation.mutate(selectedMarketplace)}
                        disabled={syncDataMutation.isPending || selectedConfig?.status !== 'connected'}
                        data-testid="button-sync-data"
                      >
                        {syncDataMutation.isPending ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Database className="w-4 h-4 mr-2" />
                        )}
                        Ma'lumotlarni Sinxronlash
                      </Button>
                    </div>
                  </div>

                  {selectedConfig?.lastSync && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Oxirgi sinxronizatsiya</h4>
                      <p className="text-sm text-blue-700">
                        {new Date(selectedConfig.lastSync).toLocaleString('uz-UZ')}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="submit"
                  disabled={saveConfigMutation.isPending}
                  data-testid="button-save-config"
                >
                  {saveConfigMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Saqlash
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}