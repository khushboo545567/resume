 
 
import { useResumeStore } from "../../../../store/resume.store";

export default function ModernTemplate() {

      console.log("Modern Template Rendered");
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const { personalInfo } = resume;

  return (
 <div className="min-h-[1120px] bg-red-200">
      {/* Header */}

       <h1 className="text-5xl text-red-700 font-black">
  MODERN TEMPLATE
</h1>
      <div className="bg-slate-900 px-10 py-8 text-white">

        <h1 className="text-4xl font-bold">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <p className="mt-2 text-lg text-slate-300">
          {personalInfo.title || "Professional"}
        </p>

        <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-300">

          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}

          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}

          {personalInfo.linkedIn && (
            <span>{personalInfo.linkedIn}</span>
          )}

          {personalInfo.github && (
            <span>{personalInfo.github}</span>
          )}

        </div>

      </div>

      <div className="grid grid-cols-3 gap-8 p-10">

        {/* Left */}

        <div className="col-span-2 space-y-8">

          {/* Summary */}

          <section>

            <h2 className="border-b pb-2 text-xl font-bold">
              Professional Summary
            </h2>

            <p className="mt-4 leading-7 text-gray-700">
              {resume.summary || "Write your professional summary..."}
            </p>

          </section>

          {/* Experience */}

          <section>

            <h2 className="border-b pb-2 text-xl font-bold">
              Experience
            </h2>

            <div className="mt-5 space-y-6">

              {resume.experience.length ? (
                resume.experience.map((exp, index) => (
                  <div key={index}>

                    <div className="flex items-center justify-between">

                      <h3 className="font-bold">
                        {exp.position}
                      </h3>

                      <span className="text-sm text-gray-500">
                        {exp.startDate} -
                        {exp.currentlyWorking
                          ? " Present"
                          : ` ${exp.endDate}`}
                      </span>

                    </div>

                    <p className="font-medium text-blue-600">
                      {exp.company}
                    </p>

                    <ul className="mt-3 list-disc pl-5 text-gray-700">

                      {exp.responsibilities.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}

                    </ul>

                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No experience added.
                </p>
              )}

            </div>

          </section>

          {/* Projects */}

          <section>

            <h2 className="border-b pb-2 text-xl font-bold">
              Projects
            </h2>

            <div className="mt-5 space-y-6">

              {resume.projects.length ? (
                resume.projects.map((project, index) => (
                  <div key={index}>

                    <h3 className="font-bold">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-gray-700">
                      {project.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-slate-100 px-3 py-1 text-xs"
                        >
                          {tech}
                        </span>
                      ))}

                    </div>

                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No projects added.
                </p>
              )}

            </div>

          </section>

        </div>

        {/* Right */}

        <div className="space-y-8">

          <section>

            <h2 className="border-b pb-2 font-bold">
              Skills
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">

              {resume.skills.flatMap((category) => category.skills).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white"
                >
                  {skill}
                </span>
              ))}

            </div>

          </section>

          <section>

            <h2 className="border-b pb-2 font-bold">
              Education
            </h2>

            <div className="mt-4 space-y-4">

              {resume.education.map((edu, index) => (
                <div key={index}>

                  <h3 className="font-semibold">
                    {edu.degree}
                  </h3>

                  <p>{edu.institution}</p>

                  <p className="text-sm text-gray-500">
                    {edu.startYear} - {edu.endYear ?? "Present"}
                  </p>

                </div>
              ))}

            </div>

          </section>

          <section>

            <h2 className="border-b pb-2 font-bold">
              Languages
            </h2>

            <div className="mt-4 space-y-2">

              {resume.languages.map((lang) => (
                <p key={lang.name}>
                  {lang.name}
                  {lang.level ? ` (${lang.level})` : ""}
                </p>
              ))}

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}