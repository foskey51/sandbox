import axios from 'axios';
import useStore from '../../store';

const { getState } = useStore;

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true
});

let isRefreshing = false;
let failedRequestsQueue = [];

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post('/api/v1/auth/refresh', {});

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

        if (originalRequest) originalRequest._retry = false;

        getState().setIsAuthenticated(false);

        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }

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
