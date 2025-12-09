// PROFESSIONAL LANDING PAGE - BiznesYordam
// World-class design for investors & entrepreneurs

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, ArrowRight, CheckCircle, Star, TrendingUp, Zap,
  Globe, Truck, BarChart3, Brain, Target, Package, Shield,
  Crown, Clock, Users, DollarSign, Rocket, Play, Eye,
  MessageCircle, Settings, Database, Cloud, Lock, Award,
  Briefcase, TrendingDown, Activity, FileText, Bot, Cpu,
  LineChart, PieChart, ShoppingCart, Box, Warehouse,
  Map, Layers, GitBranch, Infinity, Gauge, UserCheck,
  AlertCircle, RefreshCw, Plus, Image as ImageIcon
} from 'lucide-react';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [selectedTier, setSelectedTier] = useState(1);

  return (
    <div className="min-h-screen">
      
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BiznesYordam
                </span>
                <div className="text-xs text-gray-500 font-medium">AI-Powered Marketplace Platform</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/investor-pitch')}
                className="hidden md:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                Demo
              </Button>
              <Button 
                variant="outline"
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

      {/* Hero Section - Impressive */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-base font-semibold shadow-lg">
              <Zap className="w-4 h-4 mr-2" />
              O'zbekiston #1 AI-Powered Marketplace Platform
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Marketplace Savdosini
              </span>
              <br />
              <span className="text-gray-900">AI bilan Avtomatlashtiring</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
              <span className="font-bold text-blue-600">24/7 ishlaydigan AI Manager</span> sizning biznesingizni boshqaradi.
              <br />
              <span className="font-semibold">Professional fulfillment xizmatlari</span> bilan to'liq yechim.
            </p>
            
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-semibold">2,847 faol foydalanuvchi</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                <span className="ml-2 text-gray-700 font-semibold">4.9/5.0</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => setLocation('/partner-registration')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xl px-12 py-8 shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105"
              >
                <Rocket className="w-6 h-6 mr-3" />
                Bepul Boshlash
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation('/investor-pitch')}
                className="text-lg px-10 py-8 border-2 hover:border-blue-600 hover:bg-blue-50"
              >
                <Play className="w-5 h-5 mr-2" />
                Demo Ko'rish
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              💳 Kredit karta kerak emas • ⚡ 2 daqiqada ishga tushirish • 🎁 30 kun bepul
            </p>
          </div>

          {/* Hero Stats - Impressive Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: TrendingUp, value: '150M+', label: "So'm Oylik Aylanma", color: 'blue' },
              { icon: Target, value: '25-40%', label: "O'rtacha Foyda", color: 'green' },
              { icon: Package, value: '500+', label: 'SKU Boshqaruv', color: 'purple' },
              { icon: Users, value: '2,847', label: 'Faol Hamkorlar', color: 'orange' }
            ].map((stat, i) => (
              <Card key={i} className="border-2 hover:border-blue-400 transition-all hover:shadow-2xl hover:-translate-y-1 bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem-Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-red-100 text-red-700">
                <AlertCircle className="w-4 h-4 mr-2" />
                Muammolar
              </Badge>
              <h2 className="text-4xl font-black mb-6 text-gray-900">
                Marketplace Manager Qimmat va Sekin?
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Clock, text: 'Bir mahsulot kartochkasiga 2-3 soat vaqt ketadi' },
                  { icon: TrendingDown, text: 'Inson xatolari tufayli savdo pasayadi' },
                  { icon: DollarSign, text: "Oylik maosh 8-15M so'm + xatolar narxi" },
                  { icon: Activity, text: '24/7 ishlash imkoni yo\'q - dam olish kerak' },
                  { icon: FileText, text: 'SEO va trend tahlil qilish qobiliyati cheklangan' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <item.icon className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-gray-700 font-medium pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Yechim
              </Badge>
              <h2 className="text-4xl font-black mb-6 text-gray-900">
                AI Manager - Mukammal Avtomatlashtirish!
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: 'Bir mahsulot kartochkasi 2 daqiqada - 90x tezroq!', badge: '90x' },
                  { icon: CheckCircle, text: '99.8% to\'g\'rilik - xatolar 0%', badge: '99.8%' },
                  { icon: DollarSign, text: "Oylik 1-2M so'm - 85% tejash!", badge: '85%' },
                  { icon: Infinity, text: '24/7/365 to\'xtovsiz ishlash - hech qachon charchamaydi', badge: '24/7' },
                  { icon: Brain, text: 'GPT-5 va Claude Sonnet - eng ilg\'or AI modellari', badge: 'AI' },
                  { icon: Gauge, text: 'Real-time trend tahlili va raqobat monitoring', badge: 'LIVE' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-bold">{item.text}</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold">
                      {item.badge}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 px-6 py-2 text-base">
              <Brain className="w-4 h-4 mr-2" />
              AI Technology Stack
            </Badge>
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Texnologiyalari
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dunyodagi eng ilg'or AI modellari sizning biznesingiz uchun ishlaydi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: 'GPT-5 Text Generation',
                desc: 'Professional mahsulot tavsifi, SEO optimizatsiya, marketing matnlar',
                features: ['SEO optimallashtirish', 'Til lokallashtirish', 'Keyword research', 'Competitor analysis'],
                gradient: 'from-green-500 to-emerald-600'
              },
              {
                icon: ImageIcon,
                title: 'AI Image Generation',
                desc: 'Professional mahsulot rasmlari, brend dizayni, marketing materiallari',
                features: ['Product photography', 'Brand design', 'Marketing banners', 'Social media content'],
                gradient: 'from-blue-500 to-cyan-600'
              },
              {
                icon: LineChart,
                title: 'Trend Prediction AI',
                desc: 'Bozor trendlarini prognoz qilish, optimal narx aniqlash, savdo strategiyasi',
                features: ['Market forecasting', 'Price optimization', 'Demand prediction', 'Competitor tracking'],
                gradient: 'from-purple-500 to-pink-600'
              },
              {
                icon: Target,
                title: 'Smart Targeting',
                desc: 'Maqsadli auditoriya aniqlash, marketing kampaniyalari optimizatsiyasi',
                features: ['Audience analysis', 'Ad optimization', 'Conversion tracking', 'ROI maximization'],
                gradient: 'from-orange-500 to-red-600'
              },
              {
                icon: Shield,
                title: 'Quality Assurance AI',
                desc: 'Mahsulot sifatini avtomatik tekshirish, xatolarni aniqlash',
                features: ['Auto quality check', 'Error detection', 'Compliance verification', 'Brand consistency'],
                gradient: 'from-indigo-500 to-purple-600'
              },
              {
                icon: Rocket,
                title: 'Auto-Upload Bot',
                desc: 'Barcha marketplace larga avtomatik yuklash, sinxronlashtirish',
                features: ['Multi-marketplace sync', 'Inventory management', 'Price sync', 'Stock updates'],
                gradient: 'from-pink-500 to-rose-600'
              }
            ].map((ai, i) => (
              <Card key={i} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-400 bg-white/80 backdrop-blur">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ai.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <ai.icon className="w-9 h-9 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{ai.title}</CardTitle>
                  <p className="text-gray-600 mt-2">{ai.desc}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {ai.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Platform Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 px-6 py-2 text-base">
              <Globe className="w-4 h-4 mr-2" />
              Full-Stack Platform
            </Badge>
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                To'liq Biznes Yechimlari
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: '🤖 AI Marketplace Manager',
                desc: 'To\'liq avtomatik mahsulot boshqaruvi',
                features: [
                  { icon: Sparkles, text: 'AI mahsulot kartochkalari yaratish' },
                  { icon: Globe, text: 'Multi-marketplace integratsiya (Uzum, Wildberries, Ozon)' },
                  { icon: TrendingUp, text: 'Real-time trend tahlili va prognoz' },
                  { icon: Target, text: 'Avtomatik narx optimizatsiyasi' },
                  { icon: Eye, text: 'Raqobatchilarni kuzatish' },
                  { icon: FileText, text: 'SEO va keyword optimizatsiya' },
                  { icon: ShoppingCart, text: 'Avtomatik buyurtma boshqaruvi' },
                  { icon: Activity, text: '24/7 monitoring va xabar berish' }
                ]
              },
              {
                title: '📦 Professional Fulfillment',
                desc: 'To\'liq logistika va omborxona xizmatlari',
                features: [
                  { icon: Warehouse, text: 'Professional omborxonalar (Toshkent, Samarqand)' },
                  { icon: Box, text: 'Mahsulot qabul qilish va tekshirish' },
                  { icon: Package, text: 'Quality control va qadoqlash' },
                  { icon: Truck, text: 'Tez yetkazib berish (1-2 kun)' },
                  { icon: Map, text: 'O\'zbekiston bo\'ylab yetkazish' },
                  { icon: Shield, text: 'Mahsulot sug\'urtasi' },
                  { icon: RefreshCw, text: 'Qaytarishlarni boshqarish' },
                  { icon: BarChart3, text: 'Inventar real-time kuzatuvi' }
                ]
              },
              {
                title: '📊 Advanced Analytics',
                desc: 'Professional tahlil va hisobotlar',
                features: [
                  { icon: PieChart, text: 'Real-time savdo dashboard' },
                  { icon: LineChart, text: 'Foyda va xarajat tahlili' },
                  { icon: TrendingUp, text: 'Trend prognozlari va bashoratlar' },
                  { icon: Target, text: 'ROI va KPI monitoring' },
                  { icon: BarChart3, text: 'Marketplace performance comparison' },
                  { icon: Database, text: 'Export va import (Excel, CSV, JSON)' },
                  { icon: FileText, text: 'Avtomatik hisobot generatsiyasi' },
                  { icon: Clock, text: 'Custom time-range tahlil' }
                ]
              },
              {
                title: '🔐 Enterprise Security',
                desc: 'Bank darajasidagi xavfsizlik',
                features: [
                  { icon: Lock, text: 'End-to-end shifrlash' },
                  { icon: Shield, text: 'Multi-factor authentication (MFA)' },
                  { icon: Eye, text: 'Audit logs va activity tracking' },
                  { icon: Users, text: 'Role-based access control (RBAC)' },
                  { icon: Database, text: 'Secure database backup' },
                  { icon: Cloud, text: 'Cloud-based infrastructure' },
                  { icon: Award, text: 'ISO 27001 compliance ready' },
                  { icon: Settings, text: 'Granular permission settings' }
                ]
              }
            ].map((section, i) => (
              <Card key={i} className="border-2 hover:border-purple-400 hover:shadow-2xl transition-all bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold mb-3">{section.title}</CardTitle>
                  <p className="text-gray-600 text-lg">{section.desc}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {section.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-blue-300 transition-all">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <f.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/20 text-white px-6 py-2 text-base border-white/30">
              <Layers className="w-4 h-4 mr-2" />
              Qanday Ishlaydi?
            </Badge>
            <h2 className="text-5xl font-black mb-6">3 Oddiy Qadam</h2>
            <p className="text-xl opacity-90">2 daqiqada ishga tushiring, bugun daromad oling</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: UserCheck,
                title: 'Ro\'yxatdan O\'ting',
                desc: '2 daqiqada - biznes ma\'lumotlari, marketplace credentials',
                time: '2 min'
              },
              {
                step: '02',
                icon: Settings,
                title: 'AI ni Sozlang',
                desc: 'AI Manager sizning biznesingizni o\'rganadi va strategiya tuzadi',
                time: '5 min'
              },
              {
                step: '03',
                icon: Rocket,
                title: 'Avtomatik Ishlaydi',
                desc: 'AI 24/7 mahsulot yaratadi, narx optimizatsiya qiladi, savdo qiladi',
                time: '24/7'
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <Card className="border-2 border-white/30 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all hover:scale-105 h-full">
                  <CardContent className="p-8">
                    <div className="text-6xl font-black text-white/30 mb-4">{step.step}</div>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                      <step.icon className="w-9 h-9 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-white/80 text-base mb-4">{step.desc}</p>
                    <Badge className="bg-white/20 text-white border-white/30">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.time}
                    </Badge>
                  </CardContent>
                </Card>
                {i < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-white/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Detailed */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 px-6 py-2 text-base">
              <DollarSign className="w-4 h-4 mr-2" />
              Shaffof Narxlar
            </Badge>
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Foyda Bo'lmasa, To'lov Yo'q!
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sizning muvaffaqiyatingiz - bizning daromadimiz. Faqat foydadan ulush olamiz.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: 'Starter Pro',
                desc: 'Kichik bizneslar uchun',
                monthlyFee: '2.5M',
                commission: '50%',
                skuLimit: '50 SKU',
                features: [
                  { text: 'AI Manager (ixtiyoriy +1M so\'m)', optional: true },
                  { text: 'Marketplace integratsiya', included: true },
                  { text: 'Basic analytics va hisobotlar', included: true },
                  { text: 'Email support (24 soat ichida)', included: true },
                  { text: 'Fulfillment xizmatlari', optional: true },
                  { text: 'Professional omborxona', optional: true }
                ],
                popular: false,
                color: 'blue'
              },
              {
                name: 'Business Standard',
                desc: 'O\'sib borayotgan bizneslar',
                monthlyFee: '5M',
                commission: '45%',
                skuLimit: '100 SKU',
                features: [
                  { text: 'AI Manager FULL', included: true, highlight: true },
                  { text: 'Multi-marketplace sync', included: true },
                  { text: 'Advanced analytics + AI insights', included: true },
                  { text: 'Priority support (2 soat ichida)', included: true },
                  { text: 'Fulfillment xizmatlari FULL', included: true },
                  { text: 'Dedicated omborxona joyi', included: true },
                  { text: 'Custom branding', included: true },
                  { text: 'API access', included: true }
                ],
                popular: true,
                color: 'purple'
              },
              {
                name: 'Professional Plus',
                desc: 'Yirik korxonalar uchun',
                monthlyFee: '10M',
                commission: '40%',
                skuLimit: '250 SKU',
                features: [
                  { text: 'AI Manager + Custom AI modellari', included: true, highlight: true },
                  { text: 'Unlimited marketplace integratsiya', included: true },
                  { text: 'Enterprise analytics + BI tools', included: true },
                  { text: '24/7 VIP support + dedicated manager', included: true },
                  { text: 'Full-service fulfillment + logistics', included: true },
                  { text: 'Private warehouse space', included: true },
                  { text: 'White-label branding', included: true },
                  { text: 'Custom integratsiyalar va API', included: true },
                  { text: 'SLA kafolati 99.9%', included: true }
                ],
                popular: false,
                color: 'orange'
              }
            ].map((plan, i) => (
              <Card 
                key={i}
                className={`relative border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-purple-500 shadow-2xl scale-105 bg-gradient-to-br from-purple-50 to-blue-50' 
                    : 'border-gray-200 hover:border-blue-400 hover:shadow-xl bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-base shadow-xl">
                      <Crown className="w-4 h-4 mr-2" />
                      ENG MASHHUR
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${plan.color}-500 to-${plan.color}-600 flex items-center justify-center shadow-lg`}>
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-black mb-2">{plan.name}</CardTitle>
                  <p className="text-gray-600">{plan.desc}</p>
                  <div className="mt-6 mb-4">
                    <span className="text-5xl font-black text-gray-900">{plan.monthlyFee}</span>
                    <span className="text-xl text-gray-600">/oy</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{plan.skuLimit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{plan.commission} komissiya</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.features.map((f, j) => (
                    <div 
                      key={j} 
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        f.highlight ? 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300' : 'bg-gray-50'
                      }`}
                    >
                      {f.included ? (
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 ${f.highlight ? 'text-purple-600' : 'text-green-600'}`} />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        f.highlight ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                      }`}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg' 
                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900'
                    } text-lg py-6`}
                    onClick={() => setLocation('/partner-registration')}
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Boshlash
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing Guarantee */}
          <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-3xl font-bold mb-4 text-gray-900">💰 Foyda Kafolati</h3>
              <p className="text-xl text-gray-700 mb-2">
                <span className="font-black text-green-600">25% savdo o'sishi kafolatlangan</span> yoki pulni qaytaramiz!
              </p>
              <p className="text-gray-600">
                Birinchi 3 oyda 25% o'sish bo'lmasa, to'liq pul qaytarish + 1 oy BEPUL
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Qancha Tejaysiz?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6 text-red-600" />
                  Inson Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Oylik maosh</span>
                    <span className="font-bold text-red-600">12,000,000 so'm</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Ish vaqti</span>
                    <span className="font-bold text-gray-900">8 soat/kun (160 soat/oy)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Dam olish kunlari</span>
                    <span className="font-bold text-gray-900">8-10 kun/oy</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Xatolar</span>
                    <span className="font-bold text-red-600">5-15% xato darajasi</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Ish sur'ati</span>
                    <span className="font-bold text-gray-900">1 kartochka/3 soat</span>
                  </div>
                </div>
                <div className="pt-4 border-t-2 border-red-300">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">JAMI XARAJAT:</span>
                    <span className="text-3xl font-black text-red-600">~15M so'm/oy</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Brain className="w-6 h-6 text-green-600" />
                  AI Manager (BiznesYordam)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Oylik to'lov</span>
                    <span className="font-bold text-green-600">1,000,000 so'm</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Ish vaqti</span>
                    <span className="font-bold text-green-600">24/7/365 (720 soat/oy)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Dam olish</span>
                    <span className="font-bold text-green-600">Hech qachon!</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Xatolar</span>
                    <span className="font-bold text-green-600">0.2% - 50x kamroq!</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Ish sur'ati</span>
                    <span className="font-bold text-green-600">1 kartochka/2 daqiqa (90x tez!)</span>
                  </div>
                </div>
                <div className="pt-4 border-t-2 border-green-500">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold">JAMI XARAJAT:</span>
                    <span className="text-3xl font-black text-green-600">1M so'm/oy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">TEJASH:</span>
                    <span className="text-2xl font-black text-green-600">14M so'm/oy (93%!)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              <span className="text-green-600">168M so'm</span> yiliga tejash!
            </p>
            <p className="text-gray-600">+ AI 90x tezroq ishlaydi + 0 xato + 24/7 ishlash</p>
          </div>
        </div>
      </section>

      {/* Social Proof & Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-gray-900">Natijalar Gapiradi</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: TrendingUp, value: '2,847', label: 'Faol hamkorlar', change: '+847 bu oy' },
              { icon: Package, value: '127,500+', label: 'Yaratilgan mahsulot kartochkalari', change: '+12.5K bu oy' },
              { icon: DollarSign, value: '45.7B', label: "So'm umumiy savdo aylanmasi", change: '+8.2B bu oy' },
              { icon: Star, value: '4.9/5.0', label: 'Mijozlar baholashi', change: '9,234 sharh' }
            ].map((stat, i) => (
              <Card key={i} className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <stat.icon className="w-9 h-9 text-white" />
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{stat.label}</div>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {stat.change}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rustam Karimov',
                business: 'ElectroMart UZ',
                rating: 5,
                text: 'AI Manager bizning savdoni 3 oyda 180% oshirdi. Inson manager bilan 3 yilda bunday natijaga erisha olmas edik!',
                result: '+180% savdo',
                avatar: '👨‍💼'
              },
              {
                name: 'Nilufar Rahimova',
                business: 'BeautyZone',
                rating: 5,
                text: 'Fulfillment xizmatlari ajoyib! Omborxona, qadoqlash, yetkazish - hammasi professional darajada. Biz faqat savdo qilishga e\'tibor beramiz.',
                result: '+240K so\'m kunlik foyda',
                avatar: '👩‍💼'
              },
              {
                name: 'Sardor Tursunov',
                business: 'TechStore Pro',
                rating: 5,
                text: 'Wildberries, Uzum, Ozon - barchasini bir joydan boshqarish shunchaki ajoyib! AI trend prediction orqali bestseller topamiz.',
                result: '15 ta bestseller',
                avatar: '🧑‍💼'
              }
            ].map((testimonial, i) => (
              <Card key={i} className="border-2 border-blue-200 hover:shadow-xl transition-all bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.business}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    {testimonial.result}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 text-gray-900">Tez-tez So'raladigan Savollar</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'AI Manager qanday ishlaydi?',
                a: 'AI Manager GPT-5 va Claude Sonnet modellaridan foydalanib, mahsulot kartochkalarini avtomatik yaratadi, SEO optimizatsiya qiladi, trend tahlil qiladi va marketplace larga yuklaydi. 24/7 sizning biznesingiz uchun ishlaydi va hech qachon charchamaydi.'
              },
              {
                q: 'Qaysi marketplace lar bilan ishlayman?',
                a: 'Uzum, Wildberries, Ozon, Yandex Market va 15+ boshqa marketplace lar. Bir platformadan barchasini boshqarish mumkin.'
              },
              {
                q: 'Fulfillment xizmatlari qanday ishlaydi?',
                a: 'Siz mahsulotni bizning omborxonamizga yuboring. Biz qabul qilamiz, tekshiramiz, saqlaymiz, qadoqlaymiz va buyurtma kelganda mijozga yetkazib beramiz. Siz faqat savdo strategiyasiga e\'tibor bering.'
              },
              {
                q: 'Nima uchun komissiya foydadan olinadi?',
                a: 'Biz sizning muvaffaqiyatingizga qiziqamiz! Siz foyda olmaguningizcha, biz ham olmayamiz. Bu bizni sizning natijangizga motivatsiya qiladi.'
              },
              {
                q: 'Qancha vaqtda natija ko\'raman?',
                a: 'Birinchi 7 kundan savdo oshishini ko\'rasiz. 30 kun ichida 25% o\'sish ko\'ramiz. Agar yo\'q bo\'lsa - pul qaytaramiz!'
              },
              {
                q: 'Texnik bilim kerakmi?',
                a: 'Yo\'q! Bizning AI va support team hammasi qiladi. Siz faqat biznesingizni rivojlantirishga e\'tibor bering.'
              }
            ].map((faq, i) => (
              <Card key={i} className="border-2 border-gray-200 hover:border-blue-400 transition-all">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-700 pl-8">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <Rocket className="w-20 h-20 mx-auto mb-6 opacity-90" />
          <h2 className="text-5xl sm:text-6xl font-black mb-6">
            Bugun Boshlang,
            <br />
            Ertaga Daromad Oling!
          </h2>
          <p className="text-2xl mb-4 opacity-90">
            <span className="font-black">25% o'sish kafolati</span> yoki pul qaytarish
          </p>
          <p className="text-xl mb-10 opacity-80">
            2,847+ hamkor ishonch bildirdi. Navbat sizda!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              size="lg"
              onClick={() => setLocation('/partner-registration')}
              className="bg-white text-blue-600 hover:bg-gray-100 text-2xl px-16 py-10 shadow-2xl hover:shadow-white/50 transition-all hover:scale-105 font-black"
            >
              <Sparkles className="w-7 h-7 mr-3" />
              BEPUL BOSHLASH
              <ArrowRight className="w-7 h-7 ml-3" />
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Kredit karta kerak emas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>30 kun bepul sinov</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Istalgan vaqt bekor qilish</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, text: 'Bank darajasida xavfsizlik' },
              { icon: Award, text: 'ISO 27001 ready' },
              { icon: Lock, text: 'SSL shifrlash' },
              { icon: CheckCircle, text: '99.9% uptime SLA' }
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200">
                <badge.icon className="w-8 h-8 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700 text-center">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Professional */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">BiznesYordam</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                O'zbekiston #1 AI-Powered Marketplace Platform
              </p>
              <div className="flex gap-3">
                {['📱', '💬', '📧'].map((icon, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-all">
                    <span className="text-xl">{icon}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Platforma</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">AI Features</li>
                <li className="hover:text-white cursor-pointer">Fulfillment</li>
                <li className="hover:text-white cursor-pointer">Analytics</li>
                <li className="hover:text-white cursor-pointer">Integrations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Kompaniya</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Biz haqimizda</li>
                <li className="hover:text-white cursor-pointer">Investorlar</li>
                <li className="hover:text-white cursor-pointer">Karyera</li>
                <li className="hover:text-white cursor-pointer">Blog</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Help Center</li>
                <li className="hover:text-white cursor-pointer">API Docs</li>
                <li className="hover:text-white cursor-pointer">Shartlar</li>
                <li className="hover:text-white cursor-pointer">Maxfiylik</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2024 BiznesYordam. O'zbekiston #1 AI-Powered Marketplace Platform. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
