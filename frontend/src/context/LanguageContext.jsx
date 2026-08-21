import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation & Brand
    hotelBrand: 'Grand Horizon Hotel & Resort',
    roomsSuites: 'Rooms & Suites',
    calendar: 'Room Availability',
    pricing: 'Price Calculator',
    myBookings: 'My Bookings & Holds',
    adminPortal: 'Front Desk & Admin',
    bookRoom: 'Book / Hold Room',
    from: 'From',
    perNight: '/night',
    guests: 'guests',
    sqft: 'sq.ft',
    beds: 'beds',
    
    // Top Hero
    heroBadge: '48-Hour Free Room Hold · $0 Deposit Today',
    heroTitle: 'Luxury Hotel Rooms, Suites & Private Villas',
    heroDesc: 'Experience 5-star oceanfront comfort. Check open dates, calculate nightly rates, and hold your room for 48 hours for free while you finalize your travel plans.',
    viewCalendar: 'Check Room Dates',
    instantQuote: 'Calculate Total Price',
    
    // Highlights
    highlightHold: '48-Hour Free Room Hold',
    highlightOverlap: '100% Guaranteed Booking',
    highlightCustom: 'Breakfast, Spa & Airport Shuttle',
    highlightTransparent: 'Clear Nightly Rates (No Hidden Fees)',
    
    // Categories
    allRooms: 'All Rooms & Suites',
    oceanSuites: 'Ocean Suites',
    penthouses: 'Penthouses',
    poolVillas: 'Pool Villas',
    deluxeRooms: 'Deluxe Rooms',
    familySuites: 'Family Suites',
    searchPlaceholder: 'Search by room name, bed type, or view...',
    
    // Actions
    holdRoomBtn: 'Hold / Book Room',
    checkDatesBtn: 'Check Dates',
    
    // Calendar
    calendarTitle: 'Hotel Room Availability Calendar',
    confirmedBooking: 'Confirmed Guest',
    activeHold: '48-Hour Room Hold',
    allVenues: 'All Rooms & Suites',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    today: 'Today',
    freeSlot: 'Available Room',
    
    // Pricing Calculator
    calcTitle: 'Hotel Stay Price Calculator',
    calcDesc: 'Choose your room or suite, select check-in & check-out dates, and pick add-on hotel services.',
    chooseVenue: '1. Select Room or Suite',
    dateTimeSchedule: '2. Check-in & Check-out Dates',
    checkInDate: 'Check-in Date',
    checkOutDate: 'Check-out Date',
    nightsCount: 'Total Nights:',
    guestCount: '3. Number of Guests (Adults & Children)',
    productionAmenities: '4. Hotel Add-on Services (Breakfast, Spa, VIP Airport Shuttle)',
    estimatedInvoice: 'Room Rate & Invoice Breakdown',
    totalQuote: 'Grand Total Price:',
    holdNotice: '48-Hour Free Room Hold Available',
    holdNoticeDesc: 'Lock in this room and price for 48 hours with zero upfront deposit.',
    placeHoldBtn: 'Hold Room for 48 Hours (Free)',
    confirmResBtn: 'Book Room Now',
    
    // Holds & Bookings
    myReservationsTitle: 'My Hotel Bookings & Room Holds',
    activeHoldsTab: 'Active Room Holds (48h)',
    confirmedBookingsTab: 'Confirmed Stays',
    allRecordsTab: 'All Stay History',
    extendHold: 'Extend Hold (+24h)',
    releaseHold: 'Cancel Hold',
    confirmLock: 'Confirm Booking',
    noReservations: 'No hotel bookings found.',
    
    // Admin & Front Desk Portal
    adminPortalTitle: 'Hotel Front Desk & Manager Portal',
    allReservations: 'All Hotel Bookings',
    holdsQueue: 'Room Holds Queue',
    revenueAnalytics: 'Room Revenue & Occupancy',
    masterCalendar: 'Front Desk Calendar',
    accountManager: 'Guest & Staff Accounts',
    addonItems: 'Hotel Services & Amenities',
    syncData: 'Sync Live Data',
    connected: 'MongoDB Connected',
    activeHolds: 'Active Room Holds',
    confirmedRevenue: 'Room Revenue',
    holdPipeline: 'Pending Room Holds',
    venueSpaces: 'Total Hotel Rooms',
    
    // Details Modal
    bookingDetails: 'Hotel Reservation Details',
    venueAndSchedule: 'Room & Stay Dates',
    clientInfo: 'Guest Information',
    costBreakdown: 'Stay Price Breakdown',
    grandTotal: 'Grand Total:',
    approveBooking: 'Approve & Confirm Stay',
    releaseHoldBtn: 'Release Room Hold',
    cancelBooking: 'Cancel Reservation',
    reopenBooking: 'Reopen Reservation',
    deleteBooking: 'Delete',
    
    // Language Meta
    langName: 'English',
    langCode: 'EN',
    flag: '🇺🇸'
  },

  km: {
    // Navigation & Brand
    hotelBrand: 'សណ្ឋាគារ & រមណីយដ្ឋាន Grand Horizon',
    roomsSuites: 'បន្ទប់ & វីឡា',
    calendar: 'កាលវិភាគបន្ទប់ទំនេរ',
    pricing: 'គណនាតម្លៃស្នាក់នៅ',
    myBookings: 'ការកក់របស់ខ្ញុំ',
    adminPortal: 'បញ្ជរបម្រើការ & គ្រប់គ្រង',
    bookRoom: 'កក់ ឬចាក់សោបន្ទប់',
    from: 'ចាប់ពី',
    perNight: '/យប់',
    guests: 'នាក់',
    sqft: 'ហ្វីតការ៉េ',
    beds: 'គ្រែ',
    
    // Top Hero
    heroBadge: 'ចាក់សោបន្ទប់ ៤៨ម៉ោងឥតគិតថ្លៃ · មិនបាច់កក់ប្រាក់មុន',
    heroTitle: 'បន្ទប់សណ្ឋាគារប្រណីត បន្ទប់ស៊ូត & វីឡាអាងហែលទឹក',
    heroDesc: 'ទទួលបានបទពិសោធន៍ស្នាក់នៅលំដាប់ផ្កាយ ៥។ ពិនិត្យថ្ងៃទំនេរ គណនាតម្លៃក្នុងមួយយប់ និងចាក់សោបន្ទប់ទុក ៤៨ ម៉ោងដោយឥតគិតថ្លៃ។',
    viewCalendar: 'មើលថ្ងៃបន្ទប់ទំនេរ',
    instantQuote: 'គណនាតម្លៃសរុប',
    
    // Highlights
    highlightHold: 'ចាក់សោបន្ទប់ ៤៨ម៉ោងឥតគិតថ្លៃ',
    highlightOverlap: 'ធានាបន្ទប់ ១០០% មិនជាន់គ្នា',
    highlightCustom: 'អាហារប៊ូហ្វេ ស្ប៉ា & ឡានទទួលព្រលាន',
    highlightTransparent: 'តម្លៃច្បាស់លាស់ក្នុង១យប់',
    
    // Categories
    allRooms: 'បន្ទប់ទាំងអស់',
    oceanSuites: 'បន្ទប់ស៊ូតទេសភាពសមុទ្រ',
    penthouses: 'បន្ទប់ផេនហោស៍ (Penthouse)',
    poolVillas: 'វីឡាអាងហែលទឹក',
    deluxeRooms: 'បន្ទប់ឌីឡាក់ស៍ (Deluxe)',
    familySuites: 'បន្ទប់គ្រួសារ',
    searchPlaceholder: 'ស្វែងរកតាមឈ្មោះបន្ទប់ ប្រភេទគ្រែ ឬទេសភាព...',
    
    // Actions
    holdRoomBtn: 'ចាក់សោ / កក់បន្ទប់',
    checkDatesBtn: 'ពិនិត្យថ្ងៃទំនេរ',
    
    // Calendar
    calendarTitle: 'ប្រតិទិនបន្ទប់សណ្ឋាគារទំនេរ',
    confirmedBooking: 'ភ្ញៀវបានបញ្ជាក់ការកក់',
    activeHold: 'កំពុងចាក់សោបន្ទប់ (៤៨ម៉ោង)',
    allVenues: 'បន្ទប់ និងវីឡាទាំងអស់',
    month: 'ខែ',
    week: 'សប្តាហ៍',
    day: 'ថ្ងៃ',
    today: 'ថ្ងៃនេះ',
    freeSlot: 'បន្ទប់ទំនេរ',
    
    // Pricing Calculator
    calcTitle: 'ប្រព័ន្ធគណនាតម្លៃបន្ទប់ស្នាក់នៅ',
    calcDesc: 'ជ្រើសរើសបន្ទប់ កំណត់ថ្ងៃចូលគេង និងថ្ងៃចេញ និងជ្រើសរើសសេវាកម្មសណ្ឋាគារបន្ថែម។',
    chooseVenue: '១. ជ្រើសរើសបន្ទប់ ឬវីឡា',
    dateTimeSchedule: '២. ថ្ងៃចូលគេង (Check-in) & ថ្ងៃចេញ (Check-out)',
    checkInDate: 'ថ្ងៃចូលគេង',
    checkOutDate: 'ថ្ងៃចេញ',
    nightsCount: 'ចំនួនយប់សរុប:',
    guestCount: '៣. ចំនួនភ្ញៀវស្នាក់នៅ (មនុស្សធំ & កុមារ)',
    productionAmenities: '៤. សេវាកម្មបន្ថែម (អាហារពេលព្រឹក, ស្ប៉ា, ឡានទទួលព្រលានយន្តហោះ)',
    estimatedInvoice: 'វិក្កយបត្រតម្លៃស្នាក់នៅលម្អិត',
    totalQuote: 'តម្លៃសរុបទាំងអស់:',
    holdNotice: 'អាចចាក់សោបន្ទប់ទុក ៤៨ ម៉ោងឥតគិតថ្លៃ',
    holdNoticeDesc: 'រក្សាបន្ទប់ និងតម្លៃនេះទុក ៤៨ ម៉ោងដោយមិនចាំបាច់បង់ប្រាក់ថ្ងៃនេះទេ។',
    placeHoldBtn: 'ចាក់សោបន្ទប់ ៤៨ម៉ោង (ឥតគិតថ្លៃ)',
    confirmResBtn: 'កក់បន្ទប់ភ្លាមៗ',
    
    // Holds & Bookings
    myReservationsTitle: 'បញ្ជីកក់បន្ទប់ និងចាក់សោម៉ោងរបស់ខ្ញុំ',
    activeHoldsTab: 'ការចាក់សោបន្ទប់ (៤៨ម៉ោង)',
    confirmedBookingsTab: 'ការស្នាក់នៅបានបញ្ជាក់',
    allRecordsTab: 'ប្រវត្តិស្នាក់នៅទាំងអស់',
    extendHold: 'ពន្យារពេល (+២៤ម៉ោង)',
    releaseHold: 'លុបចោលការចាក់សោ',
    confirmLock: 'បញ្ជាក់ការកក់បន្ទប់',
    noReservations: 'មិនមានប្រវត្តិការកក់បន្ទប់នៅឡើយទេ។',
    
    // Admin & Front Desk Portal
    adminPortalTitle: 'ផ្ទាំងគ្រប់គ្រងសណ្ឋាគារ & បញ្ជរបម្រើការ',
    allReservations: 'ការកក់បន្ទប់ទាំងអស់',
    holdsQueue: 'ជួរចាក់សោបន្ទប់',
    revenueAnalytics: 'ចំណូល & អត្រាស្នាក់នៅ',
    masterCalendar: 'ប្រតិទិនបន្ទប់សរុប',
    accountManager: 'គណនីភ្ញៀវ & បុគ្គលិក',
    addonItems: 'សេវាកម្មសណ្ឋាគារ',
    syncData: 'ទាញយកទិន្នន័យថ្មី',
    connected: 'បានភ្ជាប់ MongoDB',
    activeHolds: 'បន្ទប់កំពុងចាក់សោ',
    confirmedRevenue: 'ចំណូលបន្ទប់បានបញ្ជាក់',
    holdPipeline: 'តម្លៃបន្ទប់រង់ចាំ',
    venueSpaces: 'បន្ទប់សរុប',
    
    // Details Modal
    bookingDetails: 'ព័ត៌មានលម្អិតនៃការកក់បន្ទប់',
    venueAndSchedule: 'បន្ទប់ និងកាលបរិច្ឆេទស្នាក់នៅ',
    clientInfo: 'ព័ត៌មានភ្ញៀវ',
    costBreakdown: 'ការបែងចែកតម្លៃស្នាក់នៅ',
    grandTotal: 'តម្លៃសរុប:',
    approveBooking: 'អនុម័ត & បញ្ជាក់ការស្នាក់នៅ',
    releaseHoldBtn: 'ដោះលែងបន្ទប់',
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
