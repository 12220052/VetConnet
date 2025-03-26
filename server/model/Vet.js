// models/Vet.js
const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    required: true 
  },
  startTime: { type: String, default: "09:00 AM" }, // 12-hour format
  endTime: { type: String, default: "05:00 PM" },   // 12-hour format
  isAvailable: { type: Boolean, default: true }     // Always true (frontend filters)
});

const vetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availability: { 
    type: [availabilitySchema], 
    default: () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      .map(day => ({ day })) // Defaults auto-applied (9 AM - 5 PM)
  }
});

module.exports = mongoose.model('Vet', vetSchema);