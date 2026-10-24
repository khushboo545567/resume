import { useState } from "react";
import { Sparkles } from "lucide-react";

import { coverLetterTemplates } from "../features/coverLetter/config/coverLetterTemplates";
import CreateCoverLetterModal from "../features/coverLetter/components/CreateCoverLetterModal";
import GenerateCoverLetterWithAiModal from "../features/coverLetter/components/GenerateCoverLetterWithAiModal";
import type { CoverLetterTemplate } from "../features/coverLetter/types/coverLetter.types";

export default function CoverLetterGalleryPage() {
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<CoverLetterTemplate | null>(null);

  const [aiModalOpen, setAiModalOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:text-left">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">
            Choose a Cover Letter Template
          </h1>
          <p className="text-sm sm:text-base text-subheading">
            Pick a template to start writing your cover letter
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAiModalOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-btn px-5 py-3 text-sm sm:text-base font-semibold text-btn-text transition hover:bg-btn-hover"
        >
          <Sparkles size={18} />
          Create Cover Letter with AI
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {coverLetterTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplateId(template.id)}
            className={`relative text-left border border-border-popup rounded-xl p-5 transition hover:shadow-lg hover:-translate-y-0.5 ${template.color}`}
          >
            <div className="mb-4 flex justify-center">
              <div className="overflow-hidden rounded-lg border border-border-popup bg-white shadow-md">
                <img
                  src={template.thumbnail}
                  alt={`${template.name} cover letter preview`}
                  width={700}
                  height={990}
                  loading="lazy"
                  className="block h-auto w-48"
                />
              </div>
            </div>
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <p className="text-sm text-subheading mt-1">{template.description}</p>
          </button>
        ))}
      </div>

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
