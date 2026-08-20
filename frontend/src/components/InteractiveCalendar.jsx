import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function InteractiveCalendar({
  venues = [],
  bookings = [],
  onSelectSlot,
  selectedVenueFilter = 'all',
  onVenueFilterChange
}) {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const filteredBookings = bookings.filter((b) => {
    if (selectedVenueFilter === 'all') return true;
    return b.venue_id === Number(selectedVenueFilter);
  });

  const getDaysInMonth = (y, m) => {
    const firstDayIndex = new Date(y, m, 1).getDay();
    const totalDays = new Date(y, m + 1, 0).getDate();
    return { firstDayIndex, totalDays };
  };

  const { firstDayIndex, totalDays } = getDaysInMonth(year, month);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getBookingsForDate = (dateStr) => {
    return filteredBookings.filter((b) => {
      const bDate = b.start_time.split('T')[0];
      return bDate === dateStr && b.status !== 'CANCELLED' && b.status !== 'EXPIRED';
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
      {/* Compact Header & Controls */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Left: Venue Filter */}
        <select
          value={selectedVenueFilter}
          onChange={(e) => onVenueFilterChange(e.target.value)}
          className="bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:bg-white cursor-pointer"
        >
          <option value="all">{t('allVenues')}</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>

        {/* Center: Month Navigation */}
        <div className="flex items-center justify-between sm:justify-center gap-1.5">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-extrabold text-xs sm:text-sm text-slate-900 px-2 font-mono">
            {monthNames[month]} {year}
          </span>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="ml-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
          >
            {t('today')}
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 text-[11px] font-bold">
          <span className="flex items-center gap-1 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> Booked
          </span>
          <span className="flex items-center gap-1 text-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 48h Hold
          </span>
        </div>
      </div>

      {/* Compact Calendar Grid */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold text-center py-2 border-b border-slate-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days Grid (Compact on mobile!) */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 bg-white">
          {/* Empty Cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[50px] sm:min-h-[85px] bg-slate-50/50 p-1 sm:p-2" />
          ))}

          {/* Month Days */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayBookings = getBookingsForDate(dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() =>
                  onSelectSlot({
                    venue_id: selectedVenueFilter !== 'all' ? Number(selectedVenueFilter) : (venues[0]?.id || 1),
                    date: dateStr
                  })
                }
                className={`min-h-[50px] sm:min-h-[85px] p-1 sm:p-2 transition-all flex flex-col justify-between group hover:bg-blue-50/40 cursor-pointer ${
                  isToday ? 'bg-blue-50/30 ring-1 ring-inset ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] sm:text-xs font-bold font-mono px-1 sm:px-1.5 py-0.2 rounded ${
                    isToday ? 'bg-blue-600 text-white' : 'text-slate-900'
                  }`}>
                    {dayNum}
                  </span>

                  <span className="hidden sm:inline-block opacity-0 group-hover:opacity-100 text-[10px] font-bold text-blue-600 transition-opacity">
                    + Book
                  </span>
                </div>

                {/* Day's Event Badges (Dots on mobile, chips on desktop) */}
                <div className="space-y-1 mt-0.5 flex-1">
                  {/* Mobile: Compact Dots */}
                  <div className="flex sm:hidden items-center justify-center gap-1 pt-1">
                    {dayBookings.map((b) => (
                      <span
                        key={b.id}
                        className={`w-2 h-2 rounded-full ${
                          b.status === 'HELD' ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Desktop: Text Chips */}
                  <div className="hidden sm:block space-y-1">
                    {dayBookings.map((b) => {
                      const isHold = b.status === 'HELD';
                      return (
                        <div
                          key={b.id}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold truncate flex items-center justify-between ${
                            isHold
                              ? 'bg-amber-100 text-amber-950 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          }`}
                          title={`${b.event_name} (${b.venue_name})`}
                        >
                          <span className="truncate">{b.event_name}</span>
                          <span className="text-[8px] shrink-0 ml-1">
                            {isHold ? 'Hold' : 'Booked'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
