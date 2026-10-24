import { LeconMalFormee } from "../erreurs.ts";
import { enObjet, liste, listeDeTextes, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";

type Valeur = number | null;

type PartiesEtTout = Readonly<{
  genre: "partiesEtTout";
  parties: readonly [Valeur, Valeur];
  tout: Valeur;
}>;

type Comparaison = Readonly<{
  genre: "comparaison";
  grand: Valeur;
  petit: Valeur;
  ecart: Valeur;
  noms: readonly string[];
}>;

export type FormeDeSchema = PartiesEtTout | Comparaison;

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
  const forme = item.type === "comparaison" ? lireComparaison(item) : lirePartiesEtTout(item);
  return Object.freeze({
    enonce: texteRequis(item.enonce, "l'énoncé d'un problème en barres"),
    aide: texteFacultatif(item.aide, "l'aide d'un problème en barres"),
    phrase: texteFacultatif(item.phrase, "la phrase réponse d'un problème en barres"),
    forme,
    ...resoudre(forme),
  });
}

function lirePartiesEtTout(item: Objet): PartiesEtTout {
  const [premiere = null, seconde = null] = liste(item.parties, "les parties d'un problème en barres").map(
    lireValeur,
  );
  const parties: readonly [Valeur, Valeur] = Object.freeze([premiere, seconde]);
  return Object.freeze({ genre: "partiesEtTout", parties, tout: lireValeur(item.tout) });
}

function lireComparaison(item: Objet): Comparaison {
  return Object.freeze({
    genre: "comparaison",
    grand: lireValeur(item.grand),
    petit: lireValeur(item.petit),
    ecart: lireValeur(item.ecart),
    noms: listeDeTextes(item.noms, "les noms d'un problème en barres"),
  });
}

function lireValeur(valeur: unknown): Valeur {
  return valeur === null ? null : Number(valeur);
}

type Resolution = { reponse: number; ecriture: string };

function resoudre(forme: FormeDeSchema): Resolution {
  return forme.genre === "comparaison" ? resoudreComparaison(forme) : resoudrePartiesEtTout(forme);
}

function resoudrePartiesEtTout({ parties: [premiere, seconde], tout }: PartiesEtTout): Resolution {
  if (tout === null) return addition(premiere, seconde);
  return soustraction(tout, premiere ?? seconde);
}

function resoudreComparaison({ grand, petit, ecart }: Comparaison): Resolution {
  if (ecart === null) return soustraction(grand, petit);
  if (grand === null) return addition(petit, ecart);
  return soustraction(grand, ecart);
}

function addition(a: Valeur, b: Valeur): Resolution {
  const reponse = (a ?? 0) + (b ?? 0);
  return { reponse, ecriture: `${a} + ${b} = ${reponse}` };
}

function soustraction(a: Valeur, b: Valeur): Resolution {
  const reponse = (a ?? 0) - (b ?? 0);
  return { reponse, ecriture: `${a} − ${b} = ${reponse}` };
}
