import axios from 'axios';

// -----------------------------------------------------------------
// Why a single Axios instance?
// We set the baseURL here once. Every API file just calls
// api.get('/skills') instead of the full URL every time.
// The interceptor auto-attaches the JWT from localStorage to
// every request — we never have to think about it again.
// -----------------------------------------------------------------
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Request interceptor — runs before EVERY request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — if the server returns 401 (token expired),
// clear the stale token so the user is redirected to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
