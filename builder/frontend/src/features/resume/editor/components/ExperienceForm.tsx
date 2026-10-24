import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect } from "react";
import MonthYearPicker from "./MonthYearPicker";
import Button from "../../../../components/ui/Button";
import { useResumeStore } from "../../../../store/resume.store";
import type { Resume } from "../../types/resume.types";
import { useRewriteExperience } from "../../../ai/services/rewriteExperience.service";
import { useState } from "react";
import { useGenerateExperience } from "../../../ai/hooks/useGenerateExperience";
import AIQuickContextModal from "../../../ai/components/AIQuickContextModal";
import BoldableInput from "./BoldableInput";

interface Props {
  onClose: () => void;
  editIndex?: number;
  initialData?: Resume["experience"][number];
}
const CURRENT_YEAR = new Date().getFullYear();
interface ExperienceFormData {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;

  responsibilities: { value: string }[];
  achievements: { value: string }[];
  location: string;
}

export default function ExperienceForm({
  onClose,
  initialData,
  editIndex,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      location: "",
      currentlyWorking: false,
      responsibilities: [{ value: "" }],
      achievements: [{ value: "" }],
    },
  });

  // Reset form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        company: initialData.company || "",
        position: initialData.position || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        location: initialData.location || "",
        currentlyWorking: initialData.currentlyWorking || false,
        responsibilities: (initialData.responsibilities || []).map((r) => ({
          value: r,
        })),
        achievements: (initialData.achievements || []).map((a) => ({
          value: a,
        })),
      });
    }
  }, [initialData, reset]);

  const {
    fields: responsibilityFields,
    append: addResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({
    control,
    name: "responsibilities",
  });

  const {
    fields: achievementFields,
    append: addAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control,
    name: "achievements",
  });

  const updateExperienceItem = useResumeStore(
    (state) => state.updateExperienceItem,
  );
  const addExperience = useResumeStore((state) => state.addExperience);

  // AI Rewrite Hook (React Query)
  const { mutateAsync: rewriteExperience, isPending: isRewriting } =
    useRewriteExperience();

  const [showContextModal, setShowContextModal] = useState(false);

  const { mutateAsync: generateExperience, isPending: isGenerating } =
    useGenerateExperience();

  const company = watch("company");

  const handleGenerateClick = () => {
    if (!company?.trim() || !position?.trim()) {
      alert("Please enter Company and Position first.");
      return;
    }
    setShowContextModal(true);
  };

  const handleContextSubmit = async (context: {
    workedOn: string;
    technologies: string;
    scope: string;
    impact: string;
  }) => {
    try {
      const result = await generateExperience({
        company: company.trim(),
        position: position.trim(),
        context,
      });

      const bullets = Array.isArray(result) ? result : [];

      setValue(
        "responsibilities",
        bullets.map((r: string) => ({ value: r })),
      );

      setShowContextModal(false);
    } catch (error) {
      console.error("Generate failed:", error);
      alert("Failed to generate with AI. Please try again.");
    }
  };

  const position = watch("position");

  const handleRewrite = async () => {
    const responsibilities = watch("responsibilities")
      .map((r) => r.value.trim())
      .filter(Boolean);

    if (responsibilities.length === 0) {
      alert("Please add at least one responsibility before rewriting.");
      return;
    }

    if (!position?.trim()) {
      alert("Please enter Position first.");
      return;
    }

    try {
      const result = await rewriteExperience({
        experience: responsibilities.join("\n"),
        targetRole: position.trim(),
      });

      const newResponsibilities = Array.isArray(result)
        ? result
        : typeof result === "string"
          ? result
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : [];

      setValue(
        "responsibilities",
        newResponsibilities.map((r) => ({ value: r })),
      );
    } catch (error) {
      console.error("Rewrite failed:", error);
      alert("Failed to rewrite with AI. Please try again.");
    }
  };

  const onSubmit = (data: ExperienceFormData) => {
    const experience = {
      ...data,
      endDate: data.currentlyWorking ? "" : data.endDate,
      responsibilities: data.responsibilities
        .map((r) => r.value.trim())
        .filter(Boolean),
      achievements: data.achievements
        .map((a) => a.value.trim())
        .filter(Boolean),
    };

    if (editIndex !== undefined) {
      updateExperienceItem(editIndex, experience);
    } else {
      addExperience(experience);
    }

    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-border bg-popup p-4 sm:p-6"
    >
      <h2 className="text-base font-bold text-heading sm:text-xl">
        {editIndex !== undefined ? "Edit Experience" : "Add Experience"}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label className="font-medium text-heading">Company</label>
          <input
            {...register("company", {
              required: "Company is required",
              minLength: { value: 2, message: "Minimum 2 characters required" },
            })}
            placeholder="Google"
            className="mt-2 h-12 w-full rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium text-heading">Position</label>
          <input
            {...register("position", {
              required: "Position is required",
              minLength: { value: 2, message: "Minimum 2 characters required" },
            })}
            placeholder="Senior Frontend Developer"
            className="mt-2 h-12 w-full rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">
              {errors.position.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="font-medium text-heading">Location</label>
          <input
            {...register("location")}
            placeholder="Berlin, Germany"
            className="mt-2 h-12 w-full rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="font-medium text-heading">Start Date</label>

          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <MonthYearPicker
                value={field.value || ""}
                onChange={field.onChange}
                maxYear={CURRENT_YEAR}
                placeholder="Select start month"
              />
            )}
          />
        </div>

        <div>
          <label className="font-medium text-heading">End Date</label>

          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <MonthYearPicker
                value={field.value || ""}
                onChange={field.onChange}
                maxYear={CURRENT_YEAR}
                disabled={watch("currentlyWorking")}
                placeholder="Select end month"
              />
            )}
          />

          {watch("currentlyWorking") && (
            <p className="mt-1 text-xs text-subheading">
              Present will be shown on resume.
            </p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-3 text-heading">
        <input
          type="checkbox"
          {...register("currentlyWorking", {
            onChange: (e) => {
              if (e.target.checked) {
                setValue("endDate", "");
              }
            },
          })}
        />
        I currently work here
      </label>

      {/* Responsibilities with AI Button */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold text-heading">Responsibilities</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="rounded-lg bg-btn px-4 py-2 text-btn-text text-sm flex items-center gap-2 hover:bg-btn-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? "Generating..." : "✨ Generate with AI"}
            </button>
            <button
              type="button"
              onClick={handleRewrite}
              disabled={isRewriting || !position?.trim()}
              className="rounded-lg bg-btn px-4 py-2 text-btn-text text-sm flex items-center gap-2 hover:bg-btn-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRewriting ? "✍️ Rewriting..." : "✨ Rewrite with AI"}
            </button>
          </div>
        </div>

        <div className="space-y-3 mt-3">
          {responsibilityFields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap items-start gap-3 sm:flex-nowrap">
              {/* <input
                {...register(`responsibilities.${index}.value`)}
                placeholder="Built Resume Builder used by 5000+ students"
                className="flex-1 rounded-lg border border-border bg-navbar px-4 h-11 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
              /> */}

              <Controller
                control={control}
                name={`responsibilities.${index}.value`}
                render={({ field: { value, onChange } }) => (
                  <BoldableInput
                    value={value}
                    onChange={onChange}
                    placeholder="Built Resume Builder used by 5000+ students"
                  />
                )}
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => removeResponsibility(index)}
                disabled={responsibilityFields.length === 1}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => addResponsibility({ value: "" })}
          >
            + Add Responsibility
          </Button>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h3 className="font-semibold text-heading">Achievements</h3>
        <div className="space-y-3 mt-3">
          {achievementFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <input
                {...register(`achievements.${index}.value`)}
                placeholder="Reduced page load by 40%"
                className="min-w-0 flex-1 rounded-lg border border-border bg-navbar px-4 h-11 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeAchievement(index)}
                disabled={achievementFields.length === 1}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => addAchievement({ value: "" })}
          >
            + Add Achievement
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {editIndex !== undefined ? "Update Experience" : "Save Experience"}
        </Button>
      </div>

      <AIQuickContextModal
        open={showContextModal}
        onClose={() => setShowContextModal(false)}
        onSubmit={handleContextSubmit}
        loading={isGenerating}
      />
    </form>
  );
}
