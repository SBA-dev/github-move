import { LeconMalFormee } from "../erreurs.ts";
import { NOMBRE_MAXIMAL_D_ETIQUETTES } from "./nombre-maximal-d-etiquettes.ts";
import { liste, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";

const NOMBRE_MINIMAL_DE_VERS = 2;

export type ExerciceMemoriser = Readonly<{
  type: "memoriser";
  titre?: string;
  consigne?: string;
  auteur?: string;
  vers: readonly string[];
}>;

export function lireMemoriser(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceMemoriser {
  const vers = liste(brut.vers, "les vers").map((unVers) => texteRequis(unVers, "un vers"));
  if (vers.length < NOMBRE_MINIMAL_DE_VERS) throw new LeconMalFormee("l'exercice n'a pas assez de vers");
  if (vers.length > NOMBRE_MAXIMAL_D_ETIQUETTES) {
    throw new LeconMalFormee(`l'exercice a plus de ${NOMBRE_MAXIMAL_D_ETIQUETTES} vers à mémoriser`);
  }
  return Object.freeze({
    type: "memoriser",
    ...communs,
    auteur: texteFacultatif(brut.auteur, "l'auteur d'un exercice"),
    vers: Object.freeze(vers),
  });
}
