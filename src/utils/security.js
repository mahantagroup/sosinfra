/**
 * Security utility for input sanitization and validation.
 */

/**
 * Sanitizes a string input to prevent basic XSS and injection.
 * @param {string} input - The raw input string.
 * @returns {string} - The sanitized string.
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Sanitizes an entire object of inputs.
 * @param {Object} data - The object containing raw inputs.
 * @returns {Object} - The object with sanitized values.
 */
export const sanitizeObject = (data) => {
  const sanitized = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      sanitized[key] = sanitizeInput(data[key]);
    }
  }
  return sanitized;
};

/**
 * Simple rate limiter for client-side actions.
 * Stores timestamps in localStorage.
 * @param {string} actionKey - Unique key for the action (e.g., 'login_attempt').
 * @param {number} limit - Max number of attempts allowed in the window.
 * @param {number} windowMs - Time window in milliseconds.
 * @returns {boolean} - True if action is allowed, False if rate limited.
 */
export const rateLimit = (actionKey, limit = 5, windowMs = 60000) => {
  const now = Date.now();
  const storageKey = `rate_limit_${actionKey}`;
  const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  // Filter history to current window
  const validHistory = history.filter(timestamp => now - timestamp < windowMs);
  
  if (validHistory.length >= limit) {
    return false;
  }
  
  validHistory.push(now);
  localStorage.setItem(storageKey, JSON.stringify(validHistory));
  return true;
};

/**
 * Validates if a string is a valid email.
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
