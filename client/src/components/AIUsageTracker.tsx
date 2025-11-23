// AI USAGE TRACKER - Partner Dashboard
// Shows AI service usage, costs, and breakdown

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Sparkles,
  TrendingUp,
  DollarSign,
  Zap,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Image as ImageIcon,
  Search,
  Target
} from 'lucide-react';

interface AIUsageTrackerProps {
  monthlyRevenue?: number;
  pricingTier?: string;
}

export function AIUsageTracker({ monthlyRevenue = 50000000, pricingTier = 'business_standard' }: AIUsageTrackerProps) {
  // AI Service pricing based on usage
  const aiServices = {
    seo_optimization: {
      name: 'SEO Optimizatsiya',
      icon: Search,
      usageCount: 45, // mahsulot kartochkalari
      pricePerUnit: 50000, // 50k per kartochka
      totalCost: 2250000,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Mahsulot kartochkalari SEO optimizatsiya'
    },
    content_generation: {
      name: 'Kontent Yaratish',
      icon: FileText,
      usageCount: 120, // tavsiflar
      pricePerUnit: 20000, // 20k per tavsif
      totalCost: 2400000,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'AI bilan mahsulot tavsiflari'
    },
    image_optimization: {
      name: 'Rasm Optimizatsiya',
      icon: ImageIcon,
      usageCount: 200, // rasmlar
      pricePerUnit: 10000, // 10k per rasm
      totalCost: 2000000,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      description: 'Rasm sifati va hajmini optimizatsiya'
    },
    market_analysis: {
      name: 'Bozor Tahlili',
      icon: BarChart3,
      usageCount: 30, // tahlil
      pricePerUnit: 100000, // 100k per tahlil
      totalCost: 3000000,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      description: 'AI raqobatchilar va bozor tahlili'
    },
    price_optimization: {
      name: 'Narx Strategiyasi',
      icon: Target,
      usageCount: 45, // mahsulotlar
      pricePerUnit: 30000, // 30k per mahsulot
      totalCost: 1350000,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      description: 'Avtomatik narx optimizatsiya'
    }
  };

  // Calculate totals
  const totalAICost = Object.values(aiServices).reduce((sum, service) => sum + service.totalCost, 0);
  const totalUsageCount = Object.values(aiServices).reduce((sum, service) => sum + service.usageCount, 0);

  // AI ROI calculation
  const estimatedRevenueLift = monthlyRevenue * 0.35; // 35% revenue lift from AI
  const aiROI = ((estimatedRevenueLift - totalAICost) / totalAICost * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-2 border-purple-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              AI Xizmatlari Harajati
            </CardTitle>
            <Badge className="bg-purple-600 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Total AI Cost */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm opacity-90">Jami AI Harajat</span>
              </div>
              <div className="text-3xl font-bold">
                {(totalAICost / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs opacity-80 mt-1">so'm/oy</div>
            </div>

            {/* Total Usage */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm opacity-90">Jami Foydalanish</span>
              </div>
              <div className="text-3xl font-bold">{totalUsageCount}</div>
              <div className="text-xs opacity-80 mt-1">AI operatsiya</div>
            </div>

            {/* AI ROI */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm opacity-90">AI ROI</span>
              </div>
              <div className="text-3xl font-bold">+{aiROI}%</div>
              <div className="text-xs opacity-80 mt-1">foyda o'sishi</div>
            </div>
          </div>

          {/* AI Services Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              AI Xizmatlar Tafsiloti
            </h3>
            
            {Object.entries(aiServices).map(([key, service]) => {
              const ServiceIcon = service.icon;
              return (
                <div key={key} className={`${service.bgColor} border border-slate-200 rounded-lg p-4`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`${service.bgColor} border-2 ${service.color.replace('text', 'border')} rounded-lg p-2`}>
                        <ServiceIcon className={`h-5 w-5 ${service.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{service.name}</h4>
                        <p className="text-xs text-slate-600">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-slate-900">
                        {(service.totalCost / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-xs text-slate-600">so'm</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Foydalanish:</span>
                      <span className="font-semibold ml-2">{service.usageCount} marta</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Narx/birlik:</span>
                      <span className="font-semibold ml-2">{(service.pricePerUnit / 1000).toFixed(0)}k</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Budget usage</span>
                      <span>{((service.totalCost / totalAICost) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(service.totalCost / totalAICost) * 100} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Value Proposition */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-green-900 mb-2">AI Foydasi</h4>
                <p className="text-sm text-green-800 mb-3">
                  AI xizmatlari sizning savdolaringizni 35% oshirdi va {(estimatedRevenueLift / 1000000).toFixed(1)}M so'm qo'shimcha daromad keltirdi.
                  Jami AI harajat faqat {(totalAICost / 1000000).toFixed(1)}M - bu {((totalAICost / monthlyRevenue) * 100).toFixed(1)}% sizning aylanmangizdan.
                </p>
                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-1 text-green-700">
                    <TrendingUp className="h-4 w-4" />
                    <span>+{(estimatedRevenueLift / 1000000).toFixed(1)}M daromad</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700">
                    <Sparkles className="h-4 w-4" />
                    <span>ROI: {aiROI}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Note */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <span className="font-semibold">Eslatma:</span> AI xizmatlari harajati foydalanish asosida hisoblanadi.
                Ko'proq foydalansangiz, ko'proq to'laysiz, lekin ko'proq foyda qilasiz! 
                <span className="font-bold text-blue-700"> Bu sizning tarifingizga qo'shimcha to'lov emas.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
