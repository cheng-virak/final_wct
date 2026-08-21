import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'CUSTOMER'], default: 'CUSTOMER' },
  phone: { type: String },
  company: { type: String },
  created_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
