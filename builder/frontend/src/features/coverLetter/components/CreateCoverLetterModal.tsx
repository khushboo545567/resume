import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, FileText } from "lucide-react";

import PreviewModal from "../../../components/ui/PreviewModal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import SuggestInput from "../../../components/ui/SuggestInput";

import { searchRoles } from "../../resume/config/jobRoles";

import { createCoverLetter } from "../services/coverLetter.service";
import type { CoverLetterTemplate } from "../types/coverLetter.types";
import { CoverLetterTemplates } from "../types/coverLetter.types";

interface Props {
  open: boolean;
  onClose: () => void;
  templateId?: CoverLetterTemplate;
  /** Shown beside the form so the user can see what they picked. */
  templateName?: string;
  templatePreview?: string;
}

interface CreateCoverLetterForm {
  title: string;
  targetRole: string;
}

export default function CreateCoverLetterModal({
  open,
  onClose,
  templateId = CoverLetterTemplates.CLASSIC_FORMAL,
  templateName,
  templatePreview,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCoverLetterForm>();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: CreateCoverLetterForm) => {
    try {
      setLoading(true);
      setSubmitError(null);

      const coverLetter = await createCoverLetter({ ...data, templateId });

      onClose();
      navigate(`/cover-letter/${coverLetter._id}/edit`);
    } catch (error) {
      console.error(error);
      setSubmitError("We couldn't create your cover letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      busy={loading}
      title="Name your cover letter"
      description="You can change both of these later in the editor."
      templateName={templateName}
      previewSrc={templatePreview}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {submitError && (
          <p className="rounded-lg bg-red-600/10 px-3 py-2 text-sm text-red-600">
            {submitError}
          </p>
        )}

        <Input
          label="Cover letter name"
          required
          autoFocus
          autoComplete="off"
          placeholder="Nexora Full Stack Cover Letter"
          hint="Only you see this. It helps you tell your letters apart."
          leftIcon={<FileText size={18} />}
          error={errors.title?.message}
          {...register("title", {
            required: "Cover letter name is required",
          })}
        />

        <Controller
          name="targetRole"
          control={control}
          defaultValue=""
          rules={{
            validate: (value) =>
              value.trim().length > 0 || "Target role is required",
          }}
          render={({ field }) => (
            <SuggestInput
              label="Target role"
              required
              placeholder="Full Stack Developer"
              hint="Start typing and pick your role, or write your own."
              emptyHeading="Popular roles"
              leftIcon={<Briefcase size={18} />}
              error={errors.targetRole?.message}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              getSuggestions={searchRoles}
            />
          )}
        />

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            rightIcon={<ArrowRight size={16} />}
          >
            Create cover letter
          </Button>
        </div>
      </form>
    </PreviewModal>
  );
}
