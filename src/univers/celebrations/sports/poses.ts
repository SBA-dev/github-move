import type { VarianteDe } from "@domain/motivation";
import { E, lerp } from "../commun/courbes.ts";
import { compiler, type ImageCle, type ImagePartielle, poseA as poseDeLaScene } from "../commun/poses.ts";

/**
 * Angles en degrés, positifs = sens horaire. g/d = côté gauche/droit de l'écran. `vue` : 180 = de dos, 90 = profil, 0 = de face.
 * mG/mD : 0 main ouverte, 1 poing, 2 pouce levé, 3 doigts écartés.
 */
export type Pose = {
  x: number;
  y: number;
  rot: number;
  s: number;
  sx: number;
  sy: number;
  torse: number;
  tete: number;
  vue: number;
  aGu: number;
  aGl: number;
  aDu: number;
  aDl: number;
  lGt: number;
  lGs: number;
  lDt: number;
  lDs: number;
  fG: number;
  fD: number;
  tG: number;
  tD: number;
  course: number;
  mG: number;
  mD: number;
  clin: number;
  lid: number;
  devant: number;
};

const REPOS: Pose = {
  x: 70,
  y: 370,
  rot: 0,
  s: 1,
  sx: 1,
  sy: 1,
  torse: 0,
  tete: 0,
  vue: 165,
  aGu: 8,
  aGl: 14,
  aDu: -8,
  aDl: -14,
  lGt: 5,
  lGs: 0,
  lDt: -5,
  lDs: 0,
  fG: 1,
  fD: 1,
  tG: 1,
  tD: 1,
  course: 0,
  mG: 0,
  mD: 0,
  clin: 0,
  lid: 0,
  devant: 0,
};

const FRAPPE: readonly ImagePartielle<Pose>[] = [
  { t: 0.00, e: E.douce, p: { tete: 4 } },
  { t: 0.26, e: E.douce, p: { x: 62, y: 374, rot: -9, torse: -8, tete: 10, aGu: 46, aGl: 26, aDu: -52, aDl: -34, lGt: 10, lGs: 8, lDt: 52, lDs: 58, fD: 1, mG: 1, mD: 1, sy: .96, sx: 1.04 } },
  { t: 0.38, e: E.douce, p: { lDt: 60, lDs: 70, rot: -11, torse: -10 } },
  { t: 0.48, e: E.entree, p: { x: 74, y: 364, rot: 7, torse: 8, tete: 0, aGu: -42, aGl: -12, aDu: 48, aDl: 26, lGt: 14, lDt: -52, lDs: -4, fD: .68, sy: 1.06, sx: .96 } },
  { t: 0.62, e: E.sortie, p: { x: 78, y: 350, rot: 12, torse: 10, tete: -4, aGu: -58, aDu: 62, lDt: -92, lDs: 8, fD: .5, lGt: 24, lGs: 28, sy: 1.1, sx: .93 } },
  { t: 0.82, e: E.sortie, p: { x: 80, y: 372, rot: 2, torse: 1, tete: -6, aGu: -14, aGl: -6, aDu: 18, aDl: 6, lDt: -8, lDs: 8, fD: 1, lGt: 4, lGs: 0, sy: .93, sx: 1.06, mG: 0, mD: 0 } },
  { t: 0.96, e: E.douce, p: { x: 80, y: 370, rot: 0, torse: 0, tete: -8, aGu: 8, aGl: 14, aDu: -8, aDl: -14, lDt: -5, lDs: 0, sy: 1, sx: 1 } },
];

/** Retournement : dos, trois-quarts dos, profil, trois-quarts face, face, avec un saut. */
const retournement = (t0: number, x: number): readonly ImagePartielle<Pose>[] => [
  { t: t0, e: E.entree, p: { y: 378, sy: .9, sx: 1.08, vue: 165, torse: 3 } },
  { t: t0 + .12, e: E.sortie, p: { y: 346, sy: 1.1, sx: .94, vue: 135, x: lerp(70, x, .3), tete: 0, torse: -2, aGu: 40, aGl: 30, aDu: -40, aDl: -30 } },
  { t: t0 + .22, e: E.lineaire, p: { y: 336, sy: 1.04, sx: .98, vue: 90, x: lerp(70, x, .6) } },
  { t: t0 + .32, e: E.lineaire, p: { y: 348, sy: 1, sx: 1, vue: 45, x: lerp(70, x, .85) } },
  { t: t0 + .42, e: E.entree, p: { y: 376, sy: .88, sx: 1.1, vue: 0, x, aGu: 20, aGl: 20, aDu: -20, aDl: -20 } },
  { t: t0 + .54, e: E.rebond, p: { y: 370, sy: 1, sx: 1 } },
];

