import { useMemo, useState } from "react";
import { SearchX, Star, X } from "lucide-react";

import {
  templates,
  type TemplateOption,
  type Domain,
  type ExperienceLevel,
} from "../features/resume/config/templates";
import CreateResumeModal from "../features/resume/components/CreateResumeModal";

import { useAuthStore } from "../store/auth.store";
import { redirectToLogin } from "../config/auth.config";

const DOMAIN_TABS: { label: string; value: Domain | "all" }[] = [
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

export default function TemplateGalleryPage() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateOption | null>(null);
  const [domainFilter, setDomainFilter] = useState<Domain | "all">("all");
  const [levelFilter, setLevelFilter] = useState<ExperienceLevel | "all">(
    "all",
  );

  const hasActiveFilters = domainFilter !== "all" || levelFilter !== "all";

  const clearFilters = () => {
    setDomainFilter("all");
    setLevelFilter("all");
  };

  const handleTemplateClick = (template: TemplateOption) => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setSelectedTemplate(template);
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesDomain =
        domainFilter === "all" || template.domain.includes(domainFilter);

      const matchesLevel =
        levelFilter === "all" || template.experienceLevel.includes(levelFilter);

      return matchesDomain && matchesLevel;
    });
  }, [domainFilter, levelFilter]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-display sm:text-3xl">
          Choose a template
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-subheading sm:text-base">
          Every layout is ATS-friendly. You can switch templates anytime in the
          editor.
        </p>
      </div>

      {/* Domain tabs */}
      <div className="mb-5 overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max justify-start gap-6 sm:justify-center sm:gap-8">
          {DOMAIN_TABS.map((tab) => {
            const active = domainFilter === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setDomainFilter(tab.value)}
                aria-pressed={active}
                className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors sm:text-base ${
                  active
                    ? "border-btn text-heading"
                    : "border-transparent text-nav-text hover:text-heading"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level + count */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-border bg-navbar p-1">
          {LEVEL_OPTIONS.map((option) => {
            const active = levelFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setLevelFilter(option.value)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
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

        <div className="flex items-center gap-4 text-sm text-nav-text">
          <span>
            {filteredTemplates.length} of {templates.length} templates
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 font-medium text-subheading transition hover:text-heading"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center px-4 py-16 text-center">
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
        <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <button
              key={template.slug}
              type="button"
              onClick={() => handleTemplateClick(template)}
              className="group flex h-full flex-col justify-start text-left focus:outline-none"
            >
              {/* Preview */}
              <div className="relative overflow-hidden rounded-xl border border-border-popup bg-popup shadow-sm transition-shadow duration-200 group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-ring">
                <img
                  src={template.image}
                  alt={`${template.name} resume preview`}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[210/297] w-full object-cover object-top"
                />

                {template.featured && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                    <Star size={12} fill="currentColor" />
                    Featured
                  </span>
                )}

                {/* Hover action */}
                <div className="absolute inset-0 flex items-end justify-center bg-black/0 p-4 opacity-0 transition duration-200 group-hover:bg-black/10 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="rounded-lg bg-popup px-5 py-2.5 text-sm font-semibold text-heading shadow-lg">
                    Use this template
                  </span>
                </div>
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
            </button>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <CreateResumeModal
          open
          onClose={() => setSelectedTemplate(null)}
          templateId={selectedTemplate.id}
          templateName={selectedTemplate.name}
          templatePreview={selectedTemplate.image}
        />
      )}
    </div>
  );
}
