import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, DollarSign, Target } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/currency';

interface PartnerStatsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProfit: number;
    activeProducts: number;
  };
}

export function PartnerStats({ stats }: PartnerStatsProps) {
  const statCards = [
    {
      title: 'Umumiy Aylanma',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Umumiy Buyurtmalar',
      value: formatNumber(stats.totalOrders),
      icon: Package,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Umumiy Foyda',
      value: formatCurrency(stats.totalProfit),
      icon: DollarSign,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Faol Mahsulotlar',
      value: formatNumber(stats.activeProducts),
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {stat.title}
            </CardTitle>
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`} data-testid={`stat-${index}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
