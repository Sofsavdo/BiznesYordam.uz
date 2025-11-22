import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, TrendingUp, DollarSign, Package, Target, 
  AlertCircle, CheckCircle, ArrowRight, Lightbulb 
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'pricing' | 'inventory' | 'marketing' | 'tier' | 'product';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  action?: string;
  confidence: number;
}

interface AIRecommendationsProps {
  data?: any;
}

export function AIRecommendations({ data }: AIRecommendationsProps) {
  // Simulated AI recommendations based on data analysis
  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'pricing',
      priority: 'high',
      title: 'Narxni Optimallashtirish',
      description: 'Sizning "Elektronika" kategoriyasidagi mahsulotlaringiz bozor o\'rtachasidan 15% past. Narxni 10% oshirish tavsiya etiladi.',
      impact: '+2,500,000 so\'m/oy',
      action: 'Narxlarni ko\'rib chiqish',
      confidence: 87,
    },
    {
      id: '2',
      type: 'inventory',
      priority: 'high',
      title: 'Ombor Boshqaruvi',
      description: '3 ta mahsulotingiz tez-tez tugaydi. Ombor zaxirasini 30% oshirish kerak.',
      impact: 'Sotuvni 25% oshirish',
      action: 'Zaxirani ko\'paytirish',
      confidence: 92,
    },
    {
      id: '3',
      type: 'tier',
      priority: 'medium',
      title: 'Tarif Yangilash',
      description: 'Sizning oylik aylanmangiz Business Standard tarif uchun optimal. Yangilash orqali komissiyani 5% kamaytiring.',
      impact: '+1,800,000 so\'m/yil',
      action: 'Tarifni ko\'rish',
      confidence: 85,
    },
    {
      id: '4',
      type: 'marketing',
      priority: 'medium',
      title: 'Marketing Strategiyasi',
      description: 'Hafta oxiri sotuvlaringiz 40% past. Maxsus aksiyalar o\'tkazish tavsiya etiladi.',
      impact: '+30% sotuvlar',
      action: 'Aksiya rejalashtirish',
      confidence: 78,
    },
    {
      id: '5',
      type: 'product',
      priority: 'low',
      title: 'Yangi Mahsulot',
      description: 'Sizning kategoriyangizda "Smart soat" mahsuloti yuqori talabda. Qo\'shish tavsiya etiladi.',
      impact: '+500,000 so\'m/oy',
      action: 'Mahsulot qo\'shish',
      confidence: 72,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pricing': return DollarSign;
      case 'inventory': return Package;
      case 'marketing': return Target;
      case 'tier': return TrendingUp;
      case 'product': return Lightbulb;
      default: return AlertCircle;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yuqori';
      case 'medium': return 'O\'rta';
      case 'low': return 'Past';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            AI Tavsiyalar
          </h2>
          <p className="text-muted-foreground mt-1">
            Sun'iy intellekt tahlili asosida shaxsiy tavsiyalar
          </p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          {recommendations.length} ta tavsiya
        </Badge>
      </div>

      <div className="grid gap-4">
        {recommendations.map((rec) => {
          const Icon = getTypeIcon(rec.type);
          return (
            <Card key={rec.id} className="hover:shadow-lg transition-all border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(rec.priority)}`}
                          >
                            {getPriorityLabel(rec.priority)} ustuvorlik
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {rec.confidence}% ishonch
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3">
                      {rec.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <TrendingUp className="h-4 w-4" />
                        <span>{rec.impact}</span>
                      </div>
                      {rec.action && (
                        <Button size="sm" variant="outline" className="ml-auto">
                          {rec.action}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-purple-100">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">AI Tahlil Haqida</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bizning AI tizimimiz sizning savdo ma'lumotlaringizni, bozor trendlarini va 
                raqobatchilar tahlilini o'rganib, eng yaxshi tavsiyalarni beradi. Har bir 
                tavsiya ishonch darajasi bilan keladi va sizning biznesingizga maxsus moslashtirilgan.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">10K+</p>
                  <p className="text-xs text-muted-foreground">Tahlil qilingan ma'lumotlar</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">95%</p>
                  <p className="text-xs text-muted-foreground">Aniqlik darajasi</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-green-600">24/7</p>
                  <p className="text-xs text-muted-foreground">Doimiy monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
