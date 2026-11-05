import type { VarianteDe } from "@domain/motivation";
import { E } from "../commun/courbes.ts";
import type { ChangementDExpression } from "../commun/expressions.ts";
import { compiler, type ImageCle, type ImagePartielle, poseA as poseDeLaScene } from "../commun/poses.ts";

/**
 * Capitaine Sam : les angles sont en degrés, positifs = sens horaire (g/d = côté gauche/droit de l'écran). `vue` : 0 = de face, ±38 = trois-quarts,
 * jamais de dos. mG/mD : 0 main ouverte, 1 poing, 2 pouce levé, 3 doigts écartés. `sx`/`sy` écrasent ou étirent le corps.
 * Les autres champs sont des interrupteurs ou des dosages (0 à 1) : `tenue` (la lance est dans les deux mains), `sol` (la lance va se poser au sol), `posee` (elle y est),
 * `devant` (les deux bras passent devant le buste), `corde` (la main droite tient la corde de la cloche), `arc` (l'arc-en-ciel se dévoile) ;
 * `lA`, `lX` et `lY` placent la lance (angle, point tenu par la main arrière) ; `jetA` et `jetB` sont la tête et la queue du jet (0 à 1), `force` la vitesse de l'eau.
 */
export type Pose = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  torse: number;
  tete: number;
  vue: number;
  regardX: number;
  regardY: number;
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
  mG: number;
  mD: number;
  clin: number;
  devant: number;
  tenue: number;
  lA: number;
  lX: number;
  lY: number;
  sol: number;
  posee: number;
  jetA: number;
  jetB: number;
  force: number;
  corde: number;
  arc: number;
};

export type Emotion = "sourire" | "concentration" | "surprise" | "joie" | "coin" | "hum";

export const ECHELLE_DE_BASE = 1.15;
export const SOL = 382;
const Y_SOL = SOL - 58 * ECHELLE_DE_BASE;
const X_SAM = 108;
export const VUE_MAXIMALE = 38;
/** Là où la lance se pose au sol, devant lui. */
export const LANCE_AU_SOL = { x: X_SAM + 34, y: SOL - 4, a: 0 };

/** Sam arrose le jardin pendant `FIN_DE_L_ARROSAGE` secondes (temps de la maquette), puis joue la variante tirée. */
export const FIN_DE_L_ARROSAGE = 2.0;
const T0 = FIN_DE_L_ARROSAGE;

/**
 * Les instants (temps de la maquette) où l'eau atteint chacune des cinq fleurs du jardin, dans l'ordre de `FLEURS` : les mêmes pour les trois variantes,
 * puisque l'arrosage est commun. Mesurés une fois en rejouant l'arrosage image par image (60 par seconde), au premier instant où le bout du jet
 * retombé est à moins de 9 de la fleur ; à refaire si les poses de l'arrosage ou la position des fleurs changent.
 */
export const INSTANTS_OU_LES_FLEURS_S_OUVRENT: readonly number[] = [0.4333333333333333, 0.7500000000000007, 1.2000000000000006, 1.5833333333333326, 1.6833333333333322];

const REPOS: Pose = {
  x: X_SAM,
  y: Y_SOL,
  sx: 1,
  sy: 1,
  torse: 0,
  tete: 0,
  vue: 0,
  regardX: 0,
  regardY: 0,
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
  mG: 0,
  mD: 0,
  clin: 0,
  devant: 0,
  tenue: 1,
  lA: -18,
  lX: 10,
  lY: 2,
  sol: 0,
  posee: 0,
  jetA: 0,
  jetB: 0,
  force: 210,
  corde: 0,
  arc: 0,
};

type Images = readonly ImagePartielle<Pose>[];

const BRAS_BAS: Partial<Pose> = { aGu: 8, aGl: 14, aDu: -8, aDl: -14, mG: 0, mD: 0 };
const V: Partial<Pose> = { aGu: 152, aGl: 20, aDu: -152, aDl: -20, mG: 3, mD: 3 };
const DEBOUT: Partial<Pose> = { lGt: 5, lGs: 0, lDt: -5, lDs: 0, fG: 1, fD: 1, tG: 1, tD: 1 };
const ACCROUPI: Partial<Pose> = { lGt: 30, lGs: -24, lDt: -30, lDs: 24 };
const TRES_ACCROUPI: Partial<Pose> = { lGt: 44, lGs: -46, lDt: -44, lDs: 46 };

