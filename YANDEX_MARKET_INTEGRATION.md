# 🛒 YANDEX MARKET INTEGRATSIYA QO'LLANMASI

## 📋 UMUMIY MA'LUMOT

Yandex Market - Rossiyaning eng katta onlayn marketplace platformalaridan biri. SellerCloudX orqali Yandex Market bilan to'liq integratsiya qilish mumkin.

---

## 🔑 API KALITLARNI OLISH

### 1-QADAM: Yandex Partner Kabinetga Kirish

1. https://partner.market.yandex.ru/ ga kiring
2. Yandex akkauntingiz bilan login qiling
3. Magazin (kampaniya) tanlang

### 2-QADAM: OAuth Token Yaratish

Yandex Market API OAuth 2.0 autentifikatsiyadan foydalanadi.

**OAuth Token Olish:**

1. **Yandex OAuth ga o'ting:**
   - https://oauth.yandex.ru/

2. **Application yarating:**
   - "Зарегистрировать новое приложение" tugmasini bosing
   - Nom: "SellerCloudX Integration"
   - Platform: "Веб-сервисы"
   - Callback URL: `https://yourdomain.com/callback` (ixtiyoriy)

3. **Scope tanlang:**
   - ✅ `market:partner-api` - Asosiy API
   - ✅ `market:partner-api.readonly` - Faqat o'qish (ixtiyoriy)

4. **Application ID va Secret oling:**
   - Client ID: `abc123...`
   - Client Secret: `xyz789...`

5. **OAuth Token oling:**
   
   **A. Browser orqali (Oddiy):**
   ```
   https://oauth.yandex.ru/authorize?response_type=token&client_id=YOUR_CLIENT_ID&scope=market:partner-api
   ```
   
   Browser ochiladi → Ruxsat bering → Token URL'da ko'rinadi
   
   **B. cURL orqali (Advanced):**
   ```bash
   curl -X POST https://oauth.yandex.ru/token \
     -d "grant_type=client_credentials" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET"
   ```

6. **Token nusxalang:**
   ```
   OAuth Token: y0_AgAAAAA...
   ```

### 3-QADAM: Campaign ID Olish

1. Partner kabinetda "Настройки" → "API" ga o'ting
2. Campaign ID ko'rsatilgan bo'ladi
3. Misol: `12345678`

---

## 🔌 SELLERCLOUDX GA ULASH

### Frontend Orqali (Hamkor)

1. **SellerCloudX kabinetga kiring**
2. **"Integratsiyalar" bo'limiga o'ting**
3. **"Yandex Market" ni tanlang**
4. **Credentials kiriting:**
   ```
   OAuth Token: y0_AgAAAAA...
   Campaign ID: 12345678
   ```
5. **"Ulanishni Tekshirish" tugmasini bosing**
6. **Saqlang**

### API Orqali (Developer)

```bash
POST /api/marketplace-integration/connect

{
  "marketplace": "yandex",
  "credentials": {
    "apiKey": "y0_AgAAAAA...",
    "campaignId": "12345678"
  }
}
```

---

## 📊 YANDEX MARKET API IMKONIYATLARI

### 1. Mahsulotlar (Offers)

**Mahsulotlarni Olish:**
```typescript
const products = await yandexIntegration.getProducts();
```

**Mahsulot Yaratish:**
```typescript
const productId = await yandexIntegration.createProduct({
  sku: "PROD-001",
  name: "Mahsulot nomi",
  category: "Elektronika",
  price: 50000,
  images: ["https://example.com/image.jpg"],
  brand: "Samsung",
  description: "Mahsulot tavsifi"
});
```

**Mahsulot Yangilash:**
```typescript
await yandexIntegration.syncProduct("PROD-001", {
  name: "Yangi nom",
  price: 55000
});
```

### 2. Narxlar

**Narxni Yangilash:**
```typescript
await yandexIntegration.updatePrice("PROD-001", 60000);
```

### 3. Inventar (Stocks)

**Inventarni Yangilash:**
```typescript
await yandexIntegration.updateStock("PROD-001", 100);
```

### 4. Buyurtmalar (Orders)

**Buyurtmalarni Olish:**
```typescript
const orders = await yandexIntegration.getOrders(
  new Date('2025-01-01'),
  new Date('2025-12-31')
);
```

