import type { Matiere } from "./matiere.ts";
import type { Niveau } from "./niveau.ts";
import type { TypeDExercice } from "./type-d-exercice.ts";

export type EtapeDeLecon = {
  readonly texte: string;
  readonly exemples: ReadonlyArray<string>;
};

export type Exercice = {
  readonly type: TypeDExercice;
  readonly titre?: string;
  readonly consigne?: string;
  readonly contenu: Readonly<Record<string, unknown>>;
};

export type ProgrammeCite = {
  readonly section: string;
  readonly citation: string;
};

export type PassageDuGuideFondamental = {
  readonly titre: string;
  readonly page: number;
  readonly extrait: string;
};

export type Lecon = {
  readonly id: string;
  readonly titre: string;
  readonly matiere: Matiere;
  readonly niveau: Niveau;
  readonly ordre: number;
  readonly etapes: ReadonlyArray<EtapeDeLecon>;
  readonly exercices: ReadonlyArray<Exercice>;
  readonly programme: ProgrammeCite;
  readonly guide?: PassageDuGuideFondamental;
};
