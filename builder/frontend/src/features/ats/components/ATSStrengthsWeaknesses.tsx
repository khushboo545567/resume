import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface Props {
  strengths: string[];
  weaknesses: string[];
}

export default function ATSStrengthsWeaknesses({
  strengths,
  weaknesses,
}: Props) {
  return (
    <section className="rounded-2xl bg-navbar p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="border-b border-border-navbar pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-subheading" />
          <h2 className="text-lg font-bold text-heading">Strengths & Key Areas to Address</h2>
        </div>
        <p className="mt-1 text-xs text-nav-text">
          Executive summary of resume highlights and high-impact areas for improvement.
        </p>
      </div>

      {/* Two columns layout */}
      <div className="mt-6 grid grid-cols-1 gap-4 @xl:grid-cols-2 @xl:gap-6">
        {/* Strengths List */}
        <div className="min-w-0 rounded-xl bg-navbar-hover p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-border-navbar pb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-heading">
              Resume Strengths ({strengths.length})
            </h3>
          </div>

          <div className="mt-4">
            {strengths.length === 0 ? (
              <p className="text-xs text-heading/50">
                No major strengths identified in the analysis.
              </p>
            ) : (
              <ul className="space-y-3">
                {strengths.map((strength, idx) => (
                  <li
                    key={`str-${idx}`}
                    className="flex items-start gap-2.5 text-xs text-heading/80 leading-relaxed"
                  >
                    <span className="mt-0.5 text-green-700 font-bold">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Weaknesses / Areas to Improve List */}
        <div className="min-w-0 rounded-xl bg-navbar-hover p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-border-navbar pb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-heading">
              Areas to Improve ({weaknesses.length})
            </h3>
          </div>

          <div className="mt-4">
            {weaknesses.length === 0 ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>No major weaknesses or structural gaps detected.</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {weaknesses.map((weakness, idx) => (
                  <li
                    key={`wk-${idx}`}
                    className="flex items-start gap-2.5 text-xs text-heading/80 leading-relaxed"
                  >
                    <span className="mt-0.5 text-orange-600 font-bold">!</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
