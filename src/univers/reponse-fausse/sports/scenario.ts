import { E } from "../../celebrations/commun/courbes.ts";
import type { ChangementDExpression } from "../../celebrations/commun/expressions.ts";
import { compiler } from "../../celebrations/commun/poses.ts";
import type { Emotion, Pose } from "../../celebrations/sports/poses.ts";

/** Fin de la scène, en secondes : la scène est jouée à cette vitesse, sans accélération. */
export const FIN = 1.5;
export const T_TIR = .2;
export const T_IMPACT = .46;

const REPOS: Pose = {
  x: 0, y: 0, rot: 0, s: 1, sx: 1, sy: 1, torse: 0, tete: 0, vue: 0,
  aGu: 8, aGl: 14, aDu: -8, aDl: -14, lGt: 5, lGs: 0, lDt: -5, lDs: 0,
  fG: 1, fD: 1, tG: 1, tD: 1, course: 0, mG: 0, mD: 0, clin: 0, lid: 0, devant: 0,
};

const X_LEO = -14;

/** Léo est de face dès la première image : il tape le ballon, le regarde rebondir, rit, puis lève le pouce. */
const POSES = compiler(REPOS, [
  { t: 0, e: E.douce, p: {} },
  { t: .14, e: E.douce, p: { x: X_LEO, lDt: 8, lDs: 20, tD: .6, aGu: 30, aGl: 20, aDu: -30, aDl: -20, torse: 2 } },
  { t: T_TIR, e: E.entree, p: { lDt: -26, lDs: -14, tD: 1, torse: -3, aGu: 14, aDu: -44, aDl: -14, tete: 3 } },
  { t: .36, e: E.sortie, p: { lDt: -12, lDs: 0, torse: 0 } },
  { t: .5, e: E.douce, p: { lDt: -5, aGu: 8, aGl: 14, aDu: -8, aDl: -14, tete: 0 } },
  { t: .6, e: E.douce, p: { sy: .97, sx: 1.02, tete: -5, torse: -2 } },
  { t: .7, e: E.douce, p: { sy: 1.03, sx: .98, tete: -7 } },
  { t: .82, e: E.rebond, p: { sy: .98, sx: 1.01, aDu: -75, aDl: -95, mD: 2, tete: -6 } },
  { t: .94, e: E.douce, p: { sy: 1.02, sx: .99 } },
  { t: 1.05, e: E.douce, p: { sy: 1, sx: 1, tete: -6 } },
  { t: 1.15, e: E.douce, p: {} },
  { t: 1.45, e: E.douce, p: { x: 0, tete: -4, torse: 0 } },
  { t: FIN, e: E.douce, p: {} },
]);

const EXPRESSIONS: readonly ChangementDExpression<Emotion>[] = [
  { t: 0, emo: "sourire" },
  { t: T_IMPACT, emo: "surprise" },
  { t: .62, emo: "joie" },
  { t: 1.12, emo: "sourire" },
];

export const SCENARIO_DE_LEO = { poses: POSES, expressions: EXPRESSIONS } as const;
