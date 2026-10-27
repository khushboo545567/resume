import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import Input from "../../../../components/ui/Input";
import SuggestInput from "../../../../components/ui/SuggestInput";
import { useResumeStore } from "../../../../store/resume.store";
import type { Resume } from "../../types/resume.types";
import { searchRoles } from "../../config/jobRoles";

import { useRewriteExperience } from "../../../ai/services/rewriteExperience.service";
import { useGenerateExperience } from "../../../ai/hooks/useGenerateExperience";
import AIQuickContextModal from "../../../ai/components/AIQuickContextModal";
import AIGenerateButton from "../../../ai/components/AIGenerateButton";

import BoldableInput from "./BoldableInput";
import BulletListField from "./form/BulletListField";
import DateRangeFields from "./form/DateRangeFields";
import FormCard from "./form/FormCard";
import { parseBullets } from "../utils/parseBullets";

interface Props {
  onClose: () => void;
  editIndex?: number;
  initialData?: Resume["experience"][number];
}

interface ExperienceFormData {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  currentlyWorking: boolean;
  responsibilities: { value: string }[];
  achievements: { value: string }[];
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

  // Fill the form when editing an existing item
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
  } = useFieldArray({ control, name: "responsibilities" });

  const {
    fields: achievementFields,
    append: addAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control, name: "achievements" });

  const updateExperienceItem = useResumeStore(
    (state) => state.updateExperienceItem,
  );
  const addExperience = useResumeStore((state) => state.addExperience);

  const { mutateAsync: rewriteExperience, isPending: isRewriting } =
    useRewriteExperience();
  const { mutateAsync: generateExperience, isPending: isGenerating } =
    useGenerateExperience();

  const [showContextModal, setShowContextModal] = useState(false);

  const [company, position, startDate, endDate, currentlyWorking] = watch([
    "company",
    "position",
    "startDate",
    "endDate",
    "currentlyWorking",
  ]);

  const setResponsibilities = (bullets: string[]) =>
    setValue(
      "responsibilities",
      bullets.map((value) => ({ value })),
      { shouldDirty: true },
    );

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

      setResponsibilities(parseBullets(result));
      setShowContextModal(false);
    } catch (error) {
      console.error("Generate failed:", error);
      alert("Failed to generate with AI. Please try again.");
    }
  };

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

      setResponsibilities(parseBullets(result));
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
      achievements: data.achievements.map((a) => a.value.trim()).filter(Boolean),
    };

    if (editIndex !== undefined) {
      updateExperienceItem(editIndex, experience);
    } else {
      addExperience(experience);
    }

    onClose();
  };

  return (
    <FormCard
      title={editIndex !== undefined ? "Edit Experience" : "Add Experience"}
      submitLabel={
        editIndex !== undefined ? "Update Experience" : "Save Experience"
      }
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onClose}
      extra={
        <AIQuickContextModal
          open={showContextModal}
          onClose={() => setShowContextModal(false)}
          onSubmit={handleContextSubmit}
          loading={isGenerating}
        />
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <Input
          label="Company"
          required
          placeholder="Google"
          error={errors.company?.message}
          {...register("company", {
            required: "Company is required",
            minLength: { value: 2, message: "Minimum 2 characters required" },
          })}
        />

        <Controller
          name="position"
          control={control}
          rules={{
            required: "Position is required",
            minLength: { value: 2, message: "Minimum 2 characters required" },
          }}
          render={({ field }) => (
            <SuggestInput
              label="Position"
              required
              placeholder="Senior Frontend Developer"
              emptyHeading="Popular roles"
              error={errors.position?.message}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              getSuggestions={searchRoles}
            />
          )}
        />

        <div className="sm:col-span-2">
          <Input
            label="Location"
            placeholder="Berlin, Germany"
            {...register("location")}
          />
        </div>
      </div>

      <DateRangeFields
        startDate={startDate ?? ""}
        endDate={endDate ?? ""}
        current={!!currentlyWorking}
        onStartChange={(value) =>
          setValue("startDate", value, { shouldDirty: true })
        }
        onEndChange={(value) =>
          setValue("endDate", value, { shouldDirty: true })
        }
        onCurrentChange={(checked) => {
          setValue("currentlyWorking", checked, { shouldDirty: true });
          if (checked) setValue("endDate", "", { shouldDirty: true });
        }}
        currentLabel="I currently work here"
      />

      <BulletListField
        title="Responsibilities"
        hint="Select text, then tap B to make it bold."
        ids={responsibilityFields.map((field) => field.id)}
        addLabel="Add responsibility"
        onAdd={() => addResponsibility({ value: "" })}
        onRemove={removeResponsibility}
        actions={
          <>
            <AIGenerateButton
              onClick={handleGenerateClick}
              loading={isGenerating}
            />
            <AIGenerateButton
              onClick={handleRewrite}
              loading={isRewriting}
              disabled={!position?.trim()}
              label="Rewrite with AI"
              loadingLabel="Rewriting..."
            />
          </>
        }
        renderInput={(index) => (
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
        )}
      />

      <BulletListField
        title="Achievements"
        ids={achievementFields.map((field) => field.id)}
        addLabel="Add achievement"
        onAdd={() => addAchievement({ value: "" })}
        onRemove={removeAchievement}
        renderInput={(index) => (
          <Input
            placeholder="Reduced page load by 40%"
            aria-label={`Achievement ${index + 1}`}
            {...register(`achievements.${index}.value`)}
          />
        )}
      />
    </FormCard>
  );
}
