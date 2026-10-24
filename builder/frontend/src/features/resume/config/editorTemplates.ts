import type { ResumeTemplate } from "../types/resume.types";
import {
  templates,
  type Domain,
  type ExperienceLevel,
} from "./templates";

/**
 * One entry per real template layout, for pickers inside the resume editor.
 *
 * `templates` (the gallery list) has several sample variants per layout
 * (e.g. "LaTeX ATS backend exp", "LaTeX ATS data science exp"), all sharing the
 * same `id`. Choosing any of them switches to the same layout, so the editor
 * only needs the layout once. Only layouts that have a real screenshot in
 * `templates` appear here.
 */
export interface EditorTemplate {
  id: ResumeTemplate;
  name: string;
  description: string;
  ats: string;
  image: string;
  featured: boolean;
  experienceLevel: ExperienceLevel[];
  domain: Domain[];
}

export const editorTemplates: EditorTemplate[] = (() => {
  const byId = new Map<ResumeTemplate, EditorTemplate>();

  for (const t of templates) {
    const existing = byId.get(t.id);

    if (!existing) {
      // The first entry for an id is the base layout (its name has no variant suffix).
      byId.set(t.id, {
        id: t.id,
        name: t.name,
        description: t.description,
        ats: t.ats,
        image: t.image,
        featured: !!t.featured,
        experienceLevel: [...t.experienceLevel],
        domain: [...t.domain],
      });
      continue;
    }

    existing.featured = existing.featured || !!t.featured;
    for (const level of t.experienceLevel) {
      if (!existing.experienceLevel.includes(level)) existing.experienceLevel.push(level);
    }
    for (const domain of t.domain) {
      if (!existing.domain.includes(domain)) existing.domain.push(domain);
    }
  }

  return [...byId.values()];
})();

const DOMAIN_LABELS: Record<Domain, string> = {
  "full-stack": "Full Stack",
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI / ML",
  "data-science": "Data Science",
  cloud: "Cloud / DevOps",
};

/** "Freshers & experienced · Full Stack, Backend", shown as "Best for" on the card. */
export function describeBestFor(template: EditorTemplate): string {
  const levels = template.experienceLevel;
  const who =
    levels.includes("fresher") && levels.includes("experienced")
      ? "Freshers & experienced"
      : levels.includes("fresher")
        ? "Freshers"
        : "Experienced";

  // Many domains means the layout isn't tied to one role.
  const roles =
    template.domain.length > 2
      ? "Most tech roles"
      : template.domain.map((d) => DOMAIN_LABELS[d]).join(", ");

  return roles ? `${who} · ${roles}` : who;
}
