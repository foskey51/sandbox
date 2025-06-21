import axios from 'axios';
import useStore from '../../store';

const baseURL = import.meta.env.VITE_SERVER_URL + '/auth/v1';

const api = axios.create({
  baseURL,
  withCredentials: true, 
});

let refreshing = null;

api.interceptors.response.use(
  res => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = api.post('/refreshToken')
          .catch(async () => {
            // Logout fallback
            await api.post('/logout');
            useStore.getState().setIsAuthenticated(false);
            window.location.href = '/';
          })
          .finally(() => {
            refreshing = null;
          });
      }

      await refreshing;
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;