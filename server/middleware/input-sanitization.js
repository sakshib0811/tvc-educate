const xss = require('xss');

// Sanitize HTML content
const sanitizeHtml = (html) => {
  return xss(html, {
    whiteList: {
      // Allow only safe HTML tags
      p: [],
      br: [],
      strong: [],
      em: [],
      u: [],
      ol: [],
      ul: [],
      li: [],
      code: [],
      pre: [],
      blockquote: [],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed']
  });
};

// Sanitize text content
const sanitizeText = (text) => {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Sanitize object recursively
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeText(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'body' || key === 'content') {
      // Sanitize HTML content
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'string') {
      // Sanitize text content
      sanitized[key] = sanitizeText(value);
    } else {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value);
    }
  }

  return sanitized;
};

const inputSanitization = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

module.exports = inputSanitization; 