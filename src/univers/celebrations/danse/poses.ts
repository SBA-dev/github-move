import type { VarianteDe } from "@domain/motivation";
import { E } from "../commun/courbes.ts";
import type { ChangementDExpression } from "../commun/expressions.ts";
import { compiler, type ImageCle, type ImagePartielle, poseA as poseDeLaScene } from "../commun/poses.ts";

/**
 * Angles en degrés, positifs = sens horaire. g/d = côté gauche/droit de l'écran. `vue` : 0 = de face, 90 = profil (regard vers la droite), 180 = de dos.
 * mG/mD : 0 main ouverte, 1 poing, 3 doigts écartés. `pointe` : 1 = sur les demi-pointes.
 */
export type Pose = {
  x: number;
  y: number;
  rot: number;
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
  tD: number;
  course: number;
  mG: number;
  mD: number;
  clin: number;
  pointe: number;
};

type Images = readonly ImagePartielle<Pose>[];

const REPOS: Pose = {
  x: 180,
  y: 370,
  rot: 0,
  sx: 1,
  sy: 1,
  torse: 0,
  tete: 0,
  vue: 0,
  aGu: 10,
  aGl: 16,
  aDu: -10,
  aDl: -16,
  lGt: 4,
  lGs: 0,
  lDt: -4,
  lDs: 0,
  tD: 1,
  course: 0,
  mG: 0,
  mD: 0,
  clin: 0,
  pointe: 0,
};

const PREMIERE: Partial<Pose> = { aGu: 48, aGl: 78, aDu: -48, aDl: -78 };
const SECONDE: Partial<Pose> = { aGu: 100, aGl: 6, aDu: -100, aDl: -6 };
const SECONDE_ARRONDIE: Partial<Pose> = { aGu: 70, aGl: 26, aDu: -70, aDl: -26 };
const COURONNE: Partial<Pose> = { aGu: 150, aGl: 14, aDu: -150, aDl: -14 };
const PASSE_D: Partial<Pose> = { lDt: -34, lDs: -112, tD: .5 };

/** L'élan et la pirouette, communs aux trois variantes : Lili part de la gauche, vient au centre, tourne, se reçoit. */
const ELAN: Images = [
  { t: 0.00, e: E.douce, p: { x: 118, tete: 0 } },
  { t: 0.22, e: E.sortie, p: { x: 124, course: 1, ...SECONDE, aGu: 70, aDu: -70, mG: 3, mD: 3 } },
  { t: 0.62, e: E.douce, p: { x: 176, course: 1 } },
  { t: 0.78, e: E.douce, p: { x: 180, course: 0, y: 380, sy: .9, sx: 1.08, lGt: 26, lGs: -22, lDt: -26, lDs: 22, aGu: 36, aGl: 10, aDu: -36, aDl: -10, tete: 0 } },
  { t: 0.92, e: E.sortie, p: { y: 356, sy: 1.08, sx: .95, lGt: 2, lGs: 0, lDt: 0, lDs: 0, ...PREMIERE, ...PASSE_D, pointe: 1, mG: 0, mD: 0 } },
  { t: 1.02, e: E.lineaire, p: { vue: 70, y: 352, rot: -2 } },
  { t: 1.12, e: E.lineaire, p: { vue: 160, rot: 0 } },
  { t: 1.22, e: E.lineaire, p: { vue: 250, rot: 2 } },
  { t: 1.34, e: E.lineaire, p: { vue: 360, rot: 0, sy: 1, sx: 1 } },
  { t: 1.35, e: E.instantanee, p: { vue: 0 } },
  { t: 1.50, e: E.sortie, p: { y: 378, sy: .92, sx: 1.06, lGt: 22, lGs: -18, lDt: -22, lDs: 18, tD: 1, ...SECONDE_ARRONDIE, pointe: 0, mG: 3, mD: 3 } },
  { t: 1.66, e: E.rebond, p: { y: 370, sy: 1, sx: 1, lGt: 6, lDt: -6, lGs: 0, lDs: 0 } },
];

