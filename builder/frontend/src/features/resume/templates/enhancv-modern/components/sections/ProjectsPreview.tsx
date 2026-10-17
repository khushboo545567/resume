import { useResumeStore } from "../../../../../../store/resume.store";
import { formatMonthYear } from "../../../../editor/utils/formatDate";

import SectionHeader from "../shared/SectionHeader";

import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

export default function ProjectsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const projects = resume.projects ?? [];

  const projectSection = resume.sections.find(
    (section) => section.id === "projects",
  );

  if (projects.length === 0) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          projectSection?.displayTitle?.trim() ||
          projectSection?.title ||
          "Projects"
        }
      />

      <div className={`${T.spacing.itemHeader} space-y-4`}>
        {projects.map((project, index) => (
          <div key={index} className={` ${index !== 0 ? T.spacing.item : ""}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h3
                    className={`
                      ${T.fontSize.itemTitle}
                      ${T.fontWeight.heading}
                      ${T.colors.heading}
                      ${T.lineHeight.title}
                    `}
                  >
                    {project.title}
                  </h3>

                  {(project.link || project.github) && (
                    <span
                      className={`flex items-center gap-x-1 ${T.fontSize.body} ${T.colors.accent}`}
                    >
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:no-underline"
                        >
                          Live
                        </a>
                      )}
                      {project.link && project.github && <span>|</span>}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="underline hover:no-underline"
                        >
                          GitHub
                        </a>
                      )}
                    </span>
                  )}
                </div>

                {(project.startDate ||
                  project.endDate ||
                  project.currentlyWorking) && (
                  <p
                    className={`
                      mt-1
                      ${T.fontSize.date}
                      ${T.colors.muted}
                    `}
                  >
                    {formatMonthYear(project.startDate)}
                    {project.startDate &&
                      (project.currentlyWorking || project.endDate) &&
                      " - "}
                    {project.currentlyWorking
                      ? "Present"
                      : formatMonthYear(project.endDate)}
                  </p>
                )}
              </div>
            </div>

            {project.description?.length > 0 && (
              <ul
                className={`
      ${T.spacing.itemHeader}
      ${T.lineHeight.body}
      ${T.fontSize.body}
      ${T.colors.body}
      list-disc
      pl-5
      space-y-1
    `}
              >
                {project.description.map((description, index) => (
                  <li key={index}>{description}</li>
                ))}
              </ul>
            )}

            {project.technologies.length > 0 && (
              <p
                className={`
                  ${T.spacing.itemHeader}
                  ${T.fontSize.body}
                  ${T.colors.body}
                  ${T.lineHeight.body}
                `}
              >
                <strong>Tech:</strong> {project.technologies.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
