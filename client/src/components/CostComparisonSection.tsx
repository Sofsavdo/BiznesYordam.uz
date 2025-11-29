// client/src/components/CostComparisonSection.tsx
// TRADITIONAL vs SellerCloudX - COST COMPARISON

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import {
  Users,
  Warehouse,
  TrendingDown,
  TrendingUp,
  XCircle,
  CheckCircle,
  Zap,
  DollarSign,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function CostComparisonSection() {
  const [, setLocation] = useLocation();
  const traditionalCosts = {
    title: "An'anaviy Usul",
    subtitle: "2-3 hodim + Ombor + Inventar",
    totalMonthly: "45,000,000",
    breakdown: [
      {
        category: "💼 Hodimlar (2-3 kishi)",
        items: [
          { name: "Marketplace manager", cost: "8,000,000", icon: Users },
          { name: "Mahsulot kartochkasi mutaxassis", cost: "7,000,000", icon: Users },
          { name: "Logistika koordinatori", cost: "6,000,000", icon: Users },
          { name: "Ijtimoiy to'lovlar (25%)", cost: "5,250,000", icon: DollarSign }
        ],
        total: "26,250,000"
      },
      {
        category: "🏢 Ombor va Infrastuktura",
        items: [
          { name: "Ombor ijara (100m²)", cost: "5,000,000", icon: Warehouse },
          { name: "Kommunal xizmatlar", cost: "800,000", icon: Zap },
          { name: "Internet va software", cost: "500,000", icon: Sparkles },
          { name: "Xavfsizlik va monitoring", cost: "400,000", icon: AlertTriangle }
        ],
        total: "6,700,000"
      },
      {
        category: "📦 Inventar va Jihozlar",
        items: [
          { name: "Qadoqlash materiallari", cost: "2,000,000", icon: AlertTriangle },
          { name: "Texnika (kompyuter, printer)", cost: "1,500,000", icon: Sparkles },
          { name: "Transport (benzin, ta'mirlash)", cost: "2,500,000", icon: Warehouse },
          { name: "Boshqa xarajatlar", cost: "1,000,000", icon: DollarSign }
        ],
        total: "7,000,000"
      },
      {
        category: "⚠️ Yashirin Xarajatlar",
        items: [
          { name: "Xatolar va qayta ishlash", cost: "2,000,000", icon: XCircle },
          { name: "Vaqt yo'qotishlari", cost: "1,500,000", icon: Clock },
          { name: "Sifat nazorati muammolari", cost: "1,000,000", icon: AlertTriangle },
          { name: "Jamoani boshqarish", cost: "550,000", icon: Users }
        ],
        total: "5,050,000"
      }
    ],
    problems: [
      "❌ Hodimlar kasallik, ta'til - ishlab ketishi to'xtaydi",
      "❌ Xatolar va qayta ishlash vaqti (10-15%)",
      "❌ Sifatsiz mahsulot kartochkalari → kam savdo",
      "❌ Ombor muammolari → mijoz noroziligi",
      "❌ Doimiy nazorat va stresslar",
      "❌ Miqyoslash qiyin va qimmat"
    ],
    color: "red"
  };

  const SellerCloudXCosts = {
    title: "SellerCloudX.uz",
    subtitle: "AI + Profit Share Model",
    totalMonthly: "8,000,000",
    breakdown: [
      {
        category: "💎 Business Standard Tarif",
        items: [
          { name: "Oylik abonent", cost: "8,000,000", icon: Sparkles },
          { name: "Profit share: 25% (faqat foyda bo'lsa!)", cost: "0", icon: CheckCircle },
          { name: "2 marketplace integratsiya", cost: "0", icon: CheckCircle },
          { name: "500 mahsulot boshqaruv", cost: "0", icon: CheckCircle },
          { name: "500kg omborxona", cost: "0", icon: CheckCircle },
          { name: "SPT xizmati BEPUL", cost: "0", icon: CheckCircle }
        ],
        total: "8,000,000"
      },
      {
        category: "🤖 AI Xizmatlari (Qo'shimcha)",
        items: [
          { name: "AI mahsulot kartochkalari", cost: "~500,000", icon: Sparkles },
          { name: "Trend scanner", cost: "~300,000", icon: TrendingUp },
          { name: "Price optimizer", cost: "~200,000", icon: DollarSign },
          { name: "Analytics va prognoz", cost: "0", icon: CheckCircle }
        ],
        total: "~1,000,000"
      }
    ],
    benefits: [
      "✅ 24/7 to'xtovsiz ishlash (kasallik, ta'til yo'q)",
      "✅ AI 95% aniqlik → xatolar minimallashadi",
      "✅ Professional SEO → 3x ko'p savdo",
      "✅ Avtomatik fulfillment → mijoz qoniqishi",
      "✅ Zero stress - hammasi avtomatik",
      "✅ 1 klik bilan scaling (cheksiz o'sish)"
    ],
    color: "green"
  };

  const savings = {
    monthly: (parseFloat(traditionalCosts.totalMonthly.replace(/,/g, '')) - 
              parseFloat(SellerCloudXCosts.totalMonthly.replace(/,/g, ''))).toLocaleString(),
    yearly: ((parseFloat(traditionalCosts.totalMonthly.replace(/,/g, '')) - 
             parseFloat(SellerCloudXCosts.totalMonthly.replace(/,/g, ''))) * 12).toLocaleString(),
    percentage: Math.round(((parseFloat(traditionalCosts.totalMonthly.replace(/,/g, '')) - 
                parseFloat(SellerCloudXCosts.totalMonthly.replace(/,/g, ''))) / 
               parseFloat(traditionalCosts.totalMonthly.replace(/,/g, '')) * 100))
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-red-500 to-green-500 text-white border-none px-6 py-2 text-lg mb-6">
            <DollarSign className="w-5 h-5 mr-2 inline" />
            XARAJATLARNI TAQQOSLASH
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              45,000,000
            </span>
            <span className="text-slate-700"> → </span>
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              9,000,000
            </span>
          </h2>
          
          <p className="text-2xl text-slate-600 mb-4">
            <strong className="text-red-600">{savings.percentage}%</strong> TEJOVCHI!{' '}
            <strong className="text-green-600">{savings.monthly}</strong> so'm oyiga
          </p>
          
          <p className="text-xl text-slate-500">
            Yilda: <strong className="text-blue-600">{savings.yearly}</strong> so'm tejash! 🎉
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Traditional Method */}
          <Card className="border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl font-bold text-red-700">
                  {traditionalCosts.title}
                </CardTitle>
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  QIMMAT
                </Badge>
              </div>
              <p className="text-slate-600">{traditionalCosts.subtitle}</p>
              <div className="mt-4 p-4 bg-red-100 rounded-lg border border-red-300">
                <div className="text-4xl font-bold text-red-700 mb-1">
                  {traditionalCosts.totalMonthly} so'm
                </div>
                <div className="text-sm text-red-600">oylik xarajat</div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {traditionalCosts.breakdown.map((section, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <h4 className="font-semibold text-slate-700 mb-3">{section.category}</h4>
                  <div className="space-y-2 mb-3">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <item.icon className="w-4 h-4 text-red-500" />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium text-red-700">{item.cost} so'm</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-red-200">
                    <span className="font-semibold text-slate-700">Jami:</span>
                    <span className="font-bold text-red-700 text-lg">{section.total} so'm</span>
                  </div>
                </div>
              ))}

              <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Muammolar:
                </h4>
                <div className="space-y-2">
                  {traditionalCosts.problems.map((problem, idx) => (
                    <div key={idx} className="text-sm text-slate-600">
                      {problem}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SellerCloudX Method */}
          <Card className="border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 text-lg shadow-xl">
                <Sparkles className="w-5 h-5 mr-2 inline animate-pulse" />
                TAVSIYA ETILADI!
              </Badge>
            </div>

            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b-2 border-green-200 pt-8">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl font-bold text-green-700">
                  {SellerCloudXCosts.title}
                </CardTitle>
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg px-4 py-2">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  TEJOVCHI
                </Badge>
              </div>
              <p className="text-slate-600">{SellerCloudXCosts.subtitle}</p>
              <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-300">
                <div className="text-4xl font-bold text-green-700 mb-1">
                  ~{SellerCloudXCosts.totalMonthly} so'm
                </div>
                <div className="text-sm text-green-600">oylik xarajat (AI bilan)</div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {SellerCloudXCosts.breakdown.map((section, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <h4 className="font-semibold text-slate-700 mb-3">{section.category}</h4>
                  <div className="space-y-2 mb-3">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <item.icon className="w-4 h-4 text-green-500" />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium text-green-700">
                          {item.cost === "0" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Bepul
                            </span>
                          ) : (
                            item.cost + " so'm"
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-green-200">
                    <span className="font-semibold text-slate-700">Jami:</span>
                    <span className="font-bold text-green-700 text-lg">{section.total} so'm</span>
                  </div>
                </div>
              ))}

              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Ustunliklar:
                </h4>
                <div className="space-y-2">
                  {SellerCloudXCosts.benefits.map((benefit, idx) => (
                    <div key={idx} className="text-sm text-slate-600">
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Highlight */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white shadow-2xl">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              💰 YILDA {savings.yearly} SO'M TEJASH!
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Bu tejovchi pul bilan yangi biznes ochishingiz, marketingga sarflashingiz, 
              yoki shunchaki ko'proq foyda olishingiz mumkin! 🚀
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">{savings.percentage}%</div>
                <div className="text-sm opacity-90">Tejovchi</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">{savings.monthly}</div>
                <div className="text-sm opacity-90">So'm/oy</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">10x</div>
                <div className="text-sm opacity-90">Tezroq</div>
              </div>
            </div>
            <Button 
              onClick={() => setLocation('/partner-registration')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100 shadow-xl text-lg px-8 py-6 hover:scale-105 transition-all"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Hoziroq Boshlash
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
