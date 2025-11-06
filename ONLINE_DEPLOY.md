# 🚀 BiznesYordam.uz - Online Deploy (BEPUL)

## ⚡ ENG OSON USUL - Render.com

### 1. Render.com'ga Kiring
👉 [https://render.com](https://render.com)
- "Get Started for Free" tugmasini bosing
- GitHub akkauntingiz bilan login qiling

### 2. New Web Service Yarating
- Dashboard'da **"New +"** tugmasini bosing
- **"Web Service"** ni tanlang
- **"Build and deploy from a Git repository"** ni tanlang

### 3. Repository'ni Ulang
- **"Connect GitHub"** tugmasini bosing
- `Sofsavdo/BiznesYordam.uz` repository'ni tanlang
- Yoki URL kiriting: `https://github.com/Sofsavdo/BiznesYordam.uz`

### 4. Sozlamalarni Kiriting

```
Name: biznesyordam
Region: Frankfurt (Europe) yoki Oregon (US West)
Branch: main
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Instance Type: Free (0$/month)
```

### 5. Environment Variables Qo'shing

"Advanced" → "Add Environment Variable" tugmasini bosing:

```bash
NODE_ENV = production
PORT = 5000
SESSION_SECRET = BiznesYordam2024SecretKey!
CORS_ORIGIN = https://biznesyordam.onrender.com
FRONTEND_ORIGIN = https://biznesyordam.onrender.com
VITE_API_URL = https://biznesyordam.onrender.com
```

### 6. Deploy Qiling!
- **"Create Web Service"** tugmasini bosing
- ☕ 5-10 daqiqa kutib turing (birinchi deploy uzoqroq davom etadi)
- ✅ Deploy tugagach, URL'ni oling

### 7. Loyihangiz Tayyor!

**URL**: `https://biznesyordam.onrender.com`

**Admin Panel**: `https://biznesyordam.onrender.com/admin-panel`
- Username: `admin`
- Password: `BiznesYordam2024!`

**Partner Dashboard**: `https://biznesyordam.onrender.com/partner-dashboard`
- Username: `testpartner`
- Password: `Partner2024!`

---

## 🎯 Boshqa Platformalar

### Railway.app (Tezroq)
1. [https://railway.app](https://railway.app) ga o'ting
2. "Start a New Project" → "Deploy from GitHub repo"
3. Repository'ni tanlang
4. Environment variables qo'shing (yuqoridagi kabi)
5. Deploy avtomatik boshlanadi

### Vercel (Frontend uchun yaxshi)
1. [https://vercel.com](https://vercel.com) ga o'ting
2. "Add New..." → "Project"
3. GitHub repository import qiling
4. Deploy tugmasini bosing

---

## ⚠️ Muhim Eslatmalar

### Bepul Plan Cheklovlari:
- **Render.com**: 15 daqiqa faoliyatsizlikdan keyin uxlaydi (birinchi so'rov 30 soniya oladi)
- **Railway.app**: Oyiga 500 soat bepul
- **Vercel**: Serverless functions (yaxshi ishlaydi)

### Database:
- SQLite avtomatik ishlatiladi (bepul)
- PostgreSQL kerak bo'lsa, Render.com'da bepul database yarating

### Custom Domain:
- Render.com'da custom domain bepul ulash mumkin
- Settings → Custom Domain → Add

---

## 🔍 Deploy Tekshirish

Deploy tugagach:

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Natija:
{"status":"healthy","environment":"production",...}
```

---

## 🐛 Muammolar?

### Build Failed
- Logs'ni o'qing
- Local'da `npm run build` ishlashini tekshiring

### App Ochilmayapti
- Environment variables to'g'ri kiritilganini tekshiring
- Logs'da xatolarni qidiring

### Database Error
- SQLite avtomatik yaratiladi
- Agar PostgreSQL kerak bo'lsa, DATABASE_URL qo'shing

---

## 📞 Yordam Kerakmi?

GitHub Issues: https://github.com/Sofsavdo/BiznesYordam.uz/issues

---

## ✅ Tayyor!

Loyihangiz endi online va butun dunyo ko'rishi mumkin! 🌍

Omad tilaymiz! 🚀
