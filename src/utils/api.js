import axios from 'axios';
import useStore from '../../store';

const { getState } = useStore;

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedRequestsQueue = [];
let skipNextRequests = false;

const isAuthRequest = (url) =>
  url?.includes('/api/v1/auth/login') ||
  url?.includes('/api/v1/auth/signup') ||
  url?.includes('/api/v1/auth/refresh');

api.interceptors.response.use(
  (response) => {
    if (isAuthRequest(response.config.url)) {
      skipNextRequests = true;
      setTimeout(() => {
        skipNextRequests = false;
      }, 1000);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (isAuthRequest(originalRequest.url) || skipNextRequests) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        await api.post('/api/v1/auth/refresh');

        failedRequestsQueue.forEach(({ resolve, config }) => {
          config._retry = false;
          resolve(api(config));
        });
        failedRequestsQueue = [];
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];
        isRefreshing = false;

        getState().setIsAuthenticated(false);

        return Promise.reject(refreshError);
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