/** Il pose la lance au sol, accroupi : commun aux trois variantes. */
const poseLance = (t: number): Images => [
  { t, e: E.douce, p: { torse: 26, y: Y_SOL + 20, ...TRES_ACCROUPI, sy: .95, sx: 1.03, regardY: 8, regardX: 6, tete: -4, vue: 26, sol: 1 } },
  { t: t + .04, e: E.lineaire, p: { tenue: 0, posee: 1, aGu: -22, aGl: -8, aDu: -34, aDl: -8, mG: 3, mD: 3 } },
];

const seRelever = (t: number, extra: Partial<Pose> = {}): ImagePartielle<Pose> => ({
  t,
  e: E.sortie,
  p: { torse: 0, y: Y_SOL, ...DEBOUT, sy: 1, sx: 1, devant: 0, ...BRAS_BAS, ...extra },
});

const coupeLeJet = (t: number, d = .24): Images => [{ t: t + d, e: E.douce, p: { jetB: 1 } }, { t: t + d + .02, e: E.lineaire, p: { jetA: 0, jetB: 0 } }];

/** L'action, toujours la même : Sam arrose le jardin, le jet balaie le parterre de gauche à droite, les fleurs s'ouvrent une à une. */
const ARROSAGE: Images = [
  { t: 0.00, e: E.douce, p: { vue: VUE_MAXIMALE, devant: 1, tete: 4, regardX: 6, regardY: 4, force: 160, lA: -18 } },
  { t: 0.12, e: E.douce, p: {} },
  { t: 0.24, e: E.douce, p: { torse: -3, sy: .98, sx: 1.01 } },
  { t: 0.50, e: E.sortie, p: { jetA: 1, torse: 2, sy: 1, sx: 1, force: 166 } },
  { t: 0.95, e: E.douce, p: { force: 200, tete: 6, torse: 3 } },
  { t: 1.40, e: E.douce, p: { force: 236, tete: 3, regardX: 8 } },
  { t: 1.85, e: E.douce, p: { force: 294, lA: -20, torse: 4, tete: 5 } },
  { t: T0, e: E.douce, p: {} },
];

/** Il coupe l'eau, pose la lance, saute et tire la corde : la cloche sonne, saut de joie bras en V, clin d'œil. */
const cloche: Images = [
  { t: T0, e: E.douce, p: {} },
  ...coupeLeJet(T0, .2),
  ...poseLance(T0 + .5),
  seRelever(T0 + .74, { vue: 12, tete: -10, regardY: -7, regardX: 3 }),
  { t: T0 + .94, e: E.douce, p: { y: Y_SOL + 12, sy: .88, sx: 1.1, ...ACCROUPI, aGu: 30, aGl: 24, aDu: -30, aDl: -30, torse: 3 } },
  { t: T0 + 1.16, e: E.sortie, p: { y: Y_SOL - 58, sy: 1.08, sx: .94, lGt: 16, lGs: 36, lDt: -8, lDs: 22, aDu: -172, aDl: 4, mD: 1, aGu: 70, aGl: 30, mG: 3, torse: -2, corde: 1 } },
  { t: T0 + 1.40, e: E.entree, p: { y: Y_SOL + 8, sy: .9, sx: 1.08, ...ACCROUPI, aDu: -150, aDl: -40, torse: 4 } },
  { t: T0 + 1.56, e: E.sortie, p: { y: Y_SOL, sy: 1, sx: 1, ...DEBOUT, aDu: -130, aDl: -44 } },
  { t: T0 + 1.60, e: E.lineaire, p: { corde: 0, mD: 3 } },
  { t: T0 + 1.78, e: E.douce, p: { vue: 0, aDu: -40, aDl: -20, aGu: 40, aGl: 20, mG: 0, mD: 0, tete: -6, regardY: -5, regardX: 2 } },
  { t: T0 + 1.96, e: E.douce, p: { y: Y_SOL + 12, sy: .86, sx: 1.12, ...ACCROUPI, aGu: 44, aGl: 24, aDu: -44, aDl: -24, mG: 1, mD: 1, torse: 4, tete: 0, regardY: 0, regardX: 0 } },
  { t: T0 + 2.18, e: E.sortie, p: { y: Y_SOL - 60, sy: 1.1, sx: .92, torse: -3, ...V, lGt: 18, lGs: 60, lDt: -18, lDs: -60, tG: .7, tD: .7, tete: -6 } },
  { t: T0 + 2.40, e: E.entree, p: { y: Y_SOL + 8, sy: .9, sx: 1.08, torse: 2, ...ACCROUPI, tG: 1, tD: 1, tete: 3 } },
  { t: T0 + 2.60, e: E.rebond, p: { y: Y_SOL, sy: 1, sx: 1, torse: 0, ...DEBOUT, aGu: 146, aGl: 22, aDu: -146, aDl: -22, tete: -2 } },
  { t: T0 + 2.78, e: E.douce, p: { clin: 1, tete: -5 } },
  { t: T0 + 3.12, e: E.douce, p: { clin: 0, tete: -3 } },
];

