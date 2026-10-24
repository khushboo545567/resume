import { useState } from "react";
import Button from "../../../../components/ui/Button";
import { useResumeStore } from "../../../../store/resume.store";
import InternshipForm from "../forms/InternshipForm";

export default function InternshipSection() {
  const resume = useResumeStore((state) => state.resume);
  const deleteInternship = useResumeStore((state) => state.deleteInternship);

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

  if (!resume) return null;

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditIndex(undefined);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditIndex(undefined);
  };

  if (showForm) {
    return (
      <InternshipForm
        onClose={handleClose}
        editIndex={editIndex}
        initialData={
          editIndex !== undefined ? resume.internships[editIndex] : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button onClick={handleAdd}>+ Add Internship</Button>
      </div>

      {resume.internships.length === 0 ? (
        <p className="text-sm text-nav-text">No internships added yet.</p>
      ) : (
        <div className="space-y-3">
          {resume.internships.map((intern, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold">{intern.role}</p>
                <p className="text-sm text-nav-text">{intern.company}</p>
                {intern.location && (
                  <p className="text-sm text-nav-text">{intern.location}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(index)}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteInternship(index)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
