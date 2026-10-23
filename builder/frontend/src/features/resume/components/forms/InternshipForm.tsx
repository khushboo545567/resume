import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

import Button from "../../../../components/ui/Button";
import { useResumeStore } from "../../../../store/resume.store";
import type { Resume } from "../../types/resume.types";
import { useGenerateInternship } from "../../../ai/hooks/useGenerateInternship";
import AIInternshipContextModal from "../../../ai/components/AIInternshipContextModal";
import MonthYearPicker from "../../editor/components/MonthYearPicker";
interface Props {
  onClose: () => void;
  editIndex?: number;
  initialData?: Resume["internships"][number];
}
const CURRENT_YEAR = new Date().getFullYear();
interface InternshipFormData {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  currentlyInterning: boolean;
  responsibilities: { value: string }[];
  achievements: { value: string }[];
  location: string;
}

export default function InternshipForm({
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
  } = useForm<InternshipFormData>({
    defaultValues: {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      currentlyInterning: false,
      responsibilities: [{ value: "" }],
      achievements: [{ value: "" }],
      location: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        company: initialData.company || "",
        role: initialData.role || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        currentlyInterning: initialData.currentlyInterning || false,
        location: initialData.location || "",
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

  const updateInternshipItem = useResumeStore(
    (state) => state.updateInternshipItem,
  );
  const addInternship = useResumeStore((state) => state.addInternship);

  const [showContextModal, setShowContextModal] = useState(false);

  const { mutateAsync: generateInternship, isPending: isGenerating } =
    useGenerateInternship();

  const company = watch("company");
  const role = watch("role");

  const handleGenerateClick = () => {
    if (!company?.trim() || !role?.trim()) {
      alert("Please enter Company and Role first.");
      return;
    }
    setShowContextModal(true);
  };

  const handleContextSubmit = async (context: {
    whatDone: string;
    toolsUsed: string;
    mentorTeam: string;
    result: string;
  }) => {
    try {
      const result = await generateInternship({
        company: company.trim(),
        role: role.trim(),
        context,
      });

      const bullets = Array.isArray(result)
        ? result
        : typeof result === "string"
          ? result
              .split("\n")
              .map((line: string) => line.trim())
              .filter(Boolean)
          : [];

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

  const onSubmit = (data: InternshipFormData) => {
    const internship = {
      ...data,
      endDate: data.currentlyInterning ? "" : data.endDate,
      responsibilities: data.responsibilities
        .map((r) => r.value.trim())
        .filter(Boolean),
      achievements: data.achievements
        .map((a) => a.value.trim())
        .filter(Boolean),
    };

    if (editIndex !== undefined) {
      updateInternshipItem(editIndex, internship);
    } else {
      addInternship(internship);
    }

    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-border bg-popup p-4 sm:p-8"
    >
      <h2 className="text-2xl font-bold text-heading">
        {editIndex !== undefined ? "Edit Internship" : "Add Internship"}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label className="font-medium text-heading">Company</label>
          <input
            {...register("company", {
              required: "Company is required",
              minLength: { value: 2, message: "Minimum 2 characters required" },
            })}
            placeholder="Throne8"
            className="mt-2 h-12 w-full rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium text-heading">Role</label>
          <input
            {...register("role", {
              required: "Role is required",
              minLength: { value: 2, message: "Minimum 2 characters required" },
            })}
            placeholder="Software Development Intern"
            className="mt-2 h-12 w-full rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
          />
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* location added -------------*/}
        <div className="col-span-2">
          <label className="font-medium text-heading">Location</label>

          <input
            {...register("location", {
              required: "Location is required",
              minLength: {
                value: 2,
                message: "Minimum 2 characters required",
              },
            })}
            placeholder="Bhopal.."
            className="mt-2 h-12 w-full rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
          />

          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* <div>
          <label className="font-medium text-heading">Start Date</label>
          <input
            type="month"
            {...register("startDate")}
            className="mt-2 h-12 w-full rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
          />
        </div> */}

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

        {/* <div>
          <label className="font-medium text-heading">End Date</label>
          <input
            disabled={watch("currentlyInterning")}
            type="month"
            {...register("endDate")}
            className="mt-2 h-12 w-full rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring disabled:bg-navbar-hover"
          />
          {watch("currentlyInterning") && (
            <p className="mt-1 text-xs text-subheading">
              Present will be shown on resume.
            </p>
          )}
        </div> */}

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
                disabled={watch("currentlyInterning")}
                placeholder="Select end month"
              />
            )}
          />

          {watch("currentlyInterning") && (
            <p className="mt-1 text-xs text-subheading">
              Present will be shown on resume.
            </p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-3 text-heading">
        <input
          type="checkbox"
          {...register("currentlyInterning", {
            onChange: (e) => {
              if (e.target.checked) {
                setValue("endDate", "");
              }
            },
          })}
        />
        I currently intern here
      </label>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-heading">Responsibilities</h3>
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="rounded-lg bg-btn px-4 py-2 text-btn-text text-sm flex items-center gap-2 hover:bg-btn-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? "Generating..." : "✨ Generate with AI"}
          </button>
        </div>

        <div className="space-y-3 mt-3">
          {responsibilityFields.map((field, index) => (
            <div key={field.id} className="flex gap-3">
              <input
                {...register(`responsibilities.${index}.value`)}
                placeholder="Assisted in building REST APIs for the resume builder"
                className="flex-1 rounded-lg border border-border bg-navbar px-4 h-11 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
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

      <div>
        <h3 className="font-semibold text-heading">Achievements</h3>
        <div className="space-y-3 mt-3">
          {achievementFields.map((field, index) => (
            <div key={field.id} className="flex gap-3">
              <input
                {...register(`achievements.${index}.value`)}
                placeholder="Received a Letter of Recommendation for performance"
                className="flex-1 rounded-lg border border-border bg-navbar px-4 h-11 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
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
          {editIndex !== undefined ? "Update Internship" : "Save Internship"}
        </Button>
      </div>
      <AIInternshipContextModal
        open={showContextModal}
        onClose={() => setShowContextModal(false)}
        onSubmit={handleContextSubmit}
        loading={isGenerating}
      />
    </form>
  );
}
