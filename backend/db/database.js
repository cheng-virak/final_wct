import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'reservation_db.json');

// In-memory relational state initialized from disk or default seeds
let db = {
  users: [],
  venues: [],
  amenities: [],
  venue_amenities: [],
  bookings: [],
  booking_amenities: []
};

// Seed Data Generator
function generateSeedData() {
  const now = new Date();
  
  const formatDate = (offsetDays, hour, minute = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  const users = [
    {
      id: 1,
      name: 'Elena Rostova (Venue Director)',
      email: 'admin@venueworks.com',
      password_hash: '$2a$10$N.Z0/fA3v6QWc9O1nZ6zC.o1aQ5v9cWb3Z6zC.o1aQ5v9cWb3Z6zC', // 'admin123'
      role: 'ADMIN',
      phone: '+1 (555) 019-2831',
      company: 'Grand Horizon Venues & Suites',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: 2,
      name: 'Alexander Morgan',
      email: 'alex.morgan@acmecorp.com',
      password_hash: '$2a$10$N.Z0/fA3v6QWc9O1nZ6zC.o1aQ5v9cWb3Z6zC.o1aQ5v9cWb3Z6zC', // 'client123'
      role: 'CUSTOMER',
      phone: '+1 (555) 342-8901',
      company: 'Acme Global Innovations',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: 3,
      name: 'Sophia Chen',
      email: 'sophia.chen@apexsummit.com',
      password_hash: '$2a$10$N.Z0/fA3v6QWc9O1nZ6zC.o1aQ5v9cWb3Z6zC.o1aQ5v9cWb3Z6zC',
      role: 'CUSTOMER',
      phone: '+1 (555) 872-1144',
      company: 'Apex AI Summit',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ];

  const venues = [
    {
      id: 1,
      name: 'The Grand Imperial Ballroom',
      slug: 'grand-imperial-ballroom',
      type: 'Ballroom',
      capacity: 550,
      sqft: 8500,
      hourly_rate: 650,
      weekend_multiplier: 1.3,
      min_booking_hours: 4,
      image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      description: 'An opulent crystal-chandelier hall with dramatic double-height ceilings, built-in proscenium stage, and intelligent multi-zone acoustic treatment.',
      features: ['Crystal Chandeliers', 'Hydraulic Stage', 'Private VIP Green Room', 'Dual Bar Stations', 'Automated Ambient Lighting'],
      is_active: true
    },
    {
      id: 2,
      name: 'The Glasshouse Pavilion & Garden',
      slug: 'glasshouse-pavilion',
      type: 'Glass Pavilion',
      capacity: 220,
      sqft: 4200,
      hourly_rate: 420,
      weekend_multiplier: 1.25,
      min_booking_hours: 3,
      image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      description: 'Floor-to-ceiling panoramic architectural glass overlooking manicured botanical gardens, offering sublime natural lighting for galas and networking summits.',
      features: ['360° Panoramic Glass', 'Direct Botanical Garden Access', 'Retractable Glass Roof', 'Customizable Lounge Seating'],
      is_active: true
    },
    {
      id: 3,
      name: 'Apex Tech Amphitheater',
      slug: 'apex-tech-amphitheater',
      type: 'Amphitheater',
      capacity: 320,
      sqft: 5000,
      hourly_rate: 480,
      weekend_multiplier: 1.15,
      min_booking_hours: 3,
      image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
      description: 'Tiered stadium executive seating equipped with a 240-inch 4K LED video wall, broadcast-grade camera tracks, and studio sound.',
      features: ['240" 4K Video Wall', 'Tiered Ergonomic Seating', 'Live-Streaming Rig', 'Simultaneous Translation Booths'],
      is_active: true
    },
    {
      id: 4,
      name: 'Skyline Penthouse Terrace',
      slug: 'skyline-penthouse-terrace',
      type: 'Rooftop Terrace',
      capacity: 180,
      sqft: 3400,
      hourly_rate: 380,
      weekend_multiplier: 1.35,
      min_booking_hours: 2,
      image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      description: 'High-altitude open-air rooftop with heated fire pits, private infinity lounge, and 270-degree sunset city skyline vistas.',
      features: ['Heated Granite Fire Pits', 'Illuminated Perimeter Bar', 'Weather-Shield Pergola', 'Sunset Skyline Vista'],
      is_active: true
    },
    {
      id: 5,
      name: 'Executive Horizon Boardroom',
      slug: 'executive-horizon-boardroom',
      type: 'Boardroom',
      capacity: 28,
      sqft: 1100,
      hourly_rate: 180,
      weekend_multiplier: 1.1,
      min_booking_hours: 2,
      image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      description: 'Ultra-private soundproof sanctuary for C-level meetings, venture pitch sessions, and strategic quarterly planning.',
      features: ['Triple 85" Interactive Displays', 'Conference Polycom Audio', 'Motorized Blackout Blinds', 'Attached Private Catering Prep'],
      is_active: true
    }
  ];

  const amenities = [
    {
      id: 1,
      name: '4K Laser Projection & Concert Sound',
      category: 'A/V & Tech',
      flat_fee: 350,
      hourly_fee: 45,
      icon: 'Tv',
      description: 'Dual high-lumen 4K laser projectors, wireless Shure microphones, and surround acoustic arrays.'
    },
    {
      id: 2,
      name: 'Dynamic Stage & Architectural Lighting',
      category: 'Stage & Decor',
      flat_fee: 280,
      hourly_fee: 35,
      icon: 'SunMedium',
      description: 'DMX controlled moving-head spotlights, customizable color washes, and spotlight podiums.'
    },
    {
      id: 3,
      name: 'Executive Gourmet Catering & Bar Setup',
      category: 'Catering & Dining',
      flat_fee: 500,
      hourly_fee: 60,
      icon: 'Utensils',
      description: 'Commercial warming tables, buffet stations, artisan glassware, and bartender prep counters.'
    },
    {
      id: 4,
      name: 'Dedicated On-site Event Security (2 Guards)',
      category: 'Staffing & Security',
      flat_fee: 150,
      hourly_fee: 55,
      icon: 'ShieldCheck',
      description: 'Licensed professional security officers managing guest registration, entry control, and floor safety.'
    },
    {
      id: 5,
      name: '4K Multi-Camera Live Streaming & Recording',
      category: 'A/V & Tech',
      flat_fee: 450,
      hourly_fee: 50,
      icon: 'Video',
      description: '3-camera robotic tracking setup with real-time video switching and instant cloud recording access.'
    },
    {
      id: 6,
      name: 'Valet Parking Team & Staging Attendants',
      category: 'Staffing & Security',
      flat_fee: 220,
      hourly_fee: 40,
      icon: 'Car',
      description: 'White-glove valet attendants greeting arriving guests with seamless digital ticketing.'
    }
  ];

  const venue_amenities = [
    { venue_id: 1, amenity_id: 1 },
    { venue_id: 1, amenity_id: 2 },
    { venue_id: 1, amenity_id: 3 },
    { venue_id: 1, amenity_id: 4 },
    { venue_id: 1, amenity_id: 5 },
    { venue_id: 1, amenity_id: 6 },
    { venue_id: 2, amenity_id: 2 },
    { venue_id: 2, amenity_id: 3 },
    { venue_id: 2, amenity_id: 6 },
    { venue_id: 3, amenity_id: 1 },
    { venue_id: 3, amenity_id: 2 },
    { venue_id: 3, amenity_id: 4 },
    { venue_id: 3, amenity_id: 5 },
    { venue_id: 4, amenity_id: 2 },
    { venue_id: 4, amenity_id: 3 },
    { venue_id: 4, amenity_id: 6 },
    { venue_id: 5, amenity_id: 1 },
    { venue_id: 5, amenity_id: 3 }
  ];

  // Bookings with realistic tentative holds and confirmed reservations
  const bookings = [
    {
      id: 1,
      user_id: 2,
      venue_id: 1,
      event_name: 'Acme Annual Global Tech Summit 2026',
      event_type: 'Conference & Keynote',
      start_time: formatDate(2, 9),
      end_time: formatDate(2, 17),
      status: 'CONFIRMED',
      is_tentative_hold: false,
      hold_expires_at: null,
      guest_count: 420,
      duration_hours: 8,
      base_price: 5200,
      amenities_price: 1540,
      total_price: 6740,
      notes: 'Requires dual podium layout and lunch catering break at 1:00 PM.',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 2,
      user_id: 3,
      venue_id: 2,
      event_name: 'Venture Capital Gala & Awards Evening',
      event_type: 'Gala / Reception',
      start_time: formatDate(3, 18),
      end_time: formatDate(3, 23),
      status: 'HELD',
      is_tentative_hold: true,
      // Active hold expiring in ~36 hours
      hold_expires_at: new Date(Date.now() + 36 * 3600000).toISOString(),
      guest_count: 180,
      duration_hours: 5,
      base_price: 2625,
      amenities_price: 980,
      total_price: 3605,
      notes: 'Placing 48h provisional hold while board reviews budget.',
      created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 3600000).toISOString()
    },
    {
      id: 3,
      user_id: 2,
      venue_id: 3,
      event_name: 'AI Engineering Keynote & Hackathon Showcase',
      event_type: 'Tech Demo',
      start_time: formatDate(5, 13),
      end_time: formatDate(5, 18),
      status: 'HELD',
      is_tentative_hold: true,
      // Active hold expiring in ~14 hours (approaching expiration)
      hold_expires_at: new Date(Date.now() + 14 * 3600000).toISOString(),
      guest_count: 260,
      duration_hours: 5,
      base_price: 2400,
      amenities_price: 700,
      total_price: 3100,
      notes: 'Provisional hold for livestreaming keynote.',
      created_at: new Date(Date.now() - 34 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - 34 * 3600000).toISOString()
    },
    {
      id: 4,
      user_id: 3,
      venue_id: 5,
      event_name: 'Q3 Board of Directors Strategy Meeting',
      event_type: 'Corporate Board Meeting',
      start_time: formatDate(1, 10),
      end_time: formatDate(1, 15),
      status: 'CONFIRMED',
      is_tentative_hold: false,
      hold_expires_at: null,
      guest_count: 20,
      duration_hours: 5,
      base_price: 900,
      amenities_price: 350,
      total_price: 1250,
      notes: 'Private executive coffee and catering required.',
      created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 5,
      user_id: 2,
      venue_id: 4,
      event_name: 'Sunset Networking Mixer & Cocktail Reception',
      event_type: 'Networking Reception',
      start_time: formatDate(6, 17),
      end_time: formatDate(6, 22),
      status: 'CONFIRMED',
      is_tentative_hold: false,
      hold_expires_at: null,
      guest_count: 140,
      duration_hours: 5,
      base_price: 2565,
      amenities_price: 800,
      total_price: 3365,
      notes: 'Pergola open-air setup.',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ];

  const booking_amenities = [
    { id: 1, booking_id: 1, amenity_id: 1, quantity: 1, unit_price: 710 },
    { id: 2, booking_id: 1, amenity_id: 3, quantity: 1, unit_price: 980 },
    { id: 3, booking_id: 2, amenity_id: 2, quantity: 1, unit_price: 455 },
    { id: 4, booking_id: 2, amenity_id: 3, quantity: 1, unit_price: 800 },
    { id: 5, booking_id: 3, amenity_id: 1, quantity: 1, unit_price: 575 },
    { id: 6, booking_id: 3, amenity_id: 5, quantity: 1, unit_price: 700 }
  ];

  return { users, venues, amenities, venue_amenities, bookings, booking_amenities };
}

// Load or initialize DB
export function initDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(raw);
    } else {
      db = generateSeedData();
      saveDB();
    }
    autoExpireHolds();
  } catch (err) {
    console.error('Error loading database, resetting to seed data:', err);
    db = generateSeedData();
    saveDB();
  }
}

