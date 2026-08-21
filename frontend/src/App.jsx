import React, { useState, useEffect } from 'react';
import ClientPage from './pages/ClientPage';
import AdminPage from './pages/AdminPage';
import BookingModal from './components/BookingModal';
import LoginModal from './components/LoginModal';
import CallConciergeModal from './components/CallConciergeModal';
import { api } from './api/client';
import { useAuth } from './context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const { user, switchUser, demoUsers } = useAuth();

  // Page state: 'client' or 'admin', synced with window hash
  const getInitialPage = () => {
    if (typeof window !== 'undefined' && window.location.hash === '#/admin') {
      return 'admin';
    }
    return 'client';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  const [venues, setVenues] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalInitialData, setBookingModalInitialData] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callVenueName, setCallVenueName] = useState(null);
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
      console.error('Failed to load initial data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for hash changes (e.g. browser back/forward or direct link)
    const handleHashChange = () => {
      if (window.location.hash === '#/admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('client');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    // Switch to admin demo persona if needed
    if (demoUsers?.length > 0) {
      const adminUser = demoUsers.find(u => u.role === 'ADMIN') || demoUsers[0];
      switchUser(adminUser);
    }
    window.location.hash = '#/admin';
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToClient = () => {
    // Switch to customer persona
    if (demoUsers?.length > 1) {
      const customerUser = demoUsers.find(u => u.role === 'CUSTOMER') || demoUsers[1];
      switchUser(customerUser);
    }
    window.location.hash = '#/client';
    setCurrentPage('client');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingModal = (initialData = null) => {
    setBookingModalInitialData(initialData);
    setIsBookingModalOpen(true);
  };

  const handleBookingCreated = (newBooking) => {
    fetchData();
    showToast(
      newBooking.is_tentative_hold
        ? `Tentative hold placed successfully for "${newBooking.event_name}"!`
        : `Confirmed booking created for "${newBooking.event_name}"!`
    );
  };

  const activeHoldsCount = bookings.filter(
    b => b.status === 'HELD' && (b.user_id === user?.id || b.user_email === user?.email)
  ).length;

  const pendingAdminCount = bookings.filter(b => b.status === 'HELD').length;

  return (
    <div className="relative min-h-screen">
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

      {/* Render dedicated page based on currentPage */}
      {currentPage === 'admin' ? (
        <AdminPage
          venues={venues}
          bookings={bookings}
          amenities={amenities}
          onRefresh={fetchData}
          onOpenBookingModal={handleOpenBookingModal}
          onNavigateToClient={navigateToClient}
        />
      ) : (
        <ClientPage
          venues={venues}
          amenities={amenities}
          bookings={bookings}
          activeHoldsCount={activeHoldsCount}
          pendingAdminCount={pendingAdminCount}
          onOpenBookingModal={handleOpenBookingModal}
          onRefresh={fetchData}
          onNavigateToAdmin={navigateToAdmin}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenCallModal={(vName = null) => {
            setCallVenueName(vName);
            setIsCallModalOpen(true);
          }}
        />
      )}

      {/* Shared Booking / Hold Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialData={bookingModalInitialData}
        venues={venues}
        amenities={amenities}
        onBookingCreated={handleBookingCreated}
      />

      {/* Login & Register Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* Call Concierge & Priority Hotline Modal */}
      <CallConciergeModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        venueName={callVenueName}
      />
    </div>
  );
}
