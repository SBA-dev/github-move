import { LeconMalFormee } from "../erreurs.ts";
import { enObjet, liste, listeDeTextes, nombreRequis, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";

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
    case undefined:
      return lirePartiesEtTout(item);
    case "comparaison":
      return lireComparaison(item);
    case "parts":
      return lireParts(item);
    default:
      throw new LeconMalFormee("la forme du schéma d'un problème en barres est inconnue");
  }
}

function lirePartiesEtTout(item: Objet): PartiesEtTout {
  const valeurs = liste(item.parties, "les parties d'un problème en barres").map(lireValeur);
  const [premiere, seconde] = valeurs;
  if (valeurs.length !== 2 || premiere === undefined || seconde === undefined) {
    throw new LeconMalFormee("un problème en barres n'a pas exactement deux parties");
  }
  const tout = lireValeur(item.tout);
  exigerUneSeuleValeurCherchee([premiere, seconde, tout]);
  const parties: readonly [Valeur, Valeur] = Object.freeze([premiere, seconde]);
  return Object.freeze({ genre: "partiesEtTout", parties, tout });
}

function lireComparaison(item: Objet): Comparaison {
  const noms = listeDeTextes(item.noms, "les noms d'un problème en barres");
  if (noms.length !== 2) throw new LeconMalFormee("une comparaison en barres n'a pas exactement deux noms");
  const [grand, petit, ecart] = [lireValeur(item.grand), lireValeur(item.petit), lireValeur(item.ecart)] as const;
  exigerUneSeuleValeurCherchee([grand, petit, ecart]);
  return Object.freeze({ genre: "comparaison", grand, petit, ecart, noms });
}

function lireParts(item: Objet): Parts {
  const [nb, valeur, total] = [lireValeur(item.nb), lireValeur(item.valeur), lireValeur(item.total)] as const;
  exigerUneSeuleValeurCherchee([nb, valeur, total]);
  return Object.freeze({ genre: "parts", nb, valeur, total });
}

function lireValeur(valeur: unknown): Valeur {
  if (valeur === null) return null;
  const nombre = nombreRequis(valeur, "une valeur d'un problème en barres");
  if (!Number.isInteger(nombre) || nombre < 0) {
    throw new LeconMalFormee("une valeur d'un problème en barres n'est pas un entier positif");
  }
  return nombre;
}

function exigerUneSeuleValeurCherchee(valeurs: readonly (Valeur | undefined)[]): void {
  if (valeurs.filter((valeur) => valeur === null).length !== 1) {
    throw new LeconMalFormee("un problème en barres n'a pas exactement une valeur cherchée");
  }
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
  if (!diviseur || total % diviseur !== 0) {
    throw new LeconMalFormee("un partage en barres n'est pas une division exacte");
  }
  const reponse = total / diviseur;
  return { reponse, ecriture: ecrire(reponse) };
}

function addition(a: Valeur, b: Valeur): Resolution {
  const reponse = (a ?? 0) + (b ?? 0);
  return { reponse, ecriture: `${a} + ${b} = ${reponse}` };
}

function soustraction(a: Valeur, b: Valeur): Resolution {
  const reponse = (a ?? 0) - (b ?? 0);
  if (reponse < 0) throw new LeconMalFormee("la valeur cherchée d'un problème en barres est négative");
  return { reponse, ecriture: `${a} − ${b} = ${reponse}` };
}