/** Il lève la lance et balaie le ciel d'un grand arc d'eau, l'arc-en-ciel apparaît ; il pose la lance, pouce levé, clin d'œil. */
const arc: Images = [
  { t: T0, e: E.douce, p: {} },
  { t: T0 + .30, e: E.douce, p: { lA: -40, force: 300, torse: -3, tete: -4, regardY: -3, regardX: 6, lX: 14, lY: -2 } },
  { t: T0 + .32, e: E.lineaire, p: { arc: 0 } },
  { t: T0 + .80, e: E.douce, p: { lA: -56, force: 380, torse: -5, tete: -8, regardY: -6, lX: 16, lY: -4 } },
  { t: T0 + 1.30, e: E.douce, p: { lA: -68, force: 450, torse: -7, tete: -10, regardY: -7, regardX: 4 } },
  { t: T0 + 1.42, e: E.douce, p: { arc: 1 } },
  ...coupeLeJet(T0 + 1.30, .14),
  ...poseLance(T0 + 1.76),
  seRelever(T0 + 2.00, { vue: 0, tete: -5, regardY: -4, regardX: -2 }),
  { t: T0 + 2.30, e: E.rebond, p: { aDu: -78, aDl: -100, mD: 2, tete: -6, regardX: 0, regardY: 0 } },
  { t: T0 + 2.52, e: E.douce, p: { clin: 1, tete: -7 } },
  { t: T0 + 2.86, e: E.douce, p: { clin: 0, tete: -4 } },
  { t: T0 + 3.10, e: E.douce, p: {} },
];

/** Jet tout droit vers le haut, l'eau retombe en petite pluie scintillante ; il pose la lance, rit bras ouverts, s'ébroue, pouce levé. */
const pluie: Images = [
  { t: T0, e: E.douce, p: {} },
  { t: T0 + .32, e: E.douce, p: { lA: -78, lX: 18, lY: -6, force: 470, torse: -6, tete: -8, regardY: -7, regardX: 4, vue: 24 } },
  { t: T0 + .74, e: E.douce, p: {} },
  ...coupeLeJet(T0 + .74, .16),
  ...poseLance(T0 + 1.12),
  seRelever(T0 + 1.36, { vue: 0, aGu: 82, aGl: 12, aDu: -82, aDl: -12, mG: 3, mD: 3, tete: -10, regardY: -6, regardX: 0 }),
  { t: T0 + 1.56, e: E.douce, p: { aGu: 104, aGl: 16, aDu: -104, aDl: -16, tete: -8 } },
  { t: T0 + 1.76, e: E.douce, p: { torse: 7, tete: -12, sx: 1.03, aGu: 60, aGl: 30, aDu: -60, aDl: -30, regardY: 0 } },
  { t: T0 + 1.96, e: E.douce, p: { torse: -7, tete: 12, sx: .98 } },
  { t: T0 + 2.16, e: E.douce, p: { torse: 5, tete: -9, sx: 1.02 } },
  { t: T0 + 2.34, e: E.douce, p: { torse: 0, tete: 0, sx: 1, ...BRAS_BAS } },
  { t: T0 + 2.56, e: E.rebond, p: { aDu: -78, aDl: -100, mD: 2, tete: -6 } },
  { t: T0 + 2.74, e: E.douce, p: { clin: 1, tete: -7 } },
  { t: T0 + 3.06, e: E.douce, p: { clin: 0, tete: -4 } },
];

