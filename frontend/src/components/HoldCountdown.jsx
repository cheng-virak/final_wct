import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export default function HoldCountdown({ expiresAt, status, compact = false }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!expiresAt || status !== 'HELD') return;

    const updateTimer = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isExpired: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, status]);

  if (status === 'CONFIRMED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>CONFIRMED BOOKING</span>
      </span>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <XCircle className="w-3.5 h-3.5 text-slate-400" />
        <span>RELEASED / CANCELLED</span>
      </span>
    );
  }

  if (status === 'EXPIRED' || timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>HOLD EXPIRED</span>
      </span>
    );
  }

  const isUrgent = timeLeft.hours < 12;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
        isUrgent
          ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-400/30'
          : 'bg-amber-50/70 text-amber-800 border-amber-200'
      }`}>
        <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-amber-600 animate-pulse' : 'text-amber-600'}`} />
        <span>{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m left</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
      isUrgent
        ? 'bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-400/20'
        : 'bg-amber-50/80 border-amber-200 text-amber-900 shadow-2xs'
    }`}>
      <Clock className={`w-4 h-4 ${isUrgent ? 'text-amber-600 animate-pulse' : 'text-amber-600'}`} />
      <div className="flex items-center gap-2 text-xs font-bold">
        <span className="text-[10px] uppercase tracking-wider text-amber-800 font-extrabold">Provisional Hold:</span>
        <span className="font-mono font-extrabold tracking-widest text-sm bg-white px-2 py-0.5 rounded-md border border-amber-200 text-amber-950">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
