import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutGrid, Plus, Settings, Eye, EyeOff, GripVertical,
  TrendingUp, DollarSign, Package, ShoppingCart, Target, BarChart3
} from 'lucide-react';

interface Widget {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  position: number;
}

export function CustomDashboardWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', type: 'revenue', title: 'Aylanma', visible: true, position: 1 },
    { id: '2', type: 'profit', title: 'Foyda', visible: true, position: 2 },
    { id: '3', type: 'orders', title: 'Buyurtmalar', visible: true, position: 3 },
    { id: '4', type: 'products', title: 'Mahsulotlar', visible: true, position: 4 },
    { id: '5', type: 'conversion', title: 'Konversiya', visible: false, position: 5 },
    { id: '6', type: 'traffic', title: 'Trafik', visible: false, position: 6 },
  ]);

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    ));
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'revenue': return DollarSign;
      case 'profit': return TrendingUp;
      case 'orders': return ShoppingCart;
      case 'products': return Package;
      case 'conversion': return Target;
      case 'traffic': return BarChart3;
      default: return LayoutGrid;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-indigo-600" />
            Maxsus Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            O'zingizga kerakli widgetlarni tanlang va joylashtiring
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Sozlash
        </Button>
      </div>

      {/* Widget Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Widget Sozlamalari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {widgets.map((widget) => {
              const Icon = getWidgetIcon(widget.type);
              return (
                <div
                  key={widget.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    widget.visible 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleWidget(widget.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-5 w-5 ${widget.visible ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {widget.visible ? (
                      <Eye className="h-4 w-4 text-indigo-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <p className={`font-medium ${widget.visible ? 'text-indigo-900' : 'text-gray-600'}`}>
                    {widget.title}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Widgets Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets
          .filter(w => w.visible)
          .sort((a, b) => a.position - b.position)
          .map((widget) => {
            const Icon = getWidgetIcon(widget.type);
            return (
              <Card key={widget.id} className="hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <Icon className="h-4 w-4 text-indigo-600" />
                      {widget.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-3xl font-bold text-indigo-600">
                      {Math.floor(Math.random() * 1000)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Real vaqt ma'lumotlari
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-indigo-100">
              <LayoutGrid className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Maxsus Dashboard Haqida</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Siz o'zingizga kerakli widgetlarni tanlashingiz va ularni drag & drop orqali 
                joylashtirish imkoniyatiga egasiz. Har bir widget real vaqt ma'lumotlarini ko'rsatadi.
              </p>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Yangi Widget Qo'shish
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
