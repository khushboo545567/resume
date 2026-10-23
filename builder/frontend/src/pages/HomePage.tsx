import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  templates,
  type Domain,
  type ExperienceLevel,
  type TemplateOption,
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

type OpenMenu = "level" | "domain" | null;

function getColumnCount(width: number) {
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
}

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<ResumeTemplate | null>(null);

  const [experienceFilter, setExperienceFilter] = useState<
    ExperienceLevel | "all"
  >("all");
  const [domainFilter, setDomainFilter] = useState<Domain[]>([]);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [columns, setColumns] = useState(() =>
    getColumnCount(typeof window !== "undefined" ? window.innerWidth : 1280),
  );

  useEffect(() => {
    const handleResize = () => setColumns(getColumnCount(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterBarRef.current &&
        !filterBarRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu: OpenMenu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const toggleDomain = (domain: Domain) => {
    setDomainFilter((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain],
    );
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

  const heroTemplates = filteredTemplates.slice(0, columns);
  const remainingTemplates = filteredTemplates.slice(columns);

  const handleTemplateClick = (templateId: ResumeTemplate) => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }
    setSelectedTemplateId(templateId);
  };

  const levelLabel =
    EXPERIENCE_OPTIONS.find((opt) => opt.value === experienceFilter)?.label ??
    "All levels";
  const domainLabel =
    domainFilter.length === 0 ? "Domain" : `Domain (${domainFilter.length})`;

  const renderTemplateCard = (template: TemplateOption) => (
    <button
      key={template.slug}
      onClick={() => handleTemplateClick(template.id)}
      className={`relative text-left border border-border-popup rounded-xl p-1.5 sm:p-2 bg-navbar transition hover:shadow-lg hover:-translate-y-0.5 ${template.color}`}
    >
      {template.featured && (
        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[10px] sm:text-[11px] font-medium bg-btn text-btn-text px-2 py-0.5 rounded-full">
          Featured
        </span>
      )}
      <div className="mb-3 sm:mb-4 flex justify-center">
        <div className="overflow-hidden rounded-lg bg-navbar-hover shadow-md">
          <img
            src={template.image}
            alt={template.name}
            className="w-full h-auto block"
          />
        </div>
      </div>
      <h3 className="font-semibold text-sm md:text-lg text-heading">
        {template.name}
      </h3>
      <p className="text-xs sm:text-sm text-subheading mt-1 line-clamp-2">
        {template.description}
      </p>
      <span className="inline-block mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-medium text-green-700 bg-green-700/10 px-2 py-0.5 rounded-full">
        {template.ats}
      </span>
    </button>
  );

  return (
    <div className="bg-background">
      <div className="flex flex-col justify-center px-4 py-8 sm:px-6 lg:h-screen lg:py-0">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-display">
            Build Your Resume with{" "}
            <span className="text-accent">ResumeAI</span>
          </h1>
          <p className="text-sm text-subheading mt-2 max-w-xl mx-auto">
            Choose an ATS-friendly template matched to your experience level and
            domain, then let our AI help you fill it in and land more
            interviews.
          </p>
        </div>
        <div
          ref={filterBarRef}
          className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {/* Level dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("level")}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors sm:rounded-none sm:border-0 sm:border-b-2 sm:px-0 sm:py-0 sm:pb-1 ${
                openMenu === "level" || experienceFilter !== "all"
                  ? "border-border-strong bg-navbar-hover text-heading sm:bg-transparent sm:border-heading"
                  : "border-border bg-navbar text-heading hover:text-subheading sm:bg-transparent sm:border-transparent"
              }`}
            >
              {levelLabel === "All levels" ? "Level" : levelLabel}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  openMenu === "level" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "level" && (
              <div className="absolute left-0 top-full mt-2 w-48 rounded-lg border border-border-popup bg-popup shadow-lg py-2">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setExperienceFilter(opt.value);
                      setOpenMenu(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      experienceFilter === opt.value
                        ? "text-heading font-medium"
                        : "text-subheading hover:bg-btn-hover-bg"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Domain dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("domain")}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors sm:rounded-none sm:border-0 sm:border-b-2 sm:px-0 sm:py-0 sm:pb-1 ${
                openMenu === "domain" || domainFilter.length > 0
                  ? "border-border-strong bg-navbar-hover text-heading sm:bg-transparent sm:border-heading"
                  : "border-border bg-navbar text-heading hover:text-subheading sm:bg-transparent sm:border-transparent"
              }`}
            >
              {domainLabel}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  openMenu === "domain" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "domain" && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-border-popup bg-popup shadow-lg py-2">
                {DOMAIN_OPTIONS.map((opt) => {
                  const active = domainFilter.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleDomain(opt.value)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        active
                          ? "text-heading font-medium"
                          : "text-subheading hover:bg-btn-hover-bg"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
                {domainFilter.length > 0 && (
                  <>
                    <div className="my-1 h-px bg-border-popup" />
                    <button
                      onClick={() => setDomainFilter([])}
                      className="w-full text-left px-4 py-2 text-sm text-nav-text hover:bg-btn-hover-bg"
                    >
                      Clear domain
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] sm:text-xs text-nav-text mb-4 sm:mb-6">
          {filteredTemplates.length} of {templates.length} templates
        </p>
        {filteredTemplates.length === 0 ? (
          <p className="text-center text-sm text-nav-text">
            No templates match the selected filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto w-full">
            {heroTemplates.map(renderTemplateCard)}
          </div>
        )}
        {remainingTemplates.length > 0 && (
          <p className="text-center text-[10px] text-nav-text mt-6">
            Scroll down for more templates ↓
          </p>
        )}
      </div>

      {remainingTemplates.length > 0 && (
        <div className="px-4 sm:px-6 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
            {remainingTemplates.map(renderTemplateCard)}
          </div>
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
