import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Minus,
  RefreshCw,
  BarChart3,
  Archive,
  ArrowUpDown,
  Search,
  Filter
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  price: string;
  costPrice: string;
  lastStockUpdate: string;
}

interface InventoryStats {
  totalProducts: number;
  totalStock: number;
  totalValue: string;
  inStockProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  stockHealth: string;
}

interface StockMovement {
  id: string;
  productId: string;
  movementType: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}

export function InventoryManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [stockUpdateData, setStockUpdateData] = useState({
    quantity: '',
    movementType: 'inbound' as 'inbound' | 'outbound' | 'adjustment',
    reason: '',
    notes: ''
  });

  // Fetch inventory stats
  const { data: stats } = useQuery<InventoryStats>({
    queryKey: ['/api/inventory/stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/inventory/stats');
      return response.json();
    }
  });

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/products');
      return response.json();
    }
  });

  // Fetch stock movements for selected product
  const { data: movements = [] } = useQuery<StockMovement[]>({
    queryKey: ['/api/stock/movements', selectedProduct?.id],
    queryFn: async () => {
      if (!selectedProduct) return [];
      const response = await apiRequest('GET', `/api/stock/movements?productId=${selectedProduct.id}`);
      return response.json();
    },
    enabled: !!selectedProduct
  });

  // Update stock mutation
  const updateStockMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/stock/update', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stock/movements'] });
      setShowStockDialog(false);
      setStockUpdateData({ quantity: '', movementType: 'inbound', reason: '', notes: '' });
      setSelectedProduct(null);
    }
  });

  const handleStockUpdate = async () => {
    if (!selectedProduct || !stockUpdateData.quantity || !stockUpdateData.reason) {
      return;
    }

    // Get first warehouse (in real app, let user select)
    const warehousesResponse = await apiRequest('GET', '/api/warehouses');
    const warehouses = await warehousesResponse.json();
    const warehouseId = warehouses[0]?.id;

    if (!warehouseId) {
      alert('Ombor topilmadi. Avval ombor yarating.');
      return;
    }

    await updateStockMutation.mutateAsync({
      productId: selectedProduct.id,
      warehouseId,
      quantity: parseInt(stockUpdateData.quantity),
      movementType: stockUpdateData.movementType,
      reason: stockUpdateData.reason,
      notes: stockUpdateData.notes
    });
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || product.stockStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Mavjud</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-500"><AlertTriangle className="w-3 h-3 mr-1" />Kam qoldi</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-500"><AlertTriangle className="w-3 h-3 mr-1" />Tugadi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'inbound':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'outbound':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami Mahsulotlar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.inStockProducts || 0} mavjud
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami Qoldiq</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStock || 0}</div>
            <p className="text-xs text-muted-foreground">
              dona mahsulot
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ombor Qiymati</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(parseFloat(stats?.totalValue || '0'))}</div>
            <p className="text-xs text-muted-foreground">
              tannarx bo'yicha
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ombor Salomatligi</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.stockHealth || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.lowStockProducts || 0} kam, {stats?.outOfStockProducts || 0} tugagan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mahsulotlar Ombori</CardTitle>
              <CardDescription>Barcha mahsulotlar va ularning qoldiqlari</CardDescription>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Mahsulot nomi yoki SKU bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="in_stock">Mavjud</SelectItem>
                <SelectItem value="low_stock">Kam qoldi</SelectItem>
                <SelectItem value="out_of_stock">Tugagan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Yuklanmoqda...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Mahsulotlar topilmadi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Mahsulot</th>
                    <th className="text-left p-2">SKU</th>
                    <th className="text-center p-2">Jami</th>
                    <th className="text-center p-2">Band</th>
                    <th className="text-center p-2">Mavjud</th>
                    <th className="text-center p-2">Min/Max</th>
                    <th className="text-center p-2">Status</th>
                    <th className="text-center p-2">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.category}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{product.sku || 'N/A'}</code>
                      </td>
                      <td className="text-center p-2">
                        <span className="font-semibold">{product.currentStock}</span>
                      </td>
                      <td className="text-center p-2">
                        <span className="text-yellow-600">{product.reservedStock}</span>
                      </td>
                      <td className="text-center p-2">
                        <span className="text-green-600 font-semibold">{product.availableStock}</span>
                      </td>
                      <td className="text-center p-2 text-sm text-muted-foreground">
                        {product.minStockLevel} / {product.maxStockLevel}
                      </td>
                      <td className="text-center p-2">
                        {getStockStatusBadge(product.stockStatus)}
                      </td>
                      <td className="text-center p-2">
                        <Dialog open={showStockDialog && selectedProduct?.id === product.id} onOpenChange={(open) => {
                          setShowStockDialog(open);
                          if (!open) setSelectedProduct(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <ArrowUpDown className="w-4 h-4 mr-1" />
                              Yangilash
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Stock Yangilash: {product.name}</DialogTitle>
                              <DialogDescription>
                                Mahsulot qoldiqlarini yangilang va harakatlar tarixini ko'ring
                              </DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="update" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="update">Yangilash</TabsTrigger>
                                <TabsTrigger value="history">Tarix</TabsTrigger>
                              </TabsList>

                              <TabsContent value="update" className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                                  <div className="text-center">
                                    <div className="text-sm text-muted-foreground">Jami</div>
                                    <div className="text-2xl font-bold">{product.currentStock}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-muted-foreground">Band</div>
                                    <div className="text-2xl font-bold text-yellow-600">{product.reservedStock}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-muted-foreground">Mavjud</div>
                                    <div className="text-2xl font-bold text-green-600">{product.availableStock}</div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <Label>Harakat turi</Label>
                                    <Select 
                                      value={stockUpdateData.movementType} 
                                      onValueChange={(value: any) => setStockUpdateData({...stockUpdateData, movementType: value})}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="inbound">
                                          <div className="flex items-center">
                                            <Plus className="w-4 h-4 mr-2 text-green-500" />
                                            Qabul qilish (Inbound)
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="outbound">
                                          <div className="flex items-center">
                                            <Minus className="w-4 h-4 mr-2 text-red-500" />
                                            Chiqarish (Outbound)
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="adjustment">
                                          <div className="flex items-center">
                                            <RefreshCw className="w-4 h-4 mr-2 text-blue-500" />
                                            Tuzatish (Adjustment)
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label>Miqdor</Label>
                                    <Input
                                      type="number"
                                      placeholder="Miqdorni kiriting"
                                      value={stockUpdateData.quantity}
                                      onChange={(e) => setStockUpdateData({...stockUpdateData, quantity: e.target.value})}
                                    />
                                  </div>

                                  <div>
                                    <Label>Sabab *</Label>
                                    <Input
                                      placeholder="Sabab kiriting (masalan: Yangi yetkazib berish)"
                                      value={stockUpdateData.reason}
                                      onChange={(e) => setStockUpdateData({...stockUpdateData, reason: e.target.value})}
                                    />
                                  </div>

                                  <div>
                                    <Label>Izoh (ixtiyoriy)</Label>
                                    <Input
                                      placeholder="Qo'shimcha ma'lumot"
                                      value={stockUpdateData.notes}
                                      onChange={(e) => setStockUpdateData({...stockUpdateData, notes: e.target.value})}
                                    />
                                  </div>

                                  <Button 
                                    onClick={handleStockUpdate} 
                                    disabled={updateStockMutation.isPending || !stockUpdateData.quantity || !stockUpdateData.reason}
                                    className="w-full"
                                  >
                                    {updateStockMutation.isPending ? (
                                      <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Yangilanmoqda...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Yangilash
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </TabsContent>

                              <TabsContent value="history" className="space-y-4">
                                {movements.length === 0 ? (
                                  <div className="text-center py-8 text-muted-foreground">
                                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Hali harakatlar yo'q</p>
                                  </div>
                                ) : (
                                  <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {movements.map((movement) => (
                                      <div key={movement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                        {getMovementIcon(movement.movementType)}
                                        <div className="flex-1">
                                          <div className="font-medium">{movement.reason}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {new Date(movement.createdAt).toLocaleString('uz-UZ')}
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-semibold">
                                            {movement.movementType === 'inbound' ? '+' : movement.movementType === 'outbound' ? '-' : ''}
                                            {movement.quantity}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {movement.previousStock} → {movement.newStock}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </TabsContent>
                            </Tabs>
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
