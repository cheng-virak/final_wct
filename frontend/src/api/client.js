const API_BASE = '/api';

async function request(endpoint, options = {}) {
  // Determine token based on whether running in Admin portal or Client portal
  const isAdminPortal = typeof window !== 'undefined' && window.location.pathname.includes('admin');
  const token = isAdminPortal
    ? (localStorage.getItem('venue_admin_token') || localStorage.getItem('venue_auth_token'))
    : (localStorage.getItem('venue_client_token') || localStorage.getItem('venue_auth_token'));

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }
  return data;
}

export const api = {
  // Venues
  getVenues: () => request('/venues'),
  getVenueById: (id) => request(`/venues/${id}`),

  // Amenities
  getAmenities: () => request('/amenities'),

  // Bookings & Holds
  getBookings: (params = {}) => {
    const query = new URLSearchParams();
    if (params.venue_id) query.append('venue_id', params.venue_id);
    if (params.user_id) query.append('user_id', params.user_id);
    if (params.status) query.append('status', params.status);
    if (params.active_only) query.append('active_only', 'true');
    return request(`/bookings?${query.toString()}`);
  },
  
  checkAvailability: (venue_id, start_time, end_time, exclude_id) =>
    request('/bookings/check-availability', {
      method: 'POST',
      body: JSON.stringify({ venue_id, start_time, end_time, exclude_id })
    }),

  getQuote: (quoteData) =>
    request('/bookings/quote', {
      method: 'POST',
      body: JSON.stringify(quoteData)
    }),

  createBooking: (bookingData) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }),

  updateBookingStatus: (id, status) =>
    request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  extendHold: (id, additional_hours = 24) =>
    request(`/bookings/${id}/extend-hold`, {
      method: 'POST',
      body: JSON.stringify({ additional_hours })
    }),

  deleteBooking: (id) =>
    request(`/bookings/${id}`, {
      method: 'DELETE'
    }),

  // Concierge Calls
  requestCall: (callData) =>
    request('/calls/request', {
      method: 'POST',
      body: JSON.stringify(callData)
    }),

  getCalls: () => request('/calls'),

  // Analytics
  getAnalytics: () => request('/analytics'),

  // Notifications
  getNotifications: (params = {}) => {
    const query = new URLSearchParams();
    if (params.user_id) query.append('user_id', params.user_id);
    if (params.email) query.append('email', params.email);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/notifications${qs}`);
  },
  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: 'PATCH'
    }),
  markAllNotificationsRead: (userId) =>
    request('/notifications/mark-all-read', {
      method: 'PATCH',
      body: JSON.stringify({ user_id: userId })
    }),

  // Auth & Account Management
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  getProfile: () => request('/auth/me'),
  getDemoUsers: () => request('/auth/demo-users'),

  getUsers: () => request('/auth/users'),
  createUser: (userData) =>
    request('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  updateUser: (id, userData) =>
    request(`/auth/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData)
    }),
  deleteUser: (id) =>
    request(`/auth/users/${id}`, {
      method: 'DELETE'
    })
};
