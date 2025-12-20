// Role-based access control middleware
// STRICT: Only allows specified roles
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role '${req.user.role}' is not authorized. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};


