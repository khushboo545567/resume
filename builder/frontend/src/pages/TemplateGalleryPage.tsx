import { useMemo, useState } from "react";
import { ArrowRight, SearchX, Star, X } from "lucide-react";

import {
  templates,
  type Domain,
  type ExperienceLevel,
} from "../features/resume/config/templates";
import CreateResumeModal from "../features/resume/components/CreateResumeModal";
import type { ResumeTemplate } from "../features/resume/types/resume.types";

import { useAuthStore } from "../store/auth.store";
import { redirectToLogin } from "../config/auth.config";

const EXPERIENCE_OPTIONS: { label: string; value: ExperienceLevel | "all" }[] =
  [
    { label: "All levels", value: "all" },
    { label: "Fresher", value: "fresher" },
    { label: "Experienced", value: "experienced" },
  ];

const DOMAIN_OPTIONS: { label: string; value: Domain }[] = [
  { label: "Full Stack", value: "full-stack" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "AI", value: "ai" },
  { label: "Data Science", value: "data-science" },
  { label: "Cloud", value: "cloud" },
];

const DOMAIN_LABELS = Object.fromEntries(
  DOMAIN_OPTIONS.map((option) => [option.value, option.label]),
) as Record<Domain, string>;

const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  fresher: "Fresher",
  experienced: "Experienced",
};

const chipClass = (active: boolean) =>
  `rounded-full px-4 py-1.5 text-sm font-medium transition ${
    active
      ? "bg-btn text-btn-text"
      : "border border-border bg-navbar text-nav-text hover:border-border-strong hover:text-heading"
  }`;

export default function TemplateGalleryPage() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const [selectedTemplateId, setSelectedTemplateId] =
    useState<ResumeTemplate | null>(null);
  const [experienceFilter, setExperienceFilter] = useState<
    ExperienceLevel | "all"
  >("all");
  const [domainFilter, setDomainFilter] = useState<Domain[]>([]);

  const hasActiveFilters =
    experienceFilter !== "all" || domainFilter.length > 0;

  const handleTemplateClick = (templateId: ResumeTemplate) => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setSelectedTemplateId(templateId);
  };

  const toggleDomain = (domain: Domain) => {
    setDomainFilter((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain],
    );
  };

  const clearFilters = () => {
    setExperienceFilter("all");
    setDomainFilter([]);
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesExperience =
        experienceFilter === "all" ||
        template.experienceLevel.includes(experienceFilter);

      const matchesDomain =
        domainFilter.length === 0 ||
        template.domain.some((d) => domainFilter.includes(d));

      return matchesExperience && matchesDomain;
    });
  }, [experienceFilter, domainFilter]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-display sm:text-3xl">
          Choose a template
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-subheading sm:text-base">
          Every layout is ATS-friendly. Pick one that fits your experience and
          domain, then fill it in with AI help. You can switch templates later
          in the editor.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 rounded-2xl border border-border-popup bg-popup p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-accent">
            Experience
          </span>

          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setExperienceFilter(option.value)}
                aria-pressed={experienceFilter === option.value}
                className={chipClass(experienceFilter === option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-accent">
            Domain
          </span>

          <div className="flex flex-wrap gap-2">
            {DOMAIN_OPTIONS.map((option) => {
              const active = domainFilter.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleDomain(option.value)}
                  aria-pressed={active}
                  className={chipClass(active)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <p className="text-sm text-nav-text">
            Showing{" "}
            <span className="font-semibold text-heading">
              {filteredTemplates.length}
            </span>{" "}
            of {templates.length} templates
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-medium text-subheading transition hover:text-heading"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-popup/60 px-4 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-btn-hover-bg text-subheading">
            <SearchX size={22} />
          </div>
          <p className="font-semibold text-heading">
            No templates match these filters
          </p>
          <p className="mt-1 text-sm text-nav-text">
            Try a different combination or clear the filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 h-10 rounded-xl bg-btn px-5 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-5">
          {filteredTemplates.map((template) => (
            <button
              key={template.slug}
              type="button"
              onClick={() => handleTemplateClick(template.id)}
              className="group flex flex-col rounded-2xl border border-border-popup bg-popup p-3 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-border-strong hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Preview */}
              <div className="relative overflow-hidden rounded-xl border border-border bg-background">
                <img
                  src={template.image}
                  alt={`${template.name} resume preview`}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[210/297] w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                />

                {template.featured && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                    <Star size={12} fill="currentColor" />
                    Featured
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="mt-3 flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold leading-snug text-heading">
                  {template.name}
                </h3>

                <span className="shrink-0 rounded-full bg-green-700/10 px-2 py-0.5 text-[11px] font-medium text-green-700">
                  {template.ats}
                </span>
              </div>

              <p className="mt-1 line-clamp-2 text-sm text-nav-text">
                {template.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {template.experienceLevel.map((level) => (
                  <span
                    key={level}
                    className="rounded-md bg-btn-hover-bg px-2 py-0.5 text-[11px] font-medium text-subheading"
                  >
                    {LEVEL_LABELS[level]}
                  </span>
                ))}

                {template.domain.map((domain) => (
                  <span
                    key={domain}
                    className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-nav-text"
                  >
                    {DOMAIN_LABELS[domain]}
                  </span>
                ))}
              </div>

              <span className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-sm font-semibold text-heading">
                Use this template
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedTemplateId && (
        <CreateResumeModal
          open={!!selectedTemplateId}
          onClose={() => setSelectedTemplateId(null)}
          templateId={selectedTemplateId}
        />
      )}
    </div>
  );
}
