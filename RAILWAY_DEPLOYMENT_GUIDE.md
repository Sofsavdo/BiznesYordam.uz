# 🚂 RAILWAY.COM DEPLOYMENT - SellerCloudX

## ✅ NEGA RAILWAY?

**Afzalliklar:**
- ✅ **UXLAMAYDI!** (Render free tier uxlaydi)
- ✅ $5/oy bepul credit
- ✅ Fast deployment
- ✅ PostgreSQL bepul
- ✅ Auto SSL
- ✅ Custom domain bepul
- ✅ GitHub auto-deploy

---

## 📋 KETMA-KET QADAMLAR

### STEP 1: RAILWAY ACCOUNT

1. **Saytga kiring:** https://railway.app
2. **Sign up with GitHub** (tugmani bosing)
3. **GitHub authorize** qiling
4. Dashboard ochiladi

---

### STEP 2: YANGI PROJECT YARATISH

1. **"New Project"** tugmasini bosing
2. **"Deploy from GitHub repo"** ni tanlang
3. **Sizning repository** ni tanlang:
   - Repository: `your-username/sellercloudx`
   - Branch: `main`
4. **"Deploy Now"** bosing

---

### STEP 3: DATABASE YARATISH

**Railway Projectingizda:**

1. **"New"** tugmasi → **"Database"** → **"Add PostgreSQL"**
2. PostgreSQL service yaratiladi
3. **Avtomatik environment variable** yaratiladi:
   - `DATABASE_URL` (internal)
   - `PGHOST`, `PGPORT`, `PGUSER`, etc.

✅ **Siz hech narsa qilishingiz shart emas - avtomatik!**

---

### STEP 4: ENVIRONMENT VARIABLES

**Railway Dashboard:**

1. Sizning **web service** ni tanlang (Node.js)
2. **"Variables"** tab ga o'ting
3. Quyidagilarni **qo'shing:**

```bash
# === CRITICAL VARIABLES ===

NODE_ENV=production

# Database (Railway avtomatik qo'shadi, lekin check qiling)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Session Secret (generate qiling)
SESSION_SECRET=sellercloudx-super-secret-key-railway-2024-production

# Emergent LLM Key
EMERGENT_LLM_KEY=sk-emergent-c0d5c506030Fa49400

# Server
PORT=3000

# AI Models
TEXT_MODEL=claude-4-sonnet-20250514
IMAGE_MODEL=gpt-image-1

# CORS (Railway domain)
CORS_ORIGIN=https://sellercloudx-production.up.railway.app,https://sellercloudx.com,https://www.sellercloudx.com
FRONTEND_ORIGIN=https://sellercloudx-production.up.railway.app
```

---

### STEP 5: BUILD & START COMMANDS

**Railway Dashboard:**

1. Sizning service → **"Settings"** tab
2. **"Build Command"**:
   ```bash
   npm install && npm run build
   ```

3. **"Start Command"**:
   ```bash
   npm start
   ```

4. **"Root Directory"**: (bo'sh qoldiring)

5. **"Watch Paths"**: (bo'sh qoldiring - barcha fayllar)

---

### STEP 6: DEPLOY!

**Avtomatik deploy boshlanadi:**

1. Railway GitHub dan code tortadi
2. `npm install` bajaradi
3. `npm run build` bajaradi
4. `npm start` ishga tushiradi
5. URL beradi: `https://yourproject.up.railway.app`

**Logs kuzating:**
- Dashboard → Your service → "Deployments"
- Real-time logs ko'rinadi

**Kutish:** 3-5 daqiqa

---

### STEP 7: DATABASE MIGRATION

**Railway Console:**

1. Railway service → **"Settings"** → **"Raw Editor"**
2. Yoki local dan migrate:

```bash
# Local
export DATABASE_URL="postgresql://..."
npm run db:migrate
```

**Yoki Railway automatically runs:**
- Bizning `server/db.ts` da auto-migration bor!
- Server start bo'lganda avtomatik 38 ta table yaratadi ✅

---

### STEP 8: CUSTOM DOMAIN (sellercloudx.com)

**Railway Dashboard:**

1. Service → **"Settings"** → **"Networking"**
2. **"Custom Domain"** → **"Add Domain"**
3. Enter: `sellercloudx.com`
4. Railway sizga **CNAME** beradi

**Namecheap:**

1. **Domain List** → sellercloudx.com → **"Manage"**
2. **"Advanced DNS"** tab
3. **Add Records:**

```
Type: CNAME
Host: www
Value: sellercloudx-production.up.railway.app
TTL: Automatic

Type: CNAME  
Host: @
Value: sellercloudx-production.up.railway.app
TTL: Automatic
```

**Yoki A Record (agar Railway IP bersa):**
```
Type: A
Host: @
Value: [Railway IP]
TTL: Automatic
```

4. **Save**
5. **Kutish:** 5-60 daqiqa

**SSL:**
- Railway avtomatik yaratadi ✅
- Let's Encrypt
- Auto-renew

---

### STEP 9: VERIFY!

**Test URLs:**
```
✅ Railway URL: https://yourproject.up.railway.app
✅ Custom domain: https://sellercloudx.com
✅ WWW: https://www.sellercloudx.com
```

**Logs check:**
```
🔧 Checking database tables...
📦 Creating database tables...
✅ All tables created successfully!
✅ Default admin user created
✅ Test partner user created
🚀 Server running on port 3000
```

---

## 💰 XARAJATLAR

**Railway Pricing:**
- **$5/oy FREE credit** ✅
- Usage-based billing
- Birinchi loyihalar: **BEPUL!** (credit bilan)

**Taxminiy (oylik):**
- Small traffic: $0-5 (free credit)
- Medium (100-500 users): $10-20
- High (1000+ users): $30-50

**Render vs Railway:**
```
Render Free:  Uxlaydi ❌
Railway Free: Uxlamaydi ✅

Render $7:    512MB RAM
Railway ~$10: 512MB+ RAM, better performance
```

---

## 🔑 ADMIN CREDENTIALS

**Railway deploy bo'lgandan keyin:**

Admin Login:
- URL: https://sellercloudx.com/admin-login
- Username: `admin`
- Password: `admin123`

**Partner Test:**
- URL: https://sellercloudx.com/
- "Kirish" → "Hamkor Kirish"
- Yangi registration qiling!

---

## 🎯 DEPLOY CHECKLIST

**Before Deploy:**
- ✅ Git push (barcha o'zgarishlar)
- ✅ Build local test
- ✅ Environment variables tayyorlang

**During Deploy:**
- ✅ Railway project yarating
- ✅ PostgreSQL add qiling
- ✅ Variables set qiling
- ✅ Deploy boshlang

**After Deploy:**
- ✅ Logs check
- ✅ Database migration confirm
- ✅ Admin login test
- ✅ Registration test
- ✅ Domain connect

---

## 🚨 TROUBLESHOOTING

**Agar build fail bo'lsa:**
- Logs → Build logs check
- npm install errors?
- TypeScript errors?

**Agar server start bo'lmasa:**
- DATABASE_URL to'g'ri?
- PORT=3000 set qilganmisiz?
- Logs check!

**Agar 500 errors:**
- Database connected?
- Tables created?
- Environment variables check!

---

**RAILWAY BILAN DEPLOY QILING - UXLAMAYDI!** 🚂✅
