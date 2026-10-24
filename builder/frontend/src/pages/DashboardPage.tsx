import { useState } from "react";
import PageSpinner from "../components/PageSpinner";

import DashboardHeader from "../features/dashboard/components/DashboardHeader";
import DashboardStats from "../features/dashboard/components/DashboardStats";

import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import WelcomeBanner from "../features/dashboard/components/WelcomeBanner";
import QuickActions from "../features/dashboard/components/QuickActions";

import ResumeGrid from "../features/resume/components/ResumeGrid";
import CreateResumeModal from "../features/resume/components/CreateResumeModal";
import AnalyseATSScoreModal from "../features/resume/components/AnalyseATSScoreModal";
import ResumeCompletionCard from "../features/resume/components/ResumeCompletionCard";
import AISuggestionsCard from "../features/dashboard/components/AISuggestionsCard";
import EmptyResumeState from "../features/resume/components/EmptyResumeState";
import type { Resume } from "../features/resume/types/resume.types";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [analyseOpen, setAnalyseOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Greet the logged-in user by first name (falls back to the first word of
  // their full name, then to a neutral "there" while the session is loading).
  const user = useAuthStore((state) => state.user);
  const firstName =
    user?.profile?.firstName?.trim() ||
    user?.fullName?.trim().split(/\s+/)[0] ||
    "there";

  // Filter & Sort States
  const [filter, setFilter] = useState<"all" | "draft" | "completed">("all");
  const [sort, setSort] = useState<"updated" | "newest" | "oldest" | "az">(
    "updated",
  );

  const { data, isLoading, refetch } = useDashboard();

  if (isLoading || !data) {
    return <PageSpinner />;
  }

  const resumes = data.recentResumes;

  const total = data.stats.totalResumes;

  // ==================== FILTERING ====================
  const filteredResumes = resumes.filter((resume: Resume) => {
    const keyword = search.toLowerCase().trim();

    const title = resume.title?.toString().toLowerCase() ?? "";
    const targetRole = resume.targetRole?.toString().toLowerCase() ?? "";

    const matchesSearch =
      title.includes(keyword) || targetRole.includes(keyword);
    const matchesFilter = filter === "all" ? true : resume.status === filter;

    return matchesSearch && matchesFilter;
  });

  // ==================== SORTING ====================
  const sortedResumes = [...filteredResumes];

  switch (sort) {
    case "updated":
      sortedResumes.sort((a, b) => {
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        return dateB - dateA;
      });
      break;

    case "newest":
      sortedResumes.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      break;

    case "oldest":
      sortedResumes.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB;
      });
      break;

    case "az":
      sortedResumes.sort((a, b) => {
        const titleA = a.title?.toString().toLowerCase() ?? "";
        const titleB = b.title?.toString().toLowerCase() ?? "";
        return titleA.localeCompare(titleB);
      });
      break;
  }

  return (
    <>
      <div className="min-w-0 space-y-6 sm:space-y-8">
        <WelcomeBanner
          name={firstName}
          onCreate={() => setOpen(true)}
          onContinue={() => {
            if (sortedResumes.length > 0) {
              navigate(`/resume/${sortedResumes[0]._id}/edit`);
            }
          }}
        />
        <QuickActions
          onCreate={() => setOpen(true)}
          onAnalyseATS={() => setAnalyseOpen(true)}
        />
        <DashboardHeader
          total={total}
          search={search}
          filter={filter}
          sort={sort}
          onSearch={setSearch}
          onFilter={setFilter}
          onSort={setSort}
          onCreate={() => setOpen(true)}
          onAnalyseATS={() => setAnalyseOpen(true)}
        />

        <DashboardStats
          total={data.stats.totalResumes}
          draft={data.stats.draftResumes}
          completed={data.stats.completedResumes}
          downloads={data.analytics.downloads}
        />

        {/* {resumes.length > 0 && <DashboardAnalytics resumeId={resumes[0]._id} />} */}

        <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-2">
          <ResumeCompletionCard
            percentage={data.resumeCompletion.percentage}
            missing={data.resumeCompletion.missing}
          />

          <AISuggestionsCard suggestions={data.aiSuggestions} />
        </div>

        {sortedResumes.length === 0 ? (
          <EmptyResumeState onCreate={() => setOpen(true)} />
        ) : (
          <ResumeGrid
            resumes={sortedResumes}
            loading={isLoading}
            onCreate={() => setOpen(true)}
            onRefresh={refetch}
          />
        )}

        {/* <RecentActivity /> */}

        <CreateResumeModal open={open} onClose={() => setOpen(false)} />
        <AnalyseATSScoreModal
          open={analyseOpen}
          onClose={() => setAnalyseOpen(false)}
        />
      </div>
    </>
  );
}
