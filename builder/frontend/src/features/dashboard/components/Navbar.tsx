import { Search, Plus, ChevronDown, Upload } from "lucide-react";
import { CiMenuBurger } from "react-icons/ci";

import { useAuthStore } from "../../../store/auth.store";
import NotificationDropdown from "../../notification/components/NotificationDropdown";
import type { QuickActions } from "../hooks/useQuickActions";

interface NavbarProps {
  onMenuClick: () => void;
  quickActions: QuickActions;
  /*
   * When true, always render the compact bar + hamburger, even at
   * the 1400px+ breakpoint where the full desktop bar would normally
   * take over. Used on pages whose own header already covers search
   * and quick actions, so the dashboard nav just needs to offer a
   * way to reach the sidebar without taking up permanent space.
   */
  forceCollapsed?: boolean;
}

export default function Navbar({
  onMenuClick,
  quickActions,
  forceCollapsed = false,
}: NavbarProps) {
  const user = useAuthStore((state) => state.user);

  const {
    handleCreateResume,
    handleCheckATSScore,
    handleOpenUploadResume,
    isCreatingAtsResume,
  } = quickActions;

  const initial = user?.fullName?.charAt(0).toUpperCase() ?? "G";

  return (
    <header className="sticky top-0 z-30 border-b border-border-navbar bg-navbar">
      {/* ================= MOBILE BAR ================= */}
      {/* Logo, notifications, profile, and the menu burger that opens the side nav */}

      <div
        className={`flex h-16 items-center justify-between px-4 ${
          forceCollapsed ? "" : "[@media(min-width:1400px)]:hidden"
        }`}
      >
        <h1 className="text-lg font-extrabold text-heading">ResumeAI</h1>

        <div className="flex items-center gap-2">
          <NotificationDropdown />

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-btn text-15 font-bold text-btn-text">
            {initial}
          </div>

          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-heading transition hover:bg-navbar-hover"
            aria-label="Open menu"
          >
            <CiMenuBurger size={22} />
          </button>
        </div>
      </div>

      {/* ================= DESKTOP BAR ================= */}

      <div
        className={`${
          forceCollapsed
            ? "hidden"
            : "hidden h-20 items-center justify-between gap-4 px-6 [@media(min-width:1400px)]:flex xl:px-8"
        }`}
      >
        {/* Left */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-nav-text"
          />

          <input
            placeholder="Search resumes..."
            className="h-11 w-40 rounded-xl border border-border pl-11 pr-4 text-15 text-heading outline-none transition focus:border-border-strong focus:ring-2 focus:ring-ring xl:w-80"
          />
        </div>

        {/* Right */}

        <div className="flex items-center gap-2 xl:gap-3">
          {/* Create Resume */}

          <button
            onClick={handleCreateResume}
            className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-btn px-3 py-2.5 text-15 font-semibold text-btn-text transition hover:bg-btn-hover xl:px-4"
          >
            <Plus size={18} />
            <span>Create Resume</span>
          </button>

          <button
            type="button"
            onClick={handleCheckATSScore}
            disabled={isCreatingAtsResume}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-btn px-3 py-2.5 text-15 font-semibold text-btn-text transition hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-50 xl:px-4"
          >
            {isCreatingAtsResume ? (
              "Preparing..."
            ) : (
              <>
                <span className="hidden xl:inline">Check ATS Score</span>
                <span className="xl:hidden">ATS</span>
              </>
            )}
          </button>

          {/* Upload Resume */}

          <button
            type="button"
            onClick={handleOpenUploadResume}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-border px-3 py-2.5 text-15 font-semibold text-heading transition hover:bg-btn-hover-bg xl:px-4"
          >
            <Upload size={18} />
            <span>Upload Resume</span>
          </button>

          {/* Notifications */}

          <NotificationDropdown />

          {/* User */}

          <button className="flex items-center gap-2 rounded-xl px-2.5 py-2 transition hover:bg-navbar-hover">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-btn text-15 font-bold text-btn-text">
              {initial}
            </div>

            <div className="hidden text-left xl:block">
              <p className="text-15 font-semibold text-heading">
                {user?.fullName ?? "Guest"}
              </p>

              <p className="max-w-40 truncate text-13 text-nav-text">
                {user ? user.email : "Not logged in"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-nav-text xl:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
