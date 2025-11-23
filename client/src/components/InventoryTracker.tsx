// Inventory Tracker - Real-time tovar kuzatuvi
// Har bir tovar birligini aniq joylashuvini ko'rish

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { Package, MapPin, TrendingUp, Warehouse, Store, Truck, CheckCircle, AlertCircle } from 'lucide-react';

interface InventoryItem {
  id: string;
  uniqueCode: string;
  productName: string;
  category: string;
  locationType: string;
  currentLocation: string;
  marketplace?: string;
  warehouseZone?: string;
  shelfNumber?: string;
  status: string;
  purchasePrice: number;
  salePrice?: number;
  purchaseDate: string;
  soldDate?: string;
}

export function InventoryTracker() {
  const [searchCode, setSearchCode] = useState('');

  const { data: items = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory/items'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/inventory/items');
      return response.json();
    }
  });

  // Joylashuv bo'yicha statistika
  const stats = {
    total: items.length,
    inWarehouse: items.filter(i => i.locationType === 'warehouse').length,
    inMarketplace: items.filter(i => i.locationType === 'marketplace').length,
    sold: items.filter(i => i.status === 'sold').length,
    inTransit: items.filter(i => i.locationType === 'in_transit').length
  };

  // Search filter
  const filteredItems = items.filter(item =>
    item.uniqueCode.toLowerCase().includes(searchCode.toLowerCase()) ||
    item.productName.toLowerCase().includes(searchCode.toLowerCase())
  );

  const getLocationIcon = (locationType: string) => {
    switch(locationType) {
      case 'warehouse': return <Warehouse className="h-4 w-4" />;
      case 'marketplace': return <Store className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'sold': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Inventory Tracker
        </h2>
        <p className="text-muted-foreground">Har bir tovar birligini real-time kuzatish</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Jami</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.inWarehouse}</div>
                <div className="text-xs text-muted-foreground">Omborda</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{stats.inMarketplace}</div>
                <div className="text-xs text-muted-foreground">Marketplaceda</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{stats.inTransit}</div>
                <div className="text-xs text-muted-foreground">Yo'lda</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.sold}</div>
                <div className="text-xs text-muted-foreground">Sotilgan</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div>
        <Input
          placeholder="SKU yoki mahsulot nomini qidiring..."
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Items List */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getLocationIcon(item.locationType)}
                    <div>
                      <h3 className="font-semibold">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.uniqueCode}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Joylashuv</p>
                      <p className="font-medium text-sm">{item.currentLocation || '-'}</p>
                    </div>
                    {item.warehouseZone && (
                      <div>
                        <p className="text-xs text-muted-foreground">Zona/Javon</p>
                        <p className="font-medium text-sm">{item.warehouseZone} / {item.shelfNumber}</p>
                      </div>
                    )}
                    {item.marketplace && (
                      <div>
                        <p className="text-xs text-muted-foreground">Marketplace</p>
                        <p className="font-medium text-sm capitalize">{item.marketplace}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Xarid narxi</p>
                      <p className="font-medium text-sm">{item.purchasePrice.toLocaleString()} so'm</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status === 'available' && 'Mavjud'}
                    {item.status === 'reserved' && 'Band'}
                    {item.status === 'sold' && 'Sotilgan'}
                    {item.status === 'damaged' && 'Shikastlangan'}
                  </Badge>

                  {item.salePrice && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Sotuv narxi</p>
                      <p className="font-bold text-green-600">{item.salePrice.toLocaleString()} so'm</p>
                      <p className="text-xs text-green-600">
                        +{(item.salePrice - item.purchasePrice).toLocaleString()} so'm
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Hech narsa topilmadi</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
