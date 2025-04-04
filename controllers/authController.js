const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.email) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Find user by decoded email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Forbidden' });
  }
};

const authorizeOrganizer = async function (req, res, next) {
  try {
    const user = req.user;
    
    // Check for the organizer role
    if (!user.roles.includes('organizer')) {
          return res.status(500).json({ message: "User is not authorized to perform the action" });
    }
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Forbidden' });
  }
}

module.exports = { authenticate, authorizeOrganizer };
