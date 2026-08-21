import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  X, 
  CheckCheck,
  Building2
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell({ onOpenBookingDetails = null }) {
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [latestToast, setLatestToast] = useState(null);

  const fetchNotifications = async (isInitial = false) => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const res = await api.getNotifications({ user_id: user.id, email: user.email });
      const list = res.data || [];
      const unread = list.filter(n => !n.is_read).length;

      // Check if a new notification arrived since last fetch
      if (!isInitial && list.length > 0) {
        const top = list[0];
        const isRecent = (new Date() - new Date(top.createdAt)) < 15000;
        if (!top.is_read && isRecent && (!latestToast || latestToast.id !== top.id)) {
          setLatestToast(top);
          setTimeout(() => setLatestToast(null), 6000);
        }
      }

      setNotifications(list);
      setUnreadCount(unread);
    } catch (err) {
      console.warn('Failed to fetch notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications(true);
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (notif) => {
    try {
      await api.markNotificationRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead(user?.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  const getIcon = (type) => {
    switch (type) {
      case 'BOOKING_APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'BOOKING_REJECTED':
        return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'HOLD_EXTENDED':
        return <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/80 transition-colors cursor-pointer"
        title="Admin Decisions & Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Popup Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 text-xs space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications Feed */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    !notif.is_read
                      ? 'bg-purple-50/50 border-purple-200'
                      : 'bg-slate-50/60 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{getIcon(notif.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${!notif.is_read ? 'text-slate-950' : 'text-slate-700'}`}>
                          {notif.title}
                        </span>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-purple-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(notif.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <Bell className="w-6 h-6 mx-auto opacity-30" />
                <p>No notifications yet</p>
                <p className="text-[10px]">You will be notified whenever an Admin approves or updates your holds.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Live Real-Time Toast when Admin Decides */}
      {latestToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm">
          <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-1 flex items-start gap-3">
            <div className="mt-0.5">{getIcon(latestToast.type)}</div>
            <div className="flex-1">
              <div className="font-extrabold text-xs text-white">{latestToast.title}</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{latestToast.message}</p>
            </div>
            <button
              onClick={() => setLatestToast(null)}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
