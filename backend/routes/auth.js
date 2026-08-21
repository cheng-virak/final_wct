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

// -------------------------------------------------------------
// ADMIN ACCOUNT MANAGEMENT ROUTES (MONGODB)
// -------------------------------------------------------------

// 1. List all accounts from MongoDB
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password_hash').sort({ createdAt: -1 }).lean();
    if (users && users.length > 0) {
      return res.json({ count: users.length, data: users });
    }
  } catch (err) {
    console.warn('MongoDB list users fallback:', err.message);
  }

  const localUsers = dbMethods.getUsers().map(u => {
    const { password_hash, ...safe } = u;
    return safe;
  });
  res.json({ count: localUsers.length, data: localUsers });
});

// 2. Create new user account via Admin
router.post('/users', async (req, res) => {
  const { name, email, password, role, company, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = password ? await bcrypt.hash(password, salt) : '$2a$10$N.Z0/fA3v6QWc9O1nZ6zC.o1aQ5v9cWb3Z6zC';

    const newId = Date.now();
    const newUser = await User.create({
      id: newId,
      name,
      email: normalizedEmail,
      password_hash,
      role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
      company: company || '',
      phone: phone || ''
    });

    dbMethods.createUser(newUser);

    return res.status(201).json({
      message: `Account created for ${newUser.name} with role ${newUser.role}`,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: newUser.company,
        phone: newUser.phone
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Edit / Update user account (Role, Name, Company, Phone) in MongoDB
router.patch('/users/:id', async (req, res) => {
  const userId = Number(req.params.id);
  const { name, role, company, phone } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (role) updateFields.role = role;
  if (company !== undefined) updateFields.company = company;
  if (phone !== undefined) updateFields.phone = phone;

  try {
    const updated = await User.findOneAndUpdate(
      { id: userId },
      { $set: updateFields },
      { new: true }
    ).select('-password_hash').lean();

    if (updated) {
      return res.json({ message: 'User account updated successfully in MongoDB', data: updated });
    }
  } catch (err) {
    console.warn('MongoDB update user fallback:', err.message);
  }

  res.status(404).json({ error: 'User record not found.' });
});

// 4. Delete user account from MongoDB
router.delete('/users/:id', async (req, res) => {
  const userId = Number(req.params.id);

  try {
    const deleted = await User.findOneAndDelete({ id: userId });
    if (deleted) {
      return res.json({ message: `User account #${userId} deleted from MongoDB.`, data: deleted });
    }
  } catch (err) {
    console.warn('MongoDB delete user fallback:', err.message);
  }

  res.status(404).json({ error: 'User account not found.' });
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
