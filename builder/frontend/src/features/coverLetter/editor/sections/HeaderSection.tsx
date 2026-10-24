import { useCoverLetterStore } from "../../../../store/coverLetter.store";
import Input from "../../../../components/ui/Input";

const inputClass =
  "h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-border-strong";

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
          <Input
            label="Location"
            placeholder="Bengaluru, Karnataka"
            value={personalInfo.location ?? ""}
            onChange={(e) =>
              updatePersonalInfo({ location: e.target.value })
            }
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
          <Input
            label="Date"
            placeholder="September 21, 2026"
            value={recipient.date}
            onChange={(e) => updateRecipient({ date: e.target.value })}
          />
          <Input
            label="Recipient Name"
            placeholder="Hiring Manager"
            value={recipient.recipientName}
            onChange={(e) =>
              updateRecipient({ recipientName: e.target.value })
            }
          />
          <Input
            label="Company Name"
            placeholder="Nexora Technologies"
            value={recipient.companyName}
            onChange={(e) =>
              updateRecipient({ companyName: e.target.value })
            }
          />
          <Input
            label="Company Location (optional)"
            placeholder="Bengaluru, Karnataka"
            value={recipient.companyLocation ?? ""}
            onChange={(e) =>
              updateRecipient({ companyLocation: e.target.value })
            }
          />
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-heading/80">
              Subject Line (optional)
            </label>
            <input
              className={inputClass}
              placeholder="Application for Full Stack Developer Position"
              value={recipient.subject ?? ""}
              onChange={(e) =>
                updateRecipient({ subject: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-heading/80">
              Greeting
            </label>
            <input
              className={inputClass}
              placeholder="Dear Hiring Manager,"
              value={recipient.greeting}
              onChange={(e) =>
                updateRecipient({ greeting: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
