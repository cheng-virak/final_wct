import React from 'react';
import { X, Users, Maximize2, Sparkles, Clock, CheckCircle2, ShieldCheck, ArrowRight, Calendar, Phone, BedDouble } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VenueDetailModal({ venue, isOpen, onClose, onBookVenue, onOpenCalendar, onCallVenue }) {
  const { t, lang } = useLanguage();
  if (!isOpen || !venue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Hero Header with Image */}
        <div className="relative h-64 w-full bg-slate-100">
          <img
            src={venue.image_url}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-400/30">
              {venue.type}
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">{venue.name}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
                {lang === 'km' ? 'ចំណុះភ្ញៀវ' : 'Capacity'}
              </span>
              <span className="font-extrabold text-slate-900 text-sm flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                {venue.capacity} {t('guests')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
                {lang === 'km' ? 'ទំហំបន្ទប់' : 'Room Size'}
              </span>
              <span className="font-extrabold text-slate-900 text-sm flex items-center justify-center gap-1 mt-0.5">
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                {venue.sqft?.toLocaleString()} {t('sqft')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
                {lang === 'km' ? 'តម្លៃក្នុង១យប់' : 'Nightly Rate'}
              </span>
              <span className="font-extrabold text-blue-600 text-sm font-mono mt-0.5 block">
                ${venue.hourly_rate} {t('perNight')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'km' ? 'អំពីបន្ទប់ស្នាក់នៅ' : 'About this Room / Suite'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {venue.description}
            </p>
          </div>

          {/* Key In-Room Features */}
          {venue.features && venue.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {lang === 'km' ? 'បរិក្ខារ និងសេវាកម្មក្នុងបន្ទប់' : 'In-Suite Amenities & Comforts'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {venue.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 48h Tentative Hold Notice */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h5 className="font-bold text-amber-900">
                {t('holdNotice')}
              </h5>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                {t('holdNoticeDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onCallVenue(venue);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'km' ? 'ទូរស័ព្ទសាកសួរ' : 'Call Front Desk'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCalendar(venue.id);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'km' ? 'មើលថ្ងៃទំនេរ' : 'Check Dates'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookVenue(venue);
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t('holdRoomBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
