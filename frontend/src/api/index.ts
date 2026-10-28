import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { baseURL } from '../constants/api';
import type { IApiResponse } from '../types/api';

// Токены хранятся в HttpOnly-cookie, которые ставит бэкенд, поэтому достаточно withCredentials
const instance = axios.create({
  withCredentials: true,
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// На этих эндпоинтах 401 означает неверные данные, а не истёкшую сессию
const noRefreshUrls = ['auth/login', 'auth/register', 'auth/refresh', 'auth/logout'];

// Один общий refresh на все запросы, одновременно получившие 401
let refreshRequest: Promise<unknown> | null = null;

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !noRefreshUrls.includes(originalRequest.url ?? '')
    ) {
      originalRequest._retry = true;

      try {
        refreshRequest ??= instance.post('auth/refresh').finally(() => {
          refreshRequest = null;
        });
        await refreshRequest;

        return instance(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Достаёт полезные данные из ответа бэкенда
const unwrap = <T>(request: Promise<AxiosResponse<IApiResponse<T>>>): Promise<T> =>
  request.then((response) => response.data.result);

export { instance, unwrap };
