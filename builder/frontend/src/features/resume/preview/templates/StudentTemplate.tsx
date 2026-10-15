import { useResumeStore } from "../../../../store/resume.store";

export default function StudentTemplate() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const { personalInfo } = resume;

  return (
    <div className="min-h-[1120px] bg-white">
      {/* Header */}

      <div className="bg-blue-600 p-10 text-center text-white">
        <h1 className="text-4xl font-bold">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <p className="mt-2 text-lg">{personalInfo.title || "Student"}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}

          {personalInfo.phone && <span>{personalInfo.phone}</span>}

          {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}

          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </div>

      <div className="space-y-8 p-10">
        {/* Education */}

        <section>
          <h2 className="border-b-2 border-blue-600 pb-2 text-xl font-bold">
            Education
          </h2>

          <div className="mt-5 space-y-5">
            {resume.education.length ? (
              resume.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold">{edu.degree}</h3>

                  <p>{edu.institution}</p>

                  {edu.fieldOfStudy && <p>{edu.fieldOfStudy}</p>}

                  <p className="text-sm text-gray-500">
                    {edu.startYear} - {edu.endYear ?? "Present"}
                  </p>

                  {edu.cgpa && <p className="text-sm">CGPA: {edu.cgpa}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education added.</p>
            )}
          </div>
        </section>

        {/* Projects */}

        <section>
          <h2 className="border-b-2 border-blue-600 pb-2 text-xl font-bold">
            Projects
          </h2>

          <div className="mt-5 space-y-6">
            {resume.projects.length ? (
              resume.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-bold">{project.title}</h3>

                  <p className="mt-2 text-gray-700">{project.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-blue-100 px-3 py-1 text-xs text-blue-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No projects added.</p>
            )}
          </div>
        </section>

        {/* Skills */}

        <section>
          <h2 className="border-b-2 border-blue-600 pb-2 text-xl font-bold">
            Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {resume.skills.length ? (
              resume.skills.flatMap((category) => category.skills).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added.</p>
            )}
          </div>
        </section>

        {/* Certifications */}

        <section>
          <h2 className="border-b-2 border-blue-600 pb-2 text-xl font-bold">
            Certifications
          </h2>

          <div className="mt-4 space-y-2">
            {resume.certifications.length ? (
              resume.certifications.map((cert, index) => (
                <p key={index}>• {cert}</p>
              ))
            ) : (
              <p className="text-gray-500">No certifications.</p>
            )}
          </div>
        </section>

        {/* Languages */}

        <section>
          <h2 className="border-b-2 border-blue-600 pb-2 text-xl font-bold">
            Languages
          </h2>

          {/* <p className="mt-4">
            {resume.languages.length
              ? resume.languages.join(", ")
              : "No languages added."}
          </p> */}
        </section>

        {/* Experience */}

        <section>
          <h2 className="border-b-2 border-blue-600 pb-2 text-xl font-bold">
            Experience
          </h2>

          <div className="mt-5 space-y-6">
            {resume.experience.length ? (
              resume.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="font-bold">{exp.position}</h3>

                  <p>{exp.company}</p>

                  <p className="text-sm text-gray-500">
                    {exp.startDate} -{" "}
                    {exp.currentlyWorking ? "Present" : exp.endDate}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No experience added.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
