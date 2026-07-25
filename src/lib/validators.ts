/**
 * Validation Utilities
 * Common validation functions for the application
 */

import { VALIDATION, LOCATION_VALIDATION } from './constants';

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  return VALIDATION.PHONE_REGEX.test(phone);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
}

/**
 * Validate location coordinates
 */
export function isValidLocation(latitude: number, longitude: number): boolean {
  return LOCATION_VALIDATION.VALID_COORDINATES(latitude, longitude);
}

/**
 * Validate full location object
 */
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  addressAr?: string;
}

export function isValidLocationObject(location: Location): boolean {
  if (!location || typeof location !== 'object') {
    return false;
  }

  // Validate coordinates
  if (!isValidLocation(location.latitude, location.longitude)) {
    return false;
  }

  // Validate address
  if (!location.address || location.address.trim().length === 0) {
    return false;
  }

  return true;
}

/**
 * Validate phone number and return formatted version
 */
export function formatAndValidatePhone(phone: string): { valid: boolean; formatted?: string } {
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle Egyptian numbers with various formats
  let formatted = cleaned;
  
  // If starts with 20 (country code), add +
  if (cleaned.startsWith('20') && cleaned.length === 12) {
    formatted = '+' + cleaned;
  }
  // If starts with 0, convert to +20
  else if (cleaned.startsWith('0') && cleaned.length === 11) {
    formatted = '+20' + cleaned.substring(1);
  }
  // If just 11 digits
  else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    formatted = '+20' + cleaned;
  }

  const isValid = isValidPhoneNumber(formatted);
  return {
    valid: isValid,
    formatted: isValid ? formatted : undefined,
  };
}

/**
 * Validate name (not empty, reasonable length)
 */
export function isValidName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }
  return name.trim().length <= VALIDATION.MAX_NAME_LENGTH;
}

/**
 * Validate address
 */
export function isValidAddress(address: string): boolean {
  if (!address || address.trim().length === 0) {
    return false;
  }
  return address.trim().length <= VALIDATION.MAX_ADDRESS_LENGTH;
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validate pagination parameters
 */
export function isValidPaginationParams(page?: number, limit?: number): boolean {
  const pageNum = page || 1;
  const limitNum = limit || 20;
  
  return pageNum > 0 && limitNum > 0 && limitNum <= 100;
}
