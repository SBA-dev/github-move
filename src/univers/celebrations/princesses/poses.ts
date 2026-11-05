import type { VarianteDe } from "@domain/motivation";
import { E } from "../commun/courbes.ts";
import type { ChangementDExpression } from "../commun/expressions.ts";
import { compiler, type ImageCle, type ImagePartielle, poseA as poseDeLaScene } from "../commun/poses.ts";

/**
 * Angles en degrés. `vue` : -1 (trois-quarts gauche) à 1 (trois-quarts droit), 0 = de face : Lumi ne se montre jamais de dos.
 * Bras : 0 = pendant, positif = vers l'extérieur, plus de 90 = levé. g/d = côté gauche/droit de l'écran.
 * mG/mD : 0 main ouverte, 1 poing, 3 doigts écartés. `vol` : 0 elle flotte, 1 elle vole (ailes vives).
 */
export type Pose = {
  x: number;
  y: number;
  rot: number;
  sx: number;
  sy: number;
  vue: number;
  tete: number;
  regardX: number;
  regardY: number;
  aGu: number;
  aGl: number;
  aDu: number;
  aDl: number;
  mG: number;
  mD: number;
  clin: number;
  vol: number;
};

type Images = readonly ImagePartielle<Pose>[];

/** Là où Lumi se pose, et là où la fleur éclot. */
export const SOL = { x: 150, y: 378 };
export const FLEUR = { x: 262, y: 392 };

const REPOS: Pose = {
  x: SOL.x,
  y: SOL.y,
  rot: 0,
  sx: 1,
  sy: 1,
  vue: 0,
  tete: 0,
  regardX: 0,
  regardY: 0,
  aGu: 12,
  aGl: 14,
  aDu: 12,
  aDl: 14,
  mG: 0,
  mD: 1,
  clin: 0,
  vol: 0,
};

const PLIE: Partial<Pose> = { sy: .92, sx: 1.06 };
const ETIRE: Partial<Pose> = { sy: 1.06, sx: .96 };
const NORMAL: Partial<Pose> = { sy: 1, sx: 1 };
const BRAS_EN_COURONNE: Partial<Pose> = { aGu: 150, aGl: 10, aDu: 150, aDl: 10, mG: 3, mD: 1 };

/** L'instant où l'étincelle quitte la baguette, et celui où la fleur éclot (temps de la maquette). */
export const T_SORT = .62;
export const T_ECLOT = 1.1;
const T_CELEBRATION = 1.5;
const DUREE_DE_LA_VARIANTE = 3.2;
const PAUSE_FINALE = .4;

/**
 * Le sort, commun aux trois variantes : la baguette dessine un grand rond doux au-dessus de Lumi, puis se pose, levée.
 * L'étincelle s'en détache et flotte jusqu'à la fleur. Aucun geste sec ni pointé : pas de recul, pas de saccade, pas de visée.
 */
const SORT: Images = [
  { t: 0.00, e: E.douce, p: {} },
  { t: 0.30, e: E.douce, p: { vue: .3, tete: 4, regardX: 3, aDu: 90, aDl: 60, aGu: 20, aGl: 20 } },
  { t: 0.46, e: E.douce, p: { aDu: 150, aDl: 20, tete: 4, regardX: 3, regardY: -4 } },
  { t: 0.64, e: E.douce, p: { aDu: 140, aDl: -10, tete: 0, vue: .45 } },
  { t: 0.84, e: E.douce, p: { aDu: 155, aDl: 5, tete: -2, vue: .2 } },
  { t: 1.10, e: E.douce, p: { regardY: 4, tete: 6, aDu: 150, aDl: 10 } },
  { t: 1.40, e: E.rebond, p: { vue: .2, tete: -4, regardX: 0, regardY: 0, aGu: 120, aGl: 30, aDu: 135, aDl: 10, mG: 3, y: SOL.y - 4 } },
];

const arc = (t0: number): Images => [
  { t: t0, e: E.douce, p: {} },
  { t: t0 + .30, e: E.douce, p: { vue: 0, aDu: 170, aDl: 10, aGu: 20, aGl: 14, tete: -6, regardY: -6 } },
  { t: t0 + 1.50, e: E.douce, p: { aDu: 100, aDl: -60, vue: .3, tete: 6, regardX: 4 } },
  { t: t0 + 1.90, e: E.rebond, p: { ...BRAS_EN_COURONNE, vue: 0, tete: -4, regardY: -4, clin: 1 } },
  { t: t0 + 2.70, e: E.douce, p: { clin: 0 } },
  { t: t0 + 3.20, e: E.douce, p: {} },
];

