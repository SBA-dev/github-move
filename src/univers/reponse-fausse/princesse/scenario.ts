import { E } from "../../celebrations/commun/courbes.ts";
import type { ChangementDExpression } from "../../celebrations/commun/expressions.ts";
import { compiler } from "../../celebrations/commun/poses.ts";
import type { Emotion, Pose } from "../../celebrations/princesses/poses.ts";

/** Fin de la scène, en secondes : la scène est jouée à cette vitesse, sans accélération. */
export const FIN = 1.5;
/** L'instant où le sort fait « pschitt ! » : les bulles de savon sortent de la fleur au bout de la baguette. */
export const T_PSCHITT = .5;
/** Là où Lumi se pose : l'origine du cadre de son dessin fixe, à la hauteur de ses pieds. */
export const SOL_X = 0;
export const SOL_Y = 10;

const REPOS: Pose = {
  x: SOL_X, y: SOL_Y, rot: 0, sx: 1, sy: 1, vue: 0, tete: 0, regardX: 0, regardY: 0,
  aGu: 12, aGl: 14, aDu: 12, aDl: 14, mG: 0, mD: 1, clin: 0, vol: 0,
};

/** Lumi est de face ou de trois-quarts, jamais de dos : elle flotte, lève la baguette (le rond doux du poignet), rit, souffle sur les bulles, puis baisse la baguette et lève le pouce. */
const POSES = compiler(REPOS, [
  { t: 0, e: E.douce, p: {} },
  { t: .2, e: E.douce, p: { vue: .3, tete: 4, regardX: 3, aDu: 90, aDl: 60, aGu: 20, aGl: 20, y: SOL_Y - 5 } },
  { t: .32, e: E.douce, p: { aDu: 150, aDl: 20, regardY: -4 } },
  { t: .44, e: E.douce, p: { aDu: 140, aDl: -10, tete: 0, vue: .4 } },
  { t: .56, e: E.douce, p: { aDu: 150, aDl: 8, tete: 6, regardX: 5, regardY: 2 } },
  { t: .72, e: E.douce, p: { tete: -4, vue: .25, regardX: 2, regardY: 0 } },
  { t: 1, e: E.douce, p: { tete: 7, vue: .55, regardX: 6, regardY: -2, aDu: 120, aDl: 15, sy: .97, sx: 1.02 } },
  { t: 1.2, e: E.douce, p: { tete: 4, vue: .5, sy: 1, sx: 1 } },
  { t: 1.36, e: E.rebond, p: { aGu: 100, aGl: 38, mG: 2, tete: -5, vue: .15, regardX: 0, regardY: 0, aDu: 30, aDl: 10, y: SOL_Y } },
  { t: FIN, e: E.douce, p: { tete: -4, vue: .1 } },
]);

const EXPRESSIONS: readonly ChangementDExpression<Emotion>[] = [
  { t: 0, emo: "sourire" },
  { t: .2, emo: "concentration" },
  { t: .54, emo: "surprise" },
  { t: .68, emo: "joie" },
  { t: 1, emo: "souffle" },
  { t: 1.22, emo: "sourire" },
];

export const SCENARIO_DE_LUMI = { poses: POSES, expressions: EXPRESSIONS } as const;
