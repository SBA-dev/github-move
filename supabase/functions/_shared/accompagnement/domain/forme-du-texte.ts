import { TexteDuParent } from "./texte-du-parent.ts";

export type FormeDuTexte =
  | "listeDeMots"
  | "listeDeVerbes"
  | "poesie"
  | "texteDocumentaire"
  | "texteSurUnMetier";

const NOMBRE_MINIMAL_DE_MOTS_DE_LISTE = 3;
const NOMBRE_MINIMAL_DE_VERS = 3;
const LONGUEUR_MAXIMALE_D_UN_VERS = 8;
const NOMBRE_DE_MOTS_DES_TEXTES_SUR_UN_METIER = 25;
const METIERS = ["pompier", "medecin"];

export function reconnaitreLaForme(texte: TexteDuParent): FormeDuTexte {
  if (parleDUnMetier(texte)) return "texteSurUnMetier";
  if (estUneListeDeVerbes(texte)) return "listeDeVerbes";
  if (estUneListeDeMots(texte)) return "listeDeMots";
  if (estUnePoesie(texte)) return "poesie";
  return "texteDocumentaire";
}

function parleDUnMetier(texte: TexteDuParent): boolean {
  if (texte.mots().length <= NOMBRE_DE_MOTS_DES_TEXTES_SUR_UN_METIER) return false;
  const mots = texte.normalise().split(/[^a-z]+/);
  return METIERS.some((metier) => mots.includes(metier));
}

function estUneListeDeMots(texte: TexteDuParent): boolean {
  const elements = texte.elements();
  return elements.length >= NOMBRE_MINIMAL_DE_MOTS_DE_LISTE &&
    elements.every((element) => !/\s/.test(element));
}

function estUneListeDeVerbes(texte: TexteDuParent): boolean {
  return estUneListeDeMots(texte) &&
    texte.elements().every((element) => /(er|ir|re)$/.test(element.toLowerCase()));
}

function estUnePoesie(texte: TexteDuParent): boolean {
  const lignes = texte.lignes();
  return lignes.length >= NOMBRE_MINIMAL_DE_VERS &&
    lignes.every((ligne) => ligne.split(/\s+/).length <= LONGUEUR_MAXIMALE_D_UN_VERS);
}
