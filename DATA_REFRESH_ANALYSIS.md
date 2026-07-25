# Product Data Refresh Mechanism Analysis

## Summary
The app uses **Convex's automatic reactivity system**. There are **NO explicit cache invalidation or refetch mechanisms** - Convex automatically re-runs queries when their underlying data changes. However, this depends on proper query subscriptions and index usage.

---

## 1. ProductsManager.tsx

### How Products Are Queried
```typescript
// All merchant's products (from all stores)
const allProducts = useQuery(api.products.getMyProducts, { availableOnly: false });

// Products from a specific store
const storeProducts = useQuery(
  api.products.getStoreProducts,
  selectedStore ? { storeId: selectedStore as any, availableOnly: false } : "skip"
);

// Display logic
const products = selectedStore ? storeProducts : allProducts;
```

### Data Refresh After Mutations
**Mutations used:**
- `updateAvailability` - toggles `isAvailable` status
- `deleteProduct` - removes product
- `createProduct` - adds new product (in form modal)
- `updateProduct` - edits product (in form modal)

**Current Behavior:**
- ✅ **Automatic refresh via Convex reactivity** - when mutations complete, Convex re-runs the query
- ✅ **Queries use proper indexes** - `getMyProducts` and `getStoreProducts` both use indexed queries
- ⚠️ **Potential issue**: If a product is created/updated, it will NOT appear in the list if:
  - The query params change (rarely happens here)
  - The index lookup fails due to race conditions

### Stale Data Issues
**None identified**, but potential scenarios:
1. **Store filter change**: When user switches stores, the query updates automatically ✅
2. **Product creation visibility**: New products should appear immediately after create mutation ✅
3. **Availability toggle**: Changes reflect instantly ✅

**Concern**: The `getMyProducts` query loops through stores and fetches products per store:
```typescript
// Loops through multiple queries - could be slow with many stores
for (const storeId of storeIds) {
  let products;
  if (availableOnly) {
    products = await ctx.db.query("products")
      .withIndex("by_store_and_available", ...)
  }
  allProducts.push(...productsWithStore);
}
```
This approach works but isn't indexed as a single query - could cause missed updates if stores are added/removed mid-query.

---

## 2. CustomerApp.tsx

### How Products Are Fetched (StoreDetails)
```typescript
const products = useQuery(
  api.products.getStoreProducts,
  storeId ? { storeId: storeId as any, availableOnly: true } : "skip"
);
```

### Do New Products Appear Automatically?
✅ **Yes, but ONLY if marked available**
- Query uses index: `by_store_and_available` with `availableOnly: true`
- New products automatically appear when `isAvailable` is set to `true`
- Hidden products don't appear to customers

### ProductDetailModal Data Usage
```typescript
function ProductDetailModal({ product, onClose, ... }) {
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [];
  
  // Images displayed directly from product prop
  // No additional queries
}
```
- Uses product data passed from parent (no separate query)
- **Potential issue**: If product is updated while modal is open, changes won't reflect until modal closes and re-opens

---

## 3. AdminDashboard.tsx

### How Products Are Displayed
**Products are NOT directly displayed.** Only orders and stats are shown:
```typescript
const stats = useQuery(api.admin.getPlatformStats);
const orders = useQuery(api.orders.getAllOrders);
```

**No product queries** - admin dashboard focus is on:
- Platform-wide statistics
- Order management
- Captain assignment
- Store/captain management

### Real-time Updates
✅ **Orders update in real-time** - uses Convex reactivity
❌ **No product display** - admin can't see product inventory directly

---

## 4. Convex Backend - products.ts

### Query Mechanism
```typescript
// Query 1: All merchant products
export const getMyProducts = query({
  handler: async (ctx, args) => {
    // Gets user's stores, then loops through each store's products
    const myStores = await ctx.db.query("stores")
      .withIndex("by_owner", q => q.eq("ownerId", userId))
      .collect();
    
    // Multiple queries (one per store)
    for (const storeId of storeIds) {
      const products = await ctx.db.query("products")
        .withIndex("by_store" | "by_store_and_available", ...)
        .collect();
    }
  }
});

// Query 2: Store products
export const getStoreProducts = query({
  handler: async (ctx, args) => {
    return await ctx.db.query("products")
      .withIndex("by_store_and_available" | "by_store", ...)
      .collect();
  }
});
```

### Do Mutations Trigger Automatic Updates?
✅ **Yes - Convex automatically invalidates related queries**

When `createProduct`, `updateProduct`, etc. execute:
1. Database is modified via `ctx.db.insert()`, `ctx.db.patch()`, or `ctx.db.delete()`
2. Convex detects the table change (`"products"`)
3. Any subscribed query reading from `"products"` table is marked as stale
4. Query re-runs automatically on the client
5. Component re-renders with new data

### Invalidation Logic
❌ **No explicit invalidation code found** - relies entirely on:
- Convex's built-in reactivity
- Proper use of indexes in queries
- Client-side `useQuery` subscriptions

