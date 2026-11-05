import { clamp01, DEG, r1, r3 } from "./courbes.ts";
import { deplacer, poser, trouver } from "./dom.ts";
import type { Membre } from "./membres.ts";

export type ReglagesDeLaChaussure = {
  /** Le côté de la jambe (`g` ou `d`). */
  readonly cote: "g" | "d";
  /** La jambe qui porte la chaussure : le pied est replié derrière la cuisse quand `tibia` est petit (à genoux, saut groupé). */
  readonly tibia: number;
  /** Le sens vers lequel le personnage se tourne : le signe du sinus de sa vue. */
  readonly sw: number;
  /** De 0 (de face) à 1 (de profil). */
  readonly profil: number;
  /** L'inclinaison de la chaussure de profil, en degrés, selon le tibia (`vx`, `vy`) et le sens. */
  readonly inclinaisonDuProfil: (vx: number, vy: number, sens: number) => number;
};

/**
 * Place la chaussure (ou la botte) d'un pied à la cheville et fond ses trois vues : de face, de profil, semelle quand le pied est levé.
 * Le tibia replié la fait passer derrière la cuisse. Rend le pied levé (de 0 à 1) et le sens, pour ce que chaque personnage y ajoute (contact au sol, talon).
 */
export function placerLaChaussure(jambe: SVGElement, chaussure: SVGElement, m: Membre, { cote, tibia, sw, profil, inclinaisonDuProfil }: ReglagesDeLaChaussure) {
  const vx = m.W.x - m.E.x, vy = m.W.y - m.E.y, lv = Math.hypot(vx, vy) || 1;
  const leve = clamp01((-vy / lv) * 1.6 - .2), sens = sw > .02 ? 1 : sw < -.02 ? -1 : 1;
  deplacer(chaussure, `translate(${r1(m.W.x)} ${r1(m.W.y + 2)})`);
  const face = trouver(chaussure, ".vue-face"), vueDeProfil = trouver(chaussure, ".vue-profil"), semelle = trouver(chaussure, ".vue-semelle");
  poser(face, "opacity", r3((1 - profil) * (1 - leve)));
  poser(vueDeProfil, "opacity", r3(profil * (1 - leve)));
  deplacer(vueDeProfil, `scale(${r3(sens * (.6 + .4 * profil))} 1) rotate(${r1(inclinaisonDuProfil(vx, vy, sens))})`);
  const replie = clamp01((1 - tibia) * 2.2), dehors = (cote === "g" ? -1 : 1) * replie * 13;
  if (replie > .3) {
    if (jambe.firstElementChild !== chaussure) jambe.prepend(chaussure);
  } else if (jambe.lastElementChild !== chaussure) jambe.append(chaussure);
  poser(semelle, "opacity", r3(Math.pow(leve, .8)));
  deplacer(semelle, `translate(${r1(dehors)} ${r1(-3 * leve + replie * 2)}) rotate(${r1(-dehors * 1.8)}) scale(${r3(.5 + .25 * leve)} ${r3(Math.max(.05, leve * .8))})`);
  return { face, leve, sens };
}

/** L'inclinaison de la chaussure de profil de Coach Léo, de Lili et d'Agent Max. */
export const inclinaisonDuProfilDeLeo = (vx: number, vy: number, sens: number) => Math.atan2(vx * sens, -vy) / DEG * .25;
/** Celle de Capitaine Sam : la chaussure reste dans le prolongement du tibia. */
export const inclinaisonDuProfilDeSam = (vx: number, vy: number, sens: number) => -Math.atan2(vx * sens, vy) / DEG * .25;
/** Une botte a une longue tige : de profil, elle reste dans le prolongement du tibia, comme chez Capitaine Sam, et ne se couche pas comme la chaussure de Coach Léo. */
export const inclinaisonDeLaTigeDesBottes = inclinaisonDuProfilDeSam;
