/**
 * Backend Validation Utilities for Convex
 * Location validation, permission checks, and other backend-specific validations
 */

import { ConvexError } from "convex/values";
import { LOCATION_VALIDATION, USER_ROLES, PERMISSION_CHECKS } from "./constants";

/**
 * Location object interface
 */
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  addressAr: string;
}

/**
 * Validate location coordinates
 */
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return LOCATION_VALIDATION.VALID_COORDINATES(latitude, longitude);
}

/**
 * Validate complete location object
 */
export function validateLocation(location: Location | undefined | null): {
  valid: boolean;
  error?: string;
} {
  if (!location) {
    return { valid: false, error: "الموقع مطلوب" };
  }

  // Check coordinates
  if (typeof location.latitude !== "number" || typeof location.longitude !== "number") {
    return { valid: false, error: "إحداثيات الموقع غير صحيحة" };
  }

  if (!isValidCoordinates(location.latitude, location.longitude)) {
    return { valid: false, error: "إحداثيات الموقع خارج النطاق المسموح" };
  }

  // Check address
  if (!location.address || location.address.trim().length === 0) {
    return { valid: false, error: "عنوان الموقع مطلوب" };
  }

  if (location.address.trim().length > 500) {
    return { valid: false, error: "عنوان الموقع طويل جداً" };
  }

  // Check Arabic address (optional)
  if (location.addressAr && location.addressAr.trim().length > 500) {
    return { valid: false, error: "عنوان الموقع العربي طويل جداً" };
  }

  return { valid: true };
}

/**
 * Validate location and throw error if invalid
 */
export function assertValidLocation(location: Location | undefined | null): Location {
  const validation = validateLocation(location);
  if (!validation.valid) {
    throw new ConvexError(validation.error || "الموقع غير صحيح");
  }
  return location as Location;
}

/**
 * Get distance between two coordinates (in kilometers)
 * Uses Haversine formula for approximate distance
 */
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

/**
 * Check if user has admin role
 */
export function assertIsAdmin(userRole: string | undefined | null): void {
  if (!userRole || !PERMISSION_CHECKS.isAdmin(userRole)) {
    throw new ConvexError("ليس لديك صلاحية للقيام بهذا الإجراء");
  }
}

/**
 * Check if user has merchant permissions
 */
export function assertIsMerchant(userRole: string | undefined | null): void {
  if (!userRole || !PERMISSION_CHECKS.isMerchant(userRole)) {
    throw new ConvexError("ليس لديك صلاحية للقيام بهذا الإجراء");
  }
}

/**
 * Check if user has captain permissions
 */
export function assertIsCaptain(userRole: string | undefined | null): void {
  if (!userRole || !PERMISSION_CHECKS.isCaptain(userRole)) {
    throw new ConvexError("ليس لديك صلاحية للقيام بهذا الإجراء");
  }
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  // Egyptian phone number format
  const phoneRegex = /^(\+?20|0)?1[0125]\d{8}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input
 */
export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 500); // Limit length and trim whitespace
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  limit?: number,
  skip?: number
): { limit: number; skip: number } {
  let finalLimit = limit || 20;
  let finalSkip = skip || 0;

  // Enforce limits
  if (finalLimit > 100) finalLimit = 100;
  if (finalLimit < 1) finalLimit = 1;
  if (finalSkip < 0) finalSkip = 0;

  return { limit: finalLimit, skip: finalSkip };
}
