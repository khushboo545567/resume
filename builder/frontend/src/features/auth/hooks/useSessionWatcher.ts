import { useEffect } from "react";

import { authApi } from "../../../api/axios";
import { useAuthStore } from "../../../store/auth.store";

// Don't re-check more often than this (focus + visibilitychange often fire together).
const MIN_GAP_MS = 30_000;

/**
 * Notices an ended session even when the user is not making any API call.
 *
 * The session lives in httpOnly cookies, so JavaScript cannot see when it ends
 * (expired, or the user logged out in the Throne8 tab). Without this, the redirect
 * to login only happens on the next API call. So whenever the user comes back to
 * this tab, we ask the server once. If the session is really over, the axios
 * interceptor fires SESSION_EXPIRED_EVENT and the route guard redirects to login.
 * If it is only the 15 min access cookie, it is renewed silently.
 */
export function useSessionWatcher() {
  const hasUser = useAuthStore((state) => state.user !== null);

  useEffect(() => {
    if (!hasUser) return;

    let lastCheck = Date.now();

    const check = () => {
      if (document.visibilityState !== "visible") return;

      const now = Date.now();
      if (now - lastCheck < MIN_GAP_MS) return;
      lastCheck = now;

      // The interceptor handles refresh + the expired event. Network errors are ignored.
      authApi.get("/auth/profile").catch(() => undefined);
    };

    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);

    return () => {
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [hasUser]);
}
