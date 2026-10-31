import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";

import InterviewConfigForm from "../../features/interview/components/InterviewConfigForm";
import { isOutOfCreditsError } from "../../api/axios";
import { useStartInterview } from "../../features/interview/hooks/useStartInterview";

import type { StartInterviewPayload } from "../../features/interview/types/interview.types";

export default function GenerateInterviewPage() {
  const navigate = useNavigate();
  const startInterview = useStartInterview();

  const handleSubmit = (payload: StartInterviewPayload) => {
    startInterview.mutate(payload, {
      onSuccess: ({ session, audio }) => {
        navigate(`/interview/ai/session/${session._id}`, {
          state: { initialAudio: audio },
        });
      },
    });
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sidebar text-sidebar-text">
          <Bot size={24} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-heading">
            Interview with AI
          </h1>
          <p className="mt-1 text-nav-text">
            Tell us what you're preparing for and we'll build a mock interview
            around your resume.
          </p>
        </div>
      </div>

      <InterviewConfigForm
        onSubmit={handleSubmit}
        submitting={startInterview.isPending}
      />

      {startInterview.isError && !isOutOfCreditsError(startInterview.error) && (
        <p className="mt-4 text-center text-sm text-red-500">
          Something went wrong starting your interview. Please try again.
        </p>
      )}
    </section>
  );
}
