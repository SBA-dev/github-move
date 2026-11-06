import { brasVers } from "../../celebrations/commun/atteindre.ts";
import { E } from "../../celebrations/commun/courbes.ts";
import { compiler } from "../../celebrations/commun/poses.ts";
import { type Pose, REPOS, REPOS_DU_CHIOT, Y_SOL } from "../../celebrations/police/poses.ts";
import type { ScenarioDeMax } from "../../celebrations/police/personnage.ts";
import type { ScenarioDuChiot } from "../../celebrations/police/chiot.ts";

/** Fin de la scène, en secondes : la scène est jouée à cette vitesse, sans accélération. */
export const FIN = 1.5;
/** Où le chiot s'assoit à la fin, à la droite de Max (la place libre du cadre), dans le repère de la place du moteur. */
const X_CHIOT_FINAL = 262;

/** Les instants de la scène, en secondes. */
export const T = {
  /** Max se penche vers le chiot. */
  penche: .14,
  /** La casquette quitte sa tête, la bulle « oups ! » paraît, puis la casquette est au sol. */
  glisse: .15,
  oups: .16,
  atterrit: .32,
  chiotSeLeve: .2,
  /** Le chiot prend la casquette. */
  chiotPrend: .4,
  /** Max tend la main, puis il prend la casquette, puis il la remet sur sa tête. */
  maxTend: .78,
  maxPrend: .9,
  surLaTete: 1.12,
  pouce: 1.2,
} as const;

/** Les bras qui amènent les mains sur des cibles du repère du buste (`null` : ce bras ne bouge pas). */
function mains(g: readonly [number, number] | null, d: readonly [number, number] | null): Partial<Pose> {
  const gauche = g && brasVers("g", { x: g[0], y: g[1] }), droite = d && brasVers("d", { x: d[0], y: d[1] });
  return { ...(gauche ? { aGu: gauche.a1, aGl: gauche.a2 } : {}), ...(droite ? { aDu: droite.a1, aDl: droite.a2 } : {}) };
}

const BRAS_BAS: Partial<Pose> = { aGu: 8, aGl: 14, aDu: -8, aDl: -14, mG: 0, mD: 0 };
const GENOUX_FLECHIS: Partial<Pose> = { lGt: 22, lGs: -18, lDt: -22, lDs: 18 };
const DEBOUT: Partial<Pose> = { lGt: 5, lGs: 0, lDt: -5, lDs: 0 };

/** Max est de face, d'aplomb, sur place : il se penche vers le chiot, sa casquette glisse ; il rit, la reprend, la remet, puis lève le pouce. */
const POSES = compiler(REPOS, [
  { t: 0, e: E.douce, p: {} },
  { t: T.penche, e: E.sortie, p: { torse: 16, tete: 8, vue: 16, regardX: 6, regardY: 7, y: Y_SOL + 5, lGt: 12, lDt: -12, ...mains(null, [30, 22]) } },
  { t: T.glisse + .02, e: E.douce, p: { casq: 0, tete: 10 } },
  { t: .36, e: E.douce, p: { tete: 4, regardY: 9, ...mains(null, [34, 26]) } },
  { t: .6, e: E.douce, p: { torse: 8, tete: 2, vue: 12, y: Y_SOL + 2, lGt: 8, lDt: -8 } },
  { t: T.maxTend, e: E.douce, p: { torse: 20, tete: 4, regardY: 8, y: Y_SOL + 10, ...GENOUX_FLECHIS, ...mains(null, [38, 38]), mD: 0 } },
  { t: T.maxPrend, e: E.douce, p: { mD: 1 } },
  { t: T.surLaTete - .12, e: E.sortie, p: { torse: 0, tete: -2, vue: 0, regardX: 0, regardY: 0, y: Y_SOL, ...DEBOUT, ...mains(null, [30, -78]), mD: 1 } },
  { t: T.surLaTete, e: E.douce, p: { casq: 1 } },
  { t: T.pouce, e: E.douce, p: { ...BRAS_BAS, tete: 3, aGu: 112, aGl: 74, mG: 2 } },
  { t: FIN, e: E.douce, p: { tete: 5 } },
]);

/** Le chiot reste au sol : il se lève, prend la casquette, fait un demi-tour sur place et deux petits pas sautillés, la queue qui remue, la rapporte et s'assoit. */
const CHIOT = compiler(REPOS_DU_CHIOT, [
  { t: 0, e: E.douce, p: { x: 275, dir: -1, assis: 1, queue: 1.4, lang: 1 } },
  { t: T.chiotSeLeve, e: E.douce, p: { assis: 1 } },
  { t: T.chiotSeLeve + .08, e: E.sortie, p: { assis: 0, queue: 2.4 } },
  { t: T.chiotPrend, e: E.douce, p: { x: 262 } },
  { t: .5, e: E.douce, p: { y: -4, x: 256 } },
  { t: .56, e: E.douce, p: { dir: 1, y: 0, x: 250 } },
  { t: .64, e: E.douce, p: { y: -4 } },
  { t: .7, e: E.douce, p: { dir: -1, y: 0, x: 256 } },
  { t: .86, e: E.douce, p: { x: 252 } },
  { t: .96, e: E.sortie, p: { assis: 1, queue: 1.6, x: X_CHIOT_FINAL } },
  { t: FIN, e: E.douce, p: { queue: 1.4 } },
]);

/** Max est souriant, puis surpris quand la casquette glisse, puis il rit, puis il sourit. */
const EXPRESSIONS = [
  { t: 0, emo: "sourire" },
  { t: .16, emo: "surprise" },
  { t: .34, emo: "joie" },
  { t: 1.16, emo: "sourire" },
] as const;

export const SCENARIO_DE_MAX: ScenarioDeMax & ScenarioDuChiot = {
  poses: POSES,
  chiot: CHIOT,
  expressions: EXPRESSIONS,
  tLance: null,
  tRattrape: null,
  tTrottinette: null,
};
