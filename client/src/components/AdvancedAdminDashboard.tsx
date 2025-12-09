// Advanced Admin Dashboard - Real-time Stats & Monitoring
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Users, Package, DollarSign, 
  Activity, Clock, CheckCircle, AlertCircle, Zap,
  Globe, Crown, Target, BarChart3, Sparkles
} from 'lucide-react';

export function AdvancedAdminDashboard() {
  // Real-time stats with auto-refresh
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/dashboard/stats', { credentials: 'include' });
      if (!res.ok) return getDefaultStats();
      return res.json();
    },
    refetchInterval: 30000,
  });

  const defaultStats = stats || getDefaultStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Control Center
          </h2>
          <p className="text-gray-600 mt-1">Real-time platform monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-green-700">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Jami Hamkorlar',
            value: defaultStats.totalPartners,
            change: `+${defaultStats.newPartnersThisMonth}`,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'Oylik Aylanma',
            value: `${Math.round(defaultStats.monthlyRevenue / 1000000)}M`,
            change: `+${Math.round(defaultStats.revenueGrowth)}%`,
            icon: DollarSign,
            gradient: 'from-green-500 to-emerald-500'
          },
          {
            title: 'Faol AI Tasks',
            value: defaultStats.activeAITasks,
            change: `${defaultStats.aiTasksCompleted} bajarildi`,
            icon: Sparkles,
            gradient: 'from-purple-500 to-pink-500'
          },
          {
            title: 'Platformalar',
            value: defaultStats.connectedMarketplaces,
            change: `${defaultStats.activeIntegrations} aktiv`,
            icon: Globe,
            gradient: 'from-orange-500 to-red-500'
          }
        ].map((metric, i) => (
          <Card key={i} className="border-2 hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.gradient} shadow-lg`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{metric.title}</p>
              <p className="text-3xl font-black text-gray-900">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getDefaultStats() {
  return {
    totalPartners: 0,
    newPartnersThisMonth: 0,
    partnersGrowth: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    activeAITasks: 0,
    aiTasksCompleted: 0,
    aiEfficiency: 95,
    connectedMarketplaces: 5,
    activeIntegrations: 3
  };
}
