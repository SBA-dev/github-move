import type { CleDeTenue, CleUnivers } from "@domain/motivation";
import { clamp01, lerp, r1, r3 } from "./courbes.ts";
import { creerUnGroupe, deplacer, poser, trouver } from "./dom.ts";
import { ANCRAGES_DES_TENUES, type Ancrage, DESSIN_DES_BRETELLES, DESSIN_DU_NOEUD_PAPILLON, dessinDeLEcharpe, dessinDuSacADos, vuesDeLaBotte } from "./tenues.ts";

/**
 * Le personnage guide tourné de `cw` (le cosinus de l'angle de vue : 1 de face, 0 de profil, -1 de dos) et `sw` (son sinus : le côté vers lequel il se tourne),
 * décalé de `dx` ; `torse` est l'inclinaison du buste en degrés (le sac qui reste derrière le corps la suit).
 */
export type VueDuPersonnage = { readonly cw: number; readonly sw: number; readonly dx?: number; readonly torse?: number };

export type TenueSurLePersonnage = { suivre(vue: VueDuPersonnage): void };

const SANS_TENUE: TenueSurLePersonnage = { suivre: () => undefined };

/** Où le dessin de la scène accueille la tenue : chaque personnage dit où poser les groupes, dans son propre ordre de dessin. */
export type Emplacements = {
  /** Sous le corps (le sac y reste tant qu'on voit le personnage de face). */
  readonly derriere: (groupe: SVGGElement) => void;
  /** Juste sur le torse (le sac y passe quand on voit le personnage de dos) ; sans lui, le sac reste toujours derrière. */
  readonly surLeTorse?: (groupe: SVGGElement) => void;
  /** Devant le corps et la tête, sous les bras : les bretelles. */
  readonly devant: (groupe: SVGGElement) => void;
  /** Tout devant, par-dessus les épaules et les manches : l'écharpe et le nœud papillon, que les bras levés ne cachent pas. */
  readonly auCou: (groupe: SVGGElement) => void;
};

/** Le sac, à la moitié de sa profondeur derrière le dos : de profil il dépasse derrière, de dos il couvre le torse. */
const DECALAGE_DU_SAC = 14;
const DECALAGE_DES_BRETELLES = 8;
const DECALAGE_DU_NOEUD = 7;
/** La queue de l'écharpe pend sur le devant du torse, à gauche du cou : son abscisse et sa profondeur. */
const QUEUE_X = -13;
const QUEUE_Z = 9;

function monter(dessin: string, inserer: (groupe: SVGGElement) => void): SVGGElement {
  const groupe = creerUnGroupe();
  groupe.innerHTML = dessin;
  inserer(groupe);
  return groupe;
}

/** Devant le torse : visible de face et de profil (étroit, au bord de la poitrine), caché dès que le personnage montre son dos. */
const visibleDevant = (cw: number) => r3(clamp01((cw + .25) * 4));
const largeurDeFace = (cw: number, minimum: number) => Math.max(minimum, Math.abs(cw));

/**
 * Habille le personnage guide de l'une des trois tenues du cou et du dos : l'écharpe et le nœud papillon suivent le cou, le sac à dos suit le torse
 * (derrière le corps, les bretelles devant ; de dos, le sac passe devant le torse et les bretelles disparaissent).
 * Rend ce qui replace la tenue à chaque image. Les bottes de pluie ne passent pas ici : elles remplacent les chaussures (`chausserLesBottes`), ou se posent sur les pattes (Noisette).
 */
