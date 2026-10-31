import { Link } from "react-router-dom";

import { useCredits } from "../hooks/useCredits";

const linkClass = "font-semibold text-heading underline";

/** "N ATS checks left" under the Run ATS button. Hidden until loaded. */
export function AtsChecksHint() {
  const { data } = useCredits();
  if (!data) return null;

  const left = data.atsChecks;

  return (
    <p className="text-xs text-subheading" role="status">
      {left > 0 ? (
        <>
          {left} ATS {left === 1 ? "check" : "checks"} left. Each scan uses 1.
        </>
      ) : (
        <>
          No ATS checks left.{" "}
          <Link to="/pricing?tab=ats" className={linkClass}>
            Buy a pack
          </Link>
        </>
      )}
    </p>
  );
}

/**
 * Shown wherever a PDF is uploaded and parsed. Free uploads go first; after
 * that an upload uses 1 AI resume edit credit.
 */
export function UploadCreditsHint() {
  const { data } = useCredits();
  if (!data) return null;

  const { resumeUploads, resumeEdits } = data;

  return (
    <p className="text-xs text-subheading" role="status">
      {resumeUploads > 0 ? (
        <>
          {resumeUploads} free PDF {resumeUploads === 1 ? "upload" : "uploads"}{" "}
          left.
        </>
      ) : resumeEdits > 0 ? (
        <>
          Free uploads used. This upload will use 1 AI resume edit ({resumeEdits}{" "}
          left).
        </>
      ) : (
        <>
          No uploads left.{" "}
          <Link to="/pricing?tab=resume" className={linkClass}>
            Buy a pack
          </Link>
        </>
      )}
    </p>
  );
}
