# BiznesYordam Fulfillment Platform

**English** | [O'zbekcha](#uzbek)

A modern marketplace fulfillment services platform that enables partners to integrate marketplaces, manage products, and increase sales. Built with React, Express.js, and SQLite for development.

## 🚀 Features

### For Marketplace Partners
- **Partner Dashboard** - Comprehensive management interface
- **Marketplace Integration** - Seamlessly connect with Uzum Market, Wildberries, Yandex Market
- **Product Management** - Automated fulfillment request system
- **Real-time Analytics** - Detailed profit calculations and performance metrics
- **Tier-based Pricing** - Four pricing tiers with competitive commission rates
- **24/7 Support** - Multi-channel customer support

### For Administrators
- **Admin Panel** - Complete partner management and monitoring system
- **Real-time Chat** - Direct communication with partners
- **Advanced Analytics** - Business intelligence and reporting tools
- **Financial Management** - Revenue tracking and commission calculations

### Technical Features
- **Modern Architecture** - React + Express.js + SQLite/PostgreSQL
- **Real-time Updates** - WebSocket-powered notifications
- **Secure Authentication** - Session-based authentication with role-based access
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **API Integration** - Ready for marketplace API connections

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ (Latest LTS recommended)
- npm or yarn package manager
- SQLite (for development) or PostgreSQL (for production)

### Quick Start

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/biznesyordam-fulfillment.git
cd biznesyordam-fulfillment
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
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