### 5. Statistika

**Umumiy Statistika:**
```typescript
const stats = await yandexIntegration.getStats();
// {
//   totalOrders: 150,
//   totalRevenue: 7500000,
//   totalProducts: 200,
//   activeProducts: 180
// }
```

### 6. Omborlar (Warehouses)

**Omborlar Ro'yxati:**
```typescript
const warehouses = await yandexIntegration.getWarehouses();
```

---

## 🤖 AVTOMATIK INTEGRATSIYA

### Avtomatizatsiyani Yoqish

```bash
POST /api/autonomous/start

{
  "enabledMarketplaces": ["yandex"],
  "autoSync": true,
  "autoGenerateCards": true,
  "autoPublish": false,
  "syncInterval": 60
}
```

### Avtomatik Jarayon

1. **Har 60 daqiqada:**
   - Yandex Market'dan mahsulotlarni yig'adi
   - Yangi mahsulotlarni database'ga saqlaydi
   - Mavjud mahsulotlarni yangilaydi

2. **Yangi mahsulot topilganda:**
   - AI bilan tahlil qiladi
   - Rus tilida kontent yaratadi
   - Rasm generatsiya qiladi
   - Kartochka yaratadi

3. **Kartochka tayyor bo'lganda:**
   - Hamkor tasdiqlashi uchun kutadi
   - Yoki avtomatik nashr qiladi (agar yoqilgan bo'lsa)

---

## 📝 YANDEX MARKET QOIDALARI

### Mahsulot Talablari

1. **Nom (Name):**
   - Minimal: 1 belgi
   - Maksimal: 512 belgi
   - Brendni kiritish tavsiya etiladi

2. **Narx (Price):**
   - Minimal: 1 RUB
   - Valyuta: RUB (Rubl)
   - Chegirmalar qo'llab-quvvatlanadi

3. **Rasm (Images):**
   - Format: JPG, PNG
   - Minimal o'lcham: 600x600 px
   - Maksimal: 10 MB
   - Oq fon tavsiya etiladi

4. **Kategoriya (Category):**
   - Yandex kategoriya ID kerak
   - To'g'ri kategoriya tanlash muhim

5. **Tavsif (Description):**
   - Minimal: 10 belgi
   - Maksimal: 3000 belgi
   - HTML qo'llab-quvvatlanmaydi

### Taqiqlangan So'zlar

- "Eng yaxshi"
- "Kafolatlangan"
- "100% original"
- "Bepul yetkazib berish" (agar yo'q bo'lsa)
- Raqobatchilar nomlari

---

## 🔧 TROUBLESHOOTING

### Xatolik: "Invalid OAuth token"

**Sabab:** Token muddati tugagan yoki noto'g'ri

**Yechim:**
1. Yangi OAuth token oling
2. SellerCloudX'da yangilang
3. Ulanishni qayta tekshiring

### Xatolik: "Campaign not found"

**Sabab:** Campaign ID noto'g'ri

**Yechim:**
1. Partner kabinetda Campaign ID tekshiring
2. To'g'ri ID kiriting
3. Kampaniya faol ekanligini tekshiring

### Xatolik: "Insufficient permissions"

**Sabab:** OAuth scope yetarli emas

**Yechim:**
1. OAuth application'da scope'larni tekshiring
2. `market:partner-api` scope qo'shing
3. Yangi token oling

### Xatolik: "Rate limit exceeded"

**Sabab:** Juda ko'p so'rov yuborilgan

**Yechim:**
1. Sinxronizatsiya intervalini oshiring (120 daqiqa)
2. Bir necha daqiqa kuting
3. Batch size'ni kamaytiring

---

## 📊 YANDEX MARKET STATISTIKASI

### Buyurtma Statuslari

| Status | Ma'nosi | SellerCloudX Status |
|--------|---------|---------------------|
| PLACING | Joylashtirilmoqda | new |
| RESERVED | Zahiralangan | confirmed |
| PROCESSING | Qayta ishlanmoqda | processing |
| DELIVERY | Yetkazilmoqda | shipped |
| PICKUP | Olib ketishga tayyor | ready |
| DELIVERED | Yetkazildi | delivered |
| CANCELLED | Bekor qilindi | cancelled |
| RETURNED | Qaytarildi | returned |

### Mahsulot Holatlari

| Holat | Ma'nosi |
|-------|---------|
| ACTIVE | Faol, sotuvda |
| INACTIVE | Nofaol, sotuvda emas |
| ARCHIVED | Arxivlangan |
| DELETED | O'chirilgan |

---

## 💰 YANDEX MARKET KOMISSIYASI

### Komissiya Stavkalari (Kategoriyaga qarab)

| Kategoriya | Komissiya |
|------------|-----------|
| Elektronika | 5-15% |
| Kiyim | 10-20% |
| Uy-ro'zg'or | 8-15% |
| Kitoblar | 5-10% |
| Sport | 10-18% |

**Eslatma:** Aniq stavkalar Yandex Market shartnomasida ko'rsatilgan.

---

## 🎯 BEST PRACTICES

### 1. Mahsulot Nomlari

✅ **Yaxshi:**
```
Samsung Galaxy S24 Ultra 256GB Black
```

❌ **Yomon:**
```
TELEFON!!! ENG YAXSHI NARX!!!
```

### 2. Tavsiflar

✅ **Yaxshi:**
```
Samsung Galaxy S24 Ultra - флагманский смартфон с:
- Экран 6.8" Dynamic AMOLED 2X
- Процессор Snapdragon 8 Gen 3
- Камера 200 МП
- Батарея 5000 мАч
```

❌ **Yomon:**
```
Telefon juda yaxshi! Sotib oling!
```

### 3. Rasmlar

✅ **Yaxshi:**
- Oq fon
- Yuqori sifat (1000x1000 px)
- Mahsulot markazda
- Turli burchaklar

❌ **Yomon:**
- Qora fon
- Past sifat
- Watermark
- Noaniq

---

## 🚀 KEYINGI QADAMLAR

### Hozir

1. ✅ OAuth token oling
2. ✅ Campaign ID toping
3. ✅ SellerCloudX'ga ulang
4. ✅ Ulanishni tekshiring

### 1 Hafta

1. ⏳ Mahsulotlarni sinxronlang
2. ⏳ AI kartochkalar yarating
3. ⏳ Birinchi mahsulotni nashr qiling
4. ⏳ Buyurtmalarni kuzating

### 1 Oy

1. ⏳ Avtomatizatsiyani to'liq yoqing
2. ⏳ Statistikani tahlil qiling
3. ⏳ Narxlarni optimallang
4. ⏳ Yangi mahsulotlar qo'shing

---

## 📞 YORDAM

### Yandex Market Support

- **Email:** partner@market.yandex.ru
- **Telefon:** 8 (800) 234-24-80
- **Chat:** Partner kabinetda
- **Docs:** https://yandex.ru/dev/market/partner-api/doc/

### SellerCloudX Support

- **Email:** support@sellercloudx.com
- **Telegram:** @sellercloudx_support
- **Chat:** Kabinetdagi chat
- **Remote Access:** Admin masofadan yordam

---

## 📚 QOIDA RESURSLAR

### Rasmiy Dokumentatsiya

- **Partner API:** https://yandex.ru/dev/market/partner-api/doc/
- **OAuth:** https://yandex.ru/dev/oauth/
- **Partner Help:** https://yandex.ru/support/marketplace/

### Foydali Havolalar

- **Partner Kabinet:** https://partner.market.yandex.ru/
- **Seller University:** https://education.market.yandex.ru/
- **API Status:** https://status.market.yandex.ru/

---

## ✅ CHECKLIST

### Integratsiya Tayyor

- [ ] OAuth token olingan
- [ ] Campaign ID topilgan
- [ ] SellerCloudX'ga ulangan
- [ ] Ulanish test qilingan
- [ ] Mahsulotlar sinxronlangan
- [ ] Birinchi kartochka yaratilgan
- [ ] Avtomatizatsiya yoqilgan

### Optimallash

- [ ] Mahsulot nomlari optimallashtirilgan
- [ ] Rasmlar yuqori sifatli
- [ ] Tavsiflar to'liq
- [ ] Narxlar raqobatbardosh
- [ ] Kategoriyalar to'g'ri
- [ ] Inventar yangilangan

---

**Yandex Market bilan muvaffaqiyatli savdo qiling!** 🎉

**SellerCloudX Team**
*O'zbekistondagi birinchi AI-powered marketplace platform*
