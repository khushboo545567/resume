import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Modal from "../../../components/ui/Modal";
import { templates } from "../config/templates";
import { useDuplicateResume } from "../hooks/useDuplicateResume";
import type { ResumeTemplate } from "../types/resume.types";

interface Props {
  open: boolean;
  onClose: () => void;
  resumeId: string;
  currentTemplateId: string;
}

export default function DuplicateResumeModal({
  open,
  onClose,
  resumeId,
  currentTemplateId,
}: Props) {
  const navigate = useNavigate();
  const duplicateMutation = useDuplicateResume();
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<ResumeTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sortedTemplates = useMemo(() => {
    return [...templates].sort((a, b) => {
      if (a.id === currentTemplateId) return -1;
      if (b.id === currentTemplateId) return 1;
      return 0;
    });
  }, [currentTemplateId]);

  const handleSelect = async (templateId: ResumeTemplate) => {
    if (duplicateMutation.isPending) return;

    setError(null);
    setSelectedTemplateId(templateId);

    try {
      const resume = await duplicateMutation.mutateAsync({
        id: resumeId,
        templateId,
      });

      onClose();
      navigate(`/resume/${resume._id}/edit`);
    } catch (err) {
      console.error(err);
      setError("Failed to duplicate resume. Please try again.");
    }
  };

  const handleClose = () => {
    if (duplicateMutation.isPending) return;
    setError(null);
    setSelectedTemplateId(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Duplicate Resume"
      description="Choose a template for the copy. Content stays the same."
      size="xl"
    >
      {error && (
        <p className="mb-4 rounded-lg bg-red-600/10 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid max-h-[70vh] grid-cols-1 gap-5 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
        {sortedTemplates.map((template) => {
          const isCurrent = template.id === currentTemplateId;
          const isLoading =
            duplicateMutation.isPending && selectedTemplateId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              disabled={duplicateMutation.isPending}
              onClick={() => handleSelect(template.id)}
              className={`relative text-left border rounded-xl p-5 transition hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 ${template.color} ${
                isCurrent
                  ? "border-border-strong ring-2 ring-ring"
                  : "border-border-popup"
              }`}
            >
              {isCurrent && (
                <span className="absolute top-3 right-3 text-xs font-medium bg-btn text-btn-text px-2 py-0.5 rounded-full">
                  Current template
                </span>
              )}

              {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-popup/70">
                  <Loader2 className="h-8 w-8 animate-spin text-subheading" />
                </div>
              )}

              <div className="mb-4 flex justify-center">
                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                  <img
                    src={template.image}
                    alt={template.name}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[210/297] w-full object-cover object-top"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <span className="inline-block mt-3 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                {template.ats}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
