import type { VarianteDe } from "@domain/motivation";
import { E } from "../commun/courbes.ts";
import type { ChangementDExpression } from "../commun/expressions.ts";
import { compiler, type ImageCle, type ImagePartielle, poseA as poseDeLaScene } from "../commun/poses.ts";

/**
 * Noisette ne se retourne jamais : `vue` va de -1 (trois-quarts gauche) à 1 (trois-quarts droit), 0 = de face.
 * Angles de bras : 0 = pendant, positif = vers l'extérieur du corps (g/d = côté gauche/droit de l'écran).
 * mG/mD : 0 main ouverte, 1 poing, 2 pouce levé, 3 doigts écartés. `joues` : 0 = normales, 1 = pleines.
 * `tenir` : la noisette dorée tenue entre les deux mains ; `tenirG` et `tenirD` : tenue dans une seule main.
 * `bras` : 1 = les bras lancent et rattrapent les noisettes du jonglage.
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
  joues: number;
  clin: number;
  lid: number;
  bras: number;
  tenir: number;
  tenirG: number;
  tenirD: number;
};

type Images = readonly ImagePartielle<Pose>[];

export const SOL_X = 190;
export const SOL_Y = 392;

const REPOS: Pose = {
  x: SOL_X,
  y: SOL_Y,
  rot: 0,
  sx: 1,
  sy: 1,
  vue: 0,
  tete: 0,
  regardX: 0,
  regardY: 0,
  aGu: 10,
  aGl: 14,
  aDu: 10,
  aDl: 14,
  mG: 0,
  mD: 0,
  joues: 0,
  clin: 0,
  lid: 0,
  bras: 0,
  tenir: 0,
  tenirG: 0,
  tenirD: 0,
};

const ACCROUPI: Partial<Pose> = { sy: .86, sx: 1.12 };
const ETIRE: Partial<Pose> = { sy: 1.1, sx: .94 };
const NORMAL: Partial<Pose> = { sy: 1, sx: 1 };
/** Les mains réunies devant la poitrine. */
const COUPE: Partial<Pose> = { aGu: -118, aGl: -28, aDu: -118, aDl: -28, mG: 0, mD: 0 };
const BRAS_PENDANTS: Partial<Pose> = { aGu: 10, aGl: 14, aDu: 10, aDl: 14 };

/** La noisette dorée tombe de l'arbre (le feuillage est à gauche) vers Noisette, qui l'attrape à `T_ATTRAPE`. */
export const CHUTE = { x0: 104, y0: 196, t0: .30 };
export const T_ATTRAPE = 1.02;
const T_VARIANTE = 1.45;
const DUREE_DE_LA_VARIANTE = 3.2;
const PAUSE_FINALE = .4;
const T_CRI = 1.3;
const T_JOIE = 1.25;
/** L'instant où les feuilles de la forêt se mettent à tomber. */
const T_FEUILLES = 1.35;

/** L'action commune aux trois variantes : Noisette voit la noisette tomber, se baisse, saute et l'attrape à deux mains. */
const ATTRAPE: Images = [
  { t: 0.00, e: E.douce, p: {} },
  { t: 0.30, e: E.douce, p: { vue: -.7, tete: -8, regardX: -3, regardY: -4, aGu: 30, aGl: 20, aDu: 20, aDl: 10 } },
  { t: 0.62, e: E.douce, p: { ...ACCROUPI, y: SOL_Y + 4, tete: -10, aGu: 60, aGl: 40, aDu: 50, aDl: 30, mG: 3, mD: 3 } },
  { t: 0.84, e: E.sortie, p: { ...ETIRE, y: SOL_Y - 30, x: SOL_X - 14, vue: -.4, tete: -6, aGu: 150, aGl: 20, aDu: 130, aDl: 20, regardY: -5 } },
  { t: 1.02, e: E.douce, p: { y: SOL_Y - 26, aGu: 128, aGl: 60, aDu: 118, aDl: 60, mG: 0, mD: 0, tenir: 1 } },
  { t: 1.20, e: E.entree, p: { ...ACCROUPI, y: SOL_Y + 6, tete: 2, vue: 0, regardX: 0, regardY: 0, aGu: -100, aGl: -40, aDu: -100, aDl: -40 } },
  { t: 1.40, e: E.rebond, p: { ...NORMAL, y: SOL_Y, x: SOL_X, tete: -4, ...COUPE } },
];

