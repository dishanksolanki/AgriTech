import { Router } from 'express';

const router = Router();

// Mock / Live routing definition
router.get('/ping', (req, res) => {
  res.json({ message: 'AgriTech API operational' });
});

// Authentication Routes
router.post('/auth/register', (req, res) => {
  res.json({ success: true, message: 'Register endpoint ready for MongoDB connection' });
});

router.post('/auth/login', (req, res) => {
  res.json({ success: true, message: 'Login endpoint ready for MongoDB connection' });
});

// Farm & Crop Routes
router.get('/farms', (req, res) => {
  res.json([]);
});

router.get('/crops', (req, res) => {
  res.json([]);
});

// Soil Reports
router.get('/soil-reports', (req, res) => {
  res.json([]);
});

// Alerts
router.get('/alerts', (req, res) => {
  res.json([]);
});

// Products & Orders
router.get('/products', (req, res) => {
  res.json([]);
});

router.get('/orders', (req, res) => {
  res.json([]);
});

export default router;
