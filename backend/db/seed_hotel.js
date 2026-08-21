import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import { Venue } from '../models/Venue.js';
import { Amenity } from '../models/Amenity.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://virakbczin05_db_user:K1K92R41bJd0oZgV@cluster0.ty1ykgn.mongodb.net/venue_reservation?retryWrites=true&w=majority';

export const hotelRooms = [
  {
    id: 1,
    name: 'Deluxe Oceanview King Suite',
    slug: 'deluxe-oceanview-king-suite',
    type: 'Ocean Suite',
    capacity: 3,
    sqft: 750,
    hourly_rate: 280, // Nightly rate $280/night
    weekend_multiplier: 1.2,
    min_booking_hours: 1,
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    description: 'Breathtaking panoramic azure sea views, private furnished sun balcony, luxury plush King bed, marble bath with deep soaking tub, and 24-hour room concierge.',
    features: ['Private Ocean Balcony', '1 Plush King Bed', 'Marble Bath & Soaking Tub', 'Smart 65" 4K TV & Nespresso', 'High-Speed Fiber WiFi', '24h In-Room Dining'],
    is_active: true
  },
  {
    id: 2,
    name: 'Executive Presidential Penthouse',
    slug: 'executive-presidential-penthouse',
    type: 'Penthouse',
    capacity: 6,
    sqft: 1600,
    hourly_rate: 750, // Nightly rate $750/night
    weekend_multiplier: 1.25,
    min_booking_hours: 1,
    image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
    description: 'Top-tier luxury penthouse featuring a private rooftop heated jacuzzi, wraparound skyline terrace, master dining suite, dedicated butler service, and private bar.',
    features: ['Private Heated Jacuzzi', '2 King Master Suites', 'Wraparound Ocean Terrace', 'Dedicated Butler Service', 'Designer Living & Dining Room', 'Private Bar & Wine Cellar'],
    is_active: true
  },
  {
    id: 3,
    name: 'Garden Sunset Pool Villa',
    slug: 'garden-sunset-pool-villa',
    type: 'Pool Villa',
    capacity: 4,
    sqft: 1250,
    hourly_rate: 520, // Nightly rate $520/night
    weekend_multiplier: 1.15,
    min_booking_hours: 1,
    image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    description: 'Secluded tropical sanctuary with private infinity plunge pool, sun loungers, outdoor rain shower, lush private garden courtyard, and floating breakfast setup.',
    features: ['Private Infinity Plunge Pool', 'King Bed + Daybed', 'Outdoor Tropical Rain Shower', 'Private Garden Courtyard', 'Floating Breakfast Setup', 'Beachfront Direct Path'],
    is_active: true
  },
  {
    id: 4,
    name: 'Royal Horizon Skyline Suite',
    slug: 'royal-horizon-skyline-suite',
    type: 'Ocean Suite',
    capacity: 2,
    sqft: 920,
    hourly_rate: 390, // Nightly rate $390/night
    weekend_multiplier: 1.2,
    min_booking_hours: 1,
    image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    description: 'High-floor suite with floor-to-ceiling glass windows framing golden sunset ocean horizons, freestanding designer bathtub, and Executive Club Lounge privileges.',
    features: ['Floor-to-Ceiling Glass', 'King Bed with Egyptian Linens', 'Freestanding Bathtub', 'Executive Club Lounge Access', 'Complimentary Evening Cocktails', 'Espresso Bar'],
    is_active: true
  },
  {
    id: 5,
    name: 'Premier Double Queen Deluxe Room',
    slug: 'premier-double-queen-deluxe-room',
    type: 'Deluxe Room',
    capacity: 4,
    sqft: 580,
    hourly_rate: 210, // Nightly rate $210/night
    weekend_multiplier: 1.1,
    min_booking_hours: 1,
    image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    description: 'Spacious modern luxury room with two Queen beds, private balcony garden view, double vanity sinks, work desk, and plush bathrobes.',
    features: ['2 Queen Pillow-Top Beds', 'Private Balcony', 'Double Vanity Marble Sinks', 'Ergonomic Workstation', 'Luxury Bathrobes & Slippers', 'Minibar & Safe'],
    is_active: true
  },
  {
    id: 6,
    name: 'Signature Wellness Spa Suite',
    slug: 'signature-wellness-spa-suite',
    type: 'Family Suite',
    capacity: 5,
    sqft: 1100,
    hourly_rate: 440, // Nightly rate $440/night
    weekend_multiplier: 1.15,
    min_booking_hours: 1,
    image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    description: 'Revitalizing wellness suite equipped with an in-room cedar infrared sauna, hydrotherapy whirlpool tub, aromatherapy diffuser station, and yoga terrace.',
    features: ['In-Room Cedar Infrared Sauna', 'Hydrotherapy Whirlpool Tub', 'Aromatherapy Oil Bar', 'Yoga Terrace with Mats', '1 King + 1 Queen Bed', 'Organic Tea & Juice Bar'],
    is_active: true
  }
];

