const jwt = require('jsonwebtoken');

const noAuthPaths = [
  '/health',
  '/auth/create-account',
  '/auth/login',
  '/auth/google/callback'
];

const requireAuth = (req, res, next) => {
  // Vérifier si le chemin est dans la liste des exceptions
  if (noAuthPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(404);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ error: 'Invalid token', details: err.message });
    }
    req.user = user;
    next();
  });
};

module.exports = { requireAuth };