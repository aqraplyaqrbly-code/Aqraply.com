import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./auth";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

// Create new order (checkout sends store + line items + delivery address)
export const createOrder = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        color: v.optional(v.string()),
        selectedSize: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      }),
    ),
    deliveryLatitude: v.number(),
    deliveryLongitude: v.number(),
    deliveryAddress: v.string(),
    deliveryAddressAr: v.string(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("wallet"),
      v.literal("card"),
    ),
    paymentReceiptImage: v.optional(v.string()),
    customerNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, ...orderArgs } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(orderArgs.storeId);
    if (!store || !store.isActive) {
      throw new ConvexError("المتجر غير متاح حالياً");
    }

    const customerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!customerProfile) {
      throw new ConvexError("يجب إكمال الملف الشخصي أولاً");
    }

    const orderItems: Array<{
      productId: Id<"products">;
      name: string;
      nameAr: string;
      price: number;
      quantity: number;
      imageUrl?: string;
      color?: string;
      size?: string;
      productCode?: string;
      sku?: string;
      code?: string;
    }> = [];
    let subtotal = 0;

    for (const item of orderArgs.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) {
        throw new ConvexError("المنتج غير موجود");
      }
      if (!product.isAvailable) {
        throw new ConvexError(`المنتج ${product.nameAr} غير متوفر حالياً`);
      }

      subtotal += product.price * item.quantity;

      // Use the imageUrl sent from cart (customer's selected image), fallback to product's first image
      const imageUrl =
        item.imageUrl ||
        (product.imageIds?.length ? String(product.imageIds[0]) : undefined) ||
        product.images?.[0];

      orderItems.push({
        productId: item.productId,
        name: product.name,
        nameAr: product.nameAr,
        quantity: item.quantity,
        price: product.price,
        color: item.color,
        size: item.selectedSize,
        imageUrl,
        productCode: (product as any).productCode,
        sku: product.sku,
        code: (product as any).productCode ?? product.sku,
      });
    }

    if (subtotal < store.minOrderAmount) {
      throw new ConvexError(
        `الحد الأدنى للطلب هو ${store.minOrderAmount} EGP`,
      );
    }

    const deliveryFee = store.deliveryFee;
    const totalAmount = subtotal + deliveryFee;
    const now = Date.now();

    const orderId = await ctx.db.insert("orders", {
      customerId: customerProfile._id,
      storeId: orderArgs.storeId,
      items: orderItems,
      subtotal,
      total: totalAmount,
      totalAmount,
      deliveryFee,
      customerLocation: {
        latitude: orderArgs.deliveryLatitude,
        longitude: orderArgs.deliveryLongitude,
        address: orderArgs.deliveryAddress,
        addressAr: orderArgs.deliveryAddressAr,
      },
      deliveryInstructions: orderArgs.customerNotes,
      paymentMethod: orderArgs.paymentMethod,
      paymentStatus: orderArgs.paymentMethod === "wallet" ? "pending" : "pending",
      paymentReceiptImage: orderArgs.paymentReceiptImage,
      status: "pending",
      estimatedDeliveryTime: store.estimatedDeliveryTime,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(orderArgs.storeId, {
      totalOrders: (store.totalOrders ?? 0) + 1,
    });

    return { orderId };
  },
});

