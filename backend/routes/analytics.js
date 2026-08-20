import express from 'express';
import { dbMethods } from '../db/database.js';

const router = express.Router();

// Analytics Overview
router.get('/', (req, res) => {
  const stats = dbMethods.getAnalytics();
  res.json({ data: stats });
});

export default router;
