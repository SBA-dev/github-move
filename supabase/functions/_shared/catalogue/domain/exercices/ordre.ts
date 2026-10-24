import { LeconMalFormee } from "../erreurs.ts";
import { liste, type Objet, texteRequis } from "../lecture.ts";

const CONSIGNE_PAR_DEFAUT = "Remets les étiquettes dans le bon ordre.";
const NOMBRE_MINIMAL_D_ELEMENTS = 2;

export type ExerciceOrdre = Readonly<{
  type: "ordre";
  titre?: string;
  consigne: string;
  elements: readonly string[];
}>;

export function lireOrdre(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceOrdre {
  const elements = liste(brut.elements, "les éléments").map((element) => texteRequis(element, "un élément"));
  if (elements.length < NOMBRE_MINIMAL_D_ELEMENTS) throw new LeconMalFormee("l'exercice n'a pas assez d'éléments");
  return Object.freeze({
    type: "ordre",
    titre: communs.titre,
    consigne: communs.consigne ?? CONSIGNE_PAR_DEFAUT,
    elements: Object.freeze(elements),
  });
}
