import React, { useState } from 'react';
import { 
  Building2, 
  CalendarDays, 
  Calculator, 
  BookmarkCheck, 
  Plus, 
  User, 
  ShieldCheck, 
  Globe, 
  ChevronDown, 
  LogOut,
  ExternalLink,
  Phone,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SignOutModal from './SignOutModal';
import NotificationBell from './NotificationBell';

export default function Navbar({ 
  activeTab, 
  onSelectTab, 
  onOpenNewBooking, 
  activeHoldsCount = 0, 
  pendingAdminCount = 0,
  onNavigateToAdmin, 
  onOpenLoginModal,
  onOpenCallModal
}) {
  const { user, logout, isAdmin } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [signOutAlert, setSignOutAlert] = useState(false);

  const navItems = [
    { id: 'venues', label: t('roomsSuites'), icon: Building2 },
    { id: 'calendar', label: t('calendar'), icon: CalendarDays },
    { id: 'calculator', label: t('pricing'), icon: Calculator },
    { id: 'my-bookings', label: t('myBookings'), icon: BookmarkCheck, badge: activeHoldsCount }
  ];

  return (
    <>
      {/* Top Luxury Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group" 
            onClick={() => onSelectTab('venues')}
          >
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                Grand Horizon
              </span>
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block">
                Hotel & Resort
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
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

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200/60"
              title="Switch Language (EN / ខ្មែរ)"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-bold">{lang === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Concierge Hotline */}
            <button
              onClick={onOpenCallModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 transition-colors cursor-pointer"
              title="Speak with Front Desk Concierge"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hotline</span>
            </button>

            {/* Admin Front Desk Portal Link */}
            <a
              href="/admin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
              title="Open Hotel Front Desk Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin</span>
              {pendingAdminCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[9px] font-bold">
                  {pendingAdminCount}
                </span>
              )}
            </a>

            {/* Notification Bell */}
            <NotificationBell />

            {/* User Account / Sign In Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {user.name?.[0] || 'U'}
                  </div>
                  <span className="hidden xl:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Log In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 shadow-2xl border border-slate-200 text-xs space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <p className="font-extrabold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{user.email}</p>
                  </div>

                  <a
                    href="/admin.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-purple-700 hover:bg-purple-50 font-bold transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Front Desk Admin</span>
                  </a>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsSignOutModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Book Button */}
            <button
              onClick={onOpenNewBooking}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'កក់បន្ទប់' : 'Book Room'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirmSignOut={() => {
          logout();
          setUserDropdownOpen(false);
          setIsSignOutModalOpen(false);
          setSignOutAlert(true);
          setTimeout(() => setSignOutAlert(false), 3500);
        }}
        userName={user?.name}
        userEmail={user?.email}
      />

      {/* Floating Status Alert Toast after Logout */}
      {signOutAlert && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex items-center gap-2.5 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>✓ {lang === 'km' ? 'បានចាកចេញដោយជោគជ័យ' : 'Signed Out Successfully'}</span>
          </div>
        </div>
      )}
    </>
  );
}
