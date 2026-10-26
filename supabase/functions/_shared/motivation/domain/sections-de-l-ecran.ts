import type { Badge } from "./badges.ts";
import type { EtatDeLaCabane } from "./cabane.ts";
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
  { pastilles, cabane, badges }: {
    pastilles: readonly PastilleDeRecord[];
    cabane: EtatDeLaCabane | undefined;
    badges?: readonly Badge[];
  },
): SectionDeLEcran[] {
  const disponibles: SectionDeLEcran[] = [];
  if (cabane !== undefined) disponibles.push("cabane");
  if (badges !== undefined) disponibles.push("badges");
  if (pastilles.length > 0) disponibles.push("recordsDeFluence");
  return sectionsAAfficher(disponibles);
}
