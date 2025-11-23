import { FulfillmentCalculator } from '@/components/FulfillmentCalculator';
import { AIFeatureShowcase } from '@/components/AIFeatureShowcase';
import { CostComparisonSection } from '@/components/CostComparisonSection';
import { GrowthGuaranteeSection } from '@/components/GrowthGuaranteeSection';
import { Navigation } from '@/components/Navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Target, 
  Zap, 
  Crown, 
  CheckCircle,
  Star,
  Globe,
  Truck,
  BarChart3,
  Shield,
  Users,
  ArrowRight,
  Play,
  MessageCircle,
  Sparkles,
  Rocket
} from 'lucide-react';
import { useEffect, useState } from "react";

export default function Landing() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stats = [
    {
      value: "150M+",
      label: "So'm Oylik Aylanma",
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      value: "25%",
      label: "O'rtacha Foyda",
      icon: Target,
      color: "text-accent"
    },
    {
      value: "500+",
      label: "Mahsulot Turi",
      icon: Package,
      color: "text-primary"
    },
    {
      value: "99.8%",
      label: "Mijoz Qoniqishi",
      icon: Star,
      color: "text-accent"
    }
  ];

  const services = [
    {
      title: "Marketplace Boshqaruvi",
      description: "Professional mahsulot kartochkalari yaratish, SEO optimizatsiya, raqobat tahlili va savdo strategiyalari",
      icon: Globe,
      features: [
        "Professional kartochka dizayni",
        "SEO optimizatsiya va tahlil",
        "Raqobat tahlili",
        "Narx strategiyasi"
      ],
      color: "from-primary/20 to-primary/10",
      iconColor: "text-primary"
    },
    {
      title: "Logistika va Fulfillment",
      description: "To'liq logistik yechim: qabul qilish, saqlash, qadoqlash, yetkazib berish va qaytarish jarayonlari",
      icon: Truck,
      features: [
        "Professional omborxona",
        "Tez yetkazib berish",
        "Quality control",
        "Qaytarish boshqaruvi"
      ],
      color: "from-accent/20 to-accent/10",
      iconColor: "text-accent"
    },
    {
      title: "Analytics va Hisobotlar",
      description: "Professional tahlil va hisobotlar: savdo ko'rsatkichlari, foyda tahlili, trend prognozlari",
      icon: BarChart3,
      features: [
        "Real-time dashboard",
        "Foyda tahlili",
        "Trend prognozlari",
        "Commission tracking"
      ],
      color: "from-secondary/20 to-secondary/10",
      iconColor: "text-secondary"
    }
  ];

  const pricingTiers = [
    {
      name: "Starter Pro",
      price: "2,500,000",
      commission: "25%",
      description: "Yangi boshlovchilar uchun",
      features: [
        "1 marketplace",
        "100 mahsulot",
        "100kg omborxona",
        "Email qo'llab-quvvatlash"
      ],
      buttonText: "Boshlash",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Business Standard",
      price: "5,000,000",
      commission: "20%",
      description: "O'sib borayotgan bizneslar uchun",
      features: [
        "2 marketplace",
        "500 mahsulot",
        "500kg omborxona",
        "Telefon qo'llab-quvvatlash"
      ],
      buttonText: "Tanlash",
      buttonVariant: "default" as const,
      popular: false
    },
    {
      name: "Professional Plus",
      price: "10,000,000",
      commission: "15%",
      description: "Katta bizneslar uchun",
      features: [
        "4 marketplace",
        "2000 mahsulot",
        "2000kg omborxona",
        "24/7 qo'llab-quvvatlash"
      ],
      buttonText: "Tanlash",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise Elite",
      price: "20,000,000",
      commission: "10%",
      description: "Yirik kompaniyalar uchun",
      features: [
        "Cheksiz marketplace",
        "Cheksiz mahsulot",
        "Cheksiz omborxona",
        "Dedicated manager"
      ],
      buttonText: "Bog'lanish",
      buttonVariant: "secondary" as const,
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Aziz Karimov",
      business: "Elektronika hamkori",
      content: "3 oy ichida oylik daromadim 5M dan 25M so'mga oshdi. BiznesYordam jamoasi professional va sifatli xizmat ko'rsatadi!",
      rating: 5,
      avatar: "A"
    },
    {
      name: "Malika Yusupova", 
      business: "Fashion hamkori",
      content: "Professional dashboard orqali barcha savdolarimni nazorat qilaman. Juda qulay va tushunarli!",
      rating: 5,
      avatar: "M"
    },
    {
      name: "Sardor Toshmatov",
      business: "Sport tovarlari hamkori", 
      content: "Professional fulfillment xizmati bilan mijozlarim juda qoniq. Qayta buyurtmalar sezilarli ko'paydi!",
      rating: 5,
      avatar: "S"
    }
  ];

  return (
    <div className="min-h-screen bg-background hero-surface">
      <Navigation />
      <main className="pt-20 sm:pt-24 md:pt-28">
        {/* Hero Section - PREMIUM DESIGN */}
        <section className="pt-10 md:pt-20 pb-20 md:pb-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
          {/* Advanced Background Effects */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content - Enhanced */}
              <div className="text-center lg:text-left animate-fade-in">
                {/* Premium Badge */}
                <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-6 py-3 mb-8 shadow-xl animate-bounce">
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                  <span className="text-sm font-bold"> O'zbekiston #1 AI Platform</span>
                  <Badge className="ml-3 bg-white/20 text-white border-none">NEW</Badge>
                </div>
                
                {/* Hero Title - Massive & Eye-catching */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    BiznesYordam
                  </span>
                  <span className="block text-3xl md:text-4xl lg:text-5xl font-bold text-slate-700">
                    AI bilan Savdo Qiling! 
                  </span>
                </h1>
                
                {/* Enhanced Description */}
                <p className="text-xl md:text-2xl text-slate-600 mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  <strong className="text-slate-900">O'zbekistanda birinchi</strong> <span className="text-purple-600 font-semibold">GPT-4 Sun'iy Intellekt</span> bilan ishlaydigan marketplace management platformasi.
                </p>
                
                {/* Key Value Props - Enhanced */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-blue-200 shadow-lg hover:scale-105 transition-all">
                    <div className="text-3xl font-bold text-blue-600 mb-1">10x</div>
                    <div className="text-sm text-slate-600 font-medium">Tezroq</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-purple-200 shadow-lg hover:scale-105 transition-all">
                    <div className="text-3xl font-bold text-purple-600 mb-1">76%</div>
                    <div className="text-sm text-slate-600 font-medium">Tejovchi</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-pink-200 shadow-lg hover:scale-105 transition-all">
                    <div className="text-3xl font-bold text-pink-600 mb-1">24/7</div>
                    <div className="text-sm text-slate-600 font-medium">Support</div>
                  </div>
                </div>
                
                {/* CTA Buttons - Premium */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button 
                    onClick={() => setLocation('/partner-registration')}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-7 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                  >
                    <Rocket className="mr-3 h-6 w-6 animate-bounce" />
                    BEPUL BOSHLASH
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                  <Button 
                    onClick={() => {
                      const pricingSection = document.getElementById('pricing');
                      pricingSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    size="lg"
                    variant="outline"
                    className="border-3 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white font-bold text-lg px-8 py-7 rounded-2xl transition-all transform hover:scale-105"
                  >
                    <Play className="mr-2 h-6 w-6" />
                    Demo Ko'rish
                  </Button>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Shield className="text-green-500 h-5 w-5" />
                    <span className="font-medium">90 Kun Kafolat</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="text-blue-500 h-5 w-5" />
                    <span className="font-medium">500+ Hamkorlar</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Star className="text-yellow-500 h-5 w-5 fill-current" />
                    <span className="font-medium">99.2% Qoniqish</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Enhanced Dashboard Preview */}
              <div className="relative animate-slide-up">
                {/* Floating Stats Cards */}
                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-2xl p-4 shadow-2xl z-10 animate-bounce">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8" />
                    <div>
                      <div className="text-2xl font-bold">+250%</div>
                      <div className="text-xs opacity-90">Savdo O'sishi</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-2xl p-4 shadow-2xl z-10 animate-pulse">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8" />
                    <div>
                      <div className="text-2xl font-bold">+800%</div>
                      <div className="text-xs opacity-90">Foyda</div>
                    </div>
                  </div>
                </div>
                
                {/* Main Dashboard Image */}
                <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl p-4 shadow-2xl border-4 border-white/50 backdrop-blur-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" 
                    alt="Professional AI Dashboard" 
                    className="w-full h-auto rounded-2xl shadow-xl" 
                  />
                  
                  {/* Corner Badges */}
                  <div className="absolute top-8 right-8 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-3 rounded-xl shadow-lg animate-pulse">
                    <Zap className="h-7 w-7" />
                  </div>
                  
                  {/* Bottom Stats Bar */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-600 font-medium">Live Analytics</div>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - PREMIUM */}
        <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none px-6 py-2 text-base mb-4">
                <BarChart3 className="w-4 h-4 mr-2 inline" />
                HAQIQIY NATIJALAR
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-white shadow-2xl hover:scale-110 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-slate-600 font-semibold text-center">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section - PREMIUM DARK */}
        <section id="services" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-20 animate-fade-in">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-6 py-2 text-lg mb-6">
                <Sparkles className="w-5 h-5 mr-2 inline animate-pulse" />
                PREMIUM XIZMATLAR
              </Badge>
              
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  To'liq Yechim
                </span>
                <br />
                <span className="text-white">Sizning Biznesingiz Uchun</span>
              </h2>
              
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                Marketplace savdolaringiz uchun <strong className="text-yellow-400">to'liq professional yechim</strong> va
                <strong className="text-blue-400"> fulfillment xizmatlari</strong> - hammasi bir joyda!
              </p>
              
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 rounded-full px-8 py-4 font-bold text-lg shadow-2xl">
                <Rocket className="w-6 h-6 mr-3 animate-bounce" />
                To'liq Fulfillment + AI Automation
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-2xl animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                  data-testid={`card-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <CardHeader>
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transform hover:rotate-6 transition-transform">
                      <service.icon className="text-4xl text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-white mb-4">{service.title}</CardTitle>
                    <p className="text-white/80 text-lg mb-6 leading-relaxed">
                      {service.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all">
                          <CheckCircle className="text-green-400 h-6 w-6 flex-shrink-0 mt-0.5" />
                          <span className="text-white font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-2xl p-5 border border-yellow-400/30">
                      <p className="text-yellow-300 font-bold text-center flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5" />
                        Premium Marketplace Integration
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Features Showcase - YANGI! */}
        <AIFeatureShowcase />

        {/* Cost Comparison - YANGI! */}
        <CostComparisonSection />

        {/* Calculator Section */}
        <FulfillmentCalculator />

        {/* Growth Guarantee - YANGI! */}
        <GrowthGuaranteeSection />

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gradient-to-br from-muted/30 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Hamkorlik Rejalari</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Biznes ehtiyojlaringizga mos keladigan professional hamkorlik rejasini tanlang
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {pricingTiers.map((tier, index) => (
                <Card 
                  key={index}
                  className={`relative hover-lift animate-slide-up flex flex-col ${
                    tier.popular 
                      ? 'border-2 border-primary shadow-business lg:scale-105' 
                      : 'border border-border shadow-elegant'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-lg">
                        <Crown className="w-3 h-3 mr-1 inline" />
                        Tavsiya etiladi
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">{tier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                      {tier.price === "0" ? "Bepul" : tier.price === "Individual" ? "Individual" : `${tier.price}`}
                    </div>
                    {tier.price !== "0" && tier.price !== "Individual" && (
                      <div className="text-sm text-muted-foreground">so'm/oy</div>
                    )}
                    {tier.price === "0" && (
                      <div className="text-sm text-muted-foreground">Boshlash uchun</div>
                    )}
                    <div className="mt-4">
                      <Badge variant="outline" className="text-primary border-primary bg-primary/5">
                        {tier.commission} komissiya
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 mb-8 flex-1">
                      {tier.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start">
                          <CheckCircle className="text-accent mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant={tier.buttonVariant}
                      size="lg"
                      className={`w-full scale-hover font-semibold ${
                        tier.popular 
                          ? 'bg-gradient-to-r from-primary to-accent hover:shadow-lg' 
                          : ''
                      }`}
                      onClick={() => setLocation('/partner-registration')}
                      data-testid={`button-select-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {tier.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Hamkorlarimiz Fikri</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Bizning hamkorlarimiz qanday professional natijalarga erishganini ko'ring
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="hover-lift animate-slide-up shadow-elegant"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <span className="text-primary font-bold text-lg">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center text-white animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Professional Hamkor Bo'ling
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Bizning professional jamoa bilan hamkorlik qiling va marketplace savdolaringizni yangi bosqichga olib chiqing.
                To'liq fulfillment va professional qo'llab-quvvatlash.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setLocation('/partner-registration')}
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 hover:shadow-xl hover-lift font-semibold"
                  data-testid="button-start-partnership"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Hamkorlikni Boshlash
                </Button>
                <Button 
                  onClick={() => {
                    const servicesSection = document.getElementById('services');
                    servicesSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary hover-lift font-semibold"
                  data-testid="button-learn-more"
                >
                  <Package className="mr-2 h-5 w-5" />
                  Xizmatlar Bilan Tanishish
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BY</span>
                </div>
                <h3 className="text-2xl font-bold">BiznesYordam</h3>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                O'zbekiston uchun professional marketplace management platform. 
                To'liq fulfillment xizmati va marketplace integratsiyalari.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <span className="text-lg">📧</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <span className="text-lg">📞</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <span className="text-lg">💬</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Xizmatlar</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#services" className="hover:text-white transition-colors">Marketplace Boshqaruvi</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Fulfillment Xizmati</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Analytics va Hisobotlar</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Professional Qo'llab-quvvatlash</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Aloqa</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>+998 90 123 45 67</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span>info@biznesyordam.uz</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>Toshkent, O'zbekiston</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 BiznesYordam. Barcha huquqlar himoyalangan.</p>
            <button 
              onClick={() => setLocation('/admin-login')}
              className="mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}