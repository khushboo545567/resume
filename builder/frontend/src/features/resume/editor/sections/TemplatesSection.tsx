import { Check } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";
import {
  describeBestFor,
  editorTemplates,
} from "../../config/editorTemplates";

export default function TemplatesSection() {
  const resume = useResumeStore((state) => state.resume);
  const updateTemplate = useResumeStore((state) => state.updateTemplate);

  if (!resume) return null;

  return (
    <div className="w-full min-w-0">
      <p className="text-xs text-heading/60 sm:text-sm">
        Select a template. Changes are applied instantly.
      </p>

      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
        {editorTemplates.map((template) => {
          const active = resume.templateId === template.id;

          return (
            <div
              key={template.id}
              className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-popup text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                active
                  ? "border-border-strong shadow-xl ring-2 ring-ring"
                  : "border-border"
              }`}
            >
              {/* Real screenshot of the template (top of the page) */}
              <div className="h-64 overflow-hidden bg-gradient-to-br from-navbar-hover via-navbar to-popup p-4">
                <img
                  src={template.image}
                  alt={`${template.name} resume preview`}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto h-full w-auto max-w-full rounded-md bg-white object-cover object-top shadow-md"
                />
              </div>

              {/* Content */}
              <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold tracking-tight sm:text-lg">
                        {template.name}
                      </h3>

                      {template.featured && (
                        <span className="shrink-0 rounded-full bg-btn-hover-bg px-2 py-0.5 text-[10px] font-semibold text-heading">
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-nav-text sm:text-sm">
                      {template.description}
                    </p>
                  </div>

                  {active && (
                    <Check
                      className="mt-0.5 shrink-0 text-green-600"
                      size={20}
                    />
                  )}
                </div>

                {/* ATS badge */}
                <div className="mt-3">
                  <span className="inline-block rounded-full bg-btn-hover-bg px-3 py-1 text-xs font-medium">
                    {template.ats}
                  </span>
                </div>

                {/* Best For */}
                <div className="mt-3 rounded-xl bg-navbar p-3">
                  <p className="text-[11px] font-semibold text-nav-text">
                    BEST FOR
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-heading/80 sm:text-sm">
                    {describeBestFor(template)}
                  </p>
                </div>

                <div className="flex-1" />

                {/* Button */}
                <button
                  type="button"
                  onClick={() => updateTemplate(template.id)}
                  className={`mt-4 h-10 w-full rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-btn text-btn-text"
                      : "border border-border hover:bg-btn-hover-bg"
                  }`}
                >
                  {active ? "✓ Selected" : "Use Template"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
