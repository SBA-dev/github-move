import type { VarianteDe } from "@domain/motivation";
import { E, lerp } from "../commun/courbes.ts";
import type { ChangementDExpression } from "../commun/expressions.ts";
import { compiler, type ImageCle, type ImagePartielle, poseA as poseDeLaScene } from "../commun/poses.ts";
import { brasVers } from "../commun/atteindre.ts";

/**
 * Agent Max : les angles sont en degrés, positifs = sens horaire (g/d = côté gauche/droit de l'écran). `vue` : 0 = de face, ±38 = trois-quarts,
 * jamais de dos. mG/mD : 0 main ouverte, 1 poing, 2 pouce levé, 3 doigts écartés. Les autres champs sont des interrupteurs ou des dosages (0 à 1) :
 * `marche` (cycle de pas), `loupe` (tenue en main) et `loupeSol` (posée au sol), `gants`, `sif` (1 = sifflet dans la main droite, 2 = dans la gauche),
 * `casq` (casquette sur la tête) et `casque`, `trot` (sur la trottinette), `salut`, `sonnette`, `libre` (jambe de poussée relevée derrière),
 * `pied` et `piedH` (où le pied de poussée touche le sol, et de combien il s'en lève).
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
  marche: number;
  mG: number;
  mD: number;
  clin: number;
  loupe: number;
  loupeSol: number;
  gants: number;
  sif: number;
  casq: number;
  casque: number;
  trot: number;
  salut: number;
  sonnette: number;
  pied: number;
  piedH: number;
  libre: number;
};

/** Le chiot : `dir` ±1 (vers où il regarde), `assis`, `saut`, `queue` (vitesse de la queue), `vis` (caché dans le buisson ou non), `bras` (de profil au sol, ou de face dans les bras), `lang` (langue). */
export type PoseDuChiot = {
  x: number;
  y: number;
  dir: number;
  assis: number;
  saut: number;
  queue: number;
  vis: number;
  bras: number;
  lang: number;
  rot: number;
  sx: number;
  sy: number;
};

export type Emotion = "sourire" | "concentration" | "surprise" | "joie" | "hum";

export const ECHELLE_DE_BASE = 1.15;
export const SOL = 382;
const Y_SOL = SOL - 58 * ECHELLE_DE_BASE;
export const X_MAX = 196;
const X_CHIOT = 148;
export const BUISSON = { x: 334, y: SOL };

const X_DEBUT = 130;
const VUE = 38;

/**
 * Le temps de la scène est celui de la maquette, raccourci (106.38) : l'enquête dure `FIN_DE_L_ENQUETE` secondes (4 s dans la maquette),
 * chaque variante 2,3 à 3 s (4 à 5,2 s dans la maquette). La scène entière (environ 5 s) est ensuite accélérée pour tenir en `DUREE_DE_LA_CELEBRATION_S`.
 */
const FIN_DE_L_ENQUETE = 2.15;
const APRES_LE_CRI = .7;
const T_TRACES = .05;
export const ECART_ENTRE_DEUX_TRACES = .06;
const T_BUISSON = 1.1;
/** Max attrape le chiot : trois étincelles à quatre branches autour de sa tête. */
const T_JOIE = 1.57;
/** Une voiture traverse la route à vitesse douce, une par coup de sifflet ; une bulle reste le temps d'un coup de sifflet. */
export const DUREE_DU_PASSAGE = 1.3;
export const DUREE_D_UNE_BULLE = .45;

const REPOS: Pose = {
  x: X_MAX,
  y: Y_SOL,
  rot: 0,
  s: 1,
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
  marche: 0,
  mG: 0,
  mD: 0,
  clin: 0,
  loupe: 0,
  loupeSol: 0,
  gants: 0,
  sif: 0,
  casq: 1,
  casque: 0,
  trot: 0,
  salut: 0,
  sonnette: 0,
  pied: 0,
  piedH: 0,
  libre: 0,
};

const REPOS_DU_CHIOT: PoseDuChiot = { x: X_CHIOT, y: 0, dir: 1, assis: 1, saut: 0, queue: 1, vis: 1, bras: 0, lang: 0, rot: 0, sx: 1, sy: 1 };

type Images = readonly ImagePartielle<Pose>[];
type ImagesDuChiot = readonly ImagePartielle<PoseDuChiot>[];
type Cible = readonly [number, number] | null;

