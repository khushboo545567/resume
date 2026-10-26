import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Clock, Edit3 } from "lucide-react";

import CoverLetterCardMenu from "./CoverLetterCardMenu";
import CoverLetterThumbnail from "./CoverLetterThumbnail";
import DeleteCoverLetterModal from "./DeleteCoverLetterModal";
import { useDeleteCoverLetter } from "../hooks/useDeleteCoverLetter";

import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

import type { CoverLetter } from "../types/coverLetter.types";

interface Props {
  coverLetter: CoverLetter;
}

/** Share of the key parts of a letter that are filled in (0-100). */
function getCompletion(letter: CoverLetter): number {
  const checks = [
    letter.personalInfo?.fullName,
    letter.recipient?.companyName,
    letter.recipient?.greeting,
    letter.body?.opening,
    letter.body?.paragraphs?.some((p) => p.trim()),
    letter.body?.closing,
    letter.closing?.signOff,
  ];

  const filled = checks.filter((check) =>
    typeof check === "string" ? check.trim() : Boolean(check),
  ).length;

  return Math.round((filled / checks.length) * 100);
}

/**
 * Dashboard card for a cover letter. Intentionally mirrors ResumeCard
 * (preview on top, title + menu, status, progress, role, date, edit button)
 * so both sections of the dashboard look the same.
 */
export default function CoverLetterCard({ coverLetter }: Props) {
  const navigate = useNavigate();
  const [opening, setOpening] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useDeleteCoverLetter();

  const title = coverLetter.title || "Untitled cover letter";
  const company = coverLetter.recipient?.companyName;
  const roleLine = [coverLetter.targetRole, company].filter(Boolean).join(" · ");

  const completion = getCompletion(coverLetter);
  const isCompleted = completion === 100;

  const progressColor =
    completion >= 80
      ? "bg-green-600"
      : completion >= 50
        ? "bg-orange-500"
        : "bg-red-600";

  const openEditor = () => navigate(`/cover-letter/${coverLetter._id}/edit`);

  const handleDelete = () => {
    deleteMutation.mutate(coverLetter._id, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

  return (
    <Card className="group overflow-visible transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-64 overflow-hidden rounded-t-xl bg-linear-to-br from-navbar to-navbar-hover">
        <div className="flex h-full items-center justify-center">
          <CoverLetterThumbnail coverLetter={coverLetter} />
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <h3 className="line-clamp-1 min-w-0 text-lg font-bold text-heading">
            {title}
          </h3>

          <CoverLetterCardMenu
            onEdit={openEditor}
            onDelete={() => setDeleteOpen(true)}
          />
        </div>

        <div className="grid min-w-0 gap-4 min-[480px]:grid-cols-2 md:grid-cols-1 min-[1050px]:grid-cols-2">
          {/* Left Side */}
          <div className="min-w-0 flex-1">
            <div className="mt-2 flex items-center gap-2">
              <Badge color={isCompleted ? "green" : "yellow"}>
                {isCompleted ? "completed" : "draft"}
              </Badge>

              <Badge>{completion}% Complete</Badge>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-heading/60">
                <span>Letter Completion</span>
                <span>{completion}%</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-border-popup">
                <div
                  className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="min-w-0 space-y-3 pt-1">
            <div className="flex items-center gap-2 text-sm text-nav-text">
              <Briefcase size={16} className="shrink-0" />
              <span className="truncate">
                {roleLine || "Target role not selected"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-heading/60">
              <Clock size={16} className="shrink-0" />
              <span className="min-w-0 truncate">
                Last Updated{" "}
                {new Date(coverLetter.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            fullWidth
            className="h-11"
            leftIcon={<Edit3 size={18} />}
            loading={opening}
            onClick={() => {
              setOpening(true);
              window.setTimeout(() => setOpening(false), 10_000);
              openEditor();
            }}
          >
            {opening ? "Opening…" : "Edit Cover Letter"}
          </Button>
        </div>
      </div>

      <DeleteCoverLetterModal
        open={deleteOpen}
        title={title}
        loading={deleteMutation.isPending}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDelete}
      />
    </Card>
  );
}
