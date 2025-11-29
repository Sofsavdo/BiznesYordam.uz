# 🧪 COMPREHENSIVE TESTING SCRIPT

## Prerequisites
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 3. Set up database
npm run db:push
npm run db:seed

# 4. Start Redis (if using Redis)
redis-server

# 5. Build the project
npm run build
```

## 🚀 START THE APPLICATION

```bash
# Terminal 1: Start the server
npm run dev

# Terminal 2: (Optional) Watch logs
tail -f logs/combined.log
```

## ✅ MANUAL TESTING CHECKLIST

### 1. AUTHENTICATION TESTS

#### Test 1.1: User Registration
- [ ] Navigate to `/register`
- [ ] Fill in: Name, Email, Password
- [ ] Click "Ro'yxatdan o'tish"
- [ ] **Expected:** Redirect to dashboard, session created
- [ ] **Check:** User appears in database

#### Test 1.2: User Login
- [ ] Navigate to `/login`
- [ ] Enter credentials
- [ ] Click "Kirish"
- [ ] **Expected:** Redirect to appropriate dashboard
- [ ] **Check:** Session cookie set

#### Test 1.3: Admin Login
- [ ] Login with admin credentials (from seed data)
- [ ] **Expected:** Access to Admin Panel
- [ ] **Check:** Can see all partners and products

#### Test 1.4: Logout
- [ ] Click logout button
- [ ] **Expected:** Redirect to home, session cleared
- [ ] **Check:** Cannot access protected routes

---

### 2. PARTNER DASHBOARD TESTS

#### Test 2.1: View Products
- [ ] Login as partner
- [ ] Navigate to "Mahsulotlar" tab
- [ ] **Expected:** See list of products
- [ ] **Check:** Products load from database

#### Test 2.2: Create Product
- [ ] Click "Yangi Mahsulot"
- [ ] Fill in product details
- [ ] Upload images
- [ ] Click "Saqlash"
- [ ] **Expected:** Product created successfully
- [ ] **Check:** Product appears in list

#### Test 2.3: Edit Product
- [ ] Click edit on existing product
- [ ] Modify details
- [ ] Save changes
- [ ] **Expected:** Changes saved
- [ ] **Check:** Updated data in database

#### Test 2.4: Delete Product
- [ ] Click delete on product
- [ ] Confirm deletion
- [ ] **Expected:** Product removed
- [ ] **Check:** Product deleted from database

#### Test 2.5: View Analytics
- [ ] Navigate to "Analitika" tab
- [ ] **Expected:** See charts and statistics
- [ ] **Check:** Data loads from analytics table

#### Test 2.6: Marketplace Credentials
- [ ] Navigate to "Sozlamalar" tab
- [ ] Add marketplace credentials
- [ ] Test connection
- [ ] **Expected:** Credentials saved encrypted
- [ ] **Check:** Can connect to marketplace

---

### 3. ADMIN PANEL TESTS

#### Test 3.1: View All Partners
- [ ] Login as admin
- [ ] Navigate to "Hamkorlar" tab
- [ ] **Expected:** See all partners
- [ ] **Check:** Partner count matches database

#### Test 3.2: Approve/Reject Products
- [ ] Navigate to "Mahsulotlar" tab
- [ ] Find pending product
- [ ] Click approve/reject
- [ ] **Expected:** Status updated
- [ ] **Check:** Partner notified

#### Test 3.3: View System Analytics
- [ ] Navigate to "Analitika" tab
- [ ] **Expected:** See system-wide statistics
- [ ] **Check:** Revenue, users, products data

#### Test 3.4: AI Manager Monitoring
- [ ] Navigate to "AI Manager" tab
- [ ] **Expected:** See live AI activity feed
- [ ] **Check:** WebSocket connection established
- [ ] **Check:** Real-time updates appear

#### Test 3.5: AI Command Center
- [ ] In AI Manager tab, use command center
- [ ] Send command to AI
- [ ] **Expected:** AI responds
- [ ] **Check:** Activity logged

---

### 4. AI FEATURES TESTS

#### Test 4.1: AI Product Card Generation
- [ ] Create new product
- [ ] Click "AI yordami"
- [ ] **Expected:** AI generates title, description
- [ ] **Check:** SEO score calculated
- [ ] **Check:** Activity appears in AI monitor

#### Test 4.2: AI Price Optimization
- [ ] Select product
- [ ] Click "Narxni optimallashtirish"
- [ ] **Expected:** AI suggests optimal price
- [ ] **Check:** Competitor prices fetched
- [ ] **Check:** Profit margin calculated

#### Test 4.3: Auto Marketplace Upload
- [ ] Select product
- [ ] Choose marketplace
- [ ] Click "Avtomatik yuklash"
- [ ] **Expected:** Product uploaded to marketplace
- [ ] **Check:** Marketplace integration called
- [ ] **Check:** Upload status tracked

---

### 5. MARKETPLACE INTEGRATION TESTS

#### Test 5.1: Uzum Integration
- [ ] Add Uzum credentials
- [ ] Test connection
- [ ] **Expected:** Connection successful
- [ ] **Check:** Can fetch products
- [ ] **Check:** Can upload product

#### Test 5.2: Wildberries Integration
- [ ] Add Wildberries credentials
- [ ] Test connection
- [ ] **Expected:** Connection successful
- [ ] **Check:** API calls work

#### Test 5.3: Yandex Market Integration
- [ ] Add Yandex credentials
- [ ] Test connection
- [ ] **Expected:** Connection successful
- [ ] **Check:** Product sync works

#### Test 5.4: Ozon Integration
- [ ] Add Ozon credentials
- [ ] Test connection
- [ ] **Expected:** Connection successful
- [ ] **Check:** Orders sync

---

### 6. WEBSOCKET TESTS

#### Test 6.1: Real-time AI Updates
- [ ] Open Admin Panel > AI Manager
- [ ] Trigger AI task (create product)
- [ ] **Expected:** Activity appears immediately
- [ ] **Check:** No page refresh needed

#### Test 6.2: Stats Updates
- [ ] Watch AI stats card
- [ ] Complete AI task
- [ ] **Expected:** Stats update in real-time
- [ ] **Check:** Active workers, queue count change

#### Test 6.3: Connection Resilience
- [ ] Disconnect internet
- [ ] Reconnect
- [ ] **Expected:** WebSocket reconnects automatically
- [ ] **Check:** Updates resume

---

### 7. TRENDING PRODUCTS TESTS

#### Test 7.1: View Trending Products
- [ ] Navigate to trending products section
- [ ] **Expected:** See list of trending items
- [ ] **Check:** Data from database or real APIs

#### Test 7.2: Analyze Trend
- [ ] Click on trending product
- [ ] View analysis
- [ ] **Expected:** See profit calculation, trend score
- [ ] **Check:** AI prediction included

#### Test 7.3: Scan for Trends
- [ ] Click "Scan Trends"
- [ ] **Expected:** System scans markets
- [ ] **Check:** New trends added to database

---

### 8. PERFORMANCE TESTS

#### Test 8.1: Page Load Speed
- [ ] Open homepage
- [ ] **Expected:** Load < 2 seconds
- [ ] **Check:** Network tab in DevTools

#### Test 8.2: API Response Time
- [ ] Make API request
- [ ] **Expected:** Response < 500ms
- [ ] **Check:** Network tab timing

#### Test 8.3: Concurrent Users
- [ ] Open 10 browser tabs
- [ ] Login to each
- [ ] **Expected:** All work smoothly
- [ ] **Check:** No crashes or slowdowns

---

### 9. ERROR HANDLING TESTS

#### Test 9.1: Invalid Login
- [ ] Try login with wrong password
- [ ] **Expected:** Error message shown
- [ ] **Check:** No crash, helpful message

#### Test 9.2: Network Error
- [ ] Disconnect internet
- [ ] Try to load data
- [ ] **Expected:** Graceful error message
- [ ] **Check:** App doesn't crash

#### Test 9.3: Invalid Form Data
- [ ] Submit form with missing fields
- [ ] **Expected:** Validation errors shown
- [ ] **Check:** Form doesn't submit

---

### 10. SECURITY TESTS

#### Test 10.1: Unauthorized Access
- [ ] Try to access `/admin` without login
- [ ] **Expected:** Redirect to login
- [ ] **Check:** No data exposed

#### Test 10.2: CSRF Protection
- [ ] Check session cookies
- [ ] **Expected:** HttpOnly, Secure flags set
- [ ] **Check:** CSRF tokens present

#### Test 10.3: SQL Injection
- [ ] Try SQL injection in search
- [ ] **Expected:** Query sanitized
- [ ] **Check:** No database error

---

## 🤖 AUTOMATED TESTS

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- storage.test.ts
npm test -- api.test.ts
npm test -- email.test.ts

# Run with coverage
npm run test:coverage
```

