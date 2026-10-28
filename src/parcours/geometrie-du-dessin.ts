export type Point = { readonly x: number; readonly y: number };

/** Une boîte mesurée dans le dessin du parcours, en pixels depuis son coin haut gauche. */
export type Boite = { readonly x: number; readonly y: number; readonly largeur: number; readonly hauteur: number };

export const COTE_DU_PERSONNAGE_GUIDE_EN_PX = 52;

const POSITION_HORIZONTALE_DU_CENTRE_DE_LA_FIN = 0.62;
const POSITION_VERTICALE_DU_CENTRE_DE_LA_FIN = 0.5;
const MARGE_DU_PERSONNAGE_GUIDE_EN_PX = 6;

/** Le tracé serpente : les leçons se posent tour à tour à gauche, au centre, à droite, au centre (en % de la largeur). */
const CENTRES_DES_LECONS_EN_POURCENT = [32, 50, 68, 50] as const;

export function centreDeLaLeconEnPourcent(indexDAffichage: number): number {
  return CENTRES_DES_LECONS_EN_POURCENT[indexDAffichage % CENTRES_DES_LECONS_EN_POURCENT.length] ?? 50;
}

export function centreDe(boite: Boite): Point {
  return { x: boite.x + boite.largeur / 2, y: boite.y + boite.hauteur / 2 };
}

/** Le centre de la fin du dessin : le fanion, plutôt à droite de la colline. */
export function centreDeLaFin(fin: Boite): Point {
  return {
    x: fin.x + fin.largeur * POSITION_HORIZONTALE_DU_CENTRE_DE_LA_FIN,
    y: fin.y + fin.hauteur * POSITION_VERTICALE_DU_CENTRE_DE_LA_FIN,
  };
}

/** Le personnage guide se tient à côté de la leçon, du côté où il y a le plus de place, pour ne rien en cacher. */
export function emplacementAcoteDeLaLecon(lecon: Boite, largeurDuDessin: number): Point {
  const placeAGauche = lecon.x;
  const placeADroite = largeurDuDessin - (lecon.x + lecon.largeur);
  const x = placeADroite >= placeAGauche
    ? lecon.x + lecon.largeur + MARGE_DU_PERSONNAGE_GUIDE_EN_PX
    : lecon.x - COTE_DU_PERSONNAGE_GUIDE_EN_PX - MARGE_DU_PERSONNAGE_GUIDE_EN_PX;
  return { x, y: lecon.y + lecon.hauteur - COTE_DU_PERSONNAGE_GUIDE_EN_PX };
}

/** À la fin du dessin, il se tient sur la colline, à gauche du fanion. */
export function emplacementSurLaColline(fin: Boite): Point {
  return {
    x: fin.x + fin.largeur * 0.4 - COTE_DU_PERSONNAGE_GUIDE_EN_PX / 2,
    y: fin.y + fin.hauteur - COTE_DU_PERSONNAGE_GUIDE_EN_PX - 32,
  };
}

/** Un tracé qui passe par tous les points, en courbes qui repartent à la verticale. */
export function tracePassantPar(points: readonly Point[]): string {
  const [premier, ...suivants] = points;
  if (!premier) return "";
  const segments = suivants.map((point, indexDuPrecedent) => {
    const precedent = points[indexDuPrecedent] ?? premier;
    const milieu = (precedent.y + point.y) / 2;
    return `C ${precedent.x} ${milieu} ${point.x} ${milieu} ${point.x} ${point.y}`;
  });
  return [`M ${premier.x} ${premier.y}`, ...segments].join(" ");
}
