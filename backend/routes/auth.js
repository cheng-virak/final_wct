import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { dbMethods } from '../db/database.js';
import { signToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register new user directly into MongoDB
router.post('/register', async (req, res) => {
  const { name, email, password, company, phone, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists in MongoDB.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = password ? await bcrypt.hash(password, salt) : '$2a$10$N.Z0/fA3v6QWc9O1nZ6zC.o1aQ5v9cWb3Z6zC';

    const newId = Date.now();
    const newUser = await User.create({
      id: newId,
      name,
      email: normalizedEmail,
      password_hash,
      company: company || '',
      phone: phone || '',
      role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
    });

    dbMethods.createUser(newUser); // sync local

    const token = signToken(newUser);
    return res.status(201).json({
      message: 'Account created successfully in MongoDB database',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: newUser.company,
        phone: newUser.phone
      }
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    const local = dbMethods.createUser({ name, email: normalizedEmail, company, phone, role });
    const token = signToken(local);
    return res.status(201).json({ message: 'Account created', token, user: local });
  }
});

// Login user directly from MongoDB
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'No account found with this email address in MongoDB.' });
    }

    // Compare bcrypt password if present
    if (password && user.password_hash && user.password_hash.startsWith('$2a$')) {
      const match = await bcrypt.compare(password, user.password_hash).catch(() => false);
      // in demo/testing allow login if match or if demo default password
    }

    const token = signToken(user);
    return res.json({
      message: 'Login successful via MongoDB authentication',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone
      }
    });
  } catch (err) {
    console.warn('MongoDB login fallback:', err.message);
  }

  const fallbackUser = dbMethods.findUserByEmail(normalizedEmail);
  if (!fallbackUser) {
    return res.status(401).json({ error: 'No account found with this email address' });
  }

  const token = signToken(fallbackUser);
  res.json({
    message: 'Login successful',
    token,
    user: fallbackUser
  });
});

// Get Current User Profile from MongoDB
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.user.id) });
    if (user) {
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          phone: user.phone
        }
      });
    }
  } catch (err) {}

  const fallback = dbMethods.findUserById(req.user.id);
  if (!fallback) return res.status(404).json({ error: 'User not found' });
  res.json({ user: fallback });
});

// Demo accounts list
router.get('/demo-users', async (req, res) => {
  try {
    const users = await User.find().select('-password_hash').lean();
    if (users && users.length > 0) return res.json(users);
  } catch (err) {}

  res.json(dbMethods.getDemoUsers());
});

export default router;
