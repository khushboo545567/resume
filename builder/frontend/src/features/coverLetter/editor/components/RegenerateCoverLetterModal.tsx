import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";

import { useCoverLetterStore } from "../../../../store/coverLetter.store";
import {
  regenerateCoverLetterSection,
  getCoverLetterAiCredits,
  getAiErrorMessage,
  type CoverLetterAiCredits,
} from "../../services/coverLetterAi.service";
import type { RegenerateCoverLetterTarget } from "../../types/coverLetter.types";
import { REGENERATE_PRESETS } from "../../config/coverLetterOptions";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RegenerateCoverLetterModal({ open, onClose }: Props) {
  const coverLetter = useCoverLetterStore((state) => state.coverLetter);
  const updateBodyField = useCoverLetterStore((state) => state.updateBodyField);
  const updateParagraph = useCoverLetterStore((state) => state.updateParagraph);

  const [target, setTarget] = useState<RegenerateCoverLetterTarget>("full");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [credits, setCredits] = useState<CoverLetterAiCredits | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setCreditsLoading(true);
    getCoverLetterAiCredits()
      .then(setCredits)
      .catch(() => setCredits(null))
      .finally(() => setCreditsLoading(false));
  }, [open]);

  if (!coverLetter) return null;

  const outOfCredits = credits !== null && credits.edits <= 0;

  const paragraphOptions = coverLetter.body.paragraphs.map((_, index) => ({
    value: `paragraph:${index}` as RegenerateCoverLetterTarget,
    label: `Body Paragraph ${index + 1}`,
  }));

  // Adds a quick pick to what the user has written, instead of replacing it.
  const addPreset = (preset: string) => {
    setError(null);
    setReason((current) => {
      const base = current.trim().replace(/[.,;\s]+$/, "");
      return base ? `${base}. ${preset}.` : preset;
    });
  };

  const availablePresets = REGENERATE_PRESETS.filter(
    (preset) => !reason.toLowerCase().includes(preset.toLowerCase()),
  );

  const handleRegenerate = async () => {
    if (outOfCredits) {
      setError(
        "You've used all your free AI generations. Buy more credits to continue.",
      );
      return;
    }

    if (!reason.trim()) {
      setError("Please describe what you'd like changed.");
      return;
    }

    if (
      target === "full" &&
      !window.confirm(
        "This will replace your entire letter body. Any manual edits you made will be lost. Continue?",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { result, credits: updatedCredits } =
        await regenerateCoverLetterSection({
          currentLetter: coverLetter,
          target,
          reason: reason.trim(),
        });

      setCredits(updatedCredits);

      if (target === "full") {
        updateBodyField({
          opening: result.opening as string,
          closing: result.closing as string,
        });

        // Replace all middle paragraphs.
        const newParagraphs = (result.paragraphs as string[]) ?? [];
        newParagraphs.forEach((paragraph, index) => {
          updateParagraph(index, paragraph);
        });
      } else if (target === "opening") {
        updateBodyField({ opening: result.opening as string });
      } else if (target === "closing") {
        updateBodyField({ closing: result.closing as string });
      } else {
        const index = Number(target.split(":")[1]);
        updateParagraph(index, result.paragraph as string);
      }

      setReason("");
      onClose();
    } catch (err) {
      console.error(err);

      setError(
        getAiErrorMessage(err, "Failed to regenerate. Please try again."),
      );

      if ((err as any)?.response?.status === 403) {
        getCoverLetterAiCredits().then(setCredits).catch(() => {});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Regenerate with AI"
      description="Tell the AI what you'd like changed — it's required so the rewrite actually matches what you want."
      size="md"
    >
      <div className="space-y-5">
        {!creditsLoading && credits && (
          <div
            className={`rounded-xl p-3 text-sm ${
              outOfCredits
                ? "bg-red-600/10 text-red-600"
                : "bg-green-700/10 text-green-700"
            }`}
          >
            {outOfCredits ? (
              <div className="flex items-center gap-2">
                <Lock size={16} />
                <span>
                  You've used all your AI edits.{" "}
                  <Link to="/pricing" className="font-semibold underline">
                    Buy more credits
                  </Link>{" "}
                  to continue.
                </span>
              </div>
            ) : (
              <span>
                {credits.edits} AI edit{credits.edits === 1 ? "" : "s"} left.
              </span>
            )}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-heading/80">
            What should be regenerated?
          </label>
          <select
            value={target}
            onChange={(e) =>
              setTarget(e.target.value as RegenerateCoverLetterTarget)
            }
            className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-border-strong"
          >
            <option value="full">Whole Letter</option>
            <option value="opening">Opening Paragraph</option>
            {paragraphOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            <option value="closing">Closing Paragraph</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-heading/80">
            What would you like different? (required)
          </label>
          {availablePresets.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {availablePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => addPreset(preset)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-heading/70 transition hover:border-border-strong hover:text-heading"
                >
                  + {preset}
                </button>
              ))}
            </div>
          )}
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Make it shorter, sound less formal, focus more on leadership experience..."
            className="w-full min-h-[100px] rounded-xl border border-border p-4 outline-none focus:border-border-strong resize-y"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleRegenerate}
            disabled={loading || outOfCredits}
          >
            {loading
              ? "Regenerating..."
              : outOfCredits
                ? "Buy Credits to Continue"
                : "Regenerate"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
