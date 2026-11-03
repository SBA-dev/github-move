import type { CleUnivers } from "@domain/motivation";

/** Sources validées par le PO (docs/stories/128/planches), copiées telles quelles dans `dessins/` : ne pas les retoucher à la main. */
const SOURCES = import.meta.glob<string>("./dessins/*.svg", { query: "?raw", import: "default", eager: true });

export type EtatDeLaCase = "vide" | "allumee" | "illuminee";
export type EtatDeLaMarque = "a-atteindre" | "depassee";

const CONTENU_D_UN_SVG = /^<svg[^>]*>([\s\S]*)<\/svg>\s*$/;
const UNIVERS_PAR_DEFAUT: CleUnivers = "animaux";

function contenuDe(nomDuFichier: string): string | undefined {
  const source = SOURCES[`./dessins/${nomDuFichier}.svg`];
  /** Sans les retours à la ligne entre les tracés : le texte d'une touche ou d'une case reste celui de sa lettre ou de son chiffre. */
  return source === undefined ? undefined : CONTENU_D_UN_SVG.exec(source)?.[1]?.replace(/>\s+</g, "><").trim();
}

/** Le dessin de l'univers, ou celui des animaux de la forêt quand l'univers n'en a pas. */
function contenuDeLUnivers(univers: CleUnivers, nom: (univers: CleUnivers) => string): string {
  const contenu = contenuDe(nom(univers)) ?? contenuDe(nom(UNIVERS_PAR_DEFAUT));
  if (contenu === undefined) throw new Error(`Dessin introuvable : ${nom(UNIVERS_PAR_DEFAUT)}`);
  return contenu;
}

/** La case de la dictée : l'objet de l'univers, vide, allumée par une lettre écrite ou illuminée par le mot juste. */
export const dessinDeLaCase = (univers: CleUnivers, etat: EtatDeLaCase): string =>
  contenuDeLUnivers(univers, (cle) => `case-${cle}-${etat}`);

/** La touche de chiffre du clavier de cristaux : le cristal de l'univers. */
export const dessinDuCristal = (univers: CleUnivers): string => contenuDeLUnivers(univers, (cle) => `touche-${cle}`);

/** La marque du record de fluence : l'objet de l'univers, avant et après le record. */
export const dessinDeLaMarque = (univers: CleUnivers, etat: EtatDeLaMarque): string =>
  contenuDeLUnivers(univers, (cle) => `marque-${cle}-${etat}`);
