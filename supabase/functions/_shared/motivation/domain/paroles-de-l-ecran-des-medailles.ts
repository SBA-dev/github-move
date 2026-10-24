import { calculs } from "./paroles-de-fluence.ts";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import { type SectionDeLEcran, sectionsDeLEcran } from "./sections-de-l-ecran.ts";

export const NOM_DE_L_ECRAN_DES_MEDAILLES = "Mes médailles";
export const TITRE_DES_RECORDS_DE_CALCUL_RAPIDE = "Mes records de calcul rapide";

export function parolesDuGuideALOuverture(sections: readonly SectionDeLEcran[]): string {
  return sections.length > 0
    ? "Regarde tout ce que tu as gagné !"
    : "Fais un calcul rapide pour gagner ton premier record !";
}

export function phraseLueDeLaPastille(pastille: PastilleDeRecord): string {
  return `${pastille.libelle} : ton record est de ${calculs(pastille.meilleurScore)}`;
}

export function parolesDeLaSectionDesRecords(pastilles: readonly PastilleDeRecord[]): string[] {
  return [TITRE_DES_RECORDS_DE_CALCUL_RAPIDE, ...pastilles.map(phraseLueDeLaPastille)];
}

export function parolesALOuverture(
  { toutLire, pastilles }: { toutLire: boolean; pastilles: readonly PastilleDeRecord[] },
): string[] {
  const sections = sectionsDeLEcran(pastilles);
  const guide = parolesDuGuideALOuverture(sections);
  if (!toutLire) return [guide];
  const recordsLus = sections.includes("recordsDeFluence") ? parolesDeLaSectionDesRecords(pastilles) : [];
  return [guide, NOM_DE_L_ECRAN_DES_MEDAILLES, ...recordsLus];
}
