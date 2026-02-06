// usage: requireRole('admin'), requireRoles(['admin','owner','creator'])
exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).send({ message: 'Unauthenticated' });
  if (req.user.role !== role && req.user.role !== 'owner') { // owner bypass
    return res.status(403).send({ message: 'Forbidden' });
  }
  next();
};

exports.requireAnyRole = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).send({ message: 'Unauthenticated' });
  if (roles.includes(req.user.role) || req.user.role === 'owner') return next();
  return res.status(403).send({ message: 'Forbidden' });
};
