import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import venuesRoutes from './routes/venues.js';
import amenitiesRoutes from './routes/amenities.js';
import bookingsRoutes from './routes/bookings.js';
import analyticsRoutes from './routes/analytics.js';
import callsRoutes from './routes/calls.js';
import notificationsRoutes from './routes/notifications.js';
import { autoExpireHolds } from './db/database.js';
import { connectMongoDB, getMongoStatus } from './config/mongodb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectMongoDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venuesRoutes);
app.use('/api/amenities', amenitiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/calls', callsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check with MongoDB status
app.get('/api/health', (req, res) => {
  const mongoStatus = getMongoStatus();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Grand Horizon Venue Reservation API',
    database: {
      driver: 'MongoDB / Mongoose',
      connected: mongoStatus.connected,
      host: mongoStatus.host,
      dbName: mongoStatus.name
    }
  });
});

// Periodic hold expiration check
setInterval(() => {
  autoExpireHolds();
}, 60000);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Venue Reservation Backend API running on http://localhost:${PORT}`);
  });
}

export default app;
