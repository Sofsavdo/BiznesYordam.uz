import { db } from "./db";
import { users, partners, pricingTiers, sptCosts, commissionSettings, marketplaceApiConfigs, fulfillmentRequests } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { seedSystemSettings } from "./storage";
import { nanoid } from "nanoid";

async function seedData() {
  try {
    // ⚠️ PRODUCTION SAFETY: Only seed development data when explicitly in development mode
    if (process.env.NODE_ENV === 'production') {
      console.log("⚠️ Skipping seed data in production environment");
      console.log("⚠️ Production database should be initialized manually with secure credentials");
      return;
    }

    console.log("Seeding development data...");

    // Check if admin user already exists
    let admin = await db.select().from(users).where(eq(users.username, "admin")).then((rows: any[]) => rows[0]);
    
    if (!admin) {
      // Create admin user with secure credentials (DEVELOPMENT ONLY)
      const adminPassword = await bcrypt.hash("BiznesYordam2024!", 10);
      [admin] = await db.insert(users).values({
        id: nanoid(),
        username: "admin",
        email: "admin@biznesyordam.uz",
        password: adminPassword,
        firstName: "Bosh",
        lastName: "Admin",
        phone: "+998901234567",
        role: "admin",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      console.log("✅ [DEVELOPMENT] Admin user created successfully!");
      console.log("🔑 [DEVELOPMENT] Admin Login Credentials:");
      console.log("   Username: admin");
      console.log("   Password: BiznesYordam2024!");
      console.log("   Email: admin@biznesyordam.uz");
    } else {
      console.log("✅ [DEVELOPMENT] Admin user already exists");
      console.log("🔑 [DEVELOPMENT] Admin Login Credentials:");
      console.log("   Username: admin");
      console.log("   Password: BiznesYordam2024!");
      console.log("   Email: admin@biznesyordam.uz");
    }

    // Check if partner user already exists
    let partnerUser = await db.select().from(users).where(eq(users.username, "testpartner")).then((rows: any[]) => rows[0]);
    
    if (!partnerUser) {
      // Create test partner user (DEVELOPMENT ONLY)
      const partnerPassword = await bcrypt.hash("Partner2024!", 10);
      [partnerUser] = await db.insert(users).values({
        id: nanoid(),
        username: "testpartner",
        email: "partner@biznesyordam.uz",
        password: partnerPassword,
        firstName: "Test",
        lastName: "Partner",
        phone: "+998901234567",
        role: "partner",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      console.log("✅ [DEVELOPMENT] Partner user created successfully!");
      console.log("🔑 [DEVELOPMENT] Partner Login Credentials:");
      console.log("   Username: testpartner");
      console.log("   Password: Partner2024!");
      console.log("   Email: partner@biznesyordam.uz");
    } else {
      console.log("✅ [DEVELOPMENT] Partner user already exists");
      console.log("🔑 [DEVELOPMENT] Partner Login Credentials:");
      console.log("   Username: testpartner");
      console.log("   Password: Partner2024!");
      console.log("   Email: partner@biznesyordam.uz");
    }

    // Check if partner profile already exists
    let partner = await db.select().from(partners).where(eq(partners.userId, partnerUser.id)).then((rows: any[]) => rows[0]);
    
    if (!partner) {
      // Create partner profile
      [partner] = await db.insert(partners).values({
        id: nanoid(),
        userId: partnerUser.id,
        businessName: "Test Biznes",
        businessCategory: "electronics",
        monthlyRevenue: "25000000",
        pricingTier: "business_standard",
        commissionRate: "0.20", // YANGI: 20% savdodan (oldin foyda edi)
        isApproved: true,
        approvedBy: admin.id,
        approvedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      console.log("Partner profile created");
    } else {
      console.log("Partner profile already exists");
    }

    // Create sample fulfillment requests - temporarily disabled for SQLite compatibility
    console.log("Sample fulfillment requests handled by mockDb.ts");

    // Create sample marketplace integrations
    const existingIntegrations = await db.select().from(marketplaceApiConfigs);
    if (existingIntegrations.length === 0) {
      await db.insert(marketplaceApiConfigs).values([
        {
          partnerId: partner.id,
          marketplace: "uzum",
          apiKey: "uzum_api_key_123",
          apiSecret: "uzum_secret_456",
          shopId: "uzum_shop_001",
          status: "connected",
          lastSync: new Date(),
        },
        {
          partnerId: partner.id,
          marketplace: "wildberries",
          apiKey: "wb_api_key_789",
          apiSecret: "wb_secret_012",
          shopId: "wb_shop_002",
          status: "disconnected",
          lastSync: null,
        }
      ]);
      console.log("Sample marketplace integrations created");
    }

    // Check if pricing tiers exist
    const existingTiers = await db.select().from(pricingTiers);
    
    if (existingTiers.length === 0) {
      // Create pricing tiers - NEW PRICING MODEL (v3.0.0)
      // Updated: 6-Nov-2025
      // Commission now from REVENUE, not profit
      const pricingTiersData = [
      {
        tier: "starter_pro",
        nameUz: "Starter Pro",
        fixedCost: "2500000", // YANGI: 2.5M oylik to'lov
        commissionMin: "0.25", // YANGI: 25% savdodan
        commissionMax: "0.25",
        minRevenue: "10000000", // 10M
        maxRevenue: "30000000", // 30M
        features: JSON.stringify([
          "Oylik to'lov: 2,500,000 so'm",
          "Komissiya: 25% (savdodan)",
          "1 ta marketplace",
          "100 tagacha mahsulot",
          "Basic dashboard",
          "Ombor xizmati (100 kg)",
          "Email yordam (48 soat)",
          "Asosiy CRM"
        ]),
      },
      {
        tier: "business_standard",
        nameUz: "Business Standard",
        fixedCost: "5000000", // YANGI: 5M oylik to'lov
        commissionMin: "0.20", // YANGI: 20% savdodan
        commissionMax: "0.20",
        minRevenue: "30000000", // 30M
        maxRevenue: "100000000", // 100M
        features: JSON.stringify([
          "Oylik to'lov: 5,000,000 so'm",
          "Komissiya: 20% (savdodan)",
          "2 ta marketplace",
          "500 tagacha mahsulot",
          "To'liq dashboard",
          "Foyda/zarar tahlili",
          "Ombor xizmati (500 kg)",
          "Telefon yordam (24 soat)",
          "To'liq CRM",
          "Asosiy marketing",
          "Oylik konsultatsiya (2 soat)"
        ]),
      },
      {
        tier: "professional_plus",
        nameUz: "Professional Plus",
        fixedCost: "10000000", // YANGI: 10M oylik to'lov
        commissionMin: "0.15", // YANGI: 15% savdodan
        commissionMax: "0.15",
        minRevenue: "100000000", // 100M
        maxRevenue: "300000000", // 300M
        features: JSON.stringify([
          "Oylik to'lov: 10,000,000 so'm",
          "Komissiya: 15% (savdodan)",
          "4 ta marketplace",
          "2,000 tagacha mahsulot",
          "Premium dashboard",
          "AI-powered tahlil",
          "Trend hunter",
          "Shaxsiy menejer",
          "24/7 yordam (1 soat)",
          "Ombor xizmati (2,000 kg)",
          "Premium CRM",
          "To'liq marketing",
          "Haftalik konsultatsiya (4 soat/oy)"
        ]),
      },
      {
        tier: "enterprise_elite",
        nameUz: "Enterprise Elite",
        fixedCost: "20000000", // YANGI: 20M oylik to'lov
        commissionMin: "0.10", // YANGI: 10% savdodan
        commissionMax: "0.10",
        minRevenue: "300000000", // 300M
        maxRevenue: null, // Cheksiz
        features: JSON.stringify([
          "Oylik to'lov: 20,000,000 so'm",
          "Komissiya: 10% (savdodan)",
          "Barcha marketplace'lar",
          "Cheksiz mahsulot",
          "Enterprise dashboard",
          "Maxsus AI tahlil",
          "Shaxsiy jamoa (3-5 kishi)",
          "24/7 VIP yordam (30 daqiqa)",
          "Cheksiz ombor",
          "Enterprise CRM",
          "To'liq marketing va branding",
          "Kunlik konsultatsiya (20 soat/oy)",
          "Maxsus integratsiyalar",
          "Shaxsiy manager",
          "Kelishuv asosida narx",
          "Cheksiz aylanma",
          "Custom solutions",
          "API integratsiyalar",
          "Yuridik maslahatlar"
        ]),
      }
    ];

      await db.insert(pricingTiers).values(pricingTiersData);
      console.log("Pricing tiers created");
    } else {
      console.log("Pricing tiers already exist");
    }

    // Create sample SPT costs
    const existingSptCosts = await db.select().from(sptCosts);
    if (existingSptCosts.length === 0) {
      await db.insert(sptCosts).values([
        {
          productCategory: "electronics",
          marketplace: "uzum",
          weightRangeMin: "0",
          weightRangeMax: "1",
          costPerUnit: "15000",
          dimensionCategory: "small",
          notes: "2-3 kun yetkazib berish",
        },
        {
          productCategory: "electronics",
          marketplace: "uzum",
          weightRangeMin: "1",
          weightRangeMax: "5",
          costPerUnit: "25000",
          dimensionCategory: "medium",
          notes: "3-4 kun yetkazib berish",
        },
        {
          productCategory: "clothing",
          marketplace: "wildberries",
          weightRangeMin: "0",
          weightRangeMax: "1",
          costPerUnit: "12000",
          dimensionCategory: "small",
          notes: "5-7 kun yetkazib berish",
        },
        {
          productCategory: "home",
          marketplace: "yandex",
          weightRangeMin: "0",
          weightRangeMax: "10",
          costPerUnit: "35000",
          dimensionCategory: "large",
          notes: "7-10 kun yetkazib berish",
        }
      ]);
      console.log("Sample SPT costs created");
    }

    // Create sample commission settings
    const existingCommissions = await db.select().from(commissionSettings);
    if (existingCommissions.length === 0) {
      await db.insert(commissionSettings).values([
        {
          partnerId: partner.id,
          category: "electronics",
          marketplace: "uzum",
          commissionRate: "0.20", // YANGI: 20% savdodan (oldin foyda edi)
          createdBy: admin.id,
          isActive: true,
        },
        {
          partnerId: partner.id,
          category: "clothing",
          marketplace: "wildberries",
          commissionRate: "0.25",
          createdBy: admin.id,
          isActive: true,
        }
      ]);
      console.log("Sample commission settings created");
    }

    // Seed system settings
    await seedSystemSettings(admin.id);

    console.log("Data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
}

// Run seeding
seedData().catch(console.error);
