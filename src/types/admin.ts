import { Id } from "../../convex/_generated/dataModel";

// Order types
export interface Order {
  _id: Id<"orders">;
  _creationTime: number;
  orderNumber: string;
  customerId: Id<"profiles">;
  storeId: Id<"stores">;
  captainId?: Id<"profiles">;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentReceiptImage?: string;
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  customerLocation?: {
    addressAr?: string;
  };
  deliveryLocation?: {
    addressAr?: string;
  };
  deliveryInstructions?: string;
  estimatedDeliveryTime?: number;
  actualDeliveryTime?: number;
  items: OrderItem[];
  createdAt?: number;
  updatedAt?: number;
  customerInfo?: {
    fullName?: string;
    phone?: string;
    email?: string;
  };
  storeInfo?: {
    name?: string;
    nameAr?: string;
    address?: string;
    phone?: string;
  };
}

export interface OrderItem {
  productId?: Id<"products">;
  name?: string;
  nameAr?: string;
  imageUrl?: string;
  image?: string;
  productImage?: string;
  product?: {
    imageUrl?: string;
    code?: string;
    sku?: string;
  };
  images?: string[];
  productCode?: string;
  code?: string;
  sku?: string;
  quantity: number;
  price?: number;
  color?: string;
  selectedSize?: string;
}

// User types
export interface User {
  _id: Id<"users">;
  _creationTime: number;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isSuspended?: boolean;
}

// Store types
export interface Store {
  _id: Id<"stores">;
  _creationTime: number;
  ownerId: string;
  name?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  address?: string;
  location?: {
    addressAr?: string;
  };
  phone?: string;
  imageUrl?: string;
  imageId?: Id<"_storage">;
  isActive: boolean;
  isOnline?: boolean;
  rating: number;
  totalRatings: number;
  estimatedDeliveryTime?: number;
  deliveryFee?: number;
  minOrderAmount?: number;
  category?: string;
  commissionRate?: number;
  totalOrders: number;
  updatedAt?: number;
  ownerProfile?: {
    fullName?: string;
  };
}

// Captain types
export interface Captain {
  _id: Id<"profiles">;
  _creationTime: number;
  userId: string;
  fullName?: string;
  phone?: string;
  isSuspended?: boolean;
  isActive?: boolean;
  isOnline?: boolean;
  lastSeen?: number;
  vehicleType?: string;
  vehicleNumber?: string;
  address?: string;
}

// Platform Stats
export interface PlatformStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCommission: number;
  totalStores: number;
  activeStores: number;
  totalCaptains: number;
  onlineCaptains: number;
  totalCustomers: number;
  recentOrders: number;
  recentRevenue: number;
  statusCounts?: Record<string, number>;
}

// Navigation item
export interface NavItem {
  path: string;
  label: string;
  icon: any;
}
