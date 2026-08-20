import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VenueCard from './components/VenueCard';
import VenueDetailModal from './components/VenueDetailModal';
import InteractiveCalendar from './components/InteractiveCalendar';
import PricingCalculator from './components/PricingCalculator';
import BookingModal from './components/BookingModal';
import CustomerBookings from './components/CustomerBookings';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { api } from './api/client';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { Search, CheckCircle2 } from 'lucide-react';

export default function App() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('venues');
  const [selectedVenueFilter, setSelectedVenueFilter] = useState('all');
  const [venueSearch, setVenueSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [venues, setVenues] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalInitialData, setBookingModalInitialData] = useState(null);
  const [selectedDetailVenue, setSelectedDetailVenue] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
  }, []);

  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
      v.description.toLowerCase().includes(venueSearch.toLowerCase());
    const matchesType = typeFilter === 'all' || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const activeHoldsCount = bookings.filter(
    b => b.status === 'HELD' && (b.user_id === user?.id || b.user_email === user?.email)
  ).length;

  const pendingAdminCount = bookings.filter(b => b.status === 'HELD').length;

  const handleOpenBookingForVenue = (venue) => {
    setBookingModalInitialData({
      venue_id: venue.id,
      guest_count: Math.round(venue.capacity * 0.6)
    });
    setIsBookingModalOpen(true);
  };

  const handleOpenCalendarForVenue = (venueId) => {
    setSelectedVenueFilter(venueId);
    setActiveTab('calendar');
  };

  const handleSelectCalendarSlot = (slotData) => {
    setBookingModalInitialData({
      venue_id: slotData.venue_id,
      date: slotData.date,
      start_time: slotData.startTime || '10:00',
      end_time: slotData.endTime || '16:00'
    });
    setIsBookingModalOpen(true);
  };

  const handleProceedFromCalculator = (calcData) => {
    setBookingModalInitialData({
      venue_id: calcData.venue_id,
      date: calcData.date,
      start_time: calcData.start_time,
      end_time: calcData.end_time,
      guest_count: calcData.guest_count,
      amenity_ids: calcData.amenity_ids,
      is_tentative_hold: calcData.is_tentative_hold
    });
    setIsBookingModalOpen(true);
  };

  const handleBookingCreated = (newBooking) => {
    fetchData();
    showToast(
      newBooking.is_tentative_hold
        ? `Tentative hold placed successfully for "${newBooking.event_name}"!`
        : `Confirmed booking created for "${newBooking.event_name}"!`
    );
    if (!isAdmin) {
      setActiveTab('my-bookings');
    }
  };

  const categories = [
    { label: t('allSpaces'), value: 'all' },
    { label: t('ballrooms'), value: 'Ballroom' },
    { label: t('glassPavilions'), value: 'Glass Pavilion' },
    { label: t('amphitheaters'), value: 'Amphitheater' },
    { label: t('rooftops'), value: 'Rooftop Terrace' },
    { label: t('boardrooms'), value: 'Boardroom' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-0">
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

      {/* Main Navbar with Mobile Bottom Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewBooking={() => {
          setBookingModalInitialData(null);
          setIsBookingModalOpen(true);
        }}
        activeHoldsCount={activeHoldsCount}
        pendingAdminCount={pendingAdminCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* ---------------- 1. VENUES TAB ---------------- */}
        {activeTab === 'venues' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Compact Hero Banner */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-1">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {t('heroBadge')}
              </div>

              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
                {t('heroTitle')}
              </h1>

              <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                {t('heroDesc')}
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setTypeFilter(cat.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      typeFilter === cat.value
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={venueSearch}
                  onChange={(e) => setVenueSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-white pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium"
                />
              </div>
            </div>

            {/* Venues Grid: 2 columns on mobile, 3 columns on tablet/desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onViewDetails={(v) => {
                    setSelectedDetailVenue(v);
                    setIsDetailModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 2. CALENDAR TAB ---------------- */}
        {activeTab === 'calendar' && (
          <InteractiveCalendar
            venues={venues}
            bookings={bookings}
            onSelectSlot={handleSelectCalendarSlot}
            selectedVenueFilter={selectedVenueFilter}
            onVenueFilterChange={setSelectedVenueFilter}
          />
        )}

        {/* ---------------- 3. PRICING CALCULATOR TAB ---------------- */}
        {activeTab === 'calculator' && (
          <PricingCalculator
            venues={venues}
            amenities={amenities}
            onProceedToBooking={handleProceedFromCalculator}
          />
        )}

        {/* ---------------- 4. MY RESERVATIONS & HOLDS TAB ---------------- */}
        {activeTab === 'my-bookings' && (
          <CustomerBookings
            bookings={bookings}
            onRefresh={fetchData}
            onOpenNewBooking={() => {
              setBookingModalInitialData(null);
              setIsBookingModalOpen(true);
            }}
          />
        )}

        {/* ---------------- 5. ADMIN TAB ---------------- */}
        {activeTab === 'admin' && (
          <AdminDashboard
            venues={venues}
            bookings={bookings}
            onRefresh={fetchData}
            onOpenNewBooking={() => {
              setBookingModalInitialData(null);
              setIsBookingModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Clean Footer */}
      <Footer onSelectTab={setActiveTab} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialData={bookingModalInitialData}
        venues={venues}
        amenities={amenities}
        onBookingCreated={handleBookingCreated}
      />

      {/* Venue Detail Modal */}
      <VenueDetailModal
        venue={selectedDetailVenue}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookVenue={(v) => handleOpenBookingForVenue(v)}
        onOpenCalendar={(vId) => handleOpenCalendarForVenue(vId)}
      />
    </div>
  );
}
