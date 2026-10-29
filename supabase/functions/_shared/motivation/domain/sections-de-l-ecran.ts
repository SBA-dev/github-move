import type { Badge } from "./badges.ts";
import type { EtatDeLaCabane } from "./cabane.ts";
import type { EtatDeLHistoire } from "./histoire.ts";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import type { EtatDesTenues } from "./tenues.ts";

export type SectionDeLEcran =
  | "cabane"
  | "tenues"
  | "histoire"
  | "badges"
  | "recordsDeFluence";

const ORDRE_DES_SECTIONS: readonly SectionDeLEcran[] = [
  "cabane",
  "tenues",
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
  { pastilles, cabane, tenues, histoire, badges }: {
    pastilles: readonly PastilleDeRecord[];
    cabane: EtatDeLaCabane | undefined;
    tenues?: EtatDesTenues;
    histoire?: EtatDeLHistoire;
    badges?: readonly Badge[];
  },
): SectionDeLEcran[] {
  const disponibles: SectionDeLEcran[] = [];
  if (cabane !== undefined) disponibles.push("cabane");
  if (tenues !== undefined && tenues.tenuesRecues.length > 0) disponibles.push("tenues");
  if (histoire !== undefined) disponibles.push("histoire");
  if (badges !== undefined) disponibles.push("badges");
  if (pastilles.length > 0) disponibles.push("recordsDeFluence");
  return sectionsAAfficher(disponibles);
}