// Get orders by customer profile id
export const getCustomerOrders = query({
  args: { customerId: v.id("profiles") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .collect();

    // Fetch full product details for each item to ensure correct images and codes
    return await Promise.all(
      orders.map(async (order) => {
        const itemsWithProductDetails = await Promise.all(
          order.items.map(async (item) => {
            if (item.productId) {
              const product = await ctx.db.get(item.productId);
              if (product) {
                return {
                  ...item,
                  // Ensure we have the correct image from the product
                  imageUrl: item.imageUrl || (product.imageIds?.length ? String(product.imageIds[0]) : undefined) || product.images?.[0],
                  // Ensure we have the correct product code
                  productCode: item.productCode || (product as any).productCode || product.sku,
                  sku: item.sku || product.sku,
                  code: item.code || (product as any).productCode || product.sku,
                  // Store full product reference if needed
                  product: {
                    _id: product._id,
                    name: product.name,
                    nameAr: product.nameAr,
                    imageUrl: (product.imageIds?.length ? String(product.imageIds[0]) : undefined) || product.images?.[0],
                    productCode: (product as any).productCode,
                    sku: product.sku,
                  },
                };
              }
            }
            return item;
          })
        );

        return {
          ...order,
          items: itemsWithProductDetails,
        };
      })
    );
  },
});

// Get orders for captain
export const getCaptainOrders = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("غير مصرح");
    }

    // Get orders assigned to this captain AND in ready status or later
    // Captain should only see orders that are ready for pickup or in delivery
    const allOrders = await ctx.db
      .query("orders")
      .order("desc")
      .collect();

    const orders = allOrders.filter((order) =>
      order.captainId === profile._id && 
      (order.status === "ready" || order.status === "assigned" || order.status === "picked_up" || order.status === "delivering" || order.status === "delivered")
    );

    // Fetch full product details for each item
    return await Promise.all(
      orders.map(async (order) => {
        const itemsWithProductDetails = await Promise.all(
          order.items.map(async (item) => {
            if (item.productId) {
              const product = await ctx.db.get(item.productId);
              if (product) {
                return {
                  ...item,
                  imageUrl: item.imageUrl || product.images?.[0] || (product.imageIds?.length ? String(product.imageIds[0]) : undefined),
                  productCode: item.productCode || (product as any).productCode || product.sku,
                  sku: item.sku || product.sku,
                  code: item.code || (product as any).productCode || product.sku,
                  product: {
                    _id: product._id,
                    name: product.name,
                    nameAr: product.nameAr,
                    imageUrl: product.images?.[0] || (product.imageIds?.length ? String(product.imageIds[0]) : undefined),
                    productCode: (product as any).productCode,
                    sku: product.sku,
                  },
                };
              }
            }
            return item;
          })
        );

        // Fetch customer and store info
        const customerProfile = order.customerId ? await ctx.db.get(order.customerId) : null;
        const store = order.storeId ? await ctx.db.get(order.storeId) : null;

        return {
          ...order,
          items: itemsWithProductDetails,
          orderNumber: `#${order._id.slice(-6).toUpperCase()}`,
          total: order.total ?? order.totalAmount,
          deliveryFee: order.deliveryFee || store?.deliveryFee,
          deliveryLocation: order.customerLocation,
          customerInfo: customerProfile
            ? {
                fullName: customerProfile.fullName,
                phone: customerProfile.phone,
                address:
                  customerProfile.location?.addressAr ??
                  customerProfile.address ??
                  order.customerLocation.addressAr,
              }
            : {
                fullName: "عميل",
                phone: "",
                address: order.customerLocation.addressAr,
              },
          storeInfo: store
            ? {
                name: store.nameAr,
                nameEn: store.name,
                address: store.address ?? store.location.address,
                addressAr: store.location.addressAr,
                phone: store.phone,
                deliveryFee: store.deliveryFee,
              }
            : null,
        };
      })
    );
  },
});

