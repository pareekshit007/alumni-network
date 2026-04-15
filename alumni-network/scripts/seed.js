const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../backend/.env' });

const User = require('../backend/src/models/User.model');

const seedDB = async () => {
    try {
        console.log('Connecting to Database...');
        // Targeting the local mapped port exposed by Docker-compose bypass mapping
        await mongoose.connect('mongodb://admin:adminpassword@localhost:27017/alumni_db?authSource=admin');
        console.log('Connected to cluster.');

        console.log('Purging existing datastore mappings...');
        await User.deleteMany({});

        console.log('Generating seed tree arrays...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const admin = new User({
            name: 'System Admin',
            email: 'admin@alumninet.com',
            password: hashedPassword,
            role: 'admin',
            graduationYear: 2020,
            branch: 'CSE',
            currentCompany: 'AlumniNet Tech',
            currentRole: 'Superuser Matrix'
        });

        const alumni1 = new User({
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: hashedPassword,
            role: 'alumni',
            graduationYear: 2021,
            branch: 'IT',
            currentCompany: 'Google',
            currentRole: 'Senior SWE',
            skills: ['React', 'Node.js', 'Docker Kubernetes', 'AWS Terraform']
        });

        const student = new User({
            name: 'John Smith',
            email: 'john@student.com',
            password: hashedPassword,
            role: 'student',
            graduationYear: 2025,
            branch: 'CSE',
            skills: ['Python Math', 'C++ Trees']
        });

        await admin.save();
        await alumni1.save();
        await student.save();

        console.log('Database Initialized Successfully. Admin: admin@alumninet.com | Pw: password123');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Exception Handled:', err);
        process.exit(1);
    }
};

seedDB();