export function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database file:', err);
  }
}

// Background auto-expiration check for tentative holds
export function autoExpireHolds() {
  const now = new Date();
  let modified = false;
  db.bookings.forEach((b) => {
    if (b.status === 'HELD' && b.hold_expires_at) {
      if (new Date(b.hold_expires_at) <= now) {
        b.status = 'EXPIRED';
        b.updated_at = now.toISOString();
        modified = true;
      }
    }
  });
  if (modified) {
    saveDB();
  }
}

// -----------------------------------------------------------------
// DATABASE ACCESS METHODS
// -----------------------------------------------------------------

export const dbMethods = {
  // Users
  findUserByEmail(email) {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  findUserById(id) {
    return db.users.find(u => u.id === Number(id));
  },
  createUser(userData) {
    const nextId = db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: nextId,
      name: userData.name,
      email: userData.email,
      password_hash: userData.password_hash || 'demo_hash',
      role: userData.role || 'CUSTOMER',
      phone: userData.phone || '',
      company: userData.company || '',
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDB();
    return newUser;
  },

  // Venues
  getVenues() {
    return db.venues.map(v => {
      const attachedAmenities = db.venue_amenities
        .filter(va => va.venue_id === v.id)
        .map(va => db.amenities.find(a => a.id === va.amenity_id))
        .filter(Boolean);
      return { ...v, amenities: attachedAmenities };
    });
  },
  getVenueById(id) {
    const v = db.venues.find(item => item.id === Number(id));
    if (!v) return null;
    const attachedAmenities = db.venue_amenities
      .filter(va => va.venue_id === v.id)
      .map(va => db.amenities.find(a => a.id === va.amenity_id))
      .filter(Boolean);
    return { ...v, amenities: attachedAmenities };
  },

  // Amenities
  getAmenities() {
    return [...db.amenities];
  },

  // Bookings & Overlaps
  getBookings(filters = {}) {
    autoExpireHolds();
    let results = db.bookings.map(b => {
      const venue = db.venues.find(v => v.id === b.venue_id);
      const user = db.users.find(u => u.id === b.user_id);
      const bookedAmenities = db.booking_amenities
        .filter(ba => ba.booking_id === b.id)
        .map(ba => {
          const am = db.amenities.find(a => a.id === ba.amenity_id);
          return { ...am, unit_price: ba.unit_price, quantity: ba.quantity };
        });
      return {
        ...b,
        venue_name: venue?.name,
        venue_type: venue?.type,
        venue_image: venue?.image_url,
        user_name: user?.name,
        user_email: user?.email,
        user_company: user?.company,
        amenities: bookedAmenities
      };
    });

    if (filters.venue_id) {
      results = results.filter(b => b.venue_id === Number(filters.venue_id));
    }
    if (filters.user_id) {
      results = results.filter(b => b.user_id === Number(filters.user_id));
    }
    if (filters.status) {
      results = results.filter(b => b.status === filters.status);
    }
    if (filters.active_only) {
      results = results.filter(b => b.status === 'CONFIRMED' || b.status === 'HELD');
    }

    // Sort by start_time ascending
    return results.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  },

  getBookingById(id) {
    autoExpireHolds();
    const b = db.bookings.find(item => item.id === Number(id));
    if (!b) return null;
    const venue = db.venues.find(v => v.id === b.venue_id);
    const user = db.users.find(u => u.id === b.user_id);
    const bookedAmenities = db.booking_amenities
      .filter(ba => ba.booking_id === b.id)
      .map(ba => {
        const am = db.amenities.find(a => a.id === ba.amenity_id);
        return { ...am, unit_price: ba.unit_price, quantity: ba.quantity };
      });
    return {
      ...b,
      venue_name: venue?.name,
      venue_type: venue?.type,
      venue_image: venue?.image_url,
      user_name: user?.name,
      user_email: user?.email,
      user_company: user?.company,
      amenities: bookedAmenities
    };
  },

  checkOverlaps(venue_id, start_time, end_time, excludeBookingId = null) {
    autoExpireHolds();
    const start = new Date(start_time).getTime();
    const end = new Date(end_time).getTime();

    const activeBookings = db.bookings.filter(b => {
      if (b.venue_id !== Number(venue_id)) return false;
      if (b.id === Number(excludeBookingId)) return false;
      if (b.status !== 'CONFIRMED' && b.status !== 'HELD') return false;

      const bStart = new Date(b.start_time).getTime();
      const bEnd = new Date(b.end_time).getTime();

      // Check if time intervals intersect: max(start1, start2) < min(end1, end2)
      return Math.max(start, bStart) < Math.min(end, bEnd);
    });

    return activeBookings;
  },

  createBooking(data) {
    autoExpireHolds();
    const nextId = db.bookings.length ? Math.max(...db.bookings.map(b => b.id)) + 1 : 1;
    
    // Default 24 or 48 hour hold expiration for tentative holds
    let holdExpires = null;
    if (data.is_tentative_hold) {
      const holdHours = data.hold_hours || 48;
      const expDate = new Date();
      expDate.setHours(expDate.getHours() + holdHours);
      holdExpires = expDate.toISOString();
    }

    const newBooking = {
      id: nextId,
      user_id: Number(data.user_id),
      venue_id: Number(data.venue_id),
      event_name: data.event_name,
      event_type: data.event_type || 'Private Event',
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
      status: data.is_tentative_hold ? 'HELD' : 'CONFIRMED',
      is_tentative_hold: Boolean(data.is_tentative_hold),
      hold_expires_at: holdExpires,
      guest_count: Number(data.guest_count) || 50,
      duration_hours: Number(data.duration_hours) || 4,
      base_price: Number(data.base_price) || 0,
      amenities_price: Number(data.amenities_price) || 0,
      total_price: Number(data.total_price) || 0,
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.bookings.push(newBooking);

    // Save attached amenities
    if (Array.isArray(data.amenity_ids)) {
      data.amenity_ids.forEach(amId => {
        const nextAmenityId = db.booking_amenities.length ? Math.max(...db.booking_amenities.map(ba => ba.id)) + 1 : 1;
        const amenity = db.amenities.find(a => a.id === Number(amId));
        const price = amenity ? amenity.flat_fee + (amenity.hourly_fee * newBooking.duration_hours) : 0;
        db.booking_amenities.push({
          id: nextAmenityId,
          booking_id: nextId,
          amenity_id: Number(amId),
          quantity: 1,
          unit_price: price
        });
      });
    }

    saveDB();
    return this.getBookingById(nextId);
  },

  updateBookingStatus(id, newStatus) {
    const booking = db.bookings.find(b => b.id === Number(id));
    if (!booking) return null;
    booking.status = newStatus;
    if (newStatus === 'CONFIRMED') {
      booking.is_tentative_hold = false;
      booking.hold_expires_at = null;
    }
    booking.updated_at = new Date().toISOString();
    saveDB();
    return this.getBookingById(id);
  },

  extendHold(id, additionalHours = 24) {
    const booking = db.bookings.find(b => b.id === Number(id));
    if (!booking || booking.status !== 'HELD') return null;

    const currentExp = booking.hold_expires_at ? new Date(booking.hold_expires_at) : new Date();
    currentExp.setHours(currentExp.getHours() + additionalHours);
    booking.hold_expires_at = currentExp.toISOString();
    booking.updated_at = new Date().toISOString();
    saveDB();
    return this.getBookingById(id);
  },

  // Analytics Aggregations
  getAnalytics() {
    autoExpireHolds();
    const totalVenues = db.venues.length;
    const totalBookings = db.bookings.length;
    const confirmedBookings = db.bookings.filter(b => b.status === 'CONFIRMED');
    const activeHolds = db.bookings.filter(b => b.status === 'HELD');
    const expiredHolds = db.bookings.filter(b => b.status === 'EXPIRED');

    const confirmedRevenue = confirmedBookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
    const projectedHoldRevenue = activeHolds.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

    // Revenue and booking counts by venue
    const venueStats = db.venues.map(v => {
      const venueBookings = db.bookings.filter(b => b.venue_id === v.id);
      const conf = venueBookings.filter(b => b.status === 'CONFIRMED');
      const holds = venueBookings.filter(b => b.status === 'HELD');
      const rev = conf.reduce((sum, b) => sum + Number(b.total_price), 0);
      const totalHours = conf.reduce((sum, b) => sum + Number(b.duration_hours), 0);

      return {
        venue_id: v.id,
        venue_name: v.name,
        type: v.type,
        confirmed_count: conf.length,
        active_holds_count: holds.length,
        total_revenue: rev,
        total_hours: totalHours,
        // Approximate 30-day occupancy % based on 12h available booking slots/day (360h total)
        occupancy_rate: Math.min(100, Math.round((totalHours / 360) * 100))
      };
    });

    const overallOccupancy = Math.round(
      venueStats.reduce((sum, s) => sum + s.occupancy_rate, 0) / (totalVenues || 1)
    );

    const holdConversionRate = totalBookings > 0
      ? Math.round((confirmedBookings.length / (confirmedBookings.length + expiredHolds.length || 1)) * 100)
      : 0;

    return {
      totalVenues,
      totalBookings,
      confirmedBookingsCount: confirmedBookings.length,
      activeHoldsCount: activeHolds.length,
      expiredHoldsCount: expiredHolds.length,
      confirmedRevenue,
      projectedHoldRevenue,
      totalProjectedRevenue: confirmedRevenue + projectedHoldRevenue,
      overallOccupancyRate: overallOccupancy,
      holdConversionRate,
      venueStats
    };
  }
};

// Initialize database on startup
initDB();
