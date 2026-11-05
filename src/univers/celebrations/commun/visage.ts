import { DEG } from "./courbes.ts";

export const RAYON_DE_LA_TETE = 28;

/** Un trait du visage à l'azimut alpha (0 = devant le visage) vu sous l'angle omega (0 = face, 180 = dos). */
export const traitDuVisage = (alpha: number, omega: number, rayon = RAYON_DE_LA_TETE) => {
  const a = (alpha + omega) * DEG;
  return { x: rayon * Math.sin(a), z: Math.cos(a) };
};

export const clignement = (t: number) => {
  const c = (t + .9) % 2.9;
  return c < .13 ? Math.sin(c / .13 * Math.PI) : 0;
};
