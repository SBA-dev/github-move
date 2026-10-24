import { LeconMalFormee } from "../erreurs.ts";
import { enObjet, liste, type Objet, texteFacultatif, texteRequis } from "../lecture.ts";

const CONSIGNE_PAR_DEFAUT = "Écoute bien et écris le mot que tu entends.";

export type MotDicte = Readonly<{ mot: string; phrase?: string }>;

export type ExerciceDictee = Readonly<{
  type: "dictee";
  titre?: string;
  consigne: string;
  mots: readonly MotDicte[];
}>;

export function lireDictee(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceDictee {
  const mots = liste(brut.mots, "les mots").map(lireMotDicte);
  if (mots.length === 0) throw new LeconMalFormee("la dictée n'a aucun mot");
  return Object.freeze({
    type: "dictee",
    titre: communs.titre,
    consigne: communs.consigne ?? CONSIGNE_PAR_DEFAUT,
    mots: Object.freeze(mots),
  });
}

function lireMotDicte(brut: unknown): MotDicte {
  const objet = enObjet(brut, "un mot dicté");
  const mot = texteRequis(objet.mot, "le mot dicté");
  if (!/\p{L}/u.test(mot)) throw new LeconMalFormee(`le mot dicté « ${mot} » n'a aucune lettre à écrire`);
  return Object.freeze({ mot, phrase: texteFacultatif(objet.phrase, "la phrase d'un mot dicté") });
}
