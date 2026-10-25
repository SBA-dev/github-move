import type { Matiere, Niveau, SectionDuProgramme } from "../../catalogue/domain/index.ts";
import { AucuneSectionDuProgramme } from "./erreurs.ts";
import type { FormeDuTexte } from "./forme-du-texte.ts";
import type { TexteDuParent } from "./texte-du-parent.ts";
import { normaliser } from "./texte-normalise.ts";

const LONGUEUR_MINIMALE_D_UN_MOT_DU_TEXTE = 4;
const BONUS_DE_LA_SECTION_DE_LA_FORME = 8;

const MOTS_INDICES_PAR_FORME: Record<FormeDuTexte, string[]> = {
  listeDeMots: ["dictee", "encoder", "orthographe", "mots"],
  poesie: ["poeme", "poesie", "dire", "memorise", "oraliser"],
  listeDeVerbes: ["verbe", "conjug", "groupe", "terminaison", "radical", "infinitif"],
  texteDocumentaire: ["comprendre", "texte", "lire"],
  texteSurUnMetier: ["service", "public", "metiers", "pompiers", "police"],
};

const INTITULE_DE_LA_SECTION_PAR_FORME: Partial<Record<FormeDuTexte, RegExp>> = {
  listeDeMots: /dictee/,
  poesie: /dire pour etre compris|poesie/,
  listeDeVerbes: /orthographe grammaticale/,
};

export function sectionRetenue(
  texte: TexteDuParent,
  forme: FormeDuTexte,
  niveau: Niveau,
  matiere: Matiere,
  sections: SectionDuProgramme[],
): SectionDuProgramme {
  const mots = motsDeLaRecherche(texte, forme);
  const candidates = sections.filter(
    (section) => section.matiere.code === matiere.code && section.niveaux.includes(niveau.valeur),
  );
  if (candidates.length === 0) throw new AucuneSectionDuProgramme();
  return candidates.reduce((meilleure, section) =>
    score(section, mots, forme) > score(meilleure, mots, forme) ? section : meilleure
  );
}

function motsDeLaRecherche(texte: TexteDuParent, forme: FormeDuTexte): Set<string> {
  const motsDuTexte = texte.normalise().split(/[^a-z0-9]+/).filter(
    (mot) => mot.length >= LONGUEUR_MINIMALE_D_UN_MOT_DU_TEXTE,
  );
  return new Set([...motsDuTexte, ...MOTS_INDICES_PAR_FORME[forme]]);
}

function score(section: SectionDuProgramme, mots: Set<string>, forme: FormeDuTexte): number {
  const contenu = normaliser(`${section.section} ${section.domaine} ${section.extrait}`);
  const motsCommuns = [...mots].filter((mot) => contenu.includes(mot)).length;
  const intitule = INTITULE_DE_LA_SECTION_PAR_FORME[forme];
  const bonus = intitule?.test(normaliser(section.section)) ? BONUS_DE_LA_SECTION_DE_LA_FORME : 0;
  return motsCommuns + bonus;
}
