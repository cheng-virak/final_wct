import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import venuesRoutes from './routes/venues.js';
import amenitiesRoutes from './routes/amenities.js';
import bookingsRoutes from './routes/bookings.js';
import analyticsRoutes from './routes/analytics.js';
import { autoExpireHolds } from './db/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Venue & Event Hall Reservation System API'
  });
});

// Periodic hold expiration check every 60 seconds
setInterval(() => {
  autoExpireHolds();
}, 60000);

app.listen(PORT, () => {
  console.log(`🚀 Venue Reservation Backend API running on http://localhost:${PORT}`);
});
