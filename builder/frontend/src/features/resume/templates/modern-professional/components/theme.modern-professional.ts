// //     badge:
// //       "px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium",

export const ModernProfessionalTheme = {
  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  page: {
    container:
      "w-full h-full bg-white text-slate-900 font-['Inter']",
  },

  /*
   * ============================================================
   * COLORS
   * ============================================================
   */

  colors: {
    heading: "text-slate-900",
    body: "text-slate-700",
    muted: "text-slate-500",
    light: "text-slate-400",

    accent: "text-blue-600",
    link: "text-blue-700",

    border: "border-slate-200",
  },

  /*
   * ============================================================
   * FONT FAMILY
   * ============================================================
   */

  fontFamily: {
    heading: "font-['Poppins']",
    body: "font-['Inter']",
  },

  /*
   * ============================================================
   * FONT SIZE
   *
   * IMPORTANT:
   * Optimized for ONE A4 PAGE.
   * ============================================================
   */

  fontSize: {
    name: "text-[27px]",

    role: "text-[12px]",

    contact: "text-[8.5px]",

    sectionTitle: "text-[10.5px]",

    itemTitle: "text-[9.5px]",

    itemSubtitle: "text-[8.5px]",

    body: "text-[8.5px]",

    small: "text-[8px]",

    date: "text-[8px]",

    location: "text-[8px]",
  },

  /*
   * ============================================================
   * FONT WEIGHT
   * ============================================================
   */

  fontWeight: {
    bold: "font-bold",
    semibold: "font-semibold",
    medium: "font-medium",
    normal: "font-normal",
  },

  /*
   * ============================================================
   * LINE HEIGHT
   * ============================================================
   */

  lineHeight: {
    heading: "leading-tight",

    title: "leading-[1.25]",

    body: "leading-[1.35]",
  },

  /*
   * ============================================================
   * SPACING
   *
   * Compact for A4.
   * ============================================================
   */

  spacing: {
    page: "space-y-4",

    section: "mt-3",

    item: "mt-3",

    itemHeader: "mt-1",

    paragraph: "mt-1",

    bullet: "space-y-0.5",
  },

  /*
   * ============================================================
   * BORDERS
   * ============================================================
   */

  border: {
    primary: "border-slate-200",

    dark: "border-slate-300",
  },

  /*
   * ============================================================
   * DIVIDERS
   * ============================================================
   */

  divider: {
    header:
      "border-b border-slate-300 pb-3",

    section:
      "border-b border-slate-200 mt-1",
  },

  /*
   * ============================================================
   * LAYOUT
   * ============================================================
   */

  layout: {
    between:
      "flex justify-between items-start",

    center:
      "flex justify-center items-center",

    wrapCenter:
      "flex flex-wrap items-center gap-2",

    column:
      "flex flex-col",

    twoColumn:
      "grid grid-cols-12 gap-5",

    left:
      "col-span-8",

    right:
      "col-span-4",
  },

  /*
   * ============================================================
   * LIST
   * ============================================================
   */

  list: {
    bullet:
      "list-disc ml-4 space-y-0.5",
  },

  /*
   * ============================================================
   * LINKS
   * ============================================================
   */

  links: {
    default:
      "text-blue-700 hover:underline",
  },

  /*
   * ============================================================
   * SKILLS
   * ============================================================
   */

  skills: {
    container:
      "flex flex-wrap gap-1",

    badge:
      "px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[8px] font-medium",
  },

  /*
   * ============================================================
   * EXPERIENCE
   * ============================================================
   */

  experience: {
    container:
      "space-y-3",
  },

  /*
   * ============================================================
   * EDUCATION
   * ============================================================
   */

  education: {
    container:
      "space-y-3",
  },

  /*
   * ============================================================
   * PROJECT
   * ============================================================
   */

  project: {
    container:
      "space-y-3",

    header:
      "flex justify-between items-start gap-2",

    tech:
      "text-[8px] italic text-slate-500 mt-0.5",

    links:
      "flex gap-2 mt-1",
  },

  /*
   * ============================================================
   * INLINE LIST
   * ============================================================
   */

  inlineList: {
    row:
      "flex flex-wrap items-center gap-1.5",

    item:
      "text-[8px]",

    separator:
      "text-slate-400",
  },

  /*
   * ============================================================
   * TWO COLUMN
   * ============================================================
   */

  twoColumn: {
    grid:
      "grid grid-cols-2 gap-3",

    item:
      "text-[8px]",
  },

  /*
   * ============================================================
   * KEY VALUE LIST
   * ============================================================
   */

  keyValueList: {
    row:
      "flex flex-wrap items-center gap-1.5 text-[8px]",

    label:
      "font-semibold",

    separator:
      "text-slate-400",
  },

  /*
   * ============================================================
   * ICON COLORS
   * ============================================================
   */

  iconColors: {
    body: "#0f172a",

    light: "#64748b",

    link: "#2563eb",
  },

  /*
   * ============================================================
   * CONTENT
   * ============================================================
   */

  content: {
    indent: "pl-3",

    noIndent: "pl-0",
  },

  /*
   * ============================================================
   * SECTION HEADER
   * ============================================================
   */

  sectionHeader: {
    badge:
      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white",

    badgeIconSize: 10,

    title:
      "font-['Poppins'] text-[10px] font-bold uppercase tracking-[0.04em] text-slate-900",
  },
} as const;

export type ModernProfessionalThemeType =
  typeof ModernProfessionalTheme;