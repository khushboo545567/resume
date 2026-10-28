import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../store/auth.store";
import { redirectToLogin } from "../../../config/auth.config";
import { useCreateResume } from "../../resume/hooks/useCreateResume";
import { ResumeTemplates, type ResumeTemplate } from "../../resume/types/resume.types";

export function useQuickActions() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const [isCreatingAtsResume, setIsCreatingAtsResume] = useState(false);
  const [isCreatingAiResume, setIsCreatingAiResume] = useState(false);
  const [aiPickerError, setAiPickerError] = useState<string | null>(null);
  const [isAiTemplatePickerOpen, setIsAiTemplatePickerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateChooserOpen, setIsCreateChooserOpen] = useState(false);
  const [isCreatingQuickResume, setIsCreatingQuickResume] = useState(false);
  const createResumeMutation = useCreateResume();

  // "Create Resume" opens a small chooser (template / import / quick start)
  // instead of dropping the user on the templates page with no context.
  const handleCreateResume = () => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setIsCreateChooserOpen(true);
  };

  // Goes straight to the templates page (used by the chooser and by
  // "Choose a template" buttons).
  const handleChooseTemplate = () => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setIsCreateChooserOpen(false);
    navigate("/templates");
  };

  // Creates a blank resume on the default ATS template and opens the editor.
  const handleQuickStart = async () => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setIsCreatingQuickResume(true);

    try {
      const resume = await createResumeMutation.mutateAsync({
        title: "Untitled Resume",
        targetRole: "",
        templateId: ResumeTemplates.ATS,
      });

      setIsCreateChooserOpen(false);
      navigate(`/resume/${resume._id}/edit`);
    } catch (error) {
      console.error("Failed to create a blank resume:", error);
    } finally {
      setIsCreatingQuickResume(false);
    }
  };

  const handleOpenUploadResume = () => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setIsCreateChooserOpen(false);
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

  // "Create Resume with AI" opens a small template picker first. Once the
  // user picks a template, handleCreateAiResume creates the resume and opens
  // the editor with the "Generate with AI" form already showing.
  const handleCreateResumeWithAI = () => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    setAiPickerError(null);
    setIsAiTemplatePickerOpen(true);
  };

  const handleCreateAiResume = async (templateId: ResumeTemplate) => {
    if (isCreatingAiResume) return;

    setIsCreatingAiResume(true);
    setAiPickerError(null);

    try {
      const resume = await createResumeMutation.mutateAsync({
        title: "Untitled Resume",
        targetRole: "",
        templateId,
      });

      setIsAiTemplatePickerOpen(false);
      navigate(`/resume/${resume._id}/edit`, { state: { openGenerate: true } });
    } catch (error) {
      console.error("Failed to create resume for AI generation:", error);
      setAiPickerError("We couldn't create your resume. Please try again.");
    } finally {
      setIsCreatingAiResume(false);
    }
  };

  return {
    handleCreateResume,
    handleChooseTemplate,
    handleQuickStart,
    isCreatingQuickResume,
    isCreateChooserOpen,
    closeCreateChooser: () => setIsCreateChooserOpen(false),
    handleCreateResumeWithAI,
    handleCreateAiResume,
    isCreatingAiResume,
    aiPickerError,
    isAiTemplatePickerOpen,
    closeAiTemplatePicker: () => setIsAiTemplatePickerOpen(false),
    handleCheckATSScore,
    handleOpenUploadResume,
    isCreatingAtsResume,
    isUploadModalOpen,
    closeUploadModal: () => setIsUploadModalOpen(false),
  };
}

export type QuickActions = Omit<
  ReturnType<typeof useQuickActions>,
  | "isUploadModalOpen"
  | "closeUploadModal"
  | "isCreateChooserOpen"
  | "closeCreateChooser"
  | "isAiTemplatePickerOpen"
  | "closeAiTemplatePicker"
  | "handleCreateAiResume"
  | "isCreatingAiResume"
  | "aiPickerError"
>;
