import mongoose from 'mongoose';

const amenitySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  flat_fee: { type: Number, default: 0 },
  hourly_fee: { type: Number, default: 0 },
  icon: { type: String },
  description: { type: String }
}, {
  timestamps: true
});

export const Amenity = mongoose.models.Amenity || mongoose.model('Amenity', amenitySchema);
export default Amenity;
