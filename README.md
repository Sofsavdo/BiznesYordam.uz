# 🚀 BiznesYordam - O'zbekiston Marketplace Fulfillment Platform

> 2025-09-16 • Version 2.0.1: Production fixes applied (auth/session cookies, CORS allow-list, chat route deduplication, partner dashboard stats partnerId resolution, marketplace storage alignment). After pulling latest main, restart the server and ensure `CORS_ORIGIN` and `SESSION_SECRET` are configured.

**Professional marketplace fulfillment platform for Uzbekistan businesses**

[![Production Status](https://img.shields.io/badge/Status-Production%20Ready-green)](https://biznes-yordam.onrender.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![Framework](https://img.shields.io/badge/Framework-React%20%2B%20Express-orange)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-green)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🌟 **Platform Overview**

BiznesYordam is a comprehensive fulfillment platform designed specifically for Uzbekistan's growing e-commerce ecosystem. It connects businesses with marketplace opportunities across Uzum, Wildberries, Yandex Market, and Ozon.

### ✨ **Key Features**

- 🛒 **Multi-Marketplace Integration** - Uzum, Wildberries, Yandex, Ozon
- 📊 **Real-time Analytics** - Profit tracking, trend analysis
- 💬 **Live Chat System** - WebSocket-powered communication with file sharing
- 🎯 **Tier-based Access** - Starter Pro to Enterprise Elite
- 🔐 **Secure Authentication** - Role-based access control with audit logging
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **Production Ready** - Real PostgreSQL database with fallback
- 🔄 **Real-time Updates** - WebSocket connections with heartbeat monitoring
- 📁 **File Management** - Chat file uploads and document sharing
- 📈 **Advanced Analytics** - Profit breakdown and trending products

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
│   │   ├── hooks/         # Custom React hooks (useAuth, useWebSocket)
│   │   ├── lib/           # Utilities and API client
│   │   └── pages/         # Application pages
│   └── package.json
├── server/                # Express Backend (TypeScript)
│   ├── routes.ts          # API routes with enhanced error handling
│   ├── storage.ts         # Database layer
│   ├── websocket.ts       # WebSocket manager with heartbeat
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Drizzle ORM schemas
├── start.sh               # Automated startup script
└── package.json           # Root package configuration
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Automated Setup (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/your-username/BiznesYordam.uz.git
cd BiznesYordam.uz
```

2. **Run the automated startup script**
```bash
./start.sh
```

This script will automatically:
- ✅ Check Node.js and npm versions
- ✅ Install all dependencies
- ✅ Setup environment configuration
- ✅ Initialize database with schema
- ✅ Seed initial data
- ✅ Build the application
- ✅ Start the development server
- ✅ Perform health checks

### Manual Setup

1. **Install dependencies**
```bash
npm install
cd client && npm install && cd ..
```

2. **Environment Setup**
```bash
# Copy environment file
cp env.example .env

# Configure your database and settings
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-ultra-secure-session-key
NODE_ENV=development
```

3. **Database Setup**
```bash
# Push schema to database
npm run db:push

# Seed initial data
npm run seed
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
npm start
```

## 📋 **Available Scripts**

| Command | Description |
|---------|-------------|
| `./start.sh` | Automated startup with all setup steps |
| `npm run dev` | Start development servers (client + server) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migrations |
| `npm run seed` | Seed database with initial data |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run check` | TypeScript type checking |

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
- **WebSocket** - Real-time communication

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Production database
- **SQLite** - Development fallback
- **WebSocket** - Real-time communication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### Infrastructure
- **PostgreSQL** - Primary database
- **Express Session** - Authentication
- **CORS** - Cross-origin requests
- **Rate Limiting** - API protection
- **WebSocket** - Real-time features
- **File Upload** - Document sharing

## 🎯 **Business Tiers**

| Tier | Features | Commission |
|------|----------|------------|
| **Starter Pro** | Basic dashboard, product management | 30% |
| **Business Standard** | + Profit analytics, full reports | 25% |
| **Professional Plus** | + Trend hunter, advanced analytics | 20% |
| **Enterprise Elite** | + Premium features, priority support | 15% |

## 🛡️ **Security Features**

- ✅ Session-based authentication with secure cookies
- ✅ Role-based access control (admin, partner, customer)
- ✅ CORS protection with configurable origins
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation & sanitization with Zod
- ✅ SQL injection prevention with Drizzle ORM
- ✅ XSS protection
- ✅ Audit logging for all actions
- ✅ Password hashing with bcryptjs
- ✅ Secure WebSocket connections

## 📈 **Performance Optimizations**

- ✅ Database connection pooling (20 connections)
- ✅ Query optimization with indexes
- ✅ Frontend code splitting
- ✅ Image lazy loading
- ✅ Caching strategies
- ✅ Gzip compression
- ✅ WebSocket heartbeat monitoring
- ✅ Real-time message delivery
- ✅ File upload optimization

## 💬 **Real-time Chat Features**

- ✅ WebSocket-powered messaging
- ✅ File uploads and sharing
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ Message history
- ✅ Real-time notifications
- ✅ Heartbeat monitoring
- ✅ Auto-reconnection
- ✅ Message validation
- ✅ Admin-partner communication

## 🔧 **Recent Improvements**

### Authentication & Security
- ✅ Enhanced error handling with error codes
- ✅ Improved session management
- ✅ Better validation with detailed error messages
- ✅ Audit logging for all user actions
- ✅ Secure logout with session cleanup

### WebSocket Communication
- ✅ Heartbeat monitoring (30s intervals)
- ✅ Auto-reconnection with exponential backoff
- ✅ Connection status tracking
- ✅ Message validation and sanitization
- ✅ File upload support in chat
- ✅ Typing indicators
- ✅ Online status tracking

### Database & Storage
- ✅ SQLite fallback for development
- ✅ Automatic table creation
- ✅ Better error handling
- ✅ Connection pooling
- ✅ Query optimization

### UI/UX Improvements
- ✅ Fixed TypeScript compatibility issues
- ✅ Enhanced chat interface
- ✅ Better responsive design
- ✅ Improved error messages
- ✅ Loading states and feedback

### Development Experience
- ✅ Automated startup script
- ✅ Comprehensive environment configuration
- ✅ Better build process
- ✅ Health checks
- ✅ Development tools integration

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

## 🚀 **Quick Access**

After starting the application:

- **Main Site:** http://localhost:5000
- **Admin Panel:** http://localhost:5000/admin-panel
- **Partner Dashboard:** http://localhost:5000/partner-dashboard
- **Partner Registration:** http://localhost:5000/partner-registration

### Default Login Credentials:
- **Admin:** admin / BiznesYordam2024!
- **Partner:** testpartner / Partner2024!
"# Biznesyordam.uz" 
