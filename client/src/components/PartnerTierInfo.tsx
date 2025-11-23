import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  TrendingUp, 
  DollarSign, 
  Package,
  ArrowRight,
  CheckCircle,
  Info
} from "lucide-react";
import { NEW_PRICING_TIERS } from '../../../NEW_PRICING_CONFIG';

interface PartnerTierInfoProps {
  currentTier: string;
  monthlyFee: number;
  profitShareRate: number;
  monthlyRevenue?: number;
  onUpgradeClick?: () => void;
}

export function PartnerTierInfo({ 
  currentTier, 
  monthlyFee, 
  profitShareRate,
  monthlyRevenue = 0,
  onUpgradeClick 
}: PartnerTierInfoProps) {
  const tierConfig = NEW_PRICING_TIERS[currentTier as keyof typeof NEW_PRICING_TIERS];
  
  if (!tierConfig) {
    return null;
  }

  const formatSom = (amount: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + ' so\'m';
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'starter_pro': return 'bg-blue-500';
      case 'business_standard': return 'bg-green-500';
      case 'professional_plus': return 'bg-purple-500';
      case 'enterprise_elite': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'enterprise_elite': return Crown;
      case 'professional_plus': return TrendingUp;
      case 'business_standard': return Package;
      default: return DollarSign;
    }
  };

  const TierIcon = getTierIcon(currentTier);

  // Calculate suggested upgrade
  const suggestUpgrade = () => {
    const tiers = ['starter_pro', 'business_standard', 'professional_plus', 'enterprise_elite'];
    const currentIndex = tiers.indexOf(currentTier);
    if (currentIndex < tiers.length - 1 && monthlyRevenue > (tierConfig.maxRevenue || 0)) {
      return tiers[currentIndex + 1];
    }
    return null;
  };

  const suggestedTier = suggestUpgrade();
  const suggestedTierConfig = suggestedTier ? NEW_PRICING_TIERS[suggestedTier as keyof typeof NEW_PRICING_TIERS] : null;

  return (
    <div className="space-y-4">
      {/* Current Tier Card */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${getTierBadgeColor(currentTier)} rounded-xl flex items-center justify-center shadow-lg`}>
                <TierIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{tierConfig.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{tierConfig.description}</p>
              </div>
            </div>
            <Badge className={`${getTierBadgeColor(currentTier)} text-white text-base px-4 py-2`}>
              Sizning Tarifingiz
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Payment Structure */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                To'lov Tuzilmasi
              </h4>
              
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Oylik Abonent:</span>
                    <span className="font-bold text-blue-600 text-lg">{formatSom(monthlyFee)}</span>
                  </div>
                  <p className="text-xs text-slate-500">Fixed oylik to'lov</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">Profit Share:</span>
                    <span className="font-bold text-green-600 text-lg">{(profitShareRate * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-slate-500">Sof foydangizdan</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3">
                  <div className="flex items-center gap-2 justify-center">
                    <Info className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">
                      Foyda bo'lmasa, faqat abonent to'lanadi!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Limits & Features */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Xizmatlar
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{tierConfig.limits.marketplaces} ta marketplace</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{tierConfig.limits.products} mahsulot</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{tierConfig.limits.warehouseKg} kg ombor</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>SPT xizmati BEPUL</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Support: {tierConfig.limits.supportResponseTime}</span>
                </div>
              </div>

              {tierConfig.limits.consultationHours > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      {tierConfig.limits.consultationHours} soat/oy konsultatsiya
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Revenue Range */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Tavsiya etiladigan aylanma:</p>
                <p className="font-bold text-lg">
                  {formatSom(tierConfig.minRevenue)} - {tierConfig.maxRevenue ? formatSom(tierConfig.maxRevenue) : 'Cheksiz'}
                </p>
              </div>
              {monthlyRevenue > 0 && (
                <Badge variant="outline" className="text-base px-3 py-1">
                  Sizniki: {formatSom(monthlyRevenue)}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Suggestion */}
      {suggestedTier && suggestedTierConfig && (
        <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-amber-900">Yuqori Tarifga O'ting!</h4>
                  <p className="text-sm text-amber-700">
                    Aylanmangiz {formatSom(tierConfig.maxRevenue || 0)}dan oshdi - 
                    <strong> {suggestedTierConfig.name}</strong> tarifiga o'tish tavsiya etiladi
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Profit share: {(profitShareRate * 100).toFixed(0)}% → {(suggestedTierConfig.profitShareRate * 100).toFixed(0)}% 
                    (kam to'laysiz!)
                  </p>
                </div>
              </div>
              <Button 
                onClick={onUpgradeClick}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                Upgrade
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
