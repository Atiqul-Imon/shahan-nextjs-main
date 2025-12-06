/**
 * Input validation and sanitization utilities
 */

// Input length limits
export const INPUT_LIMITS = {
  name: { min: 1, max: 100 },
  email: { max: 255 },
  password: { min: 8, max: 128 },
  title: { min: 1, max: 200 },
  description: { max: 10000 },
  message: { min: 1, max: 5000 },
  url: { max: 2048 },
  snippetTitle: { min: 1, max: 200 },
  snippetContent: { max: 50000 },
  technologies: { max: 50 }, // Max number of technologies
  adminNotes: { max: 2000 },
};

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL validation regex
export const URL_REGEX = /^https?:\/\/.+/i;

// Sanitize string - remove potentially dangerous characters
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/\0/g, ''); // Remove null bytes
}

// Validate email format
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > INPUT_LIMITS.email.max) return false;
  return EMAIL_REGEX.test(email);
}

// Validate URL format
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.length > INPUT_LIMITS.url.max) return false;
  try {
    new URL(url);
    return URL_REGEX.test(url);
  } catch {
    return false;
  }
}

// Validate string length
export function isValidLength(
  input: string,
  min: number,
  max: number
): boolean {
  if (typeof input !== 'string') return false;
  const length = input.trim().length;
  return length >= min && length <= max;
}

// Validate password strength
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'] };
  }
  
  if (password.length < INPUT_LIMITS.password.min) {
    errors.push(`Password must be at least ${INPUT_LIMITS.password.min} characters`);
  }
  
  if (password.length > INPUT_LIMITS.password.max) {
    errors.push(`Password must be no more than ${INPUT_LIMITS.password.max} characters`);
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Validate MongoDB ObjectId format
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Sanitize and validate input object
export function sanitizeInput<T extends Record<string, unknown>>(
  input: T,
  schema: Record<keyof T, { type: 'string' | 'number' | 'boolean' | 'array'; required?: boolean; maxLength?: number }>
): { valid: boolean; data: Partial<T>; errors: string[] } {
  const errors: string[] = [];
  const data: Partial<T> = {};
  
  for (const [key, config] of Object.entries(schema)) {
    const value = input[key];
    
    // Check required fields
    if (config.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`);
      continue;
    }
    
    // Skip validation if value is not provided and not required
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    // Type validation
    if (config.type === 'string' && typeof value !== 'string') {
      errors.push(`${key} must be a string`);
      continue;
    }
    
    if (config.type === 'number' && typeof value !== 'number') {
      errors.push(`${key} must be a number`);
      continue;
    }
    
    if (config.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`${key} must be a boolean`);
      continue;
    }
    
    if (config.type === 'array' && !Array.isArray(value)) {
      errors.push(`${key} must be an array`);
      continue;
    }
    
      // String length validation
      if (config.type === 'string' && config.maxLength) {
        const strValue = value as string;
        if (strValue.length > config.maxLength) {
          errors.push(`${key} must be no more than ${config.maxLength} characters`);
          continue;
        }
        // Sanitize string
        data[key as keyof T] = sanitizeString(strValue) as T[keyof T];
      } else {
        data[key as keyof T] = value as T[keyof T];
      }
  }
  
  return {
    valid: errors.length === 0,
    data,
    errors,
  };
}

// Validate file upload
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  
  return { valid: true };
}

