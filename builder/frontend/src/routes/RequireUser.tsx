import { useEffect, useState, type ReactNode } from "react";

import { useAuthStore } from "../store/auth.store";
import {
  isLoginRedirectCoolingDown,
  redirectToLogin,
  THRONE8_URL,
} from "../config/auth.config";

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-btn" />
    </div>
  );
}

interface Props {
  children: ReactNode;
}

/**
 * Renders children only when the shared Throne8 session is valid.
 *
 * - While the first session check is running: spinner (no redirect yet).
 * - Server/network problem during the check: "try again" screen (NOT a logout).
 * - No session: send the user to the Throne8 login page and bring them back afterwards.
 */
export default function RequireUser({ children }: Props) {
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return <FullPageSpinner />;

  return <SessionGate>{children}</SessionGate>;
}

function SessionGate({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const authError = useAuthStore((state) => state.authError);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // This component only mounts after the first session check has finished. If it mounts
  // without a session right after we sent the user to Throne8, we just came back and there
  // is STILL no session (e.g. the cookie is not shared on this domain). Stop here instead
  // of bouncing between the two apps.
  const [loopBlocked] = useState(() => !user && isLoginRedirectCoolingDown());

  const shouldRedirect = !user && !authError && !loopBlocked;

  useEffect(() => {
    if (shouldRedirect) redirectToLogin();
  }, [shouldRedirect]);

  if (user) return <>{children}</>;

  if (authError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold text-heading">We couldn't check your session</p>
        <p className="max-w-md text-sm text-subheading">
          There was a connection problem. You are not logged out. Please try
          again.
        </p>
        <button
          type="button"
          onClick={() => void initializeAuth()}
          className="rounded-lg bg-btn px-5 py-2 text-sm font-medium text-btn-text transition hover:bg-btn-hover"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loopBlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold text-heading">We couldn't find your session</p>
        <p className="max-w-md text-sm text-subheading">
          Please log in on Throne8 and open the resume builder again.
        </p>
        <a
          href={`${THRONE8_URL}/login`}
          className="rounded-lg bg-btn px-5 py-2 text-sm font-medium text-btn-text transition hover:bg-btn-hover"
        >
          Go to Throne8 login
        </a>
      </div>
    );
  }

  return <FullPageSpinner />;
}
