import type { ElementType } from "react";

import {
  LayoutDashboard,
  FileText,
  Palette,
  Bot,
  BarChart3,
  Settings,
  Sparkles,
  User,
  Home,
  CalendarCheck2,
  Mail,
  Plus,
  Upload,
  LogOut,
  X,
} from "lucide-react";
import { BriefcaseBusiness } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuthStore } from "../../../store/auth.store";
import { isRouteDisabled } from "../../../config/disabledRoutes";
import type { QuickActions } from "../hooks/useQuickActions";

type MenuRole = "public" | "user" | "admin";

interface Menu {
  title: string;
  path: string;
  icon: ElementType;
  roles: MenuRole[];
}

const menus: Menu[] = [
  // ================= PUBLIC =================

  {
    title: "Home",
    path: "/home",
    icon: Home,
    roles: ["public", "user", "admin"],
  },

  {
    title: "Templates",
    path: "/templates",
    icon: Palette,
    roles: ["public", "user", "admin"],
  },

  {
    title: "Cover Letter",
    path: "/cover-letters",
    icon: Mail,
    roles: ["public", "user", "admin"],
  },

  {
    title: "AI Tools",
    path: "/ai",
    icon: Bot,
    roles: ["public", "user", "admin"],
  },

  // ================= USER + ADMIN =================

  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["user", "admin"],
  },

  {
    title: "My Resumes",
    path: "/myresume",
    icon: FileText,
    roles: ["user", "admin"],
  },

  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    roles: ["user", "admin"],
  },

  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["user", "admin"],
  },

  {
    title: "Interview",
    path: "/interview",
    icon: BriefcaseBusiness,
    roles: ["user", "admin"],
  },

  // ================= ADMIN ONLY =================

  {
    title: "Admin Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    roles: ["admin"],
  },

  {
    title: "View Users",
    path: "/admin/users",
    icon: User,
    roles: ["admin"],
  },

  {
    title: "Session Requests",
    path: "/admin/bookings",
    icon: CalendarCheck2,
    roles: ["admin"],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  quickActions: QuickActions;
  /*
   * When true, the sidebar is NEVER pinned open — not even at the
   * 1400px+ breakpoint where it normally becomes permanent. It always
   * behaves as an overlay drawer toggled from the navbar's hamburger.
   * Used on pages (like the resume editor) that need the full width
   * for their own content.
   */
  forceCollapsed?: boolean;
}

export default function Sidebar({
  isOpen,
  onClose,
  quickActions,
  forceCollapsed = false,
}: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const {
    handleCreateResume,
    handleCheckATSScore,
    handleOpenUploadResume,
    isCreatingAtsResume,
  } = quickActions;

  /*
   * If user exists:
   *    role = "user" or "admin"
   *
   * If user doesn't exist:
   *    role = "public"
   */
  const currentRole: MenuRole = user?.role ?? "public";

  /*
   * Show only menus allowed for the current role.
   */
  const visibleMenus = menus.filter(
    (menu) => menu.roles.includes(currentRole) && !isRouteDisabled(menu.path),
  );

  // Run an action then close the mobile drawer (no-op on desktop).
  const runAndClose = (action: () => void | Promise<void>) => () => {
    void action();
    onClose();
  };

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}

      {isOpen && (
        <div
          className={`fixed inset-0 z-40 bg-heading/50 ${
            forceCollapsed ? "" : "[@media(min-width:1400px)]:hidden"
          }`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col border-r border-border-sidebar bg-sidebar text-sidebar-text transition-transform duration-300 ease-in-out ${
          forceCollapsed ? "" : "[@media(min-width:1400px)]:translate-x-0"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* ================= LOGO ================= */}

        <div
          className={`flex h-16 shrink-0 items-center justify-between px-5 ${
            forceCollapsed ? "" : "[@media(min-width:1400px)]:justify-center"
          }`}
        >
          <h1 className="text-xl font-extrabold text-sidebar-text">ResumeAI</h1>

          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-1.5 text-sidebar-text/70 transition hover:bg-sidebar-hover ${
              forceCollapsed ? "" : "[@media(min-width:1400px)]:hidden"
            }`}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= SCROLLABLE BODY ================= */}

        {/* Everything below the logo scrolls together, so nothing gets
            squeezed out of view on short screens. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {/* ================= MOBILE QUICK ACTIONS ================= */}

          <div
            className={`space-y-2 border-b border-border-sidebar p-4 ${
              forceCollapsed ? "" : "[@media(min-width:1400px)]:hidden"
            }`}
          >
            <button
              type="button"
              onClick={runAndClose(handleCreateResume)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-btn px-4 py-2.5 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
            >
              <Plus size={16} />
              Create Resume
            </button>

            <button
              type="button"
              onClick={runAndClose(handleCheckATSScore)}
              disabled={isCreatingAtsResume}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-btn px-4 py-2.5 text-sm font-semibold text-btn-text transition hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreatingAtsResume ? "Preparing..." : "Check ATS Score"}
            </button>

            <button
              type="button"
              onClick={runAndClose(handleOpenUploadResume)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-sidebar px-4 py-2.5 text-sm font-semibold text-sidebar-text transition hover:bg-sidebar-hover"
            >
              <Upload size={16} />
              Upload Resume
            </button>
          </div>

          {/* ================= MENU ================= */}

          <nav className="flex-1 space-y-1 p-4">
            {visibleMenus.map((menu) => {
              const Icon = menu.icon;

              return (
                <NavLink
                  key={menu.title}
                  to={menu.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-sidebar-active text-sidebar-text shadow-lg"
                        : "text-sidebar-text/80 hover:bg-sidebar-hover hover:text-sidebar-text"
                    }`
                  }
                >
                  <Icon size={18} />

                  <span>{menu.title}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* ================= LOG OUT ================= */}

          {/* Ends the shared Throne8 session, so the user is logged out of both apps. */}
          {user && (
            <div className="shrink-0 border-t border-border-sidebar px-4 py-3">
              <button
                type="button"
                onClick={() => void signOut()}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-sidebar-text/80 transition hover:bg-sidebar-hover hover:text-sidebar-text"
              >
                <LogOut size={18} />
                <span>Log out</span>
              </button>
            </div>
          )}

          {/* ================= UPGRADE CARD ================= */}

          {/* You can show this only for logged-in users if you want */}
          {user && (
            <div className="m-4 shrink-0 rounded-2xl bg-btn p-4 text-btn-text">
              <Sparkles className="mb-2 text-btn-hover-bg" size={20} />

              <h3 className="text-sm font-bold">Upgrade to Pro</h3>

              <p className="mt-1.5 text-xs opacity-90">
                Unlock AI Resume Builder, ATS Pro, Unlimited Resume Downloads
                and Premium Templates.
              </p>

              <button className="mt-3 w-full rounded-xl bg-navbar py-2 text-sm font-semibold text-heading transition hover:bg-btn-hover-bg">
                Upgrade
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
