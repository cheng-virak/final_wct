import express from 'express';
import { Amenity } from '../models/Amenity.js';
import { dbMethods } from '../db/database.js';

const router = express.Router();

// List all amenities from MongoDB
router.get('/', async (req, res) => {
  try {
    const amenities = await Amenity.find().sort({ id: 1 }).lean();
    if (amenities && amenities.length > 0) {
      return res.json({ count: amenities.length, data: amenities });
    }
  } catch (err) {
    console.warn('Fallback to local amenities cache:', err.message);
  }

  const fallback = dbMethods.getAmenities();
  res.json({ count: fallback.length, data: fallback });
});

export default router;
