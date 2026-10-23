// color changed==================================

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    handleAdd();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-heading">Languages</h2>
        <p className="text-nav-text">
          Add a language name and proficiency level, then press Enter or click
          Add.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="English"
          className="h-12 flex-1 rounded-xl border border-border bg-navbar px-4 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
        />

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
