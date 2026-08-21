import React, { useState, useEffect } from 'react';
import AdminPage from './pages/AdminPage';
import BookingModal from './components/BookingModal';
import SignOutModal from './components/SignOutModal';
import { api } from './api/client';
import { useAuth } from './context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2,
  Building2,
  KeyRound
} from 'lucide-react';

export default function AdminApp() {
  const { user, login, logout, isAdmin } = useAuth();

  const [venues, setVenues] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Admin login form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalInitialData, setBookingModalInitialData] = useState(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vRes, aRes, bRes] = await Promise.all([
        api.getVenues(),
        api.getAmenities(),
        api.getBookings()
      ]);
      setVenues(vRes.data || []);
      setAmenities(aRes.data || []);
      setBookings(bRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const loggedUser = await login(adminEmail, adminPassword);
      if (loggedUser.role !== 'ADMIN') {
        logout();
        setAuthError('Access Denied. This account does not have Administrator privileges.');
        return;
      }
      showToast(`Welcome back, ${loggedUser.name}!`);
      fetchData();
    } catch (err) {
      setAuthError(err.message || 'Invalid administrator email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOpenBookingModal = (initialData = null) => {
    setBookingModalInitialData(initialData);
    setIsBookingModalOpen(true);
  };

  const handleBookingCreated = (newBooking) => {
    fetchData();
    showToast(
      newBooking.is_tentative_hold
        ? `Tentative hold registered for "${newBooking.event_name}"!`
        : `Confirmed booking override saved for "${newBooking.event_name}"!`
    );
  };

  const handleNavigateToClient = () => {
    window.location.href = '/';
  };

  // -------------------------------------------------------------
  // 1. SECURITY LOCK SCREEN: If not logged in as ADMIN, lock page
  // -------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-purple-500 selection:text-white">
        <div className="w-full max-w-md bg-slate-950/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Restricted Area · Admin Authentication Required
            </div>

            <h1 className="text-xl font-extrabold text-white">
              Grand Horizon Management
            </h1>
            <p className="text-xs text-slate-400">
              Please enter your administrator credentials to access the venue manager console.
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@venueworks.com"
                  className="w-full bg-slate-900 pl-9 pr-3 py-2.5 rounded-xl text-white border border-slate-700 font-medium placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 pl-9 pr-3 py-2.5 rounded-xl text-white border border-slate-700 font-medium placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{authLoading ? 'Verifying...' : 'Unlock Admin Portal'}</span>
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Client Website</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. UNLOCKED: Full Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center gap-2.5 text-xs text-slate-900">
            <div className="p-1 rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Dedicated Admin Page Component */}
      <AdminPage
        venues={venues}
        bookings={bookings}
        amenities={amenities}
        onRefresh={fetchData}
        onOpenBookingModal={handleOpenBookingModal}
        onNavigateToClient={handleNavigateToClient}
        onOpenLoginModal={() => setIsSignOutModalOpen(true)}
      />

      {/* Booking / Override Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialData={bookingModalInitialData}
        venues={venues}
        amenities={amenities}
        onBookingCreated={handleBookingCreated}
      />

      {/* Admin Sign Out Confirmation Card */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => {
          logout();
          showToast('Administrator signed out. Portal locked.');
        }}
      />
    </div>
  );
}
