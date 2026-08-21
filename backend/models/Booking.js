import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true },
  venue_id: { type: Number, required: true },
  event_name: { type: String, required: true },
  event_type: { type: String },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  duration_hours: { type: Number, required: true },
  guest_count: { type: Number, required: true },
  is_tentative_hold: { type: Boolean, default: false },
  hold_expires_at: { type: Date },
  status: { 
    type: String, 
    enum: ['HELD', 'CONFIRMED', 'CANCELLED', 'EXPIRED'], 
    default: 'CONFIRMED' 
  },
  base_price: { type: Number },
  amenities_price: { type: Number, default: 0 },
  total_price: { type: Number, required: true },
  notes: { type: String },
  amenity_ids: [{ type: Number }],
  user_name: { type: String },
  user_email: { type: String },
  user_company: { type: String },
  venue_name: { type: String }
}, {
  timestamps: true
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
