import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useNavProgress } from "../store/navProgress.store";

// Safety net: never leave the bar running if the navigation ends somewhere unexpected
// (a redirect, an error, a blocked route).
const MAX_PENDING_MS = 10_000;

/**
 * Thin bar at the top of the screen that runs from the moment a sidebar link is clicked
 * until the new page is on screen. React keeps the old page visible while a lazy page
 * downloads, so without this the click looks like it did nothing.
 */
export default function NavigationProgress() {
  const pendingPath = useNavProgress((s) => s.pendingPath);
  const clear = useNavProgress((s) => s.clear);
  const { pathname } = useLocation();

  // The path React has actually rendered. While a lazy page is still downloading, the
  // browser URL is already the new one but this still holds the old one.
  const renderedPath = useRef(pathname);
  renderedPath.current = pathname;

  // Start the bar for EVERY navigation (sidebar, buttons, links, notifications, back
  // button) instead of wiring each click: watch the browser history directly.
  useEffect(() => {
    const startIfChanged = () => {
      const next = window.location.pathname;
      if (next !== renderedPath.current) useNavProgress.getState().start(next);
    };

    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      startIfChanged();
      return result;
    };
    window.addEventListener("popstate", startIfChanged);

    return () => {
      window.history.pushState = originalPushState;
      window.removeEventListener("popstate", startIfChanged);
    };
  }, []);

  // A page switch finished (or a redirect landed somewhere else): hide the bar.
  useEffect(() => {
    clear();
  }, [pathname, clear]);

  useEffect(() => {
    if (!pendingPath) return;
    const timer = window.setTimeout(clear, MAX_PENDING_MS);
    return () => window.clearTimeout(timer);
  }, [pendingPath, clear]);

  if (!pendingPath) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1"
    >
      <div
        key={pendingPath}
        className="h-full bg-btn shadow-[0_0_8px_var(--color-btn)]"
        style={{ animation: "nav-progress 8s cubic-bezier(0.1, 0.6, 0.2, 1) forwards" }}
      />
    </div>
  );
}
