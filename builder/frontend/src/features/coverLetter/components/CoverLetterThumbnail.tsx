import type { CoverLetter } from "../types/coverLetter.types";

interface Props {
  coverLetter: CoverLetter;
}

const ACCENT = "#1F4E79";

/**
 * Miniature "paper" preview of a cover letter for dashboard cards.
 *
 * Mirrors the Classic Formal template (bold name, contact line, accent rule,
 * recipient + date, greeting, body, sign-off) at the same 40x60 size as the
 * resume thumbnails so both cards line up on the dashboard.
 */
export default function CoverLetterThumbnail({ coverLetter }: Props) {
  const { personalInfo, recipient, body, closing } = coverLetter;

  const contact = [personalInfo?.phone, personalInfo?.email]
    .filter(Boolean)
    .join(" | ");

  const paragraphs = [
    body?.opening,
    ...(body?.paragraphs ?? []),
    body?.closing,
  ].filter((text): text is string => Boolean(text?.trim()));

  return (
    <div className="h-60 w-40 overflow-hidden rounded bg-white p-2 font-serif text-slate-800 shadow">
      {/* Header */}
      <h1 className="truncate text-[9px] font-bold text-slate-900">
        {personalInfo?.fullName || "YOUR NAME"}
      </h1>

      {contact && (
        <p className="mt-0.5 truncate text-[4.5px] text-slate-600">{contact}</p>
      )}

      <div
        className="my-1.5 h-px w-full"
        style={{ backgroundColor: ACCENT }}
      />

      {/* Recipient + date */}
      <div className="flex items-start justify-between gap-1 text-[4.5px]">
        <div className="min-w-0">
          <p className="truncate font-bold">
            {recipient?.recipientName || "Hiring Manager"}
          </p>
          {recipient?.companyName && (
            <p className="truncate">{recipient.companyName}</p>
          )}
        </div>

        {recipient?.date && (
          <p className="shrink-0 text-right">{recipient.date}</p>
        )}
      </div>

      {recipient?.subject && (
        <p className="mt-1.5 truncate text-[4.5px] font-bold">
          Subject: {recipient.subject}
        </p>
      )}

      {recipient?.greeting && (
        <p className="mt-1.5 truncate text-[5px]">{recipient.greeting}</p>
      )}

      {/* Body */}
      <div className="mt-1 space-y-1">
        {paragraphs.slice(0, 3).map((text, index) => (
          <p
            key={index}
            className="line-clamp-4 text-justify text-[4.5px] leading-tight"
          >
            {text}
          </p>
        ))}
      </div>

      {/* Sign-off */}
      {closing?.fullName && (
        <div className="mt-1.5 text-[5px]">
          <p>{closing.signOff}</p>
          <p className="mt-1 font-bold">{closing.fullName}</p>
        </div>
      )}
    </div>
  );
}
