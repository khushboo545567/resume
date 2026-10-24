// ResumeCard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Clock, Edit3, Briefcase } from "lucide-react";

import ResumeCardMenu from "./ResumeCardMenu";
import RenameResumeModal from "./RenameResumeModal";
import DeleteResumeModal from "./DeleteResumeModal";
import DuplicateResumeModal from "./DuplicateResumeModal";
import ResumeThumbnail from "./ResumeThumbnail"; // ← Add this import

import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

import { useRenameResume } from "../hooks/useRenameResume";
import { useDeleteResume } from "../hooks/useDeleteResume";

import type { Resume } from "../types/resume.types";

import ShareResumeModal from "../share/ShareResumeModal";
import { useShareResume } from "../share/useShareResume";

interface ResumeCardProps {
  resume: Resume;
  onRefresh: () => void;
}

export default function ResumeCard({ resume, onRefresh }: ResumeCardProps) {
  const navigate = useNavigate();
  const [opening, setOpening] = useState(false);

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [title, setTitle] = useState(resume.title);
  const [shareOpen, setShareOpen] = useState(false);
  // //////////////////////

  const renameMutation = useRenameResume();
  const deleteMutation = useDeleteResume();

  const [shareId, setShareId] = useState("");

  const { shareMutation } = useShareResume();

  // Calculate completion percentage
  const completion = (() => {
    let score = 0;
    if (resume.personalInfo?.fullName) score += 15;
    if (resume.summary) score += 15;
    if (resume.skills?.length) score += 20;
    if (resume.experience?.length) score += 20;
    if (resume.education?.length) score += 15;
    if (resume.projects?.length) score += 15;
    return score;
  })();

  const progressColor =
    completion >= 80
      ? "bg-green-600"
      : completion >= 50
        ? "bg-orange-500"
        : "bg-red-600";

  const handleRename = async (newTitle: string) => {
    await renameMutation.mutateAsync({
      id: resume._id,
      title: newTitle,
    });

    setTitle(newTitle);
    setRenameOpen(false);
    onRefresh();
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(resume._id);

      setDeleteOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    try {
      const data = await shareMutation.mutateAsync(resume._id);

      setShareId(data.shareId);

      setShareOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="group overflow-visible transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-64 overflow-hidden rounded-t-xl bg-linear-to-br from-navbar to-navbar-hover">
        <div className="flex h-full items-center justify-center">
          <ResumeThumbnail resume={resume} />
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 p-4">
        {/* Top Section */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <h3 className="min-w-0 text-lg font-bold line-clamp-1 text-heading">
            {title}
          </h3>{" "}
          <ResumeCardMenu
            onRename={() => setRenameOpen(true)}
            onDuplicate={() => setDuplicateOpen(true)}
            onDelete={() => setDeleteOpen(true)}
            onDownload={() => navigate(`/resume/${resume._id}/edit`)}
            onShare={handleShare}
          />
        </div>

        <div className="grid min-w-0 gap-4 min-[480px]:grid-cols-2 md:grid-cols-1 min-[1050px]:grid-cols-2">
          {/* Left Side */}
          <div className="min-w-0 flex-1">
            {/* <h3 className="text-lg font-bold line-clamp-1 text-heading">
              {title}
            </h3> */}

            <div className="mt-2 flex items-center gap-2">
              <Badge color={resume.status === "draft" ? "yellow" : "green"}>
                {resume.status}
              </Badge>

              <Badge>{completion}% Complete</Badge>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-heading/60">
                <span>Profile Completion</span>
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
            {/* Target Role */}
            <div className="flex items-center gap-2 text-sm text-nav-text">
              <Briefcase size={16} className="shrink-0" />
              <span className="truncate">
                {resume.targetRole || "Target role not selected"}
              </span>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2 text-sm text-heading/60">
              <Clock size={16} className="shrink-0" />
              <span className="min-w-0 truncate">
                Last Updated {new Date(resume.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Menu */}
        </div>
        {/* Edit Button */}
        <div className="pt-2">
          <Button
            fullWidth
            className="h-11"
            leftIcon={<Edit3 size={18} />}
            loading={opening}
            onClick={() => {
              // The editor page downloads on first use, so show we heard the click.
              setOpening(true);
              window.setTimeout(() => setOpening(false), 10_000);
              navigate(`/resume/${resume._id}/edit`);
            }}
          >
            {opening ? "Opening…" : "Edit Resume"}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <RenameResumeModal
        open={renameOpen}
        initialValue={title}
        loading={renameMutation.isPending}
        onClose={() => setRenameOpen(false)}
        onSave={handleRename}
      />

      <DeleteResumeModal
        open={deleteOpen}
        title={title}
        loading={deleteMutation.isPending}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDelete}
      />

      <ShareResumeModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareId={shareId}
      />

      <DuplicateResumeModal
        open={duplicateOpen}
        onClose={() => setDuplicateOpen(false)}
        resumeId={resume._id}
        currentTemplateId={resume.templateId}
      />
    </Card>
  );
}
