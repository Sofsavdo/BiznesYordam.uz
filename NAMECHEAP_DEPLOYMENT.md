# 🚀 SellerCloudX - Namecheap Hosting Deployment Guide

## Domain: sellercloudx.com

---

## 📋 Pre-Deployment Checklist

### ✅ Namecheap'da mavjud:
- [x] Domain: sellercloudx.com
- [x] 1 yillik hosting

### ✅ Loyihada tayyor:
- [x] Production-ready kod
- [x] .env.production fayli
- [x] Build scripts
- [x] Database migrations

---

## 🔧 1-QADAM: Loyihani Build Qilish

### Windows PowerShell'da:

```powershell
# Loyiha papkasiga o'ting
cd "c:\Users\Acer\Biznes Yordam Final\BiznesYordam.uz"

# Dependencies'larni o'rnatish (agar kerak bo'lsa)
npm install

# Production build
npm run build

# Build natijasini tekshirish
npm run build:verify
```

### Build muvaffaqiyatli bo'lsa:
- ✅ `dist/` papka yaratiladi
- ✅ `dist/public/` - frontend fayllari
- ✅ `dist/index.js` - backend server

---

## 📦 2-QADAM: Fayllarni Tayyorlash

### Namecheap'ga yuklash uchun kerakli fayllar:

```
sellercloudx-production/
├── dist/
│   ├── public/          # Frontend (HTML, CSS, JS)
│   └── index.js         # Backend server
├── node_modules/        # Dependencies
├── package.json
├── package-lock.json
├── .env.production      # Environment variables
├── production.db        # SQLite database (bo'sh)
└── uploads/            # Upload folder
```

---

## 🌐 3-QADAM: Namecheap cPanel Setup

### A. cPanel'ga kirish:
1. Namecheap account → Hosting List
2. "Manage" tugmasini bosing
3. cPanel'ga kiring

### B. Node.js Application Setup:

#### 1. Node.js Selector:
- **Software** → **Setup Node.js App**
- **Create Application** tugmasini bosing

#### 2. Application Settings:
```
Node.js version: 18.x yoki 20.x
Application mode: Production
Application root: sellercloudx
Application URL: sellercloudx.com
Application startup file: dist/index.js
```

#### 3. Environment Variables:
cPanel'da quyidagi environment variables'larni qo'shing:

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=sqlite:./production.db
SESSION_SECRET=SellerCloudX-2024-Ultra-Secure-Production-Key
FRONTEND_ORIGIN=https://sellercloudx.com
VITE_API_URL=https://sellercloudx.com
CORS_ORIGIN=https://sellercloudx.com,https://www.sellercloudx.com
DATABASE_AUTO_SETUP=true
```

### C. File Manager orqali yuklash:

#### 1. Zip fayl yaratish (Windows):
```powershell
# PowerShell'da
Compress-Archive -Path "dist", "node_modules", "package.json", "package-lock.json", ".env.production" -DestinationPath "sellercloudx-deploy.zip"
```

#### 2. cPanel File Manager:
- **File Manager** → `public_html/sellercloudx/`
- **Upload** → `sellercloudx-deploy.zip`
- **Extract** zip faylni

#### 3. Permissions:
```bash
# Terminal orqali
chmod -R 755 dist/
chmod -R 777 uploads/
chmod 644 production.db
```

---

## 🗄️ 4-QADAM: Database Setup

### SQLite (Dastlabki):

```bash
# cPanel Terminal
cd ~/public_html/sellercloudx
touch production.db
chmod 644 production.db
```

### Database migratsiyalarini ishga tushirish:

```bash
# Node.js app terminal
npm run db:push
```

### Admin user yaratish:

```bash
# Yoki manual SQL
sqlite3 production.db
```

```sql
-- Admin user (username: admin, password: admin123)
INSERT INTO users (username, password, role, email) 
VALUES ('admin', '$2a$10$...', 'admin', 'admin@sellercloudx.com');
```

---

## 🚀 5-QADAM: Application'ni Ishga Tushirish

### cPanel Node.js App Manager:

1. **Setup Node.js App** sahifasiga qayting
2. Sizning app'ingizni toping
3. **Start** tugmasini bosing
4. **Status: Running** ko'rinishi kerak

### Restart qilish:
```bash
# cPanel Terminal
cd ~/public_html/sellercloudx
npm run start
```

---

## 🔗 6-QADAM: Domain Configuration

### A. DNS Settings (Namecheap):

1. **Domain List** → **Manage** → **Advanced DNS**
2. Quyidagi records'larni qo'shing:

```
Type    Host    Value                       TTL
A       @       [Your cPanel IP]            Automatic
A       www     [Your cPanel IP]            Automatic
CNAME   www     sellercloudx.com            Automatic
```

### B. SSL Certificate:

cPanel'da:
1. **Security** → **SSL/TLS Status**
2. **Run AutoSSL** (Let's Encrypt)
3. sellercloudx.com uchun SSL'ni enable qiling

---

## ✅ 7-QADAM: Testing

### 1. Website'ni tekshirish:
```
https://sellercloudx.com
```

### 2. API'ni tekshirish:
```
https://sellercloudx.com/api/health
```

### 3. Login:
```
Username: admin
Password: admin123
```

### 4. Asosiy funksiyalar:
- [ ] Ro'yxatdan o'tish ishlaydi
- [ ] Login ishlaydi
- [ ] Dashboard ochiladi
- [ ] Mahsulot qo'shish ishlaydi
- [ ] Fulfillment calculator ishlaydi

---

## 🔧 Troubleshooting

### 1. "Application not running":
```bash
# cPanel Terminal
cd ~/public_html/sellercloudx
npm install
npm run start
```

### 2. "Database error":
```bash
# Permissions
chmod 644 production.db
chmod 755 dist/
```

### 3. "CORS error":
- .env.production'da CORS_ORIGIN tekshiring
- Restart qiling

### 4. "Module not found":
```bash
# Dependencies'larni qayta o'rnatish
rm -rf node_modules
npm install --production
```

---

## 📊 Monitoring

### cPanel Metrics:
- **Metrics** → **CPU and Concurrent Connection Usage**
- **Resource Usage** → Memory, CPU

### Logs:
```bash
# Application logs
tail -f ~/public_html/sellercloudx/logs/app.log

# Error logs
tail -f ~/public_html/sellercloudx/logs/error.log
```

---

## 🔄 Updates va Maintenance

### Yangi versiyani deploy qilish:

```powershell
# Local'da
npm run build

# Zip yaratish
Compress-Archive -Path "dist" -DestinationPath "dist-update.zip"

# cPanel File Manager orqali yuklash va extract
```

### Database backup:

```bash
# cPanel Terminal
cd ~/public_html/sellercloudx
cp production.db production.db.backup-$(date +%Y%m%d)
```

---

## 📞 Support

### Namecheap Support:
- Live Chat: 24/7
- Ticket: support.namecheap.com

### SellerCloudX Team:
- Email: support@sellercloudx.com
- Telegram: @sellercloudx

---

## 🎯 Next Steps

1. ✅ Deploy qilish
2. ✅ Testing
3. 📧 Email SMTP sozlash
4. 💳 Payment gateway (Payme, Click)
5. 📱 Telegram bot
6. 📈 Analytics (Google Analytics)
7. 🚀 Marketing boshlash

---

**SellerCloudX - Production Ready! 🚀**
