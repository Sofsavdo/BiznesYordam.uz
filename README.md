# 🚀 BiznesYordam - O'zbekiston Marketplace Fulfillment Platform

**Professional marketplace fulfillment platform for Uzbekistan businesses**

[![Production Status](https://img.shields.io/badge/Status-Production%20Ready-green)](https://biznes-yordam.onrender.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![Framework](https://img.shields.io/badge/Framework-React%20%2B%20Express-orange)](https://reactjs.org/)

## 🌟 **Platform Overview**

BiznesYordam is a comprehensive fulfillment platform designed specifically for Uzbekistan's growing e-commerce ecosystem. It connects businesses with marketplace opportunities across Uzum, Wildberries, Yandex Market, and Ozon.

### ✨ **Key Features**

- 🛒 **Multi-Marketplace Integration** - Uzum, Wildberries, Yandex, Ozon
- 📊 **Real-time Analytics** - Profit tracking, trend analysis
- 💬 **Live Chat System** - WebSocket-powered communication
- 🎯 **Tier-based Access** - Starter Pro to Enterprise Elite
- 🔐 **Secure Authentication** - Role-based access control
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **Production Ready** - Real PostgreSQL database

## 🔑 **Default Credentials**

### Admin Access
```
URL: /admin-panel
Username: admin
Password: BiznesYordam2024!
Email: admin@biznesyordam.uz
```

### Test Partner
```
URL: /partner-dashboard  
Username: testpartner
Password: Partner2024!
Email: partner@biznesyordam.uz
```

## 🏗️ **Architecture**

```
BiznesYordam/
├── client/                 # React Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and API client
│   │   └── pages/         # Application pages
│   └── package.json
├── server/                # Express Backend (TypeScript)
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database layer
│   ├── websocket.ts       # WebSocket manager
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Drizzle ORM schemas
└── package.json           # Root package configuration
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/BiznesYordam.uz.git
cd BiznesYordam.uz
```

2. **Install dependencies**
```bash
npm install
cd client && npm install && cd ..
```

3. **Environment Setup**
```bash
# Copy environment file
cp .env.example .env

# Configure your database and settings
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-ultra-secure-session-key
NODE_ENV=production
```

4. **Database Setup**
```bash
# Push schema to database
npm run db:push

# Seed initial data
npm run seed
```

5. **Start Development Server**
```bash
npm run dev
```

6. **Build for Production**
```bash
npm run build
npm start
```

## 📋 **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers (client + server) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migrations |
| `npm run seed` | Seed database with initial data |
| `npm run db:studio` | Open Drizzle Studio |

## 🌐 **Production Deployment**

### Render.com (Current)
```yaml
services:
  - type: web
    name: biznes-yordam
    env: node
    plan: starter
    branch: main
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: SESSION_SECRET
        generateValue: true
```

### Environment Variables
```bash
# Required
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
NODE_ENV=production

# Optional
FRONTEND_ORIGIN=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
PORT=5000
```

## 📊 **Tech Stack**

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Headless components
- **TanStack Query** - Data fetching
- **Lucide React** - Icon library

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Production database
- **WebSocket** - Real-time communication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### Infrastructure
- **PostgreSQL** - Primary database
- **Express Session** - Authentication
- **CORS** - Cross-origin requests
- **Rate Limiting** - API protection
- **WebSocket** - Real-time features

## 🎯 **Business Tiers**

| Tier | Features | Commission |
|------|----------|------------|
| **Starter Pro** | Basic dashboard, product management | 30% |
| **Business Standard** | + Profit analytics, full reports | 25% |
| **Professional Plus** | + Trend hunter, advanced analytics | 20% |
| **Enterprise Elite** | + Premium features, priority support | 15% |

## 🛡️ **Security Features**

- ✅ Session-based authentication
- ✅ Role-based access control
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation & sanitization
- ✅ SQL injection prevention
- ✅ XSS protection

## 📈 **Performance Optimizations**

- ✅ Database connection pooling
- ✅ Query optimization with indexes
- ✅ Frontend code splitting
- ✅ Image lazy loading
- ✅ Caching strategies
- ✅ Gzip compression

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 **Support & Contact**

- **Email:** admin@biznes-yordam.uz
- **Telegram:** @biznes_yordam_support
- **Website:** [BiznesYordam.uz](https://biznes-yordam.onrender.com)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⚡ Built with ❤️ for Uzbekistan's entrepreneurial ecosystem**

*Empowering businesses to thrive in the digital marketplace*
