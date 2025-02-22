const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Token' });
  }
};

// Middleware to check ADMIN role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access Denied: Admins only' });
  }
  next();
};

// Middleware to check LIBRARIAN or above role
const isLibrarian = (req, res, next) => {
  if (!(req.user.role == 'LIBRARIAN' || req.user.role == 'ADMIN')) {
    return res.status(403).json({ message: 'Access Denied: Librarians only' });
  }
  next();
};

// Middleware to check any role
const isUser = (req, res, next) => {
  if (req.user.role == null) {
    return res.status(403).json({ message: 'Access Denied: Users only' });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isLibrarian, isUser };