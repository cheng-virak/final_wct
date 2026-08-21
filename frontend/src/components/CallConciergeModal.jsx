import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Clock, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Building,
  User
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CallConciergeModal({ isOpen, onClose, venueName = null }) {
  const { user } = useAuth();
  
  const [tab, setTab] = useState('direct'); // 'direct', 'callback', 'virtual'
  
  // Callback Form
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [topic, setTopic] = useState('48-Hour Provisional Hold & Pricing Consultation');
  const [preferredTime, setPreferredTime] = useState('Immediate (Within 5 Minutes)');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Virtual Call Simulator State
  const [callState, setCallState] = useState('idle'); // 'idle', 'ringing', 'connected', 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (user?.name && !clientName) setClientName(user.name);
    if (user?.phone && !clientPhone) setClientPhone(user.phone);
  }, [user]);

  // Handle call timer
  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!isOpen) return null;

  const handleStartVirtualCall = () => {
    setCallState('ringing');
    setTimeout(() => {
      setCallState('connected');
    }, 2500);
  };

  const handleEndVirtualCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
    }, 1500);
  };

  const handleSubmitCallback = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.requestCall({
        client_name: clientName,
        client_phone: clientPhone,
        client_email: user?.email || '',
        venue_name: venueName || 'Grand Horizon Executive Suites',
        preferred_time: preferredTime,
        topic
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Failed to dispatch callback request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Executive Venue Concierge
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct hotline & priority venue consultation
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (callState === 'connected') handleEndVirtualCall();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setTab('direct')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              tab === 'direct' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Direct Dial
          </button>
          <button
            onClick={() => setTab('callback')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              tab === 'callback' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Request Callback
          </button>
          <button
            onClick={() => setTab('virtual')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              tab === 'virtual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Virtual Call
          </button>
        </div>

        {/* TAB 1: DIRECT DIAL */}
        {tab === 'direct' && (
          <div className="space-y-4 text-center py-2">
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700">
                24/7 Priority Operations Desk
              </span>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900">
                +1 (800) 555-0199
              </div>
              <p className="text-xs text-slate-600">
                Instant connection with senior venue directors and event planners.
              </p>
            </div>

            <div className="space-y-2">
              <a
                href="tel:+18005550199"
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer inline-flex"
              >
                <Phone className="w-4 h-4" />
                <span>Call Concierge Now</span>
              </a>

              <p className="text-[10px] text-slate-400">
                Zero call waiting · Dedicated representative assigned to your event
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: REQUEST CALLBACK */}
        {tab === 'callback' && (
          <div>
            {submitted ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-emerald-950">Callback Request Confirmed</h4>
                <p className="text-xs text-emerald-800">
                  Our venue specialist will reach out to <strong className="font-mono font-bold">{clientPhone}</strong> within {preferredTime.toLowerCase()}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold mt-2 cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitCallback} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Marcus Aurelius"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number for Callback</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Preferred Time</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-medium cursor-pointer"
                  >
                    <option>Immediate (Within 5 Minutes)</option>
                    <option>Today Afternoon (2:00 PM – 5:00 PM)</option>
                    <option>Tomorrow Morning (9:00 AM – 12:00 PM)</option>
                    <option>Custom Scheduling via Email</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                >
                  <span>{submitting ? 'Dispatching...' : 'Request Priority Callback'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: LIVE VIRTUAL AUDIO CALL SIMULATOR */}
        {tab === 'virtual' && (
          <div className="py-2 text-center space-y-4">
            {callState === 'idle' && (
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center mx-auto">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-white">Live Web Audio Hotline</h4>
                  <p className="text-xs text-slate-300">
                    Connect directly through your browser with Grand Horizon's on-duty event director.
                  </p>
                </div>

                <button
                  onClick={handleStartVirtualCall}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Start Web Audio Call</span>
                </button>
              </div>
            )}

            {callState === 'ringing' && (
              <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/50">
                  <PhoneCall className="w-7 h-7 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Connecting to Venue Concierge...</h4>
                  <p className="text-xs text-slate-400">Ringing event director line</p>
                </div>
                <button
                  onClick={handleEndVirtualCall}
                  className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold cursor-pointer"
                >
                  Cancel Call
                </button>
              </div>
            )}

            {callState === 'connected' && (
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Call Active
                  </span>
                  <span className="font-mono font-bold text-white text-sm">
                    {formatSeconds(callDuration)}
                  </span>
                </div>

                <div className="py-2 space-y-2">
                  <div className="text-base font-extrabold text-white">
                    Grand Horizon Concierge
                  </div>
                  <p className="text-xs text-slate-300">
                    "Hello! You're connected to Grand Horizon Event Operations. How may we assist with your venue hold?"
                  </p>
                </div>

                {/* Animated Audio Waveform */}
                <div className="flex items-center justify-center gap-1 h-8">
                  {[40, 70, 30, 90, 50, 80, 60, 100, 45, 75].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-400 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>

                {/* Call Control Buttons */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full border transition-colors cursor-pointer ${
                      isMuted ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={handleEndVirtualCall}
                    className="p-3 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-950"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span>End Call</span>
                  </button>
                </div>
              </div>
            )}

            {callState === 'ended' && (
              <div className="p-6 rounded-3xl bg-slate-100 text-slate-900 space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                  <PhoneOff className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-extrabold">Call Ended</h4>
                <p className="text-xs text-slate-500">Thank you for speaking with Grand Horizon Concierge.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
