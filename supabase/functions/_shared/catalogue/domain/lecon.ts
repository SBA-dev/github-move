import type { Exercice } from "./exercice.ts";
import type { Matiere } from "./matiere.ts";

export const NIVEAUX = ["CP", "CE1", "CE2", "CM1", "CM2"] as const;

export type NiveauDeLecon = typeof NIVEAUX[number];

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
  niveau: NiveauDeLecon;
  titre: string;
  ordre: number;
  programme: ProgrammeCite;
  etapes: readonly EtapeDeLecon[];
  exercices: readonly Exercice[];
  competence?: string;
  guide?: PassageDuGuideFondamental;
}>;
