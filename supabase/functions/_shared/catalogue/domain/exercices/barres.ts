import { LeconMalFormee } from "../erreurs.ts";
import { enObjet, liste, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";

type Valeur = number | null;

export type FormeDeSchema = Readonly<{
  genre: "partiesEtTout";
  parties: readonly [Valeur, Valeur];
  tout: Valeur;
}>;

export type ProblemeEnBarres = Readonly<{
  enonce: string;
  aide?: string;
  phrase?: string;
  reponse: number;
  ecriture: string;
  forme: FormeDeSchema;
}>;

export type ExerciceBarres = Readonly<{
  type: "barres";
  titre?: string;
  consigne?: string;
  items: readonly ProblemeEnBarres[];
}>;

export function lireBarres(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceBarres {
  const items = liste(brut.items, "les items").map(lireProbleme);
  if (items.length === 0) throw new LeconMalFormee("l'exercice « barres » n'a aucune question à poser");
  return Object.freeze({ type: "barres", ...communs, items: Object.freeze(items) });
}

function lireProbleme(brut: unknown): ProblemeEnBarres {
  const item = enObjet(brut, "un problème en barres");
  const [premiere = null, seconde = null] = liste(item.parties, "les parties d'un problème en barres").map(
    lireValeur,
  );
  const parties: readonly [Valeur, Valeur] = Object.freeze([premiere, seconde]);
  const forme: FormeDeSchema = Object.freeze({
    genre: "partiesEtTout",
    parties,
    tout: lireValeur(item.tout),
  });
  return Object.freeze({
    enonce: texteRequis(item.enonce, "l'énoncé d'un problème en barres"),
    aide: texteFacultatif(item.aide, "l'aide d'un problème en barres"),
    phrase: texteFacultatif(item.phrase, "la phrase réponse d'un problème en barres"),
    forme,
    ...resoudre(forme),
  });
}

function lireValeur(valeur: unknown): Valeur {
  return valeur === null ? null : Number(valeur);
}

function resoudre({ parties: [premiere, seconde], tout }: FormeDeSchema): { reponse: number; ecriture: string } {
  if (tout === null) {
    const reponse = (premiere ?? 0) + (seconde ?? 0);
    return { reponse, ecriture: `${premiere} + ${seconde} = ${reponse}` };
  }
  const connue = premiere ?? seconde ?? 0;
  const reponse = tout - connue;
  return { reponse, ecriture: `${tout} − ${connue} = ${reponse}` };
}
