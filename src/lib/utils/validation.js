import { RESERVED_USERNAMES } from '../constants';

/**
 * Validate username format
 * - 3-20 characters
 * - Lowercase letters, numbers, underscores only
 * - Cannot start with a number or underscore
 */
export function validateUsernameFormat(username) {
  if (!username) return { valid: false, error: 'Username is required' };
  
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 20) {
    return { valid: false, error: 'Username must be 20 characters or less' };
  }
  
  if (!/^[a-z][a-z0-9_]*$/.test(username)) {
    return { 
      valid: false, 
      error: 'Username must start with a letter and contain only lowercase letters, numbers, and underscores' 
    };
  }
  
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return { valid: false, error: 'This username is reserved' };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email) return { valid: false, error: 'Email is required' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password) return { valid: false, error: 'Password is required' };
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate URL format
 */
export function validateUrl(url) {
  if (!url) return { valid: true, error: null }; // URLs can be optional
  
  try {
    new URL(url);
    return { valid: true, error: null };
  } catch {
    return { valid: false, error: 'Please enter a valid URL' };
  }
}
