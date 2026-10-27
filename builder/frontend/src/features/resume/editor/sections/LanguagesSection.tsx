// color changed==================================

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";
import SuggestInput from "../../../../components/ui/SuggestInput";
import { searchLanguages } from "../../config/languageOptions";

const PROFICIENCY_LEVELS = ["Native", "Fluent", "Conversational", "Basic"];

export default function LanguagesSection() {
  const languages = useResumeStore((state) => state.resume?.languages ?? []);

  const addLanguage = useResumeStore((state) => state.addLanguage);
  const removeLanguage = useResumeStore((state) => state.removeLanguage);
  const updateLanguageLevel = useResumeStore(
    (state) => state.updateLanguageLevel,
  );

  const [name, setName] = useState("");
  const [level, setLevel] = useState(PROFICIENCY_LEVELS[0]);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    addLanguage({ name: trimmed, level });
    setName("");
    setLevel(PROFICIENCY_LEVELS[0]);
  };

  // Runs for Enter inside the field; SuggestInput has already handled it
  // (and cancelled it) when the key was used to pick a suggestion.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.defaultPrevented) return;
    e.preventDefault();
    handleAdd();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-heading/60 sm:text-sm">
          Add a language name and proficiency level, then press Enter or click
          Add.
        </p>
      </div>

      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
        onKeyDown={handleKeyDown}
      >
        <div className="flex-1">
          <SuggestInput
            value={name}
            onChange={setName}
            placeholder="English"
            emptyHeading="Popular languages"
            getSuggestions={(text) =>
              searchLanguages(
                text,
                languages.map((language) => language.name),
              )
            }
          />
        </div>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="h-12 rounded-xl border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong"
        >
          {PROFICIENCY_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleAdd}
          className="h-12 rounded-xl bg-btn px-6 font-medium text-btn-text hover:bg-btn-hover"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {languages.map((language) => (
          <div
            key={language.name}
            className="flex items-center gap-2 rounded-full bg-btn-hover-bg px-4 py-2 text-sm text-subheading"
          >
            {/* Language name */}
            <span className="font-medium">{language.name}</span>

            {/* Level dropdown */}
            <select
              value={language.level}
              onChange={(e) =>
                updateLanguageLevel(language.name, e.target.value)
              }
              className="cursor-pointer appearance-none border-0 bg-transparent p-0 text-xs text-subheading outline-none focus:ring-0"
            >
              {PROFICIENCY_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeLanguage(language.name)}
              className="ml-1 flex items-center justify-center rounded-full hover:bg-border-popup"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
