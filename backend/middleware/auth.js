const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided or invalid format'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.userId)
      .populate('tenant', 'name slug subscription')
      .select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token or user not found'
      });
    }

    req.user = user;
    req.tenant = user.tenant;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Access denied',
      message: error.message
    });
  }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

// Admin only middleware
const adminOnly = authorize(['admin']);

// Member or Admin middleware
const memberOrAdmin = authorize(['member', 'admin']);

// Tenant isolation middleware - ensures user can only access their tenant's data
const tenantIsolation = (req, res, next) => {
  if (!req.user || !req.tenant) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication required'
    });
  }

  // Add tenant filter to request for use in routes
  req.tenantFilter = { tenant: req.user.tenant._id };
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authorize,
  adminOnly,
  memberOrAdmin,
  tenantIsolation
};
