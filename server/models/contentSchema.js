const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    contentID: { type: mongoose.Schema.Types.ObjectId, auto: true },
    Disease_Name: { type: String, maxlength: 50, trim: true },
    Description: { type: String, trim: true },
    Question: { type: String, maxlength: 50, trim: true },
    image: { type: [String], default: [],trim: true  },
    Answer: { type: String, maxlength: 255, trim: true },
    Posted_Date: { type: Date, default: Date.now, required: true },
}, { strict: false }); // Allows flexible schema without null fields

module.exports = mongoose.model('Content', contentSchema);
