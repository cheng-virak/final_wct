import express from 'express';
import { dbMethods } from '../db/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. List Bookings and Holds
router.get('/', (req, res) => {
  const { venue_id, user_id, status, active_only } = req.query;
  const bookings = dbMethods.getBookings({ venue_id, user_id, status, active_only: active_only === 'true' });
  res.json({ count: bookings.length, data: bookings });
});

// 2. Check Availability / Conflict Query
router.post('/check-availability', (req, res) => {
  const { venue_id, start_time, end_time, exclude_id } = req.body;
  if (!venue_id || !start_time || !end_time) {
    return res.status(400).json({ error: 'venue_id, start_time, and end_time are required.' });
  }

  const conflicts = dbMethods.checkOverlaps(venue_id, start_time, end_time, exclude_id);
  const isAvailable = conflicts.length === 0;

  res.json({
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
});

// 3. Dynamic Quote Calculator Engine
router.post('/quote', (req, res) => {
  const { venue_id, start_time, end_time, amenity_ids = [], guest_count = 50 } = req.body;
  if (!venue_id || !start_time || !end_time) {
    return res.status(400).json({ error: 'venue_id, start_time, and end_time are required.' });
  }

  const venue = dbMethods.getVenueById(venue_id);
  if (!venue) {
    return res.status(404).json({ error: 'Venue not found' });
  }

  const start = new Date(start_time);
  const end = new Date(end_time);
  const durationHours = Math.max(1, (end.getTime() - start.getTime()) / 3600000);

  // Check if booking falls on weekend (Friday evening, Saturday, or Sunday)
  const day = start.getDay(); // 0 is Sunday, 6 is Saturday, 5 is Friday
  const isWeekend = day === 0 || day === 6 || (day === 5 && start.getHours() >= 17);
  const multiplier = isWeekend ? (venue.weekend_multiplier || 1.25) : 1.0;

  const basePrice = Math.round(durationHours * venue.hourly_rate * multiplier);

  // Calculate chosen amenities
  const allAmenities = dbMethods.getAmenities();
  const selectedAmenities = allAmenities.filter(a => amenity_ids.map(Number).includes(a.id));

  let amenitiesPrice = 0;
  const amenitiesBreakdown = selectedAmenities.map(am => {
    const cost = Math.round(am.flat_fee + (am.hourly_fee * durationHours));
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
  const serviceTax = Math.round(subtotal * 0.08); // 8% venue service & facilities fee
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

// 4. Create Booking or Tentative Hold
router.post('/', optionalAuth, (req, res) => {
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

  // Determine user ID
  const effectiveUserId = (req.user && req.user.id) || Number(user_id) || 2; // fallback to demo client

  // Check for collision
  const conflicts = dbMethods.checkOverlaps(venue_id, start_time, end_time);
  if (conflicts.length > 0) {
    return res.status(409).json({
      error: 'Time slot conflict. This venue space is already reserved or held during this timeframe.',
      conflicts
    });
  }

  // Calculate pricing
  const venue = dbMethods.getVenueById(venue_id);
  const start = new Date(start_time);
  const end = new Date(end_time);
  const durationHours = Math.max(1, (end.getTime() - start.getTime()) / 3600000);

  const day = start.getDay();
  const isWeekend = day === 0 || day === 6 || (day === 5 && start.getHours() >= 17);
  const multiplier = isWeekend ? (venue.weekend_multiplier || 1.25) : 1.0;
  const basePrice = Math.round(durationHours * venue.hourly_rate * multiplier);

  const allAmenities = dbMethods.getAmenities();
  const selectedAmenities = allAmenities.filter(a => amenity_ids.map(Number).includes(a.id));
  const amenitiesPrice = selectedAmenities.reduce((sum, a) => sum + Math.round(a.flat_fee + (a.hourly_fee * durationHours)), 0);
  const totalPrice = basePrice + amenitiesPrice + Math.round((basePrice + amenitiesPrice) * 0.08);

  const newBooking = dbMethods.createBooking({
    user_id: effectiveUserId,
    venue_id,
    event_name,
    event_type: event_type || 'Corporate / Private Event',
    start_time,
    end_time,
    is_tentative_hold: Boolean(is_tentative_hold),
    hold_hours: Number(hold_hours) || 48,
    guest_count: Number(guest_count) || 50,
    duration_hours: Number(durationHours.toFixed(1)),
    base_price: basePrice,
    amenities_price: amenitiesPrice,
    total_price: totalPrice,
    amenity_ids,
    notes: notes || ''
  });

  res.status(201).json({
    message: is_tentative_hold
      ? 'Tentative 48-hour hold placed successfully without upfront charge.'
      : 'Booking confirmed successfully.',
    data: newBooking
  });
});

// 5. Update Booking Status (Confirm, Release, Cancel, Expire)
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['AVAILABLE', 'HELD', 'CONFIRMED', 'EXPIRED', 'CANCELLED'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const updated = dbMethods.updateBookingStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Booking record not found' });
  }

  res.json({
    message: `Booking status updated to ${status}`,
    data: updated
  });
});

// 6. Extend Tentative Hold (+24 hours)
router.post('/:id/extend-hold', (req, res) => {
  const { additional_hours = 24 } = req.body;
  const updated = dbMethods.extendHold(req.params.id, Number(additional_hours));
  if (!updated) {
    return res.status(400).json({ error: 'Unable to extend hold. Ensure booking exists and is currently in HELD status.' });
  }

  res.json({
    message: `Tentative hold extended by ${additional_hours} hours.`,
    data: updated
  });
});

export default router;
