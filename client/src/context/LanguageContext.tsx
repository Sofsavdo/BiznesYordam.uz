import React, { createContext, useContext } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
}

// O'zbek tilida tarjimalar
const translations = {
  // Navigation
  'nav.home': 'Bosh sahifa',
  'nav.services': 'Xizmatlar',
  'nav.calculator': 'Kalkulyator',
  'nav.pricing': 'Tariflar',
  'nav.login': 'Kirish',
  'nav.register': 'Ro\'yxatdan o\'tish',
  'nav.dashboard': 'Dashboard',
  'nav.admin': 'Admin',
  'nav.logout': 'Chiqish',
  'nav.hello': 'Salom',

  // Landing Page
  'hero.title': 'Marketplace Fulfillment Platform',
  'hero.subtitle': 'Uzum, Wildberries, Yandex Market va boshqa marketplace\'larda savdo qilishni osonlashtiramiz. Mahsulotlarni qabul qilish, tayyorlash, yetkazib berish va barcha jarayonlarni boshqaramiz.',
  'hero.features.title': 'Premium Imkoniyatlar',
  'hero.button.partner': 'Hamkor Bo\'lish',
  'hero.button.register': 'Ro\'yxatdan o\'tish',

  // Pricing
  'pricing.title': 'Tarif Rejalari',
  'pricing.subtitle': 'Biznes hajmingizga mos professional yechimni tanlang',
  'pricing.tier.starter': 'Starter Pro',
  'pricing.tier.business': 'Business Standard',
  'pricing.tier.professional': 'Professional Plus',
  'pricing.tier.enterprise': 'Enterprise Elite',
  'pricing.monthly': 'Oylik to\'lov',
  'pricing.commission': 'komissiya',
  'pricing.custom': 'Kelishuv asosida',
  'pricing.choose': 'Tanlash',
  'pricing.recommended': 'Tavsiya Etiladi',

  // Calculator
  'calc.title': 'Fulfillment Kalkulyatori',
  'calc.subtitle': 'Logistika va fulfillment xarajatlarini professional hisoblang',

  // Common
  'common.monthly': 'oylik',
  'common.som': 'so\'m',
  'common.secure': '100% Xavfsiz',
  'common.partners': '500+ Hamkor',
  
  // Features
  'features.title': 'BiznesYordam Platform Imkoniyatlari',
  'features.subtitle': 'Professional hamkorlar uchun yaratilgan eng kuchli asboblar to\'plami',
  
  // Buttons
  'hero.button.telegram': 'Telegram Kanalga Kirish',

  // Dashboard
  'dashboard.analytics': 'Statistikalar',
  'dashboard.requests': 'So\'rovlar',
  'dashboard.products': 'Mahsulotlar',
  'dashboard.chat': 'Chat',
  'dashboard.logout': 'Chiqish',

  // Forms
  'form.firstName': 'Ism',
  'form.lastName': 'Familiya',
  'form.email': 'Email',
  'form.phone': 'Telefon',
  'form.password': 'Parol',
  'form.submit': 'Yuborish',
  'form.login': 'Kirish',
  'form.register': 'Ro\'yxatdan o\'tish',

  // Currency
  'currency.som': 'so\'m',
  'currency.profit': 'Foyda',
  'currency.price': 'Narx',
  'currency.cost': 'Xarid narxi',
  'currency.sale': 'Sotuv narxi'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const t = (key: string): string => {
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}