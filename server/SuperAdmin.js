// require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/User');
const Role = require('./model/Role');
require('dotenv').config();

mongoose.connect(process.env.mongo_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const seedSuperAdmin = async () => {
    try {
        const role = await Role.findOne({ role_type: 'superAdmin' });
        if (!role) {
            console.log("Super Admin role not found. Please add it to the Role collection.");
            return;
        }

        const existingSuperAdmin = await User.findOne({ email: process.env.EMAIL_USER });
        if (existingSuperAdmin) {
            console.log("Super Admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash('apple@123', 10);
        console.log("Hashed password:", hashedPassword);
        const superAdmin = new User({
            name: "Super Admin",
            email: process.env.EMAIL_USER,
            password: hashedPassword,
            role_id: role._id,
            is_approved: true
        });

        await superAdmin.save();
        console.log("Super Admin registered successfully.");
    } catch (error) {
        console.error("Error seeding Super Admin:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedSuperAdmin();
