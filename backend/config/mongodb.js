import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Venue } from '../models/Venue.js';
import { Amenity } from '../models/Amenity.js';
import { Booking } from '../models/Booking.js';
import { dbMethods } from '../db/database.js';

import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Ensure standard DNS resolvers for MongoDB Atlas SRV lookups on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

let isConnected = false;

export async function connectMongoDB() {
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/venue_reservation';

  try {
    const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`📡 Connecting to MongoDB: ${maskedURI}...`);
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully via Mongoose');

    // Auto-seed collections if empty
    await seedMongoDBIfEmpty();

    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️ MongoDB connection: ${err.message}`);
    console.log('ℹ️ Running in resilient fallback mode (Local JSON store active). Configure MONGODB_URI in backend/.env with your MongoDB Atlas connection string to connect cloud database.');
    return false;
  }
}

export function getMongoStatus() {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null
  };
}

async function seedMongoDBIfEmpty() {
  try {
    const venueCount = await Venue.countDocuments();
    if (venueCount === 0) {
      console.log('🌱 Seeding initial venues into MongoDB...');
      const seedVenues = dbMethods.getVenues();
      for (const v of seedVenues) {
        await Venue.create(v);
      }
    }

    const amenityCount = await Amenity.countDocuments();
    if (amenityCount === 0) {
      console.log('🌱 Seeding initial amenities into MongoDB...');
      const seedAmenities = dbMethods.getAmenities();
      for (const a of seedAmenities) {
        await Amenity.create(a);
      }
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial users into MongoDB...');
      const seedUsers = dbMethods.getDemoUsers();
      for (const u of seedUsers) {
        await User.create(u);
      }
    }

    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      console.log('🌱 Seeding initial bookings into MongoDB...');
      const seedBookings = dbMethods.getBookings();
      for (const b of seedBookings) {
        await Booking.create(b);
      }
    }

    console.log('✨ MongoDB seeding check complete.');
  } catch (err) {
    console.error('Error checking/seeding MongoDB:', err.message);
  }
}

export default connectMongoDB;