// Get orders for the logged-in customer
export const getMyOrders = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      return [];
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      return [];
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_customer", (q) => q.eq("customerId", profile._id))
      .order("desc")
      .collect();

    return await Promise.all(
      orders.map(async (order) => {
        const store = await ctx.db.get(order.storeId);

        // Fetch full product details for each item to ensure correct images and codes
        const itemsWithProductDetails = await Promise.all(
          order.items.map(async (item) => {
            if (item.productId) {
              const product = await ctx.db.get(item.productId);
              if (product) {
                return {
                  ...item,
                  // Ensure we have the correct image from the product
                  imageUrl: item.imageUrl || product.images?.[0] || (product.imageIds?.length ? String(product.imageIds[0]) : undefined),
                  // Ensure we have the correct product code
                  productCode: item.productCode || (product as any).productCode || product.sku,
                  sku: item.sku || product.sku,
                  code: item.code || (product as any).productCode || product.sku,
                  // Store full product reference if needed
                  product: {
                    _id: product._id,
                    name: product.name,
                    nameAr: product.nameAr,
                    imageUrl: product.images?.[0] || (product.imageIds?.length ? String(product.imageIds[0]) : undefined),
                    productCode: (product as any).productCode,
                    sku: product.sku,
                  },
                };
              }
            }
            return item;
          })
        );

        return {
          ...order,
          items: itemsWithProductDetails,
          deliveryLocation: order.customerLocation,
          storeInfo: store
            ? {
                name: store.nameAr,
                nameEn: store.name,
                address: store.address ?? store.location.address,
                addressAr: store.location.addressAr,
                phone: store.phone,
              }
            : null,
        };
      }),
    );
  },
});

// Get orders by store (merchant dashboard)
export const getStoreOrders = query({
  args: {
    sessionToken: v.optional(v.string()),
    storeId: v.id("stores"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sessionToken, storeId, status } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const store = await ctx.db.get(storeId);
    if (!store || store.ownerId !== userId) {
      throw new ConvexError("ليس لديك صلاحية لعرض طلبات هذا المتجر");
    }

    let orders = await ctx.db
      .query("orders")
      .withIndex("by_store", (q) => q.eq("storeId", storeId))
      .order("desc")
      .collect();

    if (status) {
      orders = orders.filter((order) => order.status === status);
    }

    return await Promise.all(
      orders.map(async (order) => {
        const customerProfile = await ctx.db.get(order.customerId);

        return {
          ...order,
          // Alias for legacy UI fields
          deliveryLocation: order.customerLocation,
          customerInfo: customerProfile
            ? {
                fullName: customerProfile.fullName,
                phone: customerProfile.phone,
                email: (customerProfile as any).email,
                address:
                  (customerProfile.location?.addressAr as any) ??
                  (customerProfile as any).address ??
                  order.customerLocation.addressAr,
              }
            : null,
          storeInfo: {
            name: store.nameAr,
            nameEn: store.name,
            address: store.address ?? store.location.address,
            addressAr: store.location.addressAr,
            phone: store.phone,
            imageUrl: store.imageUrl,
            imageId: store.imageId,
          },
        };
      }),
    );
  },
});

// Update order status
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return null;
    }

    // Fetch store info
    const store = await ctx.db.get(order.storeId);

    // Fetch full product details for each item to ensure correct images and codes
    const itemsWithProductDetails = await Promise.all(
      order.items.map(async (item) => {
        if (item.productId) {
          const product = await ctx.db.get(item.productId);
          if (product) {
            return {
              ...item,
              // Ensure we have the correct image from the product
              imageUrl: item.imageUrl || (product.imageIds?.length ? String(product.imageIds[0]) : undefined) || product.images?.[0],
              // Ensure we have the correct product code
              productCode: item.productCode || (product as any).productCode || product.sku,
              sku: item.sku || product.sku,
              code: item.code || (product as any).productCode || product.sku,
              // Store full product reference if needed
              product: {
                _id: product._id,
                name: product.name,
                nameAr: product.nameAr,
                imageUrl: (product.imageIds?.length ? String(product.imageIds[0]) : undefined) || product.images?.[0],
                productCode: (product as any).productCode,
                sku: product.sku,
              },
            };
          }
        }
        return item;
      })
    );

    return {
      ...order,
      items: itemsWithProductDetails,
      orderNumber: `#${order._id.slice(-6).toUpperCase()}`,
      total: order.total ?? order.totalAmount,
      storeInfo: store
        ? {
            name: store.nameAr,
            nameEn: store.name,
            address: store.address ?? store.location.address,
            addressAr: store.location.addressAr,
            phone: store.phone,
          }
        : null,
    };
  },
});

