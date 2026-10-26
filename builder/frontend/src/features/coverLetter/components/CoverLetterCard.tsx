import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Mail, Trash2 } from "lucide-react";

import DeleteCoverLetterModal from "./DeleteCoverLetterModal";
import { useDeleteCoverLetter } from "../hooks/useDeleteCoverLetter";

import type { CoverLetter } from "../types/coverLetter.types";

interface Props {
  coverLetter: CoverLetter;
}

export default function CoverLetterCard({ coverLetter }: Props) {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useDeleteCoverLetter();

  const title = coverLetter.title || "Untitled cover letter";
  const company = coverLetter.recipient?.companyName;
  const subtitle = [coverLetter.targetRole, company].filter(Boolean).join(" · ");

  const handleDelete = () => {
    deleteMutation.mutate(coverLetter._id, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

  return (
    <div className="relative min-w-0 rounded-2xl border border-border-popup bg-navbar shadow-sm transition-shadow duration-200 hover:shadow-lg">
      <button
        type="button"
        onClick={() => navigate(`/cover-letter/${coverLetter._id}/edit`)}
        className="flex w-full min-w-0 items-start gap-3 p-4 pr-12 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-btn-hover-bg text-subheading">
          <Mail size={18} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-heading">{title}</h3>

          {subtitle && (
            <p className="mt-0.5 truncate text-sm text-nav-text">{subtitle}</p>
          )}

          <p className="mt-2 flex items-center gap-1.5 text-xs text-heading/50">
            <Clock size={12} />
            Edited {new Date(coverLetter.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </button>

      <button
        type="button"
        aria-label={`Delete ${title}`}
        onClick={() => setDeleteOpen(true)}
        className="absolute right-3 top-3 rounded-lg p-2 text-heading/40 transition hover:bg-red-600/10 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>

      <DeleteCoverLetterModal
        open={deleteOpen}
        title={title}
        loading={deleteMutation.isPending}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}
