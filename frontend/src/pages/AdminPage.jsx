import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ArrowLeft, 
  RefreshCw, 
  Plus, 
  ListOrdered, 
  Clock, 
  BarChart3, 
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Globe,
  UserCheck,
  Search,
  Filter,
  ExternalLink,
  Phone,
  Mail,
  X,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  Sparkles,
  Trash2,
  Users,
  LogOut,
  Eye
} from 'lucide-react';
import HoldCountdown from '../components/HoldCountdown';
import AnalyticsOverview from '../components/AnalyticsOverview';
import AdminHoldManager from '../components/AdminHoldManager';
import InteractiveCalendar from '../components/InteractiveCalendar';
import AdminAccountManager from '../components/AdminAccountManager';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function AdminPage({
  venues = [],
  bookings = [],
  amenities = [],
  onRefresh,
  onOpenBookingModal,
  onNavigateToClient,
  onOpenLoginModal
}) {
  const { user } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [adminTab, setAdminTab] = useState('ledger'); // 'ledger', 'holds', 'analytics', 'calendar'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const holds = bookings.filter(b => b.status === 'HELD');
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
  const cancelled = bookings.filter(b => b.status === 'CANCELLED');
  const totalRevenue = confirmed.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
  const pipelineRevenue = holds.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

  const handleUpdateStatus = async (bookingId, status) => {
    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, status);
      onRefresh();
      if (selectedBookingDetail?.id === bookingId) {
        setSelectedBookingDetail(prev => ({ ...prev, status }));
      }
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

  const handleDeleteBooking = async (bookingId, eventName = 'this reservation') => {
    if (!window.confirm(`Are you sure you want to permanently delete "${eventName}"? This cannot be undone.`)) {
      return;
    }
    setActionLoading(bookingId);
    try {
      await api.deleteBooking(bookingId);
      onRefresh();
      if (selectedBookingDetail?.id === bookingId) {
        setSelectedBookingDetail(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete booking');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.event_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.venue_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-purple-100 selection:text-purple-900 pb-16">
      {/* Clean Modern Admin Header */}
      {/* Clean 2-Tier Enterprise Admin Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        {/* Tier 1: Main Brand & Global Actions Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-950">
                  Grand Horizon
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200/80 uppercase tracking-wider">
                  Admin Ops
                </span>
              </div>
            </div>
          </div>

          {/* Right Global Actions */}
          <div className="flex items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
              title="Open Client Website in New Tab"
            >
              <span>Client Site</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            <button
              onClick={() => onOpenBookingModal(null)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Reservation</span>
            </button>

            {/* Admin Profile / Sign Out Trigger */}
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
              title="Manage Session / Sign Out"
            >
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center">
                {user?.name?.[0] || 'A'}
              </div>
              <span className="hidden md:inline max-w-[120px] truncate">{user?.name || 'Admin Acc'}</span>
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Tier 2: Dedicated Navigation Tabs & Status Bar */}
        <div className="bg-slate-50/80 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setAdminTab('ledger')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminTab === 'ledger'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>All Reservations</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                  adminTab === 'ledger' ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {bookings.length}
                </span>
              </button>

              <button
                onClick={() => setAdminTab('holds')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminTab === 'holds'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Holds Queue</span>
                {holds.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    adminTab === 'holds' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {holds.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminTab === 'analytics'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Revenue & Analytics</span>
              </button>

              <button
                onClick={() => setAdminTab('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminTab === 'calendar'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Master Calendar</span>
              </button>

              <button
                onClick={() => setAdminTab('accounts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  adminTab === 'accounts'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Account Manager</span>
              </button>
            </nav>

            {/* Right Status & Refresh Sync */}
            <div className="flex items-center justify-end gap-2.5 shrink-0 text-xs">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>MongoDB Connected</span>
              </div>

              <button
                onClick={onRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold transition-colors cursor-pointer"
                title="Sync and Refresh Live Data"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                <span>Sync Data</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Top 4 Interactive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Active Holds */}
          <div 
            onClick={() => setAdminTab('holds')}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-amber-400 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-amber-700 font-bold uppercase tracking-wider">
              <span>Active Holds</span>
              <div className="p-1 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {holds.length}
            </div>
            <p className="text-[11px] text-slate-500">
              {holds.length > 0 ? '⚠️ Action needed on holds' : 'All clear'}
            </p>
          </div>

          {/* Confirmed Revenue */}
          <div 
            onClick={() => setAdminTab('analytics')}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-emerald-400 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-emerald-700 font-bold uppercase tracking-wider">
              <span>Confirmed Revenue</span>
              <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500">{confirmed.length} locked bookings</p>
          </div>

          {/* Pipeline Revenue */}
          <div 
            onClick={() => setAdminTab('analytics')}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-blue-700 font-bold uppercase tracking-wider">
              <span>Hold Pipeline</span>
              <div className="p-1 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600">
              ${pipelineRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500">Pending conversion</p>
          </div>

          {/* Total Managed Spaces */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-700 font-bold uppercase tracking-wider">
              <span>Venue Spaces</span>
              <div className="p-1 rounded-lg bg-purple-50 text-purple-600">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {venues.length}
            </div>
            <p className="text-[11px] text-slate-500">Halls & Terraces</p>
          </div>
        </div>

        {/* ---------------- SUB-TAB 1: RESERVATIONS LEDGER ---------------- */}
        {adminTab === 'ledger' && (
          <div className="space-y-4">
            {/* Search & Status Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
              {/* Filter Pills with Count Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'ALL', label: 'All', count: bookings.length },
                  { id: 'HELD', label: 'Holds', count: holds.length, color: 'text-amber-700 bg-amber-50' },
                  { id: 'CONFIRMED', label: 'Confirmed', count: confirmed.length, color: 'text-emerald-700 bg-emerald-50' },
                  { id: 'CANCELLED', label: 'Cancelled', count: cancelled.length, color: 'text-slate-600 bg-slate-100' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === st.id
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      statusFilter === st.id ? 'bg-purple-700 text-white' : 'bg-white text-slate-800'
                    }`}>
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Box & View Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search event, client, hall..."
                    className="w-full bg-slate-50 pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:bg-white"
                  />
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-white text-purple-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Table View"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-purple-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* View Mode: Table or Card Grid */}
            {viewMode === 'table' ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">
                    Reservations Queue ({filteredBookings.length})
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Click any row to inspect full event & invoice details
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5 pl-4">Event Details</th>
                        <th className="p-3.5">Venue Space</th>
                        <th className="p-3.5">Client & Contact</th>
                        <th className="p-3.5">Date & Time</th>
                        <th className="p-3.5">Status / Timer</th>
                        <th className="p-3.5">Quoted Amount</th>
                        <th className="p-3.5 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => {
                          const dateStr = new Date(b.start_time).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          });
                          const startHour = new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          const endHour = new Date(b.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                          return (
                            <tr 
                              key={b.id} 
                              onClick={() => setSelectedBookingDetail(b)}
                              className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                            >
                              <td className="p-3.5 pl-4">
                                <div className="font-bold text-slate-900 text-xs group-hover:text-purple-700 transition-colors">
                                  {b.event_name}
                                </div>
                                <div className="text-[11px] text-slate-500">{b.guest_count} guests</div>
                              </td>

                              <td className="p-3.5 text-blue-700 font-semibold">
                                {b.venue_name}
                              </td>

                              <td className="p-3.5">
                                <div className="font-semibold text-slate-900">{b.user_name}</div>
                                <div className="text-[11px] text-slate-500 font-mono">{b.user_email}</div>
                              </td>

                              <td className="p-3.5 font-mono text-[11px]">
                                <div className="font-bold text-slate-900">{dateStr}</div>
                                <div className="text-slate-500 text-[10px]">{startHour} – {endHour}</div>
                              </td>

                              <td className="p-3.5">
                                <HoldCountdown expiresAt={b.hold_expires_at} status={b.status} compact={true} />
                              </td>

                              <td className="p-3.5 font-mono font-extrabold text-slate-900 text-xs">
                                ${Number(b.total_price || 0).toLocaleString()}
                              </td>

                              <td className="p-3.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedBookingDetail(b)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
                                    title="View full booking dossier"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Details</span>
                                  </button>

                                  {b.status === 'HELD' && (
                                    <>
                                      <button
                                        onClick={() => handleExtend(b.id)}
                                        disabled={actionLoading === b.id}
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                                        title="Extend hold +24 hours"
                                      >
                                        +24h
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                                        disabled={actionLoading === b.id}
                                        className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                        title="Approve to confirmed booking"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                                        disabled={actionLoading === b.id}
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                                        title="Release hold"
                                      >
                                        Release
                                      </button>
                                    </>
                                  )}

                                  {b.status === 'CONFIRMED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                                      disabled={actionLoading === b.id}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                                      title="Cancel reservation"
                                    >
                                      Cancel
                                    </button>
                                  )}

                                  {b.status === 'CANCELLED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                                      disabled={actionLoading === b.id}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                                      title="Reactivate booking"
                                    >
                                      Reopen
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleDeleteBooking(b.id, b.event_name)}
                                    disabled={actionLoading === b.id}
                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                                    title="Permanently delete reservation"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="p-12 text-center text-slate-400">
                            No reservations found matching current criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Grid Card View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBookingDetail(b)}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{b.event_name}</h4>
                        <p className="text-xs font-semibold text-blue-600">{b.venue_name}</p>
                      </div>
                      <HoldCountdown expiresAt={b.hold_expires_at} status={b.status} compact={true} />
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Client:</span>
                        <span className="font-semibold text-slate-800">{b.user_name}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span>Date:</span>
                        <span className="text-slate-800">
                          {new Date(b.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total Price:</span>
                        <span className="font-mono font-extrabold text-slate-900 text-sm">
                          ${Number(b.total_price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDeleteBooking(b.id, b.event_name)}
                        disabled={actionLoading === b.id}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                        title="Delete reservation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5">
                        {b.status === 'HELD' && (
                          <>
                            <button
                              onClick={() => handleExtend(b.id)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                            >
                              +24h
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                              className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              Approve
                            </button>
                          </>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- SUB-TAB 2: HOLDS QUEUE ---------------- */}
        {adminTab === 'holds' && (
          <AdminHoldManager bookings={bookings} onRefresh={onRefresh} />
        )}

        {/* ---------------- SUB-TAB 3: ANALYTICS ---------------- */}
        {adminTab === 'analytics' && (
          <AnalyticsOverview />
        )}

        {/* ---------------- SUB-TAB 4: MASTER CALENDAR ---------------- */}
        {adminTab === 'calendar' && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <InteractiveCalendar
              venues={venues}
              bookings={bookings}
              onSelectSlot={(slot) => {
                onOpenBookingModal({
                  venue_id: slot.venue_id,
                  date: slot.date,
                  start_time: slot.startTime,
                  end_time: slot.endTime
                });
              }}
              selectedVenueFilter="all"
              onVenueFilterChange={() => {}}
            />
          </div>
        )}

        {/* ---------------- SUB-TAB 5: ACCOUNTS & USERS ---------------- */}
        {adminTab === 'accounts' && (
          <AdminAccountManager />
        )}
      </main>

      {/* Reservation Detail Modal / Drawer */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                    Booking #{selectedBookingDetail.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedBookingDetail.event_type || 'Corporate Event'}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 mt-1">
                  {selectedBookingDetail.event_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Hold Status Banner */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Status</span>
                <span className="font-extrabold text-xs text-slate-900 mt-0.5 block">{selectedBookingDetail.status}</span>
              </div>
              <HoldCountdown expiresAt={selectedBookingDetail.hold_expires_at} status={selectedBookingDetail.status} compact={false} />
            </div>

            {/* 2-Column Details Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Event & Venue Info */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700">
                  Venue & Schedule
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Venue:</span>
                    <span className="font-bold text-slate-900">{selectedBookingDetail.venue_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {new Date(selectedBookingDetail.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span className="font-mono text-slate-700">
                      {new Date(selectedBookingDetail.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(selectedBookingDetail.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-bold text-slate-900">{selectedBookingDetail.duration_hours || 4} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guests:</span>
                    <span className="font-bold text-slate-900">{selectedBookingDetail.guest_count} attendees</span>
                  </div>
                </div>
              </div>

              {/* Client Dossier */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                  Client & Organization
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Booker:</span>
                    <span className="font-bold text-slate-900">{selectedBookingDetail.user_name || 'Direct Client'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-slate-700 text-[11px]">{selectedBookingDetail.user_email || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Company:</span>
                    <span className="font-bold text-slate-900">{selectedBookingDetail.user_company || 'Individual'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Notes:</span>
                    <span className="text-slate-600 italic truncate max-w-[140px]">{selectedBookingDetail.notes || 'None'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2 text-xs">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900">
                Invoice & Cost Breakdown
              </h4>
              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Space Rate:</span>
                  <span className="font-mono font-bold">${Number(selectedBookingDetail.base_price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amenities & AV Equipment:</span>
                  <span className="font-mono font-bold">${Number(selectedBookingDetail.amenities_price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-purple-200/80 text-sm font-extrabold text-purple-950">
                  <span>Grand Total:</span>
                  <span className="font-mono text-base text-purple-700">${Number(selectedBookingDetail.total_price || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons inside modal */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2 flex-wrap">
              <button
                onClick={() => handleDeleteBooking(selectedBookingDetail.id, selectedBookingDetail.event_name)}
                disabled={actionLoading === selectedBookingDetail.id}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Permanently delete from database"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedBookingDetail.status === 'HELD' && (
                  <>
                    <button
                      onClick={() => handleExtend(selectedBookingDetail.id)}
                      disabled={actionLoading === selectedBookingDetail.id}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                    >
                      +24h Extension
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedBookingDetail.id, 'CANCELLED')}
                      disabled={actionLoading === selectedBookingDetail.id}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    >
                      Release Hold
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedBookingDetail.id, 'CONFIRMED')}
                      disabled={actionLoading === selectedBookingDetail.id}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
                    >
                      Approve Booking
                    </button>
                  </>
                )}

                {selectedBookingDetail.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBookingDetail.id, 'CANCELLED')}
                    disabled={actionLoading === selectedBookingDetail.id}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel Reservation
                  </button>
                )}

                {selectedBookingDetail.status === 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBookingDetail.id, 'CONFIRMED')}
                    disabled={actionLoading === selectedBookingDetail.id}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                  >
                    Reactivate Reservation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