/** Les bras qui amènent les mains sur des cibles du repère du buste (`null` : ce bras ne bouge pas). */
function mains(g: Cible, d: Cible): Partial<Pose> {
  const gauche = g && brasVers("g", { x: g[0], y: g[1] }), droite = d && brasVers("d", { x: d[0], y: d[1] });
  return { ...(gauche ? { aGu: gauche.a1, aGl: gauche.a2 } : {}), ...(droite ? { aDu: droite.a1, aDl: droite.a2 } : {}) };
}

const BRAS_BAS: Partial<Pose> = { aGu: 8, aGl: 14, aDu: -8, aDl: -14, mG: 0, mD: 0 };
const V: Partial<Pose> = { aGu: 152, aGl: 20, aDu: -152, aDl: -20, mG: 3, mD: 3 };
const DEBOUT: Partial<Pose> = { lGt: 5, lGs: 0, lDt: -5, lDs: 0, fG: 1, fD: 1, tG: 1, tD: 1 };
const ACCROUPI: Partial<Pose> = { lGt: 30, lGs: -24, lDt: -30, lDs: 24 };

/** L'enquête : Max marche à la loupe sur les traces, le buisson bouge, le chiot lui saute dans les bras, câlin, puis il le pose au sol. */
const ENQUETE: Images = [
  { t: 0.00, e: E.douce, p: { x: X_DEBUT, vue: 20, loupe: 1, aDu: -46, aDl: 10, mD: 1, tete: 6, regardY: 5, regardX: 3 } },
  { t: 0.08, e: E.douce, p: { x: X_DEBUT } },
  { t: 0.15, e: E.lineaire, p: { vue: VUE, torse: 10, tete: 10, regardY: 7, regardX: 4, marche: 1, aDu: -52, aDl: 6 } },
  { t: 0.85, e: E.lineaire, p: { x: X_MAX - 10, marche: 1 } },
  { t: 1.00, e: E.sortie, p: { x: X_MAX, marche: 0, ...DEBOUT, torse: 6, tete: 4, regardY: 3 } },
  { t: 1.10, e: E.douce, p: { torse: 2, tete: 0, regardY: 1, regardX: 7, vue: VUE, aDu: -70, aDl: -10 } },
  { t: 1.20, e: E.sortie, p: { torse: -4, tete: -4, sy: .97, regardY: -2 } },
  { t: 1.28, e: E.douce, p: { ...mains(null, [22, 0]), mD: 1 } },
  { t: 1.34, e: E.douce, p: { loupe: 0 } },
  { t: 1.42, e: E.douce, p: { torse: 0, sy: 1, vue: 14, tete: -2, regardX: 4, regardY: 2, aGu: 78, aGl: 10, aDu: -78, aDl: -10, mG: 3, mD: 3 } },
  { t: T_JOIE, e: E.entree, p: { ...mains([-7, -24], [7, -24]), mG: 0, mD: 0, torse: -6, sy: .96, sx: 1.03, tete: -6 } },
  { t: 1.65, e: E.rebond, p: { torse: 0, sy: 1, sx: 1, tete: 10, regardX: 0, regardY: 4 } },
  { t: 1.80, e: E.douce, p: { tete: 6, ...mains([-7, -27], [7, -26]) } },
  { t: 1.92, e: E.douce, p: { tete: 12, ...mains([-7, -24], [7, -24]) } },
  { t: 2.02, e: E.douce, p: { torse: 18, y: Y_SOL + 12, ...ACCROUPI, sy: .94, sx: 1.04, tete: 10, vue: -12, regardX: -5, regardY: 6, ...mains([-30, 22], [-14, 24]) } },
  { t: FIN_DE_L_ENQUETE, e: E.sortie, p: { torse: 0, y: Y_SOL, ...DEBOUT, sy: 1, sx: 1, tete: 0, vue: 0, regardX: -3, regardY: 2, ...BRAS_BAS } },
];

