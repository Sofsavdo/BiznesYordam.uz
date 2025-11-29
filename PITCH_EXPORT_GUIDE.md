# 📊 Investor Pitch Export Guide

## PPT (PowerPoint) Format ga O'tkazish

### Usul 1: PDF → PowerPoint (Eng Oson)

1. **PDF Yaratish:**
   - Browser'da pitch'ni oching: `http://localhost:5000/investor-pitch`
   - Har bir slaydga o'ting
   - Browser print: `Ctrl + P` (Windows) yoki `Cmd + P` (Mac)
   - "Save as PDF" tanlang
   - 20 ta slaydning har biri uchun alohida PDF yarating

2. **PDF'ni PPT ga konvert qilish:**
   - **Adobe Acrobat Pro:** File → Export To → Microsoft PowerPoint
   - **Online tools:** 
     - https://www.adobe.com/acrobat/online/pdf-to-ppt.html
     - https://www.ilovepdf.com/pdf_to_powerpoint
     - https://smallpdf.com/pdf-to-ppt

### Usul 2: Screenshot → PowerPoint (Eng Sifatli)

1. **Har bir slayddan screenshot oling:**
   - Windows: `Win + Shift + S` yoki Snipping Tool
   - Browser full-screen mode: `F11`
   - Har bir slaydni screenshot qiling (20 ta)

2. **PowerPoint'da:**
   - Yangi presentation oching
   - Har bir slide'ga screenshot'ni insert qiling
   - Slide size: 16:9 (Widescreen)
   - Picture → Format → "Fill Slide" qiling

### Usul 3: Google Slides → PowerPoint

1. **Google Slides'ga export:**
   - Chrome'da pitch'ni oching
   - Browser extension: "Save to Google Drive" yoki screenshot tool
   - Har bir slaydni Google Slides'ga import qiling

2. **PowerPoint'ga download:**
   - Google Slides: File → Download → Microsoft PowerPoint (.pptx)

---

## 🎨 PowerPoint Template Yaratish (Manual)

Agar siz o'zingiz PPT'da yaratmoqchi bo'lsangiz:

### Slide 1: Title
- Background: Qora gradient (Black → Dark Gray)
- Title: "SellerCloudX" (80pt, gradient: Blue → Purple → Green)
- Subtitle: "AI Fulfillment + Marketplace Operator"

### Slide 2-20: Content Slides
- Background: Qora + neon effects
- Title: 48-56pt, gradient text
- Subtitle: 24-28pt, gray
- Content: Cards with borders (Blue, Purple, Green)

### Colors:
- Primary Blue: #3B82F6
- Primary Purple: #A855F7
- Primary Green: #10B981
- Background: #000000 → #111827
- Text: #FFFFFF, #D1D5DB

### Fonts:
- Headings: **Inter Bold** yoki **Montserrat Bold**
- Body: **Inter Regular** yoki **Roboto**

---

## 📥 Web Pitch'dan To'g'ridan-To'g'ri Export (Kelajakda)

Men qo'shimcha export tugma qo'shishim mumkin:

```typescript
// Future feature: PPT Export button
<Button onClick={exportToPPT}>
  <Download className="mr-2" />
  PPT Formatda Yuklab Olish
</Button>
```

Bu quyidagi kutubxonalardan foydalanadi:
- **pptxgenjs** - JavaScript'dan PPT yaratish
- **html2canvas** - Har bir slaydni image ga convert qilish

Kerakmi? Qo'shayinmi?

---

## 🎯 Tavsiyalar

1. **Eng yaxshi sifat:** Screenshot usuli + manual PPT formatting
2. **Eng tez:** Browser print → PDF → PPT convert
3. **Professional:** Har bir slaydni qayta yaratish PPT'da (o'z branding bilan)

---

## ⚡ Hozirgi Web Pitch Afzalliklari

- ✅ Animatsiyalar (hover effects, gradients)
- ✅ Interactive navigation
- ✅ Responsive design
- ✅ Real-time demo data
- ✅ Har doim yangilanuvchi

**PowerPoint'dagi statik versiyadan ko'ra, web pitch investor uchun ko'proq ta'sir qiladi!**

---

Qaysi usulni tanlaysiz? Yoki men avtomatik export funksiyasini qo'shayinmi?
