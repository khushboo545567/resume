import type { ReactNode } from "react";

interface Props {
  title: string;
  /** Link or button shown on the right of the heading. */
  action?: ReactNode;
  /** Optional item count shown as a badge next to the title. */
  count?: number;
  children: ReactNode;
}

export default function DashboardSection({ title, action, count, children }: Props) {
  return (
    <section className="min-w-0">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border-popup pb-3">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-gold to-accent" />
          <h2 className="text-lg font-bold text-display sm:text-xl">{title}</h2>
          {count !== undefined && (
            <span className="rounded-full bg-btn-hover-bg px-2.5 py-0.5 text-xs font-semibold text-subheading">
              {count}
            </span>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

/** Shared style for the "View all" style links beside a section heading. */
export const sectionActionClass =
  "flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-subheading transition hover:border-btn hover:bg-btn hover:text-btn-text";

/**
 * Number of items every dashboard section previews. "View all" only appears
 * when a section has more than this.
 */
export const DASHBOARD_PREVIEW_LIMIT = 3;

/** Card grid shared by the Resumes and Cover Letters sections. */
export const dashboardCardGridClass =
  "grid min-w-0 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3";
