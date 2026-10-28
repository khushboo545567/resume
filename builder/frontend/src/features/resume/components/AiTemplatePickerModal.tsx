import { useMemo, useState } from "react";
import { Loader2, SearchX, Star } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import {
  templates,
  type Domain,
  type ExperienceLevel,
  type TemplateOption,
} from "../config/templates";
import type { ResumeTemplate } from "../types/resume.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (templateId: ResumeTemplate) => void;
  /** True while the resume is being created. Blocks closing and picking. */
  loading?: boolean;
  error?: string | null;
}

const DOMAIN_OPTIONS: { label: string; value: Domain | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Full Stack", value: "full-stack" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "AI", value: "ai" },
  { label: "Data Science", value: "data-science" },
  { label: "Cloud", value: "cloud" },
];

const LEVEL_OPTIONS: { label: string; value: ExperienceLevel | "all" }[] = [
  { label: "All levels", value: "all" },
  { label: "Fresher", value: "fresher" },
  { label: "Experienced", value: "experienced" },
];

/**
 * Small template picker opened by "Create Resume with AI". Picking a template
 * creates the resume and sends the user on to the AI form.
 */
export default function AiTemplatePickerModal({
  open,
  onClose,
  onSelect,
  loading = false,
  error,
}: Props) {
  const [domain, setDomain] = useState<Domain | "all">("all");
  const [level, setLevel] = useState<ExperienceLevel | "all">("all");
  const [pickedSlug, setPickedSlug] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      templates.filter(
        (template) =>
          (domain === "all" || template.domain.includes(domain)) &&
          (level === "all" || template.experienceLevel.includes(level)),
      ),
    [domain, level],
  );

  const handlePick = (template: TemplateOption) => {
    if (loading) return;

    setPickedSlug(template.slug);
    onSelect(template.id);
  };

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Pick a template"
      description="The AI fills it in next. You can switch templates anytime in the editor."
      size="lg"
    >
      {/* Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DOMAIN_OPTIONS.map((option) => {
            const active = domain === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setDomain(option.value)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
                  active
                    ? "border-btn bg-btn text-btn-text"
                    : "border-border bg-navbar text-nav-text hover:text-heading"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="inline-flex rounded-full border border-border bg-navbar p-1">
          {LEVEL_OPTIONS.map((option) => {
            const active = level === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setLevel(option.value)}
                aria-pressed={active}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition sm:text-sm ${
                  active
                    ? "bg-btn text-btn-text"
                    : "text-nav-text hover:text-heading"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-600/10 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center px-4 py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-btn-hover-bg text-subheading">
            <SearchX size={22} />
          </div>
          <p className="font-semibold text-heading">
            No templates match these filters
          </p>
          <button
            type="button"
            onClick={() => {
              setDomain("all");
              setLevel("all");
            }}
            className="mt-4 h-10 rounded-xl bg-btn px-5 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4">
          {filtered.map((template) => {
            const isPicked = loading && pickedSlug === template.slug;

            return (
              <button
                key={template.slug}
                type="button"
                onClick={() => handlePick(template)}
                disabled={loading}
                className="group flex min-w-0 flex-col text-left focus:outline-none disabled:cursor-not-allowed"
              >
                <div
                  className={`relative overflow-hidden rounded-lg border bg-popup shadow-sm transition-shadow group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring ${
                    isPicked ? "border-border-strong ring-2 ring-ring" : "border-border-popup"
                  } ${loading && !isPicked ? "opacity-50" : ""}`}
                >
                  <img
                    src={template.image}
                    alt={`${template.name} resume preview`}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[210/297] w-full object-cover object-top"
                  />

                  {template.featured && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                      <Star size={10} fill="currentColor" />
                      Featured
                    </span>
                  )}

                  {isPicked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-popup/70">
                      <Loader2 size={24} className="animate-spin text-heading" />
                    </div>
                  )}
                </div>

                <h3 className="mt-2 truncate text-sm font-semibold text-heading">
                  {template.name}
                </h3>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
