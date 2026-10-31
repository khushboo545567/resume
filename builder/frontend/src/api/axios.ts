import axios, { type InternalAxiosRequestConfig } from "axios";

import { AUTH_API_URL } from "../config/auth.config";
import { queryClient } from "../lib/react-query";

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
            return Promise.reject(error);
          }
        }
        // Refresh failed for a non-definitive reason (network error / 5xx): surface THAT
        // error instead of the original 401, so callers don't mistake it for a logout.
        return Promise.reject(refreshError);
      }
    },
  );
};

attachRefreshInterceptor(api);
attachRefreshInterceptor(authApi);

/* ------------------------------------------------------------------ */
/* AI credits                                                          */
/* ------------------------------------------------------------------ */

/** Query key for the user's credit balances (see features/pricing/hooks/useCredits). */
export const CREDITS_QUERY_KEY = ["credits"] as const;

/** Fired when the server answers 402: the user has no credits for that AI action. */
export const CREDITS_REQUIRED_EVENT = "credits:required";

export interface CreditsRequiredDetail {
  message: string;
  /** Which pricing tab and (for interviews) question count to open. */
  tab: "resume" | "cover-letter" | "interview" | "ats";
  questions?: 5 | 10 | 15;
}

/** True when an error is the server's "no credits left" answer (HTTP 402). */
export const isOutOfCreditsError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 402;

const NO_CREDITS_FALLBACK =
  "You have no AI credits left for this action. Buy a pack to continue.";

const toCreditsDetail = (error: {
  config?: InternalAxiosRequestConfig;
  response?: { data?: { message?: unknown } };
}): CreditsRequiredDetail => {
  const url = error.config?.url ?? "";
  const message =
    typeof error.response?.data?.message === "string"
      ? error.response.data.message
      : NO_CREDITS_FALLBACK;

  if (url.includes("cover-letter")) return { message, tab: "cover-letter" };
  if (url.includes("/ats/")) return { message, tab: "ats" };

  if (url.includes("/interview/")) {
    let questions: CreditsRequiredDetail["questions"];
    try {
      const body = JSON.parse(String(error.config?.data ?? "{}"));
      if ([5, 10, 15].includes(body?.totalQuestions)) {
        questions = body.totalQuestions;
      }
    } catch {
      // Body was not JSON: just open the interview tab.
    }
    return { message, tab: "interview", questions };
  }

  return { message, tab: "resume" };
};

// 402 -> ask the app to show the "buy credits" prompt (see OutOfCreditsModal).
// Success on an AI route -> the balance changed, so refresh it.
api.interceptors.response.use(
  (response) => {
    const url = response.config.url ?? "";
    const isPost = response.config.method === "post";
    const spentCredit =
      isPost &&
      (url.startsWith("/ai/") ||
        url === "/interview/start" ||
        url === "/ats/analyze" ||
        url.endsWith("/upload-and-parse"));

    if (spentCredit) {
      void queryClient.invalidateQueries({ queryKey: CREDITS_QUERY_KEY });
    }

    return response;
  },
  (error) => {
    if (isOutOfCreditsError(error)) {
      window.dispatchEvent(
        new CustomEvent<CreditsRequiredDetail>(CREDITS_REQUIRED_EVENT, {
          detail: toCreditsDetail(error),
        }),
      );
    }
    return Promise.reject(error);
  },
);

export default api;
