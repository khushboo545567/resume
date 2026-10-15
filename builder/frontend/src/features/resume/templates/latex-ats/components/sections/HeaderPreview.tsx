import { Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { useResumeStore } from "../../../../../../store/resume.store";
import { LatexATSTheme as T } from "../theme.latex-ats";

export default function HeaderPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const { personalInfo } = resume;

  return (
    <header className={`${T.layout.column} w-full items-center`}>
      {/* Name — \Huge \scshape */}
      <h1
        className={`
          ${T.fontFamily.heading}
          ${T.fontSize.name}
          ${T.fontWeight.bold}
          ${T.lineHeight.heading}
          ${T.colors.heading}
          [font-variant:small-caps]
          text-center
        `}
      >
        {personalInfo.fullName}
      </h1>

      {/* Role / location line — \Large \scshape */}
      {personalInfo.title && (
        <h2
          className={`
            ${T.fontFamily.heading}
            ${T.fontSize.role}
            ${T.fontWeight.bold}
            ${T.colors.heading}
            [font-variant:small-caps]
            text-center mt-0.5
          `}
        >
          {personalInfo.title}
        </h2>
      )}

      {/* Contact — single wrapped line, ~ separated like the .tex header */}
      <div
        className={`
          ${T.layout.wrapCenter}
          ${T.fontSize.contact}
          ${T.colors.body}
          [font-variant-numeric:lining-nums]
          mt-1.5
          gap-x-3 gap-y-1
          w-full
        `}
      >
        {personalInfo.phone && (
          // <span className="flex items-center gap-1">
          //   <Phone size={11} className="shrink-0" color={T.iconColors.body} />
          //   {personalInfo.phone}
          // </span>
          <span style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            {personalInfo.phone}
          </span>
        )}

        {personalInfo.email && (
          <a
            href={`mailto:${personalInfo.email}`}
            className="flex items-center gap-1 hover:underline break-all"
          >
            <Mail size={11} className="shrink-0" color={T.iconColors.body} />
            {personalInfo.email}
          </a>
        )}

        {personalInfo.address && (
          <span className="flex items-center gap-1 break-words">
            <MapPin size={11} className="shrink-0" color={T.iconColors.body} />
            {personalInfo.address}
          </span>
        )}

        {personalInfo.linkedIn && (
          <a
            href={personalInfo.linkedIn}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:underline break-all"
          >
            <FaLinkedin
              size={11}
              className="shrink-0"
              color={T.iconColors.body}
            />
            LinkedIn
          </a>
        )}

        {personalInfo.github && (
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:underline break-all"
          >
            <FaGithub
              size={11}
              className="shrink-0"
              color={T.iconColors.body}
            />
            GitHub
          </a>
        )}

        {personalInfo.portfolio && (
          <a
            href={personalInfo.portfolio}
            target="_blank"
            rel="noreferrer"
            className="hover:underline break-all"
          >
            {personalInfo.portfolio.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>

      {/* Divider under header block */}
      <div className={`${T.divider.header} w-full`} />
    </header>
  );
}
