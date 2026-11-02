import type { VueColonne } from "@domain/apprentissage";
import type { CleUnivers } from "@domain/motivation";

/** Sources validées par le PO (docs/stories/127/planches/sources), copiées telles quelles dans `dessins/` : ne pas les retoucher à la main. */
const SOURCES = import.meta.glob<string>("./dessins/*.svg", { query: "?raw", import: "default", eager: true });

type Couleur = VueColonne["couleur"];

export type EtatDeLaMaison = "fermee" | "ouverte" | "allumee";

const CONTENU_D_UN_SVG = /^<svg[^>]*>([\s\S]*)<\/svg>\s*$/;

function contenuDe(nomDuFichier: string): string {
  const source = SOURCES[`./dessins/${nomDuFichier}.svg`];
  const contenu = source === undefined ? undefined : CONTENU_D_UN_SVG.exec(source)?.[1];
  if (contenu === undefined) throw new Error(`Dessin introuvable : ${nomDuFichier}`);
  return contenu;
}

/** Les identifiants de dégradés des sources commencent par « x- » : chaque dessin affiché prend le sien, pour que deux maisons d'une page ne se les disputent pas. */
export function avecSesIdentifiants(contenu: string, prefixe: string): string {
  return contenu.replace(/(id="|url\(#)x-/g, `$1${prefixe}-`);
}

/** Le dessin d'une maison de colonne : façade aux couleurs de la colonne, toit et décor de l'univers. */
export function dessinDeLaMaison(univers: CleUnivers, couleur: Couleur, etat: EtatDeLaMaison): string {
  return contenuDe(`maison-${univers}-${couleur}-${etat}`);
}

/** Le dessin de la retenue : l'objet de l'univers, au contour de la couleur de la maison d'arrivée. */
export function dessinDeLaRetenue(univers: CleUnivers, couleur: Couleur): string {
  return contenuDe(`retenue-${univers}-${couleur}`);
}

/** Où se pose le chiffre sur l'objet de chaque univers, en pourcentage du dessin (là où le fond est clair). */
export const PLACE_DU_CHIFFRE_DE_LA_RETENUE: Readonly<Record<CleUnivers, { readonly x: number; readonly y: number }>> = {
  animaux: { x: 50, y: 62 },
  princesse: { x: 50, y: 50 },
  sports: { x: 50, y: 57 },
  police: { x: 42, y: 42 },
  pompier: { x: 50, y: 65 },
  danse: { x: 42, y: 71 },
};
