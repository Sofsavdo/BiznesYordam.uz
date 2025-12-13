// Simple i18n implementation without external dependencies
// Supports: Uzbek (uz), Russian (ru), English (en)

export type Language = 'uz' | 'ru' | 'en';

export const translations = {
  uz: {
    // Navigation
    'nav.home': 'Bosh sahifa',
    'nav.login': 'Kirish',
    'nav.register': "Ro'yxatdan o'tish",
    'nav.admin': 'Admin',
    'nav.demo': 'Demo',
    
    // Common
    'common.save': 'Saqlash',
    'common.cancel': 'Bekor qilish',
    'common.delete': "O'chirish",
    'common.edit': 'Tahrirlash',
    'common.view': "Ko'rish",
    'common.search': 'Qidirish',
    'common.filter': 'Filtr',
    'common.export': 'Eksport',
    'common.import': 'Import',
    'common.loading': 'Yuklanmoqda...',
    'common.error': 'Xatolik',
    'common.success': 'Muvaffaqiyatli',
    
    // Admin Panel
    'admin.overview': 'Umumiy',
    'admin.partners': 'Hamkorlar',
    'admin.requests': "So'rovlar",
    'admin.tiers': 'Tariflar',
    'admin.analytics': 'Tahlil',
    'admin.marketplace': 'Marketplace',
    'admin.trends': 'Trendlar',
    'admin.remote': 'Remote Access',
    'admin.settings': 'Sozlamalar',
    'admin.chat': 'Support chat',
    
    // Partner Dashboard
    'partner.dashboard': 'Dashboard',
    'partner.products': 'Mahsulotlar',
    'partner.orders': 'Buyurtmalar',
    'partner.analytics': 'Tahlil',
    'partner.referral': 'Referral',
    
    // Forms
    'form.email': 'Email',
    'form.password': 'Parol',
    'form.username': 'Username',
    'form.phone': 'Telefon',
    'form.businessName': 'Biznes nomi',
  },
  
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.admin': 'Админ',
    'nav.demo': 'Демо',
    
    // Common
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.view': 'Просмотр',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.export': 'Экспорт',
    'common.import': 'Импорт',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    
    // Admin Panel
    'admin.overview': 'Обзор',
    'admin.partners': 'Партнеры',
    'admin.requests': 'Запросы',
    'admin.tiers': 'Тарифы',
    'admin.analytics': 'Аналитика',
    'admin.marketplace': 'Маркетплейс',
    'admin.trends': 'Тренды',
    'admin.remote': 'Удаленный доступ',
    'admin.settings': 'Настройки',
    'admin.chat': 'Чат поддержки',
    
    // Partner Dashboard
    'partner.dashboard': 'Панель',
    'partner.products': 'Товары',
    'partner.orders': 'Заказы',
    'partner.analytics': 'Аналитика',
    'partner.referral': 'Реферальная',
    
    // Forms
    'form.email': 'Email',
    'form.password': 'Пароль',
    'form.username': 'Имя пользователя',
    'form.phone': 'Телефон',
    'form.businessName': 'Название бизнеса',
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.admin': 'Admin',
    'nav.demo': 'Demo',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Admin Panel
    'admin.overview': 'Overview',
    'admin.partners': 'Partners',
    'admin.requests': 'Requests',
    'admin.tiers': 'Tiers',
    'admin.analytics': 'Analytics',
    'admin.marketplace': 'Marketplace',
    'admin.trends': 'Trends',
    'admin.remote': 'Remote Access',
    'admin.settings': 'Settings',
    'admin.chat': 'Support chat',
    
    // Partner Dashboard
    'partner.dashboard': 'Dashboard',
    'partner.products': 'Products',
    'partner.orders': 'Orders',
    'partner.analytics': 'Analytics',
    'partner.referral': 'Referral',
    
    // Forms
    'form.email': 'Email',
    'form.password': 'Password',
    'form.username': 'Username',
    'form.phone': 'Phone',
    'form.businessName': 'Business Name',
  },
};

// Get current language from localStorage or default to 'uz'
export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return 'uz';
  const stored = localStorage.getItem('language');
  return (stored as Language) || 'uz';
}

// Set language
export function setLanguage(lang: Language) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('language', lang);
  window.dispatchEvent(new Event('languagechange'));
}

// Translate function
export function t(key: string, lang?: Language): string {
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang][key as keyof typeof translations.uz] || key;
}

// Hook for React components
import { useState, useEffect } from 'react';

export function useTranslation() {
  const [language, setLang] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = () => {
      setLang(getCurrentLanguage());
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const translate = (key: string) => t(key, language);

  return { t: translate, language, setLanguage };
}
