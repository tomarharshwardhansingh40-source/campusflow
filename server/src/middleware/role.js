export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    })
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: `Forbidden: Access restricted to ${allowedRoles.join(' or ')}`,
      },
    })
  }

  next()
}
