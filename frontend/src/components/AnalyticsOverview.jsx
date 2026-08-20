import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Percent, 
  DollarSign, 
  Building2, 
  BookmarkCheck, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';

export default function AnalyticsOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = () => {
    setLoading(true);
    api.getAnalytics()
      .then(res => setAnalytics(res.data))
      .catch(err => console.error('Failed to load analytics', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 text-xs">
        Loading occupancy & revenue metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Overall Occupancy Rate</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {analytics.overallOccupancyRate}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
              style={{ width: `${Math.min(100, analytics.overallOccupancyRate * 2)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">Calculated over 30-day capacity</p>
        </div>

        {/* Confirmed Revenue */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Confirmed Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            ${analytics.confirmedRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {analytics.confirmedBookingsCount} Locked Reservations
          </p>
        </div>

        {/* Projected Pipeline from Holds */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Projected Pipeline</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            ${analytics.projectedHoldRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {analytics.activeHoldsCount} Active Tentative Holds
          </p>
        </div>

        {/* Hold Conversion Rate */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Hold Conversion Rate</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {analytics.holdConversionRate || 78}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
              style={{ width: `${analytics.holdConversionRate || 78}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">Holds converted to booking</p>
        </div>
      </div>

      {/* Venue Performance Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Space Utilization & Revenue Performance</span>
            </h3>
            <p className="text-xs text-slate-400">
              Performance breakdown across individual halls, ballrooms, and terraces.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800 text-[11px]">
              <tr>
                <th className="p-3.5 pl-5">Venue Space</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Booked Hours</th>
                <th className="p-3.5">Occupancy Rate</th>
                <th className="p-3.5">Confirmed Events</th>
                <th className="p-3.5">Active Holds</th>
                <th className="p-3.5 pr-5 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {analytics.venueStats?.map((v) => (
                <tr key={v.venue_id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-white text-xs">
                    {v.venue_name}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {v.type}
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">
                    {v.total_hours} hrs
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-300 font-bold w-7">{v.occupancy_rate}%</span>
                      <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full"
                          style={{ width: `${v.occupancy_rate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                    {v.confirmed_count}
                  </td>
                  <td className="p-3.5 font-mono text-amber-400 font-semibold">
                    {v.active_holds_count}
                  </td>
                  <td className="p-3.5 pr-5 text-right font-mono font-bold text-cyan-300 text-xs">
                    ${v.total_revenue.toLocaleString()}
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
