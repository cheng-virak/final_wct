import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Users, 
  Sparkles, 
  BookmarkPlus, 
  ArrowRight, 
  Plus, 
  Minus,
  CheckCircle2,
  BedDouble,
  Moon
} from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function PricingCalculator({ venues = [], amenities = [], onProceedToBooking }) {
  const { t, lang } = useLanguage();
  const [selectedVenueId, setSelectedVenueId] = useState(venues[0]?.id || 1);
  
  const getDefaultStayDates = () => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 3);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 2); // 2 nights default

    return {
      checkInDate: checkIn.toISOString().split('T')[0],
      checkOutDate: checkOut.toISOString().split('T')[0]
    };
  };

  const [stayDates, setStayDates] = useState(getDefaultStayDates());
  const [guestCount, setGuestCount] = useState(2);
  const [selectedAmenities, setSelectedAmenities] = useState([1]);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeVenue = venues.find(v => v.id === Number(selectedVenueId)) || venues[0];

  const calculateNights = () => {
    const d1 = new Date(stayDates.checkInDate);
    const d2 = new Date(stayDates.checkOutDate);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    return Math.max(1, isNaN(diff) ? 1 : diff);
  };

  const nights = calculateNights();

  useEffect(() => {
    if (!activeVenue || !stayDates.checkInDate || !stayDates.checkOutDate) return;

    const startISO = `${stayDates.checkInDate}T14:00:00`;
    const endISO = `${stayDates.checkOutDate}T12:00:00`;

    setLoading(true);
    api.getQuote({
      venue_id: activeVenue.id,
      start_time: startISO,
      end_time: endISO,
      amenity_ids: selectedAmenities,
      guest_count: guestCount
    })
      .then(res => setQuote(res))
      .catch(err => console.error('Quote calculation error', err))
      .finally(() => setLoading(false));
  }, [selectedVenueId, stayDates, selectedAmenities, guestCount, activeVenue]);

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('calcTitle')}
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {t('calcDesc')}
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
          {/* 1. Room / Suite Selector */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <BedDouble className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('chooseVenue')}</span>
            </label>
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white transition-all cursor-pointer"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} • ${v.hourly_rate}/night ({v.type})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Check-in & Check-out Dates */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('dateTimeSchedule')}</span>
              </label>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[11px] flex items-center gap-1">
                <Moon className="w-3 h-3" />
                <span>{nights} {lang === 'km' ? 'យប់' : 'Nights'}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  {t('checkInDate')}
                </label>
                <input
                  type="date"
                  value={stayDates.checkInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStayDates({ ...stayDates, checkInDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white transition-all cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  {t('checkOutDate')}
                </label>
                <input
                  type="date"
                  value={stayDates.checkOutDate}
                  min={stayDates.checkInDate}
                  onChange={(e) => setStayDates({ ...stayDates, checkOutDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 3. Number of Guests Counter */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('guestCount')}</span>
              </span>
              <span className="font-mono text-slate-900 font-extrabold text-sm">{guestCount} {t('guests')}</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min="1"
                max={activeVenue?.capacity || 6}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="flex-1 accent-blue-600 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setGuestCount(Math.min(activeVenue?.capacity || 6, guestCount + 1))}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Hotel Add-on Services & Amenities */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('productionAmenities')}</span>
            </label>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {amenities.map((am) => {
                const isSelected = selectedAmenities.includes(am.id);
                return (
                  <div
                    key={am.id}
                    onClick={() => toggleAmenity(am.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-300 text-blue-950 font-semibold shadow-2xs'
                        : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <div>
                        <span className="block text-xs font-bold">{am.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{am.category}</span>
                      </div>
                    </div>

                    <span className="font-mono text-xs font-extrabold text-slate-900">
                      ${am.flat_fee}{am.hourly_fee > 0 ? ` + $${am.hourly_fee}/night` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Invoice & Hold Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4 sticky top-20">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {t('estimatedInvoice')}
            </span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {nights} {lang === 'km' ? 'យប់' : 'Nights'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{activeVenue?.name} ({nights} nights):</span>
              <span className="font-mono font-bold text-slate-900">
                ${(activeVenue?.hourly_rate || 0) * nights}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>{lang === 'km' ? 'សេវាកម្មបន្ថែម' : 'Hotel Extra Services'}:</span>
              <span className="font-mono font-bold text-slate-900">
                ${quote?.amenities_price || 0}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>{lang === 'km' ? 'ពន្ធ & សេវាកម្ម (8%)' : 'Resort Fee & Tax (8%)'}:</span>
              <span className="font-mono font-bold text-slate-900">
                ${quote?.service_tax || 0}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm sm:text-base font-extrabold text-slate-900">
              <span>{t('totalQuote')}</span>
              <span className="font-mono text-xl text-blue-600">
                ${loading ? '...' : (quote?.total_price || (activeVenue?.hourly_rate || 0) * nights).toLocaleString()}
              </span>
            </div>
          </div>

          {/* 48h Free Hold Guarantee Banner */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-0.5 text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <BookmarkPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('holdNotice')}</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed font-normal">
              {t('holdNoticeDesc')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => onProceedToBooking({
                venue_id: activeVenue.id,
                date: stayDates.checkInDate,
                start_time: `${stayDates.checkInDate}T14:00:00`,
                end_time: `${stayDates.checkOutDate}T12:00:00`,
                guest_count: guestCount,
                amenity_ids: selectedAmenities,
                is_tentative_hold: true
              })}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{t('placeHoldBtn')}</span>
            </button>

            <button
              onClick={() => onProceedToBooking({
                venue_id: activeVenue.id,
                date: stayDates.checkInDate,
                start_time: `${stayDates.checkInDate}T14:00:00`,
                end_time: `${stayDates.checkOutDate}T12:00:00`,
                guest_count: guestCount,
                amenity_ids: selectedAmenities,
                is_tentative_hold: false
              })}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t('confirmResBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