const ENQUETE_DU_CHIOT: ImagesDuChiot = [
  { t: 0.00, e: E.douce, p: { x: BUISSON.x, y: 0, dir: -1, vis: 0, assis: 0 } },
  { t: 1.25, e: E.douce, p: { vis: 0 } },
  { t: 1.27, e: E.sortie, p: { vis: 1, x: BUISSON.x - 6, y: -14, saut: 1, rot: -24, queue: 2 } },
  { t: 1.42, e: E.lineaire, p: { x: lerp(BUISSON.x, X_MAX + 8, .55), y: -140, rot: -10 } },
  { t: T_JOIE, e: E.entree, p: { x: X_MAX + 8, y: -96, rot: 10 } },
  { t: 1.64, e: E.douce, p: { bras: 1 } },
  { t: 1.88, e: E.douce, p: { bras: 1, x: X_MAX - 24, y: -58 } },
  { t: 2.04, e: E.douce, p: { bras: 0, x: X_MAX - 30, y: -40, dir: 1, saut: 1, rot: 0 } },
  { t: FIN_DE_L_ENQUETE, e: E.sortie, p: { x: X_CHIOT, y: 0, saut: 0, assis: 1, queue: 1.4 } },
];

const T0 = FIN_DE_L_ENQUETE;

/** Le chef d'orchestre de la circulation : les gants blancs, trois coups de sifflet, trois voitures, une révérence et un clin d'œil. */
const orchestre: Images = [
  { t: T0, e: E.douce, p: {} },
  { t: T0 + .15, e: E.douce, p: { ...mains([-7, -26], [7, -26]), mG: 1, mD: 1, regardY: 4, tete: 6 } },
  { t: T0 + .22, e: E.douce, p: { gants: 1 } },
  { t: T0 + .38, e: E.rebond, p: { aGu: 110, aGl: 36, aDu: -110, aDl: -36, mG: 3, mD: 3, tete: 0, regardY: 0 } },
  { t: T0 + .50, e: E.douce, p: { ...mains(null, [9, -58]), mD: 1, sif: 1, aGu: 30, aGl: 20, mG: 0, vue: -16, regardX: -6, tete: 4 } },
  { t: T0 + .65, e: E.douce, p: { aGu: 130, aGl: 0, mG: 3, vue: 0, regardX: 0 } },
  { t: T0 + .80, e: E.douce, p: { aGu: 212, aGl: -34, vue: 22, regardX: 6, tete: -4 } },
  { t: T0 + .95, e: E.douce, p: { ...mains([-9, -58], null), mG: 1, sif: 2, aDu: -30, aDl: -20, mD: 0, vue: 16 } },
  { t: T0 + 1.10, e: E.douce, p: { aDu: -130, aDl: 10, mD: 3, vue: 0, regardX: 0 } },
  { t: T0 + 1.25, e: E.douce, p: { aDu: -212, aDl: 34, vue: -22, regardX: -6, tete: 4 } },
  { t: T0 + 1.40, e: E.douce, p: { ...mains(null, [9, -58]), mD: 1, sif: 1, aGu: 30, aGl: 20, mG: 0, vue: 0, tete: 0, regardX: 0 } },
  { t: T0 + 1.58, e: E.douce, p: { aGu: 110, aGl: 30, aDu: -110, aDl: -30, mG: 3, mD: 3, sif: 0, tete: -4 } },
  { t: T0 + 1.72, e: E.douce, p: { ...V, regardY: -3 } },
  { t: T0 + 1.85, e: E.douce, p: { aGu: 120, aGl: 20, aDu: -120, aDl: -20, regardY: 0 } },
  { t: T0 + 2.00, e: E.douce, p: { torse: 28, tete: 12, ...mains([-5, -30], null), mG: 1, aDu: -80, aDl: -6, mD: 0, regardY: 6, y: Y_SOL + 4, lGt: 12, lDt: -12 } },
  { t: T0 + 2.12, e: E.douce, p: { torse: 29 } },
  { t: T0 + 2.30, e: E.rebond, p: { torse: 0, tete: -4, ...BRAS_BAS, regardY: 0, clin: 1, y: Y_SOL, ...DEBOUT } },
  { t: T0 + 2.45, e: E.douce, p: { clin: 0 } },
];

const sautDuChiot = (t: number): ImagesDuChiot => [
  { t: t - .1, e: E.douce, p: {} },
  { t, e: E.sortie, p: { y: -10, sy: 1.05 } },
  { t: t + .13, e: E.entree, p: { y: 0, sy: 1 } },
];

