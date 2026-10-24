import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Heart, Plus, X } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";
import Button from "../../../../components/ui/Button";

export default function InterestsSection() {
  const interests = useResumeStore((state) => state.resume?.interests ?? []);

  const addInterest = useResumeStore((state) => state.addInterest);

  const removeInterest = useResumeStore((state) => state.removeInterest);

  const [value, setValue] = useState("");

  // Add interest
  const handleAddInterest = () => {
    const interest = value.trim();

    if (!interest) return;

    addInterest(interest);

    setValue("");
  };

  // Add interest when pressing Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    handleAddInterest();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs text-heading/60 sm:text-sm">
          Press Enter or click Add to add your interests.
        </p>
      </div>

      {/* Interest Input + Add Button */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Open Source"
          className="h-12 flex-1 rounded-xl border px-4 outline-none focus:border-border-strong"
        />

        <Button
          type="button"
          leftIcon={<Plus size={18} />}
          onClick={handleAddInterest}
        >
          Add
        </Button>
      </div>

      {/* Interests List */}
      <div className="flex flex-wrap gap-3">
        {interests.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() => removeInterest(interest)}
            className="flex items-center gap-2 rounded-full bg-btn-hover-bg px-4 py-2 text-heading transition hover:bg-border-popup"
          >
            <Heart size={16} />

            {interest}

            <X size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}
