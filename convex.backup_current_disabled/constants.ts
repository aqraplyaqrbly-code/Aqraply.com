/**
 * Backend Constants and Enums
 * Convex backend constants for roles, statuses, and other configurations
 */

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  CAPTAIN: 'captain',
  CUSTOMER: 'customer',
} as const;

// Order Statuses
export const ORDER_STATUS = {
  PENDING: 'pending',           // الطلب الجديد
  ASSIGNED: 'assigned',         // تم تعيين كابتن
  READY: 'ready',              // الطلب جاهز للتسليم
  ON_WAY: 'on_way',            // الكابتن في الطريق
  DELIVERED: 'delivered',       // تم التسليم
  CANCELLED: 'cancelled',       // تم الإلغاء
} as const;

// Payment Statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',    // الدفع قيد الانتظار
  PAID: 'paid',         // تم الدفع
  FAILED: 'failed',     // فشل الدفع
} as const;

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

// Validation Regex Patterns
export const VALIDATION = {
  // Egyptian phone numbers
  PHONE_REGEX: /^(\+?20|0)?1[0125]\d{8}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Permission Levels
export const PERMISSION_CHECKS = {
  isAdmin: (role: string): boolean => role === USER_ROLES.ADMIN,
  isMerchant: (role: string): boolean => role === USER_ROLES.MERCHANT || role === USER_ROLES.ADMIN,
  isCaptain: (role: string): boolean => role === USER_ROLES.CAPTAIN || role === USER_ROLES.ADMIN,
  isCustomer: (role: string): boolean => role === USER_ROLES.CUSTOMER || role === USER_ROLES.ADMIN,
  canManageOrders: (role: string): boolean => 
    role === USER_ROLES.ADMIN || role === USER_ROLES.MERCHANT,
  canDeliverOrders: (role: string): boolean => 
    role === USER_ROLES.ADMIN || role === USER_ROLES.CAPTAIN,
} as const;
