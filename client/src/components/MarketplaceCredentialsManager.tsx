// MARKETPLACE CREDENTIALS MANAGER
// Secure storage and management of marketplace login credentials

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Key,
  Save,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface MarketplaceCredential {
  marketplace: string;
  username: string;
  isConnected: boolean;
  lastVerified?: string;
  status: 'active' | 'pending' | 'failed';
}

const MARKETPLACES = [
  {
    id: 'uzum',
    name: 'Uzum Market',
    icon: '🛍️',
    loginUrl: 'https://seller.uzum.uz/login',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'wildberries',
    name: 'Wildberries',
    icon: '🟣',
    loginUrl: 'https://seller.wildberries.ru/login',
    color: 'from-purple-600 to-violet-600'
  },
  {
    id: 'yandex',
    name: 'Yandex Market',
    icon: '🔴',
    loginUrl: 'https://partner.market.yandex.ru/login',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'ozon',
    name: 'Ozon',
    icon: '🔵',
    loginUrl: 'https://seller.ozon.ru/login',
    color: 'from-blue-500 to-cyan-500'
  }
];

export function MarketplaceCredentialsManager() {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<Record<string, any>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [verifying, setVerifying] = useState<string | null>(null);
  const [savedCredentials, setSavedCredentials] = useState<MarketplaceCredential[]>([]);

  const handleSaveCredentials = async (marketplaceId: string) => {
    const cred = credentials[marketplaceId];
    
    if (!cred?.username || !cred?.password) {
      toast({
        title: "Xatolik",
        description: "Login va parol kiritilishi shart",
        variant: "destructive"
      });
      return;
    }

    setVerifying(marketplaceId);

    try {
      const response = await apiRequest('POST', '/api/marketplace-credentials', {
        marketplace: marketplaceId,
        username: cred.username,
        password: cred.password,
        twoFactorSecret: cred.twoFactorSecret
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Muvaffaqiyat!",
          description: `${MARKETPLACES.find(m => m.id === marketplaceId)?.name} ulandi`,
          duration: 3000
        });

        // Update saved credentials list
        setSavedCredentials(prev => [
          ...prev.filter(c => c.marketplace !== marketplaceId),
          {
            marketplace: marketplaceId,
            username: cred.username,
            isConnected: true,
            lastVerified: new Date().toISOString(),
            status: 'active'
          }
        ]);

        // Clear password from state
        setCredentials(prev => ({
          ...prev,
          [marketplaceId]: { ...prev[marketplaceId], password: '' }
        }));
      }
    } catch (error) {
      toast({
        title: "Ulanish xatosi",
        description: "Login yoki parol noto'g'ri. Qaytadan urinib ko'ring.",
        variant: "destructive"
      });
    } finally {
      setVerifying(null);
    }
  };

  const handleTestConnection = async (marketplaceId: string) => {
    setVerifying(marketplaceId);
    
    try {
      const response = await apiRequest('POST', '/api/marketplace-credentials/verify', {
        marketplace: marketplaceId
      });

      const data = await response.json();

      toast({
        title: data.success ? "Ulanish faol" : "Ulanish xatosi",
        description: data.message,
        variant: data.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ulanishni tekshirishda xatolik",
        variant: "destructive"
      });
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">🔒 Xavfsizlik Kafolati</h3>
              <p className="text-sm text-blue-800">
                Sizning login ma'lumotlaringiz <strong>AES-256 shifrlash</strong> bilan himoyalangan.
                Faqat AI Manager ularga kirish huquqiga ega. Hech kim (admin ham) sizning parolingizni ko'ra olmaydi.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketplace Credentials */}
      <div className="grid md:grid-cols-2 gap-6">
        {MARKETPLACES.map((marketplace) => {
          const saved = savedCredentials.find(c => c.marketplace === marketplace.id);
          const isVerifying = verifying === marketplace.id;
          
          return (
            <Card key={marketplace.id} className="border-2 hover:shadow-lg transition-all">
              <CardHeader className={`bg-gradient-to-r ${marketplace.color} text-white`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{marketplace.icon}</span>
                    <span>{marketplace.name}</span>
                  </div>
                  {saved?.isConnected && (
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ulangan
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Username */}
                <div>
                  <Label htmlFor={`${marketplace.id}-username`}>
                    Login / Email
                  </Label>
                  <Input
                    id={`${marketplace.id}-username`}
                    type="text"
                    placeholder="seller@example.com"
                    value={credentials[marketplace.id]?.username || saved?.username || ''}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      [marketplace.id]: { ...prev[marketplace.id], username: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor={`${marketplace.id}-password`}>
                    Parol
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id={`${marketplace.id}-password`}
                      type={showPassword[marketplace.id] ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={credentials[marketplace.id]?.password || ''}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        [marketplace.id]: { ...prev[marketplace.id], password: e.target.value }
                      }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => ({ ...prev, [marketplace.id]: !prev[marketplace.id] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword[marketplace.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* 2FA Secret (Optional) */}
                <div>
                  <Label htmlFor={`${marketplace.id}-2fa`}>
                    2FA Secret (ixtiyoriy)
                  </Label>
                  <Input
                    id={`${marketplace.id}-2fa`}
                    type="text"
                    placeholder="ABCD1234EFGH5678"
                    value={credentials[marketplace.id]?.twoFactorSecret || ''}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      [marketplace.id]: { ...prev[marketplace.id], twoFactorSecret: e.target.value }
                    }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Agar 2FA yoqilgan bo'lsa, secret key'ni kiriting
                  </p>
                </div>

                {/* Status */}
                {saved && (
                  <div className="bg-slate-50 rounded-lg p-3 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-600">Status:</span>
                      <Badge variant={saved.status === 'active' ? 'default' : 'secondary'}>
                        {saved.status === 'active' ? 'Faol' : 'Kutilmoqda'}
                      </Badge>
                    </div>
                    {saved.lastVerified && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Tekshirilgan:</span>
                        <span className="font-medium">
                          {new Date(saved.lastVerified).toLocaleString('uz-UZ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSaveCredentials(marketplace.id)}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Tekshirilmoqda...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Saqlash
                      </>
                    )}
                  </Button>
                  
                  {saved?.isConnected && (
                    <Button
                      onClick={() => handleTestConnection(marketplace.id)}
                      disabled={isVerifying}
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800">
                      AI Manager bu ma'lumotlardan foydalanib seller kabinetga kirib,
                      avtomatik mahsulot kartochkalarini yaratadi va boshqaradi.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How It Works */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <CheckCircle className="h-6 w-6" />
            Qanday Ishlaydi?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-green-800">
          <div className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Har bir marketplace uchun login va parol kiritasiz</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Ma'lumotlar <strong>AES-256 shifrlash</strong> bilan saqlanadi</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>AI Manager avtomatik seller kabinetga kiradi</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Mahsulot kartochkalarini yaratadi va yuklaydi</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">5.</span>
            <span>Narx, stock, tavsiflarni avtomatik yangilaydi</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
