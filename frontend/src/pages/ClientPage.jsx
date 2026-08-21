import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import VenueCard from '../components/VenueCard';
import VenueDetailModal from '../components/VenueDetailModal';
import InteractiveCalendar from '../components/InteractiveCalendar';
import PricingCalculator from '../components/PricingCalculator';
import CustomerBookings from '../components/CustomerBookings';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Search, Sparkles, ShieldCheck, Building2, CheckCircle2, Clock } from 'lucide-react';

export default function ClientPage({
  venues,
  amenities,
  bookings,
  activeHoldsCount,
  pendingAdminCount,
  onOpenBookingModal,
  onRefresh,
  onNavigateToAdmin,
  onOpenLoginModal,
  onOpenCallModal
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('venues');
  const [selectedVenueFilter, setSelectedVenueFilter] = useState('all');
  const [venueSearch, setVenueSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

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
        onOpenCallModal={() => onOpenCallModal && onOpenCallModal()}
      />

      {/* Main Client Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* ---------------- 1. ROOMS & SUITES TAB ---------------- */}
        {activeTab === 'venues' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Luxury Hotel Hero Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 relative overflow-hidden">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-900 text-white tracking-wide uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Grand Horizon Hotel & Resort</span>
                </div>
                <span className="text-[11px] font-bold text-blue-600">
                  {t('heroBadge')}
                </span>
              </div>

              <div className="space-y-2 max-w-3xl">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
                  {t('heroTitle')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {t('heroDesc')}
                </p>
              </div>

              {/* Serious Trust & Hotel Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">{t('highlightHold')}</div>
                    <div className="text-[10px] text-slate-500">Zero upfront billing</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">Luxury Rooms & Villas</div>
                    <div className="text-[10px] text-slate-500">Ocean, Pool & Garden</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">{t('highlightCustom')}</div>
                    <div className="text-[10px] text-slate-500">5-Star Concierge</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">{t('highlightTransparent')}</div>
                    <div className="text-[10px] text-slate-500">No hidden fees</div>
                  </div>
                </div>
              </div>
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
        onCallVenue={(vName) => onOpenCallModal && onOpenCallModal(vName)}
      />
    </div>
  );
}
