import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Lock, Eye, EyeOff, Shield, CheckCircle, TrendingUp, DollarSign, Users, Zap, Target, BarChart3, Rocket, AlertCircle, Package, Globe, Award, Brain, Clock, X, TrendingDown, Layers, ShoppingCart, Warehouse } from 'lucide-react';
import { useLocation } from 'wouter';

export default function FinalInvestorPitch() {
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
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900 p-12">
          <div className="text-center max-w-6xl">
            {/* Badge */}
            <div className="inline-block px-6 py-2 bg-green-500/20 border border-green-500/50 rounded-full mb-8">
              <span className="text-green-400 font-bold text-xl">💰 INVESTITSIYA: $500K-$1M</span>
            </div>
            
            {/* Logo va Nom */}
            <h1 className="text-8xl font-black text-white mb-6">
              Seller<span className="text-blue-400">Cloud</span><span className="text-green-400">X</span>
            </h1>
            
            {/* Tagline */}
            <p className="text-4xl text-blue-300 font-bold mb-12">
              Marketplace Sellerlar uchun AI Platforma
            </p>
            
            {/* 3 ta Asosiy Metrika */}
            <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-6xl font-black text-green-400 mb-3">$84M</div>
                <div className="text-xl text-gray-300">ARR (3-yil)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-6xl font-black text-blue-400 mb-3">20K+</div>
                <div className="text-xl text-gray-300">Mijozlar</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-6xl font-black text-purple-400 mb-3">100%</div>
                <div className="text-xl text-gray-300">Tayyor</div>
              </div>
            </div>
            
            {/* Status */}
            <div className="mt-12 flex justify-center gap-4">
              <div className="px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-full">
                <span className="text-green-400 font-semibold text-lg">✓ Production Ready</span>
              </div>
              <div className="px-6 py-3 bg-blue-500/20 border border-blue-500/50 rounded-full">
                <span className="text-blue-400 font-semibold text-lg">✓ 41,842 Qator Kod</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: MUAMMO
    {
      id: 'problem',
      content: (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-red-900 via-slate-900 to-red-900 p-12">
          <div className="max-w-6xl mx-auto w-full">
            {/* Sarlavha */}
            <div className="text-center mb-12">
              <h2 className="text-7xl font-black text-red-400 mb-4">Muammo</h2>
              <p className="text-3xl text-gray-300">50,000+ seller O'zbekistonda kurashmoqda</p>
            </div>
            
            {/* 3 ta Asosiy Muammo */}
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-8 text-center">
                <Clock className="w-20 h-20 text-red-400 mx-auto mb-6" />
                <div className="text-5xl font-black text-white mb-4">16 soat</div>
                <div className="text-2xl text-gray-300">Kunlik qo'lda ish</div>
                <div className="text-lg text-gray-400 mt-4">Listing, narx, buyurtma - hammasi qo'lda</div>
              </div>
              
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-8 text-center">
                <DollarSign className="w-20 h-20 text-red-400 mx-auto mb-6" />
                <div className="text-5xl font-black text-white mb-4">Yuqori</div>
                <div className="text-2xl text-gray-300">HR va inventar xarajati</div>
                <div className="text-lg text-gray-400 mt-4">Xodimlar, ombor, logistika - qimmat</div>
              </div>
              
              <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-8 text-center">
                <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
                <div className="text-5xl font-black text-white mb-4">Yuqori</div>
                <div className="text-2xl text-gray-300">Risk va xatolar</div>
                <div className="text-lg text-gray-400 mt-4">Noto'g'ri qaror, yo'qotilgan foyda</div>
              </div>
            </div>
            
            {/* Natija */}
            <div className="mt-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 text-center">
              <p className="text-3xl font-bold text-white">
                ❌ Savdo o'sadi, lekin foyda kamayadi • ❌ Vaqt yo'qotiladi • ❌ Raqobatda yutqaziladi
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 3: YECHIM - SaaS AI Manager
    {
      id: 'solution',
      content: (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-green-900 via-slate-900 to-green-900 p-12">
          <div className="max-w-6xl mx-auto w-full">
            {/* Sarlavha */}
            <div className="text-center mb-12">
              <h2 className="text-7xl font-black text-green-400 mb-4">Yechim</h2>
              <p className="text-3xl text-gray-300">AI bilan 70% avtomatlashtirish</p>
            </div>
            
            {/* Asosiy Taklif */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-3xl p-10 border border-green-500/30 mb-10 text-center">
              <h3 className="text-5xl font-black text-white mb-4">
                SaaS AI Manager Platform
              </h3>
              <p className="text-2xl text-gray-300">
                Risksiz • Kam xarajat • Tez boshlash • Global scalable
              </p>
            </div>
            
            {/* 4 ta Asosiy Xususiyat */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">AI Avtomatlashtirish</div>
                <div className="text-lg text-gray-400">Listing, narx, SEO</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">Tez Boshlash</div>
                <div className="text-lg text-gray-400">1 kun ichida</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                <DollarSign className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">Kam Xarajat</div>
                <div className="text-lg text-gray-400">HR va inventar yo'q</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                <Globe className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">Global</div>
                <div className="text-lg text-gray-400">Istalgan joydan</div>
              </div>
            </div>
            
            {/* Natija */}
            <div className="mt-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-center">
              <p className="text-3xl font-bold text-white">
                ✓ 14 soat/kun tejash • ✓ 40% foyda oshirish • ✓ Risksiz o'sish
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: QANDAY ISHLAYDI
    {
      id: 'how-it-works',
      content: (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 p-12">
          <div className="max-w-6xl mx-auto w-full">
            {/* Sarlavha */}
            <div className="text-center mb-12">
              <h2 className="text-7xl font-black text-blue-400 mb-4">Qanday Ishlaydi?</h2>
              <p className="text-3xl text-gray-300">4 ta oddiy qadam</p>
            </div>
            
            {/* 4 Qadam */}
            <div className="grid grid-cols-4 gap-6">
              <div className="relative">
                <div className="bg-blue-500/20 border-2 border-blue-500 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">1</div>
                  <ShoppingCart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-3">Ro'yxatdan o'ting</div>
                  <div className="text-lg text-gray-400">1 daqiqa ichida</div>
                </div>
                {/* Arrow */}
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-blue-400 text-4xl">→</div>
              </div>
              
              <div className="relative">
                <div className="bg-purple-500/20 border-2 border-purple-500 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">2</div>
                  <Layers className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-3">Marketplace ulang</div>
                  <div className="text-lg text-gray-400">1-klik integratsiya</div>
                </div>
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-purple-400 text-4xl">→</div>
              </div>
              
              <div className="relative">
                <div className="bg-green-500/20 border-2 border-green-500 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">3</div>
                  <Brain className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-3">AI ishga tushadi</div>
                  <div className="text-lg text-gray-400">Avtomatik boshqarish</div>
                </div>
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-green-400 text-4xl">→</div>
              </div>
              
              <div>
                <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-6">4</div>
                  <TrendingUp className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-white mb-3">Foyda oling</div>
                  <div className="text-lg text-gray-400">O'sish va kuzatish</div>
                </div>
              </div>
            </div>
            
            {/* Qo'shimcha Ma'lumot */}
            <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
              <p className="text-2xl text-white font-semibold">
                ⚡ 1 kun ichida ishga tushiring • 🤖 AI hammani boshqaradi • 📈 Real-time natijalar
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 5: PLATFORM DEMO (Skrinshotlar)
    {
      id: 'platform',
      content: (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 p-12">
          <div className="max-w-6xl mx-auto w-full">
            {/* Sarlavha */}
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-purple-400 mb-4">Platform Demo</h2>
              <p className="text-3xl text-gray-300">100% tayyor, ishlab turgan platforma</p>
            </div>
            
            {/* Platform Metrikalari */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                <div className="text-4xl font-black text-blue-400">41,842</div>
                <div className="text-sm text-gray-400">Qator Kod</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                <div className="text-4xl font-black text-purple-400">37</div>
                <div className="text-sm text-gray-400">Database Jadval</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                <div className="text-4xl font-black text-green-400">50+</div>
                <div className="text-sm text-gray-400">API Endpoint</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
                <div className="text-4xl font-black text-yellow-400">5</div>
                <div className="text-sm text-gray-400">Marketplace</div>
              </div>
            </div>
            
            {/* Screenshot Placeholder */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-3xl p-6 border border-blue-500/30">
                <div className="bg-slate-800 rounded-2xl p-4 mb-4 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-2" />
                    <div className="text-xl text-white font-bold">Partner Dashboard</div>
                    <div className="text-sm text-gray-400">Real-time statistika</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Barcha marketplace bitta joyda</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Real-time savdo va foyda</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>AI tavsiyalar va trendlar</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/30">
                <div className="bg-slate-800 rounded-2xl p-4 mb-4 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                    <div className="text-xl text-white font-bold">AI Manager</div>
                    <div className="text-sm text-gray-400">Avtomatik optimizatsiya</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Avtomatik narx optimizatsiya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>SEO va kontent yaratish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Trend tahlili va prognoz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 6: TARIFLAR - SaaS (ASOSIY)
    {
      id: 'pricing-saas',
      content: (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-green-900 p-12">
          <div className="max-w-6xl mx-auto w-full">
            {/* Sarlavha */}
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-blue-400 mb-4">SaaS Tariflar</h2>
              <p className="text-3xl text-gray-300">Minglab seller uchun • Asosiy biznes model</p>
            </div>
            
            {/* 2 ta Tarif */}
            <div className="grid grid-cols-2 gap-8">
              {/* AI Starter */}
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-blue-500">
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-1 bg-blue-500/30 rounded-full text-sm font-bold text-blue-300 mb-4">
                    YANGI SELLERLAR UCHUN
                  </div>
                  <h3 className="text-4xl font-black text-white mb-2">AI Starter</h3>
                  <div className="text-6xl font-black text-blue-400 mb-2">$349</div>
                  <div className="text-xl text-gray-400">oyiga + 1.5% savdo</div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">100 SKU (mahsulot)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">2 ta marketplace</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">AI listing va SEO</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">Narx monitoring</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">Basic analytics</span>
                  </div>
                </div>
                
                <div className="bg-blue-500/20 rounded-2xl p-4 text-center">
                  <div className="text-sm text-blue-300 font-semibold">Ideal: Yangi biznes, offline→online</div>
                </div>
              </div>
              
              {/* AI Manager Pro */}
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-purple-500 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                  <span className="text-sm font-black text-white">⭐ MASHHUR</span>
                </div>
                
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-1 bg-purple-500/30 rounded-full text-sm font-bold text-purple-300 mb-4">
                    O'SUVCHI BIZNES UCHUN
                  </div>
                  <h3 className="text-4xl font-black text-white mb-2">AI Manager Pro</h3>
                  <div className="text-6xl font-black text-purple-400 mb-2">$899</div>
                  <div className="text-xl text-gray-400">oyiga + 1% savdo</div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">250 SKU (mahsulot)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">Cheksiz marketplace</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">FULL AI + Trend Hunter</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">Sof foyda tahlili</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-300">Priority support</span>
                  </div>
                </div>
                
                <div className="bg-purple-500/20 rounded-2xl p-4 text-center">
                  <div className="text-sm text-purple-300 font-semibold">Ideal: Mavjud seller, o'sish istagi</div>
                </div>
              </div>
            </div>
            
            {/* Qo'shimcha */}
            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
              <p className="text-2xl text-white font-semibold">
                🌍 Global scalable • 💰 Kam xarajat • 🚀 Tez boshlash • ✅ Risksiz
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: TARIFLAR - Fulfillment (QO'SHIMCHA)
    {
      id: 'pricing-fulfillment',
      content: (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-orange-900 via-slate-900 to-red-900 p-12">
          <div className="max-w-6xl mx-auto w-full">
            {/* Sarlavha */}
            <div className="text-center mb-6">
              <h2 className="text-6xl font-black text-orange-400 mb-3">Fulfillment Tariflar</h2>
              <p className="text-2xl text-gray-300">30-50 ta o'suvchi hamkor uchun • Premium xizmat</p>
            </div>
            
            {/* 4 ta Tarif (Kichikroq) */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-500/10 border border-blue-500 rounded-2xl p-4">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-white mb-1">Starter Pro</h3>
                  <div className="text-3xl font-black text-blue-400">3M</div>
                  <div className="text-sm text-gray-400">so'm/oy</div>
                  <div className="text-lg text-orange-400 font-bold mt-1">+50% foyda</div>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>1 marketplace</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>100 SKU</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>AI Manager BEPUL</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Fulfillment to'liq</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500 rounded-2xl p-4">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-white mb-1">Business</h3>
                  <div className="text-3xl font-black text-purple-400">8M</div>
                  <div className="text-sm text-gray-400">so'm/oy</div>
                  <div className="text-lg text-orange-400 font-bold mt-1">+25% foyda</div>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>2 marketplace</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>500 SKU</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>AI + Trend Hunter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Premium fulfillment</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-500/10 border border-green-500 rounded-2xl p-4">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-white mb-1">Professional</h3>
                  <div className="text-3xl font-black text-green-400">18M</div>
                  <div className="text-sm text-gray-400">so'm/oy</div>
                  <div className="text-lg text-orange-400 font-bold mt-1">+15% foyda</div>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>4 marketplace</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>2000 SKU</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Custom AI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Dedicated manager</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500 rounded-2xl p-4">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-white mb-1">Enterprise</h3>
                  <div className="text-3xl font-black text-yellow-400">25M</div>
                  <div className="text-sm text-gray-400">so'm/oy</div>
                  <div className="text-lg text-orange-400 font-bold mt-1">+10% foyda</div>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Barcha marketplace</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Cheksiz SKU</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>Enterprise AI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span>VIP xizmat</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fulfillment Xizmatlari */}
            <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Fulfillment Xizmatlari</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <Warehouse className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-300">Qabul va saqlash</div>
                </div>
                <div>
                  <Package className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-300">Qadoqlash</div>
                </div>
                <div>
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-300">Sifat nazorati</div>
                </div>
                <div>
                  <Rocket className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-300">Marketplace'ga yetkazish</div>
                </div>
              </div>
            </div>
            
            {/* Qo'shimcha */}
            <div className="mt-4 bg-orange-500/20 rounded-2xl p-4 border border-orange-500/50 text-center">
              <p className="text-lg text-white font-semibold">
                🏢 To'liq xizmat • 🤖 AI Manager BEPUL • 📦 Premium fulfillment • 👨‍💼 Dedicated support
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 8: BOZOR
    {
      id: 'market',
      content: (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-green-900 via-slate-900 to-blue-900 p-12">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-green-400 mb-4">Bozor Imkoniyati</h2>
              <p className="text-3xl text-gray-300">O'zbekiston → Global kengayish</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">O'zbekiston (Boshlang'ich)</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-black text-blue-400 mb-2">50,000+</div>
                    <div className="text-xl text-gray-300">Faol seller</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-green-400 mb-2">$2B+</div>
                    <div className="text-xl text-gray-300">E-commerce bozor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-purple-400 mb-2">40%</div>
                    <div className="text-xl text-gray-300">Yillik o'sish</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Global (Kengayish)</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-black text-purple-400 mb-2">100M+</div>
                    <div className="text-xl text-gray-300">Global seller</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-green-400 mb-2">$5T+</div>
                    <div className="text-xl text-gray-300">Global e-commerce</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-yellow-400 mb-2">∞</div>
                    <div className="text-xl text-gray-300">SaaS scalable</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">5 ta Marketplace</h3>
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="bg-blue-500/20 rounded-2xl p-4 mb-2">
                    <ShoppingCart className="w-12 h-12 text-blue-400 mx-auto" />
                  </div>
                  <div className="text-sm text-white font-semibold">Uzum</div>
                </div>
                <div className="text-center">
                  <div className="bg-purple-500/20 rounded-2xl p-4 mb-2">
                    <ShoppingCart className="w-12 h-12 text-purple-400 mx-auto" />
                  </div>
                  <div className="text-sm text-white font-semibold">Wildberries</div>
                </div>
                <div className="text-center">
                  <div className="bg-green-500/20 rounded-2xl p-4 mb-2">
                    <ShoppingCart className="w-12 h-12 text-green-400 mx-auto" />
                  </div>
                  <div className="text-sm text-white font-semibold">Yandex</div>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-500/20 rounded-2xl p-4 mb-2">
                    <ShoppingCart className="w-12 h-12 text-yellow-400 mx-auto" />
                  </div>
                  <div className="text-sm text-white font-semibold">Ozon</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-500/20 rounded-2xl p-4 mb-2">
                    <ShoppingCart className="w-12 h-12 text-red-400 mx-auto" />
                  </div>
                  <div className="text-sm text-white font-semibold">AliExpress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 9: MOLIYAVIY PROYEKSIYA
    {
      id: 'financials',
      content: (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-yellow-900 via-slate-900 to-green-900 p-12">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-7xl font-black text-yellow-400 mb-4">3 Yillik Proyeksiya</h2>
              <p className="text-3xl text-gray-300">SaaS fokus • $4M → $84M ARR</p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-500/10 border-2 border-blue-500 rounded-3xl p-6">
                <div className="text-center">
                  <div className="text-sm text-blue-400 font-bold mb-2">YIL 1 (2025)</div>
                  <div className="text-5xl font-black text-white mb-4">$4.4M</div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>SaaS:</span>
                      <span className="text-white font-bold">1,000 × $349</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fulfillment:</span>
                      <span className="text-white font-bold">30 hamkor</span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-2">
                      <span>ARR:</span>
                      <span className="text-green-400 font-bold">$4.4M</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-500/10 border-2 border-purple-500 rounded-3xl p-6">
                <div className="text-center">
                  <div className="text-sm text-purple-400 font-bold mb-2">YIL 2 (2026)</div>
                  <div className="text-5xl font-black text-white mb-4">$21.4M</div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>SaaS:</span>
                      <span className="text-white font-bold">5,000 × $349</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fulfillment:</span>
                      <span className="text-white font-bold">50 hamkor</span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-2">
                      <span>ARR:</span>
                      <span className="text-green-400 font-bold">$21.4M</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-500/10 border-2 border-green-500 rounded-3xl p-6">
                <div className="text-center">
                  <div className="text-sm text-green-400 font-bold mb-2">YIL 3 (2027)</div>
                  <div className="text-5xl font-black text-white mb-4">$84.1M</div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>SaaS:</span>
                      <span className="text-white font-bold">20,000 × $349</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fulfillment:</span>
                      <span className="text-white font-bold">50 hamkor</span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-2">
                      <span>ARR:</span>
                      <span className="text-green-400 font-bold">$84.1M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Asosiy Ko'rsatkichlar</h3>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-4xl font-black text-white mb-2">90%</div>
                  <div className="text-sm text-green-100">SaaS fokus</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-white mb-2">85%</div>
                  <div className="text-sm text-green-100">Gross margin</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-white mb-2">$349</div>
                  <div className="text-sm text-green-100">ARPU (oylik)</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-white mb-2">20K</div>
                  <div className="text-sm text-green-100">Mijozlar (Y3)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 10: INVESTITSIYA TAKLIFI
    {
      id: 'investment',
      content: (
        <div className="h-screen flex flex-col justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 p-12">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-8xl font-black mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Investitsiya Taklifi
                </span>
              </h2>
              <p className="text-3xl text-gray-300">O'zbekiston e-commerce'ni o'zgartiring</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Seed Round</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl">
                    <span className="text-xl text-gray-300">Miqdor</span>
                    <span className="text-4xl font-black text-yellow-400">$500K-$1M</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl">
                    <span className="text-xl text-gray-300">Valuation</span>
                    <span className="text-2xl font-bold text-white">$5M pre-money</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl">
                    <span className="text-xl text-gray-300">Equity</span>
                    <span className="text-2xl font-bold text-white">10-20%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Foydalanish</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg text-gray-300">Marketing (SaaS)</span>
                      <span className="text-white font-bold">40%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 w-[40%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg text-gray-300">Mahsulot</span>
                      <span className="text-white font-bold">30%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[30%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg text-gray-300">Jamoa</span>
                      <span className="text-white font-bold">20%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 w-[20%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg text-gray-300">Operatsiya</span>
                      <span className="text-white font-bold">10%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 w-[10%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Milestone'lar</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-lg font-bold text-white">6 oy</div>
                      <div className="text-sm text-gray-400">1,000 SaaS, break-even</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="text-lg font-bold text-white">12 oy</div>
                      <div className="text-sm text-gray-400">3,000 SaaS, Series A tayyor</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-lg font-bold text-white">24 oy</div>
                      <div className="text-sm text-gray-400">10,000 SaaS, global kengayish</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-4 text-center">ROI Proyeksiyasi</h3>
                <div className="text-center">
                  <div className="text-7xl font-black text-white mb-2">16,800%</div>
                  <div className="text-2xl text-green-100 mb-4">3 yilda</div>
                  <div className="text-lg text-white/80">$500K → $84M (10% equity)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Navigation
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

  // Password Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              SellerCloud<span className="text-blue-400">X</span>
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

  // Main Pitch
  return (
    <div className="relative">
      {/* Current Slide */}
      {slides[currentSlide].content}

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
        <Button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 disabled:opacity-30"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
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
        
        <Button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 disabled:opacity-30"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        <div className="ml-4 text-sm text-white">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Exit */}
      <button
        onClick={() => setLocation('/')}
        className="fixed top-8 right-8 bg-black/50 backdrop-blur-lg rounded-full p-3 border border-white/20 hover:bg-black/70"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
