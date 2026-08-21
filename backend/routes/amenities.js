import express from 'express';
import { Amenity } from '../models/Amenity.js';
import { dbMethods } from '../db/database.js';

const router = express.Router();

// 1. List all amenities / booking items from MongoDB
router.get('/', async (req, res) => {
  try {
    const amenities = await Amenity.find().sort({ id: 1 }).lean();
    if (amenities && amenities.length > 0) {
      return res.json({ count: amenities.length, data: amenities });
    }
  } catch (err) {
    console.warn('Fallback to local amenities cache:', err.message);
  }

  const fallback = dbMethods.getAmenities();
  res.json({ count: fallback.length, data: fallback });
});

// 2. Create new booking item / amenity in MongoDB
router.post('/', async (req, res) => {
  const { name, category, flat_fee, hourly_fee, icon, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Item/Amenity name is required.' });
  }

  const newId = Date.now();

  try {
    const newDoc = await Amenity.create({
      id: newId,
      name,
      category: category || 'Audio / Visual & Tech',
      flat_fee: Number(flat_fee) || 0,
      hourly_fee: Number(hourly_fee) || 0,
      icon: icon || 'Sparkles',
      description: description || ''
    });

    return res.status(201).json({
      message: `Booking item "${newDoc.name}" added successfully to MongoDB.`,
      data: newDoc
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Edit / Update booking item in MongoDB
router.patch('/:id', async (req, res) => {
  const itemId = Number(req.params.id);
  const { name, category, flat_fee, hourly_fee, icon, description } = req.body;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (category !== undefined) updateFields.category = category;
  if (flat_fee !== undefined) updateFields.flat_fee = Number(flat_fee);
  if (hourly_fee !== undefined) updateFields.hourly_fee = Number(hourly_fee);
  if (icon !== undefined) updateFields.icon = icon;
  if (description !== undefined) updateFields.description = description;

  try {
    const updated = await Amenity.findOneAndUpdate(
      { id: itemId },
      { $set: updateFields },
      { new: true }
    ).lean();

    if (updated) {
      return res.json({ message: 'Booking item updated in MongoDB', data: updated });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  res.status(404).json({ error: 'Item/Amenity not found' });
});

// 4. Delete booking item from MongoDB
router.delete('/:id', async (req, res) => {
  const itemId = Number(req.params.id);

  try {
    const deleted = await Amenity.findOneAndDelete({ id: itemId });
    if (deleted) {
      return res.json({ message: `Item #${itemId} deleted from MongoDB.`, data: deleted });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  res.status(404).json({ error: 'Item/Amenity not found.' });
});

export default router;
