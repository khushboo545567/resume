import { Target, Briefcase, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import type { ATSGrade } from "../types/ats.types";

interface Props {
  score: number;
  grade: ATSGrade;
  targetRole?: string;
  hasJobDescription: boolean;
  analyzedAt?: string;
}

interface ScoreTier {
  label: string;
  gradeBadgeClass: string;
  scoreTextClass: string;
  barClass: string;
  trackClass: string;
  summaryText: string;
}

function getScoreTier(score: number, grade: ATSGrade): ScoreTier {
  if (score >= 85 || grade === "A") {
    return {
      label: "Excellent ATS Match",
      gradeBadgeClass: "bg-green-600/15 text-green-700",
      scoreTextClass: "text-green-700",
      barClass: "bg-green-600",
      trackClass: "bg-green-600/15",
      summaryText: "Your resume is highly optimized for ATS parsers and hiring managers.",
    };
  }

  if (score >= 70 || grade === "B") {
    return {
      label: "Good ATS Match",
      gradeBadgeClass: "bg-btn-hover-bg text-heading",
      scoreTextClass: "text-heading",
      barClass: "bg-btn",
      trackClass: "bg-btn-hover-bg",
      summaryText: "Your resume performs well, with a few targeted optimization opportunities.",
    };
  }

  if (score >= 50 || grade === "C") {
    return {
      label: "Needs Improvement",
      gradeBadgeClass: "bg-orange-500/15 text-orange-600",
      scoreTextClass: "text-orange-600",
      barClass: "bg-orange-500",
      trackClass: "bg-orange-500/15",
      summaryText: "Your resume has critical gaps in keywords, formatting, or quantifiable impact.",
    };
  }

  return {
    label: "Significant Revision Needed",
    gradeBadgeClass: "bg-red-600/15 text-red-600",
    scoreTextClass: "text-red-600",
    barClass: "bg-red-600",
    trackClass: "bg-red-600/15",
    summaryText: "Your resume is at high risk of being filtered out by automated screening systems.",
  };
}

export default function ATSOverallScore({
  score,
  grade,
  targetRole,
  hasJobDescription,
  analyzedAt,
}: Props) {
  const safeScore = Math.min(100, Math.max(0, score));
  const roundedScore = Math.round(safeScore);
  const tier = getScoreTier(roundedScore, grade);

  const formattedDate = analyzedAt
    ? new Date(analyzedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="w-full rounded-2xl bg-navbar p-4 shadow-sm transition-all sm:p-6">
      {/* Top Meta Header */}
      <div className="flex flex-col gap-3 @xl:flex-row @xl:items-center @xl:justify-between border-b border-border-navbar pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {targetRole && (
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-navbar-hover px-3 py-1 text-xs font-semibold text-heading">
              <Briefcase className="h-3.5 w-3.5 text-subheading" />
              <span className="break-words">{targetRole}</span>
            </div>
          )}

          <div
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium ${
              hasJobDescription
                ? "bg-btn-hover-bg text-heading"
                : "bg-btn-hover-bg/50 text-nav-text"
            }`}
          >
            {hasJobDescription ? (
              <>
                <Target className="h-3.5 w-3.5 text-subheading" />
                <span>Scored against job description</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-heading/60" />
                <span>General scoring — no JD provided</span>
              </>
            )}
          </div>
        </div>

        {formattedDate && (
          <span className="text-[11px] text-heading/50">
            Analyzed {formattedDate}
          </span>
        )}
      </div>

      {/* Main Score & Grade Block */}
      <div className="mt-6 flex flex-col gap-4 @xl:flex-row @xl:items-center @xl:justify-between @xl:gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Grade Badge */}
          <div
            className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl shadow-sm ${tier.gradeBadgeClass}`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Grade
            </span>
            <span className="text-3xl font-black leading-none">{grade}</span>
          </div>

          {/* Score Numerical */}
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl font-black tracking-tight sm:text-5xl ${tier.scoreTextClass}`}
              >
                {roundedScore}
              </span>
              <span className="text-base font-semibold text-heading/40">
                / 100
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-base font-bold text-heading">
                {tier.label}
              </span>
            </div>
          </div>
        </div>

        {/* Short Advice Callout */}
        <div className="w-full rounded-xl bg-navbar-hover p-3.5 text-xs text-heading/80 @xl:max-w-md">
          <p className="flex items-start gap-2">
            {roundedScore >= 70 ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-700 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
            )}
            <span>{tier.summaryText}</span>
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div
          className={`h-3 w-full overflow-hidden rounded-full ${tier.trackClass}`}
        >
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${tier.barClass}`}
            style={{ width: `${safeScore}%` }}
          />
        </div>

        {/* Milestone Scale */}
        <div className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[11px] font-medium text-heading/40">
          <span>0 (Critical)</span>
          <span>50 (Needs Work)</span>
          <span>75 (Good)</span>
          <span>90+ (Excellent)</span>
        </div>
      </div>
    </div>
  );
}
