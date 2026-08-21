import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import VenueCard from '../components/VenueCard';
import VenueDetailModal from '../components/VenueDetailModal';
import InteractiveCalendar from '../components/InteractiveCalendar';
import PricingCalculator from '../components/PricingCalculator';
import CustomerBookings from '../components/CustomerBookings';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Search, Sparkles } from 'lucide-react';

export default function ClientPage({
  venues,
  amenities,
  bookings,
  activeHoldsCount,
  pendingAdminCount,
  onOpenBookingModal,
  onRefresh,
  onNavigateToAdmin,
  onOpenLoginModal
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('venues');
  const [selectedVenueFilter, setSelectedVenueFilter] = useState('all');
  const [venueSearch, setVenueSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [selectedDetailVenue, setSelectedDetailVenue] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const categories = [
    { label: t('allSpaces'), value: 'all' },
    { label: t('ballrooms'), value: 'Ballroom' },
    { label: t('glassPavilions'), value: 'Glass Pavilion' },
    { label: t('amphitheaters'), value: 'Amphitheater' },
    { label: t('rooftops'), value: 'Rooftop Terrace' },
    { label: t('boardrooms'), value: 'Boardroom' }
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
      guest_count: Math.round(venue.capacity * 0.6)
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
      start_time: slotData.startTime || '10:00',
      end_time: slotData.endTime || '16:00'
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-0">
      {/* Client Navbar with dedicated navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewBooking={() => onOpenBookingModal(null)}
        activeHoldsCount={activeHoldsCount}
        pendingAdminCount={pendingAdminCount}
        onNavigateToAdmin={onNavigateToAdmin}
        onOpenLoginModal={onOpenLoginModal}
      />

      {/* Main Client Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* ---------------- 1. VENUES TAB ---------------- */}
        {activeTab === 'venues' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Hero Banner */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-2 relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('heroBadge')}</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
                {t('heroTitle')}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
              <div className="relative min-w-[200px] sm:min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={venueSearch}
                  onChange={(e) => setVenueSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-white pl-9 pr-3 py-2 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Venues Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            onRefresh={onRefresh}
            onOpenNewBooking={() => onOpenBookingModal(null)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />

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