export const poseA = (poses: readonly ImageCle<Pose>[], t: number): Pose => poseDeLaScene(REPOS, poses, t);

type Bulle = { readonly t: number; readonly texte: string; readonly x: number; readonly y: number };

export type ScenarioDesPompiers = {
  /** Fin de la scène, en secondes du temps de la maquette (la scène est ensuite accélérée pour tenir en `DUREE_DE_LA_CELEBRATION_S`). */
  readonly fin: number;
  readonly poses: readonly ImageCle<Pose>[];
  readonly expressions: readonly ChangementDExpression<Emotion>[];
  /** Le cri de victoire arrive, et les pétales de la caserne partent. */
  readonly tCri: number;
  /** Il tire la corde de la cloche, puis la lâche (`null` : cette variante n'a pas de cloche). */
  readonly tTire: number | null;
  readonly tLache: number | null;
  /** Les étincelles du pouce levé (`null` : pas de pouce levé). */
  readonly tPouce: number | null;
  /** La pluie joyeuse commence, et Sam s'ébroue (`null` : cette variante n'a pas de pluie). */
  readonly tPluie: number | null;
  readonly tEbroue: number | null;
  /** Les bulles écrites (« ding ! », « dong ! ») : aucun son. */
  readonly bulles: readonly Bulle[];
};

const EXPRESSIONS_DE_L_ARROSAGE: readonly ChangementDExpression<Emotion>[] = [
  { t: 0, emo: "concentration" },
  { t: .95, emo: "sourire" },
  { t: 1.86, emo: "coin" },
];

const EXPRESSIONS_DE_LA_VARIANTE: Record<VarianteDe<"pompier">, readonly ChangementDExpression<Emotion>[]> = {
  cloche: [{ t: T0 + .74, emo: "hum" }, { t: T0 + .94, emo: "concentration" }, { t: T0 + 1.4, emo: "joie" }, { t: T0 + 1.96, emo: "sourire" }, { t: T0 + 2.18, emo: "joie" }],
  arc: [{ t: T0 + .3, emo: "concentration" }, { t: T0 + .9, emo: "surprise" }, { t: T0 + 1.2, emo: "joie" }, { t: T0 + 1.76, emo: "sourire" }, { t: T0 + 2.3, emo: "joie" }],
  pluie: [{ t: T0 + .32, emo: "concentration" }, { t: T0 + .9, emo: "surprise" }, { t: T0 + 1.36, emo: "joie" }, { t: T0 + 2.34, emo: "sourire" }, { t: T0 + 2.56, emo: "joie" }],
};

const VARIANTES: Record<VarianteDe<"pompier">, { poses: Images; fin: number; tCri: number }> = {
  cloche: { poses: cloche, fin: 5.3, tCri: T0 + 2.40 },
  arc: { poses: arc, fin: 5.2, tCri: T0 + 2.30 },
  pluie: { poses: pluie, fin: 5.2, tCri: T0 + 2.36 },
};

const BULLES_DE_LA_CLOCHE: readonly Bulle[] = [{ t: T0 + 1.46, texte: "ding !", x: 214, y: 100 }, { t: T0 + 1.78, texte: "dong !", x: 230, y: 142 }];

const T_POUCE: Record<VarianteDe<"pompier">, number | null> = { cloche: null, arc: T0 + 2.3, pluie: T0 + 2.56 };

export function scenarioDesPompiers(variante: VarianteDe<"pompier">): ScenarioDesPompiers {
  const { poses, fin, tCri } = VARIANTES[variante];
  return {
    fin,
    poses: compiler(REPOS, [...ARROSAGE, ...poses]),
    expressions: [...EXPRESSIONS_DE_L_ARROSAGE, ...EXPRESSIONS_DE_LA_VARIANTE[variante]],
    tCri,
    tTire: variante === "cloche" ? T0 + 1.40 : null,
    tLache: variante === "cloche" ? T0 + 1.60 : null,
    tPouce: T_POUCE[variante],
    tPluie: variante === "pluie" ? T0 + .62 : null,
    tEbroue: variante === "pluie" ? T0 + 1.72 : null,
    bulles: variante === "cloche" ? BULLES_DE_LA_CLOCHE : [],
  };
}