/** Le rythme du jonglage : le temps entre deux lancers, en secondes du temps de la maquette. */
export const BATTEMENT_DU_JONGLAGE = .42;

const jongle = (t0: number): Images => [
  { t: t0, e: E.douce, p: { tenir: 1 } },
  { t: t0 + .25, e: E.douce, p: { aGu: 12, aGl: -96, aDu: 12, aDl: -96, mG: 0, mD: 0, tenir: 0, tete: -6, regardY: -5, bras: 1 } },
  { t: t0 + 2.45, e: E.douce, p: { bras: 1, regardY: -6 } },
  { t: t0 + 2.65, e: E.rebond, p: { bras: 0, ...COUPE, tenir: 1, regardY: 0, tete: 6, clin: 1 } },
  { t: t0 + 3.0, e: E.douce, p: { clin: 1 } },
  { t: t0 + 3.2, e: E.douce, p: { clin: 0 } },
];

/** Noisette croque la noisette en la tenant près de sa bouche, puis se tapote le ventre. */
const mange = (t0: number): Images => [
  { t: t0, e: E.douce, p: { tenir: 1 } },
  { t: t0 + .30, e: E.douce, p: { aGu: -124, aGl: -72, aDu: -124, aDl: -72, tete: 4, regardY: 2 } },
  { t: t0 + .50, e: E.douce, p: { tete: 6, joues: .35 } }, { t: t0 + .62, e: E.douce, p: { tete: 2, joues: .15 } },
  { t: t0 + .74, e: E.douce, p: { tete: 7, joues: .45 } }, { t: t0 + .86, e: E.douce, p: { tete: 2, joues: .2 } },
  { t: t0 + .98, e: E.douce, p: { tete: 8, joues: .55 } }, { t: t0 + 1.10, e: E.douce, p: { tete: 2, joues: .25 } },
  { t: t0 + 1.22, e: E.douce, p: { tete: 8, joues: .6 } }, { t: t0 + 1.34, e: E.douce, p: { tete: 2, joues: .3 } },
  { t: t0 + 1.46, e: E.douce, p: { tete: 8, joues: .6 } }, { t: t0 + 1.60, e: E.douce, p: { tete: 0, joues: .9, tenir: 0 } },
  { t: t0 + 1.90, e: E.douce, p: { joues: .5, aGu: 20, aGl: 10, aDu: -60, aDl: -70, mD: 0, tete: -4 } },
  { t: t0 + 2.10, e: E.douce, p: { joues: .2, aDl: -60 } }, { t: t0 + 2.30, e: E.douce, p: { aDl: -74 } }, { t: t0 + 2.50, e: E.douce, p: { aDl: -60 } },
  { t: t0 + 2.80, e: E.douce, p: { joues: 0, lid: 0, tete: 5 } },
  { t: t0 + 3.2, e: E.douce, p: {} },
];

/** Noisette ramasse une noisette dans l'herbe, la met dans sa bouche (`cote` : -1 la main gauche, 1 la main droite), et les joues se remplissent. */
const ramasse = (t: number, cote: -1 | 1, n: number): Images => {
  const gauche = cote < 0;
  const main = gauche ? { tenirG: 1 } : { tenirD: 1 };
  return [
    { t, e: E.douce, p: { ...ACCROUPI, y: SOL_Y + 6, vue: cote * .6, tete: 10, regardY: 6, aGu: gauche ? 40 : 0, aGl: gauche ? 70 : 10, aDu: gauche ? 0 : 40, aDl: gauche ? 10 : 70, mG: 0, mD: 0, tenir: 0 } },
    { t: t + .22, e: E.douce, p: { ...NORMAL, y: SOL_Y, vue: cote * .3, tete: 2, regardY: 0, aGu: gauche ? -124 : 10, aGl: gauche ? -70 : 14, aDu: gauche ? 10 : -124, aDl: gauche ? 14 : -70, ...main } },
    { t: t + .42, e: E.rebond, p: { joues: .4 * n, tenirG: 0, tenirD: 0, ...BRAS_PENDANTS, vue: 0 } },
  ];
};

