# 🚀 BiznesYordam - Professional Marketplace Fulfillment Platform

**O'zbekcha** | [English](#english)

O'zbekiston marketplace tadbirkorlari uchun professional fulfillment platformasi. Uzum Market, Wildberries, Yandex Market va boshqa marketplace'larda savdoni avtomatlashtiradi va daromadni oshiradi.

**🌟 Real Production Platform - Mock data yo'q, faqat real API integrations!**

## 🎯 **Asosiy Funksiyalar**

### 👥 **Hamkorlar uchun**
- **🎛️ Partner Dashboard** - To'liq boshqaruv interfeysi
- **🔗 Marketplace Integration** - Uzum Market, Wildberries, Yandex Market bilan integratsiya
- **📦 Mahsulot Boshqaruvi** - Avtomatik fulfillment so'rovlar tizimi
- **📊 Real-time Analytics** - Foyda hisoblash va performance ko'rsatkichlari
- **💰 Tier-based Pricing** - 4 xil narx rejimi bilan raqobatbardosh komissiya
- **🕐 24/7 Support** - Ko'p kanalli mijozlar yordami

### 🛡️ **Administratorlar uchun**
- **⚙️ Admin Panel** - To'liq hamkor boshqaruvi va monitoring tizimi
- **💬 Real-time Chat** - Hamkorlar bilan to'g'ridan-to'g'ri aloqa
- **📈 Advanced Analytics** - Business intelligence va hisobot vositalari
- **💳 Moliyaviy Boshqaruv** - Daromad kuzatuvi va komissiya hisoblash

### 🔧 **Texnik Funksiyalar**
- **🏗️ Modern Architecture** - React + Express.js + PostgreSQL
- **⚡ Real-time Updates** - WebSocket-powered bildirishnomalar
- **🔐 Secure Authentication** - Session-based autentifikatsiya va role-based access
- **📱 Responsive Design** - Mobile-first yondashuv va Tailwind CSS
- **🔌 API Integration** - Real marketplace API ulanishlari

## 🛠️ **O'rnatish va Sozlash**

### 📋 **Talablar**
- Node.js 18+ (Eng so'nggi LTS tavsiya etiladi)
- npm package manager
- PostgreSQL database (Production)
- Git

### 🚀 **Tezkor Boshlash**

1. **Repository ni Clone qiling**
```bash
git clone https://github.com/yourusername/biznesyordam-platform.git
cd biznesyordam-platform
```

2. **Dependencies o'rnatish**
```bash
npm install
```

3. **Environment sozlash**
```bash
cp env.example .env
# Edit .env file with your configuration
```

4. **Database Setup**
```bash
npm run db:push  # Setup database schema
npm run seed     # Seed with sample data
```

5. **Start Development Server**
```bash
npm run dev      # Starts both client and server
```

The application will be available at `http://localhost:5000`

## 🚀 Production Deployment

### Build for Production
```bash
npm run build:full  # Builds both client and server
```

### Start Production Server
```bash
npm start
```

### Docker Support (Coming Soon)
```bash
docker build -t biznesyordam-fulfillment .
docker run -p 5000:5000 biznesyordam-fulfillment
```

## 📁 Loyiha tuzilishi

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI komponentlar
│   │   ├── pages/         # Sahifalar
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utility funksiyalar
├── server/                # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── seedData.ts        # Test data
├── shared/                # Shared types va schema
└── dist/                  # Production build
```

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Partner Management
- `GET /api/partners` - List all partners (Admin)
- `POST /api/partners/register` - Partner registration
- `POST /api/partners/:id/approve` - Approve partner (Admin)
- `GET /api/partners/me` - Get current partner info
- `PUT /api/partners/:id` - Update partner information

### Marketplace Integration
- `POST /api/partners/:id/marketplace/connect` - Connect marketplace
- `GET /api/marketplace-integrations` - List integrations
- `POST /api/fulfillment-requests` - Create fulfillment request
- `GET /api/fulfillment-requests` - List fulfillment requests

### Analytics & Reporting
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/profit` - Profit calculations
- `POST /api/analytics/calculate` - Custom calculations

### Communication
- `GET /api/admin/chats/:partnerId/messages` - Get chat messages
- `POST /api/chat/partners/:partnerId/message` - Send message
- `GET /api/notifications` - Get notifications

### Tier Management
- `GET /api/pricing-tiers` - Get available pricing tiers
- `POST /api/tier-upgrade-requests` - Request tier upgrade

## 👥 Foydalanish

## 🔑 **Login Ma'lumotlari**

### 👨‍💼 **Admin Panel**
```
Username: admin
Password: BiznesYordam2024!
Email: admin@biznesyordam.uz
```

### 👥 **Partner Dashboard**
```
Username: testpartner
Password: Partner2024!
Email: partner@biznesyordam.uz
```

## 📊 **Test Data**

Platformada quyidagi test ma'lumotlar mavjud:

### **Hamkor Ma'lumotlari:**
- **Biznes nomi:** Test Biznes
- **Kategoriya:** Electronics
- **Oylik daromad:** 25,000,000 so'm
- **Komissiya:** 20%

### **Mahsulotlar:**
- Samsung Galaxy S24 (15,000,000 so'm)
- Lenovo ThinkPad (8,500,000 so'm)
- Apple Watch (3,500,000 so'm)

### **Fulfillment Requests:**
- Pending: Samsung Galaxy S24
- Approved: Lenovo ThinkPad
- Completed: Apple Watch

### **Analytics:**
- Uzum: 54,400,000 so'm (96 buyurtma)
- Wildberries: 32,000,000 so'm (45 buyurtma)
- Yandex: 28,000,000 so'm (38 buyurtma)

## 🛡️ Xavfsizlik

- Session-based authentication
- Role-based access control
- API rate limiting
- Input validation
- SQL injection protection

## 📊 Monitoring

- Real-time analytics
- Error logging
- Performance monitoring
- Database health checks

## 🤝 Yordam

Muammolar yoki savollar uchun issue oching yoki admin bilan bog'laning.

## 📄 Litsenziya

MIT License
