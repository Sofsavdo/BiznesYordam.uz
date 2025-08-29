import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface TierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentTier: string;
}

interface PricingTier {
  id: string;
  tier: string;
  nameUz: string;
  fixedCost: string;
  commissionMin: string;
  commissionMax: string;
  minRevenue: string;
  maxRevenue: string | null;
  features: {
    maxProducts: number;
    analytics: boolean;
    prioritySupport: boolean;
    marketplaceIntegrations: string[];
    fulfillmentTypes: string[];
    commission: string;
    specialFeatures: string[];
  };
  isActive: boolean;
}

const getTierDisplayName = (tier: string) => {
  const names = {
    starter_pro: 'Starter Pro',
    business_standard: 'Business Standard',
    professional_plus: 'Professional Plus',
    enterprise_elite: 'Enterprise Elite'
  };
  return names[tier as keyof typeof names] || tier;
};

const getTierOrder = (tier: string) => {
  const order = {
    starter_pro: 1,
    business_standard: 2,
    professional_plus: 3,
    enterprise_elite: 4
  };
  return order[tier as keyof typeof order] || 0;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
  }).format(amount).replace('UZS', ' so\'m');
};

export function TierSelectionModal({ isOpen, onClose, onSuccess, currentTier }: TierSelectionModalProps) {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  const { data: tiers = [], isLoading } = useQuery<PricingTier[]>({
    queryKey: ['/api/pricing-tiers'],
    enabled: isOpen,
  });

  const submitUpgradeRequest = useMutation({
    mutationFn: async (data: { requestedTier: string; reason: string }) => {
      const response = await fetch('/api/tier-upgrade-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('So\'rov yuborishda xatolik');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "So'rov yuborildi",
        description: "Tarif yaxshilash so'rovingiz admin tomonidan ko'rib chiqiladi.",
      });
      setReason('');
      setSelectedTier('');
      onClose();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "So'rov yuborishda xatolik yuz berdi. Qayta urinib ko'ring.",
        variant: "destructive",
      });
    },
  });

  const currentTierOrder = getTierOrder(currentTier);
  const availableTiers = tiers
    .filter(tier => getTierOrder(tier.tier) > currentTierOrder)
    .sort((a, b) => getTierOrder(a.tier) - getTierOrder(b.tier));

  const handleSubmit = () => {
    if (!selectedTier || !reason.trim()) return;
    
    submitUpgradeRequest.mutate({
      requestedTier: selectedTier,
      reason: reason.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-500" />
            Tarif yaxshilash so'rovi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Sizning hozirgi tarifingiz: <Badge variant="outline">{getTierDisplayName(currentTier)}</Badge>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Ma'lumotlar yuklanmoqda...</div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mavjud tariflar:</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {availableTiers.map((tier) => (
                    <Card 
                      key={tier.id} 
                      className={`cursor-pointer transition-all ${
                        selectedTier === tier.tier 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedTier(tier.tier)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{tier.nameUz}</CardTitle>
                          {selectedTier === tier.tier && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-slate-900">
                            {tier.fixedCost === '0' || parseFloat(tier.fixedCost) === 0 ? 
                              tier.tier === 'enterprise_elite' ? 'Individual' : '0 so\'m' 
                              : formatCurrency(parseFloat(tier.fixedCost))} / oy
                          </div>
                          <div className="text-sm text-slate-700 font-medium">
                            Komissiya: {(parseFloat(tier.commissionMin) * 100).toFixed(1)}% - {(parseFloat(tier.commissionMax) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-slate-700 font-medium">
                            Min. aylanma: {formatCurrency(parseFloat(tier.minRevenue))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium flex items-center gap-2 mb-2">
                              <Star className="h-4 w-4 text-amber-500" />
                              Asosiy imkoniyatlar:
                            </h4>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center gap-2">
                                <Zap className="h-3 w-3 text-green-500" />
                                Maksimal mahsulotlar: {tier.features.maxProducts === -1 ? 'Cheksiz' : tier.features.maxProducts}
                              </li>
                              {tier.features.analytics && (
                                <li className="flex items-center gap-2">
                                  <Zap className="h-3 w-3 text-green-500" />
                                  Kengaytirilgan tahlillar
                                </li>
                              )}
                              {tier.features.prioritySupport && (
                                <li className="flex items-center gap-2">
                                  <Zap className="h-3 w-3 text-green-500" />
                                  Ustuvor qo'llab-quvvatlash
                                </li>
                              )}
                            </ul>
                          </div>
                          
                          {tier.features.specialFeatures && tier.features.specialFeatures.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Maxsus imkoniyatlar:</h4>
                              <ul className="text-sm space-y-1">
                                {tier.features.specialFeatures.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-blue-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedTier && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900">
                    {getTierDisplayName(selectedTier)} tarifini tanladingiz
                  </h3>
                  <div>
                    <Label htmlFor="reason" className="text-sm font-medium">
                      Nima sababdan bu tarifga o'tmoqchisiz? *
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Biznesingiz ehtiyojlari, qo'shimcha imkoniyatlar kerakligi va boshqa sabablarni yozing..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Bekor qilish
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedTier || !reason.trim() || submitUpgradeRequest.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitUpgradeRequest.isPending ? "Yuborilmoqda..." : "So'rov yuborish"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}