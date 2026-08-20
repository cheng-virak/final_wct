import express from 'express';
import { dbMethods } from '../db/database.js';

const router = express.Router();

// List all amenities
router.get('/', (req, res) => {
  const amenities = dbMethods.getAmenities();
  res.json({ count: amenities.length, data: amenities });
});

export default router;
