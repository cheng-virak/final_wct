import express from 'express';
import { dbMethods } from '../db/database.js';
import { signToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = dbMethods.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'No account found with this email address' });
  }

  // In demo mode, accept any password or matching demo password
  const token = signToken(user);
  res.json({
    message: 'Login successful',
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
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, company, phone, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = dbMethods.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser = dbMethods.createUser({
    name,
    email,
    password_hash: password || 'demo_hash',
    company: company || '',
    phone: phone || '',
    role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
  });

  const token = signToken(newUser);
  res.status(201).json({
    message: 'Account created successfully',
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
});

// Get Current User Profile
router.get('/me', authenticate, (req, res) => {
  const user = dbMethods.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      phone: user.phone
    }
  });
});

// Demo quick-switch users list
router.get('/demo-users', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Elena Rostova (Venue Director)',
      email: 'admin@venueworks.com',
      role: 'ADMIN',
      company: 'Grand Horizon Venues & Suites'
    },
    {
      id: 2,
      name: 'Alexander Morgan',
      email: 'alex.morgan@acmecorp.com',
      role: 'CUSTOMER',
      company: 'Acme Global Innovations'
    },
    {
      id: 3,
      name: 'Sophia Chen',
      email: 'sophia.chen@apexsummit.com',
      role: 'CUSTOMER',
      company: 'Apex AI Summit'
    }
  ]);
});

export default router;
