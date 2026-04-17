import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});


const isLikelyJwt = (token) => typeof token === 'string' && token.split('.').length === 3;

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('userInfo');
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (isLikelyJwt(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        localStorage.removeItem('userInfo');
      }
    } catch {
      localStorage.removeItem('userInfo');
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    if (status === 401 && (message === 'Not authorized, token failed' || message === 'Not authorized, no token')) {
      localStorage.removeItem('userInfo');
    }
    return Promise.reject(error);
  }
);

export default api;
