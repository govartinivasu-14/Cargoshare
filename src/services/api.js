import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api', timeout: 20000 });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cargoshare_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data) {
    config.data = { ...config.data };
    for (const key of ['departureDate', 'arrivalDate', 'cutoffDate']) {
      if (key in config.data) config.data[key] = config.data[key] ? (config.data[key].length === 10 ? config.data[key] + 'T00:00:00' : config.data[key]) : null;
    }
    for (const key of ['bookingId', 'containerId', 'receiverId']) {
      if (config.data[key]) config.data[key] = Number(String(config.data[key]).replace(/\D/g, ''));
    }
  }
  return config;
});
api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401 && !error.config.url.startsWith('/auth/')) {
    localStorage.removeItem('cargoshare_token'); localStorage.removeItem('cargoshare_user');
    window.location.assign('/login');
  }
  return Promise.reject(error);
});
export default api;
