// server/services/fulfillmentAIIntegration.ts
// FULFILLMENT → AI MANAGER INTEGRATION

import { db } from '../db';
import aiManagerService from './aiManagerService';
import { calculateOptimalPrice } from './priceCalculationService';

interface FulfillmentProduct {
  id: number;
  partner_id: number;
  product_name: string;
  category: string;
  description?: string;
  cost_price: number; // Tannarx
  quantity: number;
  images?: string[];
  fulfillment_request_id: number;
}

/**
 * Fulfillment qabul qilingandan keyin AI Manager'ni ishga tushirish
 * Bu funksiya admin fulfillment'ni "accepted" holatiga o'tkazganda chaqiriladi
 */
export async function triggerAIForFulfillment(
  fulfillmentRequestId: number,
  adminId: string
) {
  console.log('\ud83e\udd16 Starting AI workflow for fulfillment:', fulfillmentRequestId);

  try {
    // 1. Get fulfillment request details
    const [fulfillmentRequest] = await db
      .select()
      .from('fulfillment_requests')
      .where({ id: fulfillmentRequestId });

    if (!fulfillmentRequest) {
      throw new Error(`Fulfillment request ${fulfillmentRequestId} not found`);
    }

    const partnerId = fulfillmentRequest.partner_id;

    // 2. Get partner info and tier
    const [partner] = await db
      .select()
      .from('partners')
      .where({ id: partnerId });

    if (!partner) {
      throw new Error(`Partner ${partnerId} not found`);
    }

    const partnerTier = partner.pricing_tier || 'starter_pro';

    // 3. Get partner's marketplace credentials
    const marketplaceCredentials = await db
      .select()
      .from('marketplace_credentials')
      .where({
        partner_id: partnerId,
        is_active: true,
        is_verified: true,
      });

    if (marketplaceCredentials.length === 0) {
      console.log('\u26a0\ufe0f No marketplace credentials found for partner:', partnerId);
      // Don't throw error, just log warning
      // Admin can manually trigger later
      return {
        success: false,
        message: 'No verified marketplace credentials',
        productsProcessed: 0,
      };
    }

    // 4. Get products from fulfillment request
    const products = await db
      .select()
      .from('fulfillment_request_items')
      .where({ fulfillment_request_id: fulfillmentRequestId });

    if (products.length === 0) {
      throw new Error('No products in fulfillment request');
    }

    console.log(`\ud83d\udce6 Processing ${products.length} products for ${marketplaceCredentials.length} marketplaces`);

    const results: any[] = [];

    // 5. For each product, create AI-generated cards for all marketplaces
    for (const product of products) {
      // Process each marketplace
      for (const credential of marketplaceCredentials) {
        const marketplaceType = credential.marketplace_type as any;

        try {
          // Calculate optimal price using our intelligent price calculator
          const priceResult = calculateOptimalPrice({
            costPrice: parseFloat(product.cost_price || '0'),
            productCategory: product.category || 'default',
            marketplaceType,
            partnerTier,
            targetMargin: 0.25, // 25% default profit margin
          });

          console.log(`\ud83d\udcb0 Price calculated for ${product.product_name} on ${marketplaceType}:`, priceResult.recommendedPrice);

          // Generate AI product card
          const aiResult = await aiManagerService.generateProductCard(
            {
              name: product.product_name,
              category: product.category || 'general',
              description: product.description || '',
              price: priceResult.recommendedPrice,
              images: product.images ? JSON.parse(product.images as string) : [],
              targetMarketplace: marketplaceType,
            },
            partnerId
          );

          if (aiResult.success) {
            results.push({
              product: product.product_name,
              marketplace: marketplaceType,
              status: 'generated',
              productId: aiResult.productId,
              price: priceResult.recommendedPrice,
              seoScore: aiResult.data?.seoScore || 0,
            });

            // Log AI action
            await db.insert('ai_actions_log').values({
              partner_id: partnerId,
              marketplace_type: marketplaceType,
              action_type: 'product_created_from_fulfillment',
              action_description: `AI created product card for ${product.product_name} on ${marketplaceType}`,
              before_state: { fulfillmentRequestId, productId: product.id },
              after_state: aiResult.data,
              impact_level: 'high',
              estimated_impact: `Product ready for ${marketplaceType} marketplace`,
              ai_reasoning: priceResult.strategy,
              confidence_level: aiResult.data?.seoScore || 0,
              was_successful: true,
            });
          }
        } catch (error: any) {
          console.error(`\u274c Error processing ${product.product_name} for ${marketplaceType}:`, error.message);
          results.push({
            product: product.product_name,
            marketplace: marketplaceType,
            status: 'error',
            error: error.message,
          });
        }
      }
    }

    // 6. Update fulfillment request with AI processing status
    await db
      .update('fulfillment_requests')
      .set({
        ai_processed: true,
        ai_processed_at: new Date(),
        ai_processing_notes: JSON.stringify(results),
      })
      .where({ id: fulfillmentRequestId });

    const successCount = results.filter((r) => r.status === 'generated').length;
    const errorCount = results.filter((r) => r.status === 'error').length;

    console.log(`\u2705 AI workflow completed: ${successCount} success, ${errorCount} errors`);

    return {
      success: true,
      message: `AI processed ${successCount} product cards`,
      productsProcessed: successCount,
      errors: errorCount,
      details: results,
    };
  } catch (error: any) {
    console.error('\u274c AI workflow error:', error.message);
    throw error;
  }
}

