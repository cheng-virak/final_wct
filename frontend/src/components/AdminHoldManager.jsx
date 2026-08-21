import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Building2, 
  User, 
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import HoldCountdown from './HoldCountdown';
import { api } from '../api/client';

export default function AdminHoldManager({ bookings = [], onRefresh }) {
  const [actionLoading, setActionLoading] = useState(null);

  const holds = bookings.filter(b => b.status === 'HELD');
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED');

  const handleUpdateStatus = async (bookingId, status) => {
    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, status);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update hold status');
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
    <div className="space-y-6">
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200/80 p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-800 font-bold uppercase">
            <span>Active Provisional Holds</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-900">
            {holds.length}
          </div>
          <p className="text-xs text-amber-700">Slots awaiting client confirmation</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/80 p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-bold uppercase">
            <span>Confirmed Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-900">
            {confirmed.length}
          </div>
          <p className="text-xs text-emerald-700">Locked calendar schedules</p>
        </div>

        <div className="bg-blue-50 border border-blue-200/80 p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-blue-800 font-bold uppercase">
            <span>Potential Hold Value</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-900">
            ${holds.reduce((sum, h) => sum + (Number(h.total_price) || 0), 0).toLocaleString()}
          </div>
          <p className="text-xs text-blue-700">In pending tentative holds</p>
        </div>
      </div>

      {/* Holds Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Pending Tentative Holds Queue</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review expiring holds, grant +24h extensions, or instantly approve to locked booking.
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {holds.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 pl-5">Event & Space</th>
                  <th className="p-3.5">Client Information</th>
                  <th className="p-3.5">Scheduled Slot</th>
                  <th className="p-3.5">Hold Expiration</th>
                  <th className="p-3.5">Quoted Value</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {holds.map((b) => {
                  const dateStr = new Date(b.start_time).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                  const startHour = new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const endHour = new Date(b.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-slate-900 text-xs">{b.event_name}</div>
                        <div className="text-[11px] text-blue-600 font-semibold">{b.venue_name}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{b.user_name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{b.user_email}</div>
                        {b.user_company && (
                          <div className="text-[10px] text-slate-400">{b.user_company}</div>
                        )}
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        <div className="font-bold text-slate-900">{dateStr}</div>
                        <div className="text-slate-500">{startHour} – {endHour}</div>
                        <div className="text-slate-400 text-[10px]">{b.guest_count} guests</div>
                      </td>

                      <td className="p-3.5">
                        <HoldCountdown expiresAt={b.hold_expires_at} status={b.status} compact={true} />
                      </td>

                      <td className="p-3.5 font-mono font-extrabold text-slate-900 text-xs">
                        ${Number(b.total_price || 0).toLocaleString()}
                      </td>

                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleExtend(b.id)}
                            disabled={actionLoading === b.id}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                            title="Extend hold +24 hours"
                          >
                            +24h
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            disabled={actionLoading === b.id}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                            title="Release & cancel hold"
                          >
                            Release
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                            disabled={actionLoading === b.id}
                            className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
                            title="Approve and convert to confirmed booking"
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-60" />
            <div className="font-semibold text-slate-700 text-sm">No Pending Holds</div>
            <p>All venue calendar slots are either confirmed or free.</p>
          </div>
        )}
      </div>
    </div>
  );
}
