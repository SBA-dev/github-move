import { brasVers } from "../../celebrations/commun/atteindre.ts";
import { DEG, E, lerp } from "../../celebrations/commun/courbes.ts";
import type { ChangementDExpression } from "../../celebrations/commun/expressions.ts";
import { compiler, type ImageCle, type ImagePartielle, poseA } from "../../celebrations/commun/poses.ts";
import { ECHELLE_DE_BASE as BASE, type Emotion, type Pose, REPOS } from "../../celebrations/pompiers/poses.ts";
import type { ScenarioDeSam } from "../../celebrations/pompiers/personnage.ts";

/** Fin de la scène, en secondes : la scène est jouée à cette vitesse, sans accélération. */
export const FIN = 1.5;
/** Sam laisse de la place à la fleur pendant la scène ; l'image fixe le remet au centre. */
const X_DE_LA_SCENE = -28;

/** Les instants de la scène, en secondes. */
export const T = {
  /** L'eau part de la lance, puis il coupe l'eau (l'arc ne bouge plus ensuite). */
  jet: .14,
  coupe: .50,
  /** La bulle « plouf ! » paraît quand l'eau retombe. */
  plouf: .40,
} as const;

/** La pose de la scène : celle de Sam, et le poids `hg` de la main gauche sur la lance (0 : elle la lâche). */
type PoseDeLaScene = Pose & { hg: number };

const REPOS_DE_LA_SCENE: PoseDeLaScene = { ...REPOS, x: X_DE_LA_SCENE * BASE, y: 0, tenue: .001, hg: 1 };
const POUCE: Partial<PoseDeLaScene> = { aGu: 78, aGl: 100, mG: 2 };
/** Dans la maquette, le poignet s'arrête un peu avant le point de la lance saisi (comme `brasSaisit` du moteur de la célébration). */
const RETRAIT_DE_LA_PRISE = 4;
const ECART_DES_MAINS = 6;
const IMAGES_PAR_SECONDE = 60;

/** Sam de face ou de trois-quarts (38° au plus), d'aplomb : il lève la lance, regarde l'eau retomber, rit, ajuste sa lance relevée, puis lève le pouce. */
const IMAGES: readonly ImagePartielle<PoseDeLaScene>[] = [
  { t: 0, e: E.douce, p: { vue: 14, lA: -20, lX: 26, lY: -30, regardX: 4, regardY: 3 } },
  { t: .14, e: E.douce, p: { vue: 30, lA: -79, lX: 38, lY: -46, torse: -2, tete: 3, regardX: 8, regardY: -6 } },
  { t: .30, e: E.douce, p: { torse: -3, lA: -81 } },
  { t: .46, e: E.douce, p: { torse: 0, tete: -2, regardX: 6, regardY: 3 } },
  { t: .62, e: E.douce, p: { torse: 2, tete: -4, regardY: 3 } },
  { t: .70, e: E.douce, p: { torse: 5, tete: -6, sy: .985, sx: 1.015, regardX: 0, regardY: 2 } },
  { t: .82, e: E.douce, p: { torse: -4, tete: 5, sy: 1, sx: 1 } },
  { t: .92, e: E.douce, p: { torse: 2, tete: -2, lA: -62, lX: 31, lY: -36, hg: 1 } },
  { t: 1.04, e: E.douce, p: { torse: 0, tete: 0, vue: 0, lA: -55, lX: 36, lY: -30, hg: 0, regardX: 0, regardY: 0 } },
  { t: 1.28, e: E.douce, p: { ...POUCE, tete: -5 } },
  { t: FIN, e: E.douce, p: { tete: -3 } },
];

const EXPRESSIONS: readonly ChangementDExpression<Emotion>[] = [
  { t: 0, emo: "concentration" },
  { t: .44, emo: "surprise" },
  { t: .62, emo: "joie" },
  { t: 1.1, emo: "sourire" },
];

type Main = "g" | "d";
type Point = { readonly x: number; readonly y: number };

function saisir(main: Main, cible: Point, epaule: Point) {
  const dx = cible.x - epaule.x, dy = cible.y - epaule.y, D = Math.hypot(dx, dy) || 1, k = Math.max(0, D - RETRAIT_DE_LA_PRISE) / D;
  return brasVers(main, { x: epaule.x + dx * k, y: epaule.y + dy * k }, epaule);
}

/** Les mains suivent la lance : la droite la tient à l'arrière, la gauche (de poids `hg`) plus en avant. Les angles des bras sont calculés image par image. */
function avecLesMains(p: PoseDeLaScene): PoseDeLaScene {
  const cw = Math.cos(p.vue * DEG), sw = Math.sin(p.vue * DEG), largeur = lerp(.55, 1, Math.abs(cw));
  const axe = { x: Math.cos(p.lA * DEG), y: Math.sin(p.lA * DEG) };
  const droite = saisir("d", { x: p.lX + axe.x * 2, y: p.lY + axe.y * 2 }, { x: 18 * largeur + 4 * sw, y: -38 });
  const gauche = saisir("g", { x: p.lX + axe.x * ECART_DES_MAINS, y: p.lY + axe.y * ECART_DES_MAINS }, { x: -18 * largeur + 4 * sw, y: -38 });
  return { ...p, aDu: droite.a1, aDl: droite.a2, aGu: lerp(p.aGu, gauche.a1, p.hg), aGl: lerp(p.aGl, gauche.a2, p.hg) };
}

/** Une pose par image de l'écran, décalée de `decalage` : les bras suivent la lance à chaque image. */
function enImagesCles(decalage: number): readonly ImageCle<PoseDeLaScene>[] {
  const cles = compiler(REPOS_DE_LA_SCENE, IMAGES);
  return Array.from({ length: Math.round(FIN * IMAGES_PAR_SECONDE) + 1 }, (_, i) => {
    const t = i / IMAGES_PAR_SECONDE, p = avecLesMains(poseA(REPOS_DE_LA_SCENE, cles, t));
    return { t, e: E.lineaire, p: { ...p, x: p.x + decalage } };
  });
}

export const SCENARIO_DE_SAM: ScenarioDeSam = { poses: enImagesCles(0), expressions: EXPRESSIONS };
/** L'image fixe : la dernière pose, mais au milieu du cadre (la scène finit à 28 unités de là ; le dessin fixe revient au centre). */
export const SCENARIO_FIXE_DE_SAM: ScenarioDeSam = { poses: enImagesCles(-X_DE_LA_SCENE * BASE), expressions: EXPRESSIONS };
