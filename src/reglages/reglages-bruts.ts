import { Reglages, type ReglagesBruts } from "@domain/famille";

/** Les cinq réglages tels que le front les échange avec le serveur et les garde sur l'appareil. */
export type ReglagesComplets = Required<ReglagesBruts>;

export function enReglagesComplets(reglages: Reglages): ReglagesComplets {
  return {
    modeDys: reglages.modeDys,
    toutLireAVoixHaute: reglages.toutLireAVoixHaute,
    parcoursLibre: reglages.parcoursLibre,
    clavierDesDictees: reglages.clavierDesDictees.valeur,
    langueDuParent: reglages.langueDuParent.valeur,
  };
}

function sontDesBooleensOuAbsents(valeurs: readonly unknown[]): boolean {
  return valeurs.every((valeur) => valeur === undefined || typeof valeur === "boolean");
}

function sontDesTextesOuAbsents(valeurs: readonly unknown[]): boolean {
  return valeurs.every((valeur) => valeur === undefined || typeof valeur === "string");
}

/** Des réglages partiels bien formés : les valeurs inconnues du domaine sont refusées. */
export function estUnReglagesBruts(valeur: unknown): valeur is ReglagesBruts {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { modeDys, toutLireAVoixHaute, parcoursLibre, clavierDesDictees, langueDuParent } = valeur as Record<
    string,
    unknown
  >;
  if (!sontDesBooleensOuAbsents([modeDys, toutLireAVoixHaute, parcoursLibre])) return false;
  if (!sontDesTextesOuAbsents([clavierDesDictees, langueDuParent])) return false;
  try {
    Reglages.depuis(valeur as ReglagesBruts);
    return true;
  } catch {
    return false;
  }
}
