import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { AlertTriangle, CheckCircle, XCircle, Package, TrendingDown, Clock } from 'lucide-react';

interface StockAlert {
  id: string;
  productId: string;
  alertType: string;
  severity: string;
  message: string;
  currentStock: number;
  threshold: number;
  isResolved: boolean;
  createdAt: string;
}

export function StockAlerts() {
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery<StockAlert[]>({
    queryKey: ['/api/stock-alerts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/stock-alerts');
      return response.json();
    }
  });

  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await apiRequest('PUT', `/api/stock-alerts/${alertId}/resolve`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stock-alerts'] });
    }
  });

  const getSeverityBadge = (severity: string) => {
    const config: Record<string, { color: string; icon: any }> = {
      low: { color: 'bg-blue-500', icon: Clock },
      medium: { color: 'bg-yellow-500', icon: AlertTriangle },
      high: { color: 'bg-orange-500', icon: AlertTriangle },
      critical: { color: 'bg-red-500', icon: XCircle }
    };

    const { color, icon: Icon } = config[severity] || config.medium;
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'out_of_stock':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'low_stock':
        return <TrendingDown className="w-5 h-5 text-yellow-500" />;
      default:
        return <Package className="w-5 h-5 text-blue-500" />;
    }
  };

  const unresolvedAlerts = alerts.filter(a => !a.isResolved);
  const criticalAlerts = unresolvedAlerts.filter(a => a.severity === 'critical').length;
  const highAlerts = unresolvedAlerts.filter(a => a.severity === 'high').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Stock Ogohlantirishlari</CardTitle>
            <CardDescription>
              {unresolvedAlerts.length} ta hal qilinmagan ogohlantirish
              {criticalAlerts > 0 && ` (${criticalAlerts} kritik)`}
            </CardDescription>
          </div>
          {unresolvedAlerts.length > 0 && (
            <div className="flex gap-2">
              {criticalAlerts > 0 && (
                <Badge className="bg-red-500">
                  <XCircle className="w-3 h-3 mr-1" />
                  {criticalAlerts} Kritik
                </Badge>
              )}
              {highAlerts > 0 && (
                <Badge className="bg-orange-500">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {highAlerts} Yuqori
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {unresolvedAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
            <p className="font-medium">Hammasi yaxshi!</p>
            <p className="text-sm">Hozircha ogohlantirishlar yo'q</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unresolvedAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-start gap-3 p-4 border rounded-lg ${
                  alert.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' :
                  alert.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' :
                  'bg-muted/50'
                }`}
              >
                <div className="mt-0.5">
                  {getAlertIcon(alert.alertType)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleString('uz-UZ')}
                    </span>
                  </div>
                  <p className="font-medium">{alert.message}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Joriy: <strong>{alert.currentStock}</strong></span>
                    <span>Minimum: <strong>{alert.threshold}</strong></span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveAlertMutation.mutate(alert.id)}
                  disabled={resolveAlertMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Hal qilindi
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
