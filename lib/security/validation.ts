// lib/security/validation.ts
// Input validation and sanitization utilities

/**
 * Sanitize string input to prevent XSS
 * Removes/escapes potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize HTML content (for display, not for database)
 * Escapes HTML entities
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') return '';

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Liberian phone number
 * Formats: +231XXXXXXXXX, 231XXXXXXXXX, 0XXXXXXXXX, XXXXXXXXX
 */
export function isValidLiberianPhone(phone: string): boolean {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Check various formats
  // Full international: 231XXXXXXXXX (12 digits)
  if (digits.length === 12 && digits.startsWith('231')) {
    return true;
  }

  // With leading zero: 0XXXXXXXXX (10 digits)
  if (digits.length === 10 && digits.startsWith('0')) {
    return true;
  }

  // Local format: XXXXXXXXX (9 digits, starting with 7, 8, or 5)
  if (digits.length === 9 && /^[578]/.test(digits)) {
    return true;
  }

  return false;
}

/**
 * Format phone number to international format
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  // Already in international format
  if (digits.length === 12 && digits.startsWith('231')) {
    return `+${digits}`;
  }

  // Remove leading zero and add country code
  if (digits.length === 10 && digits.startsWith('0')) {
    return `+231${digits.substring(1)}`;
  }

  // Add country code to local number
  if (digits.length === 9) {
    return `+231${digits}`;
  }

  return phone; // Return as-is if format unknown
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value > 0;
}

/**
 * Validate non-negative integer
 */
export function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/**
 * Validate price (positive number with max 2 decimal places)
 */
export function isValidPrice(price: unknown): price is number {
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    return false;
  }
  // Check decimal places
  const decimalPlaces = (price.toString().split('.')[1] || '').length;
  return decimalPlaces <= 2;
}

/**
 * Sanitize and validate order data
 */
export interface OrderValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedData?: {
    customerName: string;
    customerPhone: string;
    customerWhatsapp?: string;
    customerEmail?: string;
    customerNotes?: string;
  };
}

export function validateOrderData(data: {
  customerName?: string;
  customerPhone?: string;
  customerWhatsapp?: string;
  customerEmail?: string;
  customerNotes?: string;
}): OrderValidationResult {
  const errors: string[] = [];

  // Validate required fields
  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push('Customer name is required (minimum 2 characters)');
  }

  if (!data.customerPhone) {
    errors.push('Phone number is required');
  } else if (!isValidLiberianPhone(data.customerPhone)) {
    errors.push('Please enter a valid Liberian phone number');
  }

  // Validate optional fields
  if (data.customerEmail && !isValidEmail(data.customerEmail)) {
    errors.push('Please enter a valid email address');
  }

  if (data.customerWhatsapp && !isValidLiberianPhone(data.customerWhatsapp)) {
    errors.push('Please enter a valid WhatsApp number');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Return sanitized data
  return {
    valid: true,
    errors: [],
    sanitizedData: {
      customerName: sanitizeString(data.customerName!).substring(0, 100),
      customerPhone: formatPhoneNumber(data.customerPhone!),
      customerWhatsapp: data.customerWhatsapp
        ? formatPhoneNumber(data.customerWhatsapp)
        : undefined,
      customerEmail: data.customerEmail?.toLowerCase().trim(),
      customerNotes: data.customerNotes
        ? sanitizeString(data.customerNotes).substring(0, 500)
        : undefined,
    },
  };
}

/**
 * Validate file upload
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileUpload(
  file: File,
  options: {
    allowedTypes?: string[];
    maxSizeBytes?: number;
  } = {}
): FileValidationResult {
  const {
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  } = options;

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  // Check filename for suspicious patterns
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.php$/i,
    /\.js$/i,
    /\.\./,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return {
        valid: false,
        error: 'Invalid filename',
      };
    }
  }

  return { valid: true };
}

/**
 * Sanitize filename for storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 100); // Limit length
}

/**
 * Check for SQL injection patterns (basic check)
 * Note: Always use parameterized queries - this is just an additional layer
 */
export function hasSQLInjectionPatterns(input: string): boolean {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
    /(--)|(;)|(\/\*)|(\*\/)/,
    /'.*OR.*'/i,
    /"\s*OR\s*"/i,
  ];

  return patterns.some((pattern) => pattern.test(input));
}

/**
 * Generic input validation with type checking
 */
export function validateInput<T>(
  value: unknown,
  validator: (v: unknown) => v is T,
  defaultValue: T
): T {
  return validator(value) ? value : defaultValue;
}