const V: Partial<Pose> = { aGu: 152, aGl: 20, aDu: -152, aDl: -20, mG: 3, mD: 3 };

const glissade = (t0: number): readonly ImagePartielle<Pose>[] => [
  { t: t0 + .00, e: E.douce, p: { y: 382, sy: .86, sx: 1.12, torse: 6, aGu: 48, aGl: 24, aDu: -48, aDl: -24, lGt: 30, lGs: -24, lDt: -30, lDs: 24, lid: 0, mG: 1, mD: 1 } },
  { t: t0 + .20, e: E.sortie, p: { y: 302, sy: 1.12, sx: .9, torse: -4, ...V, lGt: 18, lGs: 120, lDt: -18, lDs: -120, tG: .5, tD: .5, s: 1.04 } },
  { t: t0 + .42, e: E.entree, p: { x: 98, y: 374, sy: .92, sx: 1.08, torse: 4, aGu: 140, aDu: -140, lGt: 0, lGs: 0, lDt: 0, lDs: 0, tG: 1, tD: 1, s: 1.06, course: 1 } },
  { t: t0 + .62, e: E.douce, p: { x: 126, y: 374, sy: 1, sx: 1, s: 1.1, course: 1 } },
  { t: t0 + .80, e: E.entree, p: { x: 152, y: 402, sy: .92, sx: 1.08, torse: -5, course: 0, lGt: 16, lGs: 142, lDt: -16, lDs: -142, fG: .78, fD: .78, tG: .42, tD: .42, s: 1.14, aGu: 146, aDu: -172, aDl: -6 } },
  { t: t0 + 1.05, e: E.sortie, p: { x: 192, y: 410, sy: 1, sx: 1, rot: -5, torse: -8, s: 1.2, aGu: 134, aGl: 28, aDu: -178, aDl: 0 } },
  { t: t0 + 1.40, e: E.sortie, p: { x: 224, y: 414, rot: 0, torse: -5, s: 1.24 } },
  { t: t0 + 1.60, e: E.douce, p: { x: 227, y: 410, torse: 0, aGu: 144, aDu: -168 } },
  { t: t0 + 1.85, e: E.douce, p: { x: 227, y: 414, torse: -2, aGu: 150, aDu: -162 } },
];

const avion = (t0: number): readonly ImagePartielle<Pose>[] => [
  { t: t0 + .00, e: E.douce, p: { aGu: 60, aGl: 10, aDu: -60, aDl: -10, lid: 0, y: 376, sy: .94, sx: 1.05 } },
  { t: t0 + .25, e: E.sortie, p: { aGu: 96, aGl: 0, aDu: -96, aDl: 0, mG: 3, mD: 3, rot: -18, torse: -5, tete: -8, x: 96, y: 382, s: 1.06, course: 1, sy: 1, sx: 1 } },
  { t: t0 + .65, e: E.douce, p: { x: 176, y: 404, s: 1.18, rot: 0, torse: 0, tete: 0 } },
  { t: t0 + 1.05, e: E.douce, p: { x: 240, y: 392, s: 1.12, rot: 18, torse: 5, tete: 8, aGu: 104, aDu: -82 } },
  { t: t0 + 1.45, e: E.douce, p: { x: 252, y: 366, s: .98, rot: -14, torse: -4, tete: -6, aGu: 84, aDu: -106 } },
  { t: t0 + 1.85, e: E.sortie, p: { x: 214, y: 378, s: 1.04, rot: 0, torse: 0, tete: 0, aGu: 96, aDu: -96, course: 0, lGt: 6, lDt: -6, sy: .9, sx: 1.1 } },
  { t: t0 + 2.10, e: E.rebond, p: { ...V, y: 370, sy: 1, sx: 1 } },
  { t: t0 + 2.40, e: E.douce, p: { aGu: 146, aDu: -146 } },
];

