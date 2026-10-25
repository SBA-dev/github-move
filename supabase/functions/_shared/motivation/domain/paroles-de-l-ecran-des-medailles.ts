import type { EtatDeLaCabane } from "./cabane.ts";
import { calculs } from "./paroles-de-fluence.ts";
import { phraseDeLEtat, titreDeLaSection } from "./paroles-de-la-cabane.ts";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import { sectionsDeLEcran } from "./sections-de-l-ecran.ts";

export const NOM_DE_L_ECRAN_DES_MEDAILLES = "Mes médailles";
export const TITRE_DES_RECORDS_DE_CALCUL_RAPIDE = "Mes records de calcul rapide";

type ContenuDeLEcran = {
  pastilles: readonly PastilleDeRecord[];
  cabane: EtatDeLaCabane | undefined;
};

function aQuelqueChoseAMontrer({ cabane, pastilles }: ContenuDeLEcran): boolean {
  return pastilles.length > 0 || (cabane?.objetsRecus.length ?? 0) > 0;
}

export function parolesDuGuideALOuverture(contenu: ContenuDeLEcran): string {
  return aQuelqueChoseAMontrer(contenu)
    ? "Regarde tout ce que tu as gagné !"
    : "Gagne des étoiles pour remplir la cabane !";
}

export function phraseLueDeLaPastille(pastille: PastilleDeRecord): string {
  return `${pastille.libelle} : ton record est de ${calculs(pastille.meilleurScore)}`;
}

export function parolesDeLaSectionDesRecords(pastilles: readonly PastilleDeRecord[]): string[] {
  return [TITRE_DES_RECORDS_DE_CALCUL_RAPIDE, ...pastilles.map(phraseLueDeLaPastille)];
}

export function parolesALOuverture(
  { toutLire, pastilles, cabane }: { toutLire: boolean } & ContenuDeLEcran,
): string[] {
  const guide = parolesDuGuideALOuverture({ pastilles, cabane });
  if (!toutLire || !aQuelqueChoseAMontrer({ pastilles, cabane })) return [guide];
  const sections = sectionsDeLEcran({ pastilles, cabane });
  const cabaneLue = cabane !== undefined && sections.includes("cabane")
    ? [titreDeLaSection(), phraseDeLEtat(cabane)]
    : [];
  const recordsLus = sections.includes("recordsDeFluence") ? parolesDeLaSectionDesRecords(pastilles) : [];
  return [guide, NOM_DE_L_ECRAN_DES_MEDAILLES, ...cabaneLue, ...recordsLus];
}
