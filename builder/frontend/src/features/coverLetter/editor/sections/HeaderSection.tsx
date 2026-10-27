import { useCoverLetterStore } from "../../../../store/coverLetter.store";
import Input from "../../../../components/ui/Input";
import SuggestInput from "../../../../components/ui/SuggestInput";

import { searchLocations } from "../../../resume/config/locations";
import {
  searchGreetings,
  searchRecipientNames,
  searchSubjects,
  todayLong,
} from "../../config/coverLetterOptions";

export default function HeaderSection() {
  const coverLetter = useCoverLetterStore((state) => state.coverLetter);
  const updatePersonalInfo = useCoverLetterStore(
    (state) => state.updatePersonalInfo,
  );
  const updateRecipient = useCoverLetterStore((state) => state.updateRecipient);

  if (!coverLetter) return null;

  const { personalInfo, recipient } = coverLetter;

  return (
    <div className="space-y-10">
      {/* Your Details */}
      <div>
        <h3 className="text-base font-bold text-heading sm:text-lg">Your Details</h3>
        <p className="mt-1 mb-4 text-xs text-heading/60 sm:text-sm">
          Shown at the top of the letter, just like a resume header.
        </p>

        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Aarav Sharma"
            value={personalInfo.fullName}
            onChange={(e) =>
              updatePersonalInfo({ fullName: e.target.value })
            }
          />
          <SuggestInput
            label="Location"
            placeholder="Bengaluru, Karnataka"
            emptyHeading="Popular cities"
            value={personalInfo.location ?? ""}
            onChange={(value) => updatePersonalInfo({ location: value })}
            getSuggestions={searchLocations}
          />
          <Input
            label="Phone"
            placeholder="+91 98765 43210"
            value={personalInfo.phone ?? ""}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          />
          <Input
            label="Email"
            placeholder="aarav.sharma.dev@gmail.com"
            value={personalInfo.email ?? ""}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          />
          <Input
            label="GitHub (optional)"
            placeholder="github.com/aaravsharma-dev"
            value={personalInfo.github ?? ""}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
          />
          <Input
            label="LinkedIn (optional)"
            placeholder="linkedin.com/in/aaravsharma-dev"
            value={personalInfo.linkedIn ?? ""}
            onChange={(e) =>
              updatePersonalInfo({ linkedIn: e.target.value })
            }
          />
        </div>
      </div>

      {/* Recipient & Letter Info */}
      <div>
        <h3 className="text-base font-bold text-heading sm:text-lg">
          Recipient & Letter Info
        </h3>
        <p className="mt-1 mb-4 text-xs text-heading/60 sm:text-sm">
          Who the letter is addressed to, and when.
        </p>

        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4">
          <SuggestInput
            label="Date"
            placeholder="September 21, 2026"
            emptyHeading="Today"
            value={recipient.date}
            onChange={(value) => updateRecipient({ date: value })}
            getSuggestions={(text) => {
              const today = todayLong();
              return !text.trim() ||
                today.toLowerCase().includes(text.trim().toLowerCase())
                ? [today]
                : [];
            }}
          />
          <SuggestInput
            label="Recipient Name"
            placeholder="Hiring Manager"
            emptyHeading="Common recipients"
            value={recipient.recipientName}
            onChange={(value) => updateRecipient({ recipientName: value })}
            getSuggestions={searchRecipientNames}
          />
          <Input
            label="Company Name"
            placeholder="Nexora Technologies"
            value={recipient.companyName}
            onChange={(e) =>
              updateRecipient({ companyName: e.target.value })
            }
          />
          <SuggestInput
            label="Company Location (optional)"
            placeholder="Bengaluru, Karnataka"
            emptyHeading="Popular cities"
            value={recipient.companyLocation ?? ""}
            onChange={(value) => updateRecipient({ companyLocation: value })}
            getSuggestions={searchLocations}
          />
        </div>

        <div className="mt-4 space-y-4">
          <SuggestInput
            label="Subject Line (optional)"
            placeholder="Application for Full Stack Developer Position"
            emptyHeading="Suggested subject lines"
            value={recipient.subject ?? ""}
            onChange={(value) => updateRecipient({ subject: value })}
            getSuggestions={(text) =>
              searchSubjects(text, {
                role: coverLetter.targetRole,
                company: recipient.companyName,
                fullName: personalInfo.fullName,
              })
            }
          />

          <SuggestInput
            label="Greeting"
            placeholder="Dear Hiring Manager,"
            emptyHeading="Common greetings"
            value={recipient.greeting}
            onChange={(value) => updateRecipient({ greeting: value })}
            getSuggestions={(text) =>
              searchGreetings(text, recipient.recipientName)
            }
          />
        </div>
      </div>
    </div>
  );
}
