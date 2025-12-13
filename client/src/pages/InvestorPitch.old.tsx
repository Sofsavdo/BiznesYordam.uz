import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Download, Rocket, TrendingUp, DollarSign, Target, Zap, Package, Users, BarChart3, Globe, Award, CheckCircle, Lock, Eye, EyeOff, Brain, Clock, Shield, Sparkles, Crown, Star, Play, ChevronRight, TrendingDown, AlertCircle, X } from 'lucide-react';
import { useLocation } from 'wouter';

export default function InvestorPitch() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const CORRECT_PASSWORD = 'Medik9298';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Noto\'g\'ri parol! Iltimos, qaytadan urinib ko\'ring.');
      setPassword('');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setLocation('/');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAuthenticated, currentSlide]);

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <Card className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                SellerCloud<span className="text-yellow-400">X</span>
              </h1>
              <div className="inline-block px-4 py-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-xs font-bold text-white mb-4">
                CONFIDENTIAL INVESTOR DECK
              </div>
              <p className="text-gray-300 text-sm">
                Secure access required • For investors only
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-12 h-12 rounded-xl"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Lock className="w-5 h-5 mr-2" />
                Access Pitch Deck
              </Button>

              <Button
                type="button"
                onClick={() => setLocation('/')}
                variant="ghost"
                className="w-full text-gray-300 hover:text-white hover:bg-white/10 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-xs text-blue-200 text-center leading-relaxed">
                🔒 This presentation contains confidential information. 
                By accessing, you agree to maintain confidentiality.
              </p>
            </div>
          </Card>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -50px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(50px, 50px) scale(1.05); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  // Simple PPT export - just print current view
  const exportToPPT = () => {
    alert(`📊 PPT EXPORT YO'RIQNOMASI:

1️⃣ HAR BIR SLAYDNI PRINT QILING:
   • Har bir slaydga o'ting (→ tugma)
   • Ctrl+P bosing
   • "Save as PDF" tanlang
   • Fayl nomi: Slide_01.pdf, Slide_02.pdf...

2️⃣ PDF'LARNI BIRLASHTIRING:
   • ilovepdf.com/merge-pdf
   • Barcha PDF'larni upload qiling
   • "Merge PDF" bosing

3️⃣ PPT GA KONVERT QILING:
   • ilovepdf.com/pdf-to-ppt
   • Birlashtirilgan PDF'ni upload qiling
   • "Convert to PowerPoint" bosing
   • Tayyor PPT'ni yuklab oling

✅ TAYYOR! 20 slaydli professional pitch.`);
  };

  const slides = [
    // Slide 1: Title
    {
      type: 'title',
      content: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-sm font-bold mb-4 animate-pulse">
            INVESTORLAR UCHUN
          </div>
          <h1 className="text-7xl md:text-9xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent animate-gradient">
              SellerCloudX
            </span>
          </h1>
          <p className="text-3xl md:text-4xl text-blue-300 font-bold mb-8">
            AI Fulfillment & Marketplace Operator
          </p>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            O'zbekistondagi marketplace sellerlar uchun AI bilan boshqariladigan<br />
            to'liq avtomatlashtirilgan ombor va marketplace operatsiyalari
          </p>
          <div className="flex justify-center gap-6 mt-12">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">Ishlayotgan platforma</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">Tayyor AI sistemasi</span>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 2: Muammo
    {
      type: 'content',
      title: 'Muammo',
      subtitle: 'Marketpleysda sotish oson. Foydali ishlash qiyin.',
      content: (
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-2xl font-bold text-red-400 mb-3">Ombor va Logistika Tartibsizligi</h3>
              <p className="text-gray-300">Qo'lda boshqaruv, sekin jarayonlar, xatolar, yo'qotilgan tovarlar</p>
            </div>
            <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-2xl font-bold text-red-400 mb-3">Marketplace Operatsiyalari</h3>
              <p className="text-gray-300">Uzum, WB, Ozon, AliExpress - har biri o'z reglamenlari, murakkab</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-2xl font-bold text-red-400 mb-3">Kadrlar Muammosi</h3>
              <p className="text-gray-300">Yaxshi xodimlar kam, qimmat va barqaror emas</p>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8 transform hover:scale-105 transition-all">
              <h3 className="text-3xl font-black text-white mb-4">NATIJA:</h3>
              <div className="space-y-2 text-lg text-white">
                <p>❌ Savdo hajmi o'sadi, foyda tushadi</p>
                <p>❌ Vaqt yo'qotiladi</p>
                <p>❌ Xarajatlar oshadi</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 3: Yechim
    {
      type: 'content',
      title: 'Bizning Yechim',
      subtitle: 'AI Fulfillment + Marketplace Operator = 70% Avtomatlashtirish',
      content: (
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500 rounded-2xl p-8 backdrop-blur-sm">
            <Package className="w-16 h-16 text-blue-400 mb-4" />
            <h3 className="text-3xl font-bold text-blue-400 mb-4">AI Fulfillment Platforma</h3>
            <ul className="space-y-3 text-lg text-gray-300">
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" /> Ombor boshqaruvi va jonli zaxira kuzatuvi</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" /> Qadoqlash va stikerlash avtomatlashtirilgan</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" /> Paket va buyurtma kuzatuvi</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-green-600/20 border-2 border-purple-500 rounded-2xl p-8 backdrop-blur-sm">
            <Zap className="w-16 h-16 text-purple-400 mb-4" />
            <h3 className="text-3xl font-bold text-purple-400 mb-4">AI Marketplace Operator</h3>
            <ul className="space-y-3 text-lg text-gray-300">
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" /> Listing va narx optimizatsiya (AI)</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" /> Ko'p bozorda savdo hajmi boshqaruvi</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" /> Avtomatik buyurtma va qaytish boshqaruvi</li>
            </ul>
          </div>
        </div>
      ),
    },
    // Slide 4: Mahsulot (Skrinshotlar)
    {
      type: 'content',
      title: 'Ishlayotgan Platforma',
      subtitle: 'Real kod, real dashboard, real AI',
      content: (
        <div className="mt-12 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500 rounded-2xl p-6 overflow-hidden">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">📊 Partner Dashboard</h3>
              <div className="bg-gray-900/80 rounded-lg p-6 mb-3 border border-gray-700 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Jami Savdo (3 bozor)</div>
                    <div className="text-4xl font-black text-white">700M so'm</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">Oylik Foyda</div>
                    <div className="text-3xl font-black text-green-400">+42M</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-blue-600/20 rounded p-2 text-center">
                    <div className="text-xs text-blue-400">Uzum</div>
                    <div className="text-lg font-bold text-white">320M</div>
                  </div>
                  <div className="bg-purple-600/20 rounded p-2 text-center">
                    <div className="text-xs text-purple-400">WB</div>
                    <div className="text-lg font-bold text-white">250M</div>
                  </div>
                  <div className="bg-green-600/20 rounded p-2 text-center">
                    <div className="text-xs text-green-400">Ozon</div>
                    <div className="text-lg font-bold text-white">130M</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Foyda %</span>
                    <span className="text-green-400 font-bold">+342%</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">✅ Jonli kuzatuv | ✅ Ko'p bozor | ✅ Avto-sinxron</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500 rounded-2xl p-6 overflow-hidden">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">🤖 AI Manager Live</h3>
              <div className="bg-gray-900/80 rounded-lg p-6 mb-3 border border-gray-700 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Faol AI Ishchilar</div>
                    <div className="text-4xl font-black text-white">8 Agents</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">Ishlamoqda</div>
                    <div className="text-3xl font-black text-blue-400">12</div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between bg-green-600/10 rounded p-2 border-l-4 border-green-500">
                    <span className="text-sm text-gray-300">Narx Optimallashtirish</span>
                    <span className="text-xs text-green-400">✓ Faol</span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-600/10 rounded p-2 border-l-4 border-blue-500">
                    <span className="text-sm text-gray-300">E'lon Yaratish</span>
                    <span className="text-xs text-blue-400">⚡ Ishlamoqda</span>
                  </div>
                  <div className="flex items-center justify-between bg-purple-600/10 rounded p-2 border-l-4 border-purple-500">
                    <span className="text-sm text-gray-300">Trend Tahlili</span>
                    <span className="text-xs text-purple-400">⚡ Running</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Muvaffaqiyat</span>
                    <span className="text-green-400 font-bold">99.8%</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">✅ 24/7 monitoring | ✅ Parallel bajarish | ✅ Avto-kengayish</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-green-400 mb-3">💰 Fulfillment Kalkulyator - Real Data</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-2">Sotish Narxi</div>
                <div className="text-2xl font-bold text-white">20 000 000</div>
                <div className="text-xs text-gray-500 mt-1">so'm</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-2">Xarajatlar</div>
                <div className="text-2xl font-bold text-orange-400">10 600 000</div>
                <div className="text-xs text-gray-500 mt-1">so'm</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-2">Marketplace Fee</div>
                <div className="text-2xl font-bold text-red-400">4 000 000</div>
                <div className="text-xs text-gray-500 mt-1">so'm (20%)</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg p-4 border border-green-400">
                <div className="text-xs text-green-100 mb-2">Final Foyda</div>
                <div className="text-2xl font-bold text-white">5 400 000</div>
                <div className="text-xs text-green-100 mt-1">so'm (27%)</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-600/10 rounded-lg border border-blue-500/30">
              <p className="text-sm text-gray-300 text-center">
                ✅ <span className="font-bold text-blue-400">SellerCloudX Haq: 1 200 000 so'm</span> (6% savdo) | 
                Seller Net Profit: <span className="font-bold text-green-400">4 200 000 so'm</span>
              </p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 5: AI Manager Kuchi
    {
      type: 'content',
      title: 'AI Manager - Asosiy Ustunlik',
      subtitle: 'Odam omilidan 10-15x tez, mukammal, parallel',
      content: (
        <div className="mt-12 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border-2 border-red-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-red-400 mb-6">👤 Inson Operator</h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li>❌ 1 kishi = 3-5 seller maksimum</li>
                <li>❌ Xato qiladi (5-10% xatolik)</li>
                <li>❌ Ketadi, kasallaydi, charchaydi</li>
                <li>❌ Ish vaqti: 8-10 soat/kun</li>
                <li>❌ O'qitish kerak: 2-3 oy</li>
                <li>❌ Oylik: $500-$1,000</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-green-400 mb-6">🤖 AI Manager</h3>
              <ul className="space-y-4 text-lg text-gray-300">
                <li>✅ 1 AI = 50+ seller parallel</li>
                <li>✅ 99.9% aniqlik, xatosiz</li>
                <li>✅ 24/7 ishla yadi, to'xtamaydi</li>
                <li>✅ Ish vaqti: non-stop</li>
                <li>✅ O'qitish: 0 vaqt, tayyor</li>
                <li>✅ Xarajat: $100-$200 dasturiy interfeys</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
            <h3 className="text-4xl font-black text-white mb-4">AI Manager = 10-15x Tezroq va Arzonroq</h3>
            <p className="text-2xl text-blue-100">1 AI operator 50 sellerga xizmat ko'rsatadi, parallel task execution bilan</p>
          </div>
        </div>
      ),
    },
    // Slide 6: Trend Hunter
    {
      type: 'content',
      title: 'Trend Hunter - Premium Xizmat',
      subtitle: 'Chet elda $5,000-$10,000 / oy, bizda QO\'SHIMCHA',
      content: (
        <div className="mt-12 space-y-8">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-purple-400 mb-6">Trend Hunter nima?</h3>
            <p className="text-xl text-gray-300 mb-6">AI asosida global marketplace trendlarini real-time tahlil qilish va sellerga tavsiya berish tizimi</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 rounded-xl p-6">
                <div className="text-4xl mb-3">🔍</div>
                <h4 className="text-xl font-bold text-blue-400 mb-2">Trend Aniqlash</h4>
                <p className="text-gray-300">Qaysi mahsulotlar tez o'sib borayotganini aniqlash</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6">
                <div className="text-4xl mb-3">📊</div>
                <h4 className="text-xl font-bold text-green-400 mb-2">Raqobat Tahlili</h4>
                <p className="text-gray-300">Qaysi niche'da raqobat past, foyda yuqori</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6">
                <div className="text-4xl mb-3">💡</div>
                <h4 className="text-xl font-bold text-purple-400 mb-2">Mahsulot Tavsiyalari</h4>
                <p className="text-gray-300">Qaysi mahsulotni qo'shish kerakligi haqida AI tavsiya</p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-600/20 border-2 border-red-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-red-400 mb-4">Chet Elda Narx</h3>
              <div className="text-5xl font-black text-white mb-2">$5,000-$10,000</div>
              <p className="text-gray-300">per seller / oy (Jungle Scout, Helium 10 analoglari)</p>
            </div>
            <div className="bg-green-600/20 border-2 border-green-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Bizda</h3>
              <div className="text-5xl font-black text-white mb-2">QO'SHIMCHA</div>
              <p className="text-gray-300">Professional+ va Enterprise paketlariga bepul</p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 7: Bizning Ustunliklar
    {
      type: 'content',
      title: 'Bizning Ustunliklar',
      subtitle: 'Nega aynan SellerCloudX?',
      content: (
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-2xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all">
            <Award className="w-12 h-12 text-green-400 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-green-400 mb-3 text-center">Birinchi Boshlagan Ustunligi</h3>
            <p className="text-gray-300 text-center">O'zbekistonda birinchi AI-based fulfillment operator</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500 rounded-2xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all">
            <Users className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-blue-400 mb-3 text-center">1 Operator = 50+ Seller</h3>
            <p className="text-gray-300 text-center">HR xarajatlari 5 baravar past</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-2xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all">
            <Globe className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-purple-400 mb-3 text-center">Ko'p Bozor</h3>
            <p className="text-gray-300 text-center">3-4 marketplace bitta paneldan</p>
          </div>
        </div>
      ),
    },
    // Slide 5: Bozor Hajmi
    {
      type: 'content',
      title: 'Bozor Hajmi',
      subtitle: 'Katta imkoniyat: 117,000+ seller, $80M-$120M bozor',
      content: (
        <div className="mt-12 space-y-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl font-black text-white mb-2">70,000+</div>
              <div className="text-blue-200 text-lg">Uzum Sellerlar</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl font-black text-white mb-2">25,000+</div>
              <div className="text-purple-200 text-lg">Wildberries</div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl font-black text-white mb-2">12,000+</div>
              <div className="text-green-200 text-lg">Ozon</div>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl font-black text-white mb-2">10,000+</div>
              <div className="text-orange-200 text-lg">AliExpress</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-cyan-400 mb-4">Fulfillment Bozor</h3>
              <div className="text-6xl font-black text-white mb-2">$80M-$120M</div>
              <p className="text-gray-300 text-lg">O'zbekiston + Region (2025)</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-purple-400 mb-4">AI Operator Xizmatlari</h3>
              <div className="text-6xl font-black text-white mb-2">$40M-$60M</div>
              <p className="text-gray-300 text-lg">Yangi bozor segmenti</p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 6: Biznes Model
    {
      type: 'content',
      title: 'Biznes Modeli',
      subtitle: "Har bir sellerdan o'rtacha 42 mln so'm / oy",
      content: (
        <div className="mt-12 space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Fulfillment Xizmatlari</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Qadoqlash: 300-800 so'm/dona</li>
                <li>• Stiker va paket materiallari</li>
                <li>• Ombor xizmatlari</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Marketplace Boshqaruvi</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 5-8% GMV komissiya</li>
                <li>• AI listing va narx optimizatsiya</li>
                <li>• Multi-marketplace operatsiya</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Premium Xizmatlar</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Reklama boshqaruvi</li>
                <li>• Advanced analytics</li>
                <li>• Avtomatik narx optimizatsiya</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Bitta Sellerdan O'rtacha Daromad</h3>
            <div className="text-7xl font-black text-white mb-2">42 MLN SO'M</div>
            <div className="text-2xl text-green-200">≈ $3,000 / oy</div>
          </div>
        </div>
      ),
    },
    // Slide 7: Unit Economics
    {
      type: 'content',
      title: 'Unit Economics',
      subtitle: "Bitta seller bo'yicha raqamlar",
      content: (
        <div className="mt-12">
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500 rounded-2xl p-8 mb-8">
            <h3 className="text-3xl font-bold text-blue-400 mb-6 text-center">Bitta Seller (3-4 marketplace)</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">700M</div>
                <div className="text-gray-300 text-lg">So'm GMV / oy</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-green-400 mb-2">6%</div>
                <div className="text-gray-300 text-lg">Bizning ulush</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-green-400 mb-2">42M</div>
                <div className="text-gray-300 text-lg">So'm daromad</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center">
            <h3 className="text-4xl font-black text-white mb-4">BREAKEVEN: 1-2 SELLER</h3>
            <p className="text-2xl text-green-100">Bitta sellerdan sof daromad ≈ $2,500-$3,000 / oy</p>
          </div>
        </div>
      ),
    },
    // Slide 8: Xarajatlar
    {
      type: 'content',
      title: 'Operatsion Xarajatlar',
      subtitle: 'Lean model: $2,600-$3,500 / oy',
      content: (
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-300">Ombor ijara (500m²)</span>
              <span className="text-2xl font-bold text-blue-400">$600-$1,000</span>
            </div>
            <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-300">2 ta ishchi</span>
              <span className="text-2xl font-bold text-blue-400">~$700</span>
            </div>
            <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-300">Supervisor (yarim stavka)</span>
              <span className="text-2xl font-bold text-blue-400">~$250</span>
            </div>
            <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-300">Transport</span>
              <span className="text-2xl font-bold text-blue-400">$400-$700</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-300">Materiallar</span>
              <span className="text-2xl font-bold text-blue-400">~$300</span>
            </div>
            <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-300">Server va IT</span>
              <span className="text-2xl font-bold text-blue-400">~$150</span>
            </div>
            <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4 flex justify-between items-center">
              <span className="text-gray-300">Boshqa xarajatlar</span>
              <span className="text-2xl font-bold text-blue-400">~$200</span>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-center mt-4">
              <div className="text-4xl font-black text-white mb-2">$2,600-$3,500</div>
              <div className="text-xl text-blue-100">Jami oylik xarajat</div>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 9: Daromad Proyeksiyasi
    {
      type: 'content',
      title: 'Daromad Proyeksiyasi',
      subtitle: "5→10→25→40 seller: exponensial o'sish",
      content: (
        <div className="mt-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-blue-500">
                  <th className="p-4 text-2xl font-bold text-blue-400">Seller Soni</th>
                  <th className="p-4 text-2xl font-bold text-purple-400">Daromad (so'm)</th>
                  <th className="p-4 text-2xl font-bold text-green-400">Sof Foyda ($)</th>
                </tr>
              </thead>
              <tbody className="text-xl">
                <tr className="border-b border-gray-700 hover:bg-blue-900/20 transition-colors">
                  <td className="p-4 font-bold text-white">5</td>
                  <td className="p-4 text-purple-300">210 mln</td>
                  <td className="p-4 text-green-300 font-bold">$11,500</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-blue-900/20 transition-colors">
                  <td className="p-4 font-bold text-white">10</td>
                  <td className="p-4 text-purple-300">420 mln</td>
                  <td className="p-4 text-green-300 font-bold">$33,500</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-blue-900/20 transition-colors">
                  <td className="p-4 font-bold text-white">25</td>
                  <td className="p-4 text-purple-300">1.05 mlrd</td>
                  <td className="p-4 text-green-300 font-bold">$88,000</td>
                </tr>
                <tr className="bg-gradient-to-r from-green-900/50 to-emerald-900/50">
                  <td className="p-4 font-black text-white text-2xl">40</td>
                  <td className="p-4 text-purple-300 font-bold text-2xl">1.68 mlrd</td>
                  <td className="p-4 text-green-400 font-black text-3xl">$145,000+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Slide 10: Savdoni Oshirish Mexanizmlari
    {
      type: 'content',
      title: 'Savdoni Oshirish Strategiyasi',
      subtitle: 'AI bizning asosiy quroghimiz',
      content: (
        <div className="mt-12 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">🤖 AI Price Optimization</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✅ Avtomatik narx moslashtirish (real-time)</li>
                <li>✅ Raqobatchi narx monitoring</li>
                <li>✅ Demand-based pricing strategiyasi</li>
                <li>✅ 15-25% savdo oshishi</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">📊 Listing Optimization</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✅ AI-generated SEO titles va descriptions</li>
                <li>✅ Keyword research va tavsiyalar</li>
                <li>✅ A/B testing avtomatik</li>
                <li>✅ 30-40% ko'rinish oshishi</li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-4">🔍 Trend Hunter Integration</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✅ Hot trending products real-time</li>
                <li>✅ Low competition niche'lar topish</li>
                <li>✅ Seller ga yangi mahsulot tavsiyalari</li>
                <li>✅ GMV 2x potentsial o'sishi</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-2 border-orange-500 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-orange-400 mb-4">📈 Multi-Marketplace Expansion</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✅ Bir mahsulot → 3-4 marketplace</li>
                <li>✅ GMV diversifikatsiyasi</li>
                <li>✅ Riskni taqsimlash</li>
                <li>✅ 3-4x savdo o'sishi</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 11: Raqobatchilar
    {
      type: 'content',
      title: 'Raqobatchilar Tahlili',
      subtitle: 'Biz ulardan qanday ustunmiz?',
      content: (
        <div className="mt-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-500">
                  <th className="p-4 text-left text-2xl font-bold text-white">Raqobatchi</th>
                  <th className="p-4 text-left text-2xl font-bold text-red-400">Kamchiligi</th>
                  <th className="p-4 text-left text-2xl font-bold text-green-400">Bizning Ustunlik</th>
                </tr>
              </thead>
              <tbody className="text-lg">
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-bold text-white">Lawnex</td>
                  <td className="p-4 text-red-300">Qo'lbola jarayonlar</td>
                  <td className="p-4 text-green-300">AI + avtomatlashtirish</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-bold text-white">Local Fulfillment</td>
                  <td className="p-4 text-red-300">Faqat 1 marketplace</td>
                  <td className="p-4 text-green-300">Ko'p marketplace GMV</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 font-bold text-white">Operator xizmatlari</td>
                  <td className="p-4 text-red-300">Qimmat, HR-ga bog'liq</td>
                  <td className="p-4 text-green-300">AI arzon va skeyl qiladi</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Yangi fulfillmentlar</td>
                  <td className="p-4 text-red-300">Tajriba yo'q</td>
                  <td className="p-4 text-green-300">End-to-End platforma tayyor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Slide 12: Traction va Roadmap
    {
      type: 'content',
      title: 'Hozirgi Holat va Reja',
      subtitle: 'Nimaga erishdik va qayerga bormoqdamiz',
      content: (
        <div className="mt-12 space-y-8">
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-2 border-green-500 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-green-400 mb-6">✅ Hozirgi Holat (Mahsulot Tayyor)</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">100%</div>
                <div className="text-green-300">Platforma Tayyor</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">4</div>
                <div className="text-green-300">Marketplace Integratsiya</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">8</div>
                <div className="text-green-300">AI Modullar</div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-600/20 border-2 border-blue-500 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">1-chorak 2025 (3 oy)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 5-10 seller onboarding</li>
                <li>• Ombor jihozlash</li>
                <li>• Breakeven erishish</li>
              </ul>
            </div>
            <div className="bg-purple-600/20 border-2 border-purple-500 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-3">2-3 chorak 2025 (6 oy)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 25 seller portfeli</li>
                <li>• Premium features launch</li>
                <li>• $50k+ oylik daromad</li>
              </ul>
            </div>
            <div className="bg-green-600/20 border-2 border-green-500 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-green-400 mb-3">4-chorak 2025 (12 oy)</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• 40+ seller base</li>
                <li>• Region expansion (KZ)</li>
                <li>• $120k+ oylik daromad</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 13: Jamoa
    {
      type: 'content',
      title: 'Jamoa va Tajriba',
      subtitle: 'Texnologiya + Bozor + Operatsiya',
      content: (
        <div className="mt-12 space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-500 rounded-2xl p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍💻</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-2">Texnologiya Asoschisi</h3>
              <p className="text-gray-300 mb-3">Full-stack Developer</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• AI/ML integration</li>
                <li>• 5+ yil dev tajriba</li>
                <li>• Scalable architecture</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500 rounded-2xl p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-2">Operatsiya Rahbari</h3>
              <p className="text-gray-300 mb-3">Logistika va Fulfillment</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 3+ yil bozor tajriba</li>
                <li>• Ombor boshqaruvi</li>
                <li>• Jarayon optimallashtirish</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500 rounded-2xl p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Biznes Rahbari</h3>
              <p className="text-gray-300 mb-3">Savdo va Hamkorlik</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Seller munosabatlari</li>
                <li>• Strategik rejalashtirish</li>
                <li>• Investitsiya jalb qilish</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">To'liq komanda: Tech (2) + Operations (3) + Sales (2)</h3>
            <p className="text-xl text-blue-100">Investitsiya bilan yana 3-4 kishi qo'shish rejasi</p>
          </div>
        </div>
      ),
    },
    // Slide 14: 3-5 Yillik Vision
    {
      type: 'content',
      title: '3-5 Yillik Vision',
      subtitle: 'Regional lider → Global expansion',
      content: (
        <div className="mt-12 space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-700/50 border-2 border-blue-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-blue-400 mb-4">2025: Tashkil</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li>✅ O'zbekiston bazarda</li>
                <li>✅ 40-50 seller base</li>
                <li>✅ $1.5M ARR</li>
                <li>✅ Breakeven+ profitable</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-700/50 border-2 border-purple-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-purple-400 mb-4">2026-2027: Kengayish</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li>✅ Qozog'iston launch</li>
                <li>✅ 150-200 seller base</li>
                <li>✅ $5M+ ARR</li>
                <li>✅ Regional lider</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-900/50 to-green-700/50 border-2 border-green-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-green-400 mb-4">2028-2029: Dominatsiya</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li>✅ Markaziy Osiyo monopoli</li>
                <li>✅ 500+ seller ecosystem</li>
                <li>✅ $15M-$20M ARR</li>
                <li>✅ Exit / Series A</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-center">
            <h3 className="text-5xl font-black text-white mb-6">$50M+ Valuation Potential</h3>
            <p className="text-2xl text-green-100">10% ulush = $5M+ exit value (25-30x ROI investorga)</p>
          </div>
        </div>
      ),
    },
    // Slide 15: Risk Mitigation
    {
      type: 'content',
      title: 'Risklar va Mitigation',
      subtitle: 'Har bir riskni oldini olish strategiyasi',
      content: (
        <div className="mt-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-blue-500">
                  <th className="p-4 text-left text-2xl font-bold text-red-400">Risk</th>
                  <th className="p-4 text-left text-2xl font-bold text-green-400">Mitigation Strategiyasi</th>
                </tr>
              </thead>
              <tbody className="text-lg">
                <tr className="border-b border-gray-700">
                  <td className="p-4 text-red-300">Seller onboarding sekin</td>
                  <td className="p-4 text-green-300">Referal dastur, targeted marketing, 1 oy bepul trial</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 text-red-300">Marketplace API o'zgarishlari</td>
                  <td className="p-4 text-green-300">Multi-marketplace diversifikatsiya, API monitoring</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 text-red-300">Raqobatchilar paydo bo'lishi</td>
                  <td className="p-4 text-green-300">First-mover advantage, tech moat (AI), seller loyalti</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 text-red-300">Operatsion xatoliklar</td>
                  <td className="p-4 text-green-300">AI monitoring, quality control, insurance</td>
                </tr>
                <tr>
                  <td className="p-4 text-red-300">Cash flow muammolari</td>
                  <td className="p-4 text-green-300">Net-30 payment terms, working capital buffer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    // Slide 16: Why Now?
    {
      type: 'content',
      title: 'Nega Aynan Hozir?',
      subtitle: 'Mukammal vaqt: bozor, texnologiya, talab',
      content: (
        <div className="mt-12 space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-blue-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-blue-400 mb-4">📈 Bozor O'sishi</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li>✅ E-commerce 40% CAGR</li>
                <li>✅ Uzum, WB tez o'sish</li>
                <li>✅ 70,000+ seller bor</li>
                <li>✅ 2025: golden period</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-purple-400 mb-4">🤖 AI Texnologiyasi</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li>✅ GPT-4, Claude tayyor</li>
                <li>✅ API narxlari past</li>
                <li>✅ AI adoption yuqori</li>
                <li>✅ Tech moat mumkin</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-green-400 mb-4">💼 Seller Demand</h3>
              <ul className="space-y-3 text-lg text-gray-300">
                <li>✅ Fulfillment muammosi</li>
                <li>✅ HR kamchiligi</li>
                <li>✅ Arzon yechim kerak</li>
                <li>✅ Sotib olishga tayyor</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-center">
            <h3 className="text-4xl font-black text-white mb-4">🚀 Birinchi Boshlash Imkoniyati: 6-12 oy</h3>
            <p className="text-2xl text-orange-100">Agar hozir boshlamasak, raqobatchilar paydo bo'ladi</p>
          </div>
        </div>
      ),
    },
    // Slide 17: Use of Funds
    {
      type: 'content',
      title: 'Investitsiya Taqsimoti',
      subtitle: '$150-200k dan har bir dollar',
      content: (
        <div className="mt-12 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-blue-600/20 border-2 border-blue-500 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">Ombor Kengaytmasi</h3>
                  <p className="text-gray-300">Jihozlar, transport, avtomatlashtirish</p>
                </div>
                <div className="text-4xl font-black text-blue-400">35%</div>
              </div>
              <div className="bg-purple-600/20 border-2 border-purple-500 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">AI va Tech</h3>
                  <p className="text-gray-300">Yangi modullar, integratsiyalar</p>
                </div>
                <div className="text-4xl font-black text-purple-400">25%</div>
              </div>
              <div className="bg-green-600/20 border-2 border-green-500 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Marketing & Sales</h3>
                  <p className="text-gray-300">Seller onboarding, branding</p>
                </div>
                <div className="text-4xl font-black text-green-400">20%</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-600/20 border-2 border-orange-500 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-2">Jamoa Kengaytmasi</h3>
                  <p className="text-gray-300">2-3 key hire (sales, ops)</p>
                </div>
                <div className="text-4xl font-black text-orange-400">10%</div>
              </div>
              <div className="bg-cyan-600/20 border-2 border-cyan-500 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">Working Capital</h3>
                  <p className="text-gray-300">Cash flow buffer, operatsiya</p>
                </div>
                <div className="text-4xl font-black text-cyan-400">10%</div>
              </div>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-center mt-4">
                <h3 className="text-3xl font-bold text-white mb-2">18 Oy Runway</h3>
                <p className="text-xl text-green-100">Profitabillikka yetish uchun yetarli</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 18: Financial Projections (Detailed)
    {
      type: 'content',
      title: 'Moliyaviy Proyeksiyalar',
      subtitle: '18 oylik detallashtirilgan prognoz',
      content: (
        <div className="mt-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-blue-500">
                  <th className="p-4 text-xl font-bold text-white">Davr</th>
                  <th className="p-4 text-xl font-bold text-purple-400">Seller Soni</th>
                  <th className="p-4 text-xl font-bold text-blue-400">Oylik Daromad</th>
                  <th className="p-4 text-xl font-bold text-orange-400">Xarajat</th>
                  <th className="p-4 text-xl font-bold text-green-400">Net Profit</th>
                </tr>
              </thead>
              <tbody className="text-lg">
                <tr className="border-b border-gray-700 hover:bg-blue-900/20">
                  <td className="p-4 text-white">Q1 (1-3 oy)</td>
                  <td className="p-4 text-purple-300">5</td>
                  <td className="p-4 text-blue-300">$15k</td>
                  <td className="p-4 text-orange-300">-$12k</td>
                  <td className="p-4 text-green-300">$3k</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-blue-900/20">
                  <td className="p-4 text-white">Q2 (4-6 oy)</td>
                  <td className="p-4 text-purple-300">12</td>
                  <td className="p-4 text-blue-300">$36k</td>
                  <td className="p-4 text-orange-300">-$15k</td>
                  <td className="p-4 text-green-300">$21k</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-blue-900/20">
                  <td className="p-4 text-white">Q3 (7-9 oy)</td>
                  <td className="p-4 text-purple-300">20</td>
                  <td className="p-4 text-blue-300">$60k</td>
                  <td className="p-4 text-orange-300">-$18k</td>
                  <td className="p-4 text-green-300">$42k</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-blue-900/20">
                  <td className="p-4 text-white">Q4 (10-12 oy)</td>
                  <td className="p-4 text-purple-300">30</td>
                  <td className="p-4 text-blue-300">$90k</td>
                  <td className="p-4 text-orange-300">-$22k</td>
                  <td className="p-4 text-green-300">$68k</td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-blue-900/20">
                  <td className="p-4 text-white">Q5 (13-15 oy)</td>
                  <td className="p-4 text-purple-300">35</td>
                  <td className="p-4 text-blue-300">$105k</td>
                  <td className="p-4 text-orange-300">-$25k</td>
                  <td className="p-4 text-green-300">$80k</td>
                </tr>
                <tr className="bg-gradient-to-r from-green-900/50 to-emerald-900/50">
                  <td className="p-4 font-bold text-white text-xl">Q6 (16-18 oy)</td>
                  <td className="p-4 text-purple-300 font-bold text-xl">40+</td>
                  <td className="p-4 text-blue-400 font-bold text-xl">$120k+</td>
                  <td className="p-4 text-orange-300 font-bold text-xl">-$28k</td>
                  <td className="p-4 text-green-400 font-black text-2xl">$92k+</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">18 Oy ichida: $1.08M yillik, $90k+ oylik daromad</h3>
            <p className="text-xl text-blue-100">Profitabel, skeyllanuvchi, investor exit tayyor</p>
          </div>
        </div>
      ),
    },
    // Slide 19: Investitsiya So'rovi
    {
      type: 'final',
      content: (
        <div className="text-center space-y-12">
          <div className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-lg font-bold mb-4 animate-pulse">
            INVESTITSIYA SO'ROVI
          </div>
          <div className="space-y-6">
            <h2 className="text-5xl font-black text-white">Investitsiya Raundi</h2>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 max-w-4xl mx-auto transform hover:scale-105 transition-all">
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <div className="text-gray-300 text-xl mb-2">So'ralayotgan Investitsiya</div>
                  <div className="text-6xl font-black text-white mb-4">$150k-$200k</div>
                  <div className="text-blue-200 text-lg">Seed bosqich</div>
                </div>
                <div>
                  <div className="text-gray-300 text-xl mb-2">Taklif Qilinayotgan Ulush</div>
                  <div className="text-6xl font-black text-green-400 mb-4">10%</div>
                  <div className="text-blue-200 text-lg">Post-money: $1.5M-$2.0M</div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
              <div className="bg-gray-800/50 border-2 border-blue-500 rounded-2xl p-6">
                <Package className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-blue-400 mb-2">Ombor Kengaytmasi</h3>
                <p className="text-gray-300">Jihozlar, transport</p>
              </div>
              <div className="bg-gray-800/50 border-2 border-purple-500 rounded-2xl p-6">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-purple-400 mb-2">AI Modullar</h3>
                <p className="text-gray-300">Yangi integratsiyalar</p>
              </div>
              <div className="bg-gray-800/50 border-2 border-green-500 rounded-2xl p-6">
                <Users className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-400 mb-2">Marketing</h3>
                <p className="text-gray-300">Seller onboarding</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">18 Oy ichida:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-white text-lg">
                <div>✅ 40+ seller portfeli</div>
                <div>✅ GMV $30M+/yil</div>
                <div>✅ ROI: 2.5-3x potentsial</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 20: Final CTA
    {
      type: 'final',
      content: (
        <div className="text-center space-y-12">
          <h1 className="text-7xl md:text-9xl font-black mb-8">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
              SellerCloudX
            </span>
          </h1>
          <p className="text-4xl text-gray-300 font-bold max-w-4xl mx-auto leading-relaxed">
            "Sellerlar uchun to'liq avtomatlashtirilgan biznes mexanizmi"
          </p>
          <div className="space-y-6 mt-12">
            <div className="text-2xl text-blue-300">
              <CheckCircle className="w-8 h-8 inline mr-2" />
              O'zbekistonda birinchi AI fulfillment operator
            </div>
            <div className="text-2xl text-purple-300">
              <CheckCircle className="w-8 h-8 inline mr-2" />
              Kam risk: 1-2 seller bilan breakeven
            </div>
            <div className="text-2xl text-green-300">
              <CheckCircle className="w-8 h-8 inline mr-2" />
              Yuqori marjali, skeyllanuvchi biznes model
            </div>
          </div>
          <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 max-w-4xl mx-auto transform hover:scale-105 transition-all">
            <h2 className="text-5xl font-black text-white mb-6">Bugun Qo'shiling!</h2>
            <p className="text-2xl text-green-100 mb-8">10% ulush, $150k-$200k, regional monopol imkoniyati</p>
            <div className="flex justify-center gap-4 text-xl">
              <div>📞 +998 90 123 45 67</div>
              <div>📧 invest@sellercloudx.uz</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Top buttons */}
      <div className="fixed top-8 right-8 z-50 flex gap-3">
        <button
          onClick={exportToPPT}
          className="p-3 rounded-full bg-green-600/80 hover:bg-green-600 backdrop-blur-sm transition-all transform hover:scale-110 border border-green-400/50"
          title="PowerPoint formatda yuklab olish"
        >
          <Download className="w-6 h-6" />
        </button>
        <button
          onClick={() => setLocation('/')}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all transform hover:scale-110 border border-white/20"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* Slide content */}
      <div className="relative w-full h-screen flex items-center justify-center p-4 z-10 overflow-hidden">
        <div className="max-w-7xl w-full h-[85vh] flex flex-col overflow-hidden">
          {currentSlideData.type === 'title' && (
            <div className="h-full flex items-center justify-center">{currentSlideData.content}</div>
          )}
          
          {currentSlideData.type === 'content' && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="text-center mb-2 flex-shrink-0">
                <h2 className="text-2xl md:text-3xl font-black mb-1 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {currentSlideData.title}
                </h2>
                <p className="text-base md:text-lg text-gray-300 font-semibold">
                  {currentSlideData.subtitle}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  {currentSlideData.content}
                </div>
              </div>
            </div>
          )}

          {currentSlideData.type === 'final' && (
            <div className="h-full flex items-center justify-center">{currentSlideData.content}</div>
          )}
        </div>
      </div>

      {/* Navigation - Simplified */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50">
        <Button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          variant="outline"
          size="icon"
          className="bg-black/70 hover:bg-black/90 border-white/40 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-md rounded-full w-14 h-14 shadow-lg"
        >
          <ArrowLeft className="w-7 h-7" />
        </Button>

        <Button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          variant="outline"
          size="icon"
          className="bg-black/70 hover:bg-black/90 border-white/40 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-md rounded-full w-14 h-14 shadow-lg"
        >
          <ArrowRight className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
}
