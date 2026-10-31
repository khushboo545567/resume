import { Controller, useForm } from "react-hook-form";

import Checkbox from "../../../../components/ui/Checkbox";
import FormField from "../../../../components/ui/FormField";
import Input from "../../../../components/ui/Input";
import Select from "../../../../components/ui/Select";
import SuggestInput from "../../../../components/ui/SuggestInput";
import Textarea from "../../../../components/ui/Textarea";
import { useResumeStore } from "../../../../store/resume.store";
import type { Resume } from "../../types/resume.types";

import { useGenerateCoursework } from "../../../ai/hooks/useGenerateCoursework";
import AIGenerateButton from "../../../ai/components/AIGenerateButton";
import FormCard from "./form/FormCard";

import {
  searchDegrees,
  searchFieldsOfStudy,
} from "../../config/educationOptions";
import { searchLocations } from "../../config/locations";
import { isOutOfCreditsError } from "../../../../api/axios";

interface Props {
  onClose: () => void;
  editIndex?: number;
  initialData?: Resume["education"][number];
}

type EducationFormData = Resume["education"][number];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function EducationForm({
  onClose,
  initialData,
  editIndex,
}: Props) {
  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducationItem = useResumeStore(
    (state) => state.updateEducationItem,
  );

  const { register, handleSubmit, reset, watch, setValue, control } =
    useForm<EducationFormData>({
      defaultValues: initialData ?? {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        location: "",
        startMonth: "Jan",
        startYear: new Date().getFullYear(),
        endMonth: "Jan",
        endYear: new Date().getFullYear(),
        current: false,
        cgpa: "",
        coursework: "",
      },
    });

  const resume = useResumeStore((state) => state.resume);
  const [degree, fieldOfStudy, isCurrent] = watch([
    "degree",
    "fieldOfStudy",
    "current",
  ]);

  const { mutateAsync: generateCoursework, isPending: isGeneratingCoursework } =
    useGenerateCoursework();

  const handleGenerateCoursework = async () => {
    if (!degree?.trim() || !fieldOfStudy?.trim()) {
      alert("Please enter Degree and Field of Study first.");
      return;
    }

    try {
      const result = await generateCoursework({
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        targetRole: resume?.targetRole,
      });

      setValue("coursework", result, { shouldDirty: true });
    } catch (error) {
      // No credits: the app-wide "buy credits" prompt is already showing.
      if (isOutOfCreditsError(error)) return;
      console.error("Coursework generation failed:", error);
      alert("Failed to generate coursework. Please try again.");
    }
  };

  const onSubmit = (data: EducationFormData) => {
    if (editIndex !== undefined) {
      updateEducationItem(editIndex, data);
    } else {
      addEducation(data);
    }

    reset();

    onClose();
  };

  return (
    <FormCard
      title={editIndex !== undefined ? "Edit Education" : "Add Education"}
      submitLabel={editIndex !== undefined ? "Update Education" : "Save Education"}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onClose}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <Input
          label="College / University"
          placeholder="IIT Bombay"
          {...register("institution")}
        />

        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <SuggestInput
              label="Location"
              placeholder="Hyderabad, India"
              emptyHeading="Popular locations"
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              getSuggestions={searchLocations}
            />
          )}
        />

        <Controller
          name="degree"
          control={control}
          render={({ field }) => (
            <SuggestInput
              label="Degree"
              placeholder="B.E., B.Tech"
              emptyHeading="Popular degrees"
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              getSuggestions={searchDegrees}
            />
          )}
        />

        <Controller
          name="fieldOfStudy"
          control={control}
          render={({ field }) => (
            <SuggestInput
              label="Field of study"
              placeholder="Computer Science"
              emptyHeading="Popular fields"
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              getSuggestions={searchFieldsOfStudy}
            />
          )}
        />

        <FormField label="Start date">
          <div className="grid grid-cols-2 gap-2">
            <Select aria-label="Start month" {...register("startMonth")}>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>

            <Input
              type="number"
              inputMode="numeric"
              aria-label="Start year"
              placeholder="Year"
              {...register("startYear", { valueAsNumber: true })}
            />
          </div>
        </FormField>

        <FormField
          label="End date"
          hint={isCurrent ? "Present will be shown on the resume." : undefined}
        >
          <div className="grid grid-cols-2 gap-2">
            <Select
              aria-label="End month"
              disabled={isCurrent}
              {...register("endMonth")}
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>

            <Input
              type="number"
              inputMode="numeric"
              aria-label="End year"
              placeholder="Year"
              disabled={isCurrent}
              {...register("endYear", { valueAsNumber: true })}
            />
          </div>
        </FormField>

        <Input
          label="CGPA / GPA"
          placeholder="7.96/10"
          {...register("cgpa")}
        />

        <div className="sm:flex sm:items-end sm:pb-1">
          <Checkbox label="Currently studying here" {...register("current")} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="education-coursework"
            className="text-sm font-semibold text-heading"
          >
            Relevant coursework
          </label>

          <AIGenerateButton
            onClick={handleGenerateCoursework}
            loading={isGeneratingCoursework}
          />
        </div>

        <Textarea
          id="education-coursework"
          placeholder="Comma-separated, e.g. OOP, DBMS, DSA, Machine Learning"
          {...register("coursework")}
        />
      </div>
    </FormCard>
  );
}