## 📊 EXPECTED RESULTS

### Success Criteria
- ✅ All authentication flows work
- ✅ CRUD operations on products work
- ✅ AI features generate valid output
- ✅ Marketplace integrations connect
- ✅ WebSocket updates in real-time
- ✅ No console errors
- ✅ Page load < 2s
- ✅ API response < 500ms
- ✅ 95%+ test coverage

### Known Issues to Fix
- ⚠️ Trending analytics uses fallback data (need real APIs)
- ⚠️ Some TypeScript type errors in analytics
- ⚠️ Missing type definitions for some packages

## 🐛 BUG REPORTING

If you find bugs, document:
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots/logs**
5. **Browser/environment**

## 📝 TEST RESULTS LOG

Date: ___________
Tester: ___________

| Test Category | Pass | Fail | Notes |
|--------------|------|------|-------|
| Authentication | ☐ | ☐ | |
| Partner Dashboard | ☐ | ☐ | |
| Admin Panel | ☐ | ☐ | |
| AI Features | ☐ | ☐ | |
| Marketplace Integrations | ☐ | ☐ | |
| WebSocket | ☐ | ☐ | |
| Trending Products | ☐ | ☐ | |
| Performance | ☐ | ☐ | |
| Error Handling | ☐ | ☐ | |
| Security | ☐ | ☐ | |

**Overall Status:** ___________
**Ready for Production:** YES / NO
**Blocker Issues:** ___________
