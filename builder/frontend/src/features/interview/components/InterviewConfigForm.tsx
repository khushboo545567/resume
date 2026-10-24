import { useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { useResumes } from "../../resume/hooks/useResumes";
import { useUploadAndParseResume } from "../../resume/hooks/useUploadAndParseResume";

import type {
  Difficulty,
  QuestionCount,
  QuestionType,
  StartInterviewPayload,
} from "../types/interview.types";

interface InterviewConfigFormProps {
  onSubmit: (payload: StartInterviewPayload) => void;
  submitting: boolean;
}

const QUESTION_TYPES: {
  value: QuestionType;
  label: string;
  hint: string;
}[] = [
  { value: "mixed", label: "Mixed", hint: "A bit of everything" },
  { value: "technical", label: "Technical", hint: "Skills & problem solving" },
  { value: "hr", label: "HR", hint: "Fit, goals & expectations" },
  { value: "behavioral", label: "Behavioral", hint: "Past experience stories" },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const QUESTION_COUNTS: QuestionCount[] = [5, 10, 15];

const fieldClass =
  "w-full rounded-xl border border-border bg-navbar px-4 py-3 text-sm text-heading placeholder:text-heading/40 transition focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring";

/* ---------- small layout helpers ---------- */

function Section({
  step,
  icon,
  title,
  description,
  children,
}: {
  step: number;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-popup bg-popup p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-btn-hover-bg text-subheading">
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Step {step}
          </p>
          <h2 className="text-lg font-semibold text-heading">{title}</h2>
          <p className="text-sm text-nav-text">{description}</p>
        </div>
      </div>

      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  optional,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-heading">
        {label}
        {required && <span className="text-red-600">*</span>}
        {optional && (
          <span className="text-xs font-normal text-heading/50">Optional</span>
        )}
      </label>

      {children}

      {hint && <p className="mt-1.5 text-xs text-heading/50">{hint}</p>}
    </div>
  );
}

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  format,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  format?: (value: T) => string;
}) {
  return (
    <div className="inline-flex w-full rounded-xl border border-border bg-navbar p-1 sm:w-auto">
      {options.map((option) => {
        const active = option === value;

        return (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={`flex-1 rounded-lg px-5 py-2 text-sm font-medium transition sm:flex-none ${
              active
                ? "bg-btn text-btn-text shadow-sm"
                : "text-nav-text hover:bg-btn-hover-bg hover:text-heading"
            }`}
          >
            {format ? format(option) : String(option)}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- form ---------- */

export default function InterviewConfigForm({
  onSubmit,
  submitting,
}: InterviewConfigFormProps) {
  const { resumes, loading: loadingResumes } = useResumes();
  const uploadAndParse = useUploadAndParseResume();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeId, setResumeId] = useState("");
  const [uploadedName, setUploadedName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [preparationNotes, setPreparationNotes] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("mixed");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [totalQuestions, setTotalQuestions] = useState<QuestionCount>(5);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const resume = await uploadAndParse.mutateAsync({ file });

    // Newly uploaded resume is saved to the user's resumes and selected.
    setResumeId(resume._id);
    setUploadedName(file.name);

    // Allow re-selecting the same file later.
    e.target.value = "";
  };

  const canSubmit =
    resumeId.trim().length > 0 &&
    targetRole.trim().length > 0 &&
    !submitting &&
    !uploadAndParse.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    onSubmit({
      resumeId,
      targetRole: targetRole.trim(),
      jobDescription: jobDescription.trim() || undefined,
      preparationNotes: preparationNotes.trim() || undefined,
      questionType,
      difficulty,
      totalQuestions,
    });
  };

  const missing = !resumeId
    ? "Select or upload a resume to continue"
    : !targetRole.trim()
      ? "Enter your target role to continue"
      : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 1: Resume */}
      <Section
        step={1}
        icon={<FileText size={20} />}
        title="Your resume"
        description="Questions are built from your experience, so pick the resume you'll actually send."
      >
        <Field label="Saved resume" required>
          <select
            value={resumeId}
            onChange={(e) => {
              setResumeId(e.target.value);
              setUploadedName("");
            }}
            disabled={loadingResumes}
            className={fieldClass}
          >
            <option value="">
              {loadingResumes ? "Loading resumes..." : "Select a saved resume"}
            </option>

            {resumes.map((resume) => (
              <option key={resume._id} value={resume._id}>
                {resume.title || "Untitled resume"}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-center gap-3 text-xs text-heading/40">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadAndParse.isPending}
          className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-navbar/60 px-4 py-6 text-center transition hover:border-border-strong hover:bg-btn-hover-bg disabled:opacity-60"
        >
          {uploadAndParse.isPending ? (
            <Loader2 size={22} className="animate-spin text-subheading" />
          ) : uploadedName ? (
            <CheckCircle2 size={22} className="text-green-600" />
          ) : (
            <UploadCloud size={22} className="text-subheading" />
          )}

          <span className="text-sm font-medium text-heading">
            {uploadAndParse.isPending
              ? "Reading your resume..."
              : uploadedName
                ? `${uploadedName} added and selected`
                : "Upload a new resume"}
          </span>

          <span className="text-xs text-heading/50">
            PDF, DOC or DOCX. It will be saved to your resumes.
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {uploadAndParse.isError && (
          <p className="text-xs text-red-500">
            Couldn't upload that file. Please try again.
          </p>
        )}
      </Section>

      {/* Step 2: Role */}
      <Section
        step={2}
        icon={<Briefcase size={20} />}
        title="The role"
        description="The more context you give, the more relevant the questions."
      >
        <Field label="Target role" required>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Frontend Developer, Data Analyst"
            className={fieldClass}
          />
        </Field>

        <Field
          label="Job description"
          optional
          hint="Paste it from the job post for questions that match the role."
        >
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            placeholder="Paste the job description here"
            className={`${fieldClass} resize-none`}
          />
        </Field>

        <Field label="What do you want to focus on?" optional>
          <textarea
            value={preparationNotes}
            onChange={(e) => setPreparationNotes(e.target.value)}
            rows={3}
            placeholder="e.g. More system design, I'm weak in SQL"
            className={`${fieldClass} resize-none`}
          />
        </Field>
      </Section>

      {/* Step 3: Settings */}
      <Section
        step={3}
        icon={<Sparkles size={20} />}
        title="Interview settings"
        description="Choose the style and length of your mock interview."
      >
        <Field label="Question type">
          <div className="grid grid-cols-2 gap-3">
            {QUESTION_TYPES.map((option) => {
              const active = questionType === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setQuestionType(option.value)}
                  aria-pressed={active}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-border-strong bg-btn-hover-bg ring-1 ring-border-strong"
                      : "border-border bg-navbar hover:border-border-strong"
                  }`}
                >
                  <span className="block text-sm font-semibold text-heading">
                    {option.label}
                  </span>
                  <span className="block text-xs text-nav-text">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Difficulty">
            <Segmented
              options={DIFFICULTIES.map((d) => d.value)}
              value={difficulty}
              onChange={setDifficulty}
              format={(v) => DIFFICULTIES.find((d) => d.value === v)!.label}
            />
          </Field>

          <Field label="Number of questions">
            <Segmented
              options={QUESTION_COUNTS}
              value={totalQuestions}
              onChange={setTotalQuestions}
            />
          </Field>
        </div>
      </Section>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-btn px-6 font-semibold text-btn-text transition hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating your first question...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Start interview
            </>
          )}
        </button>

        {missing && !submitting && (
          <p className="mt-2 text-center text-xs text-heading/50">{missing}</p>
        )}
      </div>
    </form>
  );
}
