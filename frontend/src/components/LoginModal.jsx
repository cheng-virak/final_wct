import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { user, login, switchUser, demoUsers } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('CUSTOMER');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password || 'demo123');
      } else {
        // Register new user via auth API
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, company, phone, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create account');
        await login(email, password);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoUser = (demoUser) => {
    switchUser(demoUser);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {mode === 'login' ? 'Sign In to Grand Horizon' : 'Create an Account'}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'login' ? 'Access your holds & reservations' : 'Register for provisional space holds'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle Pills */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* 1-Click Demo Accounts (Fast Testing) */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Instant 1-Click Login (Demo Accounts):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelectDemoUser({
                id: 1,
                name: 'Elena Rostova (Venue Director)',
                email: 'admin@venueworks.com',
                role: 'ADMIN',
                company: 'Grand Horizon Venues & Suites'
              })}
              className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900">Admin Portal</span>
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <p className="text-[10px] text-purple-700 truncate">Elena Rostova</p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemoUser({
                id: 2,
                name: 'Alexander Morgan',
                email: 'alex.morgan@acmecorp.com',
                role: 'CUSTOMER',
                company: 'Acme Global Innovations'
              })}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">Client / Customer</span>
                <User className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-[10px] text-blue-700 truncate">Alexander Morgan</p>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2 text-[10px] text-slate-400 font-bold uppercase">or email login</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Johnathan Vance"
                  className="w-full bg-slate-50 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-50 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            <span>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
