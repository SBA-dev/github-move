import { TexteDuParent } from "./texte-du-parent.ts";

export type FormeDuTexte =
  | "listeDeMots"
  | "listeDeVerbes"
  | "poesie"
  | "texteDocumentaire"
  | "texteSurUnMetier";

const NOMBRE_MINIMAL_D_ELEMENTS_DE_LISTE = 3;
const NOMBRE_MAXIMAL_DE_MOTS_D_UN_ELEMENT_COURT = 3;
const PART_MINIMALE_D_ELEMENTS_COURTS = 0.8;
const PART_MINIMALE_DE_VERBES_PARMI_LES_COURTS = 0.7;
const NOMBRE_MINIMAL_DE_VERS = 3;
const LONGUEUR_MAXIMALE_D_UN_VERS = 12;
const NOMBRE_DE_MOTS_DES_TEXTES_SUR_UN_METIER = 25;
const MOTS_DE_METIER = [
  "pompier",
  "policier",
  "policiere",
  "medecin",
  "infirmier",
  "boulanger",
  "metier",
  "travaille",
];

export function reconnaitreLaForme(texte: TexteDuParent): FormeDuTexte {
  if (parleDUnMetier(texte)) return "texteSurUnMetier";
  const elementsCourts = elementsCourtsDUneListe(texte);
  if (elementsCourts !== null) {
    return estUneListeDeVerbes(elementsCourts) ? "listeDeVerbes" : "listeDeMots";
  }
  if (estUnePoesie(texte)) return "poesie";
  return "texteDocumentaire";
}

function parleDUnMetier(texte: TexteDuParent): boolean {
  if (texte.mots().length <= NOMBRE_DE_MOTS_DES_TEXTES_SUR_UN_METIER) return false;
  const normalise = texte.normalise();
  return MOTS_DE_METIER.some((mot) => normalise.includes(mot));
}

function nombreDeMots(element: string): number {
  return element.split(/\s+/).length;
}

function elementsCourtsDUneListe(texte: TexteDuParent): string[] | null {
  const elements = texte.elements();
  if (elements.length < NOMBRE_MINIMAL_D_ELEMENTS_DE_LISTE) return null;
  const courts = elements.filter(
    (element) => nombreDeMots(element) <= NOMBRE_MAXIMAL_DE_MOTS_D_UN_ELEMENT_COURT,
  );
  return courts.length / elements.length > PART_MINIMALE_D_ELEMENTS_COURTS ? courts : null;
}

function estUneListeDeVerbes(elementsCourts: string[]): boolean {
  const verbes = elementsCourts.filter(
    (element) => nombreDeMots(element) === 1 && /(er|ir|re|oir)$/.test(element.toLowerCase()),
  );
  return verbes.length / elementsCourts.length > PART_MINIMALE_DE_VERBES_PARMI_LES_COURTS;
}

function estUnePoesie(texte: TexteDuParent): boolean {
  const lignes = texte.lignes();
  return lignes.length >= NOMBRE_MINIMAL_DE_VERS &&
    lignes.every((ligne) => nombreDeMots(ligne) <= LONGUEUR_MAXIMALE_D_UN_VERS);
}
