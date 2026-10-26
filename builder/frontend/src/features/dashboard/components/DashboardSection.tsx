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
