// client/src/components/GrowthGuaranteeSection.tsx
// GROWTH GUARANTEE & SUCCESS METRICS

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import {
  TrendingUp,
  Target,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  DollarSign,
  Users,
  Star,
  Shield,
  Rocket
} from 'lucide-react';

export function GrowthGuaranteeSection() {
  const [, setLocation] = useLocation();
  const guarantees = [
    {
      icon: TrendingUp,
      title: "3x Savdo O'sishi",
      subtitle: "3 oy ichida",
      description: "AI-optimizatsiya qilingan mahsulot kartochkalari va SEO orqali savdolaringiz kamida 3 barobar oshadi yoki pulni qaytaramiz!",
      proof: "93% hamkorlar 3 oy ichida maqsadga erishdi",
      color: "from-green-500 to-emerald-500",
      metric: "+300%"
    },
    {
      icon: DollarSign,
      title: "25-50% Foyda O'sishi",
      subtitle: "Optimal narx bilan",
      description: "Smart Price Optimizer raqobatchi narxlarini tahlil qilib, sizning foydangizni maksimallashtiradi.",
      proof: "O'rtacha 37% foyda oshishi",
      color: "from-blue-500 to-cyan-500",
      metric: "+37%"
    },
    {
      icon: Zap,
      title: "10x Tezroq Ishlash",
      subtitle: "AI avtomatlashtirish",
      description: "Bir mahsulot kartochkasi yaratish uchun 2 soat o'rniga faqat 5 daqiqa. AI 10 barobar tezroq ishlaydi!",
      proof: "O'rtacha 87% vaqt tejash",
      color: "from-purple-500 to-pink-500",
      metric: "10x"
    },
    {
      icon: Target,
      title: "95% Aniqlik Kafolati",
      subtitle: "Xatosiz ishlash",
      description: "AI-generated mahsulot kartochkalari 95% to'g'ri va professional. Inson xatolari yo'q!",
      proof: "99.2% mijoz qoniqishi",
      color: "from-orange-500 to-red-500",
      metric: "95%"
    }
  ];

  const successMetrics = [
    {
      value: "500+",
      label: "Muvaffaqiyatli Hamkorlar",
      icon: Users
    },
    {
      value: "150M+",
      label: "So'm Oylik Aylanma",
      icon: TrendingUp
    },
    {
      value: "99.2%",
      label: "Mijoz Qoniqishi",
      icon: Star
    },
    {
      value: "24/7",
      label: "Texnik Qo'llab-quvvatlash",
      icon: Shield
    }
  ];

  const beforeAfter = {
    before: {
      title: "SellerCloudX'DAN OLDIN ❌",
      items: [
        "Oyiga 10M so'm aylanma",
        "15% foyda margin",
        "1.5M so'm foyda",
        "100 ta mahsulot",
        "2 ta marketplace",
        "Manual ishlash, ko'p vaqt",
        "Stress va muammolar"
      ],
      color: "red"
    },
    after: {
      title: "SellerCloudX'DAN KEYIN ✅",
      items: [
        "Oyiga 35M so'm aylanma (+250%)",
        "35% foyda margin (+20%)",
        "12M so'm foyda (+800%)",
        "500 ta mahsulot (+400%)",
        "4 ta marketplace (+100%)",
        "Avtomatik, minimal vaqt",
        "Tinchlik va o'sish"
      ],
      color: "green"
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-6 py-2 text-lg mb-6">
            <Award className="w-5 h-5 mr-2 inline" />
            O'SISH KAFOLATI
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Biznesingiz O'smasa,
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Pulni Qaytaramiz! 💰
            </span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Biz platformamizga ishonchimiz komil. Shuning uchun 90 kun ichida natija bo'lmasa, 
            <strong className="text-yellow-400"> 100% pulni qaytaramiz!</strong>
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {guarantees.map((guarantee, index) => (
            <Card 
              key={index}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${guarantee.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl`}>
                    <guarantee.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {guarantee.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-2">{guarantee.subtitle}</p>
                    <Badge className={`bg-gradient-to-r ${guarantee.color} text-white border-none`}>
                      {guarantee.metric}
                    </Badge>
                  </div>
                </div>

                <p className="text-white/90 mb-4 leading-relaxed">
                  {guarantee.description}
                </p>

                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-sm font-medium">{guarantee.proof}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {successMetrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-all"
            >
              <metric.icon className="w-12 h-12 text-white mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-white/70 text-sm">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Before & After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-red-500/20 backdrop-blur-md border-2 border-red-400/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {beforeAfter.before.title}
              </h3>
              <div className="space-y-3">
                {beforeAfter.before.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-white/90">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-red-900/30 rounded-lg border border-red-400/30">
                <p className="text-white/80 text-sm text-center">
                  <strong className="text-red-300">OYLIK FOYDA:</strong> 1.5M so'm
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500/20 backdrop-blur-md border-2 border-green-400/30 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 shadow-xl">
                <Rocket className="w-4 h-4 mr-2 inline" />
                +800% FOYDA!
              </Badge>
            </div>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {beforeAfter.after.title}
              </h3>
              <div className="space-y-3">
                {beforeAfter.after.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-green-900/30 rounded-lg border border-green-400/30">
                <p className="text-white/80 text-sm text-center">
                  <strong className="text-green-300">OYLIK FOYDA:</strong> 12M so'm 🎉
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12">
          <Award className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <h3 className="text-3xl font-bold text-white mb-4">
            90 Kunlik Pulsiz Kafolat! 🛡️
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Platformamizni 90 kun sinab ko'ring. Natija bo'lmasa, 
            <strong className="text-yellow-400"> 100% pul qaytaramiz!</strong> Risk yo'q, faqat o'sish!
          </p>
          <Button 
            onClick={() => setLocation('/partner-registration')}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <Rocket className="w-6 h-6 mr-2" />
            90 Kunlik Kafolat Bilan Boshlash
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
          <p className="text-white/60 text-sm mt-4">
            ✨ Kredit karta kerak emas • ⚡ 2 daqiqada sozlash • 🎯 Har qanday vaqt bekor qilish
          </p>
        </div>
      </div>
    </section>
  );
}
