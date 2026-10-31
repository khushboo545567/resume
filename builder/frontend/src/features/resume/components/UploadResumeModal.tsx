import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  FileText,
  Loader2,
  UploadCloud,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";
import { templates } from "../config/templates";
import { useUploadAndParseResume } from "../hooks/useUploadAndParseResume";
import { isOutOfCreditsError } from "../../../api/axios";
import { UploadCreditsHint } from "../../pricing/components/CreditHints";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Step = "upload" | "template";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, matches backend limit

const STEPS = ["Upload PDF", "Choose design", "Edit"];

// Pre-selected so the user can convert in one click if they don't care.
const DEFAULT_TEMPLATE_SLUG = (templates.find((t) => t.featured) ?? templates[0])
  .slug;

function Stepper({ current }: { current: number }) {
  return (
    <ol className="mb-6 flex items-center gap-2 text-xs font-semibold sm:text-sm">
      {STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                done || active
                  ? "bg-btn text-btn-text"
                  : "bg-btn-hover-bg text-nav-text"
              }`}
            >
              {done ? <Check size={13} strokeWidth={3} /> : index + 1}
            </span>

            <span
              className={`truncate ${
                active ? "text-heading" : "text-nav-text"
              }`}
            >
              {label}
            </span>

            {index < STEPS.length - 1 && (
              <span className="h-px min-w-3 flex-1 bg-border-popup" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function UploadResumeModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const uploadMutation = useUploadAndParseResume();

  const [step, setStep] = useState<Step>("upload");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTemplate = templates.find((t) => t.slug === selectedSlug);
  const isPending = uploadMutation.isPending;

  const resetState = () => {
    setStep("upload");
    setSelectedSlug(null);
    setSelectedFile(null);
    setError(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    if (isPending) return;
    resetState();
    onClose();
  };

  const validateAndSetFile = (file: File | undefined) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("PDF must be 5MB or smaller.");
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetFile(e.target.files?.[0]);
    // Allow picking the same file again after going back.
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const goToTemplates = () => {
    if (!selectedFile) return;

    setError(null);
    setSelectedSlug((current) => current ?? DEFAULT_TEMPLATE_SLUG);
    setStep("template");
  };

  const handleConvert = async () => {
    if (!selectedFile || !selectedTemplate) return;

    setError(null);

    try {
      const resume = await uploadMutation.mutateAsync({
        file: selectedFile,
        templateId: selectedTemplate.id,
      });

      resetState();
      onClose();
      navigate(`/resume/${resume._id}/edit`);
    } catch (err) {
      console.error(err);
      // No credits: the app-wide "buy credits" prompt is already showing.
      if (isOutOfCreditsError(err)) return;
      setError("We couldn't read this PDF. Please check the file and try again.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Import your existing resume"
      description={
        step === "upload"
          ? "Upload your PDF and pick a design. We'll move your details into it, ready to edit."
          : "Choose a design. You can change it any time in the editor."
      }
      size={step === "upload" ? "md" : "xl"}
    >
      <Stepper current={step === "upload" ? 0 : 1} />

      {error && (
        <p className="mb-4 rounded-lg bg-red-600/10 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {step === "template" && (
        <div className="mb-4">
          <UploadCreditsHint />
        </div>
      )}

      {/* ============ STEP 1: UPLOAD ============ */}

      {step === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleFileInputChange}
          />

          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition ${
              isDragging
                ? "border-border-strong bg-btn-hover-bg/50"
                : "border-border hover:border-border-strong"
            }`}
          >
            {selectedFile ? (
              <>
                <FileText size={32} className="text-subheading" />
                <p className="text-sm font-medium text-heading">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-heading/60">
                  Click or drop another file to replace it
                </p>
              </>
            ) : (
              <>
                <UploadCloud size={32} className="text-heading/50" />
                <p className="text-sm font-medium text-heading">
                  Drop your resume PDF here, or click to browse
                </p>
                <p className="text-xs text-heading/60">
                  PDF only, up to 5 MB. We read it and fill in the template
                  for you.
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={goToTemplates}
            disabled={!selectedFile}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-btn px-5 py-3 text-sm font-semibold text-btn-text transition hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue: choose a design
          </button>
        </div>
      )}

      {/* ============ STEP 2: CHOOSE DESIGN ============ */}

      {step === "template" && (
        <div>
          {/* File summary */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-popup bg-navbar px-4 py-3">
            <div className="flex min-w-0 items-center gap-2 text-sm text-heading">
              <FileText size={18} className="shrink-0 text-subheading" />
              <span className="truncate font-medium">{selectedFile?.name}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep("upload");
                setError(null);
              }}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-nav-text hover:text-heading disabled:opacity-50"
            >
              <ArrowLeft size={16} />
              Change file
            </button>
          </div>

          {/* Designs */}
          <div className="grid max-h-[45vh] grid-cols-2 gap-4 overflow-y-auto p-1 sm:grid-cols-3 lg:grid-cols-4">
            {templates.map((template) => {
              const selected = template.slug === selectedSlug;

              return (
                <button
                  key={template.slug}
                  type="button"
                  disabled={isPending}
                  aria-pressed={selected}
                  onClick={() => setSelectedSlug(template.slug)}
                  className={`relative rounded-xl border bg-popup p-2 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    selected
                      ? "border-btn ring-2 ring-ring"
                      : "border-border-popup hover:-translate-y-0.5 hover:shadow-lg"
                  }`}
                >
                  <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <img
                      src={template.image}
                      alt={`${template.name} resume preview`}
                      loading="lazy"
                      className="block aspect-[210/297] w-full object-cover object-top"
                    />
                  </div>

                  {selected && (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-btn text-btn-text shadow">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}

                  <p className="mt-2 line-clamp-1 text-sm font-semibold text-heading">
                    {template.name}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-green-700/10 px-2 py-0.5 text-[11px] font-medium text-green-700">
                    {template.ats}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action */}
          <div className="mt-5 border-t border-border-popup pt-5">
            <button
              type="button"
              onClick={handleConvert}
              disabled={!selectedTemplate || isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-btn px-5 py-3 text-sm font-semibold text-btn-text transition hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Reading your resume and building it in{" "}
                  {selectedTemplate?.name}...
                </>
              ) : (
                `Convert to ${selectedTemplate?.name ?? "this design"}`
              )}
            </button>

            {isPending && (
              <p className="mt-3 text-center text-xs text-heading/60">
                This can take a little while. Please keep this window open.
              </p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
