import { calculs } from "./paroles-de-fluence.ts";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import type { SectionDeLEcran } from "./sections-de-l-ecran.ts";

export const NOM_DE_L_ECRAN_DES_MEDAILLES = "Mes médailles";

export function parolesDuGuideALOuverture(sections: readonly SectionDeLEcran[]): string {
  return sections.length > 0
    ? "Regarde tout ce que tu as gagné !"
    : "Fais un calcul rapide pour gagner ton premier record !";
}

export function phraseLueDeLaPastille(pastille: PastilleDeRecord): string {
  return `${pastille.libelle} : ton record est de ${calculs(pastille.meilleurScore)}`;
}
