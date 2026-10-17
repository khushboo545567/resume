import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";
import { redirectToLogin, redirectToSignup } from "../config/auth.config";
import { FullPageSpinner } from "./RequireUser";

interface Props {
  to: "login" | "signup";
}

/**
 * Old /login and /register URLs: this app has no auth pages anymore, so forward to Throne8.
 * Logged-in users simply go to the dashboard.
 */
export default function ExternalRedirect({ to }: Props) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Wait for the session check: a logged-in user must not be sent to the login page.
    if (isLoading || user) return;

    if (to === "signup") {
      redirectToSignup();
    } else {
      // Come back to the dashboard (not to "/login", which would loop).
      redirectToLogin(`${window.location.origin}/dashboard`);
    }
  }, [user, isLoading, to]);

  if (user) return <Navigate to="/dashboard" replace />;

  return <FullPageSpinner />;
}
