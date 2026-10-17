// color changed============================================

import { useState } from "react";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";

import { useResumeStore } from "../../../../store/resume.store";

export default function AchievementsSection() {
  const resume = useResumeStore((state) => state.resume);

  const addAchievement = useResumeStore((state) => state.addAchievement);

  const updateAchievement = useResumeStore((state) => state.updateAchievement);

  const removeAchievement = useResumeStore((state) => state.removeAchievement);

  const [newAchievement, setNewAchievement] = useState("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [editingValue, setEditingValue] = useState("");

  if (!resume) return null;

  const achievements = resume.achievements ?? [];

  const handleAdd = () => {
    const value = newAchievement.trim();

    if (!value) return;

    addAchievement(value);

    setNewAchievement("");
  };

  const handleStartEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setEditingValue(value);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const value = editingValue.trim();

    if (!value) return;

    updateAchievement(editingIndex, value);

    setEditingIndex(null);
    setEditingValue("");
  };

  const handleDelete = (achievement: string) => {
    removeAchievement(achievement);

    if (editingIndex !== null) {
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-heading">Achievements</h2>

        <p className="mt-1 text-sm text-nav-text">
          Add your important achievements, accomplishments and milestones.
        </p>
      </div>

      {/* Existing Achievements */}
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <div
            key={`${achievement}-${index}`}
            className="
                rounded-xl
                border
                border-border
                bg-popup
                p-4
              "
          >
            {editingIndex === index ? (
              /* ================= EDIT MODE ================= */
              <div className="space-y-3">
                <textarea
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  rows={3}
                  autoFocus
                  className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-border
                      bg-navbar
                      px-4
                      py-3
                      text-sm
                      text-heading
                      outline-none
                      focus:border-border-strong
                      focus:ring-2
                      focus:ring-ring
                    "
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(null);
                      setEditingValue("");
                    }}
                    className="
                        rounded-lg
                        border
                        border-border
                        px-4
                        py-2
                        text-sm
                        text-heading
                        hover:bg-navbar-hover
                      "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-btn
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-btn-text
                        hover:bg-btn-hover
                      "
                  >
                    <FaCheck size={12} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              /* ================= VIEW MODE ================= */
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p
                    className="
                        text-sm
                        leading-6
                        text-heading
                      "
                  >
                    {achievement}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(index, achievement)}
                    className="
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        text-subheading
                        hover:bg-border-popup
                      "
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(achievement)}
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        text-red-600
                        hover:bg-red-600/10
                      "
                    title="Delete achievement"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {achievements.length === 0 && (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-border
              bg-navbar-hover
              px-6
              py-10
              text-center
            "
          >
            <p className="text-sm text-nav-text">
              No achievements added yet.
            </p>

            <p className="mt-1 text-xs text-heading/40">
              Add your first achievement below.
            </p>
          </div>
        )}
      </div>

      {/* Add Achievement */}
      <div className="rounded-xl border border-border bg-popup p-4">
        <label className="mb-2 block text-sm font-medium text-heading">
          New Achievement
        </label>

        <textarea
          value={newAchievement}
          onChange={(e) => setNewAchievement(e.target.value)}
          rows={3}
          placeholder="e.g. Solved 700+ DSA problems on LeetCode"
          className="
            w-full
            resize-none
            rounded-lg
            border
            border-border
            bg-navbar
            px-4
            py-3
            text-sm
            text-heading
            outline-none
            focus:border-border-strong
            focus:ring-2
            focus:ring-ring
          "
        />

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newAchievement.trim()}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-btn
              px-4
              py-2.5
              text-sm
              font-medium
              text-btn-text
              transition
              hover:bg-btn-hover
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FaPlus size={12} />
            Add Achievement
          </button>
        </div>
      </div>
    </div>
  );
}
