import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Plus, Sparkles, X, Wand2, Loader2 } from "lucide-react";

import Button from "../../../../components/ui/Button";
import type { QuickGenerateFormData } from "../../../ai/services/generate-general-resume.service";
import { useState } from "react";
import TagAutocompleteInput from "./TagAutocompleteInput";
import {
  ALL_TECHNOLOGY_SUGGESTIONS,
  SKILL_CATEGORY_PRESETS,
  getSkillSuggestions,
} from "../utils/skillSuggestions";
import { useGenerateCoursework } from "../../../ai/hooks/useGenerateCoursework";
import MonthYearPicker from "./MonthYearPicker";

interface Props {
  onGenerate: (data: QuickGenerateFormData) => void;
  onCancel: () => void;
  initialData?: QuickGenerateFormData;
}

const inputClass =
  "mt-1.5 h-11 w-full rounded-lg border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring";

const textAreaClass =
  "mt-1.5 w-full rounded-lg border border-border bg-navbar px-4 py-3 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring";

const labelClass = "text-sm font-medium text-heading";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR + 6 - 1980 + 1 },
  (_, i) => CURRENT_YEAR + 5 - i,
);

function RemoveRowButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-3 text-heading/40 hover:text-red-600"
    >
      <X size={16} />
    </button>
  );
}

