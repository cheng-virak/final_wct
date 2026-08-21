import express from 'express';
import { Venue } from '../models/Venue.js';
import { dbMethods } from '../db/database.js';

const router = express.Router();

// List all venues from MongoDB
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find({ is_active: true }).sort({ id: 1 }).lean();
    if (venues && venues.length > 0) {
      return res.json({ count: venues.length, data: venues });
    }
  } catch (err) {
    console.warn('Fallback to local venues cache:', err.message);
  }

  const fallback = dbMethods.getVenues();
  res.json({ count: fallback.length, data: fallback });
});

// Get venue by ID from MongoDB
router.get('/:id', async (req, res) => {
  const venueId = Number(req.params.id);
  try {
    const venue = await Venue.findOne({ id: venueId }).lean();
    if (venue) {
      return res.json({ data: venue });
    }
  } catch (err) {
    console.warn('Fallback venue lookup:', err.message);
  }

  const fallback = dbMethods.getVenueById(venueId);
  if (!fallback) {
    return res.status(404).json({ error: 'Venue not found' });
  }
  res.json({ data: fallback });
});

export default router;