export const getAllOrders = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx, args.sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || (profile.role !== "admin" && profile.role !== "owner")) {
      throw new ConvexError("ليس لديك صلاحية لعرض جميع الطلبات");
    }

    const orders = await ctx.db.query("orders").order("desc").collect();

    return await Promise.all(
      orders.map(async (order) => {
        const store = await ctx.db.get(order.storeId);
        const customerProfile = await ctx.db.get(order.customerId);

        // Fetch full product details for each item to ensure correct images and codes
        const itemsWithProductDetails = await Promise.all(
          order.items.map(async (item) => {
            if (item.productId) {
              const product = await ctx.db.get(item.productId);
              if (product) {
                return {
                  ...item,
                  // Ensure we have the correct image from the product
                  imageUrl: item.imageUrl || (product.imageIds?.length ? String(product.imageIds[0]) : undefined) || product.images?.[0],
                  // Ensure we have the correct product code
                  productCode: item.productCode || (product as any).productCode || product.sku,
                  sku: item.sku || product.sku,
                  code: item.code || (product as any).productCode || product.sku,
                  // Store full product reference if needed
                  product: {
                    _id: product._id,
                    name: product.name,
                    nameAr: product.nameAr,
                    imageUrl: (product.imageIds?.length ? String(product.imageIds[0]) : undefined) || product.images?.[0],
                    productCode: (product as any).productCode,
                    sku: product.sku,
                  },
                };
              }
            }
            return item;
          })
        );

        return {
          ...order,
          items: itemsWithProductDetails,
          orderNumber: `#${order._id.slice(-6).toUpperCase()}`,
          total: order.total ?? order.totalAmount,
          // Alias for legacy admin/captain UI fields
          deliveryLocation: order.customerLocation,
          customerInfo: customerProfile
            ? {
                fullName: customerProfile.fullName,
                phone: customerProfile.phone,
                address:
                  customerProfile.location?.addressAr ??
                  customerProfile.address ??
                  order.customerLocation.addressAr,
              }
            : {
                fullName: "عميل",
                phone: "",
                address: order.customerLocation.addressAr,
              },
          storeInfo: store
            ? {
                name: store.nameAr,
                nameEn: store.name,
                address: store.address ?? store.location.address,
                addressAr: store.location.addressAr,
                phone: store.phone,
              }
            : null,
        };
      }),
    );
  },
});

export const updateOrderStatus = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("preparing"), v.literal("ready"), v.literal("picked_up"), v.literal("delivered"), v.literal("rejected"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    const { sessionToken, orderId, status } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول أولاً");
    }

    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    // If merchant is marking order as ready and a captain is assigned, notify the captain
    if (status === "ready" && order.captainId) {
      const captainProfile = await ctx.db.get(order.captainId);
      if (captainProfile) {
        await ctx.db.insert("notifications", {
          userId: captainProfile.userId,
          title: "Order Ready for Pickup",
          titleAr: "الطلب جاهز للاستلام",
          message: `Order ${orderId.slice(-6).toUpperCase()} is ready for pickup`,
          messageAr: `الطلب ${orderId.slice(-6).toUpperCase()} جاهز للاستلام`,
          type: "order_ready",
          isRead: false,
          relatedOrderId: orderId,
        });
      }
    }

    await ctx.db.patch(orderId, {
      status,
      updatedAt: Date.now(),
      ...(status === "delivered" ? { actualDeliveryTime: Date.now() } : {})
    });
  },
});

