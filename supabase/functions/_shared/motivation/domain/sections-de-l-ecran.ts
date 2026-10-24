import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";

export type SectionDeLEcran =
  | "cabane"
  | "histoire"
  | "badges"
  | "recordsDeFluence";

const ORDRE_DES_SECTIONS: readonly SectionDeLEcran[] = [
  "cabane",
  "histoire",
  "badges",
  "recordsDeFluence",
];

export function sectionsAAfficher(
  disponibles: readonly SectionDeLEcran[],
): SectionDeLEcran[] {
  return ORDRE_DES_SECTIONS.filter((section) => disponibles.includes(section));
}

export function sectionsDeLEcran(
  pastilles: readonly PastilleDeRecord[],
): SectionDeLEcran[] {
  return sectionsAAfficher(pastilles.length > 0 ? ["recordsDeFluence"] : []);
}
