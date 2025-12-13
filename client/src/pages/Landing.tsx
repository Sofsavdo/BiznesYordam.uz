// PROFESSIONAL LANDING PAGE - SellerCloudX
// Investor-Ready Platform

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, ArrowRight, CheckCircle, Star, TrendingUp, Zap,
  Globe, Truck, BarChart3, Brain, Target, Package, Shield,
  Crown, Clock, Users, DollarSign, Rocket, Play, Eye,
  MessageCircle, AlertCircle, Bot, Image as ImageIcon,
  LineChart, PieChart, ShoppingCart, Box, Warehouse,
  Infinity, Gauge, UserCheck, Lock, Award, Plus, X, FileText, ChevronDown
} from 'lucide-react';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [selectedModel, setSelectedModel] = useState<'saas' | 'fulfillment'>('fulfillment');
  const [showLoginMenu, setShowLoginMenu] = useState(false);

  return (
    <div className="min-h-screen">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SellerCloudX
                </span>
                <div className="text-xs text-gray-500 font-medium">AI-Powered Marketplace Automation</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setLocation('/demo')} className="hidden md:flex">
                <Eye className="w-4 h-4 mr-2" />
                Demo
              </Button>
              <Button variant="outline" onClick={() => setLocation('/partner-registration')}>
                Ro'yxatdan o'tish
              </Button>
              <div className="relative">
                <Button 
                  onClick={() => setShowLoginMenu(!showLoginMenu)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Kirish
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                {showLoginMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border-2 border-blue-200 z-50">
                    <button
                      onClick={() => {
                        setShowLoginMenu(false);
                        setLocation('/login');
                      }}
                      className="block w-full text-left px-5 py-4 hover:bg-blue-50 transition-colors rounded-t-lg"
                    >
                      <div className="font-bold text-blue-600 text-lg">Hamkor Kirish</div>
                      <div className="text-xs text-gray-500 mt-1">Partner Dashboard</div>
                    </button>
                    <button
                      onClick={() => {
                        setShowLoginMenu(false);
                        setLocation('/admin-login');
                      }}
                      className="block w-full text-left px-5 py-4 hover:bg-purple-50 transition-colors border-t rounded-b-lg"
                    >
                      <div className="font-bold text-purple-600 text-lg">Admin Kirish</div>
                      <div className="text-xs text-gray-500 mt-1">Admin Panel</div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-base font-semibold shadow-lg">
              <Zap className="w-4 h-4 mr-2" />
              O'zbekiston #1 AI Marketplace Automation Platform
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Manager 24/7
              </span>
              <br />
              <span className="text-gray-900">Sizning Biznesingiz Uchun</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
              <span className="font-bold text-blue-600">100% avtomatik marketplace boshqaruvi</span> AI bilan.
              <br />
              Mahsulot yaratish, yuklash, narx optimizatsiya - barchasi avtomatik!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
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
                onClick={() => setLocation('/demo')}
                className="text-lg px-10 py-8 border-2"
              >
                <Play className="w-5 h-5 mr-2" />
                Demo Ko'rish
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: TrendingUp, value: '2,847', label: 'Faol Hamkorlar' },
              { icon: Package, value: '127K+', label: 'AI Kartochkalar' },
              { icon: DollarSign, value: '45.7B', label: "So'm Aylanma" },
              { icon: Star, value: '4.9/5', label: 'Baho' }
            ].map((stat, i) => (
              <Card key={i} className="border-2 hover:border-blue-400 transition-all hover:shadow-2xl bg-white/80">
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-4xl font-black text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Model Selection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 text-gray-900">2 Ta Model - Sizning Ehtiyojingiz Uchun</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* SAAS Model */}
            <Card 
              className={`border-4 cursor-pointer transition-all ${
                selectedModel === 'saas' ? 'border-blue-500 shadow-2xl scale-105' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedModel('saas')}
            >
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Brain className="w-9 h-9 text-white" />
                </div>
                <CardTitle className="text-3xl font-black text-center">SAAS - AI Manager</CardTitle>
                <p className="text-center text-gray-600">Faqat AI avtomatizatsiya</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">AI 24/7 marketplace boshqaradi</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Siz mahsulotni o'zingiz tayyorlaysiz</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Siz marketplace ga yetkazasiz</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm font-bold text-blue-600">1-1.5% savdodan to'lov</span>
                  </div>
                </div>
                <Badge className="w-full justify-center py-2 bg-blue-100 text-blue-700">Minimal inson ishtiroki</Badge>
              </CardContent>
            </Card>

            {/* Fulfillment Model */}
            <Card 
              className={`border-4 cursor-pointer transition-all ${
                selectedModel === 'fulfillment' ? 'border-purple-500 shadow-2xl scale-105' : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedModel('fulfillment')}
            >
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Truck className="w-9 h-9 text-white" />
                </div>
                <CardTitle className="text-3xl font-black text-center">Fulfillment + AI</CardTitle>
                <p className="text-center text-gray-600">To'liq xizmat</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">AI 24/7 marketplace boshqaradi</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm font-bold text-purple-600">BIZ qabul, saqlash, qadoqlash qilamiz</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm font-bold text-purple-600">BIZ marketplace ga yetkazamiz</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Abonent + foyda %</span>
                  </div>
                </div>
                <Badge className="w-full justify-center py-2 bg-purple-100 text-purple-700">To'liq operatsion xizmat</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SAAS Pricing */}
      {selectedModel === 'saas' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-600 text-white px-6 py-2">
                <Brain className="w-4 h-4 mr-2" />
                SAAS Model - AI Manager
              </Badge>
              <h2 className="text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Faqat AI - Maksimal Avtomatizatsiya
                </span>
              </h2>
              <p className="text-xl text-gray-600">Siz mahsulot tayyorlaysiz, AI qolganini qiladi. 1-1.5% savdodan.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* AI Starter */}
              <Card className="border-2 border-blue-300 hover:shadow-2xl transition-all">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-black">AI Starter</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-black text-gray-900">$349</span>
                    <span className="text-xl text-gray-600">/oy</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600 mt-2">+ 1.5% savdodan</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">100 SKU</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">2 marketplace</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="font-bold text-sm text-gray-900">✅ Included:</p>
                    {[
                      'AI kartochka yaratish',
                      'Marketplace avtomatik yuklash',
                      'SEO optimizatsiya',
                      'Narx monitoring',
                      'Buyurtma boshqaruvi',
                      'Basic analytics',
                      'Email support'
                    ].map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <p className="font-bold text-sm text-red-700">❌ Cheklovlar:</p>
                    {[
                      'Trend Hunter yopiq',
                      'Foyda analizi yopiq',
                      'Advanced analytics yopiq'
                    ].map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={() => setLocation('/partner-registration')}
                  >
                    Boshlash
                  </Button>
                </CardContent>
              </Card>

              {/* AI Manager Pro */}
              <Card className="border-4 border-purple-500 shadow-2xl relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2">
                    <Crown className="w-4 h-4 mr-2" />
                    FULL ACCESS
                  </Badge>
                </div>
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-black">AI Manager Pro</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-black text-gray-900">$899</span>
                    <span className="text-xl text-gray-600">/oy</span>
                  </div>
                  <p className="text-lg font-bold text-purple-600 mt-2">+ 1% savdodan</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <Package className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">250 SKU</span>
                      <Badge className="ml-auto bg-purple-600 text-white text-xs">+250 alohida</Badge>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">Cheksiz marketplace</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <p className="font-bold text-sm text-gray-900">✅ BARCHA Features:</p>
                    {[
                      'AI Starter features',
                      'Trend Hunter FULL',
                      'Sof foyda analizi',
                      'Advanced analytics',
                      'Priority support',
                      'API access',
                      'Custom integrations'
                    ].map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => setLocation('/partner-registration')}
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Boshlash
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Fulfillment Pricing */}
      {selectedModel === 'fulfillment' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-purple-600 text-white px-6 py-2">
                <Truck className="w-4 h-4 mr-2" />
                Fulfillment + AI Model
              </Badge>
              <h2 className="text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  To'liq Xizmat - Foyda Bo'lmasa, To'lov Yo'q!
                </span>
              </h2>
              <p className="text-xl text-gray-600">Biz hamma ishni qilamiz: qabul, saqlash, qadoqlash, marketplace ga yetkazish!</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {[
                { name: 'Starter Pro', fee: '3M', profit: '50%', sku: '100', marketplaces: 1, popular: false },
                { name: 'Business Standard', fee: '8M', profit: '25%', sku: '500', marketplaces: 2, popular: true },
                { name: 'Professional Plus', fee: '18M', profit: '15%', sku: '2,000', marketplaces: 4, popular: false },
                { name: 'Enterprise Elite', fee: '25M', profit: '10%', sku: 'Cheksiz', marketplaces: 'Barchasi', popular: false }
              ].map((tier, i) => (
                <Card key={i} className={`border-2 transition-all ${
                  tier.popular ? 'border-purple-500 shadow-xl scale-105' : 'border-gray-200'
                }`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Mashhur
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-black text-gray-900">{tier.fee}</span>
                      <span className="text-lg text-gray-600">/oy</span>
                    </div>
                    <p className="text-lg font-bold text-purple-600 mt-2">+ {tier.profit} foydadan</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">SKU:</span>
                        <span className="font-bold">{tier.sku}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Marketplace:</span>
                        <span className="font-bold">{tier.marketplaces}</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      {[
                        'AI Manager FULL',
                        'Qabul va tekshirish',
                        'Saqlash (ombor)',
                        'Qadoqlash + markirovka',
                        'Marketplace ga yetkazish'
                      ].map((f, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span className="text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full"
                      variant={tier.popular ? 'default' : 'outline'}
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
      )}

      {/* Marketplace Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-gray-900">Qanday Ishlaydi?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* SAAS Process */}
            <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  SAAS - AI Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: '1', icon: Bot, text: 'AI kartochka yaratadi', color: 'blue' },
                    { step: '2', icon: Globe, text: 'Marketplace ga yuklaydi', color: 'blue' },
                    { step: '3', icon: UserCheck, text: 'SIZ mahsulot tayyorlaysiz', color: 'orange' },
                    { step: '4', icon: Truck, text: 'SIZ marketplace ga yetkazasiz', color: 'orange' },
                    { step: '5', icon: ShoppingCart, text: 'Marketplace mijozga sotadi', color: 'green' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                          <span className="font-semibold text-gray-900">{item.text}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fulfillment Process */}
            <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Truck className="w-6 h-6 text-purple-600" />
                  Fulfillment + AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: '1', icon: Bot, text: 'AI kartochka yaratadi va yuklaydi', color: 'blue' },
                    { step: '2', icon: Box, text: 'SIZ bizning omborga yuborasiz', color: 'orange' },
                    { step: '3', icon: Shield, text: 'BIZ qabul va quality control', color: 'purple' },
                    { step: '4', icon: Package, text: 'BIZ qadoqlash + markirovka', color: 'purple' },
                    { step: '5', icon: Warehouse, text: 'BIZ saqlash (ombor)', color: 'purple' },
                    { step: '6', icon: Truck, text: 'BIZ marketplace ga yetkazamiz', color: 'purple' },
                    { step: '7', icon: ShoppingCart, text: 'Marketplace mijozga yetkazadi', color: 'green' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                          <span className="font-semibold text-gray-900">{item.text}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-600 text-white px-6 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Technology
            </Badge>
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Manager Nima Qiladi?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Kartochka Yaratish',
                desc: 'Professional mahsulot tavsifi, SEO optimizatsiya, keyword research',
                features: ['GPT-5 text generation', 'SEO optimization', '20+ til support']
              },
              {
                icon: ImageIcon,
                title: 'Rasm Optimizatsiya',
                desc: 'AI rasm generatsiya yoki mavjud rasmlarni optimizatsiya',
                features: ['AI image generation', 'Background removal', 'Quality enhancement']
              },
              {
                icon: Globe,
                title: 'Marketplace Upload',
                desc: 'Avtomatik yuklash barcha marketplace larga API orqali',
                features: ['Uzum API', 'Wildberries API', 'Ozon, Yandex, etc.']
              },
              {
                icon: Target,
                title: 'Narx Optimizatsiya',
                desc: 'Real-time narx monitoring va optimal narx aniqlash',
                features: ['Competitor tracking', 'Dynamic pricing', 'Profit maximization']
              },
              {
                icon: TrendingUp,
                title: 'Trend Hunter',
                desc: 'Bozor trendlarini aniqlash, bestseller prognoz',
                features: ['Market analysis', 'Demand forecasting', 'Seasonal trends']
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                desc: 'Sof foyda tahlili, ROI, performance metrics',
                features: ['Profit analysis', 'ROI tracking', 'Performance reports']
              }
            ].map((ai, i) => (
              <Card key={i} className="border-2 hover:border-purple-400 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                    <ai.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{ai.title}</CardTitle>
                  <p className="text-sm text-gray-600">{ai.desc}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {ai.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Rocket className="w-20 h-20 mx-auto mb-6" />
          <h2 className="text-5xl font-black mb-6">Bugun Boshlang!</h2>
          <p className="text-2xl mb-10 opacity-90">AI xarajatlarini biz qoplaymiz - siz faqat foyda ko'rasiz</p>
          <Button 
            size="lg"
            onClick={() => setLocation('/partner-registration')}
            className="bg-white text-blue-600 hover:bg-gray-100 text-2xl px-16 py-10"
          >
            <Sparkles className="w-7 h-7 mr-3" />
            BEPUL BOSHLASH
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-bold">SellerCloudX</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 SellerCloudX. O'zbekiston #1 AI Marketplace Automation Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
