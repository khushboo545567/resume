import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../store/auth.store";
import { redirectToLogin } from "../../../config/auth.config";
import { useCreateResume } from "../../resume/hooks/useCreateResume";
import { ResumeTemplates } from "../../resume/types/resume.types";

export function useQuickActions() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const [isCreatingAtsResume, setIsCreatingAtsResume] = useState(false);
  const [isCreatingAiResume, setIsCreatingAiResume] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const createResumeMutation = useCreateResume();

  const handleCreateResume = () => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    navigate("/templates");
  };

  const handleOpenUploadResume = () => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setIsUploadModalOpen(true);
  };

  const handleCheckATSScore = async () => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setIsCreatingAtsResume(true);

    try {
      const resume = await createResumeMutation.mutateAsync({
        title: "Untitled Resume",
        targetRole: "",
        templateId: ResumeTemplates.ATS,
      });

      navigate(`/resume/${resume._id}/edit`, { state: { openAts: true } });
    } catch (error) {
      console.error("Failed to create resume for ATS check:", error);
    } finally {
      setIsCreatingAtsResume(false);
    }
  };

  // Creates a blank resume on the default ATS template and opens the editor
  // with the "Generate with AI" form already showing.
  const handleCreateResumeWithAI = async () => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setIsCreatingAiResume(true);

    try {
      const resume = await createResumeMutation.mutateAsync({
        title: "Untitled Resume",
        targetRole: "",
        templateId: ResumeTemplates.ATS,
      });

      navigate(`/resume/${resume._id}/edit`, { state: { openGenerate: true } });
    } catch (error) {
      console.error("Failed to create resume for AI generation:", error);
    } finally {
      setIsCreatingAiResume(false);
    }
  };

  return {
    handleCreateResume,
    handleCreateResumeWithAI,
    isCreatingAiResume,
    handleCheckATSScore,
    handleOpenUploadResume,
    isCreatingAtsResume,
    isUploadModalOpen,
    closeUploadModal: () => setIsUploadModalOpen(false),
  };
}

export type QuickActions = Omit<
  ReturnType<typeof useQuickActions>,
  "isUploadModalOpen" | "closeUploadModal"
>;
