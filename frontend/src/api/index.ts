import axios from 'axios';
import { baseURL } from '../constants/api';

const instance = axios.create({
  withCredentials: true,
  baseURL: baseURL,
  headers: {},
});

instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await instance.post('auth/refresh');
        const accessToken = response.data.data.access_token;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
      }
    }

    return Promise.reject(error);
  }
);

export { instance };
