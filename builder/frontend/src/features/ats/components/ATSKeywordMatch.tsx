import { useState } from "react";
import { Check, X, Tag, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  matchedKeywords: string[];
  missingKeywords: string[];
  hasJobDescription: boolean;
}

const COLLAPSE_LIMIT = 15;

export default function ATSKeywordMatch({
  matchedKeywords,
  missingKeywords,
  hasJobDescription,
}: Props) {
  const [showAllMissing, setShowAllMissing] = useState(false);
  const [showAllMatched, setShowAllMatched] = useState(false);

  const displayedMissing = showAllMissing
    ? missingKeywords
    : missingKeywords.slice(0, COLLAPSE_LIMIT);

  const displayedMatched = showAllMatched
    ? matchedKeywords
    : matchedKeywords.slice(0, COLLAPSE_LIMIT);

  const hasExcessMissing = missingKeywords.length > COLLAPSE_LIMIT;
  const hasExcessMatched = matchedKeywords.length > COLLAPSE_LIMIT;

  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const matchRate =
    totalKeywords > 0
      ? Math.round((matchedKeywords.length / totalKeywords) * 100)
      : 0;

  return (
    <section
      id="ats-keyword-match"
      className="rounded-2xl bg-navbar p-4 shadow-sm scroll-mt-24 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 @xl:flex-row @xl:items-center @xl:justify-between border-b border-border-navbar pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-subheading" />
            <h2 className="text-lg font-bold text-heading">Keyword Match Analysis</h2>
          </div>
          <p className="mt-1 text-xs text-nav-text">
            {hasJobDescription
              ? "Key skills and terminology compared against the provided job description."
              : "Standard role-specific keywords analyzed for this profile."}
          </p>
        </div>

        {totalKeywords > 0 && (
          <div className="flex items-center gap-2 self-start @xl:self-auto rounded-lg bg-navbar-hover px-3 py-1.5">
            <span className="text-xs text-heading/60">Match Rate:</span>
            <span className="text-xs font-bold text-heading">{matchRate}%</span>
            <span className="text-[11px] text-heading/40">
              ({matchedKeywords.length}/{totalKeywords})
            </span>
          </div>
        )}
      </div>

      {/* Two Columns Layout */}
      <div className="mt-6 grid grid-cols-1 gap-4 @xl:grid-cols-2 @xl:gap-6">
        {/* Matched Keywords Column */}
        <div className="min-w-0 rounded-xl bg-navbar-hover p-3 sm:p-4">
          <div className="flex items-center justify-between border-b border-border-navbar pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600/20 text-green-700">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
              <h3 className="text-sm font-bold text-heading">Matched Keywords</h3>
            </div>
            <span className="rounded-full bg-green-600/15 px-2.5 py-0.5 text-xs font-bold text-green-700">
              {matchedKeywords.length}
            </span>
          </div>

          <div className="mt-3.5">
            {matchedKeywords.length === 0 ? (
              <p className="text-xs text-heading/50 py-2">
                No matching keywords detected in the resume.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {displayedMatched.map((kw, idx) => (
                    <span
                      key={`matched-${kw}-${idx}`}
                      className="inline-flex max-w-full items-center gap-1 break-words rounded-lg bg-green-700/10 px-2.5 py-1 text-xs font-semibold text-green-700 transition hover:bg-green-600/20"
                    >
                      <Check className="h-3 w-3 stroke-[2.5]" />
                      {kw}
                    </span>
                  ))}
                </div>

                {hasExcessMatched && (
                  <button
                    type="button"
                    onClick={() => setShowAllMatched(!showAllMatched)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-nav-text hover:text-heading transition"
                  >
                    {showAllMatched ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" /> Show{" "}
                        {matchedKeywords.length - COLLAPSE_LIMIT} more
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Missing Keywords Column */}
        <div className="min-w-0 rounded-xl bg-navbar-hover p-3 sm:p-4">
          <div className="flex items-center justify-between border-b border-border-navbar pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600/20 text-red-600">
                <X className="h-3.5 w-3.5 stroke-[3]" />
              </div>
              <h3 className="text-sm font-bold text-heading">Missing Keywords</h3>
            </div>
            <span className="rounded-full bg-red-600/15 px-2.5 py-0.5 text-xs font-bold text-red-600">
              {missingKeywords.length}
            </span>
          </div>

          <div className="mt-3.5">
            {missingKeywords.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-green-700/10 p-3 text-xs font-medium text-green-700">
                <Check className="h-4 w-4" />
                <span>Great job! All high-priority keywords are present.</span>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {displayedMissing.map((kw, idx) => (
                    <span
                      key={`missing-${kw}-${idx}`}
                      className="inline-flex max-w-full items-center gap-1 break-words rounded-lg bg-red-600/10 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-600/20"
                    >
                      <X className="h-3 w-3 stroke-[2.5]" />
                      {kw}
                    </span>
                  ))}
                </div>

                {hasExcessMissing && (
                  <button
                    type="button"
                    onClick={() => setShowAllMissing(!showAllMissing)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600/80 hover:text-red-600 transition"
                  >
                    {showAllMissing ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" /> Show{" "}
                        {missingKeywords.length - COLLAPSE_LIMIT} more
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
