import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

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
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Confirmed Booking</span>
      </span>
    );
  }

  if (status === 'CANCELLED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <XCircle className="w-3.5 h-3.5" />
        <span>Cancelled</span>
      </span>
    );
  }

  if (status === 'EXPIRED' || timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Hold Expired</span>
      </span>
    );
  }

  const isUrgent = timeLeft.hours < 12;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
        isUrgent
          ? 'bg-amber-100 text-amber-900 border border-amber-400 animate-pulse'
          : 'bg-amber-50 text-amber-900 border border-amber-300'
      }`}>
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m left</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
      isUrgent
        ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
        : 'bg-amber-50 border-amber-300 text-amber-900'
    }`}>
      <Clock className={`w-4 h-4 ${isUrgent ? 'animate-spin text-amber-600' : 'text-amber-600'}`} />
      <div className="flex items-center gap-1.5 text-xs font-bold">
        <span>Tentative Hold:</span>
        <span className="font-mono font-extrabold tracking-wider text-sm">
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
