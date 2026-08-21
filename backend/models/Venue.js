import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  sqft: { type: Number, required: true },
  hourly_rate: { type: Number, required: true },
  weekend_multiplier: { type: Number, default: 1.25 },
  min_booking_hours: { type: Number, default: 2 },
  image_url: { type: String },
  floor_plan_url: { type: String },
  description: { type: String },
  features: [{ type: String }],
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Venue = mongoose.models.Venue || mongoose.model('Venue', venueSchema);
export default Venue;
