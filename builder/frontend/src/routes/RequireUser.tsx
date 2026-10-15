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
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
    </div>
  );
}

interface Props {
  children: ReactNode;
}

/**
 * Renders children only when the shared Throne8 session is valid.
 * Otherwise sends the user to the Throne8 login page and brings them back afterwards.
 */
export default function RequireUser({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  // Mounted without a session right after we sent the user to Throne8 = we just came back and
  // there is STILL no session (e.g. the cookie is not shared on this domain). Stop here
  // instead of bouncing between the two apps.
  const [loopBlocked] = useState(() => !user && isLoginRedirectCoolingDown());

  useEffect(() => {
    if (!user && !loopBlocked) redirectToLogin();
  }, [user, loopBlocked]);

  if (user) return <>{children}</>;

  if (loopBlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold">We couldn't find your session</p>
        <p className="max-w-md text-sm text-slate-500">
          Please log in on Throne8 and open the resume builder again.
        </p>
        <a
          href={`${THRONE8_URL}/login`}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white"
        >
          Go to Throne8 login
        </a>
      </div>
    );
  }

  return <FullPageSpinner />;
}
