const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../errors/AppError');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('UNAUTHORIZED', 401, 'Authentication required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch {
    return next(new AppError('TOKEN_EXPIRED', 401, 'Invalid or expired token'));
  }
};

const authorize = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('UNAUTHORIZED', 401, 'Authentication required'));
  }

  if (roles.length && !roles.includes(req.user.role)) {
    return next(new AppError('FORBIDDEN', 403, 'Insufficient permissions'));
  }

  next();
};

module.exports = { authenticate, authorize };
