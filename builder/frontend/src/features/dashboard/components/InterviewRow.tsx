import { useNavigate } from "react-router-dom";
import { Bot, Calendar, ChevronRight } from "lucide-react";

import type { InterviewSession } from "../../interview/types/interview.types";

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  ended_early: "Ended early",
  in_progress: "In progress",
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  ended_early: "bg-amber-100 text-amber-700",
  in_progress: "bg-sidebar/15 text-sidebar",
};

interface Props {
  session: InterviewSession;
}

export default function InterviewRow({ session }: Props) {
  const navigate = useNavigate();

  const answered = session.questions.filter((q) => q.answerText).length;

  return (
    <button
      type="button"
      onClick={() => navigate(`/interview/ai/session/${session._id}`)}
      className="flex w-full min-w-0 items-center gap-3 group rounded-2xl border border-border-popup bg-popup p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar to-btn text-gold-soft shadow-md">
        <Bot size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="truncate font-semibold text-heading">
            {session.targetRole}
          </h3>

          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              STATUS_STYLES[session.status] ?? "bg-btn-hover-bg text-heading/60"
            }`}
          >
            {STATUS_LABELS[session.status] ?? session.status}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-heading/60 sm:text-sm">
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {new Date(session.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>

          <span className="capitalize">
            {session.questionType} · {session.difficulty}
          </span>

          <span>
            {answered}/{session.totalQuestions} answered
          </span>

          {session.summary && (
            <span className="font-semibold text-subheading">
              {session.summary.overallScore}/100
            </span>
          )}
        </div>
      </div>

      <ChevronRight size={18} className="shrink-0 text-heading/40 transition group-hover:translate-x-1 group-hover:text-heading" />
    </button>
  );
}
