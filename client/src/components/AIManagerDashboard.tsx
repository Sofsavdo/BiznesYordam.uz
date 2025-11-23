// AI AUTONOMOUS MANAGER - Admin Dashboard (Part 1)
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { formatCurrency } from '@/lib/currency';
import {
  Bot, Zap, AlertTriangle, CheckCircle, Clock, TrendingUp, Package,
  Settings, Play, Eye, Activity, RefreshCw
} from 'lucide-react';

export function AIManagerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('overview');

  const { data: partners = [] } = useQuery<any[]>({
    queryKey: ['admin-partners'],
    queryFn: async () => {
      const response = await fetch('/api/admin/partners', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: aiTasks = [] } = useQuery<any[]>({
    queryKey: ['ai-tasks'],
    queryFn: async () => {
      const response = await fetch('/api/ai-manager/tasks', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: aiAlerts = [] } = useQuery<any[]>({
    queryKey: ['ai-alerts'],
    queryFn: async () => {
      const response = await fetch('/api/ai-manager/alerts', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: aiProducts = [] } = useQuery<any[]>({
    queryKey: ['ai-products'],
    queryFn: async () => {
      const response = await fetch('/api/ai-manager/products', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: aiConfig } = useQuery<any>({
    queryKey: ['ai-config'],
    queryFn: async () => {
      const response = await fetch('/api/ai-manager/config', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const triggerMonitoringMutation = useMutation({
    mutationFn: async (partnerId: number) => {
      const response = await fetch(`/api/ai-manager/monitor/partner/${partnerId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to trigger monitoring');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-alerts'] });
      toast({ title: '✅ Monitoring boshlandi' });
    },
  });

  const stats = {
    totalTasks: aiTasks.length,
    completedTasks: aiTasks.filter((t: any) => t.status === 'completed').length,
    openAlerts: aiAlerts.filter((a: any) => a.status === 'open').length,
    productsGenerated: aiProducts.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            AI Autonomous Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Sun'iy intellekt bilan avtomatik marketplace boshqaruvi
          </p>
        </div>
        <Badge className={aiConfig?.is_enabled ? 'bg-green-500' : 'bg-red-500'}>
          {aiConfig?.is_enabled ? '🟢 Faol' : '🔴 O\'chiq'}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-blue-700">Jami Vazifalar</p>
            <p className="text-3xl font-bold text-blue-900">{stats.totalTasks}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-green-700">Mahsulotlar</p>
            <p className="text-3xl font-bold text-green-900">{stats.productsGenerated}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-orange-700">Ogohlantirishlar</p>
            <p className="text-3xl font-bold text-orange-900">{stats.openAlerts}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-purple-700">Samaradorlik</p>
            <p className="text-3xl font-bold text-purple-900">
              {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Umumiy</TabsTrigger>
          <TabsTrigger value="partners">Hamkorlar</TabsTrigger>
          <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
          <TabsTrigger value="alerts">Ogohlantirishlar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>So'nggi Vazifalar</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiTasks.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="p-3 bg-muted/30 rounded-lg flex justify-between">
                    <span>{task.task_type}</span>
                    <Badge>{task.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners">
          <div className="grid grid-cols-3 gap-4">
            {partners.map((partner: any) => (
              <Card key={partner.id}>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{partner.businessName}</h4>
                  <Badge variant="outline" className="mb-3">{partner.pricingTier}</Badge>
                  <Button size="sm" className="w-full" onClick={() => triggerMonitoringMutation.mutate(partner.id)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Monitoring
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products">
          {aiProducts.map((product: any) => (
            <Card key={product.id} className="mb-3">
              <CardContent className="p-4">
                <h4 className="font-semibold">{product.ai_title}</h4>
                <p className="text-sm text-muted-foreground">{product.ai_description?.substring(0, 100)}...</p>
                <div className="flex gap-4 mt-2">
                  <span>SEO: {product.seo_score}/100</span>
                  <span>Narx: {formatCurrency(product.suggested_price)}</span>
                  <Badge>{product.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts">
          {aiAlerts.map((alert: any) => (
            <Card key={alert.id} className="mb-3">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{alert.title}</h4>
                    <p className="text-sm">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">💡 {alert.ai_suggested_action}</p>
                  </div>
                  <Badge>{alert.severity}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
