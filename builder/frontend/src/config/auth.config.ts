// Auth is owned by Throne8 (login, signup, session cookies). This app only
// reads the shared session cookie that the Throne8 backend sets on `.throne8.com`.

const trimSlash = (value?: string): string => (value ?? "").replace(/\/+$/, "");

// Resume API, e.g. https://api.throne8.com/api/v1/resume-builder
const RESUME_API_URL = trimSlash(import.meta.env.VITE_API_URL);

// Throne8 auth API (profile / refresh-token / logout), e.g. https://api.throne8.com/api/v1
// Defaults to the resume API URL without its trailing "/resume-builder".
export const AUTH_API_URL =
  trimSlash(import.meta.env.VITE_AUTH_API_URL) ||
  RESUME_API_URL.replace(/\/resume-builder$/, "");

// Throne8 web app, e.g. https://throne8.com
export const THRONE8_URL =
  trimSlash(import.meta.env.VITE_THRONE8_URL) ||
  (import.meta.env.DEV ? "http://localhost:3000" : "https://throne8.com");

const LOGIN_REDIRECT_KEY = "throne8_login_redirect_at";
const LOGIN_REDIRECT_COOLDOWN_MS = 10_000;

/**
 * Send the user to the Throne8 login page and bring them back here afterwards.
 *
 * Returns false when we already redirected a moment ago. That means we came back
 * from Throne8 and STILL have no session (for example the cookie is not shared on this
 * domain), so redirecting again would loop forever.
 */
/** True when we sent the user to Throne8 login a moment ago. */
export function isLoginRedirectCoolingDown(): boolean {
  try {
    const last = Number(sessionStorage.getItem(LOGIN_REDIRECT_KEY) || 0);
    return Date.now() - last < LOGIN_REDIRECT_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function redirectToLogin(returnTo: string = window.location.href): boolean {
  if (isLoginRedirectCoolingDown()) return false;

  try {
    sessionStorage.setItem(LOGIN_REDIRECT_KEY, String(Date.now()));
  } catch {
    /* sessionStorage unavailable: just redirect */
  }

  window.location.replace(
    `${THRONE8_URL}/login?redirect=${encodeURIComponent(returnTo)}`,
  );
  return true;
}

/** Throne8 signup page (old /register links land here). */
export function redirectToSignup(): void {
  window.location.replace(`${THRONE8_URL}/signup`);
}
