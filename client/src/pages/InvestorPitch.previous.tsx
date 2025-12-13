import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Lock, Eye, EyeOff, Shield, CheckCircle, TrendingUp, DollarSign, Users, Zap, Target, BarChart3, Rocket, AlertCircle, Package, Globe, Award, Brain, Clock, Crown, Star, X } from 'lucide-react';
import { useLocation } from 'wouter';

export default function NewInvestorPitch() {
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
      setError('Incorrect password! Please try again.');
      setPassword('');
    }
  };

  const slides = [
    // SLIDE 1: TITLE - Airbnb Style
    {
      id: 'title',
      content: (
        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-12">
          <div className="text-center space-y-8 max-w-5xl">
            {/* Seed Round Badge */}
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-sm font-bold shadow-lg animate-pulse">
              💰 SEED ROUND: $500K-$1M
            </div>
            
            {/* Company Name */}
            <h1 className="text-8xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
                SellerCloudX
              </span>
            </h1>
            
            {/* Tagline */}
            <p className="text-3xl font-bold text-blue-300">
              AI-Powered Marketplace Automation for Uzbekistan
            </p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-black text-green-400">$54M</div>
                <div className="text-sm text-gray-400 mt-2">ARR Year 3</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-black text-blue-400">100%</div>
                <div className="text-sm text-gray-400 mt-2">Ready</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-black text-purple-400">71:1</div>
                <div className="text-sm text-gray-400 mt-2">LTV:CAC</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-black text-yellow-400">41K</div>
                <div className="text-sm text-gray-400 mt-2">Lines Code</div>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Production Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-400">5 Marketplaces</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: PROBLEM - Uber Style
    {
      id: 'problem',
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-red-900 via-slate-900 to-slate-900 text-white p-12">
          <div className="mb-8">
            <h2 className="text-6xl font-black text-red-400 mb-4">The Problem</h2>
            <p className="text-2xl text-gray-300">50,000+ sellers in Uzbekistan losing 30% profit to operational chaos</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* Pain Point 1 */}
            <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="bg-red-500/20 p-4 rounded-2xl">
                  <Clock className="w-12 h-12 text-red-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-red-400 mb-3">16 Hours/Day</h3>
                  <p className="text-lg text-gray-300">Manual work managing inventory, processing orders, updating listings across 5+ platforms</p>
                </div>
              </div>
            </div>
            
            {/* Pain Point 2 */}
            <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="bg-red-500/20 p-4 rounded-2xl">
                  <TrendingUp className="w-12 h-12 text-red-400 rotate-180" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-red-400 mb-3">30% Revenue Lost</h3>
                  <p className="text-lg text-gray-300">Stockouts, pricing errors, fulfillment mistakes cost sellers nearly a third of potential revenue</p>
                </div>
              </div>
            </div>
            
            {/* Pain Point 3 */}
            <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="bg-red-500/20 p-4 rounded-2xl">
                  <Package className="w-12 h-12 text-red-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-red-400 mb-3">5+ Platforms, Zero Integration</h3>
                  <p className="text-lg text-gray-300">Uzum, Wildberries, Yandex, Ozon, AliExpress - each with different rules, no unified system</p>
                </div>
              </div>
            </div>
            
            {/* Result Box */}
            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-8 flex flex-col justify-center">
              <h3 className="text-4xl font-black text-white mb-6">THE RESULT:</h3>
              <div className="space-y-3 text-xl text-white">
                <p className="flex items-center gap-3">❌ Revenue grows, profit shrinks</p>
                <p className="flex items-center gap-3">❌ Burnout and mistakes increase</p>
                <p className="flex items-center gap-3">❌ Can't scale without hiring</p>
                <p className="flex items-center gap-3">❌ Losing to better-operated competitors</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 3: SOLUTION - Stripe Style  
    {
      id: 'solution',
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white p-12">
          <div className="mb-8">
            <h2 className="text-6xl font-black text-green-400 mb-4">Our Solution</h2>
            <p className="text-2xl text-gray-300">AI-powered platform automating 70% of fulfillment & marketplace operations</p>
          </div>
          
          {/* Main Value Prop */}
          <div className="bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 mb-6">
            <h3 className="text-4xl font-black text-white text-center mb-4">
              One Platform. Infinite Scale.
            </h3>
            <p className="text-xl text-gray-300 text-center">
              SellerCloudX = Fulfillment + AI Marketplace Operator
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="bg-green-500/10 border-2 border-green-500 rounded-3xl p-8 backdrop-blur-sm">
              <div className="bg-green-500/20 p-4 rounded-2xl w-fit mb-4">
                <Zap className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-green-400 mb-3">70% Automation</h3>
              <p className="text-lg text-gray-300">AI handles product listing, pricing optimization, inventory management, and SEO automatically</p>
              <div className="mt-4 text-sm text-green-400 font-semibold">
                Save 14 hours/day →
              </div>
            </div>
            
            <div className="bg-blue-500/10 border-2 border-blue-500 rounded-3xl p-8 backdrop-blur-sm">
              <div className="bg-blue-500/20 p-4 rounded-2xl w-fit mb-4">
                <Globe className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-blue-400 mb-3">Multi-Marketplace</h3>
              <p className="text-lg text-gray-300">Manage 5+ platforms from one dashboard with real-time sync across all marketplaces</p>
              <div className="mt-4 text-sm text-blue-400 font-semibold">
                5 platforms, 1 system →
              </div>
            </div>
            
            <div className="bg-purple-500/10 border-2 border-purple-500 rounded-3xl p-8 backdrop-blur-sm">
              <div className="bg-purple-500/20 p-4 rounded-2xl w-fit mb-4">
                <Brain className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-purple-400 mb-3">AI Optimization</h3>
              <p className="text-lg text-gray-300">Smart pricing, SEO optimization, content generation, and predictive analytics powered by AI</p>
              <div className="mt-4 text-sm text-purple-400 font-semibold">
                3x revenue growth →
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 flex flex-col justify-center">
              <h3 className="text-4xl font-black text-white mb-6">THE RESULT:</h3>
              <div className="space-y-3 text-xl text-white">
                <p className="flex items-center gap-3">✅ Save 14 hours/day</p>
                <p className="flex items-center gap-3">✅ 3x revenue growth</p>
                <p className="flex items-center gap-3">✅ 40% profit increase</p>
                <p className="flex items-center gap-3">✅ Scale infinitely</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: PLATFORM - Notion Style
    {
      id: 'platform',
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-12">
          <div className="mb-8">
            <h2 className="text-6xl font-black text-blue-400 mb-4">100% Production Ready</h2>
            <p className="text-2xl text-gray-300">Not a prototype. Not an MVP. A fully functional platform.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-500/10 border-2 border-blue-500 rounded-3xl p-6 text-center">
              <div className="text-5xl font-black text-blue-400 mb-2">41,842</div>
              <div className="text-lg text-gray-300">Lines of Production Code</div>
            </div>
            <div className="bg-purple-500/10 border-2 border-purple-500 rounded-3xl p-6 text-center">
              <div className="text-5xl font-black text-purple-400 mb-2">37</div>
              <div className="text-lg text-gray-300">Database Tables</div>
            </div>
            <div className="bg-green-500/10 border-2 border-green-500 rounded-3xl p-6 text-center">
              <div className="text-5xl font-black text-green-400 mb-2">50+</div>
              <div className="text-lg text-gray-300">API Endpoints</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Tech Stack</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Backend</span>
                  <span className="text-blue-400 font-semibold">Express.js + TypeScript</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Frontend</span>
                  <span className="text-blue-400 font-semibold">React 18 + TypeScript</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Database</span>
                  <span className="text-blue-400 font-semibold">SQLite + Drizzle ORM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">AI</span>
                  <span className="text-blue-400 font-semibold">Anthropic + Replicate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Deploy</span>
                  <span className="text-blue-400 font-semibold">Railway + Docker</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Features Complete</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">5 Marketplace Integrations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">AI Services (SEO, Pricing, Content)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Real-time Analytics Dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Automated Order Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Inventory Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Multi-language Support (3 languages)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">5-tier Referral System</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 text-center">
            <p className="text-xl text-white font-semibold">
              ✅ Deployed on Railway • ✅ Health Monitoring Active • ✅ Ready to Scale
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 5: MARKET - Sequoia Style
    {
      id: 'market',
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-12">
          <div className="mb-8">
            <h2 className="text-6xl font-black text-purple-400 mb-4">$2B+ Market Opportunity</h2>
            <p className="text-2xl text-gray-300">Uzbekistan's e-commerce market growing 40% YoY</p>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-500/10 border-2 border-purple-500 rounded-3xl p-8 text-center">
              <div className="text-sm text-purple-400 font-semibold mb-2">TAM</div>
              <div className="text-5xl font-black text-purple-400 mb-2">$2B+</div>
              <div className="text-gray-300">Total Addressable Market</div>
              <div className="text-sm text-gray-400 mt-2">Uzbekistan E-commerce</div>
            </div>
            <div className="bg-blue-500/10 border-2 border-blue-500 rounded-3xl p-8 text-center">
              <div className="text-sm text-blue-400 font-semibold mb-2">SAM</div>
              <div className="text-5xl font-black text-blue-400 mb-2">50K+</div>
              <div className="text-gray-300">Serviceable Available Market</div>
              <div className="text-sm text-gray-400 mt-2">Active Marketplace Sellers</div>
            </div>
            <div className="bg-green-500/10 border-2 border-green-500 rounded-3xl p-8 text-center">
              <div className="text-sm text-green-400 font-semibold mb-2">SOM</div>
              <div className="text-5xl font-black text-green-400 mb-2">10K+</div>
              <div className="text-gray-300">Serviceable Obtainable Market</div>
              <div className="text-sm text-gray-400 mt-2">Sellers Needing Fulfillment</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">5 Major Marketplaces</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-lg text-white font-semibold">Uzum Market</span>
                  <span className="text-green-400 text-sm">Fastest Growing</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-lg text-white font-semibold">Wildberries</span>
                  <span className="text-blue-400 text-sm">Russian Giant</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-lg text-white font-semibold">Yandex Market</span>
                  <span className="text-purple-400 text-sm">Established</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-lg text-white font-semibold">Ozon</span>
                  <span className="text-yellow-400 text-sm">Expanding</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-lg text-white font-semibold">AliExpress</span>
                  <span className="text-red-400 text-sm">International</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Market Drivers</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <span className="text-lg font-semibold text-white">40% YoY Growth</span>
                  </div>
                  <p className="text-gray-400 text-sm">E-commerce exploding in Uzbekistan</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-blue-400" />
                    <span className="text-lg font-semibold text-white">50,000+ Sellers</span>
                  </div>
                  <p className="text-gray-400 text-sm">Growing seller base needs solutions</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-6 h-6 text-purple-400" />
                    <span className="text-lg font-semibold text-white">Marketplace Dominance</span>
                  </div>
                  <p className="text-gray-400 text-sm">Marketplaces becoming primary sales channel</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Rocket className="w-6 h-6 text-yellow-400" />
                    <span className="text-lg font-semibold text-white">Government Support</span>
                  </div>
                  <p className="text-gray-400 text-sm">Digital economy initiatives driving growth</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 text-center">
            <p className="text-xl text-white font-semibold">
              🎯 Target: 1,000+ sellers by Year 3 (10% of SOM)
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 6: BUSINESS MODEL
    {
      id: 'business-model',
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white p-12">
          <div className="mb-8">
            <h2 className="text-6xl font-black text-green-400 mb-4">Business Model</h2>
            <p className="text-2xl text-gray-300">Dual revenue streams: Subscription + Profit Share</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 flex-1">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-6">Subscription Tiers</h3>
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl font-bold text-blue-400">Starter Pro</span>
                    <span className="text-3xl font-black text-white">$99<span className="text-lg text-gray-400">/mo</span></span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• 25% profit share</p>
                    <p>• 100kg warehouse</p>
                    <p>• Basic AI features</p>
                  </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl font-bold text-purple-400">Business Plus</span>
                    <span className="text-3xl font-black text-white">$299<span className="text-lg text-gray-400">/mo</span></span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• 20% profit share</p>
                    <p>• 500kg warehouse</p>
                    <p>• Advanced AI</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl font-bold text-yellow-400">Enterprise Elite</span>
                    <span className="text-3xl font-black text-white">$799<span className="text-lg text-gray-400">/mo</span></span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• 15% profit share</p>
                    <p>• 2000kg warehouse</p>
                    <p>• Premium AI</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <h3 className="text-3xl font-bold text-white mb-6">Revenue Breakdown</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Subscription (avg)</span>
                      <span className="text-2xl font-bold text-green-400">$250/mo</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 w-[30%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Profit Share (avg)</span>
                      <span className="text-2xl font-bold text-blue-400">$2,000/mo</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[70%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Average Revenue Per Partner</h3>
                <div className="text-6xl font-black text-white mb-2">$2,250</div>
                <div className="text-xl text-green-100">per month ($27K/year)</div>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-white/80">Based on avg seller GMV of $50K/month with 20% profit margin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: UNIT ECONOMICS
    {
      id: 'unit-economics',
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900 text-white p-12">
          <div className="mb-8">
            <h2 className="text-6xl font-black text-yellow-400 mb-4">Unit Economics</h2>
            <p className="text-2xl text-gray-300">10-20x better than industry standard</p>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-green-500/10 border-2 border-green-500 rounded-3xl p-8 text-center">
              <div className="text-sm text-green-400 font-semibold mb-2">LTV</div>
              <div className="text-5xl font-black text-green-400 mb-2">$81K</div>
              <div className="text-gray-300">Lifetime Value</div>
              <div className="text-sm text-gray-400 mt-2">36-month lifetime</div>
            </div>
            <div className="bg-blue-500/10 border-2 border-blue-500 rounded-3xl p-8 text-center">
              <div className="text-sm text-blue-400 font-semibold mb-2">CAC</div>
              <div className="text-5xl font-black text-blue-400 mb-2">$245</div>
              <div className="text-gray-300">Customer Acquisition Cost</div>
              <div className="text-sm text-gray-400 mt-2">Decreasing to $245</div>
            </div>
            <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-3xl p-8 text-center">
              <div className="text-sm text-yellow-400 font-semibold mb-2">LTV:CAC</div>
              <div className="text-5xl font-black text-yellow-400 mb-2">331:1</div>
              <div className="text-gray-300">Ratio</div>
              <div className="text-sm text-gray-400 mt-2">Best case scenario</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 flex-1">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Our Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-xl">
                  <span className="text-gray-300">LTV:CAC Ratio</span>
                  <span className="text-2xl font-bold text-green-400">71:1 to 331:1</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-500/10 rounded-xl">
                  <span className="text-gray-300">Payback Period</span>
                  <span className="text-2xl font-bold text-blue-400">0.1-0.5 months</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-500/10 rounded-xl">
                  <span className="text-gray-300">Monthly Churn</span>
                  <span className="text-2xl font-bold text-purple-400">1-5%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-xl">
                  <span className="text-gray-300">Gross Margin</span>
                  <span className="text-2xl font-bold text-yellow-400">72-94%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Industry Standard</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">LTV:CAC Ratio</span>
                  <span className="text-2xl font-bold text-gray-400">3:1 to 5:1</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Payback Period</span>
                  <span className="text-2xl font-bold text-gray-400">6-12 months</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Monthly Churn</span>
                  <span className="text-2xl font-bold text-gray-400">5-10%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Gross Margin</span>
                  <span className="text-2xl font-bold text-gray-400">60-80%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30 text-center">
            <p className="text-2xl text-white font-bold">
              ⭐ We're 10-20x better than industry standard ⭐
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 8: FINANCIALS
    {
      id: 'financials',
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white p-12">
          <div className="mb-8">
            <h2 className="text-6xl font-black text-green-400 mb-4">3-Year Projections</h2>
            <p className="text-2xl text-gray-300">$2.7M → $54M ARR with 72-94% margins</p>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-500/10 border-2 border-blue-500 rounded-3xl p-8">
              <div className="text-sm text-blue-400 font-semibold mb-2">YEAR 1 (2025)</div>
              <div className="text-5xl font-black text-white mb-4">$2.7M</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Partners</span>
                  <span className="text-white font-semibold">100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MRR</span>
                  <span className="text-white font-semibold">$225K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit</span>
                  <span className="text-green-400 font-semibold">$970K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Margin</span>
                  <span className="text-green-400 font-semibold">72%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-500/10 border-2 border-purple-500 rounded-3xl p-8">
              <div className="text-sm text-purple-400 font-semibold mb-2">YEAR 2 (2026)</div>
              <div className="text-5xl font-black text-white mb-4">$13.5M</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Partners</span>
                  <span className="text-white font-semibold">500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MRR</span>
                  <span className="text-white font-semibold">$1.125M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit</span>
                  <span className="text-green-400 font-semibold">$7.29M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Margin</span>
                  <span className="text-green-400 font-semibold">90%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-500/10 border-2 border-green-500 rounded-3xl p-8">
              <div className="text-sm text-green-400 font-semibold mb-2">YEAR 3 (2027)</div>
              <div className="text-5xl font-black text-white mb-4">$54M</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Partners</span>
                  <span className="text-white font-semibold">2,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MRR</span>
                  <span className="text-white font-semibold">$4.5M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit</span>
                  <span className="text-green-400 font-semibold">$36.25M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Margin</span>
                  <span className="text-green-400 font-semibold">94%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 flex-1">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Growth Trajectory</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Year 1</span>
                    <span className="text-blue-400 font-semibold">$2.7M ARR</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-[5%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Year 2</span>
                    <span className="text-purple-400 font-semibold">$13.5M ARR</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 w-[25%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Year 3</span>
                    <span className="text-green-400 font-semibold">$54M ARR</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 w-[100%]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-white mb-6">Key Highlights</h3>
              <div className="space-y-4 text-lg text-white">
                <p className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  Break-even in Month 2
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  Profitable by Month 3
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  400% YoY growth (Y1→Y2)
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  300% YoY growth (Y2→Y3)
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  Margins improve to 94%
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 9: TRACTION
    {
      id: 'traction',
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-12">
          <div className="mb-8">
            <h2 className="text-6xl font-black text-blue-400 mb-4">Traction & Roadmap</h2>
            <p className="text-2xl text-gray-300">Platform 100% ready, launching beta now</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-6">Current Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-lg text-white">41,842 lines of production code</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-lg text-white">100% feature complete</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-lg text-white">5 marketplace integrations ready</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-lg text-white">AI services integrated</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-lg text-white">Deployed on Railway</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-lg text-white">Health monitoring active</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-6">12-Month Roadmap</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <div className="text-sm text-blue-400 font-semibold mb-1">Month 1-2</div>
                  <div className="text-lg text-white font-semibold">Beta Launch</div>
                  <div className="text-sm text-gray-400">10-20 partners, feedback collection</div>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <div className="text-sm text-purple-400 font-semibold mb-1">Month 3-6</div>
                  <div className="text-lg text-white font-semibold">Scale to 50 Partners</div>
                  <div className="text-sm text-gray-400">Product-market fit, iterate</div>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <div className="text-sm text-green-400 font-semibold mb-1">Month 7-12</div>
                  <div className="text-lg text-white font-semibold">Reach 100 Partners</div>
                  <div className="text-sm text-gray-400">$50K MRR, Series A ready</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Why We're Ready</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-blue-400 mb-2">100%</div>
                <div className="text-sm text-gray-300">Platform Complete</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-purple-400 mb-2">$0</div>
                <div className="text-sm text-gray-300">Technical Debt</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-green-400 mb-2">Ready</div>
                <div className="text-sm text-gray-300">To Scale Now</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 10: INVESTMENT ASK
    {
      id: 'investment-ask',
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-12">
          <div className="mb-8 text-center">
            <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4">
              The Ask
            </h2>
            <p className="text-3xl text-gray-300">Join us in transforming Uzbekistan's e-commerce</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30">
              <h3 className="text-3xl font-bold text-white mb-6">Seed Round</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                  <span className="text-gray-300">Amount</span>
                  <span className="text-3xl font-black text-yellow-400">$500K-$1M</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                  <span className="text-gray-300">Valuation</span>
                  <span className="text-2xl font-bold text-white">$5M pre-money</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                  <span className="text-gray-300">Equity</span>
                  <span className="text-2xl font-bold text-white">10-20%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                  <span className="text-gray-300">Type</span>
                  <span className="text-xl font-semibold text-white">Priced Equity</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-6">Use of Funds</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Product Development</span>
                    <span className="text-white font-semibold">30%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-[30%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Marketing & Sales</span>
                    <span className="text-white font-semibold">40%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 w-[40%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Team Expansion</span>
                    <span className="text-white font-semibold">20%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 w-[20%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Operations</span>
                    <span className="text-white font-semibold">10%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 w-[10%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Milestones</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <div className="text-lg font-semibold text-white">6 Months</div>
                    <div className="text-sm text-gray-400">100 partners, $50K MRR, break-even</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <div className="text-lg font-semibold text-white">12 Months</div>
                    <div className="text-sm text-gray-400">300 partners, $150K MRR, Series A ready</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <div className="text-lg font-semibold text-white">24 Months</div>
                    <div className="text-sm text-gray-400">1,000 partners, $500K MRR, regional expansion</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-white mb-4">ROI Projection</h3>
              <div className="text-center mb-6">
                <div className="text-6xl font-black text-white mb-2">6,380%</div>
                <div className="text-xl text-green-100">by Year 3</div>
              </div>
              <div className="text-sm text-white/80 text-center">
                For $500K investment at 10% equity
              </div>
              <div className="mt-6 pt-6 border-t border-white/20 text-center">
                <div className="text-2xl font-bold text-white">Your $500K → $32.4M</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30 text-center">
            <p className="text-2xl text-white font-bold">
              💎 Let's build the future of e-commerce in Uzbekistan together 💎
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Navigation functions
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

  // Main pitch deck
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Current Slide */}
      <div className="h-screen">
        {slides[currentSlide].content}
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
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
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/30 hover:bg-white/50'
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
        
        <div className="ml-4 text-sm text-gray-300">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Exit Button */}
      <button
        onClick={() => setLocation('/')}
        className="fixed top-8 right-8 bg-white/10 backdrop-blur-lg rounded-full p-3 border border-white/20 hover:bg-white/20 transition-all"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
