const jwt = require('jsonwebtoken');

const publicRoutes = [
  '/api/auth/login',
  '/api/auth/forgot-password',
  '/api/auth/verify-otp',
  '/api/auth/reset-password',
  '/api/auth/refresh-token',
  '/api/notifications/otp',
  '/health',
];

function authMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    const isPublicRoute = publicRoutes.some((route) => req.originalUrl.startsWith(route));

    if (isPublicRoute) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: 'Insufficient permissions' });
      }

      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };
}

module.exports = { authMiddleware };
