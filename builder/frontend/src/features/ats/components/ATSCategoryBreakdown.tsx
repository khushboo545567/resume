import { useMemo } from "react";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import type { ATSCategoryResult, ATSCategoryStatus } from "../types/ats.types";

interface Props {
  categories: ATSCategoryResult[];
  onCategorySelect?: (categoryId: string) => void;
}

function getStatusBadge(status: ATSCategoryStatus) {
  switch (status) {
    case "excellent":
      return {
        label: "Excellent",
        badgeClass: "bg-green-600/15 text-green-700",
        barClass: "bg-green-600",
        trackClass: "bg-green-600/15",
      };
    case "good":
      return {
        label: "Good",
        badgeClass: "bg-btn-hover-bg text-heading",
        barClass: "bg-btn",
        trackClass: "bg-btn-hover-bg",
      };
    case "needs-improvement":
      return {
        label: "Needs Improvement",
        badgeClass: "bg-orange-500/15 text-orange-600",
        barClass: "bg-orange-500",
        trackClass: "bg-orange-500/15",
      };
    case "poor":
    default:
      return {
        label: "Poor",
        badgeClass: "bg-red-600/15 text-red-600",
        barClass: "bg-red-600",
        trackClass: "bg-red-600/15",
      };
  }
}

export default function ATSCategoryBreakdown({ categories, onCategorySelect }: Props) {
  // Order categories by declared order if present, or preserve original order
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (typeof a.order === "number" && typeof b.order === "number") {
        return a.order - b.order;
      }
      return 0;
    });
  }, [categories]);

  return (
    <section className="rounded-2xl bg-navbar p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="border-b border-border-navbar pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-subheading" />
          <h2 className="text-lg font-bold text-heading">Category Breakdown</h2>
        </div>
        <p className="mt-1 text-xs text-nav-text">
          Score breakdown across essential ATS evaluation criteria. Tap a category to jump to its
          detailed review below.
        </p>
      </div>

      {/* Categories List */}
      <div className="mt-4 space-y-3">
        {sortedCategories.map((cat) => {
          const statusInfo = getStatusBadge(cat.status);

          return (
            <button
              key={cat.category}
              type="button"
              onClick={() => onCategorySelect?.(cat.category)}
              className="group w-full overflow-hidden rounded-xl bg-navbar-hover p-4 text-left transition-all hover:bg-navbar/30"
            >
              <div className="flex flex-col gap-3 @lg:flex-row @lg:items-center @lg:justify-between">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="text-sm font-bold text-heading">{cat.title}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusInfo.badgeClass}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 @lg:justify-end">
                  <div className="@lg:text-right">
                    <span className="text-sm font-bold text-heading">{cat.score}</span>
                    <span className="text-xs font-medium text-heading/50">
                      {" "}
                      / {cat.maxScore} pts
                    </span>
                    <span className="ml-2 text-xs font-bold text-nav-text">
                      ({Math.round(cat.percentage)}%)
                    </span>
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navbar text-heading/50 transition group-hover:bg-border-popup group-hover:text-heading">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div
                  className={`h-2 w-full overflow-hidden rounded-full ${statusInfo.trackClass}`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusInfo.barClass}`}
                    style={{
                      width: `${Math.min(100, Math.max(0, cat.percentage))}%`,
                    }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
