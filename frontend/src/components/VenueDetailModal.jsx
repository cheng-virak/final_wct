import React from 'react';
import { X, Users, Maximize2, Sparkles, Clock, CheckCircle2, ShieldCheck, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VenueDetailModal({ venue, isOpen, onClose, onBookVenue, onOpenCalendar }) {
  const { t } = useLanguage();
  if (!isOpen || !venue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Hero Header with Image */}
        <div className="relative h-60 w-full bg-slate-100">
          <img
            src={venue.image_url}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
                {venue.type}
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-2 leading-tight drop-shadow-sm">
                {venue.name}
              </h2>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm text-right">
              <span className="text-lg font-extrabold font-mono text-blue-600 block leading-none">
                ${venue.hourly_rate}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">{t('perHour')}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-800">
          {/* Key Specs Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-slate-500 text-xs block font-medium">Capacity</span>
              <span className="font-extrabold text-slate-900 text-base">{venue.capacity} Guests</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-slate-500 text-xs block font-medium">Floor Area</span>
              <span className="font-extrabold text-slate-900 text-base">{venue.sqft.toLocaleString()} sq ft</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-slate-500 text-xs block font-medium">Min Duration</span>
              <span className="font-extrabold text-slate-900 text-base">3 Hours</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About the Space</h4>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{venue.description}</p>
          </div>

          {/* Features */}
          {venue.features && venue.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Amenities & Equipment</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {venue.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 48h Free Hold Guarantee Card */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h5 className="font-bold text-amber-900">48-Hour Free Tentative Hold Available</h5>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                You can reserve this hall and lock in this rate for 48 hours without paying anything today.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenCalendar(venue.id);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Check Calendar Slots</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onBookVenue(venue);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <span>Hold or Book Space</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
