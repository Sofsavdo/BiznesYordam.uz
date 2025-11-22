import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, 
  Target, Calendar, BarChart3, PieChart as PieChartIcon 
} from 'lucide-react';
import { DataExportButton } from './DataExportButton';

interface AnalyticsData {
  id: string;
  date: string;
  revenue: string;
  orders: number;
  profit: string;
  commissionPaid: string;
  marketplace: string;
  category: string;
}

interface ComprehensiveAnalyticsProps {
  data: AnalyticsData[];
}

export function ComprehensiveAnalytics({ data }: ComprehensiveAnalyticsProps) {
  // Calculate summary statistics
  const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.revenue || '0'), 0);
  const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);
  const totalProfit = data.reduce((sum, item) => sum + parseFloat(item.profit || '0'), 0);
  const totalCommission = data.reduce((sum, item) => sum + parseFloat(item.commissionPaid || '0'), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Prepare chart data
  const revenueByDate = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' }),
    aylanma: parseFloat(item.revenue || '0'),
    foyda: parseFloat(item.profit || '0'),
    buyurtmalar: item.orders || 0
  }));

  const revenueByMarketplace = Object.entries(
    data.reduce((acc, item) => {
      const marketplace = item.marketplace || 'Boshqa';
      acc[marketplace] = (acc[marketplace] || 0) + parseFloat(item.revenue || '0');
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const revenueByCategory = Object.entries(
    data.reduce((acc, item) => {
      const category = item.category || 'Boshqa';
      acc[category] = (acc[category] || 0) + parseFloat(item.revenue || '0');
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + ' so\'m';
  };

  const stats = [
    {
      title: 'Umumiy Aylanma',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Umumiy Buyurtmalar',
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      trend: '+8.2%',
      trendUp: true,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Sof Foyda',
      value: formatCurrency(totalProfit),
      icon: TrendingUp,
      trend: '+15.3%',
      trendUp: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'O\'rtacha Buyurtma',
      value: formatCurrency(avgOrderValue),
      icon: Target,
      trend: '+5.1%',
      trendUp: true,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Foyda Marjasi',
      value: `${profitMargin.toFixed(1)}%`,
      icon: BarChart3,
      trend: '+2.3%',
      trendUp: true,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      title: 'Komissiya',
      value: formatCurrency(totalCommission),
      icon: Package,
      trend: '-3.2%',
      trendUp: false,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kengaytirilgan Tahlil</h2>
          <p className="text-muted-foreground">Biznesingiz to'liq ko'rinishi</p>
        </div>
        <DataExportButton data={data} filename="analytics" type="analytics" />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.bgColor} border-none hover:shadow-lg transition-all`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trendUp ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs o'tgan oy</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">
            <BarChart3 className="h-4 w-4 mr-2" />
            Aylanma Dinamikasi
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            <PieChartIcon className="h-4 w-4 mr-2" />
            Marketplace bo'yicha
          </TabsTrigger>
          <TabsTrigger value="category">
            <Package className="h-4 w-4 mr-2" />
            Kategoriya bo'yicha
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aylanma va Foyda Dinamikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="aylanma" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    name="Aylanma"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="foyda" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Foyda"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buyurtmalar Soni</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="buyurtmalar" fill="#8b5cf6" name="Buyurtmalar" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace bo'yicha Aylanma</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByMarketplace}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueByMarketplace.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketplace Statistikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByMarketplace.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(item.value)}</p>
                        <p className="text-xs text-muted-foreground">
                          {((item.value / totalRevenue) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kategoriya bo'yicha Aylanma</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
