import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured on the server' });
    }

    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided, please login' });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please login again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: error.message });
  }
};