/** Noisette remplit ses joues de noisettes (une, puis deux, puis trois), et reste fière, les joues rondes, avec un clin d'œil. */
const joues = (t0: number): Images => [
  { t: t0, e: E.douce, p: { tenir: 1 } },
  { t: t0 + .22, e: E.douce, p: { aGu: -124, aGl: -70, aDu: -124, aDl: -70 } },
  { t: t0 + .42, e: E.rebond, p: { joues: .4, tenir: 0, ...BRAS_PENDANTS } },
  ...ramasse(t0 + .6, -1, 2), ...ramasse(t0 + 1.25, 1, 3),
  { t: t0 + 2.2, e: E.rebond, p: { joues: 1.3, ...NORMAL, tete: -4, aGu: 70, aGl: 20, aDu: 70, aDl: 20, mG: 3, mD: 3, clin: 1 } },
  { t: t0 + 2.8, e: E.douce, p: { clin: 0 } },
  { t: t0 + 3.2, e: E.douce, p: {} },
];

const VARIANTES: Record<VarianteDe<"animaux">, (t0: number) => Images> = { jongle, mange, joues };

export const poseA = (poses: readonly ImageCle<Pose>[], t: number): Pose => poseDeLaScene(REPOS, poses, t);

export type Emotion = "sourire" | "concentration" | "surprise" | "joie" | "pleines" | "croque";

export type ScenarioDesAnimaux = {
  readonly variante: VarianteDe<"animaux">;
  /** Fin de la scène, en secondes du temps de la maquette (la scène est ensuite accélérée pour tenir en 3 s). */
  readonly fin: number;
  readonly poses: readonly ImageCle<Pose>[];
  readonly expressions: readonly ChangementDExpression<Emotion>[];
  readonly tCri: number;
  readonly tJoie: number;
  readonly tFeuilles: number;
  /** Le début du jonglage (`null` : cette variante ne jongle pas). */
  readonly tJongle: number | null;
  /** Le début de la noisette croquée (`null` : cette variante ne croque pas). */
  readonly tCroque: number | null;
};

const EXPRESSIONS_DE_L_ATTRAPE: readonly ChangementDExpression<Emotion>[] = [
  { t: 0, emo: "sourire" },
  { t: 0.3, emo: "concentration" },
  { t: T_ATTRAPE, emo: "surprise" },
  { t: 1.25, emo: "joie" },
];

const EXPRESSIONS_DE_LA_VARIANTE: Record<VarianteDe<"animaux">, readonly ChangementDExpression<Emotion>[]> = {
  jongle: [{ t: T_VARIANTE + 2.65, emo: "joie" }],
  mange: [{ t: T_VARIANTE + .3, emo: "croque" }, { t: T_VARIANTE + 1.9, emo: "joie" }],
  joues: [{ t: T_VARIANTE + .22, emo: "pleines" }, { t: T_VARIANTE + 2.2, emo: "sourire" }],
};

export function scenarioDesAnimaux(variante: VarianteDe<"animaux">): ScenarioDesAnimaux {
  return {
    variante,
    fin: T_VARIANTE + DUREE_DE_LA_VARIANTE + PAUSE_FINALE,
    poses: compiler(REPOS, [...ATTRAPE, ...VARIANTES[variante](T_VARIANTE)]),
    expressions: [...EXPRESSIONS_DE_L_ATTRAPE, ...EXPRESSIONS_DE_LA_VARIANTE[variante]],
    tCri: T_CRI,
    tJoie: T_JOIE,
    tFeuilles: T_FEUILLES,
    tJongle: variante === "jongle" ? T_VARIANTE + .25 : null,
    tCroque: variante === "mange" ? T_VARIANTE + .5 : null,
  };
}
