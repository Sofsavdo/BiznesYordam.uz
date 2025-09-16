# BiznesYordam.uz Hosting Deployment Guide

## Eskiz.uz cPanel Hosting uchun Joylash Qo'llanmasi

### 1. Tizim Talablari

- **Node.js**: 18.x yoki undan yuqori versiya
- **NPM**: 9.x yoki undan yuqori versiya
- **Disk maydoni**: Kamida 500MB
- **RAM**: Kamida 512MB
- **SSL sertifikat**: HTTPS uchun

### 2. Loyihani Tayyorlash

#### 2.1 Deployment Script ishga tushirish
```bash
./deploy-to-hosting.sh
```

Bu script quyidagilarni bajaradi:
- Production build yaratadi
- Package.json ni production uchun sozlaydi
- Environment fayllarini o'rnatadi
- Kerakli papkalarni yaratadi
- Database setup qiladi

### 3. cPanel orqali Joylash

#### 3.1 File Manager orqali
1. cPanel'ga kirish
2. **File Manager** ni ochish
3. `public_html` papkasiga o'tish
4. Barcha fayllarni yuklash:
   - `dist/` papkasi (build qilingan fayllar)
   - `package.json`
   - `.env`
   - `.htaccess`
   - `start.sh`
   - `ecosystem.config.js` (agar PM2 ishlatilsa)

#### 3.2 FTP orqali
```bash
# FTP ma'lumotlari (eskiz.uz dan olingan)
Host: ftp.biznesyordam.uz
Username: your_username
Password: your_password
Port: 21

# Yuklash
scp -r dist/ username@ftp.biznesyordam.uz:/public_html/
scp package.json username@ftp.biznesyordam.uz:/public_html/
scp .env username@ftp.biznesyordam.uz:/public_html/
scp .htaccess username@ftp.biznesyordam.uz:/public_html/
```

### 4. Node.js Sozlamalari

#### 4.1 Node.js Versiyasini Tekshirish
```bash
node --version
npm --version
```

#### 4.2 Dependencies O'rnatish
```bash
cd /home/yourusername/public_html
npm install --production
```

#### 4.3 Database Setup
```bash
npm run db:push
npm run seed
```

### 5. Server Ishga Tushirish

#### 5.1 Oddiy Ishga Tushirish
```bash
cd /home/yourusername/public_html
NODE_ENV=production node dist/index.js
```

#### 5.2 PM2 bilan (Tavsiya etiladi)
```bash
# PM2 o'rnatish
npm install -g pm2

# Application ishga tushirish
pm2 start ecosystem.config.js

# PM2 ni avtomatik ishga tushirish
pm2 startup
pm2 save
```

### 6. Domain va SSL Sozlamalari

#### 6.1 Domain Sozlash
1. cPanel'da **Subdomains** yoki **Addon Domains**
2. `biznesyordam.uz` ni qo'shish
3. Document Root: `/home/yourusername/public_html`

#### 6.2 SSL Sertifikat
1. cPanel'da **SSL/TLS**
2. **Let's Encrypt** yoki **AutoSSL** yoqish
3. `biznesyordam.uz` uchun sertifikat olish

### 7. Apache Sozlamalari

#### 7.1 .htaccess Fayli
`.htaccess` fayli allaqachon yaratilgan va quyidagi funksiyalarni bajaradi:
- Node.js server uchun proxy
- Static fayllar uchun cache
- Gzip compression
- Security headers

#### 7.2 mod_rewrite Yoqish
cPanel'da **Apache Modules** orqali `mod_rewrite` ni yoqish kerak.

### 8. Environment Variables

#### 8.1 .env Fayli
Production uchun `.env.production` fayli yaratilgan. Quyidagi o'zgarishlarni kiritish kerak:

```env
# Muhim o'zgarishlar
SESSION_SECRET=your-very-secure-secret-key-here
DATABASE_URL=sqlite://./data/biznesyordam.db
VITE_API_URL=https://biznesyordam.uz
CORS_ORIGIN=https://biznesyordam.uz,https://www.biznesyordam.uz
```

### 9. Monitoring va Logs

#### 9.1 Log Fayllari
```bash
# Application logs
tail -f logs/app.log

# PM2 logs
pm2 logs biznesyordam

# Error logs
tail -f logs/error.log
```

#### 9.2 Health Check
```bash
# Server holatini tekshirish
curl https://biznesyordam.uz/api/health

# Database holatini tekshirish
curl https://biznesyordam.uz/api/status
```

### 10. Xavfsizlik Sozlamalari

#### 10.1 Firewall
- Faqat 80, 443, 22 portlarini ochiq qoldirish
- SSH access ni cheklash

#### 10.2 File Permissions
```bash
# Fayl huquqlarini o'rnatish
chmod 644 .env
chmod 755 dist/
chmod 755 data/
chmod 755 uploads/
```

### 11. Backup Strategiyasi

#### 11.1 Database Backup
```bash
# SQLite database backup
cp data/biznesyordam.db backups/biznesyordam_$(date +%Y%m%d).db
```

#### 11.2 File Backup
```bash
# Barcha fayllarni backup qilish
tar -czf backup_$(date +%Y%m%d).tar.gz dist/ data/ uploads/ .env
```

### 12. Troubleshooting

#### 12.1 Umumiy Muammolar

**Server ishlamayapti:**
```bash
# Port tekshirish
netstat -tlnp | grep :5000

# Process tekshirish
ps aux | grep node
```

**Database xatolari:**
```bash
# Database faylini tekshirish
ls -la data/
sqlite3 data/biznesyordam.db ".tables"
```

**CORS xatolari:**
- `.env` faylida `CORS_ORIGIN` ni tekshirish
- Browser console'da xatolarni ko'rish

#### 12.2 Log Fayllarini Ko'rish
```bash
# Application logs
tail -f logs/app.log

# PM2 logs
pm2 logs

# Apache error logs
tail -f /var/log/apache2/error.log
```

### 13. Performance Optimization

#### 13.1 Caching
- Static fayllar uchun browser cache
- API responses uchun Redis (ixtiyoriy)

#### 13.2 Compression
- Gzip compression `.htaccess` da yoqilgan
- Image optimization

### 14. Support va Yordam

Agar muammolar yuzaga kelsa:
1. Log fayllarini tekshirish
2. Browser console'da xatolarni ko'rish
3. Network tab'da API so'rovlarini tekshirish
4. cPanel error logs'ni ko'rish

---

## Tezkor Bosqichlar

1. ✅ `./deploy-to-hosting.sh` ishga tushirish
2. ✅ Fayllarni cPanel'ga yuklash
3. ✅ Node.js dependencies o'rnatish
4. ✅ Database setup qilish
5. ✅ PM2 bilan server ishga tushirish
6. ✅ SSL sertifikat o'rnatish
7. ✅ Domain sozlash
8. ✅ Test qilish

**Sizning saytingiz https://biznesyordam.uz da ishga tushadi!** 🎉