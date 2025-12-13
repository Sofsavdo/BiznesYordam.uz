import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'uz' | 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// O'zbek tilidagi tarjimalar
const translationsUz = {
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
  'features.title': 'SellerCloudX Platform Imkoniyatlari',
  'features.subtitle': 'Professional hamkorlar uchun yaratilgan eng kuchli asboblar to\'plami',
  
  // Buttons
  'hero.button.telegram': 'Telegram Kanalga Kirish',

  // Dashboard
  'dashboard.analytics': 'Statistikalar',
  'dashboard.requests': 'So\'rovlar',
  'dashboard.products': 'Mahsulotlar',
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
  'currency.sale': 'Sotuv narxi',
  
  // Tier Info
  'tier.payment': 'To\'lov Tuzilmasi',
  'tier.monthly': 'Oylik Abonent',
  'tier.profitShare': 'Profit Share',
  'tier.services': 'Xizmatlar',
  'tier.revenue': 'Tavsiya etiladigan aylanma',
  'tier.upgrade': 'Yuqori Tarifga O\'ting',
  'tier.noProfit': 'Foyda bo\'lmasa, faqat abonent to\'lanadi!',
  'tier.fromProfit': 'foydadan',
  'tier.fixed': 'Fixed oylik to\'lov',
  'tier.netProfit': 'Sof foydangizdan'
};

// Rus tilidagi tarjimalar
const translationsRu = {
  // Navigation
  'nav.home': 'Главная',
  'nav.services': 'Услуги',
  'nav.calculator': 'Калькулятор',
  'nav.pricing': 'Тарифы',
  'nav.login': 'Войти',
  'nav.register': 'Регистрация',
  'nav.dashboard': 'Панель',
  'nav.admin': 'Админ',
  'nav.logout': 'Выйти',
  'nav.hello': 'Привет',

  // Landing Page
  'hero.title': 'Платформа Fulfillment для Marketplace',
  'hero.subtitle': 'Упрощаем торговлю на Uzum, Wildberries, Yandex Market и других маркетплейсах. Принимаем, готовим, доставляем и управляем всеми процессами.',
  'hero.features.title': 'Премиум возможности',
  'hero.button.partner': 'Стать партнером',
  'hero.button.register': 'Регистрация',

  // Pricing
  'pricing.title': 'Тарифные планы',
  'pricing.subtitle': 'Выберите профессиональное решение под ваш бизнес',
  'pricing.tier.starter': 'Starter Pro',
  'pricing.tier.business': 'Business Standard',
  'pricing.tier.professional': 'Professional Plus',
  'pricing.tier.enterprise': 'Enterprise Elite',
  'pricing.monthly': 'Ежемесячный платеж',
  'pricing.commission': 'комиссия',
  'pricing.custom': 'По договоренности',
  'pricing.choose': 'Выбрать',
  'pricing.recommended': 'Рекомендуется',

  // Calculator
  'calc.title': 'Калькулятор Fulfillment',
  'calc.subtitle': 'Профессиональный расчет логистики и fulfillment расходов',

  // Common
  'common.monthly': 'в месяц',
  'common.som': 'сум',
  'common.secure': '100% Безопасно',
  'common.partners': '500+ Партнеров',
  
  // Features
  'features.title': 'Возможности платформы SellerCloudX',
  'features.subtitle': 'Самый мощный набор инструментов для профессиональных партнеров',
  
  // Buttons
  'hero.button.telegram': 'Telegram канал',

  // Dashboard
  'dashboard.analytics': 'Аналитика',
  'dashboard.requests': 'Запросы',
  'dashboard.products': 'Товары',
  'dashboard.logout': 'Выйти',

  // Forms
  'form.firstName': 'Имя',
  'form.lastName': 'Фамилия',
  'form.email': 'Email',
  'form.phone': 'Телефон',
  'form.password': 'Пароль',
  'form.submit': 'Отправить',
  'form.login': 'Войти',
  'form.register': 'Регистрация',

  // Currency
  'currency.som': 'сум',
  'currency.profit': 'Прибыль',
  'currency.price': 'Цена',
  'currency.cost': 'Цена закупки',
  'currency.sale': 'Цена продажи',
  
  // Tier Info
  'tier.payment': 'Структура оплаты',
  'tier.monthly': 'Ежемесячная подписка',
  'tier.profitShare': 'Profit Share',
  'tier.services': 'Услуги',
  'tier.revenue': 'Рекомендуемый оборот',
  'tier.upgrade': 'Перейти на высший тариф',
  'tier.noProfit': 'Если нет прибыли, платите только подписку!',
  'tier.fromProfit': 'от прибыли',
  'tier.fixed': 'Фиксированный ежемесячный платеж',
  'tier.netProfit': 'От вашей чистой прибыли'
};