function SectionHeader({
  title,
  optional,
  onAdd,
  addLabel,
  onCustomize,
}: {
  title: string;
  optional?: boolean;
  onAdd: () => void;
  addLabel: string;
  onCustomize?: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-heading">
        {title}{" "}
        {optional && (
          <span className="text-sm font-normal text-heading/50">(optional)</span>
        )}
      </h3>
      <div className="flex items-center gap-3">
        {onCustomize && (
          <button
            type="button"
            onClick={onCustomize}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-subheading hover:underline bg-btn-hover-bg px-4 py-2 rounded-2xl border border-border"
          >
            <Wand2 size={13} />
            customize
          </button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={onAdd}
        >
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

function CustomizeInstructionBox({
  registerName,
  register,
  placeholder,
}: {
  registerName:
    | "summaryInstruction"
    | "skillsInstruction"
    | "experienceInstruction"
    | "internshipsInstruction"
    | "projectsInstruction"
    | "achievementsInstruction";
  register: ReturnType<typeof useForm<QuickGenerateFormData>>["register"];
  placeholder: string;
}) {
  return (
    <div className="mt-3 rounded-xl border border-border bg-navbar p-4">
      <label className={labelClass}>
        How should this section be customized?
      </label>
      <textarea
        {...register(registerName)}
        rows={2}
        className={textAreaClass}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function QuickGenerateForm({
  onGenerate,
  onCancel,
  initialData,
}: Props) {
  const { register, control, handleSubmit, watch, setValue } =
    useForm<QuickGenerateFormData>({
      defaultValues: initialData ?? {
        jobDescription: "",
        summary: "",
        summaryInstruction: "",
        personalInfo: {
          fullName: "",
          title: "",
          email: "",
          phone: "",
          address: "",
          linkedIn: "",
          github: "",
          portfolio: "",
        },
        skills: [],
        skillsInstruction: "",
        experience: [],
        experienceInstruction: "",
        internships: [],
        internshipsInstruction: "",
        education: [{ institution: "", degree: "" }],
        projects: [{ title: "", technologies: "", descriptionText: "" }],
        projectsInstruction: "",
        languages: [],
        certifications: "",
        achievements: "",
        achievementsInstruction: "",
      },
    });

  const skills = useFieldArray({ control, name: "skills" });

  const currentSkillTitles = (watch("skills") || []).map((s) =>
    (s?.title || "").trim().toLowerCase(),
  );
  const availableSkillPresets = SKILL_CATEGORY_PRESETS.filter(
    (preset) => !currentSkillTitles.includes(preset.toLowerCase()),
  );

  const experience = useFieldArray({ control, name: "experience" });
  const internships = useFieldArray({ control, name: "internships" });
  const education = useFieldArray({ control, name: "education" });
  const projects = useFieldArray({ control, name: "projects" });
  const languages = useFieldArray({ control, name: "languages" });
  const [showSummaryCustomize, setShowSummaryCustomize] = useState(false);
  const [showSkillsCustomize, setShowSkillsCustomize] = useState(false);
  const [showProjectsCustomize, setShowProjectsCustomize] = useState(false);
  const [showExperienceCustomize, setShowExperienceCustomize] = useState(false);
  const [showInternshipsCustomize, setShowInternshipsCustomize] =
    useState(false);

  const [showAchievementsCustomize, setShowAchievementsCustomize] =
    useState(false);
  const { mutate: generateCourseworkMutate } = useGenerateCoursework();
  const [courseworkLoadingIndex, setCourseworkLoadingIndex] = useState<
    number | null
  >(null);
  const watchedEducation = watch("education");

  const onSubmit = (data: QuickGenerateFormData) => onGenerate(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-5xl space-y-8 rounded-2xl border border-border bg-popup p-4 sm:p-8"
    >
      <div>
        <h2 className="text-xl font-bold text-heading sm:text-2xl">
          Generate Resume in 2 Minutes
        </h2>
        <p className="mt-1 text-sm text-heading/60 sm:text-base">
          Drop in your details below and AI will turn them into a polished,
          ATS-friendly resume. Don't worry about grammar or formatting.
        </p>
      </div>

      {/* JOB DESCRIPTION */}
      <section>
        <label className={labelClass}>
          Job Description{" "}
          <span className="font-normal text-heading/50">
            (optional — tailors the resume to this role)
          </span>
        </label>
        <textarea
          {...register("jobDescription")}
          rows={4}
          placeholder="Paste the job description you're applying for..."
          className={textAreaClass}
        />
      </section>

      {/* PERSONAL INFO */}
      <section>
        <h3 className="mb-3 text-lg font-semibold text-heading">Personal Info</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              {...register("personalInfo.fullName", { required: true })}
              className={inputClass}
              placeholder="Rahul Verma"
            />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input
              {...register("personalInfo.email", { required: true })}
              type="email"
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={labelClass}>Target Title</label>
            <input
              {...register("personalInfo.title")}
              className={inputClass}
              placeholder="Software Developer"
            />
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input {...register("personalInfo.phone")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input
              {...register("personalInfo.address")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input
              {...register("personalInfo.linkedIn")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <input
              {...register("personalInfo.github")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Portfolio</label>
            <input
              {...register("personalInfo.portfolio")}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section>
        <div className="flex items-center justify-between">
          <label className={labelClass}>
            Summary{" "}
            <span className="font-normal text-heading/50">
              (optional — a few rough lines is enough, AI will polish it)
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowSummaryCustomize((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-subheading hover:underline bg-btn-hover-bg px-4 py-2 rounded-2xl border border-border"
          >
            <Wand2 size={13} />
            customize
          </button>
        </div>
        <textarea
          {...register("summary")}
          rows={2}
          className={textAreaClass}
          placeholder="Software developer with experience in building web applications..."
        />
        {showSummaryCustomize && (
          <CustomizeInstructionBox
            registerName="summaryInstruction"
            register={register}
            placeholder="e.g. I want a short summary, similar to the JD"
          />
        )}
      </section>

      {/* SKILLS */}
      <section>
        <SectionHeader
          title="Skills"
          onAdd={() => skills.append({ title: "", skillsText: "" })}
          addLabel="Add Category"
          onCustomize={() => setShowSkillsCustomize((v) => !v)}
        />

        {availableSkillPresets.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {availableSkillPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => skills.append({ title: preset, skillsText: "" })}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-heading/70 transition hover:border-border-strong hover:text-heading"
              >
                + {preset}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {skills.fields.map((field, index) => (
            <div
              key={field.id}
              className="relative grid grid-cols-1 sm:grid-cols-[200px_1fr] items-start gap-3 rounded-xl border border-border bg-navbar p-4"
            >
              <RemoveRowButton onClick={() => skills.remove(index)} />
              <div>
                <label className={labelClass}>Category</label>
                <input
                  {...register(`skills.${index}.title`)}
                  className={inputClass}
                  placeholder="e.g. Web"
                />
              </div>
              <div>
                <label className={labelClass}>Skills</label>
                <Controller
                  name={`skills.${index}.skillsText`}
                  control={control}
                  render={({ field }) => (
                    <TagAutocompleteInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      suggestions={getSkillSuggestions(
                        watch(`skills.${index}.title`) || "",
                      )}
                      placeholder="Type a skill and press Enter, or pick a suggestion"
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {skills.fields.length === 0 && (
          <p className="text-sm text-heading/40">
            Pick a category above, or use "Add Category" for a custom one.
          </p>
        )}

        {showSkillsCustomize && (
          <CustomizeInstructionBox
            registerName="skillsInstruction"
            register={register}
            placeholder="e.g. Prioritize skills that match the JD"
          />
        )}
      </section>

      {/* PROJECTS */}
      <section>
        <SectionHeader
          title="Projects"
          onAdd={() =>
            projects.append({
              title: "",
              technologies: "",
              descriptionText: "",
            })
          }
          addLabel="Add Project"
          onCustomize={() => setShowProjectsCustomize((v) => !v)}
        />
        <div className="space-y-4">
          {projects.fields.map((field, index) => (
            <div
              key={field.id}
              className="relative space-y-3 rounded-xl border border-border bg-navbar p-4"
            >
              {projects.fields.length > 1 && (
                <RemoveRowButton onClick={() => projects.remove(index)} />
              )}
              <input
                {...register(`projects.${index}.title`)}
                className={inputClass}
                placeholder="Project title"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  {...register(`projects.${index}.role`)}
                  className={inputClass}
                  placeholder="Your role (optional)"
                />
                <div>
                  <label className={labelClass}></label>
                  <Controller
                    name={`projects.${index}.technologies`}
                    control={control}
                    render={({ field }) => (
                      <TagAutocompleteInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        suggestions={ALL_TECHNOLOGY_SUGGESTIONS}
                        placeholder="Type a technology and press Enter, or pick a suggestion"
                      />
                    )}
                  />
                </div>
              </div>
              <textarea
                {...register(`projects.${index}.descriptionText`)}
                rows={3}
                className={textAreaClass}
                placeholder="What did you build, and what impact did it have? One point per line."
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  {...register(`projects.${index}.github`)}
                  className={inputClass}
                  placeholder="GitHub link"
                />
                <input
                  {...register(`projects.${index}.link`)}
                  className={inputClass}
                  placeholder="Live link"
                />
              </div>
            </div>
          ))}
        </div>
        {showProjectsCustomize && (
          <CustomizeInstructionBox
            registerName="projectsInstruction"
            register={register}
            placeholder="e.g. Focus more on backend work, keep descriptions concise"
          />
        )}
      </section>

      {/* EXPERIENCE */}
      <section>
        <SectionHeader
          title="Experience"
          optional
          onAdd={() => experience.append({ company: "", position: "" })}
          addLabel="Add Experience"
          onCustomize={() => setShowExperienceCustomize((v) => !v)}
        />
        <div className="space-y-4">
          {experience.fields.map((field, index) => (
            <div
              key={field.id}
              className="relative space-y-3 rounded-xl border border-border bg-navbar p-4"
            >
              <RemoveRowButton onClick={() => experience.remove(index)} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  {...register(`experience.${index}.company`)}
                  className={inputClass}
                  placeholder="Company"
                />
                <input
                  {...register(`experience.${index}.position`)}
                  className={inputClass}
                  placeholder="Position"
                />
                <div>
                  <label className={labelClass}>Start Date</label>
                  <Controller
                    name={`experience.${index}.startDate`}
                    control={control}
                    render={({ field }) => (
                      <MonthYearPicker
                        value={field.value || ""}
                        onChange={field.onChange}
                        maxYear={CURRENT_YEAR}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <Controller
                    name={`experience.${index}.endDate`}
                    control={control}
                    render={({ field }) => (
                      <MonthYearPicker
                        value={field.value || ""}
                        onChange={field.onChange}
                        maxYear={CURRENT_YEAR}
                        disabled={watch(`experience.${index}.currentlyWorking`)}
                      />
                    )}
                  />
                </div>
                <input
                  {...register(`experience.${index}.location`)}
                  className={inputClass}
                  placeholder="Location"
                />
                <label className="flex items-center gap-2 text-sm text-heading">
                  <input
                    type="checkbox"
                    {...register(`experience.${index}.currentlyWorking`, {
                      onChange: (e) => {
                        if (e.target.checked) {
                          setValue(`experience.${index}.endDate`, "");
                        }
                      },
                    })}
                  />
                  Currently working here
                </label>
              </div>

              <div>
                <label className={labelClass}>
                  Technologies{" "}
                  <span className="font-normal text-heading/50">(optional)</span>
                </label>
                <Controller
                  name={`experience.${index}.technologies`}
                  control={control}
                  render={({ field }) => (
                    <TagAutocompleteInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      suggestions={ALL_TECHNOLOGY_SUGGESTIONS}
                      placeholder="Type a technology and press Enter, or pick a suggestion"
                    />
                  )}
                />
              </div>
              <textarea
                {...register(`experience.${index}.responsibilitiesText`)}
                rows={3}
                className={textAreaClass}
                placeholder="Responsibilities — one per line."
              />
              <textarea
                {...register(`experience.${index}.achievementsText`)}
                rows={2}
                className={textAreaClass}
                placeholder="Achievements — one per line (optional)."
              />
            </div>
          ))}
        </div>
        {showExperienceCustomize && (
          <CustomizeInstructionBox
            registerName="experienceInstruction"
            register={register}
            placeholder="e.g. Make responsibilities more detailed and technical"
          />
        )}
      </section>

      {/* INTERNSHIPS */}
      <section>
        <SectionHeader
          title="Internships"
          optional
          onAdd={() => internships.append({ company: "", role: "" })}
          addLabel="Add Internship"
          onCustomize={() => setShowInternshipsCustomize((v) => !v)}
        />
        <div className="space-y-4">
          {internships.fields.map((field, index) => (
            <div
              key={field.id}
              className="relative space-y-3 rounded-xl border border-border bg-navbar p-4"
            >
              <RemoveRowButton onClick={() => internships.remove(index)} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  {...register(`internships.${index}.company`)}
                  className={inputClass}
                  placeholder="Company"
                />
                <input
                  {...register(`internships.${index}.role`)}
                  className={inputClass}
                  placeholder="Role"
                />
                <div>
                  <label className={labelClass}>Start Date</label>
                  <Controller
                    name={`internships.${index}.startDate`}
                    control={control}
                    render={({ field }) => (
                      <MonthYearPicker
                        value={field.value || ""}
                        onChange={field.onChange}
                        maxYear={CURRENT_YEAR}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <Controller
                    name={`internships.${index}.endDate`}
                    control={control}
                    render={({ field }) => (
                      <MonthYearPicker
                        value={field.value || ""}
                        onChange={field.onChange}
                        maxYear={CURRENT_YEAR}
                        disabled={watch(
                          `internships.${index}.currentlyInterning`,
                        )}
                      />
                    )}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-heading">
                  <input
                    type="checkbox"
                    {...register(`internships.${index}.currentlyInterning`, {
                      onChange: (e) => {
                        if (e.target.checked) {
                          setValue(`internships.${index}.endDate`, "");
                        }
                      },
                    })}
                  />
                  Currently interning here
                </label>
              </div>
              <textarea
                {...register(`internships.${index}.responsibilitiesText`)}
                rows={3}
                className={textAreaClass}
                placeholder="Responsibilities — one per line."
              />
              <textarea
                {...register(`internships.${index}.achievementsText`)}
                rows={2}
                className={textAreaClass}
                placeholder="Achievements — one per line (optional)."
              />
            </div>
          ))}
        </div>
        {showInternshipsCustomize && (
          <CustomizeInstructionBox
            registerName="internshipsInstruction"
            register={register}
            placeholder="e.g. Keep it short, 2 bullets per internship"
          />
        )}
      </section>

      {/* EDUCATION */}
      <section>
        <SectionHeader
          title="Education"
          onAdd={() =>
            education.append({ institution: "", degree: "", coursework: "" })
          }
          addLabel="Add Education"
        />
        <div className="space-y-4">
          {education.fields.map((field, index) => (
            <div
              key={field.id}
              className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl border border-border bg-navbar p-4"
            >
              {education.fields.length > 1 && (
                <RemoveRowButton onClick={() => education.remove(index)} />
              )}
              <input
                {...register(`education.${index}.institution`)}
                className={inputClass}
                placeholder="Institution"
              />
              <input
                {...register(`education.${index}.degree`)}
                className={inputClass}
                placeholder="Degree"
              />
              <input
                {...register(`education.${index}.fieldOfStudy`)}
                className={inputClass}
                placeholder="Field of study"
              />
              <input
                {...register(`education.${index}.cgpa`)}
                className={inputClass}
                placeholder="CGPA / grade"
              />
              <select
                {...register(`education.${index}.startYear`)}
                className={inputClass}
                defaultValue=""
              >
                <option value="" disabled>
                  Start year
                </option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                {...register(`education.${index}.endYear`)}
                className={inputClass}
                defaultValue=""
              >
                <option value="" disabled>
                  End year
                </option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>
                    Relevant Coursework{" "}
                    <span className="font-normal text-heading/50">(optional)</span>
                  </label>
                  <button
                    type="button"
                    disabled={courseworkLoadingIndex === index}
                    onClick={() => {
                      const degree = watchedEducation?.[index]?.degree || "";
                      const fieldOfStudy =
                        watchedEducation?.[index]?.fieldOfStudy || "";
                      if (!degree.trim()) {
                        alert("Enter a degree first");
                        return;
                      }
                      setCourseworkLoadingIndex(index);
                      generateCourseworkMutate(
                        { degree, fieldOfStudy },
                        {
                          onSuccess: (coursework) => {
                            setValue(
                              `education.${index}.coursework`,
                              coursework,
                            );
                            setCourseworkLoadingIndex(null);
                          },
                          onError: () => {
                            setCourseworkLoadingIndex(null);
                            alert(
                              "Couldn't generate coursework. Please try again.",
                            );
                          },
                        },
                      );
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-subheading hover:underline disabled:opacity-50"
                  >
                    {courseworkLoadingIndex === index ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        Generate
                      </>
                    )}
                  </button>
                </div>
                <input
                  {...register(`education.${index}.coursework`)}
                  className={inputClass}
                  placeholder="OOP, DBMS, DSA, Machine Learning"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LANGUAGES */}
      <section>
        <SectionHeader
          title="Languages"
          optional
          onAdd={() => languages.append({ name: "", level: "" })}
          addLabel="Add Language"
        />
        <div className="space-y-3">
          {languages.fields.map((field, index) => (
            <div key={field.id} className="relative flex gap-3">
              <input
                {...register(`languages.${index}.name`)}
                className={inputClass}
                placeholder="Language e.g. English"
              />
              <input
                {...register(`languages.${index}.level`)}
                className={inputClass}
                placeholder="Level e.g. Fluent"
              />
              <button
                type="button"
                onClick={() => languages.remove(index)}
                className="shrink-0 text-heading/40 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS + CERTIFICATIONS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <label className={labelClass}>Achievements</label>
            <button
              type="button"
              onClick={() => setShowAchievementsCustomize((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-subheading hover:underline bg-btn-hover-bg px-4 py-2 rounded-2xl border border-border"
            >
              <Wand2 size={13} />
              Customize
            </button>
          </div>
          <textarea
            {...register("achievements")}
            rows={4}
            className={textAreaClass}
            placeholder="One achievement per line"
          />
          {showAchievementsCustomize && (
            <CustomizeInstructionBox
              registerName="achievementsInstruction"
              register={register}
              placeholder="e.g. Keep only the top 2-3"
            />
          )}
        </section>
        <section>
          <label className={labelClass}>Certifications</label>
          <textarea
            {...register("certifications")}
            rows={4}
            className={textAreaClass}
            placeholder="One certification per line"
          />
        </section>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 border-t border-border pt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" leftIcon={<Sparkles size={18} />}>
          Generate Resume
        </Button>
      </div>
    </form>
  );
}
