import type { Exercice } from "./exercice.ts";
import type { Matiere } from "./matiere.ts";
import type { Niveau } from "./niveau.ts";

export type EtapeDeLecon = Readonly<{
  texte: string;
  exemples: readonly string[];
}>;

export type ProgrammeCite = Readonly<{ section: string; citation: string }>;

export type PassageDuGuideFondamental = Readonly<{
  titre: string;
  page: number;
  extrait: string;
}>;

export type Lecon = Readonly<{
  id: string;
  matiere: Matiere;
  niveau: Niveau;
  titre: string;
  ordre: number;
  programme: ProgrammeCite;
  etapes: readonly EtapeDeLecon[];
  exercices: readonly Exercice[];
  competence?: string;
  guide?: PassageDuGuideFondamental;
}>;
