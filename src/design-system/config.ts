/**
 * App config — theme names สำหรับ next-themes
 * สี / font / radius ตั้งที่ src/app/globals.css (HeroUI CSS variables)
 */
export const designSystem = {
  /** Theme keys supported by next-themes + HeroUI CSS variables */
  themes: ["light", "dark", "system"] as const,
  defaultTheme: "system" as const,
} as const;

export type AppTheme = (typeof designSystem.themes)[number];

/** Semantic layout widths — use with Tailwind or ds-* classes */
export const layout = {
  contentMaxWidth: "max-w-6xl",
  sidebarWidth: "16rem",
} as const;

/** Shared spacing scale reference (maps to HeroUI --spacing: 0.25rem) */
export const spacing = {
  page: "py-10",
  section: "space-y-8",
  stack: "space-y-4",
  inline: "gap-3",
} as const;
