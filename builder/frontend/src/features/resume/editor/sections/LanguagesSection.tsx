// color changed==================================

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";
import Button from "../../../../components/ui/Button";
import Select from "../../../../components/ui/Select";
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
    <div className="space-y-6">
      <p className="text-sm text-heading/60">
        Add a language name and proficiency level, then press Enter or click
        Add.
      </p>

      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
        onKeyDown={handleKeyDown}
      >
        <div className="flex-1">
          <SuggestInput
            value={name}
            onChange={setName}
            placeholder="English"
            aria-label="Language"
            emptyHeading="Popular languages"
            getSuggestions={(text) =>
              searchLanguages(
                text,
                languages.map((language) => language.name),
              )
            }
          />
        </div>

        <div className="sm:w-44">
          <Select
            aria-label="Proficiency level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {PROFICIENCY_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </Select>
        </div>

        <Button
          type="button"
          size="lg"
          leftIcon={<Plus size={18} />}
          onClick={handleAdd}
          className="w-full sm:w-auto"
        >
          Add
        </Button>
      </div>

      <ul className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <li
            key={language.name}
            className="flex max-w-full items-center gap-2 rounded-full bg-btn-hover-bg py-2 pl-4 pr-3 text-sm text-subheading"
          >
            <span className="min-w-0 font-medium [overflow-wrap:anywhere]">
              {language.name}
            </span>

            {/* Level dropdown */}
            <select
              value={language.level}
              aria-label={`${language.name} proficiency`}
              onChange={(e) =>
                updateLanguageLevel(language.name, e.target.value)
              }
              className="cursor-pointer appearance-none border-0 bg-transparent p-0 text-xs text-subheading underline decoration-dotted underline-offset-2 outline-none focus:ring-0"
            >
              {PROFICIENCY_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => removeLanguage(language.name)}
              aria-label={`Remove ${language.name}`}
              className="flex shrink-0 items-center justify-center rounded-full p-1 hover:bg-border-popup"
            >
              <X size={15} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
