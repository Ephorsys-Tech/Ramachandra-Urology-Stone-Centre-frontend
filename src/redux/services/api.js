import axios from "axios";
import { getAuthToken, setAuthToken, clearAuthToken } from "./tokenService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://ramachandra-urology-stone-centre-backend.onrender.com",
  withCredentials: true,
});

// Request Interceptor: Attach in-memory access token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Token Refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip refreshing if the request was to login or refresh-token itself
    const isAuthRoute =
      originalRequest.url?.includes("/admin/login") ||
      originalRequest.url?.includes("/admin/refresh-token") ||
      originalRequest.url?.includes("/admin/register");

    const status = error.response?.status;
    const isUnauthorizedOrExpired = status === 401 || status === 409;

    if (isUnauthorizedOrExpired && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request new access token using httpOnly cookie
        const res = await axios.post(
          `${api.defaults.baseURL}/admin/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken || null;

        if (newAccessToken) {
          setAuthToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
