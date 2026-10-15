import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { SESSION_EXPIRED_EVENT } from "../../../api/axios";

interface Props {
  children: ReactNode;
}

export default function AuthInitializer({ children }: Props) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const logout = useAuthStore((state) => state.logout);

  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // The session could not be renewed (expired, or logged out in the other app):
  // clear the user so ProtectedRoute sends them to the Throne8 login.
  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout);
  }, [logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
}
