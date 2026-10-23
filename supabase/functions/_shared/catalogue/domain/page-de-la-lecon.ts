import type { Lecon } from "./lecon.ts";
import type { SectionDuProgramme } from "./lire-section-du-programme.ts";
import { libelleDuType } from "./type-d-exercice.ts";

export type ExercicePropose = Readonly<{ position: number; libelle: string; intitule: string }>;

export type PassageDuGuideAffiche = Readonly<{ extrait: string; reference: string }>;

export type PassagePourLesAdultes = Readonly<{
  citation: string;
  source?: string;
  guide?: PassageDuGuideAffiche;
}>;

export type PageDeLaLecon = Readonly<{
  titre: string;
  niveauEtMatiere: string;
  exercicesProposes: readonly ExercicePropose[];
  passagePourLesAdultes: PassagePourLesAdultes;
}>;

export function pageDeLaLecon(lecon: Lecon, section?: SectionDuProgramme): PageDeLaLecon {
  return Object.freeze({
    titre: lecon.titre,
    niveauEtMatiere: `${lecon.niveau.valeur} · ${lecon.matiere.libelle}`,
    exercicesProposes: Object.freeze(lecon.exercices.map((exercice, position) => {
      const libelle = libelleDuType(exercice.type);
      return Object.freeze({ position, libelle, intitule: exercice.titre ?? libelle });
    })),
    passagePourLesAdultes: Object.freeze({
      citation: lecon.programme.citation,
      source: section && sourceDeLaSection(section),
      guide: lecon.guide && Object.freeze({
        extrait: lecon.guide.extrait,
        reference: `Guide fondamental « ${lecon.guide.titre} » (Eduscol), page ${lecon.guide.page}.`,
      }),
    }),
  });
}

function sourceDeLaSection(section: SectionDuProgramme): string {
  const { texte, bo } = section.source;
  return `${texte}, ${bo} — ${section.domaine} › ${section.section} (${section.niveaux.join(", ")})`;
}
