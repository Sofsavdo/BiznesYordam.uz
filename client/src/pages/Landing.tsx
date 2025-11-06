import { FulfillmentCalculator } from '@/components/FulfillmentCalculator';
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
  MessageCircle
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
      price: "0",
      commission: "30-45%",
      description: "Kichik biznes uchun",
      features: [
        "Asosiy fulfillment",
        "1 marketplace",
        "Email qo'llab-quvvatlash",
        "Asosiy analytics"
      ],
      buttonText: "Boshlash",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Business Standard",
      price: "4,500,000",
      commission: "18-25%",
      description: "O'rta biznes uchun",
      features: [
        "Professional fulfillment",
        "3 marketplace",
        "Telefon qo'llab-quvvatlash",
        "Sof Foyda Dashboard"
      ],
      buttonText: "Tanlash",
      buttonVariant: "default" as const,
      popular: false
    },
    {
      name: "Professional Plus",
      price: "8,500,000",
      commission: "15-20%",
      description: "Katta biznes uchun",
      features: [
        "Premium fulfillment",
        "Barcha marketplace",
        "24/7 qo'llab-quvvatlash",
        "Trend Hunter"
      ],
      buttonText: "Tanlash",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise Elite",
      price: "Individual",
      commission: "12-18%",
      description: "Korporativ yechim",
      features: [
        "VIP fulfillment",
        "Custom integrations",
        "Dedicated manager",
        "Individual yondashuv"
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
        {/* Hero Section */}
        <section className="pt-10 md:pt-16 pb-16 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left animate-fade-in">
                <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
                  <span className="text-sm font-medium text-primary">🚀 #1 Marketplace Management Platform</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                  <span className="text-gradient-primary block">BiznesYordam</span>
                  <span className="text-muted-foreground">O'zbekiston uchun</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                  Professional marketplace fulfillment platformasi — Uzum, Wildberries, Yandex va Ozon bilan integratsiya, real-time analytics, premium qo'llab-quvvatlash.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <Button className="hover-lift">
                    <Crown className="mr-2 h-5 w-5" /> {t("hero.get_started") || "Boshlash"}
                  </Button>
                  <Button variant="outline" className="hover-lift">
                    <Play className="mr-2 h-5 w-5" /> Demo
                  </Button>
                </div>
                
                {/* Key Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center lg:justify-start">
                    <CheckCircle className="text-accent mr-2 h-4 w-4" />
                    <span className="text-muted-foreground">To'liq Fulfillment</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <CheckCircle className="text-accent mr-2 h-4 w-4" />
                    <span className="text-muted-foreground">Real-time Analytics</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <CheckCircle className="text-accent mr-2 h-4 w-4" />
                    <span className="text-muted-foreground">24/7 Qo'llab-quvvatlash</span>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative animate-slide-up">
                <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-business border border-white/30">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                    alt="Professional Marketplace Dashboard" 
                    className="w-full h-auto rounded-2xl shadow-elegant" 
                  />
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 bg-accent text-white p-3 rounded-xl shadow-glow animate-bounce">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-primary text-white p-3 rounded-xl shadow-glow animate-pulse">
                    <Target className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Professional Xizmatlar</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Marketplace savdolaringiz uchun to'liq professional yechim va fulfillment xizmatlari
              </p>
              <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
                <span className="text-primary font-semibold">🚀 To'liq Fulfillment Xizmati</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className="hover-lift animate-slide-up border-2 border-primary/10 shadow-elegant"
                  style={{ animationDelay: `${index * 0.2}s` }}
                  data-testid={`card-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <CardHeader>
                    <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <service.icon className={`text-2xl ${service.iconColor}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground mb-4">{service.title}</CardTitle>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle className="text-accent mr-3 h-4 w-4" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`bg-gradient-to-r ${service.color} rounded-lg p-4`}>
                      <p className={`text-sm ${service.iconColor} font-medium`}>
                        💡 Barcha marketplace'lar uchun optimizatsiya
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <FulfillmentCalculator />

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
                  className={`relative hover-lift animate-slide-up ${
                    tier.popular 
                      ? 'border-2 border-primary shadow-business scale-105' 
                      : 'border border-border shadow-elegant'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Tavsiya etiladi
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-foreground mb-2">{tier.name}</CardTitle>
                    <p className="text-muted-foreground mb-6">{tier.description}</p>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {tier.price === "0" ? "Bepul" : tier.price === "Individual" ? "Individual" : `${tier.price} so'm`}
                    </div>
                    <div className="text-muted-foreground">
                      {tier.price !== "Individual" && "Oylik to'lov"}
                    </div>
                    <div className="mt-4">
                      <Badge variant="outline" className="text-primary border-primary">
                        {tier.commission} komissiya
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle className="text-accent mr-3 h-4 w-4" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant={tier.buttonVariant}
                      className="w-full scale-hover"
                      onClick={() => setLocation('/partner-registration')}
                      data-testid={`button-select-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {tier.buttonText}
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
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 hover-lift"
                  data-testid="button-start-partnership"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Hamkorlikni Boshlash
                </Button>
                <Button 
                  onClick={() => setLocation('/partner-dashboard')}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary hover-lift"
                  data-testid="button-get-consultation"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Bepul Konsultatsiya
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
          </div>
        </div>
      </footer>
    </div>
  );
}