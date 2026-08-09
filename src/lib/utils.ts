import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize Arabic text for better search matching
 * Converts similar Arabic letters to their base forms:
 * - أ إ آ → ا
 * - ي ى → ي
 * - ه ة → ه
 * - Removes diacritics (تشكيل)
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    // Remove diacritics (تشكيل)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize hamza forms
    .replace(/[\u0623\u0625\u0622]/g, '\u0627') // أ إ آ → ا
    // Normalize alef maksura
    .replace(/[\u0649]/g, '\u064A') // ى → ي
    // Normalize ta marbuta
    .replace(/[\u0629]/g, '\u0647') // ة → ه
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
