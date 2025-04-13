const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  vetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model for vets
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model for clients
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 6,
    required: true,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
