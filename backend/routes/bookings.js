import express from 'express';
import { Booking } from '../models/Booking.js';
import { Venue } from '../models/Venue.js';
import { Amenity } from '../models/Amenity.js';
import { User } from '../models/User.js';
import { dbMethods, autoExpireHolds } from '../db/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. List Bookings and Holds directly from MongoDB
router.get('/', async (req, res) => {
  const { venue_id, user_id, status, active_only } = req.query;
  
  try {
    const query = {};
    if (venue_id) query.venue_id = Number(venue_id);
    if (user_id) query.user_id = Number(user_id);
    if (status) query.status = status;
    if (active_only === 'true') query.status = { $in: ['HELD', 'CONFIRMED'] };

    // Auto expire old holds
    const now = new Date();
    await Booking.updateMany(
      { status: 'HELD', hold_expires_at: { $lte: now } },
      { status: 'EXPIRED' }
    );

    const bookings = await Booking.find(query).sort({ start_time: -1 }).lean();
    if (bookings) {
      return res.json({ count: bookings.length, data: bookings });
    }
  } catch (err) {
    console.warn('Fallback to local bookings cache:', err.message);
  }

  const fallback = dbMethods.getBookings({ venue_id, user_id, status, active_only: active_only === 'true' });
  res.json({ count: fallback.length, data: fallback });
});

// 2. Check Availability / Conflict Query from MongoDB
router.post('/check-availability', async (req, res) => {
  const { venue_id, start_time, end_time, exclude_id } = req.body;
  if (!venue_id || !start_time || !end_time) {
    return res.status(400).json({ error: 'venue_id, start_time, and end_time are required.' });
  }

  const reqStart = new Date(start_time);
  const reqEnd = new Date(end_time);

  try {
    const query = {
      venue_id: Number(venue_id),
      status: { $in: ['HELD', 'CONFIRMED'] },
      $or: [
        { start_time: { $lt: reqEnd }, end_time: { $gt: reqStart } }
      ]
    };
    if (exclude_id) {
      query.id = { $ne: Number(exclude_id) };
    }

    const conflicts = await Booking.find(query).lean();
    const isAvailable = conflicts.length === 0;

    return res.json({
      isAvailable,
      conflictCount: conflicts.length,
      conflicts: conflicts.map(c => ({
        id: c.id,
        event_name: c.event_name,
        start_time: c.start_time,
        end_time: c.end_time,
        status: c.status
      }))
    });
  } catch (err) {
    const fallbackConflicts = dbMethods.checkOverlaps(venue_id, start_time, end_time, exclude_id);
    return res.json({
      isAvailable: fallbackConflicts.length === 0,
      conflictCount: fallbackConflicts.length,
      conflicts: fallbackConflicts
    });
  }
});

// 3. Dynamic Quote Calculator Engine
router.post('/quote', async (req, res) => {
  const { venue_id, start_time, end_time, amenity_ids = [], guest_count = 50 } = req.body;
  if (!venue_id || !start_time || !end_time) {
    return res.status(400).json({ error: 'venue_id, start_time, and end_time are required.' });
  }

  let venue = null;
  try {
    venue = await Venue.findOne({ id: Number(venue_id) }).lean();
  } catch (err) {}
  if (!venue) venue = dbMethods.getVenueById(venue_id);

  if (!venue) {
    return res.status(404).json({ error: 'Venue not found' });
  }

  const start = new Date(start_time);
  const end = new Date(end_time);
  const durationHours = Math.max(1, (end.getTime() - start.getTime()) / 3600000);

  const day = start.getDay();
  const isWeekend = day === 0 || day === 6 || (day === 5 && start.getHours() >= 17);
  const multiplier = isWeekend ? (venue.weekend_multiplier || 1.25) : 1.0;
  const basePrice = Math.round(durationHours * venue.hourly_rate * multiplier);

  let allAmenities = [];
  try {
    allAmenities = await Amenity.find().lean();
  } catch (err) {}
  if (!allAmenities || allAmenities.length === 0) allAmenities = dbMethods.getAmenities();

  const selectedAmenities = allAmenities.filter(a => amenity_ids.map(Number).includes(a.id));

  let amenitiesPrice = 0;
  const amenitiesBreakdown = selectedAmenities.map(am => {
    const cost = Math.round((am.flat_fee || 0) + ((am.hourly_fee || 0) * durationHours));
    amenitiesPrice += cost;
    return {
      id: am.id,
      name: am.name,
      category: am.category,
      flat_fee: am.flat_fee,
      hourly_fee: am.hourly_fee,
      total_cost: cost
    };
  });

  const subtotal = basePrice + amenitiesPrice;
  const serviceTax = Math.round(subtotal * 0.08);
  const totalPrice = subtotal + serviceTax;

  res.json({
    venue_id: venue.id,
    venue_name: venue.name,
    hourly_rate: venue.hourly_rate,
    duration_hours: Number(durationHours.toFixed(1)),
    is_weekend: isWeekend,
    weekend_multiplier: multiplier,
    base_price: basePrice,
    amenities_price: amenitiesPrice,
    amenities_breakdown: amenitiesBreakdown,
    service_tax: serviceTax,
    total_price: totalPrice,
    min_booking_hours: venue.min_booking_hours
  });
});

