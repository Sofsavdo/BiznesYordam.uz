import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Lock, Eye, EyeOff, CheckCircle, TrendingUp, DollarSign, Users, Zap, Target, BarChart3, Rocket, AlertCircle, Package, Brain, Clock, X, Warehouse, ShoppingCart, TrendingDown, Globe } from 'lucide-react';
import { useLocation } from 'wouter';

export default function RealInvestorPitch() {
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
              <span className="text-green-400 font-bold text-xl">💰 SEED ROUND: $250K-$300K</span>
            </div>
            
            <h1 className="text-8xl font-black text-white mb-6">
              Biznes<span className="text-blue-400">Yordam</span>
            </h1>
            
            <p className="text-4xl text-blue-300 font-bold mb-8">
              AI Fulfillment Operator
            </p>
            
            <p className="text-2xl text-gray-300 mb-12">
              O'zbekistondagi marketplace sellerlar uchun<br />
              AI bilan boshqariladigan ombor va marketplace operatsiyalari
            </p>
            
            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-black text-green-400 mb-2">100%</div>
                <div className="text-lg text-gray-300">Platform Tayyor</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-black text-blue-400 mb-2">20-30</div>
                <div className="text-lg text-gray-300">Sifatli Hamkor</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-black text-purple-400 mb-2">6-9 oy</div>
                <div className="text-lg text-gray-300">Breakeven</div>
              </div>
            </div>
            
            <div className="text-xl text-gray-400">
              [Ism Familiya] – Founder & CEO<br />
              Tel / Telegram / Email
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
            <div className="text-center mb-12">
              <h2 className="text-7xl font-black text-red-400 mb-4">Muammo</h2>
              <p className="text-3xl text-gray-300">Marketpleysda sotish oson. Foydali ishlash qiyin.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-8">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-4">Operatsion Ovora</h3>
                <p className="text-xl text-gray-300">
                  Sellerlar ombor, logistika, qaytishlar, soliq, reklama bilan ovora – 
                  strategiyaga vaqt qolmaydi
                </p>
              </div>
              
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-8">
                <Users className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-4">Kadrlar Muammosi</h3>
                <p className="text-xl text-gray-300">
                  Yaxshi marketplace menejerlar kam va qimmat. 
                  Har bir marketplace uchun alohida mutaxassis kerak
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 text-center">
              <h3 className="text-4xl font-black text-white mb-4">NATIJA:</h3>
              <div className="grid grid-cols-2 gap-6 text-2xl text-white">
                <div>❌ GMV o'sadi, sof foyda tushadi</div>
                <div>❌ Raqamsiz boshqaruv</div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-2xl text-gray-300 italic">
                "Muammo – katta savdo emas, sog'lom unit-ekonomikaga erishish"
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
            <div className="text-center mb-10">
              <h2 className="text-7xl font-black text-green-400 mb-4">Yechim</h2>
              <p className="text-3xl text-gray-300">AI bilan boshqariladigan fulfillment operator</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 mb-8 text-center">
              <p className="text-3xl font-bold text-white mb-4">
                Biz sellerlar uchun ombor + fulfillment + marketplace operatsiyalar + analytics'ni 
                to'liq o'z zimmamizga olamiz
              </p>
              <p className="text-2xl text-gray-300">
                Seller faqat mahsulot va kapitalga fokus qiladi
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3 text-center">AI Manager</h3>
                <ul className="text-lg text-gray-300 space-y-2">
                  <li>• Mahsulot kartalari</li>
                  <li>• Narxlar va kontent</li>
                  <li>• Analytics va tasklar</li>
                  <li>• Avtomatik tavsiyalar</li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <Warehouse className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3 text-center">Fulfillment</h3>
                <ul className="text-lg text-gray-300 space-y-2">
                  <li>• Qabul va saqlash</li>
                  <li>• Yig'ish va qadoqlash</li>
                  <li>• Jo'natish</li>
                  <li>• Qaytishlar boshqaruvi</li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3 text-center">Partner Kabinet</h3>
                <ul className="text-lg text-gray-300 space-y-2">
                  <li>• Savdo va foyda</li>
                  <li>• ROI kalkulyatori</li>
                  <li>• Barcha xarajatlar</li>
                  <li>• Real-time monitoring</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 bg-green-500/20 rounded-2xl p-6 border border-green-500/50 text-center">
              <p className="text-2xl text-white font-semibold">
                💡 Biz seller uchun AI bilan ishlaydigan "operations jamoa"miz
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: MAHSULOT
    {
      id: 'product',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-purple-400 mb-4">Ishlayotgan Platforma</h2>
              <p className="text-3xl text-gray-300">100% tayyor, 41,842 qator kod</p>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-3xl p-6 border border-blue-500/30">
                <div className="bg-slate-800 rounded-2xl p-6 mb-4 h-40 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                    <div className="text-xl text-white font-bold">Partner Dashboard</div>
                  </div>
                </div>
                <p className="text-lg text-gray-300 text-center">GMV, sof foyda, ROI, fulfillment xarajatlari</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/30">
                <div className="bg-slate-800 rounded-2xl p-6 mb-4 h-40 flex items-center justify-center">
                  <div className="text-center">
                    <DollarSign className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                    <div className="text-xl text-white font-bold">Fulfillment Kalkulyatori</div>
                  </div>
                </div>
                <p className="text-lg text-gray-300 text-center">To'liq P&L, barcha xarajatlar</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-3xl p-6 border border-green-500/30">
                <div className="bg-slate-800 rounded-2xl p-6 mb-4 h-40 flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-16 h-16 text-green-400 mx-auto mb-2" />
                    <div className="text-xl text-white font-bold">AI Manager Monitor</div>
                  </div>
                </div>
                <p className="text-lg text-gray-300 text-center">Real vaqtda AI monitoring</p>
              </div>
            </div>
            
            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Texnik Baza</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-black text-blue-400 mb-1">React</div>
                  <div className="text-sm text-gray-400">Frontend</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-400 mb-1">Node.js</div>
                  <div className="text-sm text-gray-400">Backend</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-purple-400 mb-1">PostgreSQL</div>
                  <div className="text-sm text-gray-400">Database</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-yellow-400 mb-1">AI</div>
                  <div className="text-sm text-gray-400">OpenAI/Claude</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 5: TARIFLAR
    {
      id: 'pricing',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-slate-900 to-blue-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-green-400 mb-4">Biznes Modeli</h2>
              <p className="text-3xl text-gray-300">Abonent + Foydadan Ulush</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-500/10 border-2 border-blue-500 rounded-2xl p-4 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Starter Pro</h3>
                <div className="text-4xl font-black text-blue-400 mb-1">3M</div>
                <div className="text-sm text-gray-400 mb-2">so'm/oy</div>
                <div className="text-2xl font-bold text-orange-400">+50%</div>
                <div className="text-xs text-gray-400">sof foydadan</div>
              </div>
              
              <div className="bg-purple-500/10 border-2 border-purple-500 rounded-2xl p-4 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Business</h3>
                <div className="text-4xl font-black text-purple-400 mb-1">8M</div>
                <div className="text-sm text-gray-400 mb-2">so'm/oy</div>
                <div className="text-2xl font-bold text-orange-400">+25%</div>
                <div className="text-xs text-gray-400">sof foydadan</div>
              </div>
              
              <div className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-4 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                <div className="text-4xl font-black text-green-400 mb-1">18M</div>
                <div className="text-sm text-gray-400 mb-2">so'm/oy</div>
                <div className="text-2xl font-bold text-orange-400">+15%</div>
                <div className="text-xs text-gray-400">sof foydadan</div>
              </div>
              
              <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-2xl p-4 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-black text-yellow-400 mb-1">25M</div>
                <div className="text-sm text-gray-400 mb-2">so'm/oy</div>
                <div className="text-2xl font-bold text-orange-400">+10%</div>
                <div className="text-xs text-gray-400">sof foydadan</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 mb-6">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-5xl font-black text-white mb-2">~6%</div>
                  <div className="text-xl text-gray-300">GMV monetizatsiya</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-white mb-2">20-30</div>
                  <div className="text-xl text-gray-300">Sifatli hamkorlar</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <p className="text-2xl text-white font-semibold italic">
                "Biz minglab mayda sellerlar emas, sifatli va o'sish potentsialiga ega hamkorlar bilan ishlaymiz"
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: OPERATSION MODEL
    {
      id: 'operations',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-900 via-slate-900 to-red-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-orange-400 mb-4">Operatsion Model</h2>
              <p className="text-3xl text-gray-300">Lean: ombor qurmaymiz, ijaradan boshlaymiz</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Ombor</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xl">
                    <span className="text-gray-300">Hajm:</span>
                    <span className="text-white font-bold">500 m²</span>
                  </div>
                  <div className="flex justify-between items-center text-xl">
                    <span className="text-gray-300">Narx:</span>
                    <span className="text-white font-bold">50K so'm/m²</span>
                  </div>
                  <div className="flex justify-between items-center text-xl border-t border-white/20 pt-4">
                    <span className="text-gray-300">Oylik:</span>
                    <span className="text-green-400 font-bold text-2xl">25M so'm</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Jamoa</h3>
                <div className="space-y-3 text-lg text-gray-300">
                  <div className="flex justify-between">
                    <span>3 ta omborchi</span>
                    <span className="text-white font-semibold">~15M so'm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1-2 ta haydovchi</span>
                    <span className="text-white font-semibold">~5-10M so'm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direktor</span>
                    <span className="text-white font-semibold">$1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Menejerlar</span>
                    <span className="text-white font-semibold">~$1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IT & AI</span>
                    <span className="text-white font-semibold">~$1,000</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Umumiy Oylik Xarajat</h3>
              <div className="text-7xl font-black text-white mb-2">$8-9.5K</div>
              <p className="text-xl text-orange-100">Lean variant: infrani qurmaymiz, faqat ijaraga olamiz</p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: UNIT ECONOMICS
    {
      id: 'unit-economics',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 via-slate-900 to-green-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-yellow-400 mb-4">Unit Economics</h2>
              <p className="text-3xl text-gray-300">Breakeven: nechta hamkor bilan nolga chiqamiz?</p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-500/10 border-2 border-blue-500 rounded-3xl p-6 text-center">
                <div className="text-sm text-blue-400 font-bold mb-2">MONETIZATSIYA</div>
                <div className="text-6xl font-black text-white mb-2">~6%</div>
                <div className="text-xl text-gray-300">GMV</div>
                <div className="text-sm text-gray-400 mt-4">3% fixed + 3% foyda</div>
              </div>
              
              <div className="bg-purple-500/10 border-2 border-purple-500 rounded-3xl p-6 text-center">
                <div className="text-sm text-purple-400 font-bold mb-2">FIXED COST</div>
                <div className="text-6xl font-black text-white mb-2">$9K</div>
                <div className="text-xl text-gray-300">oyiga</div>
                <div className="text-sm text-gray-400 mt-4">Ombor + Jamoa + IT</div>
              </div>
              
              <div className="bg-green-500/10 border-2 border-green-500 rounded-3xl p-6 text-center">
                <div className="text-sm text-green-400 font-bold mb-2">KERAKLI GMV</div>
                <div className="text-6xl font-black text-white mb-2">$300K</div>
                <div className="text-xl text-gray-300">oyiga</div>
                <div className="text-sm text-gray-400 mt-4">~4 mlrd so'm</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6 text-center">Breakeven Hisob</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-black text-white mb-2">13-16</div>
                  <div className="text-2xl text-green-100">hamkor</div>
                  <div className="text-lg text-green-200 mt-2">Breakeven nuqta</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-white mb-2">20+</div>
                  <div className="text-2xl text-green-100">hamkor</div>
                  <div className="text-lg text-green-200 mt-2">Barqaror foyda</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20 text-center">
                <p className="text-xl text-white">
                  Agar bitta hamkorning o'rtacha GMVi 250-300M so'm/oy bo'lsa
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 8: 3 YILLIK REJA
    {
      id: 'roadmap',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-blue-400 mb-4">3 Yillik Yo'l Xaritasi</h2>
              <p className="text-3xl text-gray-300">O'zbekiston → Qozog'iston → Rossiya</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30">
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-black text-blue-400">1</div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-3">Year 1: O'zbekiston</h3>
                    <div className="grid grid-cols-3 gap-4 text-lg text-gray-300">
                      <div>
                        <div className="text-2xl font-bold text-white">15-20</div>
                        <div>sifatli hamkor</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">4-5 mlrd</div>
                        <div>so'm GMV/oy</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">Breakeven</div>
                        <div>kichik foyda</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-black text-purple-400">2</div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-3">Year 2: O'zbekiston + Qozog'iston</h3>
                    <div className="grid grid-cols-3 gap-4 text-lg text-gray-300">
                      <div>
                        <div className="text-2xl font-bold text-white">40-50</div>
                        <div>hamkor (UZ+KZ)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">Model</div>
                        <div>ishlayapti</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">P&L</div>
                        <div>ijobiy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30">
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-black text-green-400">3</div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-3">Year 3: UZ + KZ + RU</h3>
                    <div className="grid grid-cols-3 gap-4 text-lg text-gray-300">
                      <div>
                        <div className="text-2xl font-bold text-white">70-90</div>
                        <div>hamkor (3 mamlakat)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">$40-60M</div>
                        <div>GMV/yil</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">$0.5-0.7M</div>
                        <div>EBITDA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 9: NEGA BIZ
    {
      id: 'why-us',
      content: (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 pb-24">
          <div className="max-w-6xl px-8 w-full">
            <div className="text-center mb-10">
              <h2 className="text-7xl font-black text-purple-400 mb-4">Nega Aynan Biz?</h2>
              <p className="text-3xl text-gray-300">Bizning ustunliklar</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-4">Mahsulot Tayyor</h3>
                <p className="text-xl text-gray-300">
                  Ishlayotgan front-end va back-end, Fulfillment kalkulyatori, 
                  ROI kalkulyatori, AI Manager, monitoring
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <Brain className="w-16 h-16 text-blue-400 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-4">AI-First Operatsiya</h3>
                <p className="text-xl text-gray-300">
                  Har bir marketplace menejer o'rniga – AI + 1-2 kuchli operator. 
                  Xarajat kamayadi, sifat oshadi
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <Target className="w-16 h-16 text-purple-400 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-4">Sifatli Hamkorlar Fokus</h3>
                <p className="text-xl text-gray-300">
                  O'zbekistonda faqat 20-30 ta sifatli hamkor, 
                  chuqur hamkorlik va "profit sharing" modeli
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <Globe className="w-16 h-16 text-green-400 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-4">Region Tushunchasi</h3>
                <p className="text-xl text-gray-300">
                  O'zbekiston bozoridan boshlaymiz, keyin KZ va RU ga 
                  ko'chirish strategiyasi aniq
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 10: INVESTITSIYA
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
                    <div className="text-6xl font-black text-yellow-400 mb-2">$250K-$300K</div>
                    <div className="text-xl text-gray-300">So'ralayotgan investitsiya</div>
                  </div>
                  <div className="text-center pt-4 border-t border-white/20">
                    <div className="text-4xl font-black text-white mb-2">~10%</div>
                    <div className="text-xl text-gray-300">Equity</div>
                    <div className="text-sm text-gray-400 mt-2">Post-money: $2.5-3.0M</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Use of Funds (18 oy)</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2 text-lg">
                      <span className="text-gray-300">Ombor + Jihozlash</span>
                      <span className="text-white font-bold">40%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 w-[40%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-lg">
                      <span className="text-gray-300">Jamoa (18 oy)</span>
                      <span className="text-white font-bold">35%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[35%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-lg">
                      <span className="text-gray-300">Marketing</span>
                      <span className="text-white font-bold">15%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 w-[15%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-lg">
                      <span className="text-gray-300">Operatsion</span>
                      <span className="text-white font-bold">10%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 w-[10%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8">
              <h3 className="text-3xl font-bold text-white mb-4 text-center">Maqsad</h3>
              <div className="grid grid-cols-3 gap-6 text-center text-white">
                <div>
                  <div className="text-4xl font-black mb-2">6-9 oy</div>
                  <div className="text-lg">Breakeven</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">13-16</div>
                  <div className="text-lg">Hamkor (nol nuqta)</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">20-30</div>
                  <div className="text-lg">Hamkor (barqaror foyda)</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20 text-center">
                <p className="text-xl text-white italic">
                  "Biz O'zbekistonda ishlaydigan, AI bilan boshqariladigan fulfillment modelini qurib, 
                  keyin uni butun mintaqaga – Qozog'iston va Rossiyaga skeyllamoqchimiz"
                </p>
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
      {/* Current Slide */}
      {slides[currentSlide].content}

      {/* Navigation - FIXED BOTTOM, KONTENT USTIGA TUSHMASIN */}
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

      {/* Exit Button */}
      <button
        onClick={() => setLocation('/')}
        className="fixed top-8 right-8 bg-black/50 backdrop-blur-lg rounded-full p-3 border border-white/20 hover:bg-black/70 z-50"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
