// DEMO SHOWCASE - Partner Dashboard Live Preview
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Package, DollarSign, Target, Zap, 
  BarChart3, Globe, Brain, CheckCircle, ArrowRight,
  Clock, Users, Star, Sparkles, Activity
} from 'lucide-react';

export function DemoShowcase() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-base">
          <Sparkles className="w-4 h-4 mr-2" />
          Live Platform Demo
        </Badge>
        <h2 className="text-5xl font-black mb-4">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Hamkor Dashboardini Ko'ring
          </span>
        </h2>
        <p className="text-xl text-gray-600">Real platform - Real imkoniyatlar - Real foyda</p>
      </div>

      {/* Dashboard Preview 1: Overview Stats */}
      <Card className="border-2 border-purple-300 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Umumiy Ko'rinish - Real-time Stats
          </h3>
        </div>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
              <DollarSign className="w-10 h-10 text-blue-600 mb-3" />
              <div className="text-3xl font-black text-gray-900">24.7M</div>
              <div className="text-sm text-gray-600">Oylik Savdo</div>
              <Badge className="mt-2 bg-green-100 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                +180%
              </Badge>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300">
              <Target className="w-10 h-10 text-green-600 mb-3" />
              <div className="text-3xl font-black text-gray-900">8.9M</div>
              <div className="text-sm text-gray-600">Sof Foyda</div>
              <Badge className="mt-2 bg-green-100 text-green-700">
                36% margin
              </Badge>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-300">
              <Package className="w-10 h-10 text-purple-600 mb-3" />
              <div className="text-3xl font-black text-gray-900">247</div>
              <div className="text-sm text-gray-600">Aktiv SKU</div>
              <Badge className="mt-2 bg-purple-100 text-purple-700">
                <Zap className="w-3 h-3 mr-1" />
                AI managed
              </Badge>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-300">
              <Globe className="w-10 h-10 text-orange-600 mb-3" />
              <div className="text-3xl font-black text-gray-900">3</div>
              <div className="text-sm text-gray-600">Marketplace</div>
              <Badge className="mt-2 bg-orange-100 text-orange-700">
                Uzum, Wildberries, Ozon
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Preview 2: AI Manager */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-2 border-blue-300 shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Manager - 24/7 Ishlayapti
            </h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { task: 'USB-C Hub kartochkasi yaratildi', time: '2 min', status: 'completed' },
                { task: 'Wildberries ga yuklandi', time: '1 min', status: 'completed' },
                { task: 'Narx optimizatsiya qilindi', time: '30 sec', status: 'completed' },
                { task: 'Gaming Mouse tahlil qilinmoqda', time: 'Live', status: 'processing' }
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <div>
                      <p className="font-semibold text-sm">{task.task}</p>
                      <p className="text-xs text-gray-500">{task.time}</p>
                    </div>
                  </div>
                  <Badge className={task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                    {task.status === 'completed' ? 'Tayyor' : 'Jarayonda'}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bugun yaratildi:</span>
                <span className="text-2xl font-black text-green-600">47 kartochka</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Tejash:</span>
                <span className="text-xl font-bold text-blue-600">94 soat!</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Hunter */}
        <Card className="border-2 border-purple-300 shadow-xl">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Trend Hunter - Bestseller Toping
            </h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[
                { product: 'USB-C Hub 7-in-1', trend: 95, sales: '12.4K', profit: '320%' },
                { product: 'Gaming Mouse RGB', trend: 88, sales: '8.9K', profit: '280%' },
                { product: 'Wireless Earbuds', trend: 82, sales: '15.2K', profit: '240%' }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-sm">
                        #{i + 1}
                      </div>
                      <span className="font-bold text-gray-900">{item.product}</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      Trend: {item.trend}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-600">Sotuvlar:</span>
                      <span className="font-bold text-blue-600 ml-2">{item.sales}/oy</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Foyda:</span>
                      <span className="font-bold text-green-600 ml-2">{item.profit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
              <p className="text-sm font-bold text-yellow-800 flex items-center gap-2">
                <Star className="w-4 h-4" />
                AI 3 ta bestseller topdi - +4.2M so'm potentsial foyda!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Preview 3: Analytics */}
      <Card className="border-2 border-green-300 shadow-xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Sof Foyda Analizi - Har Bir So'm Aniq
          </h3>
        </div>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl font-black text-blue-600 mb-2">24.7M</div>
              <div className="text-sm text-gray-600">Savdo</div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="text-4xl font-black text-red-600 mb-2">-12.3M</div>
              <div className="text-sm text-gray-600">Xarajatlar</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl font-black text-green-600 mb-2">12.4M</div>
              <div className="text-sm text-gray-600 font-bold">SOF FOYDA</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Mahsulot xarajati</span>
              <span className="font-bold">8.5M so'm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Marketplace fee</span>
              <span className="font-bold">2.1M so'm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">SellerCloudX (8M abonent + 25% foyda)</span>
              <span className="font-bold">1.7M so'm</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-300">
              <span className="text-base font-bold">SIZNING FOYDANGIZ:</span>
              <span className="text-3xl font-black text-green-600">12.4M so'm</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <p className="text-center font-bold text-gray-900">
              Inson manager bilan: <span className="text-red-600 line-through">4.2M foyda</span>
              <br />
              <span className="text-green-600 text-2xl">AI bilan: 12.4M foyda (+8.2M ko'proq!)</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparison: Human vs AI */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Users className="w-6 h-6" />
              Inson Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">Ish vaqti</span>
                <span className="font-bold">8 soat/kun</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">1 kartochka</span>
                <span className="font-bold text-red-600">3 soat</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">Xatolar</span>
                <span className="font-bold text-red-600">5-15%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">Oylik maosh</span>
                <span className="font-bold text-red-600">12M so'm</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">Trend tahlil</span>
                <span className="font-bold text-red-600">Cheklangan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-blue-50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Brain className="w-6 h-6" />
              AI Manager (SellerCloudX)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">Ish vaqti</span>
                <span className="font-bold text-green-600">24/7/365</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">1 kartochka</span>
                <span className="font-bold text-green-600">2 daqiqa (90x tez!)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">Xatolar</span>
                <span className="font-bold text-green-600">0.2% (50x kam!)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">Oylik to'lov</span>
                <span className="font-bold text-green-600">8M so'm (tarif)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm">Trend tahlil</span>
                <span className="font-bold text-green-600">FULL (AI powered)</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg text-center">
              <p className="text-2xl font-black">TEJASH: 14M so'm/oy!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl">
        <CardContent className="p-12 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-4xl font-black mb-4">Hozir Sinab Ko'ring!</h3>
          <p className="text-xl mb-8 opacity-90">
            3 kunlik bepul trial - 5 kartochka + 5 trend search
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 text-2xl px-16 py-8 shadow-xl"
          >
            <Zap className="w-6 h-6 mr-3" />
            3 KUN BEPUL BOSHLASH
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
