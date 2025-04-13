const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // use env variable in real apps
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = {
      _id: user._id,
      role: user.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token", details: err.message });
  }
};

module.exports = { requireAuth };
