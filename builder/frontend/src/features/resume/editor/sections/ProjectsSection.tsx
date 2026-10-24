import { useState } from "react";
import { FolderGit2, Pencil, Plus, Trash2 } from "lucide-react";

import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import ProjectForm from "../components/ProjectForm";

import { useResumeStore } from "../../../../store/resume.store";

export default function ProjectsSection() {
  const resume = useResumeStore((state) => state.resume);

  const deleteProject = useResumeStore((state) => state.deleteProject);

  const renameSectionDisplayTitle = useResumeStore(
    (state) => state.renameSectionDisplayTitle,
  );

  const projectSection = resume?.sections.find(
    (section) => section.id === "projects",
  );

  const [showForm, setShowForm] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Input
            label="Resume Heading"
            placeholder="College Projects"
            value={projectSection?.displayTitle ?? ""}
            onChange={(e) =>
              renameSectionDisplayTitle("projects", e.target.value)
            }
          />

          <p className="text-xs text-heading/60 sm:text-sm">Showcase your best work.</p>
        </div>

        <Button
          leftIcon={<Plus size={18} />}
          onClick={() => {
            // Add mode
            setEditingIndex(null);
            setShowForm(true);
          }}
        >
          Add Project
        </Button>
      </div>

      {/* Empty State */}
      {resume?.projects.length === 0 && !showForm && (
        <div className="rounded-2xl border-2 border-dashed p-12 text-center">
          <FolderGit2 size={44} className="mx-auto mb-4 text-nav-text" />

          <h3 className="text-xl font-semibold">No Projects Added</h3>

          <p className="mt-2 text-nav-text">Add your portfolio projects.</p>
        </div>
      )}

      {/* Projects */}
      <div className="space-y-5">
        {resume?.projects.map((project, index) => (
          <div key={index}>
            {/* ============================= */}
            {/* EDIT FORM - INLINE */}
            {/* ============================= */}
            {editingIndex === index ? (
              <ProjectForm
                onClose={handleCloseForm}
                editIndex={index}
                initialData={project}
              />
            ) : (
              /* ============================= */
              /* PROJECT CARD */
              /* ============================= */
              <div className="rounded-2xl border border-border bg-popup p-4 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-3 sm:gap-6">
                  {/* Project Information */}
                  <div className="min-w-0 flex-1 space-y-2">
                    {/* Project Title */}
                    <h3 className="text-lg font-bold">{project.title}</h3>

                    {/* Role */}
                    {project.role && (
                      <p className="text-sm font-medium text-heading/80">
                        {project.role}
                      </p>
                    )}

                    {/* Description */}
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-heading/80">
                      {project.description

                        .filter((line) => line.trim() !== "")
                        .map((line, descriptionIndex) => (
                          <li key={descriptionIndex}>{line}</li>
                        ))}
                    </ul>

                    {/* Technologies */}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-btn-hover-bg px-3 py-1 text-sm text-subheading"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Dates */}
                    {(project.startDate ||
                      project.endDate ||
                      project.currentlyWorking) && (
                      <div className="pt-2 text-sm text-nav-text">
                        {project.startDate && <span>{project.startDate}</span>}

                        {project.startDate &&
                          (project.endDate || project.currentlyWorking) && (
                            <span> - </span>
                          )}

                        {project.currentlyWorking ? (
                          <span>Present</span>
                        ) : (
                          project.endDate && <span>{project.endDate}</span>
                        )}
                      </div>
                    )}

                    {/* Project Links */}
                    {(project.link || project.github) && (
                      <div className="mt-3 flex flex-wrap gap-6 text-sm">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-subheading hover:underline"
                          >
                            Live Demo
                          </a>
                        )}

                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-subheading hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Pencil size={16} />}
                      onClick={() => {
                        setEditingIndex(index);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      leftIcon={<Trash2 size={16} />}
                      onClick={() => deleteProject(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ============================= */}
        {/* ADD PROJECT FORM */}
        {/* ============================= */}
        {showForm && editingIndex === null && (
          <ProjectForm onClose={handleCloseForm} />
        )}
      </div>
    </div>
  );
}
