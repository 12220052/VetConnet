const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role_type: { type: String, required: true, unique: true },
    role_description:{type: String}
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
