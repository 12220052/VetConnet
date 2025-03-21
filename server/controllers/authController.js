const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Convert JWT_COOKIE_EXPIRES_IN to a valid number
  const cookieExpiresInDays = Number(process.env.JWT_COOKIE_EXPIRES_IN);
  if (isNaN(cookieExpiresInDays)) {
    throw new Error("JWT_COOKIE_EXPIRES_IN must be a valid number.");
  }

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

// Signup function with duplicate email check
exports.signup = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return next(
        new AppError("Email already exists. Please use a different email.", 400)
      );
    }

    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login function
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide an email and password!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
