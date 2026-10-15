import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../store/auth.store";
import { redirectToLogin } from "../../../config/auth.config";
import { useCreateResume } from "../../resume/hooks/useCreateResume";
import { ResumeTemplates } from "../../resume/types/resume.types";

export function useQuickActions() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [isCreatingAtsResume, setIsCreatingAtsResume] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const createResumeMutation = useCreateResume();

  const handleCreateResume = () => {
    if (!user) {
      redirectToLogin();
      return;
    }

    navigate("/templates");
  };

  const handleOpenUploadResume = () => {
    if (!user) {
      redirectToLogin();
      return;
    }

    setIsUploadModalOpen(true);
  };

  const handleCheckATSScore = async () => {
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

  return {
    handleCreateResume,
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
