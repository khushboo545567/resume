import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import Input from "../../../../components/ui/Input";
import SuggestInput from "../../../../components/ui/SuggestInput";
import { useResumeStore } from "../../../../store/resume.store";
import type { Resume } from "../../types/resume.types";
import { searchInternshipRoles } from "../../config/roleOptions";
import { searchLocations } from "../../config/locations";

import { useGenerateInternship } from "../../../ai/hooks/useGenerateInternship";
import AIInternshipContextModal from "../../../ai/components/AIInternshipContextModal";
import AIGenerateButton from "../../../ai/components/AIGenerateButton";

import BulletListField from "../../editor/components/form/BulletListField";
import DateRangeFields from "../../editor/components/form/DateRangeFields";
import FormCard from "../../editor/components/form/FormCard";
import { parseBullets } from "../../editor/utils/parseBullets";
import { isOutOfCreditsError } from "../../../../api/axios";

interface Props {
  onClose: () => void;
  editIndex?: number;
  initialData?: Resume["internships"][number];
}

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

  // Fill the form when editing an existing item
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
  } = useFieldArray({ control, name: "responsibilities" });

  const {
    fields: achievementFields,
    append: addAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control, name: "achievements" });

  const updateInternshipItem = useResumeStore(
    (state) => state.updateInternshipItem,
  );
  const addInternship = useResumeStore((state) => state.addInternship);

  const { mutateAsync: generateInternship, isPending: isGenerating } =
    useGenerateInternship();

  const [showContextModal, setShowContextModal] = useState(false);

  const [company, role, startDate, endDate, currentlyInterning] = watch([
    "company",
    "role",
    "startDate",
    "endDate",
    "currentlyInterning",
  ]);

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

      setValue(
        "responsibilities",
        parseBullets(result).map((value) => ({ value })),
        { shouldDirty: true },
      );

      setShowContextModal(false);
    } catch (error) {
      // No credits: the app-wide "buy credits" prompt is already showing.
      if (isOutOfCreditsError(error)) return;
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
      achievements: data.achievements.map((a) => a.value.trim()).filter(Boolean),
    };

    if (editIndex !== undefined) {
      updateInternshipItem(editIndex, internship);
    } else {
      addInternship(internship);
    }

    onClose();
  };

  return (
    <FormCard
      title={editIndex !== undefined ? "Edit Internship" : "Add Internship"}
      submitLabel={
        editIndex !== undefined ? "Update Internship" : "Save Internship"
      }
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onClose}
      extra={
        <AIInternshipContextModal
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
          placeholder="Throne8"
          error={errors.company?.message}
          {...register("company", {
            required: "Company is required",
            minLength: { value: 2, message: "Minimum 2 characters required" },
          })}
        />

        <Controller
          name="role"
          control={control}
          rules={{
            required: "Role is required",
            minLength: { value: 2, message: "Minimum 2 characters required" },
          }}
          render={({ field }) => (
            <SuggestInput
              label="Role"
              required
              placeholder="Software Development Intern"
              emptyHeading="Popular roles"
              error={errors.role?.message}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              getSuggestions={searchInternshipRoles}
            />
          )}
        />

        <div className="sm:col-span-2">
          <Controller
            name="location"
            control={control}
            rules={{
              required: "Location is required",
              minLength: {
                value: 2,
                message: "Minimum 2 characters required",
              },
            }}
            render={({ field }) => (
              <SuggestInput
                label="Location"
                required
                placeholder="Bhopal, India"
                emptyHeading="Popular locations"
                error={errors.location?.message}
                name={field.name}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                getSuggestions={searchLocations}
              />
            )}
          />
        </div>
      </div>

      <DateRangeFields
        startDate={startDate ?? ""}
        endDate={endDate ?? ""}
        current={!!currentlyInterning}
        onStartChange={(value) =>
          setValue("startDate", value, { shouldDirty: true })
        }
        onEndChange={(value) =>
          setValue("endDate", value, { shouldDirty: true })
        }
        onCurrentChange={(checked) => {
          setValue("currentlyInterning", checked, { shouldDirty: true });
          if (checked) setValue("endDate", "", { shouldDirty: true });
        }}
        currentLabel="I currently intern here"
      />

      <BulletListField
        title="Responsibilities"
        ids={responsibilityFields.map((field) => field.id)}
        addLabel="Add responsibility"
        onAdd={() => addResponsibility({ value: "" })}
        onRemove={removeResponsibility}
        actions={
          <AIGenerateButton
            onClick={handleGenerateClick}
            loading={isGenerating}
          />
        }
        renderInput={(index) => (
          <Input
            placeholder="Assisted in building REST APIs for the resume builder"
            aria-label={`Responsibility ${index + 1}`}
            {...register(`responsibilities.${index}.value`)}
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
            placeholder="Received a Letter of Recommendation for performance"
            aria-label={`Achievement ${index + 1}`}
            {...register(`achievements.${index}.value`)}
          />
        )}
      />
    </FormCard>
  );
}
