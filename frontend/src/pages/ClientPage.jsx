import React, { useState } from 'react';
import { 
  Building2, 
  CalendarDays, 
  Calculator, 
  BookmarkCheck, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowRight,
  ChevronRight,
  Phone,
  BedDouble,
  Moon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import VenueCard from '../components/VenueCard';
import VenueDetailModal from '../components/VenueDetailModal';
import PricingCalculator from '../components/PricingCalculator';
import InteractiveCalendar from '../components/InteractiveCalendar';
import CustomerBookings from '../components/CustomerBookings';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function ClientPage({
  venues = [],
  amenities = [],
  bookings = [],
  onRefresh,
  onOpenBookingModal,
  onNavigateToAdmin,
  onOpenLoginModal,
  onOpenCallModal
}) {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('venues');
  const [venueSearch, setVenueSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedVenueFilter, setSelectedVenueFilter] = useState('all');

  // Venue Detail Modal State
  const [selectedDetailVenue, setSelectedDetailVenue] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const categories = [
    { label: t('allRooms'), value: 'all' },
    { label: t('oceanSuites'), value: 'Ocean Suite' },
    { label: t('penthouses'), value: 'Penthouse' },
    { label: t('poolVillas'), value: 'Pool Villa' },
    { label: t('deluxeRooms'), value: 'Deluxe Room' },
    { label: t('familySuites'), value: 'Family Suite' }
  ];

  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
      v.description.toLowerCase().includes(venueSearch.toLowerCase());
    const matchesType = typeFilter === 'all' || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleOpenBookingForVenue = (venue) => {
    onOpenBookingModal({
      venue_id: venue.id,
      guest_count: 2
    });
  };

  const handleOpenCalendarForVenue = (venueId) => {
    setSelectedVenueFilter(venueId);
    setActiveTab('calendar');
  };

  const handleSelectCalendarSlot = (slotData) => {
    onOpenBookingModal({
      venue_id: slotData.venue_id,
      date: slotData.date,
      start_time: slotData.startTime || '14:00',
      end_time: slotData.endTime || '12:00'
    });
  };

  const handleProceedFromCalculator = (calcData) => {
    onOpenBookingModal({
      venue_id: calcData.venue_id,
      date: calcData.date,
      start_time: calcData.start_time,
      end_time: calcData.end_time,
      guest_count: calcData.guest_count,
      amenity_ids: calcData.amenity_ids,
      is_tentative_hold: calcData.is_tentative_hold
    });
  };

  const activeHoldsCount = bookings.filter(b => b.status === 'HELD').length;
  const pendingAdminCount = bookings.filter(b => b.status === 'HELD').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-0">
      {/* Clean Luxury Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewBooking={() => onOpenBookingModal(null)}
        activeHoldsCount={activeHoldsCount}
        pendingAdminCount={pendingAdminCount}
        onNavigateToAdmin={onNavigateToAdmin}
        onOpenLoginModal={onOpenLoginModal}
        onOpenCallModal={() => onOpenCallModal && onOpenCallModal()}
      />

      {/* Main Client Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* ---------------- 1. ROOMS & SUITES TAB ---------------- */}
        {activeTab === 'venues' && (
          <div className="space-y-8">
            {/* Clean Luxury Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('heroBadge')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                {t('heroTitle')}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {t('heroDesc')}
              </p>
            </div>

            {/* Clean Category Pills & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setTypeFilter(cat.value)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      typeFilter === cat.value
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[220px] sm:min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={venueSearch}
                  onChange={(e) => setVenueSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-white pl-10 pr-4 py-2 rounded-2xl text-xs text-slate-900 border border-slate-200/80 shadow-2xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
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

        {/* ---------------- 4. MY BOOKINGS & HOLDS TAB ---------------- */}
        {activeTab === 'my-bookings' && (
          <CustomerBookings
            bookings={bookings}
            onRefresh={onRefresh}
            onOpenNewBooking={() => onOpenBookingModal(null)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />

      {/* Hotel Room Detail Modal */}
      <VenueDetailModal
        venue={selectedDetailVenue}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailVenue(null);
        }}
        onBookVenue={(v) => {
          handleOpenBookingForVenue(v);
          setIsDetailModalOpen(false);
        }}
        onOpenCalendar={(venueId) => {
          handleOpenCalendarForVenue(venueId);
          setIsDetailModalOpen(false);
        }}
        onCallVenue={() => {
          setIsDetailModalOpen(false);
          if (onOpenCallModal) onOpenCallModal();
        }}
      />
    </div>
  );
}
