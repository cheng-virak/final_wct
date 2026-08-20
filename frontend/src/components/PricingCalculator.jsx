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
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function PricingCalculator({ venues = [], amenities = [], onProceedToBooking }) {
  const { t } = useLanguage();
  const [selectedVenueId, setSelectedVenueId] = useState(venues[0]?.id || 1);
  
  const getDefaultDates = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return {
      date: d.toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '16:00'
    };
  };

  const [dateTime, setDateTime] = useState(getDefaultDates());
  const [guestCount, setGuestCount] = useState(80);
  const [selectedAmenities, setSelectedAmenities] = useState([1]);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeVenue = venues.find(v => v.id === Number(selectedVenueId)) || venues[0];

  useEffect(() => {
    if (!activeVenue || !dateTime.date || !dateTime.startTime || !dateTime.endTime) return;

    const startISO = `${dateTime.date}T${dateTime.startTime}:00`;
    const endISO = `${dateTime.date}T${dateTime.endTime}:00`;

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
  }, [selectedVenueId, dateTime, selectedAmenities, guestCount, activeVenue]);

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
          {/* 1. Venue Dropdown Selector */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Venue Space</span>
            </label>
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white transition-all cursor-pointer"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} • ${v.hourly_rate}/hr (Max {v.capacity} guests)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Date & Time */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Date & Schedule</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">Date</span>
                <input
                  type="date"
                  value={dateTime.date}
                  onChange={(e) => setDateTime({ ...dateTime, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">Start</span>
                <input
                  type="time"
                  value={dateTime.startTime}
                  onChange={(e) => setDateTime({ ...dateTime, startTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">End</span>
                <input
                  type="time"
                  value={dateTime.endTime}
                  onChange={(e) => setDateTime({ ...dateTime, endTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 3. Expected Attendees Counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Expected Guests</span>
              </label>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {guestCount} guests
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(10, guestCount - 10))}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min="10"
                max={activeVenue ? activeVenue.capacity : 500}
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <button
                type="button"
                onClick={() => setGuestCount(Math.min(activeVenue ? activeVenue.capacity : 500, guestCount + 10))}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Amenities Checklist */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Add-on Amenities</span>
            </label>
            <div className="space-y-1">
              {amenities.slice(0, 3).map((am) => {
                const isSelected = selectedAmenities.includes(am.id);
                return (
                  <div
                    key={am.id}
                    onClick={() => toggleAmenity(am.id)}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-300 text-slate-900'
                        : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-800">{am.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      +${am.flat_fee}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Receipt Card */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Estimated Quote</h3>
                <span className="text-[11px] text-slate-400">{activeVenue?.name}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                {quote ? `${quote.duration_hours}h Slot` : '...'}
              </span>
            </div>

            {quote ? (
              <div className="space-y-3 text-xs">
                {/* Cost Breakdown */}
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Base Rental ({quote.duration_hours}h)</span>
                    <span className="font-bold font-mono text-slate-900">${quote.base_price}</span>
                  </div>

                  {quote.amenities_price > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Add-on Amenities</span>
                      <span className="font-bold font-mono text-slate-900">${quote.amenities_price}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Facilities Fee (8%)</span>
                    <span className="font-bold font-mono text-slate-900">${quote.service_tax}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-sm">Total Estimate</span>
                  <span className="text-2xl font-extrabold font-mono text-blue-600">
                    ${quote.total_price.toLocaleString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() =>
                      onProceedToBooking({
                        venue_id: activeVenue.id,
                        date: dateTime.date,
                        start_time: dateTime.startTime,
                        end_time: dateTime.endTime,
                        guest_count: guestCount,
                        amenity_ids: selectedAmenities,
                        is_tentative_hold: true
                      })
                    }
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Place 48h Free Hold</span>
                  </button>

                  <button
                    onClick={() =>
                      onProceedToBooking({
                        venue_id: activeVenue.id,
                        date: dateTime.date,
                        start_time: dateTime.startTime,
                        end_time: dateTime.endTime,
                        guest_count: guestCount,
                        amenity_ids: selectedAmenities,
                        is_tentative_hold: false
                      })
                    }
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Instant Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">
                Computing quote...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
