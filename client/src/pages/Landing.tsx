import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FulfillmentCalculator } from "@/components/FulfillmentCalculator";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  TrendingUp,
  Package,
  BarChart3,
  Users,
  CheckCircle,
  Rocket,
  Phone,
  Mail,
  Store,
  Truck,
  Target,
  Shield,
  Zap,
  Globe,
  Star,
  Award,
  Clock,
  HeadphonesIcon,
  DollarSign,
  Briefcase,
  ShoppingCart,
  Camera,
  Palette,
  Settings,
  TrendingDown,
  Play
} from "lucide-react";
import { formatCurrencyShort } from "@/lib/currency";
import fulfillmentImage from '@assets/tild6537-3533-4030-b664-303239373731__deliverys_1756310171599.png';

export default function Landing() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessCategory: '',
    monthlyRevenue: '',
    notes: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Real API call to save contact form data
      const response = await fetch('/api/contact-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert("Arizangiz qabul qilindi! Tez orada siz bilan bog'lanamiz.");
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          businessCategory: '',
          monthlyRevenue: '',
          notes: '',
          agreeToTerms: false
        });
      } else {
        throw new Error('So\'rov yuborishda xatolik');
      }
    } catch (error) {
      alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary/5 via-white to-accent/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium text-primary">🚀 O'zbekistondagi #1 Marketpleys Platformasi</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Premium Features Highlight */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900">{t('hero.features.title')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-amber-800">Trend Hunter - Global trendlarni kuzatish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-amber-800">AI Analytics - Sun'iy intellekt tahlili</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-amber-800">Priority Support - 24/7 qo'llab-quvvatlash</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-amber-800">Custom Integration - Maxsus integratsiya</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 text-lg font-semibold"
                  onClick={() => window.open('https://t.me/BiznesYordam_uz', '_blank')}
                  data-testid="button-telegram-channel"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  {t('hero.button.telegram')}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{t('common.secure') || '100% Безопасно'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{t('common.partners') || '500+ Партнеров'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>ISO 27001</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Fulfillment Integration Visual */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Fulfillment Dashboard Image */}
                <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                  <img 
                    src={fulfillmentImage} 
                    alt="BiznesYordam Fulfillment Platform - Professional logistics and marketpleys integratsiya tizimi" 
                    className="w-full h-auto object-cover"
                    data-testid="hero-fulfillment-image"
                  />
                  
                </div>
                
                {/* Feature Info Below Image */}
                <div className="mt-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">BiznesYordam Fulfillment</h3>
                    <p className="text-sm text-slate-600">Professional logistika va marketpleys integratsiyasi</p>
                  </div>
                  
                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">24/7</div>
                      <div className="text-xs text-slate-600">Xizmat</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">5+</div>
                      <div className="text-xs text-slate-600">Marketpleys</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">150+</div>
                      <div className="text-xs text-slate-600">Hamkor</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Success Indicator */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span>Faol Tizim</span>
                  </div>
                </div>
                
                {/* Stats Badges */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">500+</div>
                    <div className="text-xs text-slate-600">Hamkor</div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-lg border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">24/7</div>
                    <div className="text-xs text-slate-600">Qo'llab-quvvatlash</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t('features.title') || 'Возможности платформы BiznesYordam'}</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('features.subtitle') || 'Самый мощный набор инструментов для профессиональных партнеров'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Trend Hunter Feature */}
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Trend Hunter</h3>
                    <p className="text-slate-600 mb-6">
                      Xalqaro bozorlardan eng trending mahsulotlarni real vaqtda kuzating. 
                      Amazon, AliExpress, Shopify'dan avtomatik analiz va foyda hisob-kitobi.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Global trending mahsulotlar bazasi</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Avtomatik foyda potentsiali hisob-kitobi</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Raqobat darajasi va narx tahlili</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sof Foyda Dashboard */}
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Sof Foyda Dashboard</h3>
                    <p className="text-slate-600 mb-6">
                      Barcha xarajatlar hisobga olingan holda real foyda ko'rsatkichlarini ko'ring. 
                      Soliq, logistika, SPT va marketpleys komissiyalari bilan to'liq hisob-kitob.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Real vaqtda foyda hisob-kitobi</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Soliq va logistika xarajatlari tahlili</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Marketpleys bo'yicha batafsil statistika</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Pricing */}
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Aqlli Narx Belgilash</h3>
                    <p className="text-slate-600 mb-6">
                      Avtomatik narx optimizatsiyasi va raqobat tahlili. Maksimal foyda uchun 
                      optimal narxlarni aniqlash va real vaqtda o'zgartirish.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Avtomatik raqobat monitoring</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Dynamic pricing algoritmlari</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Foyda marjasi kafolati</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Tier System */}
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Darajali Xizmat Tizimi</h3>
                    <p className="text-slate-600 mb-6">
                      Biznes hajmingizga mos 4 xil tarif rejasi. Har bir daraja o'zining 
                      maxsus imkoniyatlari va professional yordam darajasi bilan.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">4 ta professional daraja</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Avtomatik upgrade tizimi</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Shaxsiy hamkor menejeri</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Nima Uchun BiznesYordam? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Nima Uchun BiznesYordam?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              O'zbekistondagi eng yirik marketpleyslarda professional xizmat ko'rsatish va 
              raqobatchilardan ajralib turadigan texnologik ustunliklarimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">100% Ishonchli Xizmat</h3>
                <p className="text-slate-600 mb-4">
                  3 yillik tajriba, 500+ muvaffaqiyatli loyiha va 99.8% mijoz qoniqish darajasi. 
                  To'liq kafolat va professional yondashuv.
                </p>
                <div className="flex items-center justify-center space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-slate-600 ml-2">4.9/5</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">24 Soatda Ishga Tushish</h3>
                <p className="text-slate-600 mb-4">
                  Eng tez marketpleys integratsiyasi. Mahsulot fotosuratlari, matn yozish, 
                  narx belgilash va marketpleysga yuklash - hammasi bir kunda.
                </p>
                <div className="flex items-center justify-center text-green-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">O'rtacha 18 soat</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Barcha Marketpleyslar</h3>
                <p className="text-slate-600 mb-4">
                  Uzum Market, Wildberries, Yandex Market va MySklad bilan to'liq API integratsiya. 
                  Bir joydan barcha savdolarni boshqaring.
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-6.222 6.222a.75.75 0 01-1.061 0l-3.11-3.111a.75.75 0 011.061-1.06l2.58 2.579 5.692-5.692a.75.75 0 111.06 1.062z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                      <path d="M11.9 0C5.4 0 0 5.4 0 12s5.4 12 11.9 12c6.6 0 11.9-5.4 11.9-12S18.5 0 11.9 0zm3.8 18.7h-2.6l-4.6-7.1v7.1H6.1V5.3h2.4v6.9l4.4-6.9h2.8l-4.2 6.2 4.2 7.2z"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Professional Kontent</h3>
                <p className="text-slate-600 mb-4">
                  Professional fotograf va copywriter jamoa. HD fotosurat, video kontent, 
                  SEO optimizatsiya qilingan matnlar va dizayn.
                </p>
                <div className="text-orange-600 text-sm font-medium">
                  1000+ yuqori sifatli rasmlar
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">AI-Powered Analytics</h3>
                <p className="text-slate-600 mb-4">
                  Real vaqtda foyda tahlili, trend monitoring va aqlli pricing. 
                  Machine learning algoritmlari orqali optimal biznes qarorlar qabul qiling.
                </p>
                <div className="text-indigo-600 text-sm font-medium">
                  95% aniqlik darajasi
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <HeadphonesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">24/7 Qo'llab-quvvatlash</h3>
                <p className="text-slate-600 mb-4">
                  Telegram, WhatsApp, telefon orqali doimo aloqada. Muammolar 15 daqiqada hal qilinadi. 
                  Shaxsiy menejer va texnik yordam.
                </p>
                <div className="text-pink-600 text-sm font-medium">
                  O'rtacha javob vaqti: 3 daqiqa
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competitor Comparison */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Raqobatchilardan Farqimiz
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Boshqalar</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• 30-50% komissiya</li>
                  <li>• 1-2 hafta ishga tushish</li>
                  <li>• Cheklangan qo'llab-quvvatlash</li>
                  <li>• Faqat 1-2 marketpleys</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-primary mb-2">BiznesYordam</h4>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• 12-25% komissiya</li>
                  <li>• 24 soatda ishga tushish</li>
                  <li>• 24/7 professional yordam</li>
                  <li>• Barcha marketpleyslar</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">DIY (O'zingiz)</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Vaqt sarfi: 200+ soat</li>
                  <li>• Dastlabki xatolar</li>
                  <li>• Texnik bilim kerak</li>
                  <li>• Riska yuqori</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Bizning Natijalar */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Bizning Natijalar</h2>
            <p className="text-xl text-slate-600">Raqamlar bilan isbotlangan professional xizmat</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center bg-white/95 backdrop-blur-sm hover:bg-white transition-all p-6 shadow-lg hover:shadow-2xl border-l-4 border-l-primary" data-testid="stat-revenue">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-semibold text-primary mb-3 drop-shadow-lg">500M+</div>
                <div className="text-slate-800 font-semibold text-lg">So'm oylik aylanma</div>
                <div className="text-sm text-primary/80 mt-2 font-medium">1200+ faol mahsulot</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/95 backdrop-blur-sm hover:bg-white transition-all p-6 shadow-lg hover:shadow-2xl border-l-4 border-l-accent" data-testid="stat-profit">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-semibold text-slate-900 mb-3 drop-shadow-lg">42%</div>
                <div className="text-slate-800 font-semibold text-lg">O'rtacha foyda marjasi</div>
                <div className="text-sm text-slate-800 mt-2 font-medium">Sof foyda AI tahlil bilan</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/95 backdrop-blur-sm hover:bg-white transition-all p-6 shadow-lg hover:shadow-2xl border-l-4 border-l-secondary" data-testid="stat-products">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-semibold text-slate-900 mb-3 drop-shadow-lg">15K+</div>
                <div className="text-slate-800 font-semibold text-lg">Trending mahsulot bazasi</div>
                <div className="text-sm text-secondary/80 mt-2 font-medium">Xalqaro bozorlardan</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/95 backdrop-blur-sm hover:bg-white transition-all p-6 shadow-lg hover:shadow-2xl border-l-4 border-l-green-500" data-testid="stat-satisfaction">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-semibold text-green-600 mb-3 drop-shadow-lg">150+</div>
                <div className="text-slate-800 font-semibold text-lg">Faol hamkor</div>
                <div className="text-sm text-green-600/80 mt-2 font-medium">4 darajali xizmat tizimi</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Hamkorlarimiz Muvaffaqiyatlari</h2>
            <p className="text-xl text-slate-600">Haqiqiy bizneslar, haqiqiy natijalar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Elektronika Dunyosi</h4>
                    <p className="text-sm text-slate-600">Professional Plus hamkor</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "BiznesYordam orqali oylik aylanmamiz 3 barobar oshdi. Trend Hunter 
                  bilan yangi mahsulotlar topish juda oson va foyda tahlili hammani hayratda qoldirdi."
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Oylik aylanma:</span>
                    <span className="font-semibold text-green-600">85M so'm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Foyda marjasi:</span>
                    <span className="font-semibold text-green-600">38%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Fashion Style UZ</h4>
                    <p className="text-sm text-slate-600">Business Standard hamkor</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "Sof Foyda Dashboard sayesida barcha xarajatlarni nazorat qila oldim. 
                  Soliq va logistika hisobi avtomatik bo'lgani biznesni boshqarishni juda osonlashtirdi."
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Oylik aylanma:</span>
                    <span className="font-semibold text-blue-600">45M so'm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Foyda marjasi:</span>
                    <span className="font-semibold text-blue-600">31%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Smart Home Solutions</h4>
                    <p className="text-sm text-slate-600">Enterprise Elite hamkor</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "Global trending mahsulotlar va aqlli pricing systemasi bizni 
                  bozor liderlaridan biriga aylantirdi. ROI 6 oyda 400% oshdi."
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Oylik aylanma:</span>
                    <span className="font-semibold text-purple-600">150M so'm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Foyda marjasi:</span>
                    <span className="font-semibold text-purple-600">45%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fulfillment Calculator */}
      <section id="calculator">
        <FulfillmentCalculator />
      </section>

      {/* Pricing Section - Fixed */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Tarif Rejalari</h2>
            <p className="text-xl text-slate-600">Biznes hajmingizga mos professional yechimni tanlang</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Starter Pro */}
            <Card className="relative hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 h-full flex flex-col" data-testid="tier-starter">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Starter Pro</h3>
                  <div className="text-3xl font-bold text-primary mb-2">0 so'm</div>
                  <div className="text-sm text-slate-600">Oylik to'lov</div>
                  <div className="text-xs text-slate-500 mt-1">30-45% komissiya</div>
                </div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-slate-600">50 mahsulotgacha</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-slate-600">Asosiy analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-slate-600">Email qo'llab-quvvatlash</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-400 line-through">Sof Foyda Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-400 line-through">Trend Hunter</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium"
                  onClick={() => {
                    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-testid="button-choose-starter"
                >
                  Tanlash
                </Button>
              </CardContent>
            </Card>

            {/* Business Standard */}
            <Card className="relative hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 h-full flex flex-col" data-testid="tier-business">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Business Standard</h3>
                  <div className="text-3xl font-bold text-primary mb-2">4,500,000 so'm</div>
                  <div className="text-sm text-slate-600">Oylik to'lov</div>
                  <div className="text-xs text-slate-500 mt-1">18-25% komissiya</div>
                </div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">Professional fulfillment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">3 ta marketpleys</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">Telefon qo'llab-quvvatlash</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">50 million so'mgacha aylanma</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={() => {
                    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-testid="button-choose-business"
                >
                  Tanlash
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plus (Recommended) */}
            <Card className="relative bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary hover:shadow-xl transition-all duration-300 h-full flex flex-col" data-testid="tier-professional">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Tavsiya Etiladi
                </div>
              </div>
              <CardContent className="p-8 pt-12 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Professional Plus</h3>
                  <div className="text-3xl font-bold text-primary mb-2">8,500,000 so'm</div>
                  <div className="text-sm text-slate-600">Oylik to'lov</div>
                  <div className="text-xs text-slate-500 mt-1">15-20% komissiya</div>
                </div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">Premium fulfillment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">Barcha marketpleys</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">24/7 qo'llab-quvvatlash</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">150 million so'mgacha aylanma</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-medium"
                  onClick={() => {
                    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-testid="button-choose-professional"
                >
                  Tanlash
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Elite */}
            <Card className="relative hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-secondary/20 h-full flex flex-col" data-testid="tier-enterprise">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise Elite</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-2">Individual</div>
                  <div className="text-sm font-semibold text-slate-800">Manager bilan gaplashib belgilanadi</div>
                  <div className="text-xs font-medium text-slate-700 mt-1">12-18% komissiya</div>
                </div>
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">VIP fulfillment xizmat</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">Maxsus integratsiyalar</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">Shaxsiy menejer</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                    <span className="text-sm text-slate-700">Cheksiz aylanma</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium"
                  onClick={() => {
                    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-testid="button-choose-enterprise"
                >
                  Tanlash
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Hamkor Bo'ling</h2>
            <p className="text-xl text-slate-600">Professional marketpleys xizmatlarini boshlang</p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">Ism *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Ismingizni kiriting"
                      className="mt-1"
                      required
                      data-testid="input-firstName"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Familiya *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Familiyangizni kiriting"
                      className="mt-1"
                      required
                      data-testid="input-lastName"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email manzil *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@example.com"
                      className="mt-1"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Telefon raqam *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="mt-1"
                      required
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessCategory" className="text-sm font-medium text-slate-700">Biznes kategoriyasi *</Label>
                    <Select value={formData.businessCategory} onValueChange={(value) => handleInputChange('businessCategory', value)}>
                      <SelectTrigger className="mt-1" data-testid="select-businessCategory">
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Elektronika</SelectItem>
                        <SelectItem value="clothing">Kiyim-kechak</SelectItem>
                        <SelectItem value="home">Uy jihozlari</SelectItem>
                        <SelectItem value="sports">Sport tovarlari</SelectItem>
                        <SelectItem value="beauty">Go'zallik va salomatlik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="monthlyRevenue" className="text-sm font-medium text-slate-700">Oylik savdo hajmi *</Label>
                    <Select value={formData.monthlyRevenue} onValueChange={(value) => handleInputChange('monthlyRevenue', value)}>
                      <SelectTrigger className="mt-1" data-testid="select-monthlyRevenue">
                        <SelectValue placeholder="Hajmni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000000">1-10 million so'm</SelectItem>
                        <SelectItem value="25000000">10-50 million so'm</SelectItem>
                        <SelectItem value="75000000">50-100 million so'm</SelectItem>
                        <SelectItem value="200000000">100+ million so'm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium text-slate-700">Qo'shimcha ma'lumot</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Biznes haqida qo'shimcha ma'lumot yoki maxsus talablar..."
                    rows={4}
                    className="mt-1"
                    data-testid="textarea-notes"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    data-testid="checkbox-terms"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-slate-700">
                    Men foydalanish shartlari va maxfiylik siyosatiga roziman *
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white transform hover:scale-105 transition-all py-3 text-lg font-semibold"
                  disabled={!formData.agreeToTerms}
                  data-testid="button-submit"
                >
                  Hamkorlikni Boshlash
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MP</span>
                </div>
                <h3 className="text-xl font-bold">BiznesYordam</h3>
              </div>
              <p className="text-slate-400 mb-6">
                O'zbekistondagi yetakchi marketpleys boshqaruvi platformasi. 
                Professional xizmatlar bilan biznesingizni rivojlantiring.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Xizmatlar</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Marketpleys Boshqaruvi</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Fulfillment Xizmatlari</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Logistika</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Analytics va Hisobot</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Integratsiyalar</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Uzum Market</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Wildberries</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Yandex Market</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">MySklad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Bog'lanish</h4>
              <ul className="space-y-3">
                <li className="text-slate-400">
                  <strong>Email:</strong> info@marketpro.uz
                </li>
                <li className="text-slate-400">
                  <strong>Telefon:</strong> +998 71 123 45 67
                </li>
                <li className="text-slate-400">
                  <strong>Manzil:</strong> Toshkent, O'zbekiston
                </li>
                <li className="text-slate-400">
                  <strong>Ish vaqti:</strong> 24/7 qo'llab-quvvatlash
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-slate-400 text-sm">
                © 2024 BiznesYordam. Barcha huquqlar himoyalangan.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Maxfiylik Siyosati</a>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Foydalanish Shartlari</a>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Yordam</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}