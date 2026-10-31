import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { KeyboardEvent } from "react";
import { Plus } from "lucide-react";

import Button from "../../../../components/ui/Button";
import FormField from "../../../../components/ui/FormField";
import Input from "../../../../components/ui/Input";
import SuggestInput from "../../../../components/ui/SuggestInput";
import { useResumeStore } from "../../../../store/resume.store";
import type { Resume } from "../../types/resume.types";
import { searchProjectRoles } from "../../config/roleOptions";
import { searchTechnologies } from "../../config/technologyOptions";

import { useGenerateProject } from "../../../ai/hooks/useGenerateProject";
import AIProjectContextModal from "../../../ai/components/AIProjectContextModal";
import AIGenerateButton from "../../../ai/components/AIGenerateButton";

import BulletListField from "./form/BulletListField";
import ChipList from "./form/ChipList";
import DateRangeFields from "./form/DateRangeFields";
import FormCard from "./form/FormCard";
import { parseBullets } from "../utils/parseBullets";
import { isOutOfCreditsError } from "../../../../api/axios";

interface Props {
  onClose: () => void;
  editIndex?: number;
  initialData?: Resume["projects"][number];
}

interface ProjectFormData {
  title: string;
  role: string;
  description: { value: string }[];
  highlight: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  technologies: string[];
  github: string;
  link: string;
}

/** Empty is fine (the field is optional); anything else must be a full URL. */
function validateOptionalUrl(value: string) {
  if (!value || value.trim() === "") return true;

  try {
    new URL(value);
    return true;
  } catch {
    return "Please enter a full URL, starting with https://";
  }
}

