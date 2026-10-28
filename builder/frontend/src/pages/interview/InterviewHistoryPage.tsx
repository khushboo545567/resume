import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, ChevronRight, Calendar } from "lucide-react";

import { useInterviewHistory } from "../../features/interview/hooks/useInterviewHistory";

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  ended_early: "Ended Early",
  in_progress: "In Progress",
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  ended_early: "bg-amber-100 text-amber-700",
  in_progress: "bg-sidebar/15 text-sidebar",
};

export default function InterviewHistoryPage() {
  const navigate = useNavigate();
  const { sessions, loading, isError } = useInterviewHistory();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-subheading" size={32} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-nav-text">
          We couldn't load your interview history. Please try again.
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <button
        onClick={() => navigate("/interview")}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-heading/60 transition hover:text-heading sm:mb-6"
      >
        <ArrowLeft size={16} />
        Back to Interview Prep
      </button>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-heading sm:text-2xl lg:text-3xl">
          Interview History
        </h1>
        <p className="mt-1.5 text-sm text-nav-text sm:mt-2 sm:text-base">
          Your past AI interview practice sessions.
        </p>
      </div>

      {sessions.length === 0 ? (
        <p className="text-center text-sm text-heading/60 sm:text-base">
          You haven't taken any AI interviews yet.
        </p>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {sessions.map((session) => {
            const answeredCount = session.questions.filter(
              (q) => q.answerText,
            ).length;

            return (
              <button
                key={`ai-${session._id}`}
                onClick={() =>
                  navigate(`/interview/ai/session/${session._id}`)
                }
                className="flex w-full items-start gap-3 rounded-2xl border border-border bg-navbar p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:items-center sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    <h3 className="font-semibold text-heading">
                      {session.targetRole}
                    </h3>
                    <span className="rounded-full bg-btn px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-btn-text">
                      AI Practice
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[session.status] ??
                        "bg-btn-hover-bg text-heading/60"
                      }`}
                    >
                      {STATUS_LABELS[session.status] ?? session.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-heading/60 sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(session.createdAt).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </span>
                    <span className="capitalize">
                      {session.questionType} · {session.difficulty}
                    </span>
                    <span>
                      {answeredCount}/{session.totalQuestions} answered
                    </span>
                    {session.summary && (
                      <span className="font-semibold text-subheading">
                        {session.summary.overallScore}/100
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="mt-0.5 shrink-0 text-heading/40 sm:mt-0"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
