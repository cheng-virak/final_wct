import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    venues: 'Venues & Halls',
    calendar: 'Calendar',
    pricing: 'Price Calculator',
    myHolds: 'My Bookings & Holds',
    adminPortal: 'Admin Portal',
    bookHold: 'Book or Hold Space',
    from: 'From',
    perHour: '/hr',
    guests: 'guests',
    sqft: 'sq.ft',
    
    // Top Hero
    heroBadge: '48-Hour Free Hold · No Payment Needed Today',
    heroTitle: 'Luxury Event Venues & Meeting Rooms',
    heroDesc: 'Choose your event hall, check open dates on the calendar, and hold your spot for 48 hours for free.',
    viewCalendar: 'View Calendar',
    instantQuote: 'Calculate Price',
    
    // Highlights
    highlightHold: '48h Free Hold Guarantee',
    highlightOverlap: 'No Double Bookings',
    highlightCustom: 'Food, Sound & Lighting',
    highlightTransparent: 'Clear Hourly Pricing',
    
    // Categories
    allSpaces: 'All Halls',
    ballrooms: 'Ballrooms',
    glassPavilions: 'Glass Halls',
    amphitheaters: 'Theaters & Auditoriums',
    rooftops: 'Rooftops',
    boardrooms: 'Meeting Rooms',
    searchPlaceholder: 'Search by hall name or equipment...',
    
    // Actions
    holdBookBtn: 'Hold / Book Space',
    calendarBtn: 'Check Dates',
    
    // Calendar
    calendarTitle: 'Available Dates & Times',
    confirmedBooking: 'Confirmed Booking',
    activeHold: 'Active 48h Hold',
    allVenues: 'All Halls & Rooms',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    today: 'Today',
    freeSlot: 'Available Slot',
    
    // Pricing Calculator
    calcTitle: 'Easy Price Calculator',
    calcDesc: 'Pick your hall, choose your hours and extra services to see your exact price.',
    chooseVenue: '1. Choose Event Hall',
    dateTimeSchedule: '2. Pick Date & Time',
    resDate: 'Event Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    guestCount: '3. Number of Guests',
    productionAmenities: '4. Choose Extra Services (Food, Sound, Screens)',
    estimatedInvoice: 'Price Summary',
    totalQuote: 'Total Price:',
    holdNotice: '48-Hour Free Hold Available',
    holdNoticeDesc: 'Hold this hall and lock this price for 48 hours with $0 upfront.',
    placeHoldBtn: 'Hold for 48 Hours (Free)',
    confirmResBtn: 'Book Space Now',
    
    // Holds & Bookings
    myReservationsTitle: 'My Bookings & Holds',
    activeHoldsTab: 'Active Holds (48h)',
    confirmedBookingsTab: 'Confirmed Bookings',
    allRecordsTab: 'All History',
    extendHold: 'Extend Hold (+24h)',
    releaseHold: 'Cancel Hold',
    confirmLock: 'Confirm Booking',
    noReservations: 'No bookings found.',
    
    // Admin Portal
    adminPortalTitle: 'Admin Manager Portal',
    allReservations: 'All Bookings',
    holdsQueue: 'Holds Queue',
    revenueAnalytics: 'Revenue & Analytics',
    masterCalendar: 'Calendar View',
    accountManager: 'User Accounts',
    addonItems: 'Add-on Items',
    syncData: 'Sync Data',
    connected: 'Connected',
    activeHolds: 'Active Holds',
    confirmedRevenue: 'Confirmed Money',
    holdPipeline: 'Pending Holds',
    venueSpaces: 'Total Halls',
    
    // Details Modal
    bookingDetails: 'Booking Details',
    venueAndSchedule: 'Venue & Time',
    clientInfo: 'Client Contact',
    costBreakdown: 'Price Breakdown',
    grandTotal: 'Grand Total:',
    approveBooking: 'Approve Booking',
    releaseHoldBtn: 'Release Hold',
    cancelBooking: 'Cancel Booking',
    reopenBooking: 'Reopen Booking',
    deleteBooking: 'Delete',
    
    // Language Meta
    langName: 'English',
    langCode: 'EN',
    flag: '🇺🇸'
  },

  km: {
    // Navigation
    venues: 'សាល និងទីកន្លែង',
    calendar: 'កាលវិភាគ',
    pricing: 'គណនាតម្លៃ',
    myHolds: 'ការកក់របស់ខ្ញុំ',
    adminPortal: 'ផ្ទាំងគ្រប់គ្រង',
    bookHold: 'កក់ ឬចាក់សោម៉ោង',
    from: 'ចាប់ពី',
    perHour: '/ម៉ោង',
    guests: 'នាក់',
    sqft: 'ហ្វីតការ៉េ',
    
    // Top Hero
    heroBadge: 'ចាក់សោម៉ោង ៤៨ម៉ោងឥតគិតថ្លៃ · មិនបាច់បង់ប្រាក់ថ្ងៃនេះ',
    heroTitle: 'សាលប្រជុំ និងកន្លែងរៀបចំកម្មវិធីប្រណីត',
    heroDesc: 'ជ្រើសរើសសាលកម្មវិធី មើលថ្ងៃទំនេរនៅលើប្រតិទិន និងចាក់សោម៉ោងទុក ៤៨ ម៉ោងដោយឥតគិតថ្លៃ។',
    viewCalendar: 'មើលប្រតិទិន',
    instantQuote: 'គណនាតម្លៃ',
    
    // Highlights
    highlightHold: 'ចាក់សោម៉ោង ៤៨ម៉ោងឥតគិតថ្លៃ',
    highlightOverlap: 'មិនជាន់ម៉ោងគ្នាឡើយ',
    highlightCustom: 'ម្ហូប សំឡេង និងពន្លឺ',
    highlightTransparent: 'តម្លៃច្បាស់លាស់តាមម៉ោង',
    
    // Categories
    allSpaces: 'សាលទាំងអស់',
    ballrooms: 'សាលពិធីធំ (Ballroom)',
    glassPavilions: 'សាលកញ្ចក់ទេសភាព',
    amphitheaters: 'សាលមហោស្រព/សិក្ខាសាលា',
    rooftops: 'ដំបូលអគារទេសភាព',
    boardrooms: 'បន្ទប់ប្រជុំ',
    searchPlaceholder: 'ស្វែងរកតាមឈ្មោះសាល ឬឧបករណ៍...',
    
    // Actions
    holdBookBtn: 'ចាក់សោ / កក់សាល',
    calendarBtn: 'មើលកាលវិភាគ',
    
    // Calendar
    calendarTitle: 'កាលវិភាគថ្ងៃទំនេរ',
    confirmedBooking: 'ការកក់បានបញ្ជាក់',
    activeHold: 'កំពុងចាក់សោម៉ោង (៤៨ម៉ោង)',
    allVenues: 'សាលទាំងអស់',
    month: 'ខែ',
    week: 'សប្តាហ៍',
    day: 'ថ្ងៃ',
    today: 'ថ្ងៃនេះ',
    freeSlot: 'ម៉ោងទំនេរ',
    
    // Pricing Calculator
    calcTitle: 'គណនាតម្លៃងាយស្រួល',
    calcDesc: 'ជ្រើសរើសសាល កំណត់ម៉ោង និងសេវាកម្មបន្ថែមដើម្បីដឹងតម្លៃច្បាស់លាស់។',
    chooseVenue: '១. ជ្រើសរើសសាល',
    dateTimeSchedule: '២. ជ្រើសរើសថ្ងៃ និងម៉ោង',
    resDate: 'ថ្ងៃកម្មវិធី',
    startTime: 'ម៉ោងចាប់ផ្តើម',
    endTime: 'ម៉ោងបញ្ចប់',
    guestCount: '៣. ចំនួនភ្ញៀវចូលរួម',
    productionAmenities: '៤. ជ្រើសរើសសេវាកម្មបន្ថែម (ម្ហូប សំឡេង អេក្រង់)',
    estimatedInvoice: 'សេចក្តីសង្ខេបតម្លៃ',
    totalQuote: 'តម្លៃសរុប:',
    holdNotice: 'អាចចាក់សោម៉ោងទុក ៤៨ ម៉ោងឥតគិតថ្លៃ',
    holdNoticeDesc: 'រក្សាសាល និងតម្លៃនេះទុក ៤៨ ម៉ោងដោយមិនចាំបាច់បង់ប្រាក់ថ្ងៃនេះទេ។',
    placeHoldBtn: 'ចាក់សោម៉ោង ៤៨ម៉ោង (ឥតគិតថ្លៃ)',
    confirmResBtn: 'កក់សាលភ្លាមៗ',
    
    // Holds & Bookings
    myReservationsTitle: 'ការកក់ និងចាក់សោម៉ោងរបស់ខ្ញុំ',
    activeHoldsTab: 'ការចាក់សោម៉ោង (៤៨ម៉ោង)',
    confirmedBookingsTab: 'ការកក់ដែលបានបញ្ជាក់',
    allRecordsTab: 'ប្រវត្តិទាំងអស់',
    extendHold: 'ពន្យារពេល (+២៤ម៉ោង)',
    releaseHold: 'លុបចោលការចាក់សោ',
    confirmLock: 'បញ្ជាក់ការកក់',
    noReservations: 'មិនមានទិន្នន័យកក់នៅឡើយទេ។',
    
    // Admin Portal
    adminPortalTitle: 'ផ្ទាំងគ្រប់គ្រងទូទៅ',
    allReservations: 'ការកក់ទាំងអស់',
    holdsQueue: 'ជួរចាក់សោម៉ោង',
    revenueAnalytics: 'ចំណូល & ស្ថិតិ',
    masterCalendar: 'ប្រតិទិនសរុប',
    accountManager: 'គណនីអ្នកប្រើ',
    addonItems: 'សេវាកម្ម & ឧបករណ៍',
    syncData: 'ទាញយកទិន្នន័យថ្មី',
    connected: 'បានភ្ជាប់',
    activeHolds: 'ការចាក់សោសកម្ម',
    confirmedRevenue: 'ចំណូលបានបញ្ជាក់',
    holdPipeline: 'ការកក់រង់ចាំ',
    venueSpaces: 'សាលសរុប',
    
    // Details Modal
    bookingDetails: 'ព័ត៌មានលម្អិតនៃការកក់',
    venueAndSchedule: 'សាល និងពេលវេលា',
    clientInfo: 'ព័ត៌មានអតិថិជន',
    costBreakdown: 'ការបែងចែកតម្លៃ',
    grandTotal: 'តម្លៃសរុប:',
    approveBooking: 'អនុម័តការកក់',
    releaseHoldBtn: 'លុបចោលការចាក់សោ',
    cancelBooking: 'បោះបង់ការកក់',
    reopenBooking: 'បើកការកក់ឡើងវិញ',
    deleteBooking: 'លុបចេញ',
    
    // Language Meta
    langName: 'ភាសាខ្មែរ',
    langCode: 'KH',
    flag: '🇰🇭'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'km' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, languages: ['en', 'km'] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
