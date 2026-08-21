import React from 'react';
import { Users, BedDouble, ArrowUpRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VenueCard({ venue, onViewDetails }) {
  const { t, lang } = useLanguage();

  return (
    <div
      onClick={() => onViewDetails(venue)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={venue.image_url}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        {/* Category Pill */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 shadow-2xs backdrop-blur-xs border border-slate-100">
            {venue.type}
          </span>
        </div>

        {/* Free Hold Badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-600/90 text-white shadow-2xs backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>48h Free Hold</span>
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">
              {venue.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5 truncate">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{venue.capacity} {t('guests')}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{venue.sqft.toLocaleString()} {t('sqft')}</span>
            </div>
          </div>
        </div>

        {/* Price & Link */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="leading-none">
            <span className="text-sm sm:text-base font-extrabold font-mono text-blue-600">
              ${venue.hourly_rate}
            </span>
            <span className="text-[11px] text-slate-400 ml-1 font-semibold">{t('perNight')}</span>
          </div>

          <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600 flex items-center gap-0.5 transition-colors">
            <span>{lang === 'km' ? 'មើលបន្ទប់' : 'View Room'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
