import axios, { type InternalAxiosRequestConfig } from "axios";

import { AUTH_API_URL } from "../config/auth.config";

// The session lives in httpOnly cookies set by the Throne8 backend on `.throne8.com`.
// The browser attaches them automatically (withCredentials). JavaScript never sees a token.
//
// CSRF: the backend only honours the cookies on POST/PUT/PATCH/DELETE when this header
// is present (a cross-site page cannot add it).
const CSRF_HEADERS = { "X-Requested-With": "XMLHttpRequest" };

// Resume API  (…/api/v1/resume-builder)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: CSRF_HEADERS,
});

// Throne8 auth API  (…/api/v1/auth)
export const authApi = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
  headers: CSRF_HEADERS,
});

/** Fired when the session could not be renewed; the auth store listens and logs out. */
export const SESSION_EXPIRED_EVENT = "auth:session-expired";

const REFRESH_PATH = "/auth/refresh-token";
const NO_REFRESH_PATHS = [REFRESH_PATH, "/auth/logout"];

// One refresh at a time in this tab. (The backend also tolerates a short overlap
// between Throne8 tabs and this app, because Web Locks cannot span two origins.)
let refreshPromise: Promise<void> | null = null;

const refreshSession = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = authApi
      .post(REFRESH_PATH, {})
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const attachRefreshInterceptor = (instance: typeof api) => {
  instance.interceptors.response.use(
    (response) => response,

    async (error) => {
      const original = error.config as RetryableConfig | undefined;

      if (
        !original ||
        error.response?.status !== 401 ||
        original._retry ||
        NO_REFRESH_PATHS.some((path) => original.url?.includes(path))
      ) {
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        // Access cookie expired (15 min): renew it with the refresh cookie, then retry once.
        await refreshSession();
        return instance(original);
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          const status = refreshError.response?.status;
          // Only a definitive "no valid session" ends the session (not network errors / 5xx).
          if (status === 400 || status === 401 || status === 403) {
            window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
          }
        }
        return Promise.reject(error);
      }
    },
  );
};

attachRefreshInterceptor(api);
attachRefreshInterceptor(authApi);

export default api;
