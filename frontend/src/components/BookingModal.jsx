import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar
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
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    venue_id: initialData?.venue_id || venues[0]?.id || 1,
    event_name: initialData?.event_name || '',
    event_type: initialData?.event_type || 'Corporate Conference',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    start_time: initialData?.start_time || '10:00',
    end_time: initialData?.end_time || '16:00',
    guest_count: initialData?.guest_count || 50,
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
        is_tentative_hold: initialData.is_tentative_hold !== undefined ? initialData.is_tentative_hold : true,
        amenity_ids: initialData.amenity_ids || prev.amenity_ids
      }));
    }
  }, [initialData, isOpen, venues]);

  const activeVenue = venues.find(v => v.id === Number(formData.venue_id)) || venues[0];

  useEffect(() => {
    if (!isOpen || !formData.date || !formData.start_time || !formData.end_time || !activeVenue) return;

    const startISO = `${formData.date}T${formData.start_time}:00`;
    const endISO = `${formData.date}T${formData.end_time}:00`;

    setAvailability({ isAvailable: true, checking: true });

    api.checkAvailability(activeVenue.id, startISO, endISO)
      .then(res => setAvailability({ isAvailable: res.isAvailable, checking: false }))
      .catch(() => setAvailability({ isAvailable: true, checking: false }));

    api.getQuote({
      venue_id: activeVenue.id,
      start_time: startISO,
      end_time: endISO,
      amenity_ids: formData.amenity_ids,
      guest_count: formData.guest_count
    })
      .then(res => setQuote(res))
      .catch(err => console.error('Quote error', err));
  }, [formData.venue_id, formData.date, formData.start_time, formData.end_time, formData.amenity_ids, formData.guest_count, isOpen, activeVenue]);

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
      setErrorMsg('Please provide an event name.');
      return;
    }
    if (!availability.isAvailable) {
      setErrorMsg('Selected time slot is not available.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const startISO = `${formData.date}T${formData.start_time}:00`;
      const endISO = `${formData.date}T${formData.end_time}:00`;

      const payload = {
        venue_id: Number(formData.venue_id),
        user_id: user?.id || 2,
        event_name: formData.event_name,
        event_type: formData.event_type,
        start_time: startISO,
        end_time: endISO,
        is_tentative_hold: formData.is_tentative_hold,
        hold_hours: 48,
        guest_count: Number(formData.guest_count),
        amenity_ids: formData.amenity_ids,
        notes: formData.notes
      };

      const res = await api.createBooking(payload);
      onBookingCreated(res.data);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Booking submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {formData.is_tentative_hold ? 'Place 48-Hour Tentative Hold' : 'Confirm Space Booking'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeVenue?.name} • Free cancellation within 48 hours
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Hold vs Book Toggle Pill */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_tentative_hold: true })}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                formData.is_tentative_hold
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>48h Hold (Pay $0 Today)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_tentative_hold: false })}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                !formData.is_tentative_hold
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Instant Confirmation</span>
            </button>
          </div>

          {/* 2. Event Name & Space */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Event or Company Name</label>
              <input
                type="text"
                required
                value={formData.event_name}
                onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                placeholder="e.g. Acme Innovation Summit"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Venue Space</label>
                <select
                  value={formData.venue_id}
                  onChange={(e) => setFormData({ ...formData, venue_id: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white transition-all font-medium cursor-pointer"
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} (${v.hourly_rate}/h)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Guest Count</label>
                <input
                  type="number"
                  min="1"
                  max={activeVenue ? activeVenue.capacity : 600}
                  value={formData.guest_count}
                  onChange={(e) => setFormData({ ...formData, guest_count: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* 3. Schedule */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Date & Time Slot</label>
            <div className="grid grid-cols-3 gap-2.5">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900"
              />
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900"
              />
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-900"
              />
            </div>

            {/* Availability status */}
            <div className="pt-1">
              {availability.isAvailable ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Time slot is available</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Time slot is already occupied</span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Amenities */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700">Optional Add-on Amenities</label>
            <div className="space-y-1.5">
              {amenities.map((am) => {
                const isSelected = formData.amenity_ids.includes(am.id);
                return (
                  <div
                    key={am.id}
                    onClick={() => toggleAmenity(am.id)}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer accent-blue-600"
                      />
                      <span className="text-xs font-semibold text-slate-800">{am.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      +${am.flat_fee}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total Quoted</span>
            <span className="text-xl font-extrabold font-mono text-slate-900">
              ${quote ? quote.total_price.toLocaleString() : '...'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !availability.isAvailable}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all cursor-pointer ${
                formData.is_tentative_hold
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {submitting ? 'Submitting...' : formData.is_tentative_hold ? 'Place 48h Hold' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