// English translations
const translationsEn = {
  // Navigation
  'nav.home': 'Home',
  'nav.services': 'Services',
  'nav.calculator': 'Calculator',
  'nav.pricing': 'Pricing',
  'nav.login': 'Login',
  'nav.register': 'Register',
  'nav.dashboard': 'Dashboard',
  'nav.admin': 'Admin',
  'nav.logout': 'Logout',
  'nav.hello': 'Hello',

  // Landing Page
  'hero.title': 'Marketplace Fulfillment Platform',
  'hero.subtitle': 'We simplify selling on Uzum, Wildberries, Yandex Market and other marketplaces. We receive, prepare, deliver and manage all processes.',
  'hero.features.title': 'Premium Features',
  'hero.button.partner': 'Become a Partner',
  'hero.button.register': 'Register',

  // Pricing
  'pricing.title': 'Pricing Plans',
  'pricing.subtitle': 'Choose a professional solution for your business',
  'pricing.tier.starter': 'Starter Pro',
  'pricing.tier.business': 'Business Standard',
  'pricing.tier.professional': 'Professional Plus',
  'pricing.tier.enterprise': 'Enterprise Elite',
  'pricing.monthly': 'Monthly payment',
  'pricing.commission': 'commission',
  'pricing.custom': 'By agreement',
  'pricing.choose': 'Choose',
  'pricing.recommended': 'Recommended',

  // Calculator
  'calc.title': 'Fulfillment Calculator',
  'calc.subtitle': 'Professional calculation of logistics and fulfillment costs',

  // Common
  'common.monthly': 'per month',
  'common.som': 'UZS',
  'common.secure': '100% Secure',
  'common.partners': '500+ Partners',
  
  // Features
  'features.title': 'SellerCloudX Platform Features',
  'features.subtitle': 'The most powerful set of tools for professional partners',
  
  // Buttons
  'hero.button.telegram': 'Telegram Channel',

  // Dashboard
  'dashboard.analytics': 'Analytics',
  'dashboard.requests': 'Requests',
  'dashboard.products': 'Products',
  'dashboard.logout': 'Logout',

  // Forms
  'form.firstName': 'First Name',
  'form.lastName': 'Last Name',
  'form.email': 'Email',
  'form.phone': 'Phone',
  'form.password': 'Password',
  'form.submit': 'Submit',
  'form.login': 'Login',
  'form.register': 'Register',

  // Currency
  'currency.som': 'UZS',
  'currency.profit': 'Profit',
  'currency.price': 'Price',
  'currency.cost': 'Purchase price',
  'currency.sale': 'Sale price',
  
  // Tier Info
  'tier.payment': 'Payment Structure',
  'tier.monthly': 'Monthly Subscription',
  'tier.profitShare': 'Profit Share',
  'tier.services': 'Services',
  'tier.revenue': 'Recommended turnover',
  'tier.upgrade': 'Upgrade to higher tier',
  'tier.noProfit': 'If no profit, pay only subscription!',
  'tier.fromProfit': 'from profit',
  'tier.fixed': 'Fixed monthly payment',
  'tier.netProfit': 'From your net profit'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Get saved language from localStorage or default to 'uz'
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'uz' || saved === 'ru' || saved === 'en') ? saved : 'uz';
  });

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translations = language === 'uz' ? translationsUz : language === 'ru' ? translationsRu : translationsEn;
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
