import express from 'express';
import { Booking } from '../models/Booking.js';
import { Venue } from '../models/Venue.js';
import { dbMethods } from '../db/database.js';

const router = express.Router();

// Real Analytics Aggregations directly from MongoDB
router.get('/', async (req, res) => {
  try {
    const totalVenues = await Venue.countDocuments({ is_active: true });
    const venues = await Venue.find({ is_active: true }).lean();
    const bookings = await Booking.find().lean();

    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
    const activeHolds = bookings.filter(b => b.status === 'HELD');
    const expiredHolds = bookings.filter(b => b.status === 'EXPIRED');

    const confirmedRevenue = confirmedBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
    const projectedHoldRevenue = activeHolds.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

    const venueStats = venues.map(v => {
      const vBookings = bookings.filter(b => b.venue_id === v.id);
      const conf = vBookings.filter(b => b.status === 'CONFIRMED');
      const holds = vBookings.filter(b => b.status === 'HELD');
      const rev = conf.reduce((sum, b) => sum + Number(b.total_price || 0), 0);
      const totalHours = conf.reduce((sum, b) => sum + Number(b.duration_hours || 0), 0);

      return {
        venue_id: v.id,
        venue_name: v.name,
        type: v.type,
        confirmed_count: conf.length,
        active_holds_count: holds.length,
        total_revenue: rev,
        total_hours: totalHours,
        occupancy_rate: Math.min(100, Math.round((totalHours / 360) * 100))
      };
    });

    const overallOccupancy = Math.round(
      venueStats.reduce((sum, s) => sum + s.occupancy_rate, 0) / (totalVenues || 1)
    );

    const holdConversionRate = bookings.length > 0
      ? Math.round((confirmedBookings.length / (confirmedBookings.length + expiredHolds.length || 1)) * 100)
      : 0;

    return res.json({
      data: {
        totalVenues,
        totalBookings: bookings.length,
        confirmedBookingsCount: confirmedBookings.length,
        activeHoldsCount: activeHolds.length,
        expiredHoldsCount: expiredHolds.length,
        confirmedRevenue,
        projectedHoldRevenue,
        totalProjectedRevenue: confirmedRevenue + projectedHoldRevenue,
        overallOccupancyRate: overallOccupancy,
        holdConversionRate,
        venueStats
      }
    });
  } catch (err) {
    console.warn('Analytics fallback:', err.message);
  }

  const fallback = dbMethods.getAnalytics();
  res.json({ data: fallback });
});

export default router;
