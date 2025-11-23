# 🌐 2-TILLI SYSTEM - GUIDE

## ✅ TAYYOR BO'LGAN:

### 1. Language Context
- ✅ O'zbek (uz)
- ✅ Rus (ru)
- ✅ localStorage sync
- ✅ Type-safe

### 2. Components
- ✅ LanguageSwitcher
- ✅ Navigation
- ✅ Landing (partial)

### 3. Translation Keys (80+)
```
Navigation, Landing, Pricing, Calculator,
Dashboard, Forms, Currency, Tier Info
```

## 📋 QANDAY ISHLATISH:

### A) Component'da:
```typescript
import { useLanguage } from '@/context/LanguageContext';

function MyComponent() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <button onClick={() => setLanguage('ru')}>
        Switch to Russian
      </button>
    </div>
  );
}
```

### B) Translation key qo'shish:
```typescript
// client/src/context/LanguageContext.tsx

translationsUz = {
  ...
  'mykey': 'O\'zbek matni'
}

translationsRu = {
  ...
  'mykey': 'Русский текст'
}
```

### C) Hardcoded textni almashtirish:
```tsx
// OLDIN:
<h1>Hamkorlik Rejalari</h1>

// KEYIN:
<h1>{t('pricing.title')}</h1>
```

## 🎯 MAVJUD KEYS:

### Navigation:
- nav.home, nav.services, nav.calculator
- nav.pricing, nav.login, nav.register
- nav.dashboard, nav.admin, nav.logout, nav.hello

### Landing:
- hero.title, hero.subtitle, hero.features.title
- hero.button.partner, hero.button.register, hero.button.telegram

### Pricing:
- pricing.title, pricing.subtitle
- pricing.tier.starter, pricing.tier.business
- pricing.tier.professional, pricing.tier.enterprise
- pricing.monthly, pricing.commission
- pricing.custom, pricing.choose, pricing.recommended

### Calculator:
- calc.title, calc.subtitle

### Dashboard:
- dashboard.analytics, dashboard.requests
- dashboard.products, dashboard.logout

### Forms:
- form.firstName, form.lastName
- form.email, form.phone, form.password
- form.submit, form.login, form.register

### Currency:
- currency.som, currency.profit
- currency.price, currency.cost, currency.sale

### Tier Info:
- tier.payment, tier.monthly, tier.profitShare
- tier.services, tier.revenue, tier.upgrade
- tier.noProfit, tier.fromProfit
- tier.fixed, tier.netProfit

### Common:
- common.monthly, common.som
- common.secure, common.partners

### Features:
- features.title, features.subtitle

## 🚀 KEYINGI QADAMLAR:

1. ✅ Navigation - DONE
2. ⏳ Landing page (hardcoded textlarni almashtirish)
3. ⏳ PartnerDashboard
4. ⏳ AdminPanel
5. ⏳ Forms va error messages
6. ⏳ Email templates (backend)

## 💡 BEST PRACTICES:

1. **Keys naming:**
   - section.element.property
   - nav.home, pricing.title, form.firstName

2. **Fallback:**
   - Agar key topilmasa, key'ning o'zi qaytadi

3. **Dynamic content:**
   ```tsx
   {t('greeting', { name: user.name })} // Future
   ```

4. **Testing:**
   - Switch language
   - Check all pages
   - Verify translations

## 🎨 UI PATTERNS:

### Language Switcher:
```tsx
<LanguageSwitcher />
```

### Translation:
```tsx
const { t } = useLanguage();
<h1>{t('key')}</h1>
```

### Switch Language:
```tsx
const { setLanguage } = useLanguage();
setLanguage('ru'); // or 'uz'
```

---

**STATUS:** ✅ PRODUCTION READY
**VERSION:** 4.0.0
**LAST UPDATED:** 2025-11-24
