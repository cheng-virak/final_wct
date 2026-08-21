import React, { useState } from 'react';
import { 
  Building2, 
  CalendarDays, 
  Calculator, 
  BookmarkCheck, 
  ShieldCheck, 
  Plus, 
  Globe,
  ExternalLink,
  User,
  LogOut,
  ChevronDown,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ 
  activeTab, 
  onSelectTab, 
  onOpenNewBooking, 
  activeHoldsCount = 0, 
  pendingAdminCount = 0,
  onOpenLoginModal,
  onOpenCallModal
}) {
  const { user, logout, isAdmin } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'venues', label: t('venues'), icon: Building2 },
    { id: 'calendar', label: t('calendar'), icon: CalendarDays },
    { id: 'calculator', label: t('pricing'), icon: Calculator },
    { id: 'my-bookings', label: t('myHolds'), icon: BookmarkCheck, badge: activeHoldsCount }
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none group" 
            onClick={() => onSelectTab('venues')}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-2xs group-hover:bg-blue-700 transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Grand Horizon
            </span>
          </div>

          {/* Desktop Navigation with Purposeful Icons */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>

                  {item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200/60"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Concierge Direct Hotline */}
            <button
              onClick={onOpenCallModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 transition-colors cursor-pointer"
              title="Speak with Venue Concierge"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Concierge Hotline</span>
              <span className="lg:hidden">Call</span>
            </button>

            {/* Separate Admin Portal Link - Opens in New Page / Tab */}
            <a
              href="/admin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
              title="Open Admin Portal in New Tab"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Admin Portal</span>
              <span className="sm:hidden">Admin</span>
              <ExternalLink className="w-3 h-3 text-purple-400 ml-0.5" />
              {pendingAdminCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[9px] font-bold">
                  {pendingAdminCount}
                </span>
              )}
            </a>

            {/* User Account / Sign In Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {user.name?.[0] || 'U'}
                  </div>
                  <span className="hidden lg:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Log In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl p-2 shadow-2xl border border-slate-200 text-xs space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="p-2 border-b border-slate-100">
                    <div className="font-extrabold text-slate-900 truncate">{user?.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</div>
                    <div className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700">
                      {user?.role}
                    </div>
                  </div>

                  <button
                    onClick={() => { setUserDropdownOpen(false); onOpenLoginModal(); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch Account / Sign In</span>
                  </button>

                  <button
                    onClick={() => { setUserDropdownOpen(false); logout(); }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Book Space Button */}
            <button
              onClick={() => onOpenNewBooking()}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book Space</span>
              <span className="sm:hidden">Book</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Modern Mobile Pill Dock */}
      <div className="md:hidden fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-xl text-white rounded-full p-1.5 shadow-2xl border border-white/15 flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-full text-xs font-bold transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.badge > 0 && (
                  <span className="px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[8px] font-mono font-bold">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <span className="text-[11px] font-extrabold tracking-tight">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}

          {/* Mobile Call Concierge button */}
          <button
            onClick={onOpenCallModal}
            className="flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-bold text-emerald-400 hover:text-emerald-300"
            title="Call Concierge"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Mobile Login / User button */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-bold text-slate-300 hover:text-white"
            title="Log In / Switch Account"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Mobile Admin Link to separate page */}
          <a
            href="/admin.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
            title="Open Admin Portal"
          >
            <ShieldCheck className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  );
}
