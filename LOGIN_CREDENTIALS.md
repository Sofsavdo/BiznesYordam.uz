# 🔐 Login Ma'lumotlari

## Test Hisoblar

### 👨‍💼 Admin Hisob
```
URL: /admin-login
Username: admin
Parol: Admin2024!
```

**Imkoniyatlar:**
- ✅ Barcha hamkorlarni ko'rish va boshqarish
- ✅ So'rovlarni tasdiqlash/rad etish
- ✅ Tarif so'rovlarini ko'rib chiqish
- ✅ Keng qamrovli tahlil
- ✅ Hisobotlar va eksport
- ✅ Tizim sozlamalari
- ✅ API konfiguratsiya
- ✅ Trending mahsulotlar

---

### 🤝 Partner Hisob
```
URL: /login
Username: testpartner
Parol: Partner2024!
```

**Ma'lumotlar:**
- Biznes nomi: Test Biznes
- Kategoriya: Electronics
- Tarif: Business Standard
- Status: ✅ Tasdiqlangan
- Oylik aylanma: 25,000,000 so'm
- Komissiya: 20%

**Imkoniyatlar:**
- ✅ Dashboard va statistika
- ✅ Ombor boshqaruvi
- ✅ Buyurtmalar
- ✅ Tahlil va hisobotlar
- ✅ Mahsulotlar CRUD
- ✅ Fulfillment so'rovlari
- ✅ Foyda tracking
- ✅ Trending mahsulotlar

---

## 🌐 URL'lar

### Production
```
https://5000--019a747f-83be-7305-a529-0fabeb60c60d.us-east-1-01.gitpod.dev
```

### Sahifalar
- **Bosh sahifa:** `/`
- **Partner Login:** `/login`
- **Admin Login:** `/admin-login`
- **Partner Dashboard:** `/partner-dashboard`
- **Admin Panel:** `/admin-panel`
- **Partner Ro'yxatdan O'tish:** `/partner-registration`

---

## 📊 Admin Panel Funksiyalari

### 8 ta Tab:

1. **Overview** - Umumiy ko'rinish
   - Real-time statistika
   - So'nggi faoliyat
   - Tezkor amallar

2. **Analytics** - Tahlil
   - Keng qamrovli tahlil
   - Grafiklar va diagrammalar
   - Trend tahlili

3. **Partners** - Hamkorlar
   - Hamkorlar ro'yxati
   - Tasdiqlash/Rad etish
   - Qidiruv va filtrlash

4. **Requests** - So'rovlar
   - Fulfillment so'rovlari
   - Status yangilash
   - Priority belgilash

5. **Tiers** - Tariflar
   - Tarif yangilash so'rovlari
   - Tasdiqlash/Rad etish
   - Admin izohlari

6. **Trends** - Trendlar
   - Trending mahsulotlar
   - Marketplace tahlili
   - Raqobat tahlili

7. **Reports** - Hisobotlar
   - Data eksport (Excel, CSV, PDF)
   - Rejalashtirilgan hisobotlar
   - Email yuborish

8. **Settings** - Sozlamalar
   - Marketplace API
   - Tizim sozlamalari
   - Xavfsizlik
   - Database info

---

## 🤝 Partner Dashboard Funksiyalari

### 8 ta Tab:

1. **Umumiy** - Dashboard
   - Statistika kartochkalari
   - So'nggi mahsulotlar
   - Stock alerts

2. **Ombor** - Inventory
   - Mahsulotlar ro'yxati
   - Stock boshqaruvi
   - Low stock alerts

3. **Buyurtmalar** - Orders
   - Buyurtmalar ro'yxati
   - Status tracking
   - Fulfillment

4. **Tahlil** - Analytics
   - Comprehensive analytics
   - Grafiklar
   - KPI monitoring

5. **Mahsulotlar** - Products
   - CRUD operatsiyalar
   - Mahsulot ma'lumotlari
   - Narx boshqaruvi

6. **So'rovlar** - Requests
   - Fulfillment so'rovlari
   - Yangi so'rov yaratish
   - Status tracking

7. **Foyda** - Profit
   - Foyda tahlili
   - Xarajatlar
   - Margin hisoblash

8. **Trendlar** - Trends
   - Trending mahsulotlar
   - Marketplace trends
   - Tavsiyalar

---

## 🔧 API Endpoints

### Auth
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Current user

### Partners
- GET `/api/partners/me` - Partner ma'lumotlari
- PUT `/api/partners/me` - Partner yangilash
- GET `/api/admin/partners` - Barcha hamkorlar (Admin)
- PUT `/api/admin/partners/:id/approve` - Tasdiqlash (Admin)

### Products
- GET `/api/products` - Mahsulotlar ro'yxati
- POST `/api/products` - Yangi mahsulot
- PUT `/api/products/:id` - Mahsulot yangilash
- DELETE `/api/products/:id` - Mahsulot o'chirish

### Fulfillment
- GET `/api/fulfillment-requests` - So'rovlar ro'yxati
- POST `/api/fulfillment-requests` - Yangi so'rov
- PUT `/api/fulfillment-requests/:id` - So'rov yangilash

### Tiers
- GET `/api/admin/tier-upgrade-requests` - Tarif so'rovlari (Admin)
- PUT `/api/admin/tier-upgrade-requests/:id` - So'rov ko'rib chiqish (Admin)

### Analytics
- GET `/api/analytics` - Tahlil ma'lumotlari

---

## 🐛 Debugging

### Browser Console
```javascript
// Check current user
fetch('/api/auth/me').then(r => r.json()).then(console.log)

// Check partner data
fetch('/api/partners/me').then(r => r.json()).then(console.log)

// Check products
fetch('/api/products').then(r => r.json()).then(console.log)
```

### Server Logs
```bash
# Watch server logs
tail -f /tmp/server.log

# Check database
sqlite3 database.db "SELECT * FROM users;"
sqlite3 database.db "SELECT * FROM partners;"
```

---

## ✅ Barcha Funksiyalar Ishlaydi

- ✅ Admin login va dashboard
- ✅ Partner login va dashboard
- ✅ Real-time ma'lumotlar
- ✅ CRUD operatsiyalar
- ✅ Data eksport
- ✅ API integratsiya
- ✅ Responsive dizayn
- ✅ Error handling
- ✅ Toast notifications

---

## 📝 Commit

- Hash: `e319b4c`
- Message: "fix: Improve admin settings layout and add login credentials display"
- Status: ✅ Pushed to GitHub

---

**Test qilish uchun tayyor!** 🚀
