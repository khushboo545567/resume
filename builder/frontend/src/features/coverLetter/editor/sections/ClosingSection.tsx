import { useCoverLetterStore } from "../../../../store/coverLetter.store";
import SuggestInput from "../../../../components/ui/SuggestInput";

import { searchSignOffs } from "../../config/coverLetterOptions";

export default function ClosingSection() {
  const coverLetter = useCoverLetterStore((state) => state.coverLetter);
  const updateClosing = useCoverLetterStore((state) => state.updateClosing);

  if (!coverLetter) return null;

  const { closing, personalInfo } = coverLetter;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-heading sm:text-lg">Sign Off</h3>
        <p className="mt-1 mb-4 text-xs text-heading/60 sm:text-sm">
          How you close the letter, followed by your name.
        </p>
      </div>

      <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4">
        <SuggestInput
          label="Sign-off"
          placeholder="Sincerely,"
          emptyHeading="Common sign-offs"
          value={closing.signOff}
          onChange={(value) => updateClosing({ signOff: value })}
          getSuggestions={searchSignOffs}
        />
        <SuggestInput
          label="Your Name"
          placeholder="Aarav Sharma"
          emptyHeading="From your details"
          value={closing.fullName}
          onChange={(value) => updateClosing({ fullName: value })}
          getSuggestions={() =>
            personalInfo.fullName.trim() ? [personalInfo.fullName.trim()] : []
          }
        />
      </div>
    </div>
  );
}
