import { useResumeStore } from "../../../../../../store/resume.store";

import SectionHeader from "../shared/SectionHeader";

import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

const URL_PATTERN = /(https?:\/\/[^\s)]+|www\.[^\s)]+)/gi;

/**
 * Renders a certification line as plain text, but turns any URL found in it
 * into a clickable, underlined "Link" — so certificates that include a
 * verification link show a clean hyperlink instead of exposing the raw URL.
 */
function renderCertification(text: string) {
  // With one capturing group, String.split interleaves plain text and
  // matched URLs: [text, url, text, url, ...]. Odd indices are the matches.
  const parts = text.split(URL_PATTERN);

  return parts.map((part, index) => {
    const isUrl = index % 2 === 1;

    if (!isUrl) {
      return <span key={index}>{part}</span>;
    }

    const href = part.startsWith("http") ? part : `https://${part}`;

    return (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-700"
      >
        Link
      </a>
    );
  });
}

export default function CertificationsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const certifications = resume.certifications ?? [];

  const certificationsSection = resume.sections.find(
    (section) => section.id === "certifications"
  );

  if (certifications.length === 0) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          certificationsSection?.displayTitle?.trim() ||
          certificationsSection?.title ||
          "Certifications"
        }
      />

      <div className="mt-4 space-y-3">
        {certifications.map((certificate, index) => (
          <div
            key={index}
            className="border-l-2 border-slate-300 pl-4"
          >
            <p
              className={`
                ${T.fontSize.body}
                ${T.colors.body}
              `}
            >
              {renderCertification(certificate)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}