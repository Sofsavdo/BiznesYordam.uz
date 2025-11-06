import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { ChatSystem } from './ChatSystem';

import { LogOut, Menu, X, MessageCircle } from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
      setLocation('/');
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setLocation('/')}
                className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
                data-testid="button-home"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-elegant">
                  <span className="text-white font-bold text-sm">BY</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 relative">
                  BiznesYordam
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full gradient-business rounded-full opacity-60"></span>
                </h1>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <button 
                  onClick={() => {
                    setLocation('/');
                    setTimeout(() => {
                      const servicesSection = document.getElementById('services');
                      if (servicesSection) {
                        servicesSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  data-testid="button-services"
                >
                  {t('nav.services')}
                </button>
                <button 
                  onClick={() => {
                    setLocation('/');
                    setTimeout(() => {
                      const calculatorSection = document.getElementById('calculator');
                      if (calculatorSection) {
                        calculatorSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  data-testid="button-calculator"
                >
                  {t('nav.calculator')}
                </button>
                <button 
                  onClick={() => {
                    setLocation('/');
                    setTimeout(() => {
                      const pricingSection = document.getElementById('pricing');
                      if (pricingSection) {
                        pricingSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  data-testid="button-pricing"
                >
                  {t('nav.pricing')}
                </button>
                <Button 
                  onClick={() => setLocation('/partner-dashboard')}
                  className="bg-primary hover:bg-primary/90 mr-2 hover-lift"
                  data-testid="button-login"
                >
                  {t('nav.login')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/partner-registration')}
                  className="hover-lift"
                  data-testid="button-register"
                >
                  {t('nav.register')}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600">
                  {t('nav.hello')}, {user.firstName || user.username}
                </span>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                {user.role === 'admin' && (
                  <Button
                    onClick={() => setLocation('/admin-panel')}
                    variant="outline"
                    className="hover-lift"
                  >
                    {t('nav.admin')}
                  </Button>
                )}
                {user.role === 'partner' && (
                  <Button
                    onClick={() => setLocation('/partner-dashboard')}
                    variant="outline"
                    className="hover-lift"
                  >
                    {t('nav.dashboard')}
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-2">
              {!user ? (
                <>
                  <button 
                    onClick={() => {
                      setLocation('/');
                      setIsMenuOpen(false);
                      setTimeout(() => {
                        const servicesSection = document.getElementById('services');
                        if (servicesSection) {
                          servicesSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="text-slate-600 hover:text-primary px-3 py-2 text-sm w-full text-left"
                  >
                    Xizmatlar
                  </button>
                  <button 
                    onClick={() => {
                      setLocation('/');
                      setIsMenuOpen(false);
                      setTimeout(() => {
                        const calculatorSection = document.getElementById('calculator');
                        if (calculatorSection) {
                          calculatorSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="text-slate-600 hover:text-primary px-3 py-2 text-sm w-full text-left"
                  >
                    Kalkulyator
                  </button>
                  <button 
                    onClick={() => {
                      setLocation('/');
                      setIsMenuOpen(false);
                      setTimeout(() => {
                        const pricingSection = document.getElementById('pricing');
                        if (pricingSection) {
                          pricingSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="text-slate-600 hover:text-primary px-3 py-2 text-sm w-full text-left"
                  >
                    Narxlar
                  </button>
                  <Button 
                    onClick={() => setLocation('/partner-dashboard')}
                    className="mx-3 mb-2"
                  >
                    Hamkor Kirish
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/partner-registration')}
                    className="mx-3"
                  >
                    Hamkor Bo'ling
                  </Button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-sm text-slate-600">
                    Salom, {user.firstName || user.username}
                  </div>
                  {user.role === 'admin' && (
                    <Button
                      onClick={() => setLocation('/admin-panel')}
                      variant="outline"
                      className="mx-3 mb-2"
                    >
                      Admin Panel
                    </Button>
                  )}
                  {user.role === 'partner' && (
                    <Button
                      onClick={() => setLocation('/partner-dashboard')}
                      variant="outline"
                      className="mx-3 mb-2"
                    >
                      Dashboard
                    </Button>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="mx-3 justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Chiqish
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Chat System */}
      <ChatSystem isAdmin={user?.role === 'admin'} />
    </nav>
  );
}
