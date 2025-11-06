import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, TrendingUp, Target, Star } from 'lucide-react';
import { getTierName } from '@/hooks/useTierAccess';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TierSelectionModal } from './TierSelectionModal';

interface TierUpgradePromptProps {
  currentTier: string;
  requiredTier: string;
  featureName: string;
  description: string;
  benefits: string[];
}

export function TierUpgradePrompt({ 
  currentTier, 
  requiredTier, 
  featureName, 
  description,
  benefits 
}: TierUpgradePromptProps) {
  const [reason, setReason] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [showTierModal, setShowTierModal] = useState(false);
  const { toast } = useToast();
  const currentTierName = getTierName(currentTier);
  const requiredTierName = getTierName(requiredTier);

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
      setIsVisible(false);
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "So'rov yuborishda xatolik yuz berdi. Qayta urinib ko'ring.",
        variant: "destructive",
      });
    },
  });

  if (!isVisible) return null;

  return (
    <div className="relative">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-slate-200/80 backdrop-blur-sm rounded-lg z-10"></div>
      
      {/* Lock icon */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-slate-600 text-white p-3 rounded-full shadow-lg">
          <Lock className="h-6 w-6" />
        </div>
      </div>

      {/* Content behind blur */}
      <div className="filter blur-sm">
        <Card className="h-64">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              {featureName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded"></div>
                <div className="h-12 bg-gradient-to-r from-green-100 to-green-200 rounded"></div>
                <div className="h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Horizontal upgrade prompt overlay */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl border-2 border-amber-400 shadow-xl bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              
              {/* Left side - Feature preview image */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <img 
                    src="/attached_assets/generated_images/Trending_products_dashboard_mockup_ce5d9fe6.png" 
                    alt="Feature preview" 
                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                    onError={(e) => {
                      // Fallback to gradient if image doesn't load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-40 bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-slate-600">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm font-medium">Trending Products Dashboard</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 font-medium">
                    {featureName} ochilganda ko'ra oladigan imkoniyatlar
                  </p>
                </div>
              </div>

              {/* Right side - Upgrade information */}
              <div className="space-y-4">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    <Crown className="h-8 w-8 text-amber-500" />
                    <h3 className="text-xl font-bold text-slate-900">Premium funksiya</h3>
                  </div>
                  <p className="text-slate-600 mb-4">{description}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
                  <Badge variant="outline" className="text-slate-600">
                    Sizning tarifingiz: {currentTierName}
                  </Badge>
                  <span className="text-slate-400">→</span>
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Kerak: {requiredTierName}+
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Nima yutasiz:
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    data-testid="button-upgrade-tier"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    onClick={() => setShowTierModal(true)}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Tarif tanlash
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsVisible(false);
                    }}
                  >
                    Keyinroq
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Selection Modal */}
      <TierSelectionModal 
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        onSuccess={() => setIsVisible(false)}
        currentTier={currentTier}
      />
    </div>
  );
}