const jwt = require('jsonwebtoken');
const User = require('../model/User');

exports.protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Get user from DB
    const currentUser = await User.findById(decoded.userId).populate('role_id');
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }

    // 4) Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role_id.role_type)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};