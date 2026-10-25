import {
  type CodeDeMatiere,
  type Niveau,
  type SectionDuProgramme,
  toutesLesMatieres,
} from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import type { EntreesDuSuivi } from "./entrees-du-suivi.ts";
import { leconAcquise, leconTravailleeEnSeance } from "./etat-de-la-lecon.ts";

export type EtatDeLaSection = "acquise" | "enCours" | "aFaire" | "pasEncoreDeLecon";

export type LegendeDeLaCarte = Readonly<Record<EtatDeLaSection, number>>;

export type LigneDeLaCarte = Readonly<{
  section: string;
  intitule: string;
  etat: EtatDeLaSection;
  titresDesLecons: readonly string[];
}>;

export type DomaineDeLaCarte = Readonly<{ domaine: string; lignes: readonly LigneDeLaCarte[] }>;

export type MatiereDeLaCarte = Readonly<{ matiere: CodeDeMatiere; domaines: readonly DomaineDeLaCarte[] }>;

export type CarteDesCompetences = Readonly<{
  niveau: Niveau;
  matieres: readonly MatiereDeLaCarte[];
  legende: LegendeDeLaCarte;
}>;

export function carteDesCompetences(entrees: EntreesDuSuivi): CarteDesCompetences {
  const sections = entrees.sections.filter((section) => section.niveaux.includes(entrees.enfant.niveau.valeur));
  const matieres = toutesLesMatieres()
    .map(({ code }) => matiereDeLaCarte(entrees, code, sections.filter((section) => section.matiere === code)))
    .filter((matiere) => matiere.domaines.length > 0);
  return { niveau: entrees.enfant.niveau, matieres, legende: legendeDe(matieres) };
}

function matiereDeLaCarte(
  entrees: EntreesDuSuivi,
  matiere: CodeDeMatiere,
  sections: readonly SectionDuProgramme[],
): MatiereDeLaCarte {
  const domaines = [...new Set(sections.map((section) => section.domaine))].map((domaine) => ({
    domaine,
    lignes: sections.filter((section) => section.domaine === domaine).map((section) => ligneDe(entrees, section)),
  }));
  return { matiere, domaines };
}

function ligneDe(entrees: EntreesDuSuivi, section: SectionDuProgramme): LigneDeLaCarte {
  const lecons = entrees.lecons.filter((lecon) => lecon.programme.section === section.id);
  return {
    section: section.id,
    intitule: section.section,
    etat: etatDeLaSection(entrees, lecons),
    titresDesLecons: lecons.map((lecon) => lecon.titre),
  };
}

function etatDeLaSection(entrees: EntreesDuSuivi, lecons: readonly Lecon[]): EtatDeLaSection {
  if (lecons.length === 0) return "pasEncoreDeLecon";
  if (lecons.some((lecon) => leconAcquise(entrees, lecon.id))) return "acquise";
  if (lecons.some((lecon) => leconTravailleeEnSeance(entrees, lecon.id))) return "enCours";
  return "aFaire";
}

function legendeDe(matieres: readonly MatiereDeLaCarte[]): LegendeDeLaCarte {
  const legende = { acquise: 0, enCours: 0, aFaire: 0, pasEncoreDeLecon: 0 };
  for (const ligne of matieres.flatMap((m) => m.domaines.flatMap((d) => d.lignes))) legende[ligne.etat]++;
  return legende;
}
