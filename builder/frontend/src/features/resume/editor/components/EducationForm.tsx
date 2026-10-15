import { useGenerateCoursework } from "../../../ai/hooks/useGenerateCoursework";

import { useForm } from "react-hook-form";

import Button from "../../../../components/ui/Button";

import { useResumeStore } from "../../../../store/resume.store";

import type { Resume } from "../../types/resume.types";

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
  editIndex,
  initialData,
}: Props) {
  const addEducation = useResumeStore((state) => state.addEducation);

  const updateEducationItem = useResumeStore(
    (state) => state.updateEducationItem,
  );

  const { register, handleSubmit, reset, watch, setValue } =
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
  const degree = watch("degree");
  const fieldOfStudy = watch("fieldOfStudy");

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

      setValue("coursework", result);
    } catch (error) {
      console.error("Coursework generation failed:", error);
      alert("Failed to generate coursework. Please try again.");
    }
  };

  const isCurrent = watch("current");

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-border bg-popup p-4 sm:p-6"
    >
      <h2 className="text-2xl font-bold text-heading">
        {editIndex !== undefined ? "Edit Education" : "Add Education"}
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <input
          {...register("institution")}
          placeholder="College / University"
          className="h-12 rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
        />

        <input
          {...register("location")}
          placeholder="Location (e.g. Hyderabad, India)"
          className="h-12 rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
        />

        <input
          {...register("degree")}
          placeholder="Degree (e.g. B.E., B.Tech)"
          className="h-12 rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
        />

        <input
          {...register("fieldOfStudy")}
          placeholder="Field of Study (e.g. Computer Science)"
          className="h-12 rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
        />

        {/* Start date */}
        <div className="flex gap-2">
          <select
            {...register("startMonth")}
            className="h-12 w-1/2 rounded-lg border border-border bg-navbar px-2 text-heading outline-none focus:border-border-strong"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            type="number"
            {...register("startYear", { valueAsNumber: true })}
            placeholder="Start Year"
            className="h-12 w-1/2 rounded-lg border border-border bg-navbar px-2 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* End date */}
        <div className="flex gap-2">
          <select
            {...register("endMonth")}
            disabled={isCurrent}
            className="h-12 w-1/2 rounded-lg border border-border bg-navbar px-2 text-heading outline-none focus:border-border-strong disabled:bg-navbar-hover"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            type="number"
            {...register("endYear", { valueAsNumber: true })}
            disabled={isCurrent}
            placeholder="End Year"
            className="h-12 w-1/2 rounded-lg border border-border bg-navbar px-2 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring disabled:bg-navbar-hover"
          />
        </div>

        <input
          {...register("cgpa")}
          placeholder="CGPA / GPA (e.g. 7.96/10)"
          className="h-12 rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
        />

        <label className="flex items-center gap-2 text-sm text-nav-text">
          <input type="checkbox" {...register("current")} />
          Currently studying here
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-heading">
            Relevant Coursework
          </label>
          <button
            type="button"
            onClick={handleGenerateCoursework}
            disabled={isGeneratingCoursework}
            className="rounded-lg bg-btn px-3 py-1.5 text-btn-text text-sm flex items-center gap-2 hover:bg-btn-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGeneratingCoursework ? "Generating..." : "✨ Generate with AI"}
          </button>
        </div>
        <textarea
          {...register("coursework")}
          placeholder="Relevant Coursework (comma-separated, e.g. OOP, DBMS, DSA, Machine Learning)"
          className="min-h-[80px] w-full rounded-lg border border-border bg-navbar px-4 py-3 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit">Save Education</Button>
      </div>
    </form>
  );
}
