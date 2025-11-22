import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, Crown, Star, Zap, Sparkles } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

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
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/pricing-tiers');
      return response.json();
    },
    enabled: isOpen,
  });

  const submitUpgradeRequest = useMutation({
    mutationFn: async (data: { requestedTier: string; reason: string; partnerCurrentTier: string }) => {
      console.log('🚀 Submitting tier upgrade request:', data);
      const response = await apiRequest('POST', '/api/tier-upgrade-requests', data);
      const result = await response.json();
      console.log('✅ Tier upgrade request response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Tier upgrade request successful:', data);
      toast({
        title: "So'rov yuborildi!",
        description: "Tarif yangilash so'rovingiz admin ko'rib chiqishi uchun yuborildi.",
      });
      setReason('');
      setSelectedTier('');
      onClose();
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('❌ Tier upgrade request error:', error);
      toast({
        title: "Xatolik",
        description: error.message || "So'rov yuborishda xatolik yuz berdi.",
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
      partnerCurrentTier: currentTier,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto shadow-business">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="flex items-center justify-center gap-3 text-2xl">
            <div className="p-3 gradient-business rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <span className="text-gradient-business">Premium Tarif Tanlash</span>
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Biznesingizni yangi bosqichga olib chiqish uchun mos tarifni tanlang
          </p>
        </DialogHeader>

        <div className="space-y-6">
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">Hozirgi tarifingiz:</p>
              <Badge variant="secondary" className="text-lg px-4 py-2">{getTierDisplayName(currentTier)}</Badge>
            </div>

          {isLoading ? (
            <div className="text-center py-8">Ma'lumotlar yuklanmoqda...</div>
          ) : (
            <>
                <div className="space-y-6">
                <h3 className="text-xl font-bold text-center text-gradient-business">Premium Tariflar</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {availableTiers.map((tier) => (
                    <Card 
                      key={tier.id} 
                      className={`cursor-pointer transition-smooth hover-lift group ${
                        selectedTier === tier.tier 
                          ? 'ring-2 ring-primary border-primary shadow-business gradient-primary/5' 
                          : 'hover:border-primary/50 hover:shadow-elegant'
                      }`}
                      onClick={() => setSelectedTier(tier.tier)}
                    >
                      <CardHeader className="pb-4 relative">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl font-bold group-hover:text-gradient-business transition-smooth">
                            {tier.nameUz}
                          </CardTitle>
                          {selectedTier === tier.tier && (
                            <div className="w-8 h-8 gradient-business rounded-full flex items-center justify-center shadow-glow animate-scale-in">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Sparkles className="h-5 w-5 text-primary opacity-60 animate-float" />
                        </div>
                        <div className="space-y-3">
                          <div className="text-3xl font-bold text-gradient-business">
                            {tier.fixedCost === '0' || parseFloat(tier.fixedCost) === 0 ? 
                              tier.tier === 'enterprise_elite' ? 'Individual' : 'Bepul' 
                              : formatCurrency(parseFloat(tier.fixedCost))} 
                            <span className="text-lg text-muted-foreground font-normal">/ oy</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg">
                            <Star className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium">
                              Komissiya: {(parseFloat(tier.commissionMin) * 100).toFixed(1)}% - {(parseFloat(tier.commissionMax) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                            <Zap className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              Min. aylanma: {formatCurrency(parseFloat(tier.minRevenue))}
                            </span>
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
                <div className="space-y-4 p-6 gradient-business/5 rounded-xl border border-primary/20 shadow-elegant animate-slide-up">
                  <div className="flex items-center gap-3">
                    <div className="p-2 gradient-business rounded-lg">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gradient-business">
                      {getTierDisplayName(selectedTier)} tarifini tanladingiz
                    </h3>
                  </div>
                  <div>
                    <Label htmlFor="reason" className="text-sm font-semibold text-foreground">
                      Nima sababdan bu tarifga o'tmoqchisiz? *
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Biznesingiz ehtiyojlari, qo'shimcha imkoniyatlar kerakligi va boshqa sabablarni batafsil yozing..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-2 min-h-[100px] resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4 pt-6 border-t">
                <Button variant="outline" onClick={onClose} size="lg">
                  Bekor qilish
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedTier || !reason.trim() || submitUpgradeRequest.isPending}
                  variant="premium"
                  size="lg"
                  className="min-w-[200px]"
                >
                  {submitUpgradeRequest.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Yuborilmoqda...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      So'rov yuborish
                    </div>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}