export function habillerLePersonnage(univers: string, tenue: CleDeTenue | undefined, ancrage: Ancrage, emplacements: Emplacements): TenueSurLePersonnage {
  const id = `${univers}-tenue-`;
  const { cou, dos } = ancrage;
  switch (tenue) {
    case undefined:
    case "bottes-de-pluie":
      return SANS_TENUE;
    case "echarpe-rayee": {
      const groupe = monter(dessinDeLEcharpe(id), emplacements.auCou);
      const col = trouver(groupe, ".col-de-l-echarpe"), queue = trouver(groupe, ".queue-de-l-echarpe");
      return {
        suivre({ cw, sw, dx = 0 }) {
          deplacer(groupe, `translate(${r1(cou.x + dx)} ${cou.y}) scale(${cou.echelle})`);
          deplacer(col, `scale(${r3(largeurDeFace(cw, .5))} 1)`);
          poser(queue, "opacity", QUEUE_Z * cw - QUEUE_X * sw > 2 ? 1 : 0);
          deplacer(queue, `translate(${r1(QUEUE_X * cw + QUEUE_Z * sw)} 0) scale(${r3(largeurDeFace(cw, .3))} 1) translate(${-QUEUE_X} 0)`);
        },
      };
    }
    case "noeud-papillon": {
      const groupe = monter(DESSIN_DU_NOEUD_PAPILLON, emplacements.auCou);
      return {
        suivre({ cw, sw, dx = 0 }) {
          deplacer(groupe, `translate(${r1(cou.x + dx + DECALAGE_DU_NOEUD * sw * cou.echelle)} ${cou.y}) scale(${r3(cou.echelle * largeurDeFace(cw, .3))} ${cou.echelle})`);
          poser(groupe, "opacity", visibleDevant(cw));
        },
      };
    }
    case "sac-a-dos-d-explorateur": {
      const derriere = creerUnGroupe();
      emplacements.derriere(derriere);
      const sac = monter(dessinDuSacADos(id, dos.elargissement), (groupe) => derriere.append(groupe));
      const surLeTorse = emplacements.surLeTorse ? creerUnGroupe() : undefined;
      if (surLeTorse) emplacements.surLeTorse?.(surLeTorse);
      const bretelles = monter(DESSIN_DES_BRETELLES, emplacements.devant);
      return {
        suivre({ cw, sw, dx = 0, torse = 0 }) {
          deplacer(derriere, `rotate(${r1(torse)})`);
          const cible = cw < 0 && surLeTorse ? surLeTorse : derriere;
          if (sac.parentNode !== cible) cible.append(sac);
          deplacer(sac, `translate(${r1(dos.x + dx - DECALAGE_DU_SAC * sw * dos.echelle)} ${dos.y}) scale(${r3(dos.echelle * lerp(.45, 1, Math.abs(cw)))} ${dos.echelle})`);
          deplacer(bretelles, `translate(${r1(dos.x + dx + DECALAGE_DES_BRETELLES * sw * dos.echelle)} ${dos.y}) scale(${r3(dos.echelle * largeurDeFace(cw, .35))} ${dos.echelle})`);
          poser(bretelles, "opacity", visibleDevant(cw));
        },
      };
    }
  }
}

/**
 * Remplace la chaussure de chaque pied par une botte de pluie, dans les trois vues de la scène (face, profil, semelle) : le moteur qui fond ces vues,
 * selon l'angle du tibia et la vue, n'a pas à savoir que c'est une botte.
 */
export function chausserLesBottes(chaussures: readonly SVGElement[], tige: number): void {
  const vues = vuesDeLaBotte(tige);
  for (const chaussure of chaussures) {
    for (const [classe, dessin] of [["vue-face", vues.face], ["vue-profil", vues.profil], ["vue-semelle", vues.semelle]] as const) {
      const vue = chaussure.querySelector(`.${classe}`);
      if (vue) vue.innerHTML = dessin;
    }
  }
}

const TIGE_DES_BOTTES_DU_CORPS_ARTICULE = ANCRAGES_DES_TENUES.sports.pieds.tige;

/**
 * La tenue de Coach Léo, de Lili, d'Agent Max et de Capitaine Sam, qui ont le même corps articulé (`haut`, `torse`, `tete`, `chaussure-g`, `chaussure-d`) :
 * le sac derrière le corps, l'écharpe et le nœud devant la tête (derrière ce qui est tenu en main), les bottes à la place des chaussures.
 */
export function habillerLeCorpsArticule(n: (id: string) => SVGElement, corps: SVGElement, univers: CleUnivers, tenue: CleDeTenue | undefined): TenueSurLePersonnage {
  if (tenue === "bottes-de-pluie") chausserLesBottes([n("chaussure-g"), n("chaussure-d")], TIGE_DES_BOTTES_DU_CORPS_ARTICULE);
  return habillerLePersonnage(univers, tenue, ANCRAGES_DES_TENUES[univers], {
    derriere: (groupe) => corps.prepend(groupe),
    surLeTorse: (groupe) => n("torse").after(groupe),
    devant: (groupe) => n("tete").after(groupe),
    auCou: (groupe) => n("bras-avant").after(groupe),
  });
}