export const T_PIROUETTE = 0.92;
const T_RECEPTION = 1.50;
/** Où commence la variante tirée, et combien de temps elle dure (du temps de la maquette). */
export const T_VARIANTE = 1.70;
const DUREE_DE_LA_VARIANTE = 2.8;
const PAUSE_FINALE = .4;

const jete = (t0: number): Images => [
  { t: t0 + .00, e: E.douce, p: { x: 180 } },
  { t: t0 + .18, e: E.douce, p: { vue: 90, x: 150, ...PREMIERE, mG: 0, mD: 0, course: 1 } },
  { t: t0 + .50, e: E.douce, p: { x: 126, course: 1 } },
  { t: t0 + .62, e: E.entree, p: { x: 132, y: 380, sy: .9, sx: 1.08, course: 0, lGt: 14, lGs: -10, lDt: -14, lDs: 10, aGu: 60, aGl: 20, aDu: -60, aDl: -20 } },
  { t: t0 + .82, e: E.sortie, p: { x: 172, y: 328, sy: 1.1, sx: .95, lDt: -88, lDs: -6, lGt: 78, lGs: 8, aDu: -150, aDl: -10, aGu: 112, aGl: 8, torse: -6, tete: -4, pointe: 1, mG: 3, mD: 3 } },
  { t: t0 + 1.02, e: E.douce, p: { x: 212, y: 324, lDt: -86, lGt: 80 } },
  { t: t0 + 1.26, e: E.entree, p: { x: 240, y: 378, sy: .9, sx: 1.08, lDt: -10, lDs: 10, lGt: 24, lGs: -16, aDu: -100, aDl: -4, aGu: 100, aGl: 4, torse: 2, tete: 0, pointe: 0 } },
  { t: t0 + 1.46, e: E.rebond, p: { y: 370, sy: 1, sx: 1, lDt: -4, lGt: 4, lGs: 0, lDs: 0 } },
  { t: t0 + 1.62, e: E.douce, p: { vue: 45, x: 232 } },
  { t: t0 + 1.78, e: E.douce, p: { vue: 0, x: 224, ...SECONDE_ARRONDIE } },
  { t: t0 + 2.10, e: E.douce, p: { torse: 26, tete: 14, y: 374, lGt: 10, lGs: 0, lDt: -30, lDs: -40, tD: .7, aGu: 30, aGl: 58, aDu: -30, aDl: -58, mG: 0, mD: 0 } },
  { t: t0 + 2.50, e: E.douce, p: { torse: 24, tete: 12 } },
  { t: t0 + 2.80, e: E.douce, p: { torse: 0, tete: 0, y: 370, lDt: -6, lDs: 0, tD: 1, ...SECONDE_ARRONDIE, mG: 3, mD: 3 } },
];

const ruban = (t0: number): Images => [
  { t: t0 + .00, e: E.douce, p: { x: 180 } },
  { t: t0 + .20, e: E.douce, p: { aGu: 20, aGl: 30, mG: 0, pointe: 1, y: 362, ...PASSE_D, mD: 1 } },
  { t: t0 + .40, e: E.lineaire, p: { vue: 0 } },
  { t: t0 + 1.00, e: E.lineaire, p: { vue: 120 } },
  { t: t0 + 1.60, e: E.lineaire, p: { vue: 240 } },
  { t: t0 + 2.20, e: E.lineaire, p: { vue: 360 } },
  { t: t0 + 2.21, e: E.instantanee, p: { vue: 0 } },
  { t: t0 + 2.40, e: E.sortie, p: { y: 370, pointe: 0, tD: 1, lDt: -6, lDs: 0, aGu: 70, aGl: 24, mG: 3, aDu: -140, aDl: -30 } },
  { t: t0 + 2.80, e: E.douce, p: { aDu: -150, aDl: -20 } },
];

