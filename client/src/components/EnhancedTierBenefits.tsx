import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Zap, Clock, Target, Award } from 'lucide-react';

interface TierBenefitsProps {
  currentCommission: number; // Hozirgi komissiya (foizda, masalan 0.25 = 25%)
  newCommission: number; // Yangi komissiya (foizda)
  monthlyRevenue?: number; // Oylik aylanma
  tierCost: number; // Yangi tarifning oylik to'lovi
  currentMonthlyFee?: number; // Hozirgi tarifning oylik to'lovi (default 0)
}

export function EnhancedTierBenefits({ 
  currentCommission, 
  newCommission, 
  monthlyRevenue = 50000000,
  tierCost,
  currentMonthlyFee = 0
}: TierBenefitsProps) {
  // YANGI MODEL: Komissiya savdodan
  const commissionDiff = currentCommission - newCommission;
  const commissionSavings = monthlyRevenue * commissionDiff; // Komissiyadan tejash
  
  // Oylik to'lov farqi
  const monthlyFeeDiff = tierCost - currentMonthlyFee; // Qo'shimcha oylik to'lov
  
  // Umumiy tejamkorlik = Komissiyadan tejash - Qo'shimcha oylik to'lov
  const monthlySavings = commissionSavings - monthlyFeeDiff;
  const yearlySavings = monthlySavings * 12;
  const netMonthlySavings = monthlySavings; // Allaqachon tierCost hisobga olingan
  const roi = tierCost > 0 ? ((monthlySavings / tierCost) * 100) : 0;
  const breakEvenDays = monthlySavings > 0 ? Math.ceil((monthlyFeeDiff / monthlySavings) * 30) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' so\'m';
  };

  const benefits = [
    {
      icon: TrendingUp,
      label: 'Komissiya tejash',
      value: `${(commissionDiff * 100).toFixed(1)}%`,
      description: 'Savdodan komissiya kamayishi',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: DollarSign,
      label: 'Komissiyadan tejash',
      value: formatCurrency(commissionSavings),
      description: 'Oylik savdo komissiyasidan',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Target,
      label: 'Sof tejamkorlik',
      value: formatCurrency(monthlySavings),
      description: `Oylik to'lovdan keyin (${formatCurrency(monthlyFeeDiff)} to'lov)`,
      color: monthlySavings > 0 ? 'text-purple-600' : 'text-red-600',
      bgColor: monthlySavings > 0 ? 'bg-purple-50' : 'bg-red-50'
    },
    {
      icon: Zap,
      label: 'ROI',
      value: `${roi.toFixed(0)}%`,
      description: 'Birinchi oyda',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      icon: Clock,
      label: 'Break-even',
      value: breakEvenDays > 0 ? `${breakEvenDays} kun` : 'Darhol',
      description: 'Investitsiya qaytish muddati',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Award,
      label: 'Yillik foyda',
      value: formatCurrency(yearlySavings),
      description: 'Umumiy tejamkorlik',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Moliyaviy Foyda Tahlili
        </h3>
        <p className="text-sm text-green-700">
          Bu tarifga o'tish orqali siz yiliga <span className="font-bold text-xl">{formatCurrency(yearlySavings)}</span> tejaysiz!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <Card key={index} className={`${benefit.bgColor} border-none hover:shadow-lg transition-all`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                  <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">{benefit.label}</p>
                  <p className={`text-lg font-bold ${benefit.color} truncate`}>{benefit.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-amber-600" />
          <h4 className="font-bold text-amber-900">Tezkor Qaytish</h4>
        </div>
        <p className="text-sm text-amber-800">
          Tarif to'lovi atigi <span className="font-bold">{breakEvenDays} kun</span> ichida o'zini oqlaydi. 
          Shundan keyin har oy <span className="font-bold">{formatCurrency(netMonthlySavings)}</span> qo'shimcha foyda!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">📈 Biznes O'sishi</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Ko'proq mahsulot qo'shish imkoniyati</li>
            <li>✓ Kengaytirilgan tahlil va hisobotlar</li>
            <li>✓ Ustuvor texnik yordam</li>
          </ul>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">⚡ Raqobat Ustunligi</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>✓ Past komissiya = yuqori foyda</li>
            <li>✓ Tezkor buyurtma qayta ishlash</li>
            <li>✓ Premium xususiyatlar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
