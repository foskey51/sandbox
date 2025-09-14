import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL
});

let refreshTries = 0;
let isRefreshing = false;
let failedQueue = [];

// Helper to process queued requests once refresh is done
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Skip login and signup endpoints
    if (
      originalRequest?.url?.includes('/auth/v1/login') ||
      originalRequest?.url?.includes('/auth/v1/signup')
    ) {
      return Promise.reject(error);
    }

    // If unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (refreshTries >= 3) {
        // Too many failures -> logout
        await api.post('/auth/v1/logout');
        window.location.href = '/logout';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests while refresh is happening
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      refreshTries++;

      try {
        await api.post('/auth/v1/refreshToken'); // refresh access token (cookie updated by server)
        processQueue(null);
        return api(originalRequest); // retry the original request
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (refreshTries >= 3) {
          await api.post('/auth/v1/logout');
          window.location.href = '/logout';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
