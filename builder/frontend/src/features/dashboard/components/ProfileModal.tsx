import { useEffect, type ElementType, type ReactNode } from "react";
import UserAvatar from "../../../components/UserAvatar";
import { createPortal } from "react-dom";
import {
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  BadgeCheck,
  LogOut,
} from "lucide-react";

import { useAuthStore } from "../../../store/auth.store";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (value?: string | null, withDay = true) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    ...(withDay ? { day: "numeric" } : {}),
  });
};

const capitalize = (value?: string | null) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : null;

interface RowProps {
  icon: ElementType;
  label: string;
  value?: ReactNode;
  wide?: boolean;
}

// Rows with no value are skipped, so empty profiles don't show a wall of dashes.
function Row({ icon: Icon, label, value, wide }: RowProps) {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div
      className={`flex items-center gap-3 py-2 ${wide ? "sm:col-span-2" : ""}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navbar text-accent">
        <Icon size={18} />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-nav-text">{label}</p>
        <p className="break-words text-sm font-semibold text-heading">
          {value}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-border-popup px-5 py-4 last:border-b-0 sm:px-6">
      <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-accent">
        {title}
      </h3>

      {/* One column on phones, two on wider screens to keep the popup short */}
      <div className="grid sm:grid-cols-2 sm:gap-x-6">{children}</div>
    </section>
  );
}

const chipClass =
  "inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-gold-soft";

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  // Close on Escape + lock background scroll while the popup is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const profile = user.profile ?? {};
  const initial = user.fullName?.charAt(0).toUpperCase() ?? "G";

  const { student, working, fresher } = profile;

  const workPeriod = working?.startDate
    ? `${formatDate(working.startDate, false)} – ${
        working.endDate ? formatDate(working.endDate, false) : "Present"
      }`
    : null;

  const hasEducationOrWork =
    (profile.userType === "student" && student) ||
    (profile.userType === "working" && working) ||
    (profile.userType === "fresher" && fresher);

  // Portal to <body>: the navbar is a sticky z-30 stacking context, which would
  // otherwise keep this popup underneath the z-50 sidebar.
  return createPortal(
    // Bottom sheet on phones, centred dialog from the sm breakpoint up.
    <div
      className="fixed inset-0 z-60 flex items-end justify-center bg-heading/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile details"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-border-popup bg-popup shadow-xl sm:max-w-lg sm:rounded-2xl"
      >
        {/* ================= HEADER (pinned) ================= */}

        {/* Same dark gradient as Throne8's mentor card */}
        <div className="relative shrink-0 bg-linear-to-br from-sidebar via-sidebar-hover to-border-sidebar px-5 py-5 pr-12 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-sidebar-text/70 transition hover:bg-sidebar-text/10 hover:text-sidebar-text"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-btn-hover-bg overflow-hidden text-2xl font-extrabold text-btn sm:h-16 sm:w-16">
              <UserAvatar src={user.avatarUrl} initial={initial} className="flex h-full w-full items-center justify-center rounded-full" />
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-lg font-bold text-sidebar-text sm:text-xl">
                {user.fullName}
              </h2>

              <p className="break-all text-xs text-sidebar-text/70 sm:text-sm">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={chipClass}>{capitalize(user.role)}</span>

            {profile.userType && profile.userType !== "unknown" && (
              <span className={chipClass}>{capitalize(profile.userType)}</span>
            )}

            {profile.emailVerified && (
              <span className={chipClass}>
                <BadgeCheck size={14} />
                Email verified
              </span>
            )}
          </div>
        </div>

        {/* ================= DETAILS (scrolls) ================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <Section title="Contact">
            <Row icon={Mail} label="Email" value={user.email} wide />
            <Row icon={Phone} label="Phone" value={profile.phoneNumber} />
            <Row icon={MapPin} label="Location" value={profile.location} />
          </Section>

          {hasEducationOrWork && (
            <Section
              title={profile.userType === "working" ? "Work" : "Education"}
            >
              {profile.userType === "student" && (
                <>
                  <Row
                    icon={GraduationCap}
                    label="College"
                    value={student?.collegeName}
                    wide
                  />
                  <Row
                    icon={GraduationCap}
                    label="Degree"
                    value={[student?.degree, student?.fieldOfStudy]
                      .filter(Boolean)
                      .join(" · ")}
                  />
                  <Row
                    icon={CalendarDays}
                    label="Graduation year"
                    value={student?.graduationYear}
                  />
                </>
              )}

              {profile.userType === "working" && (
                <>
                  <Row
                    icon={BriefcaseBusiness}
                    label="Job title"
                    value={working?.jobTitle}
                  />
                  <Row
                    icon={BriefcaseBusiness}
                    label="Company"
                    value={working?.companyName}
                  />
                  <Row
                    icon={CalendarDays}
                    label="Period"
                    value={workPeriod}
                    wide
                  />
                </>
              )}

              {profile.userType === "fresher" && (
                <>
                  <Row
                    icon={GraduationCap}
                    label="Highest education"
                    value={fresher?.highestEducation}
                  />
                  <Row
                    icon={BriefcaseBusiness}
                    label="Preferred role"
                    value={fresher?.preferredRole}
                  />
                  <Row
                    icon={GraduationCap}
                    label="CGPA"
                    value={fresher?.cgpa}
                  />
                </>
              )}
            </Section>
          )}

          <Section title="Account">
            <Row
              icon={CalendarDays}
              label="Member since"
              value={formatDate(profile.createdAt)}
            />
            <Row
              icon={Clock}
              label="Last login"
              value={formatDate(profile.lastLoginAt)}
            />
          </Section>
        </div>

        {/* ================= FOOTER (pinned) ================= */}

        <div className="shrink-0 border-t border-border-popup px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-btn px-4 py-2.5 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
