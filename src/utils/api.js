import axios from 'axios';
import useStore from '../../store';

const { getState } = useStore;

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedRequestsQueue = [];

const isAuthRequest = (url) =>
  url?.includes('/api/v1/auth/login') ||
  url?.includes('/api/v1/auth/signup') ||
  url?.includes('/api/v1/auth/refresh');

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry auth requests
    if (isAuthRequest(originalRequest?.url)) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue this request while refresh is happening
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token) => {
              resolve(api(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        // Refresh the token
        await api.post('/api/v1/auth/refresh');
        
        // Token refreshed successfully - process queue
        failedRequestsQueue.forEach((promise) => {
          promise.resolve();
        });
        failedRequestsQueue = [];

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - reject all queued requests
        failedRequestsQueue.forEach((promise) => {
          promise.reject(refreshError);
        });
        failedRequestsQueue = [];
        
        // Clear auth state and redirect
        getState().setIsAuthenticated(false);
        window.location.href = '/logout';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

export default api;