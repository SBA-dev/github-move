import { type Lecon, LeconMalFormee, lireLecon, type SectionDuProgramme } from "../../catalogue/domain/index.ts";
import { LeconPersonnelleInvalide } from "./erreurs.ts";
import { leconEnBrut } from "./lecon-en-brut.ts";
import { estUnMotDictable } from "./mot-dictable.ts";
import type { LeconPreparee } from "./preparer-une-lecon-personnelle.ts";

export function validerLaLeconPersonnelle(
  preparee: LeconPreparee,
  id: string,
  sections: SectionDuProgramme[],
): Lecon {
  const lecon = lireLaLecon(preparee, id);
  verifierLaSection(lecon, sections);
  verifierLesMotsDictes(lecon);
  if (lecon.exercices.length === 0) throw new LeconPersonnelleInvalide("la leçon n'a aucun exercice");
  return lecon;
}

function lireLaLecon(preparee: LeconPreparee, id: string): Lecon {
  try {
    return lireLecon(leconEnBrut(preparee.lecon, id));
  } catch (erreur) {
    if (erreur instanceof LeconMalFormee) throw new LeconPersonnelleInvalide(erreur.raison);
    throw erreur;
  }
}

function verifierLaSection(lecon: Lecon, sections: SectionDuProgramme[]): void {
  const section = sections.find((candidate) => candidate.id === lecon.programme.section);
  if (!section) throw new LeconPersonnelleInvalide("la section du programme n'existe pas");
  if (section.matiere.code !== lecon.matiere.code) {
    throw new LeconPersonnelleInvalide("la section n'est pas de la matière de la leçon");
  }
  if (!section.niveaux.includes(lecon.niveau.valeur)) {
    throw new LeconPersonnelleInvalide("la section ne couvre pas le niveau de la leçon");
  }
  if (!sansEspacesEnTrop(section.extrait).includes(sansEspacesEnTrop(lecon.programme.citation))) {
    throw new LeconPersonnelleInvalide("la citation n'est pas mot pour mot dans l'extrait de la section");
  }
}

function sansEspacesEnTrop(texte: string): string {
  return texte.replace(/\s+/g, " ").trim();
}

function verifierLesMotsDictes(lecon: Lecon): void {
  for (const exercice of lecon.exercices) {
    if (exercice.type !== "dictee") continue;
    const impossible = exercice.mots.find(({ mot }) => !estUnMotDictable(mot));
    if (impossible) throw new LeconPersonnelleInvalide(`le mot « ${impossible.mot} » ne peut pas être dicté`);
  }
}
