import { LeconMalFormee } from "../erreurs.ts";
import { enObjet, liste, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";
import { type ChoixEtReponse, lireChoixEtReponse } from "./question-a-choix.ts";

const LANGUE_PAR_DEFAUT = "en-GB";

export type ItemDEcoute = Readonly<
  ChoixEtReponse & {
    dire: string;
    question?: string;
    aide?: string;
  }
>;

export type ExerciceEcoute = Readonly<{
  type: "ecoute";
  titre?: string;
  consigne?: string;
  langue: string;
  items: readonly ItemDEcoute[];
}>;

export function lireEcoute(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceEcoute {
  const items = liste(brut.items, "les items").map(lireItemDEcoute);
  if (items.length === 0) throw new LeconMalFormee("l'exercice n'a aucun item à écouter");
  return Object.freeze({
    type: "ecoute",
    ...communs,
    langue: texteFacultatif(brut.langue, "la langue d'un exercice") ?? LANGUE_PAR_DEFAUT,
    items: Object.freeze(items),
  });
}

function lireItemDEcoute(brut: unknown): ItemDEcoute {
  const item = enObjet(brut, "un item d'écoute");
  return Object.freeze({
    dire: texteRequis(item.dire, "le mot à écouter"),
    question: texteFacultatif(item.question, "la question d'un item d'écoute"),
    ...lireChoixEtReponse(item),
    aide: texteFacultatif(item.aide, "l'aide d'un item d'écoute"),
  });
}
