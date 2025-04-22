const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  contentID: { type: mongoose.Schema.Types.ObjectId, auto: true },
  Disease_Name: { type: String, maxlength: 50, trim: true },
  Description: { type: String, trim: true },
  Question: { type: String, maxlength: 50, trim: true },
  image: { type: [String], default: [] }, // No trim on array
  Answer: { type: String, maxlength: 255, trim: true },
  contentType: { type: String, trim: true }, // For filtering FAQ
  Posted_Date: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("Content", contentSchema);
