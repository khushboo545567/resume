import { useState } from "react";
import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";

import Button from "../../../../components/ui/Button";
import EducationForm from "../components/EducationForm";

import { useResumeStore } from "../../../../store/resume.store";
import Input from "../../../../components/ui/Input";

export default function EducationSection() {
  const resume = useResumeStore((state) => state.resume);

  const deleteEducation = useResumeStore((state) => state.deleteEducation);
  const renameSectionDisplayTitle = useResumeStore(
    (state) => state.renameSectionDisplayTitle,
  );

  const educationSection = resume?.sections.find(
    (section) => section.id === "education",
  );

  const [showForm, setShowForm] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          leftIcon={<Plus size={18} />}
          onClick={() => {
            setEditingIndex(null);
            setShowForm(true);
          }}
        >
          Add Education
        </Button>
      </div>
      <Input
        label="Resume Heading"
        placeholder="Education"
        value={educationSection?.displayTitle ?? ""}
        onChange={(e) => renameSectionDisplayTitle("education", e.target.value)}
      />

      {resume?.education.length === 0 && !showForm && (
        <div className="rounded-xl border-2 border-dashed p-12 text-center">
          <GraduationCap className="mx-auto mb-4" size={40} />

          <h3 className="text-xl font-semibold">No Education Added</h3>

          <p className="mt-2 text-nav-text">Add your first education.</p>
        </div>
      )}

      <div className="space-y-4">
        {resume?.education.map((item, index) => (
          <div key={index} className="rounded-xl border border-border bg-popup p-4 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{item.degree}</h3>

                <p className="font-medium text-subheading">{item.institution}</p>

                <p className="text-heading/80">{item.fieldOfStudy}</p>

                <p className="mt-2 text-sm text-nav-text">
                  {item.startYear} - {item.endYear}
                </p>

                {item.cgpa && (
                  <p className="mt-2 text-sm">CGPA : {item.cgpa}</p>
                )}
              </div>

              <div className="flex gap-2">
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
                  onClick={() => deleteEducation(index)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <EducationForm
          onClose={() => {
            setShowForm(false);
            setEditingIndex(null);
          }}
          editIndex={editingIndex ?? undefined}
          initialData={
            editingIndex !== null ? resume?.education[editingIndex] : undefined
          }
        />
      )}
    </div>
  );
}