const danse = (t0: number): readonly ImagePartielle<Pose>[] => {
  const pas = (t: number, x: number, cote: 1 | -1): readonly ImagePartielle<Pose>[] => [
    { t, e: E.sortie, p: { x: lerp(x, 70, .5), y: 348, sy: 1.06, sx: .96, rot: cote * -7, aGu: cote > 0 ? 152 : 62, aGl: cote > 0 ? 26 : -74, aDu: cote > 0 ? -62 : -152, aDl: cote > 0 ? 74 : -26, mG: cote > 0 ? 0 : 1, mD: cote > 0 ? 1 : 0, lGt: 24, lGs: -18, lDt: -24, lDs: 18, torse: cote * -6, tete: cote * 7 } },
    { t: t + .17, e: E.entree, p: { x, y: 374, rot: cote * -10, lGt: cote > 0 ? 18 : 4, lGs: 0, lDt: cote > 0 ? -4 : -18, lDs: 0, sy: .9, sx: 1.08 } },
    { t: t + .26, e: E.douce, p: { y: 370, sy: 1, sx: 1 } },
  ];
  return [
    { t: t0, e: E.douce, p: { lid: 0, y: 370 } },
    ...pas(t0 + .10, 54, 1),
    ...pas(t0 + .46, 90, -1),
    ...pas(t0 + .82, 54, 1),
    ...pas(t0 + 1.18, 90, -1),
    { t: t0 + 1.52, e: E.douce, p: { x: 74, y: 384, sy: .84, sx: 1.14, rot: 0, torse: 6, tete: 0, aGu: 44, aGl: 24, aDu: -44, aDl: -24, mG: 1, mD: 1, lGt: 32, lGs: -26, lDt: -32, lDs: 26 } },
    { t: t0 + 1.76, e: E.sortie, p: { y: 296, sy: 1.12, sx: .9, torse: -4, ...V, lGt: 20, lGs: 110, lDt: -20, lDs: -110, tG: .55, tD: .55, s: 1.04, clin: 1 } },
    { t: t0 + 2.04, e: E.entree, p: { y: 378, sy: .88, sx: 1.1, torse: 3, lGt: 22, lGs: -16, lDt: -22, lDs: 16, tG: 1, tD: 1, s: 1, clin: 1 } },
    { t: t0 + 2.24, e: E.rebond, p: { y: 370, sy: 1, sx: 1, torse: 0, lGt: 6, lGs: 0, lDt: -6, lDs: 0, aGu: 146, aDu: -146, clin: 1 } },
    { t: t0 + 2.50, e: E.douce, p: { clin: 0 } },
  ];
};

/** La variante : ses images clés, et l'instant (depuis le début de la variante) où le personnage a fini de bouger. */
const VARIANTES: Record<VarianteDe<"sports">, { readonly images: (t0: number) => readonly ImagePartielle<Pose>[]; readonly finDuMouvement: number }> = {
  glissade: { images: glissade, finDuMouvement: 1.85 },
  avion: { images: avion, finDuMouvement: 2.40 },
  danse: { images: danse, finDuMouvement: 2.50 },
};

export const poseA = (poses: readonly ImageCle<Pose>[], t: number): Pose => poseDeLaScene(REPOS, poses, t);

export type Emotion = "concentration" | "surprise" | "joie";

export type ScenarioDeBut = {
  readonly variante: VarianteDe<"sports">;
  /** Fin de la scène, en secondes du temps de la maquette (la scène est ensuite accélérée pour tenir en 3 s). */
  readonly fin: number;
  readonly tTour: number;
  readonly poses: readonly ImageCle<Pose>[];
  readonly expressions: readonly { readonly t: number; readonly emo: Emotion }[];
  readonly tCri: number;
  readonly tJoie: number;
};

export const T_FRAPPE = 0.48;
export const T_IMPACT = 0.95;
const T_TOUR = 1.0;
export const T_VARIANTE = T_TOUR + .54;
const PAUSE_FINALE = .3;

export function scenarioDuBut(variante: VarianteDe<"sports">): ScenarioDeBut {
  const { images, finDuMouvement } = VARIANTES[variante];
  return {
    variante,
    fin: T_VARIANTE + finDuMouvement + PAUSE_FINALE,
    tTour: T_TOUR,
    poses: compiler(REPOS, [...FRAPPE, ...retournement(T_TOUR, 70), ...images(T_VARIANTE)]),
    expressions: [{ t: 0, emo: "concentration" }, { t: T_IMPACT + .02, emo: "surprise" }, { t: T_TOUR + .3, emo: "joie" }],
    tCri: T_IMPACT + .03,
    tJoie: T_VARIANTE + .1,
  };
}
