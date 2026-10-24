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

type Parts = Readonly<{
  genre: "parts";
  nb: Valeur;
  valeur: Valeur;
  total: Valeur;
}>;

export type FormeDeSchema = PartiesEtTout | Comparaison | Parts;

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
  const forme = lireForme(item);
  return Object.freeze({
    enonce: texteRequis(item.enonce, "l'énoncé d'un problème en barres"),
    aide: texteFacultatif(item.aide, "l'aide d'un problème en barres"),
    phrase: texteFacultatif(item.phrase, "la phrase réponse d'un problème en barres"),
    forme,
    ...resoudre(forme),
  });
}

function lireForme(item: Objet): FormeDeSchema {
  switch (item.type) {
    case "comparaison":
      return lireComparaison(item);
    case "parts":
      return lireParts(item);
    default:
      return lirePartiesEtTout(item);
  }
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

function lireParts(item: Objet): Parts {
  return Object.freeze({
    genre: "parts",
    nb: lireValeur(item.nb),
    valeur: lireValeur(item.valeur),
    total: lireValeur(item.total),
  });
}

function lireValeur(valeur: unknown): Valeur {
  return valeur === null ? null : Number(valeur);
}

type Resolution = { reponse: number; ecriture: string };

function resoudre(forme: FormeDeSchema): Resolution {
  switch (forme.genre) {
    case "comparaison":
      return resoudreComparaison(forme);
    case "parts":
      return resoudreParts(forme);
    case "partiesEtTout":
      return resoudrePartiesEtTout(forme);
  }
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

function resoudreParts({ nb, valeur, total }: Parts): Resolution {
  if (total === null) return multiplication(nb, valeur);
  if (valeur === null) return partage(total, nb, (r) => `${total} = ${nb} × ${r}`);
  return partage(total, valeur, (r) => `${total} = ${r} × ${valeur}`);
}

function multiplication(a: Valeur, b: Valeur): Resolution {
  const reponse = (a ?? 0) * (b ?? 0);
  return { reponse, ecriture: `${a} × ${b} = ${reponse}` };
}

function partage(total: number, diviseur: Valeur, ecrire: (reponse: number) => string): Resolution {
  const reponse = total / (diviseur ?? 1);
  return { reponse, ecriture: ecrire(reponse) };
}

function addition(a: Valeur, b: Valeur): Resolution {
  const reponse = (a ?? 0) + (b ?? 0);
  return { reponse, ecriture: `${a} + ${b} = ${reponse}` };
}

function soustraction(a: Valeur, b: Valeur): Resolution {
  const reponse = (a ?? 0) - (b ?? 0);
  return { reponse, ecriture: `${a} − ${b} = ${reponse}` };
}
