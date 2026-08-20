import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    venues: 'Venues',
    calendar: 'Calendar',
    pricing: 'Pricing Quote',
    myHolds: 'My Holds',
    adminPortal: 'Manager Portal',
    bookHold: 'Book / Place Hold',
    switchPersona: 'Switch Persona',
    clientVsAdmin: 'Test client vs venue manager view',
    from: 'From',
    perHour: '/hr',
    guests: 'guests',
    sqft: 'sq ft',
    
    // Hero
    heroBadge: 'Provisional 24–48h Holds · Zero Upfront Fees',
    heroTitle: 'Distinctive Event Halls & Executive Conference Spaces',
    heroDesc: 'Explore luxury venues, check live calendar availability, and freeze calendar slots with provisional 48-hour holds while you finalize your schedule.',
    viewCalendar: 'View Live Calendar',
    instantQuote: 'Instant Price Calculator',
    
    // Highlights
    highlightHold: '48h Free Hold Guarantee',
    highlightOverlap: 'No Double Booking',
    highlightCustom: 'Custom A/V & Catering',
    highlightTransparent: 'Transparent Hourly Pricing',
    
    // Categories & Search
    allSpaces: 'All Spaces',
    ballrooms: 'Ballrooms',
    glassPavilions: 'Glass Pavilions',
    amphitheaters: 'Amphitheaters',
    rooftops: 'Rooftops',
    boardrooms: 'Boardrooms',
    searchPlaceholder: 'Search venue spaces by name or features...',
    
    // Card Actions
    holdBookBtn: 'Hold / Book',
    calendarBtn: 'Calendar',
    
    // Calendar
    calendarTitle: 'Availability Matrix',
    confirmedBooking: 'Confirmed Booking',
    activeHold: 'Active Tentative Hold (48h)',
    allVenues: 'All Venues & Halls',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    today: 'Today',
    freeSlot: 'Free',
    
    // Pricing Calculator
    calcTitle: 'Dynamic Multi-Tier Pricing Calculator',
    calcDesc: 'Real-time estimation accounting for duration, weekend surcharges, and customized hospitality & A/V amenities.',
    chooseVenue: '1. Choose Venue Space',
    dateTimeSchedule: '2. Date & Time Schedule',
    resDate: 'Reservation Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    guestCount: '3. Expected Guest Count',
    productionAmenities: '4. Add-on Production & Hospitality Amenities',
    estimatedInvoice: 'Estimated Line-Item Invoice',
    provisionalSummary: 'Provisional Quote Summary',
    weekendApplied: 'Weekend Multiplier Applied',
    totalQuote: 'Total Estimated Quote:',
    holdNotice: '24–48 Hour Tentative Hold Available',
    holdNoticeDesc: 'Reserve this space and lock in this rate without paying today.',
    placeHoldBtn: 'Place 48h Tentative Hold (No Charge)',
    confirmResBtn: 'Instant Confirmed Reservation',
    
    // Holds & Bookings
    myReservationsTitle: 'My Reservations & Tentative Holds',
    activeHoldsTab: 'Active Tentative Holds',
    confirmedBookingsTab: 'Confirmed Bookings',
    allRecordsTab: 'All Records',
    extendHold: 'Extend Hold (+24h)',
    releaseHold: 'Release Hold',
    confirmLock: 'Confirm & Lock Space',
    noReservations: 'No Reservations in this category',
    
    // Admin
    adminPortalTitle: 'Venue Manager Command Portal',
    pendingHoldsQueue: 'Pending Holds Queue',
    analyticsTab: 'Occupancy & Revenue Analytics',
    allReservationsTab: 'All Reservations',
    managerActions: 'Manager Actions',
    approve: 'Approve',
    release: 'Release',
    occupancyRate: 'Overall Occupancy Rate',
    confirmedRevenue: 'Confirmed Revenue',
    projectedPipeline: 'Projected Pipeline',
    conversionRate: 'Hold Conversion Rate',
    
    // Language Meta
    langName: 'English',
    langCode: 'EN',
    flag: '🇺🇸'
  },

  km: {
    // Navigation
    venues: 'សាលប្រជុំ & ទីកន្លែង',
    calendar: 'កាលវិភាគ',
    pricing: 'គណនាតម្លៃ',
    myHolds: 'ការកក់របស់ខ្ញុំ',
    adminPortal: 'ផ្ទាំងគ្រប់គ្រង',
    bookHold: 'កក់ / ចាក់សោម៉ោង',
    switchPersona: 'ប្តូរអ្នកប្រើប្រាស់',
    clientVsAdmin: 'សាកល្បងមើលជាអតិថិជន ឬអ្នកគ្រប់គ្រង',
    from: 'ចាប់ពី',
    perHour: '/ម៉ោង',
    guests: 'នាក់',
    sqft: 'ហ្វីតការ៉េ',
    
    // Hero
    heroBadge: 'ចាក់សោម៉ោងបណ្តោះអាសន្ន ២៤–៤៨ម៉ោង · មិនគិតថ្លៃជាមុន',
    heroTitle: 'សាលប្រជុំ និងទីកន្លែងរៀបចំកម្មវិធីកម្រិតស្តង់ដារខ្ពស់',
    heroDesc: 'ជ្រើសរើសសាលប្រជុំប្រណីតៗ ពិនិត្យកាលវិភាគទំនេរផ្ទាល់ និងចាក់សោម៉ោងទុកមុន ៤៨ ម៉ោងដោយមិនចាំបាច់បង់ប្រាក់ភ្លាមៗ។',
    viewCalendar: 'មើលកាលវិភាគទំនេរ',
    instantQuote: 'គណនាតម្លៃភ្លាមៗ',
    
    // Highlights
    highlightHold: 'សិទ្ធិចាក់សោម៉ោង ៤៨ម៉ោងឥតគិតថ្លៃ',
    highlightOverlap: 'ការពារការកក់ជាន់ម៉ោងគ្នា',
    highlightCustom: 'សេវាសំឡេង ពន្លឺ និងម្ហូបអាហារ',
    highlightTransparent: 'តម្លៃច្បាស់លាស់តាមម៉ោង',
    
    // Categories & Search
    allSpaces: 'គ្រប់ទីកន្លែងទាំងអស់',
    ballrooms: 'សាលរៀបអាពាហ៍ពិពាហ៍/ពិធីធំ',
    glassPavilions: 'សាលកញ្ចក់ទេសភាព',
    amphitheaters: 'សាលសិក្ខាសាលាធំ',
    rooftops: 'ដំបូលអគារទេសភាព',
    boardrooms: 'បន្ទប់ប្រជុំថ្នាក់ដឹកនាំ',
    searchPlaceholder: 'ស្វែងរកសាលតាមឈ្មោះ ឬលក្ខណៈពិសេស...',
    
    // Card Actions
    holdBookBtn: 'ចាក់សោ / កក់',
    calendarBtn: 'កាលវិភាគ',
    
    // Calendar
    calendarTitle: 'តារាងកាលវិភាគទំនេរ',
    confirmedBooking: 'ការកក់បានបញ្ជាក់',
    activeHold: 'កំពុងចាក់សោម៉ោង (៤៨ម៉ោង)',
    allVenues: 'សាល និងទីកន្លែងទាំងអស់',
    month: 'ខែ',
    week: 'សប្តាហ៍',
    day: 'ថ្ងៃ',
    today: 'ថ្ងៃនេះ',
    freeSlot: 'ទំនេរ',
    
    // Pricing Calculator
    calcTitle: 'ប្រព័ន្ធគណនាតម្លៃឆ្លាតវៃ',
    calcDesc: 'គណនាតម្លៃតាមចំនួនម៉ោង តម្លៃបន្ថែមចុងសប្តាហ៍ និងសម្ភារបច្ចេកវិទ្យាបន្ថែម។',
    chooseVenue: '១. ជ្រើសរើសសាលប្រជុំ',
    dateTimeSchedule: '២. កាលបរិច្ឆេទ និងពេលវេលា',
    resDate: 'កាលបរិច្ឆេទកម្មវិធី',
    startTime: 'ម៉ោងចាប់ផ្តើម',
    endTime: 'ម៉ោងបញ្ចប់',
    guestCount: '៣. ចំនួនភ្ញៀវចូលរួម',
    productionAmenities: '៤. សេវាកម្ម និងឧបករណ៍បន្ថែម',
    estimatedInvoice: 'វិក្កយបត្រប៉ាន់ស្មានលម្អិត',
    provisionalSummary: 'សេចក្តីសង្ខេបតម្លៃប៉ាន់ស្មាន',
    weekendApplied: 'បានគិតអត្រាចុងសប្តាហ៍',
    totalQuote: 'តម្លៃប៉ាន់ស្មានសរុប:',
    holdNotice: 'អាចចាក់សោម៉ោងទុក ២៤–៤៨ ម៉ោង',
    holdNoticeDesc: 'រក្សាសាល និងតម្លៃនេះទុកដោយមិនចាំបាច់បង់ប្រាក់ថ្ងៃនេះ។',
    placeHoldBtn: 'ចាក់សោម៉ោង ៤៨ម៉ោង (ឥតគិតថ្លៃ)',
    confirmResBtn: 'បញ្ជាក់ការកក់ភ្លាមៗ',
    
    // Holds & Bookings
    myReservationsTitle: 'បញ្ជីកក់ និងចាក់សោម៉ោងរបស់ខ្ញុំ',
    activeHoldsTab: 'ការចាក់សោម៉ោងសកម្ម',
    confirmedBookingsTab: 'ការកក់ដែលបានបញ្ជាក់',
    allRecordsTab: 'កំណត់ត្រាទាំងអស់',
    extendHold: 'ពន្យារពេល (+២៤ម៉ោង)',
    releaseHold: 'លុបចោលការចាក់សោ',
    confirmLock: 'បញ្ជាក់ការកក់សាល',
    noReservations: 'មិនមានការកក់ក្នុងប្រភេទនេះទេ',
    
    // Admin
    adminPortalTitle: 'ផ្ទាំងគ្រប់គ្រងសាលប្រជុំ',
    pendingHoldsQueue: 'ជួរការចាក់សោម៉ោងរង់ចាំពិនិត្យ',
    analyticsTab: 'ស្ថិតិអត្រាប្រើប្រាស់ និងចំណូល',
    allReservationsTab: 'ការកក់ទាំងអស់ក្នុងប្រព័ន្ធ',
    managerActions: 'សកម្មភាពគ្រប់គ្រង',
    approve: 'អនុម័ត',
    release: 'ដោះលែងម៉ោង',
    occupancyRate: 'អត្រាប្រើប្រាស់សាលសរុប',
    confirmedRevenue: 'ចំណូលបានបញ្ជាក់',
    projectedPipeline: 'ចំណូលរំពឹងទុកពីការចាក់សោ',
    conversionRate: 'អត្រាប្តូរទៅជាការកក់ពិត',
    
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
