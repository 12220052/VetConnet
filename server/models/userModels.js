const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "vet", "expertise", "admin"],
    default: "user",
  },
  phoneNumber: {
    type: String,
    required: [false, "Please provide your phone number"],
    unique: false,
    validate: [validator.isMobilePhone, "Please provide a valid phone number"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false, // Security: Prevent password from being queried
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Middleware to hash password before saving a new user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Remove passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Middleware for hashing password when updating
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (
    update.password !== "" &&
    update.password !== undefined &&
    update.password !== update.passwordConfrim
  ) {
    //Hash the password with cost of 12
    this.getUpdate().password = await bcrypt.hash(update.password, 12);

    // Delete passwordConfirm field
    update.passwordConfirm = undefined;
    next();
  } else next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
