import axios from "axios";

import { BACKEND_URL } from "../config/config";
import { useAuthStore } from "@/stores/useAuthStore";

export const Api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      const authStore = useAuthStore();
      authStore.logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return Api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const authStore = useAuthStore();

    try {
      const refreshed = await authStore.refresh();
      const newToken = refreshed.accessToken;

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      processQueue(null, newToken);

      return Api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      authStore.logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
