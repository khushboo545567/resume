import { useResumeStore } from "../../../../store/resume.store";
import { Plus, Trash2 } from "lucide-react";

import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";

export default function StrengthsSection() {
  const resume = useResumeStore((state) => state.resume);

  const addStrength = useResumeStore((state) => state.addStrength);
  const updateStrength = useResumeStore((state) => state.updateStrength);
  const deleteStrength = useResumeStore((state) => state.deleteStrength);

  const renameSectionDisplayTitle = useResumeStore(
    (state) => state.renameSectionDisplayTitle,
  );

  if (!resume) return null;

  const strengths = resume.strengths ?? [];

  const strengthSection = resume.sections.find(
    (section) => section.id === "strengths",
  );

  return (
    <div className="space-y-6">
      <Input
        label="Resume Heading"
        placeholder="Strengths"
        value={strengthSection?.displayTitle ?? ""}
        onChange={(e) => renameSectionDisplayTitle("strengths", e.target.value)}
      />

      <div className="space-y-4">
        {strengths.map((strength, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-border bg-popup p-4 sm:p-5"
          >
            <Input
              label="Strength"
              placeholder="Problem Solving"
              value={strength.title}
              onChange={(e) =>
                updateStrength(index, {
                  ...strength,
                  title: e.target.value,
                })
              }
            />

            <Textarea
              label="Description"
              rows={3}
              placeholder="Describe your strength..."
              value={strength.description}
              onChange={(e) =>
                updateStrength(index, {
                  ...strength,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<Trash2 size={16} />}
                onClick={() => deleteStrength(index)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        leftIcon={<Plus size={18} />}
        onClick={() =>
          addStrength({
            title: "",
            description: "",
          })
        }
      >
        Add strength
      </Button>
    </div>
  );
}
