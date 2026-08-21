import mongoose from 'mongoose';

const callRequestSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  client_name: { type: String, required: true },
  client_phone: { type: String, required: true },
  client_email: { type: String },
  venue_name: { type: String, default: 'General Inquiry' },
  preferred_time: { type: String, default: 'ASAP (Within 15 mins)' },
  topic: { type: String, default: 'Venue Booking & 48h Hold Assistance' },
  status: {
    type: String,
    enum: ['PENDING', 'CONNECTED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  notes: { type: String }
}, {
  timestamps: true
});

export const CallRequest = mongoose.models.CallRequest || mongoose.model('CallRequest', callRequestSchema);
export default CallRequest;
