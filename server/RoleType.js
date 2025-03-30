const mongoose = require('mongoose');
const Role = require('./model/Role');  // Adjust path if necessary
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.mongo_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');
        
        const roles = [
            { role_id: '1', role_type: 'superAdmin' },
            { role_id: '2', role_type: 'client' },
            { role_id: '3', role_type: 'vet' },
            { role_id: '4', role_type: 'expertise' }
        ];

        for (const role of roles) {
            const existingRole = await Role.findOne({ role_id: role.role_id });
            if (!existingRole) {
                await Role.create(role);
                console.log(`Role ${role.role_type} added`);
            }
        }
        mongoose.connection.close();
    })
    .catch(err => console.log(err));