export default function ProjectForm({ onClose, editIndex, initialData }: Props) {
  const addProject = useResumeStore((state) => state.addProject);
  const updateProject = useResumeStore((state) => state.updateProject);
  const templateId = useResumeStore((state) => state.resume?.templateId);
  const isExecutiveBlue = templateId === "executive-blue";

  const [technology, setTechnology] = useState("");
  const [showContextModal, setShowContextModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: "",
      role: "",
      description: [{ value: "" }],
      highlight: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      technologies: [],
      github: "",
      link: "",
    },
  });

  const {
    fields: descriptionFields,
    append: addDescription,
    remove: removeDescription,
  } = useFieldArray({ control, name: "description" });

  // Fill the form when editing an existing project
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        role: initialData.role || "",
        // string[] -> { value: string }[] for the field array
        description: (initialData.description || []).map((description) => ({
          value: description,
        })),
        highlight: initialData.highlight || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        currentlyWorking: initialData.currentlyWorking || false,
        technologies: initialData.technologies || [],
        github: initialData.github || "",
        link: initialData.link || "",
      });
    }
  }, [initialData, reset]);

  const [title, technologies = [], startDate, endDate, currentlyWorking] =
    watch(["title", "technologies", "startDate", "endDate", "currentlyWorking"]);

  /* ---------- technologies ---------- */

  const addTechnology = (picked?: string) => {
    const value = (picked ?? technology).trim();

    if (!value) return;

    const alreadyAdded = technologies.some(
      (tech) => tech.toLowerCase() === value.toLowerCase(),
    );

    if (!alreadyAdded) {
      setValue("technologies", [...technologies, value], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    setTechnology("");
  };

  const removeTechnology = (tech: string) => {
    setValue(
      "technologies",
      technologies.filter((t) => t !== tech),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  // SuggestInput already handles Enter when it picks a suggestion.
  const onTechnologyKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.defaultPrevented) return;
    e.preventDefault();
    addTechnology();
  };

  /* ---------- AI generation ---------- */

  const { mutateAsync: generateProject, isPending: isGenerating } =
    useGenerateProject();

  const handleGenerateClick = () => {
    if (!title?.trim()) {
      alert("Please enter Project Title first.");
      return;
    }

    setShowContextModal(true);
  };

  const handleContextSubmit = async (context: {
    whatBuilt: string;
    problemSolved: string;
    teamSize: string;
    impact: string;
  }) => {
    try {
      const result = await generateProject({
        projectName: title.trim(),
        technologies,
        context,
      });

      // ["Built...", "Used..."] -> [{ value: "Built..." }, ...]
      setValue(
        "description",
        parseBullets(result).map((value) => ({ value })),
        { shouldDirty: true, shouldValidate: true },
      );

      setShowContextModal(false);
    } catch (error) {
      // No credits: the app-wide "buy credits" prompt is already showing.
      if (isOutOfCreditsError(error)) return;
      console.error("Generate failed:", error);
      alert("Failed to generate with AI. Please try again.");
    }
  };

  /* ---------- submit ---------- */

  const onSubmit = (data: ProjectFormData) => {
    const cleanedData = {
      title: data.title.trim(),
      role: data.role?.trim() ?? "",
      description: data.description
        .map((item) => item.value.trim())
        .filter(Boolean),
      highlight: isExecutiveBlue ? (data.highlight?.trim() ?? "") : "",
      startDate: data.startDate,
      endDate: data.currentlyWorking ? "" : data.endDate,
      currentlyWorking: data.currentlyWorking,
      technologies: data.technologies,
      github: data.github?.trim() ?? "",
      link: data.link?.trim() ?? "",
    };

    if (editIndex !== undefined) {
      updateProject(editIndex, cleanedData);
    } else {
      addProject(cleanedData);
    }

    reset();

    onClose();
  };

  return (
    <FormCard
      title={editIndex !== undefined ? "Edit Project" : "Add Project"}
      submitLabel={editIndex !== undefined ? "Update Project" : "Save Project"}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onClose}
      extra={
        <AIProjectContextModal
          open={showContextModal}
          onClose={() => setShowContextModal(false)}
          onSubmit={handleContextSubmit}
          loading={isGenerating}
        />
      }
    >
      <Input
        label="Project title"
        required
        placeholder="AI Resume Builder using React, Node.js & MongoDB"
        error={errors.title?.message}
        {...register("title", {
          required: "Project title is required",
          minLength: { value: 2, message: "Minimum 2 characters required" },
        })}
      />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <SuggestInput
            label="Role"
            placeholder="Full Stack Developer"
            emptyHeading="Popular roles"
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            getSuggestions={searchProjectRoles}
          />
        )}
      />

      {/* Executive Blue template only */}
      {isExecutiveBlue && (
        <Input
          label="Highlight line"
          hint="Shown above your bullet points."
          placeholder="One standout line that summarizes this project's impact"
          {...register("highlight")}
        />
      )}

      <BulletListField
        title="Description"
        ids={descriptionFields.map((field) => field.id)}
        addLabel="Add point"
        onAdd={() => addDescription({ value: "" })}
        onRemove={removeDescription}
        actions={
          <AIGenerateButton
            onClick={handleGenerateClick}
            loading={isGenerating}
          />
        }
        renderInput={(index) => (
          <Input
            aria-label={`Description point ${index + 1}`}
            placeholder={
              index === 0
                ? "Built a real-time chat application using Socket.IO"
                : "Describe another achievement or feature"
            }
            error={errors.description?.[index]?.value?.message}
            {...register(`description.${index}.value`, {
              // Extra blank rows are dropped on save; only the first is needed.
              validate: (value) => {
                const text = value.trim();

                if (!text) {
                  return index === 0 ? "Add at least one description point" : true;
                }

                return (
                  text.length >= 10 || "Write at least 10 characters"
                );
              },
            })}
          />
        )}
      />

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
        currentLabel="I'm still working on this project"
      />

      <FormField label="Technologies">
        <div
          className="flex items-start gap-3"
          onKeyDown={onTechnologyKeyDown}
        >
          <div className="min-w-0 flex-1">
            <SuggestInput
              placeholder="React"
              emptyHeading="Popular technologies"
              value={technology}
              onChange={setTechnology}
              onPick={addTechnology}
              getSuggestions={(text) => searchTechnologies(text, technologies)}
            />
          </div>

          <Button
            type="button"
            size="lg"
            variant="outline"
            leftIcon={<Plus size={18} />}
            onClick={() => addTechnology()}
          >
            Add
          </Button>
        </div>

        <ChipList items={technologies} onRemove={removeTechnology} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <Input
          label="GitHub URL (optional)"
          placeholder="https://github.com/username/project"
          error={errors.github?.message}
          {...register("github", { validate: validateOptionalUrl })}
        />

        <Input
          label="Live demo URL (optional)"
          placeholder="https://project.vercel.app"
          error={errors.link?.message}
          {...register("link", { validate: validateOptionalUrl })}
        />
      </div>
    </FormCard>
  );
}
