import { Plus, Trash2 } from "lucide-react";

import { useCoverLetterStore } from "../../../../store/coverLetter.store";

const textareaClass =
  "w-full rounded-xl border border-border p-4 outline-none focus:border-border-strong resize-y min-h-[120px]";

export default function BodySection() {
  const coverLetter = useCoverLetterStore((state) => state.coverLetter);
  const updateBodyField = useCoverLetterStore((state) => state.updateBodyField);
  const addParagraph = useCoverLetterStore((state) => state.addParagraph);
  const updateParagraph = useCoverLetterStore((state) => state.updateParagraph);
  const removeParagraph = useCoverLetterStore((state) => state.removeParagraph);

  if (!coverLetter) return null;

  const { body } = coverLetter;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-bold text-heading sm:text-lg">Opening Paragraph</h3>
        <p className="mt-1 mb-3 text-xs text-heading/60 sm:text-sm">
          Who you are, the role you're applying for, and a hook.
        </p>
        <textarea
          className={textareaClass}
          placeholder="I am writing to apply for the Full Stack Developer position at Nexora Technologies..."
          value={body.opening}
          onChange={(e) => updateBodyField({ opening: e.target.value })}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-heading sm:text-lg">Body Paragraphs</h3>
            <p className="mt-1 text-xs text-heading/60 sm:text-sm">
              Your relevant experience, projects, and why you're a fit.
            </p>
          </div>

          <button
            type="button"
            onClick={addParagraph}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-btn px-4 py-2 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
          >
            <Plus size={16} />
            Add Paragraph
          </button>
        </div>

        <div className="space-y-4">
          {body.paragraphs.length === 0 && (
            <p className="text-sm text-heading/50 italic">
              No paragraphs yet — click "Add Paragraph" to start writing.
            </p>
          )}

          {body.paragraphs.map((paragraph, index) => (
            <div key={index} className="relative">
              <textarea
                className={textareaClass}
                placeholder={`Paragraph ${index + 1}...`}
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeParagraph(index)}
                className="absolute right-3 top-3 rounded-lg bg-popup/90 p-1.5 text-red-500 shadow hover:bg-red-50"
                title="Remove paragraph"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-heading sm:text-lg">Closing Paragraph</h3>
        <p className="mt-1 mb-3 text-xs text-heading/60 sm:text-sm">
          A call to action and thanks for their time.
        </p>
        <textarea
          className={textareaClass}
          placeholder="Thank you for considering my application. I would welcome the opportunity to discuss..."
          value={body.closing}
          onChange={(e) => updateBodyField({ closing: e.target.value })}
        />
      </div>
    </div>
  );
}
