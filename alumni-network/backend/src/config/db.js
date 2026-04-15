const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`MongoDB connection error: ${err.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) throw new Error('MongoDB connection failed after all retries');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
