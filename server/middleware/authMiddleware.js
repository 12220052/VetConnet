const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId)
      .populate("role_id", "role_type")
      .select("name email role_id");

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

// 🛡 Admin check middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user?.role_id?.role_type !== "superAdmin") {
    return res.status(403).json({ error: "Access denied. SuperAdmins only." });
  }
  next();
};

module.exports = { authenticateUser, authorizeAdmin };
