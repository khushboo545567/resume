import { useEffect } from "react";

import { useParams } from "react-router-dom";

import { usePublicResume } from "../features/resume/share/usePublicResume";

import { useResumeStore } from "../store/resume.store";

import TemplateRenderer from "../features/resume/preview/templates/TemplateRenderer";

export default function PublicResumePage() {
  const { shareId = "" } = useParams();

  const { loading, resume } = usePublicResume(shareId);

  const setResume = useResumeStore((state) => state.setResume);

  useEffect(() => {
    if (resume) {
      setResume(resume);
    }
  }, [resume]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex h-screen items-center justify-center">
        Resume not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Public Resume</h1>

          <p className="text-nav-text">Shared using Throne8 Resume Builder</p>
        </div>
      </div>

      <div className="mx-auto w-[850px] bg-white shadow-2xl font-sans">
        <TemplateRenderer />
      </div>
      <div className="border-t border-border p-6 text-center text-sm text-nav-text">
        Powered by
        <span className="font-semibold">Throne8</span>
      </div>
    </div>
  );
}
