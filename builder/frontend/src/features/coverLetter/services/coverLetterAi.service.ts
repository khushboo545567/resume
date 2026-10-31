import api from "../../../api/axios";

import type {
  CoverLetter,
  RegenerateCoverLetterTarget,
} from "../types/coverLetter.types";

export type GeneratedCoverLetterContent = Pick<
  CoverLetter,
  "personalInfo" | "recipient" | "body" | "closing"
>;

export interface CoverLetterAiCredits {
  /** AI cover letter generations left. */
  runs: number;
  /** AI cover letter edits (regenerate) left. */
  edits: number;
  /** Credits left for the action that was just called. */
  remaining: number;
}

export interface GenerateCoverLetterParams {
  targetRole: string;
  jobDescription?: string;
  companyName?: string;
  companyInfo?: string;
  resumeId?: string;
  resumeFile?: File | null;
}

export interface GenerateCoverLetterResult {
  coverLetter: GeneratedCoverLetterContent;
  credits: CoverLetterAiCredits;
}

/**
 * Generate a cover letter with AI.
 *
 * Always sent as multipart form data (even when no file is attached) so
 * the backend's single upload-parsing middleware can handle both cases
 * consistently. The Content-Type header (with boundary) is left for the
 * browser/axios to set automatically — never set it manually with FormData.
 */
export const generateCoverLetterWithAI = async (
  params: GenerateCoverLetterParams,
): Promise<GenerateCoverLetterResult> => {
  const formData = new FormData();

  formData.append("targetRole", params.targetRole);

  if (params.jobDescription) {
    formData.append("jobDescription", params.jobDescription);
  }

  if (params.companyName) {
    formData.append("companyName", params.companyName);
  }

  if (params.companyInfo) {
    formData.append("companyInfo", params.companyInfo);
  }

  if (params.resumeId) {
    formData.append("resumeId", params.resumeId);
  }

  if (params.resumeFile) {
    formData.append("file", params.resumeFile);
  }

  const response = await api.post("/ai/generate-cover-letter", formData, {
    timeout: 120000,
  });

  return {
    coverLetter: response.data.coverLetter,
    credits: response.data.credits,
  };
};

export interface RegenerateCoverLetterParams {
  currentLetter: CoverLetter;
  target: RegenerateCoverLetterTarget;
  reason: string;
}

export interface RegenerateCoverLetterResult {
  result: Record<string, unknown>;
  credits: CoverLetterAiCredits;
}

export const regenerateCoverLetterSection = async (
  params: RegenerateCoverLetterParams,
): Promise<RegenerateCoverLetterResult> => {
  const response = await api.post("/ai/regenerate-cover-letter", params);

  return {
    result: response.data.result,
    credits: response.data.credits,
  };
};

/**
 * Fetch the current user's remaining free cover-letter AI credits
 * (shared pool between generate and regenerate) — used to show
 * "X free generations left" before the user commits to filling out
 * the whole form.
 */
export const getCoverLetterAiCredits =
  async (): Promise<CoverLetterAiCredits> => {
    const response = await api.get("/ai/cover-letter-credits");

    return response.data.credits;
  };

/**
 * Pulls a human-readable message out of an axios error response, e.g.
 * the 403 "you're out of credits" message from the backend.
 */
export const getAiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const message = (error as any)?.response?.data?.message;

  return typeof message === "string" ? message : fallback;
};
