import { LeconMalFormee, SectionDuProgrammeMalFormee } from "./erreurs.ts";
import { enObjet, listeDeTextes, texteRequis } from "./lecture.ts";

export type SectionDuProgramme = Readonly<{
  id: string;
  source: Readonly<{ texte: string; bo: string }>;
  matiere: string;
  domaine: string;
  section: string;
  niveaux: readonly string[];
}>;

export function lireSectionDuProgramme(brut: unknown): SectionDuProgramme {
  try {
    return lire(brut);
  } catch (erreur) {
    if (erreur instanceof LeconMalFormee) throw new SectionDuProgrammeMalFormee(erreur.raison);
    throw erreur;
  }
}

function lire(brut: unknown): SectionDuProgramme {
  const section = enObjet(brut, "une section du programme");
  const source = enObjet(section.source, "la source d'une section");
  return Object.freeze({
    id: texteRequis(section.id, "l'identifiant d'une section"),
    source: Object.freeze({
      texte: texteRequis(source.texte, "le texte de la source"),
      bo: texteRequis(source.bo, "le bulletin officiel de la source"),
    }),
    matiere: texteRequis(section.matiere, "la matière d'une section"),
    domaine: texteRequis(section.domaine, "le domaine d'une section"),
    section: texteRequis(section.section, "l'intitulé d'une section"),
    niveaux: listeDeTextes(section.niveaux, "les niveaux d'une section"),
  });
}
