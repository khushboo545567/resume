import { useResumeStore } from "../../../../../../store/resume.store";
import { formatMonthYear } from "../../../../editor/utils/formatDate";

import SectionHeader from "../shared/SectionHeader";
import { HarvardATSTheme as T } from "../theme.harvard-ats";

export default function ProjectsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const projects = resume.projects ?? [];

  if (!projects.length) return null;

  const section = resume.sections.find(
    (section) => section.type === "projects",
  );

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          section?.displayTitle?.trim()
            ? section.displayTitle
            : section?.title || "Projects"
        }
      />

      <div className={`${T.spacing.itemHeader} ${T.project.container}`}>
        {projects.map((project, index) => (
          <div key={index}>
            {/* Project Header */}
            <div className={T.layout.between}>
              {/* Left Side */}
              <div className="min-w-0">
                <h3
                  className={`
                    ${T.fontSize.itemTitle}
                    ${T.fontWeight.bold}
                    ${T.colors.heading}
                  `}
                >
                  {project.title}
                </h3>

                {project.role && (
                  <p
                    className={`
                      ${T.fontSize.itemSubtitle}
                      italic
                      ${T.colors.body}
                    `}
                  >
                    {project.role}
                  </p>
                )}

                {project.technologies?.length > 0 && (
                  <p
                    className={`
                      ${T.fontSize.body}
                      ${T.colors.body}
                    `}
                  >
                    <span className={T.fontWeight.bold}>Tech:</span>{" "}
                    {project.technologies.join(", ")}
                  </p>
                )}
              </div>

              {/* Right Side - Date + Links */}
              <div className="shrink-0 text-right">
                <p
                  className={`
                    ${T.fontSize.date}
                    ${T.colors.muted}
                  `}
                >
                  {formatMonthYear(project.startDate)} -{" "}
                  {project.currentlyWorking
                    ? "Present"
                    : formatMonthYear(project.endDate) || "Present"}
                </p>

                {(project.github || project.link) && (
                  <div
                    className={`
                      flex
                      justify-end
                      items-center
                      gap-3
                      mt-0.5
                      ${T.fontSize.date}
                    `}
                  >
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={T.links.default}
                      >
                        GitHub
                      </a>
                    )}

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={T.links.default}
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {project.description && (
              <ul
                className={`
                  ${T.list.bullet}
                
                  ${T.spacing.bullet}
                  ${T.fontSize.body}
                  ${T.lineHeight.body}
                  ${T.colors.body}
                `}
              >
                {project.description
                  .filter((line) => line.trim() !== "")
                  .map((line, index) => (
                    <li key={index}>{line.replace(/^•\s*/, "")}</li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