/**
 * Manually trigger AI for a specific product
 * Admin can use this to retry failed products
 */
export async function manuallyTriggerAIForProduct(
  productId: number,
  marketplaceType: string,
  adminId: string
) {
  console.log(`\ud83d\udd04 Manually triggering AI for product ${productId} on ${marketplaceType}`);

  try {
    // Get product details from fulfillment_request_items
    const [product] = await db
      .select()
      .from('fulfillment_request_items')
      .where({ id: productId });

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    const partnerId = product.partner_id;

    // Get partner tier
    const [partner] = await db
      .select()
      .from('partners')
      .where({ id: partnerId });

    if (!partner) {
      throw new Error(`Partner ${partnerId} not found`);
    }

    // Calculate price
    const priceResult = calculateOptimalPrice({
      costPrice: parseFloat(product.cost_price || '0'),
      productCategory: product.category || 'default',
      marketplaceType: marketplaceType as any,
      partnerTier: partner.pricing_tier || 'starter_pro',
      targetMargin: 0.25,
    });

    // Generate AI product card
    const aiResult = await aiManagerService.generateProductCard(
      {
        name: product.product_name,
        category: product.category || 'general',
        description: product.description || '',
        price: priceResult.recommendedPrice,
        images: product.images ? JSON.parse(product.images as string) : [],
        targetMarketplace: marketplaceType as any,
      },
      partnerId
    );

    if (aiResult.success) {
      await db.insert('ai_actions_log').values({
        partner_id: partnerId,
        marketplace_type: marketplaceType,
        action_type: 'manual_product_creation',
        action_description: `Admin manually triggered AI for ${product.product_name}`,
        before_state: { productId, triggeredBy: adminId },
        after_state: aiResult.data,
        impact_level: 'medium',
        estimated_impact: 'Manual product card generation',
        ai_reasoning: priceResult.strategy,
        confidence_level: aiResult.data?.seoScore || 0,
        was_successful: true,
      });
    }

    return {
      success: true,
      message: 'AI product card generated',
      productId: aiResult.productId,
      data: aiResult.data,
    };
  } catch (error: any) {
    console.error('\u274c Manual AI trigger error:', error.message);
    throw error;
  }
}

export default {
  triggerAIForFulfillment,
  manuallyTriggerAIForProduct,
};
