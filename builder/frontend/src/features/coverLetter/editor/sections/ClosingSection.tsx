import { useCoverLetterStore } from "../../../../store/coverLetter.store";
import Input from "../../../../components/ui/Input";

export default function ClosingSection() {
  const coverLetter = useCoverLetterStore((state) => state.coverLetter);
  const updateClosing = useCoverLetterStore((state) => state.updateClosing);

  if (!coverLetter) return null;

  const { closing } = coverLetter;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-heading sm:text-lg">Sign Off</h3>
        <p className="mt-1 mb-4 text-xs text-heading/60 sm:text-sm">
          How you close the letter, followed by your name.
        </p>
      </div>

      <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4">
        <Input
          label="Sign-off"
          placeholder="Sincerely,"
          value={closing.signOff}
          onChange={(e) => updateClosing({ signOff: e.target.value })}
        />
        <Input
          label="Your Name"
          placeholder="Aarav Sharma"
          value={closing.fullName}
          onChange={(e) => updateClosing({ fullName: e.target.value })}
        />
      </div>
    </div>
  );
}
