import { useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { ArrowRight, Bot, FilePlus2, Mail } from "lucide-react";

import PageSpinner from "../components/PageSpinner";

import DashboardStats from "../features/dashboard/components/DashboardStats";
import DashboardSection, {
  DASHBOARD_PREVIEW_LIMIT,
  dashboardCardGridClass,
  sectionActionClass,
} from "../features/dashboard/components/DashboardSection";
import DashboardEmpty from "../features/dashboard/components/DashboardEmpty";
import InterviewRow from "../features/dashboard/components/InterviewRow";
import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import type { QuickActions } from "../features/dashboard/hooks/useQuickActions";

import ResumeGrid from "../features/resume/components/ResumeGrid";
import CoverLetterCard from "../features/coverLetter/components/CoverLetterCard";
import { useCoverLetters } from "../features/coverLetter/hooks/useCoverLetters";
import { useInterviewHistory } from "../features/interview/hooks/useInterviewHistory";

import { useAuthStore } from "../store/auth.store";

const RESUME_LIMIT = DASHBOARD_PREVIEW_LIMIT;
const COVER_LETTER_LIMIT = DASHBOARD_PREVIEW_LIMIT;
const INTERVIEW_LIMIT = DASHBOARD_PREVIEW_LIMIT;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { handleCreateResume } = useOutletContext<QuickActions>();

  // Greet the logged-in user by first name (falls back to the first word of
  // their full name, then to a neutral "there" while the session is loading).
  const user = useAuthStore((state) => state.user);
  const firstName =
    user?.profile?.firstName?.trim() ||
    user?.fullName?.trim().split(/\s+/)[0] ||
    "there";

  const { data, isLoading, refetch } = useDashboard();
  const {
    coverLetters,
    loading: loadingLetters,
    isError: lettersError,
  } = useCoverLetters();
  const {
    sessions,
    loading: loadingSessions,
    isError: sessionsError,
  } = useInterviewHistory();

  const [showAllLetters, setShowAllLetters] = useState(false);

  const latestResumes = useMemo(
    () =>
      [...(data?.recentResumes ?? [])]
        .sort(
          (a, b) =>
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime(),
        )
        .slice(0, RESUME_LIMIT),
    [data],
  );

  const sortedLetters = useMemo(
    () =>
      [...coverLetters].sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime(),
      ),
    [coverLetters],
  );

  const latestSessions = useMemo(
    () =>
      [...sessions]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, INTERVIEW_LIMIT),
    [sessions],
  );

  if (isLoading || !data) {
    return <PageSpinner />;
  }

  const visibleLetters = showAllLetters
    ? sortedLetters
    : sortedLetters.slice(0, COVER_LETTER_LIMIT);

  return (
    <div className="min-w-0 space-y-10 sm:space-y-12">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-display sm:text-3xl">
          Hi, {firstName}
        </h1>
        <p className="mt-1 text-sm text-subheading sm:text-base">
          Here is everything you have created and practiced so far.
        </p>
      </div>

      <DashboardStats
        resumes={data.stats.totalResumes}
        draft={data.stats.draftResumes}
        completed={data.stats.completedResumes}
        coverLetters={loadingLetters ? "-" : coverLetters.length}
        interviews={loadingSessions ? "-" : sessions.length}
        downloads={data.analytics.downloads}
      />

      {/* Resumes */}
      <DashboardSection
        title="Resumes"
        action={
          data.stats.totalResumes > RESUME_LIMIT && (
            <Link to="/myresume" className={sectionActionClass}>
              View all ({data.stats.totalResumes})
              <ArrowRight size={15} />
            </Link>
          )
        }
      >
        {latestResumes.length === 0 ? (
          <DashboardEmpty
            icon={<FilePlus2 size={22} />}
            title="No resumes yet"
            text="Pick a template and build your first ATS-friendly resume."
            buttonLabel="Create resume"
            onClick={handleCreateResume}
          />
        ) : (
          <ResumeGrid
            resumes={latestResumes}
            loading={false}
            onCreate={handleCreateResume}
            onRefresh={refetch}
          />
        )}
      </DashboardSection>

      {/* Cover letters */}
      <DashboardSection
        title="Cover Letters"
        action={
          sortedLetters.length > COVER_LETTER_LIMIT && (
            <button
              type="button"
              onClick={() => setShowAllLetters((prev) => !prev)}
              className={sectionActionClass}
            >
              {showAllLetters
                ? "Show less"
                : `View all (${sortedLetters.length})`}
            </button>
          )
        }
      >
        {loadingLetters ? (
          <div className="h-24 animate-pulse rounded-2xl bg-border-popup" />
        ) : lettersError ? (
          <p className="text-sm text-nav-text">
            We couldn't load your cover letters. Please try again later.
          </p>
        ) : sortedLetters.length === 0 ? (
          <DashboardEmpty
            icon={<Mail size={22} />}
            title="No cover letters yet"
            text="Write a cover letter that matches your resume, with or without AI."
            buttonLabel="Write cover letter"
            onClick={() => navigate("/cover-letters")}
          />
        ) : (
          <div className={dashboardCardGridClass}>
            {visibleLetters.map((coverLetter) => (
              <CoverLetterCard
                key={coverLetter._id}
                coverLetter={coverLetter}
              />
            ))}
          </div>
        )}
      </DashboardSection>

      {/* Interviews */}
      <DashboardSection
        title="Interviews"
        action={
          sessions.length > INTERVIEW_LIMIT && (
            <Link to="/interview/history" className={sectionActionClass}>
              View all ({sessions.length})
              <ArrowRight size={15} />
            </Link>
          )
        }
      >
        {loadingSessions ? (
          <div className="h-20 animate-pulse rounded-2xl bg-border-popup" />
        ) : sessionsError ? (
          <p className="text-sm text-nav-text">
            We couldn't load your interview history. Please try again later.
          </p>
        ) : latestSessions.length === 0 ? (
          <DashboardEmpty
            icon={<Bot size={22} />}
            title="No interviews yet"
            text="Practice with questions built from your resume and target role."
            buttonLabel="Start AI interview"
            onClick={() => navigate("/interview/ai")}
          />
        ) : (
          <div className="space-y-3">
            {latestSessions.map((session) => (
              <InterviewRow key={session._id} session={session} />
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
