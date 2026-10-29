import type { Badge } from "./badges.ts";
import type { EtatDeLaCabane } from "./cabane.ts";
import type { EtatDeLHistoire } from "./histoire.ts";
import { calculs } from "./paroles-de-fluence.ts";
import { parolesDeLaSectionDesBadges, phraseSansBadge, titreDeLaSectionDesBadges } from "./paroles-des-badges.ts";
import { parolesDeLaSectionDeLHistoire } from "./paroles-de-l-histoire.ts";
import { phraseDeLEtat, titreDeLaSection } from "./paroles-de-la-cabane.ts";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import { phraseDeLEtatDesTenues, titreDeLaSectionDesTenues } from "./paroles-des-tenues.ts";
import type { PersonnageGuide } from "./personnage-guide.ts";
import { sectionsDeLEcran } from "./sections-de-l-ecran.ts";
import type { EtatDesTenues } from "./tenues.ts";

export const NOM_DE_L_ECRAN_DES_MEDAILLES = "Mes médailles";
export const TITRE_DES_RECORDS_DE_CALCUL_RAPIDE = "Mes records de calcul rapide";

type ContenuDeLEcran = {
  pastilles: readonly PastilleDeRecord[];
  cabane: EtatDeLaCabane | undefined;
  histoire?: EtatDeLHistoire;
  badges?: readonly Badge[];
  tenues?: EtatDesTenues;
  personnage?: PersonnageGuide;
};

export function parolesDeLaSectionDesBadgesOuSansBadge(badges: readonly Badge[]): string[] {
  return badges.length > 0 ? parolesDeLaSectionDesBadges(badges) : [titreDeLaSectionDesBadges(), phraseSansBadge()];
}

function aQuelqueChoseAMontrer({ cabane, pastilles, histoire, badges }: ContenuDeLEcran): boolean {
  return pastilles.length > 0 || (cabane?.objetsRecus.length ?? 0) > 0 || (histoire?.nombreDEpisodesOuverts ?? 0) > 0 ||
    (badges?.length ?? 0) > 0;
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
  { toutLire, pastilles, cabane, histoire, badges, tenues, personnage }: { toutLire: boolean } & ContenuDeLEcran,
): string[] {
  const guide = parolesDuGuideALOuverture({ pastilles, cabane, histoire, badges });
  if (!toutLire) return [guide];
  const sections = sectionsDeLEcran({ pastilles, cabane, histoire, badges });
  const cabaneLue = cabane !== undefined ? [titreDeLaSection(), phraseDeLEtat(cabane)] : [];
  const tenuesLues = tenues !== undefined && personnage !== undefined
    ? [titreDeLaSectionDesTenues(personnage), phraseDeLEtatDesTenues(personnage, tenues)]
    : [];
  const histoireLue = sections.includes("histoire") ? parolesDeLaSectionDeLHistoire() : [];
  const badgesLus = badges !== undefined ? parolesDeLaSectionDesBadgesOuSansBadge(badges) : [];
  const recordsLus = sections.includes("recordsDeFluence") ? parolesDeLaSectionDesRecords(pastilles) : [];
  return [
    guide,
    NOM_DE_L_ECRAN_DES_MEDAILLES,
    ...cabaneLue,
    ...tenuesLues,
    ...histoireLue,
    ...badgesLus,
    ...recordsLus,
  ];
}