// Accept order (for captain)
export const acceptOrder = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, orderId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("غير مصرح");
    }

    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    // Validate status transition: Only ready orders can be accepted
    if (order.status !== "ready") {
      throw new ConvexError(`لا يمكن قبول طلب في حالة ${order.status}. يجب أن يكون الطلب جاهزاً للاستلام`);
    }

    // Validate captain assignment
    if (order.captainId !== profile._id) {
      throw new ConvexError("هذا الطلب لم يتم تعيينه لك");
    }

    await ctx.db.patch(orderId, {
      captainId: profile._id,
      status: "assigned",
      updatedAt: Date.now(),
    });
  },
});

// Reject order (for captain)
export const rejectOrder = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, orderId } = args;
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("غير مصرح");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    // Validate status transition: Only ready orders can be rejected
    if (order.status !== "ready") {
      throw new ConvexError(`لا يمكن رفض طلب في حالة ${order.status}. يجب أن يكون الطلب جاهزاً للاستلام`);
    }

    // Validate captain assignment
    if (order.captainId !== profile._id) {
      throw new ConvexError("هذا الطلب لم يتم تعيينه لك");
    }

    await ctx.db.patch(orderId, {
      captainId: undefined,
      status: "rejected",
      updatedAt: Date.now(),
    });
  },
});

// Update order status by captain
export const updateOrderStatusByCaptain = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
    status: v.union(v.literal("picked_up"), v.literal("delivering"), v.literal("delivered")),
  },
  handler: async (ctx, args) => {
    const { sessionToken, orderId, status } = args;
    console.log("updateOrderStatusByCaptain called:", { orderId, status });
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("غير مصرح");
    }

    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    console.log("Current order status:", order.status);
    console.log("Requested status:", status);

    // Validate status transitions
    if (status === "picked_up") {
      // Can only pick up from assigned status
      if (order.status !== "assigned") {
        throw new ConvexError(`لا يمكن استلام الطلب من حالة ${order.status}. يجب أن يكون الطلب معيناً أولاً`);
      }
    } else if (status === "delivering") {
      // Can only start delivery from picked_up status
      if (order.status !== "picked_up") {
        throw new ConvexError(`لا يمكن بدء التوصيل من حالة ${order.status}. يجب استلام الطلب من المتجر أولاً`);
      }
    } else if (status === "delivered") {
      // Can only deliver from delivering status
      if (order.status !== "delivering") {
        throw new ConvexError(`لا يمكن إتمام التوصيل من حالة ${order.status}. يجب أن يكون الطلب قيد التوصيل أولاً`);
      }
    }

    await ctx.db.patch(orderId, {
      captainId: profile._id,
      status: status,
      updatedAt: Date.now(),
      ...(status === "picked_up" ? { pickupTime: Date.now() } : {}),
      ...(status === "delivering" ? { deliveryStartTime: Date.now() } : {}),
      ...(status === "delivered" ? { deliveryTime: Date.now() } : {}),
    });
    console.log("Order status updated successfully to:", status);
  },
});

// Complete order (for captain)
export const completeOrder = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const { sessionToken, orderId } = args;
    console.log("completeOrder called:", { orderId });
    const userId = await getAuthUserId(ctx, sessionToken);
    if (!userId) {
      throw new ConvexError("يجب تسجيل الدخول");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile || profile.role !== "captain") {
      throw new ConvexError("غير مصرح");
    }

    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new ConvexError("الطلب غير موجود");
    }

    console.log("Current order status:", order.status);
    console.log("Captain ID:", profile._id);
    console.log("Order captainId:", order.captainId);

    // Validate status transition: Only delivering orders can be completed
    if (order.status !== "delivering") {
      throw new ConvexError(`لا يمكن إكمال طلب في حالة ${order.status}. يجب أن يكون الطلب قيد التوصيل`);
    }

    // Validate captain authorization
    if (order.captainId !== profile._id) {
      throw new ConvexError("ليس لديك صلاحية لإكمال هذا الطلب");
    }

    await ctx.db.patch(orderId, {
      captainId: profile._id,
      status: "delivered",
      actualDeliveryTime: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("Order completed successfully");
  },
});
