// client/src/components/AIFeatureShowcase.tsx
// AI FEATURES MARKETING SHOWCASE

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Target, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Globe,
  Clock,
  DollarSign,
  Users,
  Rocket
} from 'lucide-react';

export function AIFeatureShowcase() {
  const [, setLocation] = useLocation();
  const aiFeatures = [
    {
      icon: Brain,
      title: "🤖 AI Autonomous Manager",
      subtitle: "Avtonom Sun'iy Intellekt",
      description: "GPT-4 powered AI sizning o'rningizga professional mahsulot kartochkalari yaratadi, SEO optimizatsiya qiladi va bozorni tahlil qiladi.",
      stats: "95% aniqlik, 10x tezkor",
      color: "from-purple-500 to-blue-500",
      benefits: [
        "Mahsulot kartochkalarini 5 daqiqada yaratadi",
        "20 ta keyword avtomatik generatsiya",
        "SEO score 85-100 kafolati",
        "4 ta tilga tarjima (o'zbek, rus, ingliz, xitoy)"
      ]
    },
    {
      icon: TrendingUp,
      title: "🔥 Global Trend Scanner",
      subtitle: "Xalqaro Bozor Tahlili",
      description: "Amerika va Xitoy bozorlaridan O'zbekistonga kelmagan trending mahsulotlarni topadi va foyda hisoblaydi.",
      stats: "Monopoliya 3-6 oy",
      color: "from-green-500 to-teal-500",
      benefits: [
        "Amazon, AliExpress, eBay monitoring",
        "Har kuni 100+ yangi trend tahlili",
        "Profit calculator (bojxona, logistika)",
        "AI trend bashorati va growth prognozi"
      ]
    },
    {
      icon: Target,
      title: "💰 Smart Price Optimizer",
      subtitle: "Aqlli Narx Optimallashtirish",
      description: "AI sizning narxlaringizni marketplace, raqobatchilar, va foyda maqsadlariga qarab optimal qiladi.",
      stats: "25-50% foyda oshish",
      color: "from-orange-500 to-red-500",
      benefits: [
        "Marketplace komissiyalarini hisobga oladi",
        "Raqobatchi narxlarini tahlil qiladi",
        "Maksimal foyda + raqobatbardosh narx",
        "Real-time narx o'zgartirish tavsiyalari"
      ]
    },
    {
      icon: BarChart3,
      title: "📊 Predictive Analytics",
      subtitle: "Bashoratli Tahlil",
      description: "Kelgusi 3 oylik savdo prognozi, seasonal trendlar, va inventory optimizatsiyasi.",
      stats: "90% aniqlik",
      color: "from-blue-500 to-indigo-500",
      benefits: [
        "3 oylik savdo prognozi",
        "Seasonal trend tahlili",
        "Inventory optimization",
        "Avtomatik buyurtma tavsiyalari"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none px-6 py-2 text-lg mb-6">
            <Sparkles className="w-5 h-5 mr-2 inline animate-pulse" />
            SUN'IY INTELLEKT KUCHI
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            <span className="text-white">Marketplace Management</span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            <strong className="text-white">SellerCloudX.uz</strong> - O'zbekistonda birinchi va yagona 
            <span className="text-purple-400 font-semibold"> GPT-4 Sun'iy Intellekt</span> bilan 
            qurilgan marketplace management platformasi. 
            <span className="text-green-400 font-semibold"> Inson omilidan 10x tezroq</span>, 
            <span className="text-blue-400 font-semibold"> 5x arzonroq</span>, va 
            <span className="text-yellow-400 font-semibold"> 100% aniqroq!</span>
          </p>

          {/* Key Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">10x</div>
              <div className="text-slate-300 text-sm">Tezroq Ishlov Berish</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">5x</div>
              <div className="text-slate-300 text-sm">Kamroq Xarajat</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-slate-300 text-sm">To'xtovsiz Ishlash</div>
            </div>
          </div>
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {aiFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{feature.subtitle}</p>
                    <Badge className={`bg-gradient-to-r ${feature.color} text-white border-none mt-2`}>
                      {feature.stats}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Benefits */}
                <div className="space-y-3">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                      <span className="text-sm text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <Rocket className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-bounce" />
            <h3 className="text-3xl font-bold text-white mb-4">
              AI Bilan Biznesingizni Avtomatlashtiring!
            </h3>
            <p className="text-slate-300 mb-6 text-lg">
              Endi siz uchun AI ishlaydi. Siz faqat foyda olasiz! 💰
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setLocation('/partner-registration')}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-none shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Brain className="w-5 h-5 mr-2" />
                AI Demo Ko'rish
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => setLocation('/partner-registration')}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-all"
              >
                <Zap className="w-5 h-5 mr-2" />
                Bepul Sinab Ko'rish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
