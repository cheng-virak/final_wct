import React, { useState } from 'react';
import { 
  PlusCircle
} from 'lucide-react';
import HoldCountdown from './HoldCountdown';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function CustomerBookings({ bookings = [], onRefresh, onOpenNewBooking }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [filterTab, setFilterTab] = useState('holds');
  const [actionLoading, setActionLoading] = useState(null);

  const userBookings = bookings.filter(b => b.user_id === user?.id || b.user_email === user?.email);

  const activeHolds = userBookings.filter(b => b.status === 'HELD');
  const confirmedBookings = userBookings.filter(b => b.status === 'CONFIRMED');

  const displayedBookings = filterTab === 'holds'
    ? activeHolds
    : filterTab === 'confirmed'
    ? confirmedBookings
    : userBookings;

  const handleExtendHold = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.extendHold(bookingId, 24);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to extend hold');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmHold = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, 'CONFIRMED');
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to confirm booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelHold = async (bookingId) => {
    if (!window.confirm('Are you sure you want to release this tentative hold?')) return;
    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, 'CANCELLED');
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to cancel hold');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this reservation record?')) return;
    setActionLoading(bookingId);
    try {
      await api.deleteBooking(bookingId);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete booking');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Compact Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">
            {t('myReservationsTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            Account: {user?.name}
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Hold</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterTab('holds')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterTab === 'holds'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('activeHoldsTab')} ({activeHolds.length})
        </button>

        <button
          onClick={() => setFilterTab('confirmed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterTab === 'confirmed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('confirmedBookingsTab')} ({confirmedBookings.length})
        </button>

        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('allRecordsTab')} ({userBookings.length})
        </button>
      </div>

      {/* Bookings & Holds List */}
      <div className="space-y-3">
        {displayedBookings.length > 0 ? (
          displayedBookings.map((b) => {
            const startFormatted = new Date(b.start_time).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl p-3.5 sm:p-4 border transition-all ${
                  b.status === 'HELD'
                    ? 'border-amber-300 shadow-2xs'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">{b.event_name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-50 text-blue-700">
                        {b.venue_type}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">{b.venue_name}</span> • {startFormatted} ({b.duration_hours}h) • {b.guest_count} guests
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                    <HoldCountdown expiresAt={b.hold_expires_at} status={b.status} compact={true} />
                    <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900">
                      ${Number(b.total_price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Admin Status Note */}
                <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {b.status === 'CONFIRMED' && (
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        ✓ Approved by Venue Management · Official Reservation
                      </span>
                    )}
                    {b.status === 'HELD' && (
                      <span className="text-amber-800 font-bold flex items-center gap-1">
                        ⏳ 48-Hour Provisional Hold · Rate Locked & Pending Payment/Review
                      </span>
                    )}
                    {b.status === 'CANCELLED' && (
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        ✕ Released & Slot Cancelled by Management
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">ID: #{b.id}</span>
                </div>

                {/* Actions for active hold */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDeleteBooking(b.id)}
                    disabled={actionLoading === b.id}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                    title="Permanently delete booking"
                  >
                    Delete
                  </button>

                  <div className="flex items-center gap-2">
                    {b.status === 'HELD' && (
                      <>
                        <button
                          onClick={() => handleExtendHold(b.id)}
                          disabled={actionLoading === b.id}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                        >
                          +24h
                        </button>

                        <button
                          onClick={() => handleCancelHold(b.id)}
                          disabled={actionLoading === b.id}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          Release
                        </button>

                        <button
                          onClick={() => handleConfirmHold(b.id)}
                          disabled={actionLoading === b.id}
                          className="px-3.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
                        >
                          Confirm
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center space-y-2 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">{t('noReservations')}</h3>
            <p className="text-xs text-slate-500">
              Explore luxury spaces and place a 48h hold without paying today.
            </p>
            <button
              onClick={onOpenNewBooking}
              className="inline-block px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white cursor-pointer mt-1"
            >
              Browse Venues
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
