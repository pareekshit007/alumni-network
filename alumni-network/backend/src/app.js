const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// We will require the error middleware explicitly as instructed
// It will throw an error until generated in Part 4, which is expected during construction.
const errorHandler = require('./middleware/error.middleware');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes imported here (will be generated in later parts)
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const eventRoutes = require('./routes/event.routes');
const messageRoutes = require('./routes/message.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint mapping
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Global Error Handler mapped at the end
app.use(errorHandler);

module.exports = app;
