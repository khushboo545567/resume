import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "../../../../components/ui/Button";
import { useResumeStore } from "../../../../store/resume.store";
import { editorTemplates } from "../../config/editorTemplates";

interface SettingsFormData {
  title: string;
  targetRole: string;
  templateId: string;
  status: "draft" | "completed";
}

export default function SettingsSection() {
  const resume = useResumeStore((state) => state.resume);

  const updateResumeSettings = useResumeStore(
    (state) => state.updateResumeSettings
  );

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<SettingsFormData>({
    defaultValues: {
      title: "",
      targetRole: "",
      templateId: "technical-developer",
      status: "draft",
    },
  });

  useEffect(() => {
    if (!resume) return;

    reset({
      title: resume.title,
      targetRole: resume.targetRole,
      templateId: resume.templateId,
      status: resume.status,
    });
  }, [resume, reset]);

  const onSubmit = (data: SettingsFormData) => {
    updateResumeSettings(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <div>
        <p className="text-xs text-heading/60 sm:text-sm">
          Manage your resume configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label className="font-medium">
            Resume Name
          </label>

          <input
            {...register("title")}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
          />
        </div>

        <div>
          <label className="font-medium">
            Target Role
          </label>

          <input
            {...register("targetRole")}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
          />
        </div>

        <div>
          <label className="font-medium">
            Template
          </label>

          <select
            {...register("templateId")}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
          >
            {editorTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}

            {/* Older resumes may use a layout that is not in the picker; keep it
                selectable so saving settings does not silently change it. */}
            {resume &&
              !editorTemplates.some((t) => t.id === resume.templateId) && (
                <option value={resume.templateId}>{resume.templateId}</option>
              )}
          </select>
        </div>

        <div>
          <label className="font-medium">
            Status
          </label>

          <select
            {...register("status")}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
          >
            <option value="draft">
              Draft
            </option>

            <option value="completed">
              Completed
            </option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Save Settings
        </Button>
      </div>
    </form>
  );
}