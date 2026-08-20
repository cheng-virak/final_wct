import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Building2, 
  UserCheck, 
  Mail, 
  Plus,
  ArrowRight
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
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/40 bg-amber-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span>Active Provisional Holds</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {holds.length}
          </div>
          <p className="text-[11px] text-slate-400">Slots awaiting client confirmation</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
            <span>Confirmed Reservations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {confirmed.length}
          </div>
          <p className="text-[11px] text-slate-400">Locked calendar bookings</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
            <span>Projected Pipeline Value</span>
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${holds.reduce((sum, h) => sum + h.total_price, 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">In pending tentative holds</p>
        </div>
      </div>

      {/* Holds Management Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Pending Tentative Holds Queue</span>
            </h3>
            <p className="text-xs text-slate-400">
              Review and manage holds approaching expiration or approve to confirmed booking.
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {holds.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="p-3.5 pl-5">Event & Space</th>
                  <th className="p-3.5">Client & Contact</th>
                  <th className="p-3.5">Scheduled Slot</th>
                  <th className="p-3.5">Hold Expiration</th>
                  <th className="p-3.5">Quoted Value</th>
                  <th className="p-3.5 pr-5 text-right">Manager Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {holds.map((b) => {
                  const dateStr = new Date(b.start_time).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                  const startHour = new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const endHour = new Date(b.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-white text-xs">{b.event_name}</div>
                        <div className="text-[11px] text-cyan-300 font-medium">{b.venue_name}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{b.user_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{b.user_email}</div>
                        <div className="text-[10px] text-slate-400">{b.user_company}</div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        <div>{dateStr}</div>
                        <div className="text-slate-400">{startHour} – {endHour}</div>
                        <div className="text-slate-400">({b.duration_hours}h • {b.guest_count} guests)</div>
                      </td>

                      <td className="p-3.5">
                        <HoldCountdown expiresAt={b.hold_expires_at} status={b.status} compact={true} />
                      </td>

                      <td className="p-3.5 font-mono font-bold text-cyan-300 text-xs">
                        ${b.total_price.toLocaleString()}
                      </td>

                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleExtend(b.id)}
                            disabled={actionLoading === b.id}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
                            title="Extend hold +24 hours"
                          >
                            +24h
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            disabled={actionLoading === b.id}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-900/50 transition-colors disabled:opacity-50"
                            title="Release & cancel hold"
                          >
                            Release
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                            disabled={actionLoading === b.id}
                            className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950 transition-all disabled:opacity-50"
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
          <div className="p-8 text-center text-slate-500 text-xs">
            No active holds currently pending review. All calendar slots are either confirmed or free.
          </div>
        )}
      </div>
    </div>
  );
}
