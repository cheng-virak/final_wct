import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onSelectTab }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
      {/* Upper Value Props */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">48-Hour Free Holds</h4>
            <p className="text-slate-500 leading-relaxed">
              Freeze any event space for 48 hours with zero upfront payment.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">No Double Bookings</h4>
            <p className="text-slate-500 leading-relaxed">
              Real-time conflict checking guarantees your exclusive schedule slot.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Luxury Specifications</h4>
            <p className="text-slate-500 leading-relaxed">
              4K laser projection, concert acoustics, stage lighting & catering.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Transparent Pricing</h4>
            <p className="text-slate-500 leading-relaxed">
              Clear hourly rates with instant itemized invoices and zero hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-3">
          <span className="text-base font-extrabold text-slate-900 tracking-tight block">
            Grand Horizon
          </span>
          <p className="text-slate-500 leading-relaxed max-w-sm">
            Curating premier architectural spaces, grand ballrooms, glass pavilions, and executive amphitheaters for distinctive corporate summits, galas, and private celebrations.
          </p>

          <div className="space-y-1 text-slate-500 text-xs pt-1">
            <div>Tower One, Financial District, Grand Horizon Avenue</div>
            <div>+1 (800) 555-VENUE • Mon–Sun 8:00 AM – 10:00 PM</div>
            <div>concierge@grandhorizonvenues.com</div>
          </div>
        </div>

        {/* Navigation Column */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-slate-600">
            <li>
              <button onClick={() => onSelectTab('venues')} className="hover:text-blue-600 transition-colors cursor-pointer">
                {t('venues')} Catalog
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('calendar')} className="hover:text-blue-600 transition-colors cursor-pointer">
                {t('calendar')} Availability
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('calculator')} className="hover:text-blue-600 transition-colors cursor-pointer">
                {t('pricing')} Calculator
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('my-bookings')} className="hover:text-blue-600 transition-colors cursor-pointer">
                {t('myHolds')} & Reservations
              </button>
            </li>
          </ul>
        </div>

        {/* Space Categories */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Featured Spaces
          </h4>
          <ul className="space-y-2 text-slate-500">
            <li>The Grand Imperial Ballroom</li>
            <li>The Glasshouse Pavilion & Garden</li>
            <li>Apex Tech Amphitheater</li>
            <li>Skyline Penthouse Rooftop</li>
            <li>Executive Horizon Boardroom</li>
          </ul>
        </div>

        {/* Hold Guarantee */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Hold Policy
          </h4>
          <p className="text-slate-500 leading-relaxed">
            All tentative holds are locked for 48 hours without payment. Our system automatically releases expired holds to ensure fair scheduling.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 bg-slate-50 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p className="text-xs">
            © {new Date().getFullYear()} Grand Horizon VenueWorks Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Hold Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
