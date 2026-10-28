import { useState, useMemo, useEffect } from "react";
import {
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  Quote,
  TrendingUp,
  Layers,
  HelpCircle,
} from "lucide-react";
import type {
  ATSSectionDeepDive as ATSSectionDeepDiveType,
  ATSSectionDeepDivePriority,
  ATSFinding,
} from "../types/ats.types";

interface FocusRequest {
  sectionId: string;
  token: number;
}

interface Props {
  sections: ATSSectionDeepDiveType[];
  hasJobDescription: boolean;
  /**
   * Set (with a fresh token on every click) when another part of the
   * page — e.g. the Category Breakdown — wants this section expanded
   * and scrolled into view. A changing `token` re-triggers the effect
   * even if the same sectionId is requested twice in a row.
   */
  focusRequest?: FocusRequest | null;
}

export const getDeepDiveAnchorId = (sectionId: string) => `ats-deepdive-${sectionId}`;

const PRIORITY_ORDER: Record<ATSSectionDeepDivePriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function getPriorityBadge(priority: ATSSectionDeepDivePriority) {
  switch (priority) {
    case "critical":
      return {
        label: "Critical Priority",
        badgeClass: "bg-red-600/15 text-red-600",
        headerBorderClass: "border-red-500/30",
      };
    case "high":
      return {
        label: "High Priority",
        badgeClass: "bg-orange-500/15 text-orange-600",
        headerBorderClass: "border-orange-500/30",
      };
    case "medium":
      return {
        label: "Medium Priority",
        badgeClass: "bg-btn-hover-bg text-heading",
        headerBorderClass: "border-border-navbar",
      };
    case "low":
    default:
      return {
        label: "Low Priority",
        badgeClass: "bg-btn-hover-bg text-nav-text",
        headerBorderClass: "border-border-navbar",
      };
  }
}

