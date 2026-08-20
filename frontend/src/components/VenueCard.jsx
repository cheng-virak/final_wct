import React from 'react';
import { Users, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VenueCard({ venue, onViewDetails }) {
  const { t } = useLanguage();

  return (
    <div
      onClick={() => onViewDetails(venue)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={venue.image_url}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        {/* Category Pill */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/95 text-slate-800 shadow-2xs backdrop-blur-xs">
            {venue.type}
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-2.5 sm:p-3.5 flex flex-col justify-between flex-1 space-y-1.5 sm:space-y-2">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">
              {venue.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 mt-1 truncate">
            <Users className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{venue.capacity} guests • {venue.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Price & Link */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
          <div className="leading-none">
            <span className="text-xs sm:text-sm font-extrabold font-mono text-blue-600">
              ${venue.hourly_rate}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 ml-0.5">/hr</span>
          </div>

          <span className="text-[10px] sm:text-xs font-bold text-slate-500 group-hover:text-blue-600 flex items-center gap-0.5 transition-colors">
            <span className="hidden sm:inline">View</span>
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
