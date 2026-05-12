/**
 * Input sanitization utilities to prevent XSS attacks
 */

/**
 * Sanitizes text input by removing HTML tags and special characters
 * @param input - The user input to sanitize
 * @returns Sanitized string
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove potentially dangerous characters
    .replace(/[<>]/g, '')
    // Remove script and javascript references
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Trim whitespace
    .trim()
    // Limit length to prevent abuse
    .slice(0, 1000);
}

/**
 * Sanitizes email addresses
 * @param email - The email to sanitize
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  const sanitized = sanitizeText(email.toLowerCase());
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitizes names (allows letters, spaces, hyphens, apostrophes)
 * @param name - The name to sanitize
 * @returns Sanitized name
 */
export function sanitizeName(name: string): string {
  if (!name) return '';
  
  return name
    // Remove HTML tags and dangerous characters
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    // Remove script references
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Allow only letters, spaces, hyphens, apostrophes, and periods
    .replace(/[^a-zA-Z\s\-'.]/g, '')
    .trim()
    // Limit length
    .slice(0, 100);
}

/**
 * Sanitizes feedback messages
 * @param message - The feedback message to sanitize
 * @returns Sanitized message
 */
export function sanitizeMessage(message: string): string {
  if (!message) return '';
  
  return message
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove potentially dangerous characters
    .replace(/[<>]/g, '')
    // Remove script and javascript references
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    .trim()
    // Limit length
    .slice(0, 2000);
}

/**
 * Validates and sanitizes rating (ensures it's a number between 1-5)
 * @param rating - The rating to validate
 * @returns Valid rating or 0 if invalid
 */
export function sanitizeRating(rating: number): number {
  const num = typeof rating === 'number' ? rating : parseInt(String(rating), 10);
  
  if (isNaN(num) || num < 1 || num > 5) {
    return 0;
  }
  
  return Math.round(num);
}
