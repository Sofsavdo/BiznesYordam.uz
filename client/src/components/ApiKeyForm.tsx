import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { X, Globe, Key, Eye, EyeOff } from 'lucide-react';

interface ApiKeyFormProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string;
  marketplace: string;
}

export function ApiKeyForm({ isOpen, onClose, partnerId, marketplace }: ApiKeyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    shopId: '',
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connectMarketplaceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', `/api/partners/${partnerId}/marketplace/connect`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Marketplace ulandi",
        description: `${marketplace} muvaffaqiyatli ulandi`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace-integrations'] });
      onClose();
      setFormData({ apiKey: '', apiSecret: '', shopId: '' });
    },
    onError: (error: Error) => {
      toast({
        title: "Ulanish xatoligi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await connectMarketplaceMutation.mutateAsync({
        marketplace: (marketplace || 'uzum').toLowerCase(),
        ...formData
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getMarketplaceInfo = () => {
    const info = {
      uzum: {
        name: 'Uzum Market',
        color: 'bg-blue-500',
        icon: 'U',
        description: 'Uzbekistan\'s leading marketplace'
      },
      wildberries: {
        name: 'Wildberries',
        color: 'bg-purple-500',
        icon: 'W',
        description: 'International fashion marketplace'
      },
      yandex: {
        name: 'Yandex Market',
        color: 'bg-red-500',
        icon: 'Y',
        description: 'Russian e-commerce platform'
      },
      ozon: {
        name: 'Ozon',
        color: 'bg-orange-500',
        icon: 'O',
        description: 'Russian online retailer'
      }
    };
    return info[(marketplace?.toLowerCase() || 'uzum') as keyof typeof info] || info.uzum;
  };

  const marketplaceInfo = getMarketplaceInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-8 h-8 ${marketplaceInfo.color} rounded flex items-center justify-center`}>
              <span className="text-white font-bold">{marketplaceInfo.icon}</span>
            </div>
            {marketplaceInfo.name} ulash
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showSecrets ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="API Key kiriting"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                onClick={() => setShowSecrets(!showSecrets)}
              >
                {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <div className="relative">
              <Input
                id="apiSecret"
                type={showSecrets ? 'text' : 'password'}
                value={formData.apiSecret}
                onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                placeholder="API Secret kiriting"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopId">Shop ID</Label>
            <Input
              id="shopId"
              type="text"
              value={formData.shopId}
              onChange={(e) => handleInputChange('shopId', e.target.value)}
              placeholder="Shop ID kiriting"
            />
          </div>

          <Alert>
            <Globe className="h-4 w-4" />
            <AlertDescription>
              {marketplaceInfo.description}. API ma'lumotlarini {marketplaceInfo.name} admin panelidan olishingiz mumkin.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.apiKey || !formData.apiSecret}
              className="flex-1"
            >
              {isLoading ? 'Ulanmoqda...' : 'Ulash'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
