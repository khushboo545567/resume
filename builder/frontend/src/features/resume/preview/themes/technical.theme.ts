import type { ResumeTheme } from "./theme.types";

export const technicalTheme: ResumeTheme = {
  id: "technical",

  page: {
    padding: "40px",
    fontFamily: "Inter",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  colors: {
    primary: "#0f172a",
    secondary: "#0f172a",
    text: "#334155",
    muted: "#64748b",
    headerBg: "transparent",
    headerText: "#0f172a",
  },

  header: {
    align: "center",
    nameSize: "30px",
    contactSize: "11px",
    showIcons: false,
    showTitle: true,
    divider: true,
    compact: false,
  },

  section: {
    uppercase: true,
    divider: true,
    spacing: "14px",
  },

  experience: {
    companyLeft: true,
    dateRight: true,
    roleItalic: true,
    bullets: true,
  },

  education: {
    dateRight: true,
  },

  projects: {
    dateRight: true,
    linksBelowDate: true,
    technologiesInline: true,
    bullets: true,
  },

  skills: {
    layout: "inline",
  },
};