const sauts = (t0: number): Images => {
  const petitSaut = (t: number, cote: 1 | -1): Images => [
    { t, e: E.entree, p: { y: 380, sy: .88, sx: 1.1, lGt: 24, lGs: -20, lDt: -24, lDs: 20, aGu: 40 + cote * 20, aGl: 20, aDu: -40 + cote * 20, aDl: -20, torse: cote * 4, tete: cote * -5, mG: 1, mD: 1 } },
    { t: t + .18, e: E.sortie, p: { y: 338, sy: 1.1, sx: .92, lGt: 6, lGs: 0, lDt: -6, lDs: 0, pointe: 1, aGu: 110 + cote * 30, aGl: 10, aDu: -110 + cote * 30, aDl: -10, torse: cote * -3, mG: 3, mD: 3 } },
    { t: t + .36, e: E.entree, p: { y: 372, sy: .96, sx: 1.03, pointe: 0 } },
  ];
  return [
    { t: t0, e: E.douce, p: { x: 180 } },
    ...petitSaut(t0 + .10, -1),
    ...petitSaut(t0 + .52, 1),
    ...petitSaut(t0 + .94, -1),
    { t: t0 + 1.40, e: E.entree, p: { y: 382, sy: .86, sx: 1.12, lGt: 26, lGs: -22, lDt: -26, lDs: 22, aGu: 40, aGl: 30, aDu: -40, aDl: -30, mG: 1, mD: 1, torse: 2 } },
    { t: t0 + 1.62, e: E.sortie, p: { y: 326, sy: 1.12, sx: .9, lGt: 8, lGs: 0, lDt: -8, lDs: 0, pointe: 1, ...COURONNE, mG: 3, mD: 3, torse: -2, clin: 1 } },
    { t: t0 + 1.90, e: E.entree, p: { y: 376, sy: .92, sx: 1.06, lGt: 16, lGs: -12, lDt: -16, lDs: 12, pointe: 0, clin: 1 } },
    { t: t0 + 2.10, e: E.rebond, p: { y: 362, sy: 1, sx: 1, lGt: 4, lGs: 0, lDt: -4, lDs: 0, pointe: 1, ...COURONNE, clin: 1, tete: -4 } },
    { t: t0 + 2.60, e: E.douce, p: { clin: 0 } },
    { t: t0 + 2.80, e: E.douce, p: {} },
  ];
};

const VARIANTES: Record<VarianteDe<"danse">, (t0: number) => Images> = { jete, ruban, sauts };

export const poseA = (poses: readonly ImageCle<Pose>[], t: number): Pose => poseDeLaScene(REPOS, poses, t);

export type Emotion = "sourire" | "concentration" | "joie";

export type ScenarioDeDanse = {
  readonly variante: VarianteDe<"danse">;
  /** Fin de la scène, en secondes du temps de la maquette (la scène est ensuite accélérée pour tenir en 3 s). */
  readonly fin: number;
  readonly poses: readonly ImageCle<Pose>[];
  readonly expressions: readonly ChangementDExpression<Emotion>[];
  readonly tCri: number;
  readonly tJoie: number;
  /** L'instant où les pétales et les fleurs partent de la salle. */
  readonly tPetales: number;
};

export function scenarioDeLaDanse(variante: VarianteDe<"danse">): ScenarioDeDanse {
  return {
    variante,
    fin: T_VARIANTE + DUREE_DE_LA_VARIANTE + PAUSE_FINALE,
    poses: compiler(REPOS, [...ELAN, ...VARIANTES[variante](T_VARIANTE)]),
    expressions: [{ t: 0, emo: "sourire" }, { t: 0.78, emo: "concentration" }, { t: T_RECEPTION, emo: "joie" }],
    tCri: T_RECEPTION + .12,
    tJoie: T_RECEPTION + .1,
    tPetales: variante === "jete" ? T_VARIANTE + 1.9 : T_RECEPTION + .2,
  };
}
