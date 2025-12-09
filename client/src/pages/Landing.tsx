// Professional Landing Page - BiznesYordam
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe,
  Truck,
  BarChart3,
  Brain,
  Target,
  Star,
  Package,
  Crown
} from 'lucide-react';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const stats = [
    { value: '150M+', label: "So'm/oy", icon: TrendingUp },
    { value: '25%', label: 'Foyda', icon: Target },
    { value: '500+', label: 'SKU', icon: Package },
    { value: '99.8%', label: 'Mijozlar', icon: Star }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Marketplace Manager',
      desc: '24/7 AI sizning biznesingizni avtomatik boshqaradi',
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      icon: Globe,
      title: 'Multi-Marketplace',
      desc: 'Uzum, Wildberries va boshqalar bir joydan',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Truck,
      title: 'Fulfillment',
      desc: "To'liq logistika: qabul, saqlash, yetkazish",
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      desc: 'Real-time tahlil va prognoz',
      gradient: 'from-teal-500 to-green-500'
    }
  ];

  const pricing = [
    {
      name: 'Starter Pro',
      price: '2.5M',
      fee: '50 SKU',
      commission: '50%',
      features: [
        'AI Manager (ixtiyoriy)',
        'Marketplace integratsiya',
        'Basic analytics',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Business Standard',
      price: '5M',
      fee: '100 SKU',
      commission: '45%',
      features: [
        'AI Manager FULL',
        'Multi-marketplace',
        'Advanced analytics',
        'Priority support',
        'Fulfillment xizmatlari'
      ],
      popular: true
    },
    {
      name: 'Professional Plus',
      price: '10M',
      fee: '250 SKU',
      commission: '40%',
      features: [
        'Hammasi + Custom AI',
        'Dedicated manager',
        'API access',
        '24/7 support',
        'Custom integratsiyalar'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BiznesYordam
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/partner-registration')}
              >
                Ro'yxatdan o'tish
              </Button>
              <Button 
                onClick={() => setLocation('/admin-login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Kirish
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Compact */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Zap className="w-3 h-3 mr-1" />
              O'zbekiston #1 AI-Powered Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI bilan Marketplace
              </span>
              <br />
              <span className="text-gray-900">Savdosini Avtomatlashtiring</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              24/7 ishlaydigan AI manager + Professional fulfillment xizmatlari.
              Uzum, Wildberries va boshqa platformalarda muvaffaqiyat kafolati.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setLocation('/partner-registration')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
              >
                Bepul Boshlash
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation('/investor-pitch')}
              >
                Demo Ko'rish
              </Button>
            </div>
          </div>

          {/* Stats - Compact Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <Card key={i} className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Compact 2x2 Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Platformaning Kuchli Tomonlari
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <Card 
                key={i}
                className="border-2 hover:border-blue-300 transition-all hover:shadow-xl cursor-pointer"
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transition-transform ${hoveredCard === i ? 'scale-110' : ''}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Compact */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Narxlar va Tariflar
              </span>
            </h2>
            <p className="text-gray-600">Foyda bo'lmasa, to'lov yo'q! Faqat sizning muvaffaqiyatingizdan ulushimiz.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricing.map((plan, i) => (
              <Card 
                key={i}
                className={`relative border-2 transition-all hover:shadow-2xl ${
                  plan.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Mashhur
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/oy</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>{plan.fee} gacha</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>{plan.commission} foyda ulushi</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => setLocation('/partner-registration')}
                  >
                    Boshlash
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Compact */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Bugun Boshlang, Ertaga Daromad Oling
          </h2>
          <p className="text-lg mb-8 opacity-90">
            25% o'sish kafolati. Agar ishlamasa - BEPUL!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setLocation('/partner-registration')}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
            >
              Bepul Boshlash
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-bold">BiznesYordam</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 BiznesYordam. O'zbekiston #1 AI-Powered Marketplace Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