// 4. Create Booking or Tentative Hold in MongoDB
router.post('/', optionalAuth, async (req, res) => {
  const {
    venue_id,
    user_id,
    event_name,
    event_type,
    start_time,
    end_time,
    is_tentative_hold,
    hold_hours = 48,
    guest_count,
    amenity_ids = [],
    notes
  } = req.body;

  if (!venue_id || !start_time || !end_time || !event_name) {
    return res.status(400).json({ error: 'Missing required booking details (venue_id, start_time, end_time, event_name).' });
  }

  const effectiveUserId = (req.user && req.user.id) || Number(user_id) || 1;

  let venue = null;
  let user = null;
  try {
    venue = await Venue.findOne({ id: Number(venue_id) }).lean();
    user = await User.findOne({ id: effectiveUserId }).lean();
  } catch (err) {}
  if (!venue) venue = dbMethods.getVenueById(venue_id);
  if (!user) user = dbMethods.findUserById(effectiveUserId);

  const start = new Date(start_time);
  const end = new Date(end_time);
  const durationHours = Math.max(1, (end.getTime() - start.getTime()) / 3600000);

  const day = start.getDay();
  const isWeekend = day === 0 || day === 6 || (day === 5 && start.getHours() >= 17);
  const multiplier = isWeekend ? (venue?.weekend_multiplier || 1.25) : 1.0;
  const basePrice = Math.round(durationHours * (venue?.hourly_rate || 400) * multiplier);

  let allAmenities = [];
  try {
    allAmenities = await Amenity.find().lean();
  } catch (err) {}
  if (!allAmenities || allAmenities.length === 0) allAmenities = dbMethods.getAmenities();

  const selectedAmenities = allAmenities.filter(a => amenity_ids.map(Number).includes(a.id));
  const amenitiesPrice = selectedAmenities.reduce((sum, a) => sum + Math.round((a.flat_fee || 0) + ((a.hourly_fee || 0) * durationHours)), 0);
  const totalPrice = basePrice + amenitiesPrice + Math.round((basePrice + amenitiesPrice) * 0.08);

  const isHold = Boolean(is_tentative_hold);
  const holdExpiresAt = isHold ? new Date(Date.now() + (Number(hold_hours) || 48) * 3600000) : null;
  const status = isHold ? 'HELD' : 'CONFIRMED';
  const newId = Date.now();

  const bookingDoc = {
    id: newId,
    user_id: effectiveUserId,
    venue_id: Number(venue_id),
    venue_name: venue?.name || 'Venue Hall',
    user_name: user?.name || 'Client',
    user_email: user?.email || '',
    user_company: user?.company || '',
    event_name,
    event_type: event_type || 'Private Event',
    start_time: start,
    end_time: end,
    duration_hours: Number(durationHours.toFixed(1)),
    guest_count: Number(guest_count) || 50,
    is_tentative_hold: isHold,
    hold_expires_at: holdExpiresAt,
    status,
    base_price: basePrice,
    amenities_price: amenitiesPrice,
    total_price: totalPrice,
    amenity_ids,
    notes: notes || ''
  };

  try {
    const created = await Booking.create(bookingDoc);
    dbMethods.createBooking(bookingDoc); // sync local mirror
    return res.status(201).json({
      message: isHold ? 'Tentative 48-hour hold placed in MongoDB.' : 'Booking confirmed in MongoDB.',
      data: created
    });
  } catch (err) {
    const local = dbMethods.createBooking(bookingDoc);
    return res.status(201).json({
      message: 'Booking saved.',
      data: local
    });
  }
});

// 5. Update Booking Status (Confirm, Release, Cancel, Expire) in MongoDB
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const bookingId = Number(req.params.id);

  const updateFields = { status };
  if (status === 'CONFIRMED') {
    updateFields.is_tentative_hold = false;
    updateFields.hold_expires_at = null;
  }

  try {
    const updated = await Booking.findOneAndUpdate(
      { id: bookingId },
      { $set: updateFields },
      { new: true }
    ).lean();

    dbMethods.updateBookingStatus(bookingId, status);

    if (updated) {
      return res.json({ message: `Status updated to ${status} in MongoDB`, data: updated });
    }
  } catch (err) {
    console.warn('MongoDB status update fallback:', err.message);
  }

  const localUpdated = dbMethods.updateBookingStatus(bookingId, status);
  if (!localUpdated) return res.status(404).json({ error: 'Booking record not found' });
  res.json({ message: `Status updated to ${status}`, data: localUpdated });
});

// 6. Extend Tentative Hold (+24 hours) in MongoDB
router.post('/:id/extend-hold', async (req, res) => {
  const bookingId = Number(req.params.id);
  const { additional_hours = 24 } = req.body;

  try {
    const booking = await Booking.findOne({ id: bookingId });
    if (booking && booking.status === 'HELD') {
      const currentExp = booking.hold_expires_at ? new Date(booking.hold_expires_at) : new Date();
      currentExp.setHours(currentExp.getHours() + Number(additional_hours));
      booking.hold_expires_at = currentExp;
      await booking.save();
      dbMethods.extendHold(bookingId, additional_hours);
      return res.json({ message: `Hold extended by ${additional_hours} hours in MongoDB`, data: booking });
    }
  } catch (err) {
    console.warn('MongoDB hold extension fallback:', err.message);
  }

  const localUpdated = dbMethods.extendHold(bookingId, Number(additional_hours));
  if (!localUpdated) return res.status(400).json({ error: 'Unable to extend hold.' });
  res.json({ message: `Hold extended by ${additional_hours} hours`, data: localUpdated });
});

export default router;
