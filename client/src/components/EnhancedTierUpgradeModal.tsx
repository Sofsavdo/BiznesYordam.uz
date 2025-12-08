import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Calculator,
  Check,
  ArrowRight,
  Zap,
  Star,
  Package,
  Shield,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface EnhancedTierUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentTier: string;
}

// YANGI v4.0.0 - Profit Share Model
const TIER_DETAILS = {
  starter_pro: {
    name: 'Starter Pro',
    monthlyFee: 3000000, // 3M
    profitShareRate: 50, // 50% foydadan
    commissionRate: 50, // Legacy display
    minRevenue: 20000000,
    maxRevenue: 50000000,
    color: 'blue',
    icon: Package,
    popular: false,
    badge: 'Low Risk',
    features: [
      '1 ta marketplace',
      '100 tagacha mahsulot',
      'Basic dashboard',
      'Ombor (100 kg)',
      'Email yordam (48h)',
      '50% profit share',
      'SPT xizmati BEPUL'
    ],
    limits: {
      marketplaces: 1,
      products: 100,
      warehouse: 100
    }
  },
  business_standard: {
    name: 'Business Standard',
    monthlyFee: 8000000, // 8M
    profitShareRate: 25, // 25% foydadan
    commissionRate: 25, // Legacy display
    minRevenue: 50000000,
    maxRevenue: 150000000,
    color: 'green',
    icon: TrendingUp,
    popular: true,
    badge: 'Recommended',
    features: [
      '2 ta marketplace',
      '500 tagacha mahsulot',
      'To\'liq dashboard + Prognozlar',
      'Ombor (500 kg)',
      'Telefon yordam (24h)',
      'Oylik konsultatsiya (2 soat)',
      '25% profit share',
      'SPT xizmati BEPUL'
    ],
    limits: {
      marketplaces: 2,
      products: 500,
      warehouse: 500
    }
  },
  professional_plus: {
    name: 'Professional Plus',
    monthlyFee: 18000000, // 18M
    profitShareRate: 15, // 15% foydadan
    commissionRate: 15, // Legacy display
    minRevenue: 150000000,
    maxRevenue: 400000000,
    color: 'purple',
    icon: Star,
    popular: false,
    badge: 'High Volume',
    features: [
      '4 ta marketplace',
      '2,000 tagacha mahsulot',
      'Premium dashboard + AI Tahlil',
      'Trend Hunter',
      'Ombor (2,000 kg)',
      '24/7 yordam + Shaxsiy menejer',
      '15% profit share',
      'SPT xizmati BEPUL'
    ],
    limits: {
      marketplaces: 4,
      products: 2000,
      warehouse: 2000
    }
  },
  enterprise_elite: {
    name: 'Enterprise Elite',
    monthlyFee: 25000000, // 25M
    profitShareRate: 10, // 10% foydadan
    commissionRate: 10, // Legacy display
    minRevenue: 500000000,
    maxRevenue: null,
    color: 'orange',
    icon: Crown,
    popular: false,
    badge: 'VIP',
    features: [
      'Cheksiz marketplace',
      'Cheksiz mahsulot',
      'Enterprise dashboard',
      'Full AI & Analytics',
      'Ombor (cheksiz)',
      'Shaxsiy jamoa + VIP xizmat',
      '10% profit share',
      'SPT xizmati BEPUL'
    ],
    limits: {
      marketplaces: -1,
      products: -1,
      warehouse: -1
    }
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
};

export function EnhancedTierUpgradeModal({ isOpen, onClose, onSuccess, currentTier }: EnhancedTierUpgradeModalProps) {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [reason, setReason] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(50000000); // 50M default
  const [activeTab, setActiveTab] = useState<'compare' | 'calculator'>('compare');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitUpgradeRequest = useMutation({
    mutationFn: async (data: { requestedTier: string; reason: string; partnerCurrentTier: string }) => {
      const response = await apiRequest('POST', '/api/tier-upgrade-requests', data);
      return response.json();
    },
    onSuccess: () => {
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
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const currentTierDetails = TIER_DETAILS[currentTier as keyof typeof TIER_DETAILS];
  // BARCHA tariflarni ko'rsatish (hozirgi tarfdan boshqa)
  const availableTiers = Object.entries(TIER_DETAILS).filter(([key]) => key !== currentTier);

  // ROI Calculator
  const roiCalculation = useMemo(() => {
    if (!selectedTier) return null;
    
    const selectedTierDetails = TIER_DETAILS[selectedTier as keyof typeof TIER_DETAILS];
    const currentRevenue = monthlyRevenue;
    
    // YANGI v4: Profit Share hisob
    // Approximate net profit (assume 40% gross margin, 20% MP fees)
    const approxNetProfit = currentRevenue * 0.20; // ~20% net after all costs
    
    const currentCosts = {
      monthly: currentTierDetails.monthlyFee,
      profitShare: approxNetProfit * (currentTierDetails.profitShareRate / 100),
      total: currentTierDetails.monthlyFee + (approxNetProfit * (currentTierDetails.profitShareRate / 100))
    };
    
    const newCosts = {
      monthly: selectedTierDetails.monthlyFee,
      profitShare: approxNetProfit * (selectedTierDetails.profitShareRate / 100),
      total: selectedTierDetails.monthlyFee + (approxNetProfit * (selectedTierDetails.profitShareRate / 100))
    };
    
    const savings = currentCosts.total - newCosts.total;
    const savingsPercent = (savings / currentCosts.total) * 100;
    
    return {
      currentCosts,
      newCosts,
      savings,
      savingsPercent,
      yearlyImpact: savings * 12
    };
  }, [selectedTier, monthlyRevenue, currentTier]);

  const handleSubmit = () => {
    if (!selectedTier || !reason.trim()) {
      toast({
        title: "Ma'lumotlar to'liq emas",
        description: "Tarif va sabab maydonlarini to'ldiring",
        variant: "destructive",
      });
      return;
    }
    
    submitUpgradeRequest.mutate({
      requestedTier: selectedTier,
      reason: reason.trim(),
      partnerCurrentTier: currentTier,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                Premium Tarif Yangilash
              </span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Hozirgi tarif: <Badge variant="outline">{currentTierDetails.name}</Badge>
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Tariflarni Taqqoslash
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              ROI Kalkulyator
            </TabsTrigger>
          </TabsList>

          {/* Tariflarni Taqqoslash */}
          <TabsContent value="compare" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableTiers.map(([key, tier]) => {
                const Icon = tier.icon;
                const isSelected = selectedTier === key;
                
                return (
                  <Card 
                    key={key}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                      isSelected 
                        ? 'ring-4 ring-primary border-primary shadow-2xl scale-105' 
                        : 'hover:border-primary/50 hover:scale-102'
                    } ${tier.popular ? 'relative overflow-hidden' : ''}`}
                    onClick={() => setSelectedTier(key)}
                  >
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        ⭐ MASHHUR
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 bg-${tier.color}-100 rounded-xl`}>
                            <Icon className={`w-6 h-6 text-${tier.color}-600`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{tier.name}</h3>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-bounce">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="space-y-3 mb-6">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-blue-700" />
                            <span className="text-xs font-bold text-blue-700 uppercase">Oylik To'lov</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-900">
                            {formatCurrency(tier.monthlyFee)}
                            <span className="text-sm font-normal text-blue-700 ml-1">/ oy</span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-100 rounded-xl border-2 border-emerald-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Percent className="w-4 h-4 text-emerald-700" />
                            <span className="text-xs font-bold text-emerald-700 uppercase">Profit Share</span>
                          </div>
                          <div className="text-2xl font-bold text-emerald-900">
                            {tier.profitShareRate}%
                            <span className="text-sm font-normal text-emerald-700 ml-2">foydadan</span>
                          </div>
                          <div className="text-xs text-emerald-600 mt-1 italic">
                            Foyda bo'lmasa, to'lov yo'q!
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <div className="text-sm">
                            <span className="text-purple-600 font-medium">Maqsadli aylanma:</span>
                            <span className="font-bold ml-2">{formatCurrency(tier.minRevenue)}</span>
                            {tier.maxRevenue && <span className="text-muted-foreground"> - {formatCurrency(tier.maxRevenue)}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground mb-3">IMKONIYATLAR:</h4>
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Select Button */}
                      {isSelected && (
                        <Button 
                          variant="premium" 
                          className="w-full mt-6 animate-pulse"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('calculator');
                          }}
                        >
                          <Calculator className="w-4 h-4 mr-2" />
                          ROI Hisoblash
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* ROI Calculator */}
          <TabsContent value="calculator" className="space-y-6 mt-6">
            {!selectedTier ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calculator className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                  <h3 className="text-xl font-bold mb-2">Tarif tanlanmagan</h3>
                  <p className="text-muted-foreground mb-4">
                    Avval "Tariflarni Taqqoslash" bo'limidan yangi tarif tanlang
                  </p>
                  <Button onClick={() => setActiveTab('compare')} variant="outline">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Tarif Tanlash
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Revenue Input */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6">
                    <Label htmlFor="revenue" className="text-lg font-bold flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Oylik Aylanmangiz (so'mda)
                    </Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                      className="text-2xl font-bold h-16 text-center border-2"
                      placeholder="50000000"
                    />
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {[30000000, 50000000, 100000000, 200000000].map((amount) => (
                        <Button
                          key={amount}
                          onClick={() => setMonthlyRevenue(amount)}
                          variant="outline"
                          size="sm"
                          className={monthlyRevenue === amount ? 'bg-purple-100 border-purple-400' : ''}
                        >
                          {formatCurrency(amount)}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* ROI Comparison */}
                {roiCalculation && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Current Tier Costs */}
                    <Card className="border-2 border-gray-300">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Hozirgi Tarif: {currentTierDetails.name}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-sm">Oylik to'lov:</span>
                            <span className="font-bold">{formatCurrency(roiCalculation.currentCosts.monthly)}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-emerald-50 rounded">
                            <span className="text-sm">Profit Share ({currentTierDetails.profitShareRate}%):</span>
                            <span className="font-bold">{formatCurrency(roiCalculation.currentCosts.profitShare)}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-100 rounded border-2 border-gray-300">
                            <span className="font-semibold">Jami Xarajat:</span>
                            <span className="font-bold text-xl">{formatCurrency(roiCalculation.currentCosts.total)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* New Tier Costs */}
                    <Card className="border-2 border-green-300 bg-green-50">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
                          <Star className="w-5 h-5" />
                          Yangi Tarif: {TIER_DETAILS[selectedTier as keyof typeof TIER_DETAILS].name}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white rounded">
                            <span className="text-sm">Oylik to'lov:</span>
                            <span className="font-bold">{formatCurrency(roiCalculation.newCosts.monthly)}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-emerald-50 rounded">
                            <span className="text-sm">Profit Share ({TIER_DETAILS[selectedTier as keyof typeof TIER_DETAILS].profitShareRate}%):</span>
                            <span className="font-bold">{formatCurrency(roiCalculation.newCosts.profitShare)}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-green-100 rounded border-2 border-green-300">
                            <span className="font-semibold text-green-800">Jami Xarajat:</span>
                            <span className="font-bold text-xl text-green-800">{formatCurrency(roiCalculation.newCosts.total)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Savings Summary */}
                {roiCalculation && roiCalculation.savings !== 0 && (
                  <Card className={`border-4 ${roiCalculation.savings > 0 ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
                    <CardContent className="p-8 text-center">
                      <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-lg">
                        {roiCalculation.savings > 0 ? (
                          <TrendingUp className="w-12 h-12 text-green-600" />
                        ) : (
                          <AlertCircle className="w-12 h-12 text-red-600" />
                        )}
                      </div>
                      <h3 className="text-3xl font-bold mb-2">
                        {roiCalculation.savings > 0 ? 'Tejovingiz:' : 'Qo\'shimcha Xarajat:'}
                      </h3>
                      <div className={`text-5xl font-bold mb-4 ${roiCalculation.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roiCalculation.savings > 0 ? '+' : ''}{formatCurrency(Math.abs(roiCalculation.savings))}
                        <span className="text-2xl"> / oy</span>
                      </div>
                      <div className={`text-xl font-semibold ${roiCalculation.savings > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        Yillik: {roiCalculation.savings > 0 ? '+' : ''}{formatCurrency(Math.abs(roiCalculation.yearlyImpact))}
                      </div>
                      {roiCalculation.savings > 0 && (
                        <Badge className="mt-4 text-lg px-4 py-2 bg-green-600">
                          {roiCalculation.savingsPercent.toFixed(1)}% tejash
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Reason & Submit */}
        {selectedTier && (
          <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 mt-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-lg">So'rov yuborish</h3>
            </div>
            <div>
              <Label htmlFor="reason" className="font-semibold">
                Nima uchun bu tarifga o'tmoqchisiz? *
              </Label>
              <Textarea
                id="reason"
                placeholder="Biznes ehtiyojlaringiz, qo'shimcha imkoniyatlar kerakligi, ROI hisob-kitoblari va boshqa sabablarni batafsil yozing..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-4 pt-6 border-t-2">
          <Button variant="outline" onClick={onClose} size="lg">
            Bekor qilish
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedTier || !reason.trim() || submitUpgradeRequest.isPending}
            className="min-w-[250px] h-12 text-lg"
            variant="premium"
          >
            {submitUpgradeRequest.isPending ? (
              "Yuborilmoqda..."
            ) : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                So'rov Yuborish
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
