const rateLimit = require('express-rate-limit');

// General rate limiter for all routes - more lenient for real-time app
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // limit each IP to 300 requests per minute (5 per second)
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for socket.io requests
    return req.path.startsWith('/socket.io/') || req.path.includes('socket.io');
  }
});

// Stricter limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 authentication attempts per 5 minutes
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for password change
const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 password change attempts per hour
  message: {
    error: 'Too many password change attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 20 uploads per 5 minutes
  message: {
    error: 'Too many file uploads, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific limiter for API endpoints that might be called frequently
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 API requests per minute
  message: {
    error: 'Too many API requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for socket.io requests
    return req.path.startsWith('/socket.io/') || req.path.includes('socket.io');
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordChangeLimiter,
  uploadLimiter,
  apiLimiter
}; 