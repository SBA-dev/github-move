import type { Lecon, Niveau, SectionDuProgramme } from "../../catalogue/domain/index.ts";
import type { LeconId, NombreDEtoiles } from "../../apprentissage/domain/index.ts";
import type { ProfilEnfantId } from "../../famille/domain/index.ts";

export type ProfilSuivi = Readonly<{
  id: ProfilEnfantId;
  prenom: string;
  niveau: Niveau;
}>;

export type SeanceLue = Readonly<{
  lecon: LeconId;
  termineeLe: Date;
  erreurs: number;
  etoiles?: NombreDEtoiles;
}>;

export type MeilleuresEtoilesLues = Readonly<{
  lecon: LeconId;
  etoiles: NombreDEtoiles;
}>;

export type EntreesDuSuivi = Readonly<{
  enfant: ProfilSuivi;
  lecons: readonly Lecon[];
  sections: readonly SectionDuProgramme[];
  meilleuresEtoiles: readonly MeilleuresEtoilesLues[];
  leconsReussiesAuTestDeDepart: readonly LeconId[];
  testDeDepartFaitLe?: Date;
  seances: readonly SeanceLue[];
  nombreDeSeancesDeRevision: number;
  erreursCorrigeesPourDeBon: number;
}>;
