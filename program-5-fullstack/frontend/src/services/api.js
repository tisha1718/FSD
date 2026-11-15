const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('parkify_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Request failed`);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: () => request('/auth/profile', { method: 'GET' }),
  updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  // Locations
  getLocations: () => request('/locations', { method: 'GET' }),
  getLocationById: (id) => request(`/locations/${id}`, { method: 'GET' }),
  createLocation: (payload) => request('/locations', { method: 'POST', body: JSON.stringify(payload) }),
  updateLocation: (id, payload) => request(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteLocation: (id) => request(`/locations/${id}`, { method: 'DELETE' }),

  // Slots
  getSlotsByLocation: (locationId) => request(`/slots/location/${locationId}`, { method: 'GET' }),
  createSlot: (payload) => request('/slots', { method: 'POST', body: JSON.stringify(payload) }),
  updateSlot: (id, payload) => request(`/slots/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSlot: (id) => request(`/slots/${id}`, { method: 'DELETE' }),

  // Bookings
  getMyBookings: () => request('/bookings/my-bookings', { method: 'GET' }),
  getBookingById: (id) => request(`/bookings/${id}`, { method: 'GET' }),
  createBooking: (payload) => request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PUT' }),

  // Admin
  getAdminAnalytics: () => request('/admin/analytics', { method: 'GET' }),
  getAllBookings: () => request('/admin/bookings', { method: 'GET' }),
  updateBookingStatus: (id, status) => request(`/admin/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getAllUsers: () => request('/admin/users', { method: 'GET' })
};
