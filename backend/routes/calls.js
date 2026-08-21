import express from 'express';
import { CallRequest } from '../models/CallRequest.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// List all concierge call requests from MongoDB
router.get('/', async (req, res) => {
  try {
    const requests = await CallRequest.find().sort({ createdAt: -1 }).lean();
    return res.json({ count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a new instant concierge callback request to MongoDB
router.post('/request', optionalAuth, async (req, res) => {
  const { client_name, client_phone, client_email, venue_name, preferred_time, topic, notes } = req.body;

  if (!client_name || !client_phone) {
    return res.status(400).json({ error: 'Client name and phone number are required for concierge callback.' });
  }

  const newId = Date.now();

  try {
    const callDoc = await CallRequest.create({
      id: newId,
      client_name,
      client_phone,
      client_email: client_email || req.user?.email || '',
      venue_name: venue_name || 'General Inquiry',
      preferred_time: preferred_time || 'ASAP (Within 15 mins)',
      topic: topic || 'Venue Consultation',
      notes: notes || '',
      status: 'PENDING'
    });

    return res.status(201).json({
      message: 'Concierge callback request logged successfully into MongoDB.',
      data: callDoc
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update status of a call request (e.g. COMPLETED)
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const requestId = Number(req.params.id);

  try {
    const updated = await CallRequest.findOneAndUpdate(
      { id: requestId },
      { $set: { status } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Call request not found' });
    res.json({ message: `Call status updated to ${status}`, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
