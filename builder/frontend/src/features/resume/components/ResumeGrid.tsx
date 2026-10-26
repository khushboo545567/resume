import ResumeCard from "./ResumeCard";
import EmptyState from "../../dashboard/components/EmptyState";
import { dashboardCardGridClass } from "../../dashboard/components/DashboardSection";

import type { Resume } from "../types/resume.types"; // ← Ye import zaroori hai

interface Props {
  resumes: Resume[];
  loading: boolean;
  onCreate: () => void;
  onRefresh: () => void;
}

export default function ResumeGrid({
  resumes,
  loading,
  onCreate,
  onRefresh,
}: Props) {
  if (loading) {
    return (
      <div className={dashboardCardGridClass}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-96 min-w-0 animate-pulse rounded-3xl bg-border-popup"
          />
        ))}
      </div>
    );
  }

  if (!resumes || resumes.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <div className={dashboardCardGridClass}>
      {resumes.map((resume) => (
        <div key={resume._id} className="min-w-0">
          <ResumeCard resume={resume} onRefresh={onRefresh} />
        </div>
      ))}
    </div>
  );
}
