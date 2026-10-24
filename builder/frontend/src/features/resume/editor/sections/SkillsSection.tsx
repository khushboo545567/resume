import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import {
  X,
  Sparkles,
  Pencil,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useResumeStore } from "../../../../store/resume.store";
import {
  skillSuggestions,
  skillSuggestionsByCategory,
} from "../data/skillSuggestions";
import { useSuggestSkills } from "../../../ai/hooks/useSuggestSkills";
import Input from "../../../../components/ui/Input";

export default function SkillsSection() {
  const skills = useResumeStore((state) => state.resume?.skills ?? []);
  const addSkill = useResumeStore((state) => state.addSkill);
  const removeSkill = useResumeStore((state) => state.removeSkill);
  const updateSkills = useResumeStore((state) => state.updateSkills);
  const addCategory = useResumeStore((state) => state.addCategory);
  const removeCategory = useResumeStore((state) => state.removeCategory);
  const resume = useResumeStore((state) => state.resume);
  const renameSectionDisplayTitle = useResumeStore(
    (state) => state.renameSectionDisplayTitle,
  );

  const skillsSection = resume?.sections.find(
    (section) => section.id === "skills",
  );

  const { mutate, isPending } = useSuggestSkills();

  // The 4 fixed presets + "Other" as the 5th option
  const presetCategories = ["Languages", "Frameworks", "Databases", "Tools"];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [otherCategoryInput, setOtherCategoryInput] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryRenameValue, setCategoryRenameValue] = useState("");

  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [skillEditValue, setSkillEditValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const skillEditInputRef = useRef<HTMLInputElement>(null);
  const otherInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (skills.length === 0) {
      setSelectedCategory("");
      return;
    }
    if (!skills.find((c) => c.title === selectedCategory)) {
      setSelectedCategory(skills[0].title);
    }
  }, [skills, selectedCategory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [skills.length]);

  useEffect(() => {
    if (editingCategory) renameInputRef.current?.focus();
  }, [editingCategory]);

  useEffect(() => {
    if (editingSkill) skillEditInputRef.current?.focus();
  }, [editingSkill]);

  useEffect(() => {
    if (showOtherInput) otherInputRef.current?.focus();
  }, [showOtherInput]);

  const skillExists = (categoryTitle: string, skill: string) => {
    const category = skills.find((item) => item.title === categoryTitle);
    if (!category) return false;
    return category.skills.some((s) => s.toLowerCase() === skill.toLowerCase());
  };

  const categoryExists = (title: string, excludeTitle?: string) =>
    skills.some(
      (cat) =>
        cat.title.toLowerCase() === title.toLowerCase() &&
        cat.title !== excludeTitle,
    );

  // ---------- Category actions ----------

  const handlePresetClick = (title: string) => {
    if (!categoryExists(title)) {
      addCategory(title);
    }
    setSelectedCategory(title);
    setShowOtherInput(false);
  };

  const handleOtherClick = () => {
    setShowOtherInput(true);
    setOtherCategoryInput("");
  };

  const handleAddOtherCategory = () => {
    const title = otherCategoryInput.trim();
    if (!title) return;
    if (categoryExists(title)) {
      setSelectedCategory(title);
      setShowOtherInput(false);
      setOtherCategoryInput("");
      return;
    }
    addCategory(title);
    setSelectedCategory(title);
    setOtherCategoryInput("");
    setShowOtherInput(false);
  };

  const startRenameCategory = (title: string) => {
    setEditingCategory(title);
    setCategoryRenameValue(title);
  };

  const confirmRenameCategory = () => {
    if (!editingCategory) return;
    const newTitle = categoryRenameValue.trim();

    if (!newTitle || newTitle === editingCategory) {
      setEditingCategory(null);
      return;
    }
    if (categoryExists(newTitle, editingCategory)) {
      setEditingCategory(null);
      return;
    }

    const updated = skills.map((cat) =>
      cat.title === editingCategory ? { ...cat, title: newTitle } : cat,
    );
    updateSkills(updated);

    if (selectedCategory === editingCategory) {
      setSelectedCategory(newTitle);
    }
    setEditingCategory(null);
  };

  const handleDeleteCategory = (title: string) => {
    removeCategory(title);
    if (selectedCategory === title) {
      const remaining = skills.filter((c) => c.title !== title);
      setSelectedCategory(remaining[0]?.title ?? "");
    }
  };

  // ---------- Skill actions ----------

  const handleAddSkill = () => {
    const value = skillInput.trim();
    if (!value || !selectedCategory) return;
    if (skillExists(selectedCategory, value)) {
      setSkillInput("");
      return;
    }
    addSkill(selectedCategory, value);
    setSkillInput("");
  };

  const startEditSkill = (skill: string) => {
    setEditingSkill(skill);
    setSkillEditValue(skill);
  };

  const confirmEditSkill = () => {
    if (!editingSkill || !selectedCategory) return;
    const newValue = skillEditValue.trim();

    if (!newValue || newValue === editingSkill) {
      setEditingSkill(null);
      return;
    }
    if (skillExists(selectedCategory, newValue)) {
      setEditingSkill(null);
      return;
    }

    const updated = skills.map((cat) => {
      if (cat.title !== selectedCategory) return cat;
      return {
        ...cat,
        skills: cat.skills.map((s) => (s === editingSkill ? newValue : s)),
      };
    });
    updateSkills(updated);
    setEditingSkill(null);
  };

  const handleSuggestSkills = () => {
    if (!resume?._id || !selectedCategory) return;
    mutate(
      { resumeId: resume._id, selectedCategory },
      {
        onSuccess: (aiSkills: string[]) => {
          const updated = skills.map((category) => {
            if (category.title !== selectedCategory) return category;
            const merged = [...category.skills, ...aiSkills].filter(
              (skill, index, arr) =>
                index ===
                arr.findIndex((s) => s.toLowerCase() === skill.toLowerCase()),
            );
            return { ...category, skills: merged };
          });
          updateSkills(updated);
        },
      },
    );
  };
  const currentCategory = skills.find((c) => c.title === selectedCategory);

  // ///////////////////////////////////////////////////

  const moveCategory = (title: string, direction: "up" | "down") => {
    const index = skills.findIndex((c) => c.title === title);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const reordered = [...skills];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    updateSkills(reordered);
  };

  // ///////////////////////////////////////////////////

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="text-xs text-heading/60 sm:text-sm">
          Pick a category below, or choose Other to create your own.
        </p>
      </div>
      <Input
        label="Resume Heading"
        placeholder="Technical Skills"
        value={skillsSection?.displayTitle ?? ""}
        onChange={(e) => renameSectionDisplayTitle("skills", e.target.value)}
      />

      {/* Step 1: Choose a category — 4 presets + Other */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-heading">
          Select category
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {presetCategories.map((title) => {
            const isActive = selectedCategory === title;
            return (
              <button
                key={title}
                type="button"
                onClick={() => handlePresetClick(title)}
                className={`rounded-lg border border-border px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition ${
                  isActive
                    ? "border-border-strong bg-btn-hover-bg text-subheading font-semibold"
                    : "border-border text-heading hover:border-border hover:bg-btn-hover-bg/50"
                }`}
              >
                {title}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleOtherClick}
            className={`rounded-lg border border-border px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition ${
              showOtherInput ||
              (selectedCategory && !presetCategories.includes(selectedCategory))
                ? "border-border-strong bg-btn-hover-bg text-subheading font-semibold"
                : "border-border text-heading hover:border-border hover:bg-btn-hover-bg/50"
            }`}
          >
            Other
          </button>
        </div>

        {showOtherInput && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              ref={otherInputRef}
              value={otherCategoryInput}
              onChange={(e) => setOtherCategoryInput(e.target.value)}
              placeholder="e.g. Soft Skills, Certifications"
              className="flex-1 h-10 sm:h-11 rounded-lg border border-border px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddOtherCategory();
                if (e.key === "Escape") setShowOtherInput(false);
              }}
            />
            <button
              type="button"
              onClick={handleAddOtherCategory}
              className="rounded-lg bg-btn px-4 sm:px-6 py-2.5 sm:py-2 text-sm font-semibold text-btn-text hover:bg-btn-hover/90 transition whitespace-nowrap"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Existing categories — with rename / delete / reorder */}
      {skills.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-heading">
            Your categories
          </label>

          <div className="flex flex-wrap gap-2">
            {skills.map((category, index) => (
              <div
                key={category.title}
                className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-border px-2.5 sm:px-3 py-2 text-sm transition shrink-0 ${
                  selectedCategory === category.title
                    ? "border-border-strong bg-btn-hover-bg text-heading font-medium"
                    : "border-border text-heading/70 hover:border-border"
                }`}
              >
                {/* Reorder arrows - mobile hidden */}
                <div className="hidden sm:flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveCategory(category.title, "up")}
                    disabled={index === 0}
                    className="h-3 w-3 flex items-center justify-center text-heading/40 hover:text-heading disabled:opacity-30 transition"
                    aria-label="Move up"
                  >
                    <ChevronUp size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCategory(category.title, "down")}
                    disabled={index === skills.length - 1}
                    className="h-3 w-3 flex items-center justify-center text-heading/40 hover:text-heading disabled:opacity-30 transition"
                    aria-label="Move down"
                  >
                    <ChevronDown size={11} />
                  </button>
                </div>

                {/* Category name or rename input */}
                {editingCategory === category.title ? (
                  <input
                    ref={renameInputRef}
                    value={categoryRenameValue}
                    onChange={(e) => setCategoryRenameValue(e.target.value)}
                    onBlur={confirmRenameCategory}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmRenameCategory();
                      if (e.key === "Escape") setEditingCategory(null);
                    }}
                    className="w-20 sm:w-24 rounded px-2 py-0.5 text-xs sm:text-sm border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(category.title)}
                    className="flex items-center gap-0.5 sm:gap-1 min-w-0"
                  >
                    <span className="font-medium truncate text-xs sm:text-sm">
                      {category.title}
                    </span>
                    <span className="text-xs text-heading/50 shrink-0">
                      ({category.skills.length})
                    </span>
                  </button>
                )}

                {/* Rename button */}
                <button
                  type="button"
                  onClick={() => startRenameCategory(category.title)}
                  className="text-heading/40 hover:text-heading transition p-0.5 shrink-0"
                  title="Rename"
                  aria-label={`Rename ${category.title}`}
                >
                  <Pencil size={13} />
                </button>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category.title)}
                  className="text-heading/40 hover:text-red-600 transition p-0.5 shrink-0"
                  title="Delete"
                  aria-label={`Delete ${category.title}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Skill Input */}
      {selectedCategory && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-heading">
            Add skill to:{" "}
            <span className="font-bold text-subheading">{selectedCategory}</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              ref={inputRef}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Type a skill"
              className="flex-1 h-10 sm:h-11 rounded-lg border border-border px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button
              onClick={handleAddSkill}
              className="rounded-lg bg-btn px-4 sm:px-6 py-2.5 sm:py-2 text-sm font-semibold text-btn-text hover:bg-btn-hover/90 transition whitespace-nowrap"
            >
              Add skill
            </button>
          </div>
        </div>
      )}

      {/* Selected Category Skills - with edit + delete */}
      {currentCategory && currentCategory.skills.length > 0 && (
        <div className="rounded-xl border border-border bg-navbar p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {currentCategory.skills.map((skill) =>
              editingSkill === skill ? (
                <div
                  key={skill}
                  className="flex items-center gap-1.5 rounded-full border-2 border-border-strong bg-popup px-3 py-1.5"
                >
                  <input
                    ref={skillEditInputRef}
                    value={skillEditValue}
                    onChange={(e) => setSkillEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmEditSkill();
                      if (e.key === "Escape") setEditingSkill(null);
                    }}
                    className="w-24 text-sm focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={confirmEditSkill}
                    className="text-green-700 hover:text-green-700/80 transition"
                    aria-label="Save skill"
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <div
                  key={skill}
                  className="flex items-center gap-2 rounded-full bg-btn-hover-bg px-4 py-2 text-sm font-medium text-heading hover:bg-btn-hover/15 transition group"
                >
                  <button
                    type="button"
                    onClick={() => startEditSkill(skill)}
                    className="group-hover:underline cursor-pointer"
                    title="Click to edit"
                  >
                    {skill}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSkill(selectedCategory, skill)}
                    className="text-heading/50 hover:text-red-600 transition p-0.5"
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* AI Suggest Button */}
      {selectedCategory && (
        <button
          type="button"
          onClick={handleSuggestSkills}
          disabled={isPending || !resume?._id}
          className="inline-flex items-center gap-2 rounded-lg bg-btn px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold text-btn-text hover:bg-btn-hover/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={16} />
          <span>{isPending ? "AI is suggesting..." : "AI suggest skills"}</span>
        </button>
      )}

      {/* Popular Skills — filtered by selected category */}
      {selectedCategory && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-heading">Popular skills</h3>
          <div className="flex flex-wrap gap-2">
            {(
              skillSuggestionsByCategory[selectedCategory] ?? skillSuggestions
            ).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => {
                  const trimmed = skill.trim();
                  if (!trimmed || skillExists(selectedCategory, trimmed))
                    return;
                  addSkill(selectedCategory, trimmed);
                }}
                className="rounded-full border border-border px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-heading hover:bg-btn-hover/10 hover:border-border transition"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
