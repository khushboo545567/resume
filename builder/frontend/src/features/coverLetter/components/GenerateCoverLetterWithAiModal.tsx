import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, UploadCloud, FileText, Lock } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import SuggestInput from "../../../components/ui/SuggestInput";

import { searchRoles } from "../../resume/config/jobRoles";

import { getResumes } from "../../resume/services/resume.service";
import type { Resume } from "../../resume/types/resume.types";

import {
  generateCoverLetterWithAI,
  getCoverLetterAiCredits,
  getAiErrorMessage,
  type CoverLetterAiCredits,
} from "../services/coverLetterAi.service";
import { useCoverLetterStore } from "../../../store/coverLetter.store";
import { CoverLetterTemplates } from "../types/coverLetter.types";
import type { CoverLetterTemplate } from "../types/coverLetter.types";
import { coverLetterTemplates } from "../config/coverLetterTemplates";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ResumeSource = "existing" | "upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, matches backend limit

export default function GenerateCoverLetterWithAiModal({
  open,
  onClose,
}: Props) {
  const navigate = useNavigate();
  const loadDraft = useCoverLetterStore((state) => state.loadDraft);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [templateId, setTemplateId] = useState<CoverLetterTemplate>(
    CoverLetterTemplates.CLASSIC_FORMAL,
  );

  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");

  const [resumeSource, setResumeSource] = useState<ResumeSource>("existing");
  const [resumeId, setResumeId] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);

  const [credits, setCredits] = useState<CoverLetterAiCredits | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setResumesLoading(true);
    getResumes(1)
      .then((res) => setResumes(res.resumes))
      .catch(() => setResumes([]))
      .finally(() => setResumesLoading(false));

    setCreditsLoading(true);
    getCoverLetterAiCredits()
      .then(setCredits)
      .catch(() => setCredits(null))
      .finally(() => setCreditsLoading(false));
  }, [open]);

  const hasJD = jobDescription.trim().length > 0;
  const outOfCredits = credits !== null && credits.remaining <= 0;

  const handleFileSelect = (file: File | null) => {
    setError(null);

    if (!file) {
      setResumeFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("PDF must be 5MB or smaller.");
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async () => {
    setError(null);

    if (outOfCredits) {
      return setError(
        "You've used all your free AI generations. Buy more credits to continue.",
      );
    }

    if (!title.trim()) return setError("Cover letter name is required.");
    if (!targetRole.trim()) return setError("Target role is required.");

    if (!hasJD && !companyName.trim()) {
      return setError(
        "Please provide a job description, or at least a company name.",
      );
    }

    if (resumeSource === "existing" && !resumeId) {
      return setError("Please select a resume.");
    }

    if (resumeSource === "upload" && !resumeFile) {
      return setError("Please upload a resume PDF.");
    }

    try {
      setLoading(true);

      const { coverLetter: generated, credits: updatedCredits } =
        await generateCoverLetterWithAI({
          targetRole: targetRole.trim(),
          jobDescription: hasJD ? jobDescription.trim() : undefined,
          companyName: companyName.trim() || undefined,
          companyInfo: companyInfo.trim() || undefined,
          resumeId: resumeSource === "existing" ? resumeId : undefined,
          resumeFile: resumeSource === "upload" ? resumeFile : undefined,
        });

      setCredits(updatedCredits);

      loadDraft({
        title: title.trim(),
        targetRole: targetRole.trim(),
        templateId,
        personalInfo: generated.personalInfo,
        recipient: generated.recipient,
        body: generated.body,
        closing: generated.closing,
      });

      onClose();
      navigate("/cover-letter/draft/edit");
    } catch (err) {
      console.error(err);

      const message = getAiErrorMessage(
        err,
        "Failed to generate cover letter. Please try again.",
      );

      setError(message);

      // A 403 here means credits ran out between opening the modal and
      // submitting (e.g. another tab) — refresh so the form locks too.
      if ((err as any)?.response?.status === 403) {
        getCoverLetterAiCredits().then(setCredits).catch(() => {});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Cover Letter with AI"
      description="Give the AI a job description (or company details) and your resume — it drafts the letter for you."
      size="lg"
    >
      <div className="space-y-6">
        {/* Credits banner */}
        {!creditsLoading && credits && (
          <div
            className={`rounded-xl p-3 xs:p-4 text-xs xs:text-sm ${
              outOfCredits
                ? "bg-red-600/10 text-red-600"
                : "bg-green-700/10 text-green-700"
            }`}
          >
            {outOfCredits ? (
              <div className="flex items-center gap-2">
                <Lock size={16} className="shrink-0" />
                <span>
                  You've used all {credits.limit} free AI generations. Buy
                  more credits to continue.
                </span>
              </div>
            ) : (
              <span>
                {credits.remaining} of {credits.limit} free AI generations
                left (regenerate uses these too).
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
          <Input
            label="Cover Letter Name"
            placeholder="Nexora Full Stack Cover Letter"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <SuggestInput
            label="Target Role"
            placeholder="Full Stack Developer"
            emptyHeading="Popular roles"
            value={targetRole}
            onChange={setTargetRole}
            getSuggestions={searchRoles}
          />
        </div>

        {/* Template (optional) */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-heading">
            Template (optional)
          </label>
          <select
            value={templateId}
            onChange={(e) =>
              setTemplateId(e.target.value as CoverLetterTemplate)
            }
            className="h-12 w-full rounded-xl border border-border-navbar bg-navbar-hover px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
          >
            {coverLetterTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Job Description */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-heading">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full min-h-[120px] rounded-xl border border-border-navbar bg-navbar-hover p-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring resize-y"
          />
        </div>

        {/* Company details — shown only when no JD */}
        {!hasJD && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-4">
            <p className="text-sm text-amber-800">
              No job description? Tell us about the company instead.
            </p>
            <Input
              label="Company Name"
              placeholder="Nexora Technologies"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <div>
              <label className="mb-2 block text-sm font-semibold text-heading">
                Company Info (optional)
              </label>
              <textarea
                value={companyInfo}
                onChange={(e) => setCompanyInfo(e.target.value)}
                placeholder="What the company does, its mission, etc."
                className="w-full min-h-[80px] rounded-xl border border-border-navbar bg-navbar-hover p-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring resize-y"
              />
            </div>
          </div>
        )}

        {/* Resume source */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-heading">
            Base this on
          </label>

          <div className="mb-3 flex flex-col xs:flex-row gap-2">
            <button
              type="button"
              onClick={() => setResumeSource("existing")}
              className={`flex-1 rounded-xl border px-3 xs:px-4 py-2 text-xs xs:text-sm font-semibold transition ${
                resumeSource === "existing"
                  ? "border-border-strong bg-btn-hover-bg text-heading"
                  : "border-border-navbar text-nav-text"
              }`}
            >
              <FileText size={16} className="mr-2 inline" />
              Select Existing Resume
            </button>
            <button
              type="button"
              onClick={() => setResumeSource("upload")}
              className={`flex-1 rounded-xl border px-3 xs:px-4 py-2 text-xs xs:text-sm font-semibold transition ${
                resumeSource === "upload"
                  ? "border-border-strong bg-btn-hover-bg text-heading"
                  : "border-border-navbar text-nav-text"
              }`}
            >
              <UploadCloud size={16} className="mr-2 inline" />
              Upload New Resume
            </button>
          </div>

          {resumeSource === "existing" ? (
            <select
              value={resumeId}
              onChange={(e) => {
                setResumeId(e.target.value);

                // Saves typing: use that resume's target role, unless the
                // user has already typed or picked one.
                const role = resumes
                  .find((r) => r._id === e.target.value)
                  ?.targetRole?.trim();
                if (role) setTargetRole((current) => current.trim() || role);
              }}
              className="h-12 w-full rounded-xl border border-border-navbar bg-navbar-hover px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
            >
              <option value="">
                {resumesLoading ? "Loading resumes..." : "Select a resume"}
              </option>
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title}
                </option>
              ))}
            </select>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) =>
                  handleFileSelect(e.target.files?.[0] ?? null)
                }
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-6 text-sm text-nav-text hover:border-border-strong"
              >
                <UploadCloud size={18} />
                {resumeFile ? resumeFile.name : "Click to upload a PDF resume"}
              </button>
              <p className="mt-1 text-xs text-nav-text">
                Used only to generate this letter — it won't be saved as a
                resume.
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-xs xs:text-sm text-red-600">{error}</p>}

        <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 xs:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="text-xs xs:text-sm"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || outOfCredits}
            className="text-xs xs:text-sm"
          >
            <Sparkles size={16} className="mr-2 inline" />
            {loading
              ? "Generating..."
              : outOfCredits
                ? "Buy Credits to Continue"
                : "Create with AI"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
