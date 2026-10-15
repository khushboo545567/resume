import type { Resume } from "../types/resume.types";

interface Props {
  resume: Resume;
}

export default function ModernThumbnail({ resume }: Props) {
  const { personalInfo } = resume;

  return (
    <div className="h-44 w-32 overflow-hidden rounded bg-white shadow">
      {/* Left Sidebar */}

      <div className="flex h-full">
        <div className="w-7 bg-slate-900" />

        <div className="flex-1 p-2">
          <h2 className="truncate text-[7px] font-bold">
            {personalInfo.fullName || "YOUR NAME"}
          </h2>

          <p className="truncate text-[5px] text-slate-500">
            {personalInfo.title || "Developer"}
          </p>

          <div className="mt-2 h-[2px] rounded bg-slate-300" />

          <div className="mt-2 space-y-1">
            <div className="h-[2px] rounded bg-slate-200" />

            <div className="h-[2px] rounded bg-slate-200" />

            <div className="h-[2px] rounded bg-slate-200" />
          </div>

          <div className="mt-3 h-[2px] rounded bg-slate-300" />

          <div className="mt-2 flex flex-wrap gap-1">
            {resume.skills.flatMap((category) => category.skills).slice(0, 4).map((skill) => (
              <div key={skill} className="rounded bg-slate-100 px-1 text-[5px]">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
