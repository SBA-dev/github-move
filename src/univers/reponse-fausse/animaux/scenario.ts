import { E } from "../../celebrations/commun/courbes.ts";
import type { ChangementDExpression } from "../../celebrations/commun/expressions.ts";
import { compiler } from "../../celebrations/commun/poses.ts";
import type { Emotion, Pose } from "../../celebrations/animaux/poses.ts";

/** Fin de la scène, en secondes : la scène est jouée à cette vitesse, sans accélération. */
export const FIN = 1.5;
/** La main referme la noisette, immobile dans l'herbe. */
export const T_PRISE = 1.04;

/** Le moteur dessine Noisette à l'échelle 1,35 : une unité de son dessin vaut 1,35 unité du moteur. */
export const ECHELLE_DU_MOTEUR = 1.35;
const K = ECHELLE_DU_MOTEUR;
export const SOL_X = 190;
export const SOL_Y = 392;
/** Un petit saut vers la gauche laisse de la place à la noisette. */
const X_ECARTEE = SOL_X - 22 * K;

const REPOS: Pose = {
  x: SOL_X, y: SOL_Y, rot: 0, sx: 1, sy: 1, vue: 0, tete: 0, regardX: 0, regardY: 0,
  aGu: 10, aGl: 14, aDu: 10, aDl: 14, mG: 0, mD: 0, joues: 0, clin: 0, lid: 0, bras: 0, tenir: 0, tenirG: 0, tenirD: 0,
};
const NORMAL = { sy: 1, sx: 1 };
const BRAS_PENDANTS = { aGu: 14, aGl: 14, aDu: 14, aDl: 14, mG: 0, mD: 0 };
/** Les mains ouvertes devant elle, bien en deçà de la chute de la noisette. */
const MAINS_TENDUES = { aGu: 34, aGl: 28, aDu: 16, aDl: 22, mG: 3, mD: 3 };
/** Elle se penche vers la noisette posée. */
const PENCHEE = { rot: 11, sy: .83, sx: 1.08, y: SOL_Y + 6, vue: .3, tete: 5, regardX: 2, regardY: 2 };

/** Noisette est de face, puis de trois-quarts face, jamais de dos : elle saute de côté, tend les mains, rit, ramasse la noisette et lève le pouce. */
const POSES = compiler(REPOS, [
  { t: 0, e: E.douce, p: {} },
  { t: .05, e: E.sortie, p: { sy: 1.03, sx: .98, x: SOL_X - 11 * K, y: SOL_Y - 8, vue: .08, regardX: 2, regardY: -5 } },
  { t: .12, e: E.entree, p: { ...NORMAL, x: X_ECARTEE, y: SOL_Y, vue: .12 } },
  { t: .28, e: E.douce, p: { ...MAINS_TENDUES, tete: -3, regardX: 3, regardY: -5 } },
  { t: .42, e: E.douce, p: { regardY: 0, tete: 0 } },
  { t: .54, e: E.douce, p: { regardY: 5, vue: .22 } },
  { t: .62, e: E.douce, p: { regardY: 3 } },
  { t: .68, e: E.douce, p: { sy: .97, sx: 1.02 } },
  { t: .70, e: E.douce, p: { regardY: 5, ...BRAS_PENDANTS, aGu: 16, aDu: 16 } },
  { t: .75, e: E.douce, p: { sy: 1.03, sx: .98 } },
  { t: .82, e: E.douce, p: { sy: .98, sx: 1.01 } },
  { t: .98, e: E.douce, p: { ...PENCHEE, aGu: 14, aGl: 14, aDu: 14, aDl: 14 } },
  { t: T_PRISE, e: E.douce, p: { aDu: 12, aDl: 0 } },
  { t: 1.10, e: E.douce, p: { mD: 1 } },
  { t: 1.16, e: E.douce, p: { aGu: 100, aGl: 8 } },
  { t: 1.28, e: E.rebond, p: { ...NORMAL, rot: 0, y: SOL_Y, vue: .05, tete: -4, regardX: 0, regardY: 0, aDu: 34, aDl: -70, aGu: 104, aGl: 62, mG: 2 } },
  { t: 1.36, e: E.sortie, p: { sy: 1.03, sx: .98, x: SOL_X - 11 * K, y: SOL_Y - 8, vue: 0 } },
  { t: 1.46, e: E.entree, p: { ...NORMAL, x: SOL_X, y: SOL_Y } },
  { t: FIN, e: E.douce, p: {} },
]);

const EXPRESSIONS: readonly ChangementDExpression<Emotion>[] = [
  { t: 0, emo: "sourire" },
  { t: .12, emo: "pleines" },
  { t: .66, emo: "joie" },
  { t: 1.3, emo: "sourire" },
];

export const SCENARIO_DE_NOISETTE = { poses: POSES, expressions: EXPRESSIONS, tJongle: null } as const;
