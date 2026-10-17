// ResumeCompletionCard.tsx
import { CircleCheck, CircleX } from "lucide-react";

interface Props {
  percentage: number;
  missing: string[];
}

export default function ResumeCompletionCard({ percentage, missing }: Props) {
  return (
    <section className="rounded-2xl border border-border-popup bg-navbar p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-heading sm:text-2xl">
            Resume Completion
          </h2>

          <p className="mt-2 text-sm text-nav-text sm:text-base">
            Improve your resume score.
          </p>
        </div>

        <div className="shrink-0 text-2xl font-bold text-subheading sm:text-3xl">
          {percentage}%
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-border-popup">
        <div
          className="h-full rounded-full bg-btn"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-8">
        <h3 className="mb-4 font-semibold text-heading">
          Complete these sections
        </h3>

        <div className="space-y-3">
          {missing.map((item) => (
            <div key={item} className="flex items-center gap-3 text-heading">
              <CircleX size={18} className="text-red-600" />

              {item}
            </div>
          ))}

          {missing.length === 0 && (
            <div className="flex items-center gap-3 text-heading">
              <CircleCheck size={18} className="text-green-700" />
              Resume Completed 🎉
            </div>
          )}
        </div>
      </div>

      <button className="mt-8 w-full rounded-xl bg-btn py-3 font-semibold text-btn-text transition hover:bg-btn-hover">
        Complete Resume
      </button>
    </section>
  );
}
