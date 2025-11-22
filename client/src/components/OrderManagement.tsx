import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  marketplace: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  totalAmount: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export function OrderManagement() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/orders');
      return response.json();
    }
  });

  // Fetch order details
  const { data: orderDetails } = useQuery<Order>({
    queryKey: ['/api/orders', selectedOrder?.id],
    queryFn: async () => {
      if (!selectedOrder) return null;
      const response = await apiRequest('GET', `/api/orders/${selectedOrder.id}`);
      return response.json();
    },
    enabled: !!selectedOrder
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, fulfillmentStatus, paymentStatus }: any) => {
      const response = await apiRequest('PUT', `/api/orders/${orderId}/status`, {
        status,
        fulfillmentStatus,
        paymentStatus
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setShowOrderDialog(false);
      setSelectedOrder(null);
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-500', icon: Clock, label: 'Kutilmoqda' },
      confirmed: { color: 'bg-blue-500', icon: CheckCircle, label: 'Tasdiqlandi' },
      picking: { color: 'bg-purple-500', icon: Package, label: 'Yig\'ilmoqda' },
      packed: { color: 'bg-indigo-500', icon: Package, label: 'Qadoqlandi' },
      shipped: { color: 'bg-cyan-500', icon: Truck, label: 'Yuborildi' },
      delivered: { color: 'bg-green-500', icon: CheckCircle, label: 'Yetkazildi' },
      cancelled: { color: 'bg-red-500', icon: XCircle, label: 'Bekor qilindi' },
      returned: { color: 'bg-orange-500', icon: RefreshCw, label: 'Qaytarildi' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-500', label: 'Kutilmoqda' },
      paid: { color: 'bg-green-500', label: 'To\'landi' },
      refunded: { color: 'bg-red-500', label: 'Qaytarildi' },
      failed: { color: 'bg-red-500', label: 'Xatolik' }
    };

    const { color, label } = config[status] || config.pending;
    return <Badge className={color}>{label}</Badge>;
  };

  // Calculate stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    shippedOrders: orders.filter(o => o.status === 'shipped').length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || '0'), 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami Buyurtmalar</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Barcha buyurtmalar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kutilmoqda</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Qayta ishlash kerak
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yuborilgan</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shippedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Yo'lda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami Summa</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Buyurtmalar summasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Buyurtmalar</CardTitle>
          <CardDescription>Barcha buyurtmalar va ularning holati</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Yuklanmoqda...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Hali buyurtmalar yo'q</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Buyurtma #</th>
                    <th className="text-left p-2">Mijoz</th>
                    <th className="text-left p-2">Marketplace</th>
                    <th className="text-left p-2">Sana</th>
                    <th className="text-center p-2">Status</th>
                    <th className="text-center p-2">To'lov</th>
                    <th className="text-right p-2">Summa</th>
                    <th className="text-center p-2">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{order.orderNumber}</code>
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{order.marketplace}</Badge>
                      </td>
                      <td className="p-2 text-sm">
                        {new Date(order.orderDate).toLocaleDateString('uz-UZ')}
                      </td>
                      <td className="text-center p-2">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="text-center p-2">
                        {getPaymentBadge(order.paymentStatus)}
                      </td>
                      <td className="text-right p-2 font-semibold">
                        {formatCurrency(parseFloat(order.totalAmount))}
                      </td>
                      <td className="text-center p-2">
                        <Dialog open={showOrderDialog && selectedOrder?.id === order.id} onOpenChange={(open) => {
                          setShowOrderDialog(open);
                          if (!open) setSelectedOrder(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ko'rish
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Buyurtma Tafsilotlari: {order.orderNumber}</DialogTitle>
                            </DialogHeader>

                            {orderDetails && (
                              <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                                  <div>
                                    <div className="text-sm text-muted-foreground">Mijoz</div>
                                    <div className="font-medium">{orderDetails.customerName}</div>
                                    <div className="text-sm">{orderDetails.customerPhone}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Marketplace</div>
                                    <Badge variant="outline" className="mt-1">{orderDetails.marketplace}</Badge>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                  <h4 className="font-semibold mb-3">Mahsulotlar</h4>
                                  <div className="space-y-2">
                                    {orderDetails.items?.map((item) => (
                                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                          <div className="font-medium">{item.productName}</div>
                                          <div className="text-sm text-muted-foreground">SKU: {item.sku || 'N/A'}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-semibold">{item.quantity} x {formatCurrency(parseFloat(item.unitPrice))}</div>
                                          <div className="text-sm text-muted-foreground">{formatCurrency(parseFloat(item.totalPrice))}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Status Update */}
                                <div className="space-y-4 p-4 border rounded-lg">
                                  <h4 className="font-semibold">Status Yangilash</h4>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Buyurtma Statusi</label>
                                      <Select 
                                        defaultValue={orderDetails.status}
                                        onValueChange={(value) => {
                                          updateStatusMutation.mutate({
                                            orderId: orderDetails.id,
                                            status: value,
                                            fulfillmentStatus: orderDetails.fulfillmentStatus,
                                            paymentStatus: orderDetails.paymentStatus
                                          });
                                        }}
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Kutilmoqda</SelectItem>
                                          <SelectItem value="confirmed">Tasdiqlandi</SelectItem>
                                          <SelectItem value="picking">Yig'ilmoqda</SelectItem>
                                          <SelectItem value="packed">Qadoqlandi</SelectItem>
                                          <SelectItem value="shipped">Yuborildi</SelectItem>
                                          <SelectItem value="delivered">Yetkazildi</SelectItem>
                                          <SelectItem value="cancelled">Bekor qilindi</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium">To'lov Statusi</label>
                                      <Select 
                                        defaultValue={orderDetails.paymentStatus}
                                        onValueChange={(value) => {
                                          updateStatusMutation.mutate({
                                            orderId: orderDetails.id,
                                            status: orderDetails.status,
                                            fulfillmentStatus: orderDetails.fulfillmentStatus,
                                            paymentStatus: value
                                          });
                                        }}
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Kutilmoqda</SelectItem>
                                          <SelectItem value="paid">To'landi</SelectItem>
                                          <SelectItem value="refunded">Qaytarildi</SelectItem>
                                          <SelectItem value="failed">Xatolik</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                                  <span className="font-semibold text-lg">Jami Summa:</span>
                                  <span className="font-bold text-2xl">{formatCurrency(parseFloat(orderDetails.totalAmount))}</span>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