export const hotelAmenities = [
  {
    id: 1,
    name: 'Gourmet International Breakfast Buffet',
    category: 'Catering & Beverage',
    flat_fee: 35,
    hourly_fee: 0,
    icon: 'Utensils',
    description: 'Daily oceanfront buffet with live artisan omelet stations, fresh tropical juices, organic pastries, and barista espresso.'
  },
  {
    id: 2,
    name: 'VIP Luxury Airport Limousine Transfer',
    category: 'Staffing & Security',
    flat_fee: 85,
    hourly_fee: 0,
    icon: 'Car',
    description: 'Private chauffeur-driven Mercedes-Benz S-Class or Cadillac Escalade from/to the international airport with cold towels & sparkling water.'
  },
  {
    id: 3,
    name: 'Couples Aromatherapy Spa & Deep Massage (90 Min)',
    category: 'Audio / Visual & Tech',
    flat_fee: 160,
    hourly_fee: 0,
    icon: 'Sparkles',
    description: 'Rejuvenating full-body essential oil massage and organic hot stone therapy in our private oceanfront treatment pavilion.'
  },
  {
    id: 4,
    name: 'Romantic Candlelight Beach Dinner Experience',
    category: 'Catering & Beverage',
    flat_fee: 220,
    hourly_fee: 0,
    icon: 'Utensils',
    description: 'Private beachfront canopy table setup, 4-course gourmet seafood dinner, personal waiter, and bottle of vintage champagne under the stars.'
  },
  {
    id: 5,
    name: 'Chilled French Champagne & Exotic Fruit Platter',
    category: 'Catering & Beverage',
    flat_fee: 75,
    hourly_fee: 0,
    icon: 'Sparkles',
    description: 'Pre-arrival chilled bottle of Moët & Chandon with a handcrafted platter of seasonal tropical dragon fruit, mango, and chocolate strawberries.'
  },
  {
    id: 6,
    name: 'Rollaway Premium Bed & Luxury Pillow Menu',
    category: 'Furniture & Decor',
    flat_fee: 45,
    hourly_fee: 0,
    icon: 'Layers',
    description: 'Extra plush single bed with memory foam mattress, 600-thread-count linen, and choice of goose feather or hypoallergenic bamboo pillows.'
  }
];

export const hotelBookings = [
  {
    id: 101,
    venue_id: 1,
    venue_name: 'Deluxe Oceanview King Suite',
    venue_type: 'Ocean Suite',
    user_id: 2,
    user_name: 'Alexander Morgan',
    user_email: 'alex.morgan@acmecorp.com',
    user_company: 'Acme Global',
    event_name: 'Summer Honeymoon Stay',
    event_type: 'Holiday & Vacation',
    guest_count: 2,
    start_time: new Date(Date.now() + 2 * 86400000).toISOString(),
    end_time: new Date(Date.now() + 5 * 86400000).toISOString(),
    duration_hours: 72, // 3 nights
    base_price: 840,
    amenities_price: 195,
    service_tax: 83,
    total_price: 1118,
    status: 'CONFIRMED',
    is_tentative_hold: false,
    hold_expires_at: null,
    notes: 'High floor requested, celebrating anniversary with champagne welcome.'
  },
  {
    id: 102,
    venue_id: 3,
    venue_name: 'Garden Sunset Pool Villa',
    venue_type: 'Pool Villa',
    user_id: 3,
    user_name: 'Sophia Chen',
    user_email: 'sophia.chen@apexsummit.com',
    user_company: 'Apex Travel Club',
    event_name: 'Private Pool Villa Retreat',
    event_type: 'Vacation & Wellness',
    guest_count: 3,
    start_time: new Date(Date.now() + 4 * 86400000).toISOString(),
    end_time: new Date(Date.now() + 7 * 86400000).toISOString(),
    duration_hours: 72,
    base_price: 1560,
    amenities_price: 245,
    service_tax: 144,
    total_price: 1949,
    status: 'HELD',
    is_tentative_hold: true,
    hold_expires_at: new Date(Date.now() + 42 * 3600000).toISOString(), // 42h left
    notes: 'Floating breakfast on Day 2 morning, late check-out requested.'
  },
  {
    id: 103,
    venue_id: 2,
    venue_name: 'Executive Presidential Penthouse',
    venue_type: 'Penthouse',
    user_id: 2,
    user_name: 'Alexander Morgan',
    user_email: 'alex.morgan@acmecorp.com',
    user_company: 'Acme Global',
    event_name: 'VIP Executive Suite Stay',
    event_type: 'Executive Business & Leisure',
    guest_count: 4,
    start_time: new Date(Date.now() + 8 * 86400000).toISOString(),
    end_time: new Date(Date.now() + 11 * 86400000).toISOString(),
    duration_hours: 72,
    base_price: 2250,
    amenities_price: 380,
    service_tax: 210,
    total_price: 2840,
    status: 'CONFIRMED',
    is_tentative_hold: false,
    hold_expires_at: null,
    notes: 'Airport limousine pickup for 4 guests from Terminal 2.'
  }
];

export async function seedHotelDatabase() {
  try {
    console.log('📡 Connecting to MongoDB Atlas for Hotel Seeding...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas.');

    // 1. Seed Hotel Rooms
    await Venue.deleteMany({});
    await Venue.insertMany(hotelRooms);
    console.log(`🏨 Successfully seeded ${hotelRooms.length} luxury hotel rooms & suites into MongoDB.`);

    // 2. Seed Hotel Amenities
    await Amenity.deleteMany({});
    await Amenity.insertMany(hotelAmenities);
    console.log(`🛎️ Successfully seeded ${hotelAmenities.length} hotel add-on services into MongoDB.`);

    // 3. Seed Hotel Bookings
    await Booking.deleteMany({});
    await Booking.insertMany(hotelBookings);
    console.log(`📋 Successfully seeded ${hotelBookings.length} hotel guest bookings into MongoDB.`);

    console.log('✨ Hotel Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding hotel database:', err.message);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedHotelDatabase();
}