---

## Potential Issues & Risks

### ⚠️ Issue 1: Multiple Query Calls in getMyProducts
**File**: `convex/products.ts` line 20-35

```typescript
// Problem: Loops through stores and makes multiple DB queries
for (const storeId of storeIds) {
  let products;
  if (availableOnly) {
    products = await ctx.db.query("products")
      .withIndex("by_store_and_available", ...)
  }
  allProducts.push(...productsWithStore);
}
```

**Risk**: If a new product is created after the first store query but before the last store query, it might be missed.

**Fix**: Add a unique index on `(ownerId, storeId)` and query directly by owner.

---

### ⚠️ Issue 2: ProductDetailModal Doesn't Watch for Updates
**File**: `src/components/CustomerApp.tsx` line 130

```typescript
function ProductDetailModal({ product, onClose, ... }) {
  // product data is static - won't update if product changes while modal open
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [];
}
```

**Risk**: If a merchant updates product images while customer has modal open, customer sees old images.

**Fix**: Add `useQuery` to fetch latest product data by ID inside modal.

---

### ⚠️ Issue 3: Stale Data in Local Cart Storage
**File**: `src/components/CustomerApp.tsx` line 30-55

```typescript
interface CartItem {
  productId: Id<"products">;
  price: number;  // STORED LOCALLY
  imageUrl?: string;  // STORED LOCALLY
}

// localStorage cached
localStorage.setItem('aqraply_cart', JSON.stringify(cart));
```

**Risk**: Cart prices are stored in localStorage when added. If merchant updates prices, customer's cart won't reflect changes.

**Impact**: 
- Customer adds item at 100 EGP
- Merchant updates price to 150 EGP
- Customer sees 100 EGP in cart (from localStorage)
- Order created with 100 EGP (outdated price)

**Fix**: Fetch fresh product data at checkout to validate prices.

---

### ✅ Issue 4: Availability Filter Works Correctly
**File**: `src/components/CustomerApp.tsx` line 558

```typescript
const products = useQuery(
  api.products.getStoreProducts,
  storeId ? { storeId: storeId as any, availableOnly: true } : "skip"
);
```

**Status**: WORKS CORRECTLY
- New products appear when marked available
- Hidden products disappear from customer view
- Uses proper index: `by_store_and_available`

---

## Real-time Synchronization Checklist

### ✅ Currently Working
- [x] Product availability toggle (toggle appears immediately)
- [x] New product creation (appears in merchant dashboard)
- [x] Product availability toggle for customers (available products show/hide)
- [x] Product deletion (removed from list immediately)
- [x] Store products list refresh when store is changed
- [x] Admin order dashboard updates in real-time

### ⚠️ Needs Attention
- [ ] **Price updates in open cart** - cart shows old prices from localStorage
- [ ] **Product detail modal** - doesn't fetch latest data while open
- [ ] **Multiple store product fetch** - potential race condition in `getMyProducts`
- [ ] **Offline state** - no offline support for stale data

### ❌ Missing Features
- [ ] **Explicit cache invalidation** - no manual refetch buttons or controls
- [ ] **Error recovery** - no retry logic if query fails
- [ ] **Optimistic updates** - mutations don't update UI before server confirms
- [ ] **Admin product view** - admin dashboard doesn't display products

---

## What Needs to Be Updated

### Priority 1: Fix Cart Price Stalenesss
**Where**: `src/components/CustomerApp.tsx` → `Checkout` component
**Action**: Before checkout, fetch fresh product data to verify prices and availability.

### Priority 2: Add Live Product Updates to Modal
**Where**: `src/components/CustomerApp.tsx` → `ProductDetailModal`
**Action**: Add `useQuery` to fetch product data by ID inside modal.

### Priority 3: Optimize getMyProducts Query
**Where**: `convex/products.ts` → `getMyProducts`
**Action**: Add index on products table by `ownerId` to avoid multiple queries.

### Priority 4: Add Product Management to Admin
**Where**: `src/components/AdminDashboard.tsx`
**Action**: Add products management section to admin dashboard.

---

## Data Refresh Mechanism Summary

| Component | Fetch Method | Refresh Trigger | Issues |
|-----------|--------------|-----------------|--------|
| **ProductsManager** | `useQuery(getMyProducts)` | Mutation → DB change → Query re-run | Potential race condition in loop |
| **CustomerApp (Store)** | `useQuery(getStoreProducts)` | Mutation → DB change → Query re-run | Modal data doesn't update |
| **Cart (localStorage)** | Manual add/remove | Manual user action | **Stale prices!** |
| **AdminDashboard** | `useQuery(getAllOrders)` | Mutation → DB change → Query re-run | No product display |

**Root Cause of Issues**: 
- No explicit data validation at checkout
- Modal component doesn't subscribe to live product data
- Cart relies on stale localStorage prices

