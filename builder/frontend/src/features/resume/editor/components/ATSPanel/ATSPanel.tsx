import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { Upload } from "lucide-react";
import { useResumeStore } from "../../../../../store/resume.store";
import { uploadAndParseIntoResume } from "../../../services/resume.service";
import { useLatestATS, useAnalyzeATS } from "../../../../ats/hooks/useATSScore";
import ATSResultsView from "../../../../ats/components/ATSResultsView";
import JobDescriptionInput from "./JobDescriptionInput";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  resumeId?: string;
  initialTargetRole?: string;
}

export default function ATSPanel({
  isOpen,
  onClose,
  resumeId,
  initialTargetRole = "",
}: Props) {
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    if (initialTargetRole && !targetRole) {
      setTargetRole(initialTargetRole);
    }
  }, [initialTargetRole, targetRole]);

  const {
    data: atsResponse,
    isLoading: isATSLoading,
    isError: isATSError,
    refetch: refetchATS,
  } = useLatestATS(resumeId);

  const {
    mutate: analyzeATS,
    isPending: isAnalyzingATS,
    isError: isAnalyzeError,
    isSuccess: isAnalyzeSuccess,
  } = useAnalyzeATS();

  const ats = atsResponse?.data ?? null;

  const handleAnalyze = () => {
    if (!resumeId || !targetRole.trim()) return;

    analyzeATS({
      resumeId,
      targetRole: targetRole.trim(),
      jobDescription: jobDescription.trim(),
      options: {
        includeAIAnalysis: true,
        includeOptimizedSummary: true,
        includeImprovedExperience: true,
        includeKeywordAnalysis: true,
        includeSemanticAnalysis: true,
        includeParseabilityAnalysis: true,
        includeContentQualityAnalysis: true,
        includeDateConsistencyAnalysis: true,
        includeSeniorityAnalysis: true,
      },
    });
  };

  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);

  const [isParsingUpload, setIsParsingUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isResumeEmpty = !resume?.personalInfo?.fullName;

  const handleFileUpload = async (file: File | undefined) => {
    if (!file || !resumeId) return;

    setUploadError(null);
    setIsParsingUpload(true);

    try {
      const updatedResume = await uploadAndParseIntoResume(resumeId, file);
      setResume(updatedResume);

      if (updatedResume.targetRole) {
        setTargetRole(updatedResume.targetRole);
      }
    } catch (error) {
      console.error(error);
      setUploadError("Failed to parse this PDF. Please try a different file.");
    } finally {
      setIsParsingUpload(false);
    }
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-btn/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full overflow-y-auto bg-background shadow-2xl transition-transform duration-300 sm:w-1/2 sm:min-w-[480px] sm:max-w-[960px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top sticky bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-navbar/95 px-4 py-3 shadow-sm backdrop-blur-xs sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className="h-5 w-5 shrink-0 text-subheading" />
            <h2 className="truncate text-base font-bold text-heading sm:text-lg">
              ATS Scanner & Deep Dive
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-heading/60 hover:bg-navbar hover:text-heading transition"
            aria-label="Close ATS Panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
          {/* Analysis Form Header Card */}
          <div className="space-y-4 rounded-2xl bg-navbar p-4 shadow-sm sm:p-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-heading mb-1.5">
                Target Role <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, Full Stack Developer..."
                className="w-full rounded-xl border border-border-navbar bg-navbar-hover px-4 py-2.5 text-sm text-heading placeholder:text-heading/40 outline-none focus:border-border-strong focus:ring-2 focus:ring-ring transition"
              />
            </div>

            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
            />
            {isResumeEmpty && (
              <div className="rounded-xl border border-dashed border-border-navbar bg-navbar-hover/60 p-4">
                <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
                  <Upload className="h-5 w-5 text-heading/60" />
                  <span className="text-xs font-semibold text-heading">
                    {isParsingUpload
                      ? "Parsing your resume..."
                      : "Upload a PDF to autofill this resume"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    disabled={isParsingUpload}
                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  />
                </label>
                {uploadError && (
                  <p className="mt-2 text-xs font-semibold text-red-600">
                    {uploadError}
                  </p>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!resumeId || !targetRole.trim() || isAnalyzingATS}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-btn px-5 py-3 text-sm font-semibold text-btn-text transition hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
            >
              {isAnalyzingATS ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span className="text-center">Analyzing Resume against ATS Standards...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Run ATS Deep Scan</span>
                </>
              )}
            </button>

            {isAnalyzeError && (
              <p className="text-xs font-semibold text-red-600">
                ATS analysis failed to complete. Please check the backend
                connection and try again.
              </p>
            )}
            {isAnalyzeSuccess && (
              <p className="text-xs font-semibold text-green-700">
                ATS analysis generated and up to date!
              </p>
            )}
          </div>

          {/* Results Area */}
          <div className="w-full">
            {isATSLoading || isAnalyzingATS ? (
              <ATSResultsView result={null} isLoading={true} />
            ) : isATSError ? (
              <ATSResultsView
                result={null}
                isError={true}
                errorMessage="Unable to load previous ATS analysis."
                onRetry={() => refetchATS()}
              />
            ) : ats ? (
              <ATSResultsView result={ats} />
            ) : (
              <div className="rounded-2xl border border-dashed border-heading/20 bg-navbar/50 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-btn-hover-bg text-subheading">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-heading">
                  Ready to scan your resume
                </h3>
                <p className="mt-1 text-xs text-heading/60 max-w-sm mx-auto">
                  Provide your target role above and optionally paste a job
                  description, then click "Run ATS Deep Scan" to receive scores,
                  deep-dive line fixes, and keyword matching.
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
