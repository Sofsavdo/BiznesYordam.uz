# Railway Deployment Guide - SellerCloudX

## Tuzatilgan Muammolar

### 1. ✅ Registratsiya Funksiyasi
- **Muammo**: Database'ga saqlanmayotgan edi
- **Sabab**: `phone` field required edi lekin yuborilmayotgan edi
- **Yechim**: `createPartner` funksiyasiga `phone` parametri qo'shildi

### 2. ✅ Login Funksiyasi
- **Muammo**: Kirish tugmalari ishlamayotgan edi
- **Sabab**: Error handling to'g'ri emas edi
- **Yechim**: Login flow'ga console logging va error handling yaxshilandi

### 3. ✅ Bosh Sahifaga O'tish
- **Muammo**: Registratsiyadan keyin bosh sahifaga o'tmayotgan edi
- **Sabab**: `setLocation` ishlamayotgan edi
- **Yechim**: `window.location.href` ishlatildi

### 4. ✅ Session Management
- **Muammo**: Session saqlanmayotgan edi
- **Yechim**: Session config to'g'ri sozlandi, PostgreSQL session store qo'shildi

## Railway Deployment Qadamlari

### 1. Railway Project Yaratish

```bash
# Railway CLI o'rnatish (agar yo'q bo'lsa)
npm install -g @railway/cli

# Login qilish
railway login

# Project yaratish
railway init
```

### 2. PostgreSQL Database Qo'shish

Railway Dashboard'da:
1. **New** → **Database** → **PostgreSQL**
2. Database yaratilgandan keyin `DATABASE_URL` avtomatik o'rnatiladi

### 3. Environment Variables Sozlash

Railway Dashboard → **Variables** bo'limida quyidagilarni qo'shing:

```env
NODE_ENV=production
SESSION_SECRET=your-ultra-secure-random-string-here-min-32-chars
DATABASE_AUTO_SETUP=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_EMAIL=admin@sellercloudx.com
```

**Muhim**: 
- `PORT` o'rnatmang - Railway avtomatik beradi
- `DATABASE_URL` avtomatik o'rnatiladi PostgreSQL qo'shganingizda

### 4. Deploy Qilish

```bash
# Git commit
git add .
git commit -m "Fix: Registration, login, and navigation issues"

# Railway'ga push
git push railway main
```

Yoki Railway CLI orqali:

```bash
railway up
```

### 5. Database Migration

Deploy bo'lgandan keyin, Railway Dashboard'da **Deployments** → **View Logs** orqali migration loglarini ko'ring.

Agar migration avtomatik ishlamasa:

```bash
# Railway shell'ga kirish
railway shell

# Migration ishga tushirish
npm run db:push
```

### 6. Admin User Yaratish

Admin user avtomatik yaratiladi `initAdmin.ts` orqali. Agar yaratilmasa:

```bash
railway shell
npm run seed
```

## Test Qilish

### 1. Registratsiya Test

1. `/partner-registration` sahifasiga o'ting
2. Formani to'ldiring:
   - Ism: Test
   - Familiya: Partner
   - Email: test@example.com
   - Telefon: +998901234567
   - Username: testpartner
   - Parol: test123456
   - Biznes Nomi: Test Business
3. "Ro'yxatdan O'tish" tugmasini bosing
4. Muvaffaqiyatli bo'lsa, bosh sahifaga yo'naltiriladi

### 2. Login Test

1. `/` yoki `/login` sahifasiga o'ting
2. Test credentials:
   - Username: `testpartner`
   - Parol: `partner123`
3. "Kirish" tugmasini bosing
4. Partner dashboard'ga yo'naltiriladi

### 3. Admin Login Test

1. `/admin-login` sahifasiga o'ting
2. Admin credentials:
   - Username: `admin`
   - Parol: `admin123` (yoki siz o'rnatgan parol)
3. "Kirish" tugmasini bosing
4. Admin panel'ga yo'naltiriladi

## Monitoring

### Logs Ko'rish

```bash
# Real-time logs
railway logs

# Yoki Dashboard'da
# Deployments → View Logs
```

### Database Ko'rish

```bash
# Railway shell'ga kirish
railway shell

# Database console
npm run db:studio
```

## Troubleshooting

### 1. 404 Errors

**Muammo**: API endpoints 404 qaytaradi

**Yechim**:
- Server ishga tushganini tekshiring: `railway logs`
- `NODE_ENV=production` o'rnatilganini tekshiring
- Build muvaffaqiyatli bo'lganini tekshiring

### 2. Session Issues

**Muammo**: Login qilgandan keyin session saqlanmaydi

**Yechim**:
- PostgreSQL database ulangan bo'lishi kerak
- `SESSION_SECRET` o'rnatilgan bo'lishi kerak
- `session` table yaratilgan bo'lishi kerak

### 3. Database Connection Errors

**Muammo**: Database'ga ulanib bo'lmaydi

**Yechim**:
```bash
# Railway shell'da
railway shell

# Database URL tekshirish
echo $DATABASE_URL

# Migration qayta ishga tushirish
npm run db:push
```

### 4. Build Failures

**Muammo**: Build muvaffaqiyatsiz

**Yechim**:
```bash
# Local'da test qiling
npm run build

# Agar xato bo'lsa, loglarni ko'ring
railway logs --deployment
```

## Production Checklist

- [ ] PostgreSQL database qo'shilgan
- [ ] Environment variables to'g'ri sozlangan
- [ ] `SESSION_SECRET` o'rnatilgan (min 32 chars)
- [ ] Admin credentials o'rnatilgan
- [ ] Database migration muvaffaqiyatli
- [ ] Admin user yaratilgan
- [ ] Registratsiya ishlaydi
- [ ] Login ishlaydi
- [ ] Session saqlanadi
- [ ] Admin panel ochiladi
- [ ] Partner dashboard ochiladi

## Custom Domain (Optional)

Railway Dashboard'da:
1. **Settings** → **Domains**
2. **Custom Domain** → Domain nomini kiriting
3. DNS settings:
   - Type: `CNAME`
   - Name: `@` yoki `www`
   - Value: Railway bergan domain

## Support

Muammolar bo'lsa:
- Railway Logs: `railway logs`
- Database Studio: `npm run db:studio`
- GitHub Issues: Repository'da issue oching
