import { useEffect, type ElementType, type ReactNode } from "react";
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
}

// Rows with no value are skipped, so empty profiles don't show a wall of dashes.
function Row({ icon: Icon, label, value }: RowProps) {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div className="flex items-start gap-3 py-2">
      <Icon size={18} className="mt-0.5 shrink-0 text-nav-text" />

      <div className="min-w-0">
        <p className="text-xs text-nav-text">{label}</p>
        <p className="wrap-break-word text-sm font-medium text-heading">
          {value}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border-popup px-6 py-4">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-subheading">
        {title}
      </h3>
      {children}
    </section>
  );
}

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
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-heading/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile details"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-border-popup bg-popup shadow-xl"
      >
        {/* ================= HEADER ================= */}

        <div className="relative flex flex-col items-center px-6 pb-5 pt-8 text-center">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-nav-text transition hover:bg-navbar-hover"
          >
            <X size={20} />
          </button>

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-btn text-3xl font-bold text-btn-text">
            {initial}
          </div>

          <h2 className="mt-3 text-xl font-bold text-heading">
            {user.fullName}
          </h2>

          <p className="max-w-full truncate text-sm text-nav-text">
            {user.email}
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-navbar px-3 py-1 text-xs font-semibold text-subheading">
              {capitalize(user.role)}
            </span>

            {profile.userType && profile.userType !== "unknown" && (
              <span className="rounded-full bg-navbar px-3 py-1 text-xs font-semibold text-subheading">
                {capitalize(profile.userType)}
              </span>
            )}

            {profile.emailVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-navbar px-3 py-1 text-xs font-semibold text-subheading">
                <BadgeCheck size={14} />
                Email verified
              </span>
            )}
          </div>
        </div>

        {/* ================= CONTACT ================= */}

        <Section title="Contact">
          <Row icon={Mail} label="Email" value={user.email} />
          <Row icon={Phone} label="Phone" value={profile.phoneNumber} />
          <Row icon={MapPin} label="Location" value={profile.location} />
        </Section>

        {/* ================= EDUCATION / WORK ================= */}

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
                <Row icon={CalendarDays} label="Period" value={workPeriod} />
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
                <Row icon={GraduationCap} label="CGPA" value={fresher?.cgpa} />
              </>
            )}
          </Section>
        )}

        {/* ================= ACCOUNT ================= */}

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

        {/* ================= FOOTER ================= */}

        <div className="border-t border-border-popup px-6 py-4">
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-heading transition hover:bg-btn-hover-bg"
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
