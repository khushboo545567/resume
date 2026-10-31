import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { SESSION_EXPIRED_EVENT } from "../../../api/axios";
import { useSessionWatcher } from "../hooks/useSessionWatcher";

interface Props {
  children: ReactNode;
}

/**
 * Starts the session check in the background. It does NOT block rendering:
 * public pages (home, templates, public share links) show immediately, and only
 * protected routes wait for the result (see RequireUser).
 */
export default function AuthInitializer({ children }: Props) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Re-check the session when the user returns to this tab (idle tab / logout elsewhere).
  useSessionWatcher();

  // The session could not be renewed (expired, or logged out in the other app):
  // clear the user so ProtectedRoute sends them to the Throne8 login.
  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout);
  }, [logout]);

  return children;
}
