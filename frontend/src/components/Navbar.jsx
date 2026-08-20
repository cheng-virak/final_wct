import React from 'react';
import { 
  Building2, 
  CalendarDays, 
  Calculator, 
  BookmarkCheck, 
  ShieldCheck, 
  Plus, 
  Globe, 
  UserCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ activeTab, onSelectTab, onOpenNewBooking, activeHoldsCount = 0, pendingAdminCount = 0 }) {
  const { user, isAdmin, switchUser, demoUsers } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

  const handleToggleRole = () => {
    if (isAdmin) {
      const customer = demoUsers.find(u => u.role === 'CUSTOMER') || { id: 2, name: 'Alexander Morgan', role: 'CUSTOMER' };
      switchUser(customer);
      if (activeTab === 'admin') onSelectTab('venues');
    } else {
      const admin = demoUsers.find(u => u.role === 'ADMIN') || { id: 1, name: 'Elena Rostova (Admin)', role: 'ADMIN' };
      switchUser(admin);
    }
  };

  const navItems = [
    { id: 'venues', label: t('venues'), icon: Building2 },
    { id: 'calendar', label: t('calendar'), icon: CalendarDays },
    { id: 'calculator', label: t('pricing'), icon: Calculator },
    { id: 'my-bookings', label: t('myHolds'), icon: BookmarkCheck, badge: activeHoldsCount },
    ...(isAdmin ? [{ id: 'admin', label: t('adminPortal'), icon: ShieldCheck, alert: pendingAdminCount > 0 }] : [])
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

                  {item.alert && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Switcher with Globe Icon */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200/60"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Role Switcher */}
            <button
              onClick={handleToggleRole}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200/60"
              title="Toggle Persona"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>{isAdmin ? 'Admin' : 'Client'}</span>
            </button>

            {/* Book Button */}
            <button
              onClick={() => onOpenNewBooking()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book Space</span>
              <span className="sm:hidden">Book</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Modern Mobile Pill Dock with Purposeful Icons */}
      <div className="md:hidden fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-xl text-white rounded-full p-1.5 shadow-2xl border border-white/15 flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all relative cursor-pointer ${
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
        </div>
      </div>
    </>
  );
}
