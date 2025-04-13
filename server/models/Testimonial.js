const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    testimonialID: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, maxlength: 50, trim: true },
    email: { type: String, required: true, maxlength: 50, trim: true },
    Review: { type: String, required: true, maxlength: 50, trim: true },
    Date: { type: Date, default: Date.now, required: true },
    Disable: { type: Boolean, default: false, required: true }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