const orchestreDuChiot: ImagesDuChiot = [{ t: T0, e: E.douce, p: { queue: 2.6, dir: 1, lang: 1 } }, ...sautDuChiot(T0 + .55), ...sautDuChiot(T0 + 1.05), ...sautDuChiot(T0 + 1.55)];

/** Le tour en trottinette : le casque d'abord, deux poussées, un coup de sonnette, un signe de la main, un demi-tour sur place, puis l'arrêt en douceur, pied au sol. */
const trottinette: Images = [
  { t: T0, e: E.douce, p: {} },
  { t: T0 + .14, e: E.douce, p: { ...mains([-20, -78], [20, -78]), tete: 0, regardY: -4 } },
  { t: T0 + .20, e: E.douce, p: { casq: 0, casque: 1 } },
  { t: T0 + .34, e: E.douce, p: { ...BRAS_BAS, regardY: 2, regardX: 0, vue: VUE, pied: X_MAX + 12 } },
  { t: T0 + .48, e: E.douce, p: { trot: 1, torse: 4, pied: X_MAX + 12 } },
  { t: T0 + .66, e: E.lineaire, p: { x: X_MAX + 10, pied: X_MAX + 12, torse: 6 } },
  { t: T0 + .82, e: E.douce, p: { x: X_MAX + 15, pied: X_MAX + 28, piedH: 12 } },
  { t: T0 + .88, e: E.douce, p: { x: X_MAX + 16, pied: X_MAX + 30, piedH: 0 } },
  { t: T0 + 1.08, e: E.lineaire, p: { x: X_MAX + 28, pied: X_MAX + 30 } },
  { t: T0 + 1.24, e: E.douce, p: { x: X_MAX + 33, pied: X_MAX + 48, piedH: 12 } },
  { t: T0 + 1.30, e: E.douce, p: { x: X_MAX + 34, pied: X_MAX + 50, piedH: 0 } },
  { t: T0 + 1.50, e: E.douce, p: { x: X_MAX + 38, libre: 1, sonnette: 1, torse: 4 } },
  { t: T0 + 1.70, e: E.douce, p: { x: X_MAX + 40, sonnette: 0, salut: 1, tete: -6, regardX: 2 } },
  { t: T0 + 1.92, e: E.douce, p: { x: X_MAX + 40, salut: 0, libre: 0, pied: X_MAX + 28, piedH: 0, vue: 8, torse: 4, tete: 0, regardX: 0 } },
  { t: T0 + 2.04, e: E.douce, p: { x: X_MAX + 38, vue: -VUE, torse: 4, pied: X_MAX + 26 } },
  { t: T0 + 2.34, e: E.sortie, p: { x: X_MAX + 32, torse: 4, pied: X_MAX + 18, tete: -4 } },
  { t: T0 + 2.46, e: E.douce, p: { salut: 1, clin: 1, tete: -5 } },
  { t: T0 + 2.62, e: E.douce, p: { clin: 0 } },
];

const trottinetteDuChiot: ImagesDuChiot = [{ t: T0, e: E.douce, p: { queue: 1.6, dir: 1, lang: 1 } }];

/** La danse de la victoire : la loupe posée au sol, deux pas chassés, le grand saut avec la casquette lancée puis rattrapée sur la tête, un clin d'œil. */
const pasChasse = (t: number, x: number, cote: 1 | -1): Images => [
  { t, e: E.sortie, p: { x: lerp(x, X_MAX, .5), y: Y_SOL - 22, sy: 1.06, sx: .96, rot: cote * -7, aGu: cote > 0 ? 152 : 62, aGl: cote > 0 ? 26 : -74, aDu: cote > 0 ? -62 : -152, aDl: cote > 0 ? 74 : -26, mG: cote > 0 ? 0 : 1, mD: cote > 0 ? 1 : 0, lGt: 24, lGs: -18, lDt: -24, lDs: 18, torse: cote * -6, tete: cote * 7 } },
  { t: t + .17, e: E.entree, p: { x, y: Y_SOL + 4, rot: cote * -10, lGt: cote > 0 ? 18 : 4, lGs: 0, lDt: cote > 0 ? -4 : -18, lDs: 0, sy: .9, sx: 1.08 } },
  { t: t + .26, e: E.douce, p: { y: Y_SOL, sy: 1, sx: 1 } },
];

