import { useResumeStore } from "../../../../store/resume.store";

export default function ExecutiveTemplate() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const { personalInfo } = resume;

  return (
    <div className="min-h-[1120px] bg-white">

      {/* Header */}

      <div className="bg-slate-900 px-10 py-8 text-white">

        <h1 className="text-4xl font-bold uppercase">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <p className="mt-2 text-lg text-slate-300">
          {personalInfo.title || "Professional"}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">

          {personalInfo.email && <span>{personalInfo.email}</span>}

          {personalInfo.phone && <span>{personalInfo.phone}</span>}

          {personalInfo.linkedIn && (
            <span>{personalInfo.linkedIn}</span>
          )}

          {personalInfo.github && (
            <span>{personalInfo.github}</span>
          )}

        </div>

      </div>

      <div className="p-10 space-y-8">

        {/* Summary */}

        <section>

          <h2 className="text-xl font-bold border-b-2 border-slate-800 pb-2 uppercase">
            Professional Summary
          </h2>

          <p className="mt-4 leading-7 text-gray-700">
            {resume.summary || "Write your summary..."}
          </p>

        </section>

        {/* Experience */}

        <section>

          <h2 className="text-xl font-bold border-b-2 border-slate-800 pb-2 uppercase">
            Experience
          </h2>

          <div className="mt-5 space-y-6">

            {resume.experience.length ? (
              resume.experience.map((exp, index) => (
                <div key={index}>

                  <div className="flex justify-between">

                    <div>

                      <h3 className="font-bold">
                        {exp.position}
                      </h3>

                      <p className="text-slate-700">
                        {exp.company}
                      </p>

                    </div>

                    <span className="text-sm text-gray-500">
                      {exp.startDate} -{" "}
                      {exp.currentlyWorking
                        ? "Present"
                        : exp.endDate}
                    </span>

                  </div>

                  <ul className="mt-3 list-disc pl-5">

                    {exp.responsibilities.map((item, i) => (
                      <li key={i}>
                        {item}
                      </li>
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

        {/* Education */}

        <section>

          <h2 className="text-xl font-bold border-b-2 border-slate-800 pb-2 uppercase">
            Education
          </h2>

          <div className="mt-5 space-y-5">

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

        {/* Skills */}

        <section>

          <h2 className="text-xl font-bold border-b-2 border-slate-800 pb-2 uppercase">
            Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">

            {resume.skills.length ? (
              resume.skills.flatMap((category) => category.skills).map((skill) => (
                <span
                  key={skill}
                  className="rounded border border-slate-800 px-3 py-1 text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">
                No skills added.
              </p>
            )}

          </div>

        </section>

      </div>

    </div>
  );
}