// Sub-component for individual finding card
function FindingCard({
  finding,
  isMuted = false,
}: {
  finding: ATSFinding;
  isMuted?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExcellent = finding.verdict === "excellent";

  if (isExcellent) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-green-600/5 p-3 text-xs text-green-700">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span className="font-semibold">{finding.targetText}</span>
        <span className="text-green-700/70">— Strong impact & phrasing</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl p-3 space-y-3.5 transition sm:p-4 ${
        isMuted
          ? "bg-navbar-hover/60 opacity-90"
          : "bg-navbar-hover shadow-xs"
      }`}
    >
      {/* Target Text (Quoted / Muted) */}
      {finding.targetText && (
        <div className="flex items-start gap-2.5 rounded-lg bg-navbar/40 p-3">
          <Quote className="h-4 w-4 shrink-0 text-heading/40 mt-0.5" />
          <p className="min-w-0 break-words text-xs italic text-heading/80 leading-relaxed font-mono">
            "{finding.targetText}"
          </p>
        </div>
      )}

      {/* Problems Tags */}
      {finding.problems && finding.problems.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600/80 mr-1">
            Issues:
          </span>
          {finding.problems.map((problem, pIdx) => (
            <span
              key={`${finding.id}-prob-${pIdx}`}
              className="inline-flex max-w-full items-center break-words rounded-md bg-red-600/10 px-2 py-0.5 text-[11px] font-medium text-red-600"
            >
              {problem}
            </span>
          ))}
        </div>
      )}

      {/* Why It Matters */}
      {finding.whyItMatters && (
        <div className="break-words text-xs text-heading/90 leading-relaxed">
          <span className="font-semibold text-heading">Why it matters: </span>
          <span>{finding.whyItMatters}</span>
        </div>
      )}

      {/* Suggested Fix / Rewrite Block */}
      {finding.suggestedFix && (
        <div className="space-y-2 rounded-xl bg-btn-hover-bg p-3 sm:p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-heading">
              <Sparkles className="h-3.5 w-3.5 text-subheading" />
              <span>Suggested Rewrite</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(finding.suggestedFix)}
              className="inline-flex items-center gap-1 rounded-md bg-navbar px-2 py-1 text-[11px] font-medium text-heading hover:bg-border-popup transition"
              title="Copy rewrite to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-green-700" />
                  <span className="text-green-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-heading/60" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <p className="break-words text-xs font-medium text-heading leading-relaxed font-sans bg-navbar p-2.5 rounded-lg">
            {finding.suggestedFix}
          </p>
        </div>
      )}

      {/* Quantification Examples */}
      {finding.needsQuantification &&
        finding.quantificationExamples &&
        finding.quantificationExamples.length > 0 && (
          <div className="space-y-2 rounded-xl bg-orange-500/5 p-3 sm:p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Metric & Quantification Templates</span>
            </div>
            <p className="text-[11px] text-nav-text">
              Customize these illustrative templates with your actual figures:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs text-heading/80">
              {finding.quantificationExamples.map((ex, exIdx) => (
                <li key={`${finding.id}-ex-${exIdx}`} className="break-words">{ex}</li>
              ))}
            </ul>
          </div>
        )}

      {/* Optional Advisory JD Alignment Tip */}
      {finding.jdAlignmentTip && (
        <div className="rounded-xl bg-navbar/40 p-3 flex items-start gap-2 text-xs text-heading/80">
          <HelpCircle className="h-3.5 w-3.5 shrink-0 text-subheading mt-0.5" />
          <div>
            <span className="font-semibold text-heading">Job Description Tip (Advisory): </span>
            <span>{finding.jdAlignmentTip}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ATSSectionDeepDive({
  sections,
  hasJobDescription,
  focusRequest,
}: Props) {
  // Sort sections strictly by priority (critical -> high -> medium -> low)
  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => {
      const pA = PRIORITY_ORDER[a.priority] ?? 99;
      const pB = PRIORITY_ORDER[b.priority] ?? 99;
      if (pA !== pB) return pA - pB;
      return a.percentage - b.percentage;
    });
  }, [sections]);

  // Open first 2 sections by default, or critical/high ones
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sortedSections.forEach((sec, idx) => {
      if (idx < 2 || sec.priority === "critical" || sec.priority === "high") {
        initial[sec.sectionId] = true;
      }
    });
    return initial;
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // When the Category Breakdown (or anything else) asks us to jump to
  // a specific section, expand it and scroll it into view.
  useEffect(() => {
    if (!focusRequest) return;

    const { sectionId } = focusRequest;

    const exists = sortedSections.some((sec) => sec.sectionId === sectionId);
    if (!exists) return;

    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: true,
    }));

    // Wait a tick so the panel has expanded before we scroll to it.
    const frame = requestAnimationFrame(() => {
      document
        .getElementById(getDeepDiveAnchorId(sectionId))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest]);

  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-navbar p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="border-b border-border-navbar pb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-subheading" />
          <h2 className="text-lg font-bold text-heading">Section-wise Deep Dive</h2>
        </div>
        <p className="mt-1 text-xs text-nav-text">
          {hasJobDescription
            ? "Detailed, line-by-line review of each resume section ordered by optimization priority against the job description."
            : "Detailed, line-by-line review of each resume section ordered by optimization priority."}
        </p>
      </div>

      {/* Accordion Panels */}
      <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
        {sortedSections.map((sec) => {
          const isExpanded = !!expandedSections[sec.sectionId];
          const priorityInfo = getPriorityBadge(sec.priority);
          const isSkillsSection = sec.sectionId === "skills";
          const isOptimizedAndEmpty =
            sec.isFullyOptimized && (!sec.findings || sec.findings.length === 0);

          return (
            <div
              key={sec.sectionId}
              id={getDeepDiveAnchorId(sec.sectionId)}
              className="overflow-hidden rounded-xl bg-navbar-hover transition-all scroll-mt-24"
            >
              {/* Panel Header */}
              <button
                type="button"
                onClick={() => toggleSection(sec.sectionId)}
                className="flex w-full flex-col gap-3 p-3 text-left transition hover:bg-navbar/20 sm:p-4 @xl:flex-row @xl:items-center @xl:justify-between"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-heading">{sec.title}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${priorityInfo.badgeClass}`}
                  >
                    {priorityInfo.label}
                  </span>

                  {sec.isFullyOptimized && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-600/15 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
                      <CheckCircle2 className="h-3 w-3" /> Fully Optimized ✓
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 @xl:justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-heading/60">
                      Score:
                    </span>
                    <span className="text-sm font-bold text-heading">
                      {Math.round(sec.percentage)}%
                    </span>
                  </div>

                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg bg-navbar text-heading transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </button>

              {/* Panel Content */}
              {isExpanded && (
                <div className="space-y-4 border-t border-border-navbar bg-navbar/20 p-3 sm:p-5">
                  {/* Fully Optimized compact state */}
                  {isOptimizedAndEmpty ? (
                    <div className="flex items-center gap-2.5 rounded-xl bg-green-700/10 p-4 text-xs font-semibold text-green-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        This section is fully optimized and conforms to industry ATS standards.
                      </span>
                    </div>
                  ) : isSkillsSection && sec.skillsBreakdown ? (
                    /* SPECIAL CASE: skillsBreakdown rendering */
                    <div className="space-y-5">
                      {/* 1. Skills you have (requiredPresent) */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-green-700 mb-2.5 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Skills You Have ({sec.skillsBreakdown.requiredPresent.length})</span>
                        </h4>
                        {sec.skillsBreakdown.requiredPresent.length === 0 ? (
                          <p className="text-xs text-heading/50">
                            No verified matching skills identified in this section.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {sec.skillsBreakdown.requiredPresent.map((skill, sIdx) => (
                              <span
                                key={`req-pres-${skill}-${sIdx}`}
                                className="inline-flex max-w-full items-center gap-1 break-words rounded-lg bg-green-700/10 px-3 py-1 text-xs font-semibold text-green-700"
                              >
                                <Check className="h-3 w-3 stroke-[2.5]" />
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 2. Required skills missing (requiredMissing) */}
                      {sec.skillsBreakdown.requiredMissing.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>
                              Required Skills Missing ({sec.skillsBreakdown.requiredMissing.length})
                            </span>
                          </h4>
                          <div className="space-y-3">
                            {sec.skillsBreakdown.requiredMissing.map((finding) => (
                              <FindingCard key={finding.id} finding={finding} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Good to have (goodToHave) */}
                      {sec.skillsBreakdown.goodToHave.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-nav-text flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-subheading" />
                            <span>
                              Good to Have / Preferred ({sec.skillsBreakdown.goodToHave.length})
                            </span>
                          </h4>
                          <div className="space-y-3">
                            {sec.skillsBreakdown.goodToHave.map((finding) => (
                              <FindingCard key={finding.id} finding={finding} isMuted />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Standard Findings list */
                    <div className="space-y-3.5">
                      {sec.findings && sec.findings.length > 0 ? (
                        sec.findings.map((finding) => (
                          <FindingCard key={finding.id} finding={finding} />
                        ))
                      ) : (
                        <div className="flex items-center gap-2 rounded-xl bg-green-700/10 p-3.5 text-xs text-green-700 font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>No critical issues found in this section.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