const T_LANCE_DE_LA_CASQUETTE = T0 + 1.46;
const T_CASQUETTE_RATTRAPEE = T0 + 1.85;

const danse: Images = [
  { t: T0, e: E.douce, p: {} },
  { t: T0 + .12, e: E.douce, p: { ...mains(null, [22, 0]), mD: 1, loupe: 1, regardY: 5, tete: 6 } },
  { t: T0 + .30, e: E.douce, p: { torse: 20, y: Y_SOL + 12, ...ACCROUPI, sy: .94, sx: 1.04, vue: 20, ...mains([-24, 16], [30, 48]), regardX: 6, regardY: 8, tete: 10 } },
  { t: T0 + .35, e: E.douce, p: { loupe: 0, loupeSol: 1, mD: 0 } },
  { t: T0 + .55, e: E.sortie, p: { torse: 0, y: Y_SOL, ...DEBOUT, sy: 1, sx: 1, vue: 0, ...BRAS_BAS, regardX: 0, regardY: 0, tete: 0 } },
  ...pasChasse(T0 + .62, X_MAX + 22, 1),
  ...pasChasse(T0 + .92, X_MAX - 22, -1),
  { t: T0 + 1.26, e: E.douce, p: { x: X_MAX, y: Y_SOL + 14, sy: .84, sx: 1.14, rot: 0, torse: 6, tete: 0, aGu: 44, aGl: 24, aDu: -44, aDl: -24, mG: 1, mD: 1, lGt: 32, lGs: -26, lDt: -32, lDs: 26 } },
  { t: T_LANCE_DE_LA_CASQUETTE, e: E.sortie, p: { y: Y_SOL - 74, sy: 1.12, sx: .9, torse: -4, ...V, lGt: 20, lGs: 110, lDt: -20, lDs: -110, tG: .55, tD: .55, s: 1.04, casq: 0, tete: -8 } },
  { t: T0 + 1.70, e: E.entree, p: { y: Y_SOL + 8, sy: .88, sx: 1.1, torse: 3, lGt: 22, lGs: -16, lDt: -22, lDs: 16, tG: 1, tD: 1, s: 1, tete: 4 } },
  { t: T_CASQUETTE_RATTRAPEE, e: E.rebond, p: { y: Y_SOL, sy: 1, sx: 1, torse: 0, lGt: 6, lGs: 0, lDt: -6, lDs: 0, aGu: 146, aDu: -146, casq: 1, tete: 0 } },
  { t: T0 + 2.00, e: E.douce, p: { clin: 1, tete: -5, ...BRAS_BAS, aDu: -112, aDl: -74, mD: 2 } },
  { t: T0 + 2.40, e: E.douce, p: { clin: 0 } },
];

const danseDuChiot: ImagesDuChiot = [
  { t: T0, e: E.douce, p: { queue: 2.2, dir: 1, lang: 1 } },
  { t: T0 + 1.22, e: E.douce, p: {} },
  { t: T0 + 1.34, e: E.douce, p: { sy: .85, sx: 1.1 } },
  { t: T0 + 1.42, e: E.sortie, p: { y: -10, sy: 1.1, sx: .95, saut: 1, assis: 0 } },
  { t: T0 + 1.56, e: E.sortie, p: { y: -46, sy: 1, sx: 1 } },
  { t: T0 + 1.70, e: E.entree, p: { y: -4 } },
  { t: T0 + 1.76, e: E.sortie, p: { y: 0, sy: .9, sx: 1.08, saut: 0 } },
  { t: T0 + 1.88, e: E.rebond, p: { sy: 1, sx: 1, assis: 1 } },
];

export const poseA = (poses: readonly ImageCle<Pose>[], t: number): Pose => poseDeLaScene(REPOS, poses, t);
export const poseDuChiotA = (poses: readonly ImageCle<PoseDuChiot>[], t: number): PoseDuChiot => poseDeLaScene(REPOS_DU_CHIOT, poses, t);

type Bulle = { readonly t: number; readonly texte: string; readonly dx: number; readonly dy: number };

