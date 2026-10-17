import { useResumeStore } from "../../../../store/resume.store";
import Input from "../../../../components/ui/Input";

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
            className="rounded-lg border border-border bg-popup p-4 space-y-3"
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

            <textarea
              className="w-full rounded-lg border border-border bg-navbar p-3 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
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

            <button
              type="button"
              onClick={() => deleteStrength(index)}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:opacity-90"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          addStrength({
            title: "",
            description: "",
          })
        }
        className="rounded-lg bg-btn px-4 py-2 text-btn-text hover:bg-btn-hover"
      >
        + Add Strength
      </button>
    </div>
  );
}
