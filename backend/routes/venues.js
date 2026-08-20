import express from 'express';
import { dbMethods } from '../db/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// List all venues
router.get('/', (req, res) => {
  const venues = dbMethods.getVenues();
  res.json({ count: venues.length, data: venues });
});

// Get venue by ID
router.get('/:id', (req, res) => {
  const venue = dbMethods.getVenueById(req.params.id);
  if (!venue) {
    return res.status(404).json({ error: 'Venue not found' });
  }
  res.json({ data: venue });
});

export default router;
