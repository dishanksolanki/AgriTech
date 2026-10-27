import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRouter from './src/routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AgriTech REST API',
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('[AgriTech Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB Atlas and Start Server
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas database.');
      app.listen(PORT, () => {
        console.log(`AgriTech Express Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB Atlas:', err.message);
      process.exit(1);
    });
} else {
  console.warn('WARNING: MONGODB_URI not provided in .env. Running in preview test mode.');
  app.listen(PORT, () => {
    console.log(`AgriTech Express Server listening on port ${PORT} (Awaiting MongoDB config)`);
  });
}
