import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";
import Button from "../../../../components/ui/Button";

export default function AwardsSection() {
  const awards = useResumeStore((state) => state.resume?.awards ?? []);

  const addAward = useResumeStore((state) => state.addAward);
  const removeAward = useResumeStore((state) => state.removeAward);

  const [value, setValue] = useState("");

  // Add award
  const handleAddAward = () => {
    const award = value.trim();

    if (!award) return;

    addAward(award);

    setValue("");
  };

  // Add award when pressing Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    handleAddAward();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Awards</h2>

        <p className="text-nav-text">
          Press Enter or click Add to add an award.
        </p>
      </div>

      {/* Award Input + Add Button */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Winner - Smart India Hackathon"
          className="h-12 flex-1 rounded-xl border px-4 outline-none focus:border-border-strong"
        />

        <Button
          type="button"
          leftIcon={<Plus size={18} />}
          onClick={handleAddAward}
        >
          Add
        </Button>
      </div>

      {/* Awards List */}
      <div className="flex flex-wrap gap-3">
        {awards.map((award) => (
          <button
            key={award}
            type="button"
            onClick={() => removeAward(award)}
            className="flex items-center gap-2 rounded-full bg-btn-hover-bg px-4 py-2 text-heading"
          >
            {award}
            <X size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}
