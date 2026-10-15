import { useResumeStore } from "../../../../../../store/resume.store";
import { FaDiagramProject } from "react-icons/fa6";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

import { ModernProfessionalTheme as T } from "../theme.modern-professional";
import SectionHeader from "../shared/SectionHeader";

export default function ProjectsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume || resume.projects.length === 0) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title="Projects"
        icon={<FaDiagramProject size={T.sectionHeader.badgeIconSize} />}
      />

      <div className="mt-3 space-y-6">
        {resume.projects.map((project, index) => (
          <div
            key={index}
            className={
              index !== resume.projects.length - 1
                ? "border-b border-slate-200 pb-5"
                : ""
            }
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <h3 className="text-[13px] font-bold text-slate-900">
                  {project.title}
                </h3>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaExternalLinkAlt size={11} />
                  </a>
                )}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-700 hover:text-black"
                  >
                    <FaGithub size={12} />
                  </a>
                )}
              </div>

              {project.role && (
                <div className="shrink-0">
                  <span className="text-[11.5px] font-semibold text-slate-500">
                    {project.role}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <ul className="mt-3 list-disc space-y-1.5 pl-4 text-[12.5px] leading-[1.6] text-slate-700">
                {project.description
                  .filter((line) => line.trim())
                  .map((line, i) => (
                    <li key={i}>{line.replace(/^•\s*/, "")}</li>
                  ))}
              </ul>
            )}

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <p className="mt-2.5 text-[12px] text-slate-600">
                <span className="font-semibold">Tech:</span>{" "}
                {project.technologies.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
