import { ClavierDesDicteesInconnu } from "./erreurs.ts";

const CLAVIERS = ["automatique", "lettresDuMot", "clavierComplet"] as const;

export type ValeurDuClavierDesDictees = typeof CLAVIERS[number];

export class ClavierDesDictees {
  private constructor(readonly valeur: ValeurDuClavierDesDictees) {}

  static automatique(): ClavierDesDictees {
    return new ClavierDesDictees("automatique");
  }

  static de(brut: string): ClavierDesDictees {
    const valeur = CLAVIERS.find((clavier) => clavier === brut);
    if (valeur === undefined) throw new ClavierDesDicteesInconnu(brut);
    return new ClavierDesDictees(valeur);
  }
}
