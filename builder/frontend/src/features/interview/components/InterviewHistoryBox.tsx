import { ChevronRight, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

/** Link card to the interview history page, styled like the other cards. */
export default function InterviewHistoryBox() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/interview/history")}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-border-popup bg-popup px-5 py-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-xl"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-btn-hover-bg text-subheading">
          <History size={20} />
        </div>

        <div className="min-w-0">
          <p className="font-bold text-heading">Your interview history</p>
          <p className="truncate text-sm text-nav-text">
            See past sessions, scores and feedback
          </p>
        </div>
      </div>

      <ChevronRight
        size={20}
        className="shrink-0 text-heading/40 transition group-hover:translate-x-1 group-hover:text-heading"
      />
    </button>
  );
}
