import type { ReactNode } from "react";

interface Props {
  title: string;
  /** Link or button shown on the right of the heading. */
  action?: ReactNode;
  children: ReactNode;
}

export default function DashboardSection({ title, action, children }: Props) {
  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-heading sm:text-xl">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
}

/** Shared style for the "View all" style links beside a section heading. */
export const sectionActionClass =
  "flex shrink-0 items-center gap-1 text-sm font-semibold text-subheading transition hover:text-heading";

/**
 * Number of items every dashboard section previews. "View all" only appears
 * when a section has more than this.
 */
export const DASHBOARD_PREVIEW_LIMIT = 3;

/** Card grid shared by the Resumes and Cover Letters sections. */
export const dashboardCardGridClass =
  "grid min-w-0 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3";
