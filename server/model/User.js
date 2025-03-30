const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    agreeToTerms:{type: Boolean, default: false},
    contact_no: { type: String, default: null },
    CID:{type:Number, default:null},
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    created_at: { type: Date, default: Date.now },
    vet_license: { type: String, default: null },
    specialist: { type: String, default: null },
    location: { type: String, default: null },
    certifications: { type: [String], default: [] },
    gender: { type: String, default: null },
    is_approved: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    rejectionReason: { type: String, default: null }

});

const User = mongoose.model('User', userSchema);
module.exports = User;
