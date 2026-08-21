import React, { useState, useEffect } from 'react';
import AdminPage from './pages/AdminPage';
import BookingModal from './components/BookingModal';
import { api } from './api/client';
import { useAuth } from './context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

export default function AdminApp() {
  const { switchUser, demoUsers } = useAuth();

  const [venues, setVenues] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalInitialData, setBookingModalInitialData] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
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
    // Automatically set active user as Elena Rostova (Admin) on the admin page
    if (demoUsers?.length > 0) {
      const adminUser = demoUsers.find(u => u.role === 'ADMIN') || demoUsers[0];
      switchUser(adminUser);
    }
    fetchData();
  }, [demoUsers]);

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

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl flex items-center gap-2.5 text-xs text-white">
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
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
    </div>
  );
}
