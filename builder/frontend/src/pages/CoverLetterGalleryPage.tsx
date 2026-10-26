import { useState } from "react";
import { ArrowRight, FileText, Mail, Sparkles } from "lucide-react";

import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import DashboardSection, {
  dashboardCardGridClass,
} from "../features/dashboard/components/DashboardSection";

import { coverLetterTemplates } from "../features/coverLetter/config/coverLetterTemplates";
import CreateCoverLetterModal from "../features/coverLetter/components/CreateCoverLetterModal";
import GenerateCoverLetterWithAiModal from "../features/coverLetter/components/GenerateCoverLetterWithAiModal";
import type { CoverLetterTemplate } from "../features/coverLetter/types/coverLetter.types";

export default function CoverLetterGalleryPage() {
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<CoverLetterTemplate | null>(null);

  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="min-w-0 space-y-8 sm:space-y-10">
      {/* Banner (same look as the dashboard hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sidebar via-sidebar-hover to-border-sidebar p-6 text-sidebar-text shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-soft">
              <Mail size={13} /> Cover letters
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Write a cover letter that{" "}
              <span className="text-gold-soft">gets read</span>
            </h1>

            <p className="mt-2 text-sm text-sidebar-text/75 sm:text-base">
              Pick a template to write it yourself, or let AI draft the first
              version for you.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-sidebar-text px-5 text-sm font-semibold text-display shadow-lg transition hover:-translate-y-0.5 hover:bg-popup"
          >
            <Sparkles size={17} /> Create with AI
          </button>
        </div>
      </div>

      {/* Templates */}
      <DashboardSection
        title="Choose a template"
        count={coverLetterTemplates.length}
      >
        <div className={dashboardCardGridClass}>
          {coverLetterTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplateId(template.id)}
              className="group min-w-0 text-left"
            >
              <Card className="h-full overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                {/* Preview (same area as the resume and cover letter cards) */}
                <div className="h-64 overflow-hidden bg-linear-to-br from-navbar to-navbar-hover">
                  <div className="flex h-full items-center justify-center">
                    <img
                      src={template.thumbnail}
                      alt={`${template.name} cover letter preview`}
                      width={700}
                      height={990}
                      loading="lazy"
                      className="h-60 w-40 rounded bg-white object-cover object-top shadow"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="line-clamp-1 text-lg font-bold text-heading">
                        {template.name}
                      </h3>
                      <Badge color="green">ATS friendly</Badge>
                    </div>

                    <p className="mt-2 line-clamp-3 text-sm text-nav-text">
                      {template.description}
                    </p>
                  </div>

                  <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-btn px-5 text-sm font-semibold text-btn-text shadow-md transition group-hover:bg-btn-hover">
                    <FileText size={18} />
                    Use this template
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </DashboardSection>

      {selectedTemplateId && (
        <CreateCoverLetterModal
          open={!!selectedTemplateId}
          onClose={() => setSelectedTemplateId(null)}
          templateId={selectedTemplateId}
        />
      )}

      <GenerateCoverLetterWithAiModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  );
}
