# BiznesYordam.uz - Ishga Tushirish Qo'llanmasi

## 🚀 Tezkor Ishga Tushirish

### 1. Loyihani Yuklab Olish
```bash
git clone https://github.com/Sofsavdo/BiznesYordam.uz.git
cd BiznesYordam.uz
```

### 2. Dependencies O'rnatish
```bash
npm install
```

### 3. Environment O'rnatish
`.env` fayl allaqachon mavjud. Agar yo'q bo'lsa:
```bash
cp .env.example .env
```

### 4. Serverni Ishga Tushirish

**Development rejimida:**
```bash
npm run dev
```

Server `http://localhost:5000` da ishga tushadi.

**Production rejimida:**
```bash
npm run build
npm start
```

## 🔐 Default Login Ma'lumotlari

### Admin Panel
- **URL**: `http://localhost:5000/admin-panel`
- **Username**: `admin`
- **Password**: `BiznesYordam2024!`

### Partner Dashboard
- **URL**: `http://localhost:5000/partner-dashboard`
- **Username**: `testpartner`
- **Password**: `Partner2024!`

## 📊 Platformaning Asosiy Sahifalari

1. **Bosh Sahifa**: `/` - Landing page
2. **Partner Ro'yxatdan O'tish**: `/partner-registration`
3. **Partner Dashboard**: `/partner-dashboard` (Login kerak)
4. **Admin Panel**: `/admin-panel` (Admin login kerak)

## 🛠️ Texnologiyalar

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (development) / PostgreSQL (production)
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **WebSocket**: ws (real-time chat)

## 📁 Loyiha Strukturasi

```
BiznesYordam.uz/
├── client/              # Frontend React app
│   ├── src/
│   │   ├── components/  # UI komponentlar
│   │   ├── pages/       # Sahifalar
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utility funksiyalar
├── server/              # Backend Express app
│   ├── db.ts           # Database konfiguratsiyasi
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database operatsiyalari
│   ├── websocket.ts    # WebSocket server
│   └── __tests__/      # Unit testlar
├── shared/              # Shared types va schemas
│   └── schema.ts       # Database schema
└── migrations/          # Database migrations
```

## 🧪 Testlarni Ishga Tushirish

```bash
npm test
```

## 🔧 Muammolarni Hal Qilish

### Port band bo'lsa:
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database muammolari:
```bash
# SQLite database'ni qaytadan yaratish
rm dev.db
npm run dev
```

### Dependencies muammolari:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Platformaning Ishlash Jarayoni

1. **Hamkor Ro'yxatdan O'tadi** → `/partner-registration`
2. **Admin Hamkorni Tasdiqlaydi** → Admin Panel'da
3. **Admin Marketplace API'ni Ulaydi** → Har bir hamkor uchun alohida
4. **Hamkor Mahsulotlarini Yuklaydi** → Partner Dashboard'da
5. **Fulfillment So'rovlari Yaratiladi** → Tovarlarni tayyorlash, logistika
6. **Admin So'rovlarni Bajaradi** → Status yangilanadi
7. **Foyda Tahlili Ko'rsatiladi** → Real vaqtda hisobotlar
8. **Chat Orqali Muloqot** → Admin va hamkor o'rtasida

## 🌟 Asosiy Funksiyalar

### Admin Panel
- ✅ Hamkorlarni ko'rish va tasdiqlash
- ✅ Fulfillment so'rovlarini boshqarish
- ✅ Tarif yangilash so'rovlarini ko'rib chiqish
- ✅ Chat tizimi orqali hamkorlar bilan muloqot
- ✅ Product Hunter - trenddagi mahsulotlar tahlili
- ✅ Marketplace API konfiguratsiyasi
- ✅ Statistika va hisobotlar

### Partner Dashboard
- ✅ Dashboard - asosiy ko'rsatkichlar
- ✅ Mahsulotlarni boshqarish
- ✅ Fulfillment so'rovlari yaratish
- ✅ Foyda tahlili (Profit Breakdown)
- ✅ Chat tizimi admin bilan
- ✅ Tarif yangilash so'rovi
- ✅ Product Hunter (tarif bo'yicha)

### Marketplace Integratsiyasi
- ✅ Har bir hamkor o'z marketplace API kalitlarini ulaydi
- ✅ Admin tomonidan konfiguratsiya qilinadi
- ✅ Uzum, Wildberries, Yandex, Ozon qo'llab-quvvatlanadi
- ✅ API ulanishini test qilish imkoniyati

### Product Hunter
- ✅ Trenddagi mahsulotlar tahlili
- ✅ Foyda potentsiali hisoblash
- ✅ Raqobat darajasi baholash
- ✅ Qidiruv hajmi statistikasi
- ✅ Kategoriya va marketplace bo'yicha filtrlash

## 💰 To'lov Tizimi Haqida

⚠️ **Muhim**: Platformada to'lov jarayoni yo'q
- To'lovlar naqd yoki bank hisob raqamlari orqali
- Platforma faqat hisob-kitob va hisobotlarni ko'rsatadi
- Komissiya va xizmat haqlari hisob-kitob qilinadi va ko'rsatiladi

## 🔒 Xavfsizlik

- ✅ Session-based authentication
- ✅ Role-based access control (Admin, Partner, Customer)
- ✅ Audit logs
- ✅ CORS konfiguratsiyasi
- ✅ Helmet security headers
- ✅ Rate limiting

## 📞 Yordam

Muammolar yoki savollar bo'lsa:
- GitHub Issues: https://github.com/Sofsavdo/BiznesYordam.uz/issues
- Email: admin@biznesyordam.uz

## 📄 Litsenziya

MIT License - Batafsil ma'lumot uchun LICENSE faylini ko'ring.
