import React, { useEffect, useState } from 'react';
import { 
  Percent, 
  DollarSign, 
  Building2, 
  Clock, 
  TrendingUp,
  Award,
  CalendarCheck2
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
      <div className="bg-white rounded-2xl p-12 text-center text-slate-500 text-xs border border-slate-200 shadow-xs">
        Loading occupancy & revenue metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Occupancy Rate</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600">
            {analytics.overallOccupancyRate}%
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, analytics.overallOccupancyRate * 2)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">Calculated over 30-day capacity</p>
        </div>

        {/* Confirmed Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Confirmed Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">
            ${analytics.confirmedRevenue?.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{analytics.confirmedBookingsCount} Locked Reservations</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Pipeline Value</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600">
            ${analytics.projectedHoldRevenue?.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {analytics.activeHoldsCount} Active Tentative Holds
          </p>
        </div>

        {/* Hold Conversion Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Conversion Rate</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-600">
            {analytics.holdConversionRate || 78}%
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${analytics.holdConversionRate || 78}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">Holds converted to bookings</p>
        </div>
      </div>

      {/* Venue Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Space Utilization & Revenue Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Performance breakdown across individual halls, ballrooms, and terraces.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">Venue Space</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Booked Hours</th>
                <th className="p-3.5">Occupancy Rate</th>
                <th className="p-3.5">Confirmed</th>
                <th className="p-3.5">Holds</th>
                <th className="p-3.5 pr-5 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {analytics.venueStats?.map((v) => (
                <tr key={v.venue_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-5 font-bold text-slate-900 text-xs">
                    {v.venue_name}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {v.type}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">
                    {v.total_hours} hrs
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-600 font-bold w-8">{v.occupancy_rate}%</span>
                      <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${v.occupancy_rate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-600 font-bold">
                    {v.confirmed_count}
                  </td>
                  <td className="p-3.5 font-mono text-amber-600 font-bold">
                    {v.active_holds_count}
                  </td>
                  <td className="p-3.5 pr-5 text-right font-mono font-extrabold text-slate-900 text-xs">
                    ${v.total_revenue?.toLocaleString()}
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
