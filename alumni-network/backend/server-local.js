const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User.model');
require('dotenv').config();

(async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  console.log('In-memory MongoDB started at:', process.env.MONGO_URI);
  
  require('./src/server.js');
  
  // Wait a bit for mongoose to connect
  setTimeout(async () => {
    try {
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
        await admin.save();
        console.log('Seed complete => admin@alumninet.com | password123');
    } catch(err) {
        console.error("Seed error", err);
    }
  }, 2000);
})();