export type ScenarioDeLaPolice = {
  /** Fin de la scène, en secondes du temps de la maquette raccourci (la scène est ensuite accélérée pour tenir en 3 s). */
  readonly fin: number;
  readonly poses: readonly ImageCle<Pose>[];
  readonly chiot: readonly ImageCle<PoseDuChiot>[];
  readonly expressions: readonly ChangementDExpression<Emotion>[];
  readonly tCri: number;
  readonly tJoie: number;
  readonly tTraces: number;
  readonly tBuisson: number;
  /** Les bulles écrites (« tuut ! », « dring ! ») : aucun son. */
  readonly bulles: readonly Bulle[];
  /** Le départ de chaque petite voiture. */
  readonly voitures: readonly number[];
  /** L'arrivée de la trottinette (`null` : cette variante n'en a pas). */
  readonly tTrottinette: number | null;
  readonly tLance: number | null;
  readonly tRattrape: number | null;
  readonly tGants: number | null;
};

const EXPRESSIONS_DE_L_ENQUETE: readonly ChangementDExpression<Emotion>[] = [
  { t: 0, emo: "concentration" },
  { t: 1.12, emo: "hum" },
  { t: 1.2, emo: "surprise" },
  { t: 1.45, emo: "joie" },
  { t: 1.95, emo: "sourire" },
];

const EXPRESSIONS_DE_LA_VARIANTE: Record<VarianteDe<"police">, readonly ChangementDExpression<Emotion>[]> = {
  orchestre: [{ t: T0 + .38, emo: "joie" }, { t: T0 + .5, emo: "concentration" }, { t: T0 + 1.58, emo: "joie" }, { t: T0 + 2, emo: "sourire" }, { t: T0 + 2.3, emo: "joie" }],
  trottinette: [{ t: T0 + .34, emo: "joie" }, { t: T0 + .48, emo: "concentration" }, { t: T0 + 1.5, emo: "joie" }, { t: T0 + 1.92, emo: "concentration" }, { t: T0 + 2.12, emo: "sourire" }, { t: T0 + 2.34, emo: "joie" }],
  danse: [{ t: T0 + .12, emo: "concentration" }, { t: T0 + .55, emo: "joie" }, { t: T0 + 1.26, emo: "concentration" }, { t: T0 + 1.46, emo: "joie" }],
};

const VARIANTES: Record<VarianteDe<"police">, { poses: Images; chiot: ImagesDuChiot; tCri: number }> = {
  orchestre: { poses: orchestre, chiot: orchestreDuChiot, tCri: T0 + 2.3 },
  trottinette: { poses: trottinette, chiot: trottinetteDuChiot, tCri: T0 + 2.34 },
  danse: { poses: danse, chiot: danseDuChiot, tCri: T_CASQUETTE_RATTRAPEE },
};

const BULLES: Record<VarianteDe<"police">, readonly Bulle[]> = {
  orchestre: [{ t: T0 + .5, texte: "tuut !", dx: 50, dy: -128 }, { t: T0 + .95, texte: "tuut !", dx: -50, dy: -128 }, { t: T0 + 1.4, texte: "tuut !", dx: 50, dy: -128 }],
  trottinette: [{ t: T0 + 1.5, texte: "dring !", dx: 24, dy: -118 }],
  danse: [],
};

export function scenarioDeLaPolice(variante: VarianteDe<"police">): ScenarioDeLaPolice {
  const { poses, chiot, tCri } = VARIANTES[variante];
  return {
    fin: tCri + APRES_LE_CRI,
    poses: compiler(REPOS, [...ENQUETE, ...poses]),
    chiot: compiler(REPOS_DU_CHIOT, [...ENQUETE_DU_CHIOT, ...chiot]),
    expressions: [...EXPRESSIONS_DE_L_ENQUETE, ...EXPRESSIONS_DE_LA_VARIANTE[variante]],
    tCri,
    tJoie: T_JOIE,
    tTraces: T_TRACES,
    tBuisson: T_BUISSON,
    bulles: BULLES[variante],
    voitures: variante === "orchestre" ? [T0 + .55, T0 + 1.05, T0 + 1.55] : [],
    tTrottinette: variante === "trottinette" ? T0 + .48 : null,
    tLance: variante === "danse" ? T_LANCE_DE_LA_CASQUETTE : null,
    tRattrape: variante === "danse" ? T_CASQUETTE_RATTRAPEE : null,
    tGants: variante === "orchestre" ? T0 + .22 : null,
  };
}
