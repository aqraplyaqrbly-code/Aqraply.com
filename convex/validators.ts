import { v } from "convex/values";

export const userValidator = v.object({
  email: v.string(),
  passwordHash: v.string(),
  name: v.optional(v.string()),
  phone: v.optional(v.string()),
});

export const productValidator = v.object({
  name: v.string(),
  nameAr: v.string(),
  description: v.string(),
  descriptionAr: v.string(),
  category: v.string(),
  price: v.number(),
  storeId: v.id("stores"),
});

export const orderValidator = v.object({
  customerId: v.id("profiles"),
  storeId: v.id("stores"),
  items: v.array(v.object({
    productId: v.id("products"),
    quantity: v.number(),
    price: v.number(),
  })),
  totalAmount: v.number(),
  deliveryFee: v.number(),
});
