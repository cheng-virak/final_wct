import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true },
  user_email: { type: String },
  booking_id: { type: Number },
  event_name: { type: String },
  venue_name: { type: String },
  type: {
    type: String,
    enum: ['BOOKING_APPROVED', 'BOOKING_REJECTED', 'HOLD_EXTENDED', 'BOOKING_CREATED'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  admin_name: { type: String, default: 'Venue Management' }
}, {
  timestamps: true
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
