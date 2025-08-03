const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_KEY } = process.env;
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next(); //allow the request to continue
  }
  
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      throw new Error('No authorization header provided');
    }
    
    // Check if it's a Bearer token
    if (!req.headers.authorization.startsWith('Bearer ')) {
      throw new Error('Invalid authorization format. Use Bearer token');
    }
    
    const token = req.headers.authorization.split(' ')[1]; //Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('No token provided');
    }
    
    // Validate JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_KEY);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (jwtError.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
    
    // Check if token has required fields
    if (!decodedToken.userId) {
      throw new Error('Invalid token payload');
    }
    
    // Add user data to request
    req.userData = { 
      userId: decodedToken.userId,
      email: decodedToken.email 
    };
    
    next(); //let the request continue
  } catch (err) {
    console.error('Authentication error:', err.message);
    return next(new HttpError(err.message || 'Authentication failed!', 401));
  }
};
