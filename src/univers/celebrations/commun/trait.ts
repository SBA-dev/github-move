/** Un trait arrondi du personnage (contour, ombre, manche…) : le moteur en calcule le tracé `d` à chaque image. */
export const ligne = (classe: string, couleur: string, largeur: number) =>
  `<path class="${classe}" fill="none" stroke="${couleur}" stroke-width="${largeur}" stroke-linecap="round" stroke-linejoin="round"/>`;