const envol = (t0: number): Images => [
  { t: t0, e: E.douce, p: {} },
  { t: t0 + .20, e: E.douce, p: { ...PLIE, y: SOL.y + 6, aGu: 30, aGl: 20, aDu: 30, aDl: 20 } },
  { t: t0 + .55, e: E.sortie, p: { ...ETIRE, x: 168, y: 330, vol: 1, aGu: 120, aGl: 10, aDu: 150, aDl: 20, rot: -8, tete: -8, regardY: -6, vue: .4 } },
  { t: t0 + 1.00, e: E.douce, p: { x: 232, y: 306, rot: 10, vue: .8, tete: -4 } },
  { t: t0 + 1.45, e: E.douce, p: { x: 180, y: 294, rot: 0, vue: 0, tete: 0, aGu: 110, aDu: 110, aDl: 30 } },
  { t: t0 + 1.90, e: E.douce, p: { x: 124, y: 306, rot: -12, vue: -.8, tete: 4 } },
  { t: t0 + 2.40, e: E.douce, p: { x: 140, y: 346, rot: -4, vue: -.3, aGu: 60, aGl: 20, aDu: 70, aDl: -10 } },
  { t: t0 + 2.85, e: E.sortie, p: { ...NORMAL, x: SOL.x, y: SOL.y, rot: 0, vol: 0, vue: 0, tete: -4, aGu: 40, aGl: 30, aDu: 60, aDl: -20, mG: 3, regardY: 0 } },
  { t: t0 + 3.20, e: E.douce, p: {} },
];

const signes = (t0: number): Images => [
  { t: t0, e: E.douce, p: {} },
  { t: t0 + .35, e: E.douce, p: { aDu: 120, aDl: -50, aGu: 100, aGl: -40, mG: 3, tete: -4, regardY: -4 } },
  { t: t0 + .9, e: E.douce, p: { vue: -.5, aDu: 130, aDl: -30, regardX: -4 } },
  { t: t0 + 1.5, e: E.douce, p: { vue: .5, aDu: 110, aDl: -60, regardX: 4 } },
  { t: t0 + 2.1, e: E.douce, p: { vue: 0, aDu: 160, aDl: 0, regardX: 0, regardY: -8, tete: -6 } },
  { t: t0 + 2.5, e: E.rebond, p: { ...BRAS_EN_COURONNE, clin: 1, tete: -4, regardY: -2 } },
  { t: t0 + 3.0, e: E.douce, p: { clin: 0 } },
  { t: t0 + 3.20, e: E.douce, p: {} },
];

const VARIANTES: Record<VarianteDe<"princesse">, (t0: number) => Images> = { arc, envol, signes };

export const poseA = (poses: readonly ImageCle<Pose>[], t: number): Pose => poseDeLaScene(REPOS, poses, t);

export type Emotion = "sourire" | "concentration" | "surprise" | "joie";

export type ScenarioDesPrincesses = {
  readonly variante: VarianteDe<"princesse">;
  /** Fin de la scène, en secondes du temps de la maquette (la scène est ensuite accélérée pour tenir en 3 s). */
  readonly fin: number;
  readonly poses: readonly ImageCle<Pose>[];
  readonly expressions: readonly ChangementDExpression<Emotion>[];
  readonly tCri: number;
  readonly tJoie: number;
  /** L'instant où l'arc-en-ciel, l'envol ou les chiffres commencent. */
  readonly tVariante: number;
  /** L'instant où les étincelles et les pétales tombent du ciel (après la redescente, pour l'envol). */
  readonly tPluie: number;
};

export function scenarioDesPrincesses(variante: VarianteDe<"princesse">): ScenarioDesPrincesses {
  const envole = variante === "envol";
  return {
    variante,
    fin: T_CELEBRATION + DUREE_DE_LA_VARIANTE + PAUSE_FINALE,
    poses: compiler(REPOS, [...SORT, ...VARIANTES[variante](T_CELEBRATION)]),
    expressions: [{ t: 0, emo: "sourire" }, { t: .3, emo: "concentration" }, { t: T_ECLOT, emo: "surprise" }, { t: 1.4, emo: "joie" }],
    tCri: envole ? T_CELEBRATION + 2.9 : 1.45,
    tJoie: 1.4,
    tVariante: T_CELEBRATION + (variante === "signes" ? .35 : .3),
    tPluie: envole ? T_CELEBRATION + 2.9 : T_CELEBRATION,
  };
}
