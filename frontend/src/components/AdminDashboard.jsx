import React, { useState } from 'react';
import { 
  RefreshCw, 
  Plus
} from 'lucide-react';
import HoldCountdown from './HoldCountdown';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function AdminDashboard({ venues = [], bookings = [], onRefresh, onOpenNewBooking }) {
  const { t } = useLanguage();
  const [actionLoading, setActionLoading] = useState(null);

  const holds = bookings.filter(b => b.status === 'HELD');
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
  const totalRevenue = confirmed.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

  const handleUpdateStatus = async (bookingId, status) => {
    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, status);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update reservation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExtend = async (bookingId) => {
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

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">
            {t('adminPortalTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            Manage holds & approvals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenNewBooking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Override Booking</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards (Grid of 3 on mobile too!) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs text-center sm:text-left">
          <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">
            Pending Holds
          </div>
          <div className="text-lg sm:text-2xl font-extrabold font-mono text-amber-600 mt-0.5">
            {holds.length}
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs text-center sm:text-left">
          <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">
            Revenue
          </div>
          <div className="text-lg sm:text-2xl font-extrabold font-mono text-emerald-600 mt-0.5">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs text-center sm:text-left">
          <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">
            Spaces
          </div>
          <div className="text-lg sm:text-2xl font-extrabold font-mono text-slate-900 mt-0.5">
            {venues.length}
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">Reservations Queue</span>
          <span className="text-slate-400 font-mono">{bookings.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono border-b border-slate-200 text-[10px] font-bold">
              <tr>
                <th className="p-2.5 pl-3">Event</th>
                <th className="p-2.5">Space</th>
                <th className="p-2.5">Client</th>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Quote</th>
                <th className="p-2.5 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2.5 pl-3 font-bold text-slate-900 truncate max-w-[120px]">
                    {b.event_name}
                  </td>
                  <td className="p-2.5 text-blue-700 font-semibold truncate max-w-[120px]">
                    {b.venue_name}
                  </td>
                  <td className="p-2.5 text-[11px] truncate max-w-[100px]">
                    {b.user_name}
                  </td>
                  <td className="p-2.5 font-mono text-[10px] text-slate-500">
                    {new Date(b.start_time).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                  </td>
                  <td className="p-2.5">
                    <HoldCountdown expiresAt={b.hold_expires_at} status={b.status} compact={true} />
                  </td>
                  <td className="p-2.5 font-mono font-bold text-slate-900">
                    ${b.total_price.toLocaleString()}
                  </td>
                  <td className="p-2.5 pr-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {b.status === 'HELD' && (
                        <>
                          <button
                            onClick={() => handleExtend(b.id)}
                            disabled={actionLoading === b.id}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                          >
                            +24h
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                            disabled={actionLoading === b.id}
                            className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white cursor-pointer shadow-2xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            disabled={actionLoading === b.id}
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            Release
                          </button>
                        </>
                      )}

                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                          disabled={actionLoading === b.id}
                          className="px-2 py-0.5 rounded text-[10px] font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
