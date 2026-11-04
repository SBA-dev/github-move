export const DEG = Math.PI / 180;

export type Courbe = (u: number) => number;

/** Les courbes d'accélération des maquettes : toutes vont de 0 à 1 (le retour et le rebond dépassent 1 un instant). */
export const E = {
  lineaire: (u) => u,
  /** Le saut immédiat à la valeur d'arrivée : remet un tour complet à zéro sans repasser par les angles intermédiaires. */
  instantanee: () => 1,
  sortie: (u) => 1 - Math.pow(1 - u, 3),
  entree: (u) => u * u * u,
  douce: (u) => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  retour: (u) => retourDe(u, 1.7),
  rebond: (u) => retourDe(u, 2.6),
} satisfies Record<string, Courbe>;

function retourDe(u: number, c: number): number {
  return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2);
}

export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const fenetre = (t: number, debut: number, duree: number, e: Courbe = E.sortie) => e(clamp01((t - debut) / duree));
/** Arrondi à un dixième, pour des attributs SVG courts. */
export const r1 = (v: number) => Math.round(v * 10) / 10;
/** Arrondi au millième, pour les échelles et les opacités. */
export const r3 = (v: number) => Math.round(v * 1000) / 1000;
