// /* ================= SECTION TITLE ================= */

import { technicalTheme } from "../preview/themes/technical.theme";
import type { Resume } from "../types/resume.types";

interface Props {
  resume: Resume;
}

const { colors } = technicalTheme;

export default function TechnicalThumbnail({ resume }: Props) {
  const { personalInfo } = resume;

  return (
    <div className="w-40 h-60 overflow-hidden rounded bg-white shadow text-black p-2">
      {/* ================= HEADER (mirrors PersonalInfoPreview) ================= */}
      <div
        className="text-center pb-2 border-b"
        style={{ borderColor: "#e5e7eb" }}
      >
        <h1
          className="truncate text-[9px] font-bold uppercase tracking-wide"
          style={{ color: colors.headerText }}
        >
          {personalInfo.fullName || "YOUR NAME"}
        </h1>

        {personalInfo.title && (
          <p
            className="truncate text-[6px] font-medium mt-0.5"
            style={{ color: colors.primary }}
          >
            {personalInfo.title}
          </p>
        )}

        <div
          className="flex flex-wrap justify-center gap-x-1 mt-0.5 text-[4.5px]"
          style={{ color: colors.muted }}
        >
          {personalInfo.email && (
            <span className="truncate">{personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span className="truncate">{personalInfo.phone}</span>
          )}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="pt-2 space-y-2">
        {/* SUMMARY */}
        {resume.summary?.trim() && (
          <section>
            <SectionTitle title="Summary" />
            <p
              className="text-[5px] leading-tight line-clamp-3"
              style={{ color: colors.text }}
            >
              {resume.summary}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {resume.experience.length > 0 && (
          <section>
            <SectionTitle title="Work Experience" />
            <div className="space-y-1">
              {resume.experience.slice(0, 2).map((item, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between gap-1">
                    <p
                      className="text-[5px] font-bold truncate"
                      style={{ color: colors.secondary }}
                    >
                      {item.company}
                      {item.position ? ` - ${item.position}` : ""}
                    </p>
                    <span
                      className="text-[4px] shrink-0"
                      style={{ color: colors.muted }}
                    >
                      {item.currentlyWorking ? "Present" : item.endDate}
                    </span>
                  </div>

                  {item.responsibilities?.[0] && (
                    <p
                      className="text-[4px] leading-tight line-clamp-2 pl-1"
                      style={{ color: colors.text }}
                    >
                      • {item.responsibilities[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {resume.education.length > 0 && (
          <section>
            <SectionTitle title="Education" />
            <div className="space-y-1">
              {resume.education.slice(0, 2).map((item, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between gap-1">
                    <p
                      className="text-[5px] font-bold truncate"
                      style={{ color: colors.secondary }}
                    >
                      {item.institution}
                    </p>
                    <span
                      className="text-[4px] shrink-0"
                      style={{ color: colors.muted }}
                    >
                      {item.endYear}
                    </span>
                  </div>

                  <p
                    className="text-[4px] truncate"
                    style={{ color: colors.text }}
                  >
                    {item.degree}
                    {item.fieldOfStudy ? ` in ${item.fieldOfStudy}` : ""}
                  </p>

                  {item.cgpa && (
                    <p className="text-[4px]" style={{ color: colors.text }}>
                      CGPA: {item.cgpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {resume.projects.length > 0 && (
          <section>
            <SectionTitle title="Projects" />
            <div className="space-y-1">
              {resume.projects.slice(0, 2).map((item, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between gap-1">
                    <p
                      className="text-[5px] font-bold truncate"
                      style={{ color: colors.secondary }}
                    >
                      {item.title}
                    </p>
                    <span
                      className="text-[4px] shrink-0"
                      style={{ color: colors.muted }}
                    >
                      {item.currentlyWorking ? "Present" : item.endDate}
                    </span>
                  </div>

                  {item.technologies?.length > 0 && (
                    <p
                      className="text-[4px] truncate"
                      style={{ color: colors.muted }}
                    >
                      {item.technologies.join(" • ")}
                    </p>
                  )}

                  <p
                    className="text-[4px] leading-tight line-clamp-2"
                    style={{ color: colors.text }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {resume.skills.length > 0 && (
          <section>
            <SectionTitle title="Relevant Skills" />
            <div className="space-y-0.5">
              {resume.skills.slice(0, 4).map((category) => (
                <p key={category.title} className="truncate text-[4.5px]">
                  <span
                    className="font-bold uppercase"
                    style={{ color: colors.secondary }}
                  >
                    {category.title}:
                  </span>{" "}
                  <span style={{ color: colors.text }}>
                    {category.skills.join(", ")}
                  </span>
                </p>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES */}
        {resume.languages.length > 0 && (
          <section>
            <SectionTitle title="Languages" />
            <div className="flex flex-wrap gap-0.5">
              {resume.languages.map((language) => (
                <span
                  key={language.name}
                  className="rounded-full border px-1 text-[4px]"
                  style={{ borderColor: "#fecdd3", color: colors.text }}
                >
                  {language.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* INTERNSHIPS */}
        {resume.internships.length > 0 && (
          <section>
            <SectionTitle title="Internships" />
            <div className="space-y-1">
              {resume.internships.slice(0, 2).map((item, index) => (
                <div key={index}>
                  <p
                    className="text-[5px] font-bold truncate"
                    style={{ color: colors.secondary }}
                  >
                    {item.role}
                  </p>
                  <p
                    className="text-[4px] truncate"
                    style={{ color: colors.muted }}
                  >
                    {item.company}
                  </p>
                  {item.responsibilities?.[0] && (
                    <p
                      className="text-[4px] line-clamp-2"
                      style={{ color: colors.text }}
                    >
                      • {item.responsibilities[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {resume.certifications.length > 0 && (
          <section>
            <SectionTitle title="Certifications" />
            <ul className="pl-2 list-disc space-y-0.5">
              {resume.certifications.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="text-[4.5px] truncate"
                  style={{ color: colors.text }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* AWARDS */}
        {resume.awards.length > 0 && (
          <section>
            <SectionTitle title="Awards" />
            <ul className="pl-2 list-disc space-y-0.5">
              {resume.awards.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="text-[4.5px] truncate"
                  style={{ color: colors.text }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* INTERESTS */}
        {resume.interests.length > 0 && (
          <section>
            <SectionTitle title="Interests" />
            <div className="flex flex-wrap gap-0.5">
              {resume.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded border px-1 text-[4px]"
                  style={{ borderColor: colors.muted, color: colors.text }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* STRENGTHS */}
        {resume.strengths.length > 0 && (
          <section>
            <SectionTitle title="Strengths" />
            {resume.strengths.slice(0, 2).map((item) => (
              <div key={item.title}>
                <p
                  className="text-[5px] font-bold truncate"
                  style={{ color: colors.secondary }}
                >
                  {item.title}
                </p>
                <p
                  className="text-[4px] line-clamp-2"
                  style={{ color: colors.text }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {resume.achievements.length > 0 && (
          <section>
            <SectionTitle title="Achievements" />
            <ul className="pl-2 list-disc space-y-0.5">
              {resume.achievements.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="text-[4.5px] truncate"
                  style={{ color: colors.text }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CUSTOM SECTIONS */}
        {resume.customSections
          .filter((section) => section.enabled)
          .map((section) => (
            <section key={section.id}>
              <SectionTitle title={section.title} />
              {section.items.slice(0, 2).map((item) => (
                <div key={item.id}>
                  <p
                    className="text-[5px] font-bold truncate"
                    style={{ color: colors.secondary }}
                  >
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p
                      className="text-[4px] truncate"
                      style={{ color: colors.muted }}
                    >
                      {item.subtitle}
                    </p>
                  )}
                  {item.description && (
                    <p
                      className="text-[4px] line-clamp-2"
                      style={{ color: colors.text }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          ))}
      </div>
    </div>
  );
}

/* ================= SECTION TITLE ================= */

function SectionTitle({ title }: { title: string }) {
  return (
    <h3
      className="text-[5.5px] font-bold uppercase tracking-wide border-b pb-0.5 mb-1"
      style={{ color: colors.primary, borderColor: "#e5e7eb" }}
    >
      {title}
    </h3>
  );
}
