import express from 'express';
import { Notification } from '../models/Notification.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get notifications for logged-in user or by user_id
router.get('/', optionalAuth, async (req, res) => {
  const userId = req.user?.id ? Number(req.user.id) : (req.query.user_id ? Number(req.query.user_id) : null);
  const userEmail = req.user?.email || req.query.email;

  const query = {};
  if (userId) {
    query.$or = [{ user_id: userId }, { user_email: userEmail }];
  } else if (userEmail) {
    query.user_email = userEmail;
  }

  try {
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(30).lean();
    const unreadCount = notifications.filter(n => !n.is_read).length;
    return res.json({ count: notifications.length, unread_count: unreadCount, data: notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  const notifId = Number(req.params.id);
  try {
    const updated = await Notification.findOneAndUpdate(
      { id: notifId },
      { $set: { is_read: true } },
      { new: true }
    );
    res.json({ message: 'Notification marked as read', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all notifications as read for a user
router.patch('/mark-all-read', optionalAuth, async (req, res) => {
  const userId = req.user?.id ? Number(req.user.id) : Number(req.body.user_id);
  try {
    if (userId) {
      await Notification.updateMany({ user_id: userId }, { $set: { is_read: true } });
    }
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
