import { E } from "../../celebrations/commun/courbes.ts";
import type { ChangementDExpression } from "../../celebrations/commun/expressions.ts";
import { compiler } from "../../celebrations/commun/poses.ts";
import type { Emotion, Pose } from "../../celebrations/danse/poses.ts";

/** Fin de la scène, en secondes : la scène est jouée à cette vitesse, sans accélération. */
export const FIN = 1.5;
export const T_VACILLEMENT = .16;
const T_PAS_DE_COTE = .5;

const X_DEPART = -8;
const X_ARRIVEE = 8;
/** À mi-pas, les deux pieds sont de part et d'autre du corps. */
const PIEDS_ECARTES_DU_PAS = 11;
/** Décalage horizontal (en unités du dessin) par degré de rotation du corps autour de ses pieds. */
const DECALAGE_DU_BASSIN_PAR_DEGRE = 1.55;
const DEMI_POINTES = { y: -7, pointe: 1 };

/** Le corps pivote sur ses pieds : l'abscisse suit l'angle pour que les pieds ne glissent pas et que Lili reste d'aplomb. */
const surSesPieds = (x: number, rot: number) => ({ x: Math.round((x + DECALAGE_DU_BASSIN_PAR_DEGRE * rot) * 10) / 10, rot });

const REPOS: Pose = {
  x: X_DEPART, y: 0, rot: 0, sx: 1, sy: 1, torse: 0, tete: 0, vue: 0,
  aGu: 10, aGl: 16, aDu: -10, aDl: -16, lGt: 4, lGs: 0, lDt: -4, lDs: 0,
  tD: 1, course: 0, mG: 0, mD: 0, clin: 0, pointe: 0,
};

/** Lili est de face dès la première image : elle se hisse sur les demi-pointes, vacille à peine, fait un pas de côté, une petite révérence, puis lève le pouce. */
const POSES = compiler(REPOS, [
  { t: 0, e: E.douce, p: {} },
  { t: .10, e: E.douce, p: { ...DEMI_POINTES, aGu: 26, aGl: 20, aDu: -26, aDl: -20 } },
  { t: .20, e: E.douce, p: { ...surSesPieds(X_DEPART, 4), torse: -2, aGu: 58, aGl: 14, aDu: -34, aDl: -18, tete: 3 } },
  { t: .32, e: E.douce, p: { ...surSesPieds(X_DEPART, -4), torse: 2, aGu: 34, aGl: 18, aDu: -58, aDl: -14, tete: -3 } },
  { t: .42, e: E.douce, p: { ...surSesPieds(X_DEPART, 1.5), torse: 0, aGu: 42, aGl: 20, aDu: -42, aDl: -20, tete: 0 } },
  { t: T_PAS_DE_COTE, e: E.douce, p: { ...surSesPieds(-4, 0), lGt: 7.5, lDt: -14, tD: .9 } },
  { t: .58, e: E.douce, p: { ...surSesPieds(0, 0), lGt: PIEDS_ECARTES_DU_PAS, lDt: -PIEDS_ECARTES_DU_PAS, tD: 1 } },
  { t: .78, e: E.douce, p: { ...surSesPieds(X_ARRIVEE, 0), lGt: 4, lDt: -4 } },
  { t: .86, e: E.douce, p: { y: 0, pointe: 0, aGu: 34, aGl: -14, aDu: -34, aDl: 14 } },
  { t: .98, e: E.douce, p: { y: 6.5, sy: .93, sx: 1.03, lGt: 10, lGs: -8, lDt: -10, lDs: 8, aGu: 35, aGl: -20, aDu: -35, aDl: 20, tete: 9 } },
  { t: 1.16, e: E.rebond, p: { y: 0, sy: 1, sx: 1, lGt: 4, lGs: 0, lDt: -4, lDs: 0, tete: -4, aGu: 10, aGl: 16, aDu: -75, aDl: -95, mD: 2 } },
  { t: 1.32, e: E.douce, p: { tete: -5 } },
  { t: FIN, e: E.douce, p: { tete: -3 } },
]);

const EXPRESSIONS: readonly ChangementDExpression<Emotion>[] = [
  { t: 0, emo: "sourire" },
  { t: .18, emo: "joie" },
  { t: 1.14, emo: "sourire" },
];

export const SCENARIO_DE_LILI = { poses: POSES, expressions: EXPRESSIONS } as const;

/** L'image fixe : la même dernière pose, mais au centre du cadre (la scène finit à `X_ARRIVEE` de là ; le dessin fixe de Lili est au centre). */
export const SCENARIO_FIXE_DE_LILI = {
  poses: POSES.map((image) => ({ ...image, p: { ...image.p, x: image.p.x - X_ARRIVEE } })),
  expressions: EXPRESSIONS,
} as const;
