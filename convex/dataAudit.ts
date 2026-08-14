import { query } from "./_generated/server";
import { v } from "convex/values";

// Read-only data audit for price validation
export const auditPriceData = query({
  handler: async (ctx) => {
    const results = {
      invalidProductPrices: [] as any[],
      invalidProductOriginalPrices: [] as any[],
      invalidOrderQuantities: [] as any[],
      invalidStoreDeliveryFees: [] as any[],
      invalidStoreMinOrderAmounts: [] as any[],
    };

    // Check products with price <= 0
    const products = await ctx.db.query("products").collect();
    for (const product of products) {
      if (product.price <= 0) {
        results.invalidProductPrices.push({
          productId: product._id,
          name: product.name,
          price: product.price,
        });
      }
      if (product.originalPrice !== undefined && product.originalPrice < product.price) {
        results.invalidProductOriginalPrices.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
        });
      }
    }

    // Check orders with quantity <= 0
    const orders = await ctx.db.query("orders").collect();
    for (const order of orders) {
      for (const item of order.items) {
        if (item.quantity <= 0) {
          results.invalidOrderQuantities.push({
            orderId: order._id,
            productId: item.productId,
            quantity: item.quantity,
          });
        }
      }
    }

    // Check stores with deliveryFee < 0
    const stores = await ctx.db.query("stores").collect();
    for (const store of stores) {
      if (store.deliveryFee < 0) {
        results.invalidStoreDeliveryFees.push({
          storeId: store._id,
          name: store.name,
          deliveryFee: store.deliveryFee,
        });
      }
      if (store.minOrderAmount < 0) {
        results.invalidStoreMinOrderAmounts.push({
          storeId: store._id,
          name: store.name,
          minOrderAmount: store.minOrderAmount,
        });
      }
    }

    return results;
  },
});
