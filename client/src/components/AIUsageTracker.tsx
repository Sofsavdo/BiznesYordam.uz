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
  aiEnabled?: boolean;
  onToggleAI?: (enabled: boolean) => void;
}

export function AIUsageTracker({ 
  monthlyRevenue = 50000000, 
  pricingTier = 'business_standard',
  aiEnabled = false,
  onToggleAI
}: AIUsageTrackerProps) {
  // AI Service pricing - REALISTIC (1M/month total)
  const aiServices = {
    seo_optimization: {
      name: 'SEO Optimizatsiya',
      icon: Search,
      usageCount: aiEnabled ? 20 : 0,
      pricePerUnit: 15000,
      totalCost: aiEnabled ? 300000 : 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Mahsulot kartochkalari SEO optimizatsiya'
    },
    content_generation: {
      name: 'Kontent Yaratish',
      icon: FileText,
      usageCount: aiEnabled ? 30 : 0,
      pricePerUnit: 10000,
      totalCost: aiEnabled ? 300000 : 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'AI bilan mahsulot tavsiflari'
    },
    image_optimization: {
      name: 'Rasm Optimizatsiya',
      icon: ImageIcon,
      usageCount: aiEnabled ? 40 : 0,
      pricePerUnit: 5000,
      totalCost: aiEnabled ? 200000 : 0,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      description: 'Rasm sifati va hajmini optimizatsiya'
    },
    market_analysis: {
      name: 'Bozor Tahlili (Trend Hunter)',
      icon: BarChart3,
      usageCount: aiEnabled ? 5 : 0,
      pricePerUnit: 40000,
      totalCost: aiEnabled ? 200000 : 0,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      description: 'AI trend tahlili va raqobatchilar'
    }
  };

  // Calculate totals - 1M/month when enabled
  const totalAICost = aiEnabled ? 1000000 : 0;
  const totalUsageCount = Object.values(aiServices).reduce((sum, service) => sum + service.usageCount, 0);

  // AI ROI calculation
  const estimatedRevenueLift = aiEnabled ? monthlyRevenue * 0.25 : 0; // 25% revenue lift
  const aiROI = aiEnabled && totalAICost > 0 ? ((estimatedRevenueLift - totalAICost) / totalAICost * 100).toFixed(0) : '0';

  return (
    <div className="space-y-6">
      {/* AI Toggle Card */}
      <Card className={`border-2 shadow-xl ${aiEnabled ? 'border-green-400 bg-green-50/30' : 'border-slate-300 bg-slate-50'}`}>
        <CardHeader className={aiEnabled ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-slate-100'}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className={`h-6 w-6 ${aiEnabled ? 'text-green-600' : 'text-slate-400'}`} />
              AI Xizmatlari {aiEnabled ? '(Faol)' : '(O\'chirilgan)'}
            </CardTitle>
            <div className="flex items-center gap-3">
              {!aiEnabled && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Admin tasdig'i kerak
                </Badge>
              )}
              <button
                onClick={() => onToggleAI?.(!aiEnabled)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  aiEnabled ? 'bg-green-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    aiEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {!aiEnabled && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Zap className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">AI Xizmatlarni Yoqing!</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    AI xizmatlari sizga quyidagilarni beradi:
                  </p>
                  <ul className="space-y-2 text-sm text-blue-900">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span><strong>25% savdo o'sishi</strong> - AI optimizatsiya</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span><strong>Trend Hunter</strong> - Eng yaxshi mahsulotlarni topish</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span><strong>Avtomatik SEO</strong> - Professional kartochkalar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span><strong>Bozor tahlili</strong> - Raqobatchilarni kuzatish</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-white rounded-lg border-2 border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">Oylik to'lov:</span>
                      <span className="text-2xl font-bold text-blue-600">1,000,000 so'm</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Taxminiy qo'shimcha foyda: {((monthlyRevenue * 0.25) / 1000000).toFixed(1)}M so'm/oy
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mt-3 font-semibold">
                    ⚠️ AI xizmatni yoqish uchun yuqoridagi tugmani bosing. Admin tasdig'idan keyin faollashadi.
                  </p>
                </div>
              </div>
            </div>
          )}
          {aiEnabled && (
            <>
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
              <div className="text-3xl font-bold">+{aiROI || 0}%</div>
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

          {/* Success Message */}
          <div className="mt-4 bg-green-50 border-2 border-green-300 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="text-sm text-green-900">
                <span className="font-semibold">AI Xizmatlari Faol!</span> Sizning savdolaringiz AI tomonidan optimizatsiya qilinmoqda.
                Trend Hunter ham faol - eng yaxshi mahsulotlarni topamiz!
              </div>
            </div>
          </div>
          </>
          )}
          
          {/* Pricing Note */}
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-slate-600 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Eslatma:</span> AI xizmatlari <strong>ixtiyoriy</strong> qo'shimcha xizmatdir.
                {aiEnabled ? (
                  <span> Siz AI xizmatlardan foydalanyapsiz - oylik 1M so'm. Istalgan vaqt o'chirib qo'yishingiz mumkin.</span>
                ) : (
                  <span> AI xizmatni yoqsangiz, oylik 1M so'm to'lasiz va 25% savdo o'sishini kutishingiz mumkin.</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
