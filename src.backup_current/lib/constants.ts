/**
 * Application Constants and Enums
 * Centralized definitions for roles, statuses, and other constants
 */

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  CAPTAIN: 'captain',
  CUSTOMER: 'customer',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Order Statuses
export const ORDER_STATUS = {
  PENDING: 'pending',           // الطلب الجديد
  ASSIGNED: 'assigned',         // تم تعيين كابتن
  READY: 'ready',              // الطلب جاهز للتسليم
  ON_WAY: 'on_way',            // الكابتن في الطريق
  DELIVERED: 'delivered',       // تم التسليم
  CANCELLED: 'cancelled',       // تم الإلغاء
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Payment Statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',    // الدفع قيد الانتظار
  PAID: 'paid',         // تم الدفع
  FAILED: 'failed',     // فشل الدفع
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Notification Types
export const NOTIFICATION_TYPE = {
  ORDER_CREATED: 'order_created',
  ORDER_ASSIGNED: 'order_assigned',
  ORDER_READY: 'order_ready',
  ORDER_ON_WAY: 'order_on_way',
  ORDER_DELIVERED: 'order_delivered',
  ORDER_CANCELLED: 'order_cancelled',
  PAYMENT_RECEIVED: 'payment_received',
  NEW_REVIEW: 'new_review',
  ADMIN_ALERT: 'admin_alert',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];

// Order Status Labels in Arabic
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'قيد الانتظار',
  assigned: 'تم التعيين',
  ready: 'جاهز',
  on_way: 'في الطريق',
  delivered: 'تم التسليم',
  cancelled: 'ملغى',
};

// User Role Labels in Arabic
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'مدير',
  merchant: 'تاجر',
  captain: 'كابتن',
  customer: 'عميل',
};

// Subscription Plan Features
export const SUBSCRIPTION_FEATURES = {
  UNLIMITED_PRODUCTS: 'unlimited_products',
  BASIC_ANALYTICS: 'basic_analytics',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  PRIORITY_SUPPORT: 'priority_support',
  CUSTOM_BRANDING: 'custom_branding',
  API_ACCESS: 'api_access',
} as const;

// Validation Rules
export const VALIDATION = {
  PHONE_REGEX: /^(\+?20|0)?1[0125]\d{8}$/,  // Egyptian phone numbers
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PHONE_LENGTH: 20,
  MAX_NAME_LENGTH: 100,
  MAX_ADDRESS_LENGTH: 500,
} as const;

// Location Validation
export const LOCATION_VALIDATION = {
  MIN_LATITUDE: -90,
  MAX_LATITUDE: 90,
  MIN_LONGITUDE: -180,
  MAX_LONGITUDE: 180,
  VALID_COORDINATES: (lat: number, lng: number): boolean => {
    return (
      lat >= LOCATION_VALIDATION.MIN_LATITUDE &&
      lat <= LOCATION_VALIDATION.MAX_LATITUDE &&
      lng >= LOCATION_VALIDATION.MIN_LONGITUDE &&
      lng <= LOCATION_VALIDATION.MAX_LONGITUDE
    );
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
} as const;
