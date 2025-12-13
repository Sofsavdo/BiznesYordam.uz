import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Lock, Eye, EyeOff, CheckCircle, TrendingUp, DollarSign, Users, Zap, Target, BarChart3, Rocket, AlertCircle, Package, Brain, Clock, X, Warehouse, ShoppingCart, Globe, Award, Layers } from 'lucide-react';
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
      setError('Noto\'g\'ri parol! Qaytadan urinib ko\'ring.');
      setPassword('');
    }
  };

  const slides = [
    // SLIDE 1: SARLAVHA
    {
      id: 'title',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 pb-24">
          <div className="text-center max-w-5xl px-8">
            <div className="inline-block px-6 py-2 bg-green-500/20 border border-green-500/50 rounded-full mb-8">
              <span className="text-green-400 font-bold text-xl">💰 SEED ROUND: $150,000</span>
            </div>
            
            <h1 className="text-8xl font-black text-white mb-6">
              Biznes<span className="text-blue-400">Yordam</span>
            </h1>
            
            <p className="text-4xl text-blue-300 font-bold mb-4">
              AI Fulfillment Operator + SaaS
            </p>
            
            <p className="text-2xl text-gray-300 mb-12">
              Profit-share Fulfillment (O'zbekiston) +<br />
              AI Marketplace Manager SaaS (UZ/RU/KZ/AZ/TR/KG)
            </p>
            
            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-black text-green-400 mb-2">$40M</div>
                <div className="text-lg text-gray-300">ARR (Year 3)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-black text-blue-400 mb-2">100%</div>
                <div className="text-lg text-gray-300">Platform Tayyor</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-black text-purple-400 mb-2">3-4 oy</div>
                <div className="text-lg text-gray-300">Break-even</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-md mx-auto">
              <div className="text-xl text-white font-bold mb-2">Jo'liyev G'ayratjon</div>
              <div className="text-lg text-gray-300">Founder & CEO</div>
              <div className="text-lg text-blue-400 mt-2">+998 33 445 36 36</div>
              <div className="text-sm text-gray-400 mt-1">Toshkent, O'zbekiston</div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: MUAMMO
    {
      id: 'problem',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-slate-900 to-red-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-10">
              <h2 className="text-7xl font-black text-red-400 mb-4">Muammo</h2>
              <p className="text-3xl text-gray-300">Sellerlar 35-57M so'm/oy xarajat, lekin foyda 5-10%</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <Warehouse className="w-12 h-12 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ombor: 15-25M so'm/oy</h3>
                    <p className="text-lg text-gray-300">Ijara, xodimlar, qadoqlash. Xatolar: 5-10% yo'qotish</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <Users className="w-12 h-12 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Managerlar: 20-32M so'm/oy</h3>
                    <p className="text-lg text-gray-300">4 marketplace × 5-8M so'm. Ishdan chiqish va o'rgatish qo'shimcha</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-12 h-12 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Excel: Xatolar 15-20%</h3>
                    <p className="text-lg text-gray-300">Stok xatolar, foyda yo'qotish 10-15%, qo'lda kuzatish 20+ soat/hafta</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-12 h-12 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Vaqt: 6-8 soat/kun</h3>
                    <p className="text-lg text-gray-300">Operatsion ishlar. Strategiyaga vaqt yo'q</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-6 text-center">
              <p className="text-3xl font-black text-white">
                NATIJA: GMV yuqori, lekin sof foyda faqat 5-10%
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 3: YECHIM
    {
      id: 'solution',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-slate-900 to-blue-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-green-400 mb-4">Yechim</h2>
              <p className="text-3xl text-gray-300">4-5 ta xodim o'rniga: 1 operator + AI Manager</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 mb-8 text-center">
              <p className="text-3xl font-bold text-white mb-3">
                70-85% xarajat tejash • Foyda 2-3x oshadi
              </p>
              <p className="text-xl text-gray-300">
                24/7 to'xtamaydigan ishlash • 3-4 marketplace parallel
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3 text-center">AI Manager</h3>
                <ul className="text-lg text-gray-300 space-y-2">
                  <li>• Foydali mahsulotlar topadi</li>
                  <li>• Real-time narxlar</li>
                  <li>• Stok xatolar 0%</li>
                  <li>• 24/7 kuzatuv</li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3 text-center">Avtomatlashtirish</h3>
                <ul className="text-lg text-gray-300 space-y-2">
                  <li>• Listing avtomatik</li>
                  <li>• Narx optimizatsiya</li>
                  <li>• Stok boshqaruv</li>
                  <li>• Hisobotlar real-time</li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3 text-center">Natija</h3>
                <ul className="text-lg text-gray-300 space-y-2">
                  <li>• Foyda 2x oshadi</li>
                  <li>• 6-8 soat/kun tejash</li>
                  <li>• Xatolar 0%</li>
                  <li>• Strategiyaga fokus</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: BOZOR
    {
      id: 'market',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-purple-400 mb-4">Bozor</h2>
              <p className="text-3xl text-gray-300">$2.5B e-commerce, 40% CAGR, 30,000+ seller</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-3xl p-6 border border-blue-500/30">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">O'zbekiston</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-black text-blue-400 mb-2">$2.5B</div>
                    <div className="text-xl text-gray-300">E-commerce bozor (2024)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-green-400 mb-2">40%</div>
                    <div className="text-xl text-gray-300">CAGR (eng tez o'suvchi)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-purple-400 mb-2">30,000+</div>
                    <div className="text-xl text-gray-300">Faol seller</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/30">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">4 Marketplace</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                    <span className="text-xl text-white font-semibold">Uzum</span>
                    <span className="text-lg text-blue-400">~17,000 seller</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                    <span className="text-xl text-white font-semibold">Wildberries</span>
                    <span className="text-lg text-purple-400">~6,000 seller</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                    <span className="text-xl text-white font-semibold">Yandex Market</span>
                    <span className="text-lg text-green-400">~4,000 seller</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
                    <span className="text-xl text-white font-semibold">Ozon</span>
                    <span className="text-lg text-yellow-400">~3,000 seller</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 text-center">
              <p className="text-2xl text-white font-semibold">
                🎯 Bizning maqsad: 20-50 Fulfillment + 300-600 SaaS (1-2% penetratsiya)
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 5: UNIT ECONOMICS
    {
      id: 'unit-economics',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 via-slate-900 to-green-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-yellow-400 mb-4">Unit Economics</h2>
              <p className="text-3xl text-gray-300">Foyda 2x oshadi: 52-74M → 141M so'm/oy</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-6">
                <h3 className="text-3xl font-bold text-white mb-4 text-center">OLDIN (Oddiy)</h3>
                <div className="space-y-2 text-lg">
                  <div className="flex justify-between text-gray-300">
                    <span>GMV:</span>
                    <span className="text-white font-bold">800M so'm</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tannarx (50%):</span>
                    <span className="text-red-400">-400M</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Komissiya (22%):</span>
                    <span className="text-red-400">-176M</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Soliq (5%):</span>
                    <span className="text-red-400">-40M</span>
                  </div>
                  <div className="flex justify-between text-gray-300 border-t border-white/20 pt-2">
                    <span>Qolgan:</span>
                    <span className="text-white font-bold">184M</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Marketing:</span>
                    <span className="text-red-400">-60M</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Ombor+logistika:</span>
                    <span className="text-red-400">-20-25M</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>4 manager:</span>
                    <span className="text-red-400">-20-32M</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Qo'shimcha:</span>
                    <span className="text-red-400">-10-15M</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl border-t-2 border-red-500 pt-2 mt-2">
                    <span className="text-white">SOF FOYDA:</span>
                    <span className="text-red-400">52-74M</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-500/10 border-2 border-green-500 rounded-3xl p-6">
                <h3 className="text-3xl font-bold text-white mb-4 text-center">KEYIN (BiznesYordam)</h3>
                <div className="space-y-2 text-lg">
                  <div className="flex justify-between text-gray-300">
                    <span>GMV:</span>
                    <span className="text-white font-bold">800M so'm</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tannarx (50%):</span>
                    <span className="text-red-400">-400M</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Komissiya (22%):</span>
                    <span className="text-red-400">-176M</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Soliq (5%):</span>
                    <span className="text-red-400">-40M</span>
                  </div>
                  <div className="flex justify-between text-gray-300 border-t border-white/20 pt-2">
                    <span>Qolgan:</span>
                    <span className="text-white font-bold">184M</span>
                  </div>
                  <div className="flex justify-between text-green-300">
                    <span>Marketing:</span>
                    <span className="text-green-400">0 (biz qilamiz!)</span>
                  </div>
                  <div className="flex justify-between text-green-300">
                    <span>Ombor+manager:</span>
                    <span className="text-green-400">0 (biz qilamiz!)</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Bizga to'lov:</span>
                    <span className="text-yellow-400">-43M</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 ml-4">
                    <span>Abonent:</span>
                    <span>25M</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 ml-4">
                    <span>Profit share (10%):</span>
                    <span>18M</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl border-t-2 border-green-500 pt-2 mt-2">
                    <span className="text-white">SOF FOYDA:</span>
                    <span className="text-green-400">141M</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 text-center">
              <p className="text-3xl font-black text-white">
                ✅ Foyda +67-89M so'm/oy (+129-171%) • ✅ Vaqt tejash 6-8 soat/kun • ✅ Xatolar 0%
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: MOLIYAVIY
    {
      id: 'financials',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-blue-400 mb-4">3 Yillik Proyeksiya</h2>
              <p className="text-3xl text-gray-300">$2M → $40M ARR</p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-500/10 border-2 border-blue-500 rounded-3xl p-6 text-center">
                <div className="text-sm text-blue-400 font-bold mb-2">YEAR 1 (2025)</div>
                <div className="text-5xl font-black text-white mb-4">$2-4M</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Fulfillment: 20-30</div>
                  <div>SaaS: 300-400</div>
                  <div className="text-green-400 font-bold">Break-even: 3-4 oy</div>
                </div>
              </div>
              
              <div className="bg-purple-500/10 border-2 border-purple-500 rounded-3xl p-6 text-center">
                <div className="text-sm text-purple-400 font-bold mb-2">YEAR 2 (2026)</div>
                <div className="text-5xl font-black text-white mb-4">$8-14M</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Fulfillment: 35-50</div>
                  <div>SaaS: 1,200-1,800</div>
                  <div className="text-green-400 font-bold">Net profit: 15-20%</div>
                </div>
              </div>
              
              <div className="bg-green-500/10 border-2 border-green-500 rounded-3xl p-6 text-center">
                <div className="text-sm text-green-400 font-bold mb-2">YEAR 3 (2027)</div>
                <div className="text-5xl font-black text-white mb-4">$16-40M</div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>Fulfillment: 45-60</div>
                  <div>SaaS: 2,500-4,500</div>
                  <div className="text-green-400 font-bold">Net profit: 25-30%</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Key Metrics</h3>
              <div className="grid grid-cols-4 gap-4 text-center text-white">
                <div>
                  <div className="text-3xl font-black mb-1">12-18%</div>
                  <div className="text-sm">MRR growth</div>
                </div>
                <div>
                  <div className="text-3xl font-black mb-1">18-36x</div>
                  <div className="text-sm">LTV/CAC</div>
                </div>
                <div>
                  <div className="text-3xl font-black mb-1">&lt;5%</div>
                  <div className="text-sm">Churn</div>
                </div>
                <div>
                  <div className="text-3xl font-black mb-1">$18-60K</div>
                  <div className="text-sm">LTV</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: INVESTITSIYA
    {
      id: 'investment',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-slate-900 to-blue-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Investitsiya So'rovi
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Seed Round</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl font-black text-yellow-400 mb-2">$150K</div>
                    <div className="text-xl text-gray-300">So'ralayotgan investitsiya</div>
                  </div>
                  <div className="text-center pt-4 border-t border-white/20">
                    <div className="text-4xl font-black text-white mb-2">10%</div>
                    <div className="text-xl text-gray-300">Equity</div>
                    <div className="text-sm text-gray-400 mt-2">$1.5M pre-money valuatsiya</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Use of Funds</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2 text-lg">
                      <span className="text-gray-300">AI & Backend Jamoa</span>
                      <span className="text-white font-bold">35%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[35%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-lg">
                      <span className="text-gray-300">Fulfillment & Operatsion</span>
                      <span className="text-white font-bold">30%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 w-[30%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-lg">
                      <span className="text-gray-300">Marketing & Ekspansiya</span>
                      <span className="text-white font-bold">25%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 w-[25%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-lg">
                      <span className="text-gray-300">Yuridik & Zaxira</span>
                      <span className="text-white font-bold">10%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 w-[10%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">12 Oyda</h3>
              <div className="grid grid-cols-3 gap-6 text-center text-white">
                <div>
                  <div className="text-4xl font-black mb-2">35-50</div>
                  <div className="text-lg">Premium hamkor</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">1,200-1,800</div>
                  <div className="text-lg">SaaS mijoz</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">$8-14M</div>
                  <div className="text-lg">ARR</div>
                </div>
              </div>
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              BiznesYordam
            </h1>
            <div className="inline-block px-4 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-sm font-bold text-green-400 mb-4">
              MAXFIY INVESTOR TAQDIMOTI
            </div>
            <p className="text-gray-300 text-sm">Faqat investorlar uchun</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting..."
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-12 h-12 rounded-xl"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-6 rounded-xl"
            >
              <Lock className="w-5 h-5 mr-2" />
              Kirish
            </Button>

            <Button
              type="button"
              onClick={() => setLocation('/')}
              variant="ghost"
              className="w-full text-gray-300 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Bosh sahifa
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-900">
      {slides[currentSlide].content}

      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-8">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 disabled:opacity-30"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Oldingi
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-white font-semibold ml-4">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
          
          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 disabled:opacity-30"
          >
            Keyingi
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <button
        onClick={() => setLocation('/')}
        className="fixed top-8 right-8 bg-black/50 backdrop-blur-lg rounded-full p-3 border border-white/20 hover:bg-black/70 z-50"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
