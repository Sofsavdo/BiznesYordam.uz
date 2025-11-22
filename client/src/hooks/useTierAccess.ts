import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface TierAccess {
  tier: 'starter_pro' | 'business_standard' | 'professional_plus' | 'enterprise_elite';
  hasProfitDashboard: boolean;
  hasTrendHunter: boolean;
  canViewFullAnalytics: boolean;
  canAccessPremiumFeatures: boolean;
}

export function useTierAccess() {
  const { data: partner } = useQuery({
    queryKey: ['/api/partners/me'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/partners/me');
      return response.json();
    },
    retry: false,
  });

  const currentTier = (partner as any)?.pricingTier || 'starter_pro';

  const access: TierAccess = {
    tier: currentTier,
    hasProfitDashboard: ['business_standard', 'professional_plus', 'enterprise_elite'].includes(currentTier),
    hasTrendHunter: ['professional_plus', 'enterprise_elite'].includes(currentTier),
    canViewFullAnalytics: ['business_standard', 'professional_plus', 'enterprise_elite'].includes(currentTier),
    canAccessPremiumFeatures: ['enterprise_elite'].includes(currentTier),
  };

  return access;
}

export function getTierName(tier: string): string {
  const tierNames: Record<string, string> = {
    starter_pro: 'Starter Pro',
    business_standard: 'Business Standard',
    professional_plus: 'Professional Plus',
    enterprise_elite: 'Enterprise Elite',
  };
  return tierNames[tier] || tier;
}

export function getRequiredTierForFeature(feature: 'profit' | 'trends'): string {
  if (feature === 'profit') return 'business_standard';
  if (feature === 'trends') return 'professional_plus';
  return 'starter_pro';
}