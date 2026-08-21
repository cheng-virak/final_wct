import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  BedDouble,
  Moon
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function BookingModal({
  isOpen,
  onClose,
  initialData = {},
  venues = [],
  amenities = [],
  onBookingCreated
}) {
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  const getDefaultDates = () => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 3);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 2); // 2 nights

    return {
      checkInDate: checkIn.toISOString().split('T')[0],
      checkOutDate: checkOut.toISOString().split('T')[0]
    };
  };

  const defaults = getDefaultDates();

  const [formData, setFormData] = useState({
    venue_id: initialData?.venue_id || venues[0]?.id || 1,
    event_name: initialData?.event_name || 'Luxury Holiday Stay',
    event_type: initialData?.event_type || 'Vacation & Leisure',
    date: initialData?.date || defaults.checkInDate,
    start_time: initialData?.start_time || `${defaults.checkInDate}T14:00:00`,
    end_time: initialData?.end_time || `${defaults.checkOutDate}T12:00:00`,
    guest_count: initialData?.guest_count || 2,
    is_tentative_hold: initialData?.is_tentative_hold !== undefined ? initialData.is_tentative_hold : true,
    amenity_ids: initialData?.amenity_ids || [1],
    notes: initialData?.notes || ''
  });

  const [availability, setAvailability] = useState({ isAvailable: true, checking: false });
  const [quote, setQuote] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(prev => ({
        ...prev,
        venue_id: initialData.venue_id || prev.venue_id || venues[0]?.id || 1,
        date: initialData.date || prev.date,
        start_time: initialData.start_time || prev.start_time,
        end_time: initialData.end_time || prev.end_time,
        guest_count: initialData.guest_count || prev.guest_count || 2,
        is_tentative_hold: initialData.is_tentative_hold !== undefined ? initialData.is_tentative_hold : true,
        amenity_ids: initialData.amenity_ids || prev.amenity_ids || [1]
      }));
    }
  }, [initialData, isOpen, venues]);

  const activeVenue = venues.find(v => v.id === Number(formData.venue_id)) || venues[0];

  useEffect(() => {
    if (!isOpen || !formData.start_time || !formData.end_time || !activeVenue) return;

    setAvailability({ isAvailable: true, checking: true });

    api.checkAvailability(activeVenue.id, formData.start_time, formData.end_time)
      .then(res => setAvailability({ isAvailable: res.isAvailable, checking: false }))
      .catch(() => setAvailability({ isAvailable: true, checking: false }));

    api.getQuote({
      venue_id: activeVenue.id,
      start_time: formData.start_time,
      end_time: formData.end_time,
      amenity_ids: formData.amenity_ids,
      guest_count: formData.guest_count
    })
      .then(res => setQuote(res))
      .catch(err => console.error('Quote error', err));
  }, [formData.venue_id, formData.start_time, formData.end_time, formData.amenity_ids, formData.guest_count, isOpen, activeVenue]);

  const toggleAmenity = (id) => {
    setFormData(prev => ({
      ...prev,
      amenity_ids: prev.amenity_ids.includes(id)
        ? prev.amenity_ids.filter(item => item !== id)
        : [...prev.amenity_ids, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.event_name.trim()) {
      setErrorMsg(lang === 'km' ? 'សូមបញ្ចូលឈ្មោះការស្នាក់នៅ' : 'Please provide a stay or trip name.');
      return;
    }
    if (!availability.isAvailable) {
      setErrorMsg(lang === 'km' ? 'បន្ទប់នេះត្រូវបានកក់រួចហើយក្នុងកាលបរិច្ឆេទនេះ' : 'Selected room is not available for these dates.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        venue_id: Number(formData.venue_id),
        user_id: user?.id || 2,
        user_name: user?.name || 'Hotel Guest',
        user_email: user?.email || 'guest@grandhorizon.com',
        user_company: user?.company || 'Personal Guest',
        event_name: formData.event_name,
        event_type: formData.event_type,
        start_time: formData.start_time,
        end_time: formData.end_time,
        guest_count: Number(formData.guest_count),
        is_tentative_hold: formData.is_tentative_hold,
        hold_hours: 48,
        amenity_ids: formData.amenity_ids,
        notes: formData.notes
      };

      await api.createBooking(payload);
      if (onBookingCreated) onBookingCreated();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create room reservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                {formData.is_tentative_hold ? (lang === 'km' ? 'ចាក់សោបន្ទប់ ៤៨ម៉ោងឥតគិតថ្លៃ' : '48-Hour Free Room Hold') : (lang === 'km' ? 'កក់បន្ទប់សណ្ឋាគារ' : 'Book Hotel Room')}
              </h2>
              <p className="text-xs text-slate-500">
                {activeVenue?.name} · ${activeVenue?.hourly_rate}/night
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Stay Title & Trip Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'km' ? 'ឈ្មោះដំណើរស្នាក់នៅ' : 'Stay / Trip Name'}
              </label>
              <input
                type="text"
                required
                value={formData.event_name}
                onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                placeholder="e.g. Honeymoon Vacation, Family Retreat"
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'km' ? 'ប្រភេទដំណើរកម្សាន្ត' : 'Trip Type'}
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:bg-white cursor-pointer"
              >
                <option value="Vacation & Leisure">Vacation & Leisure</option>
                <option value="Honeymoon & Anniversary">Honeymoon & Anniversary</option>
                <option value="Family Holiday">Family Holiday</option>
                <option value="Executive Business Trip">Executive Business Trip</option>
                <option value="Wellness & Spa Retreat">Wellness & Spa Retreat</option>
              </select>
            </div>
          </div>

          {/* 2. Room & Guest Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'km' ? 'ជ្រើសរើសបន្ទប់ / វីឡា' : 'Select Room / Suite'}
              </label>
              <select
                value={formData.venue_id}
                onChange={(e) => setFormData({ ...formData, venue_id: Number(e.target.value) })}
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:bg-white cursor-pointer"
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} • ${v.hourly_rate}/night
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'km' ? 'ចំនួនភ្ញៀវស្នាក់នៅ' : 'Number of Guests'}
              </label>
              <input
                type="number"
                min="1"
                max={activeVenue?.capacity || 6}
                value={formData.guest_count}
                onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:bg-white"
              />
            </div>
          </div>

          {/* 3. Check-in & Check-out Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('checkInDate')} (Check-in 2:00 PM)
              </label>
              <input
                type="date"
                value={formData.start_time.split('T')[0]}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData({
                    ...formData,
                    date: newDate,
                    start_time: `${newDate}T14:00:00`
                  });
                }}
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:bg-white cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('checkOutDate')} (Check-out 12:00 PM)
              </label>
              <input
                type="date"
                value={formData.end_time.split('T')[0]}
                min={formData.start_time.split('T')[0]}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData({
                    ...formData,
                    end_time: `${newDate}T12:00:00`
                  });
                }}
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:bg-white cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Hotel Add-on Services */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              {t('productionAmenities')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {amenities.map((am) => {
                const isSelected = formData.amenity_ids.includes(am.id);
                return (
                  <div
                    key={am.id}
                    onClick={() => toggleAmenity(am.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className="text-xs">{am.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[11px] text-slate-900">${am.flat_fee}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Special Requests / Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {lang === 'km' ? 'សំណើពិសេស (ជាន់ខ្ពស់, ទទួលព្រលាន, ស្ងប់ស្ងាត់)' : 'Special Requests & Preferences'}
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. High floor, quiet room, late check-in..."
              className="w-full bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-900 focus:bg-white"
            />
          </div>

          {/* 6. Reservation Mode Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="block font-bold text-slate-800">
              {lang === 'km' ? 'ជ្រើសរើសរបៀបកក់' : 'Reservation Type'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_tentative_hold: true })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  formData.is_tentative_hold
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t('placeHoldBtn')}</span>
                </div>
                <div className="text-[10px] opacity-90 mt-0.5">
                  {lang === 'km' ? 'រក្សាតម្លៃទុក ៤៨ម៉ោងឥតគិតថ្លៃ' : 'Lock rate for 48h with $0 deposit'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_tentative_hold: false })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  !formData.is_tentative_hold
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('confirmResBtn')}</span>
                </div>
                <div className="text-[10px] opacity-90 mt-0.5">
                  {lang === 'km' ? 'បញ្ជាក់ការស្នាក់នៅភ្លាមៗ' : 'Instant confirmed stay'}
                </div>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('totalQuote')}</span>
              <span className="text-lg font-mono font-extrabold text-blue-600">
                ${quote?.total_price || (activeVenue?.hourly_rate || 0)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                formData.is_tentative_hold ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <span>{submitting ? 'Saving...' : formData.is_tentative_hold ? t('placeHoldBtn') : t('confirmResBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
