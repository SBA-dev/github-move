import { clamp01, r1, r3 } from "../commun/courbes.ts";
import { creerUnGroupe, deplacer, elementsDe, poser, trouver } from "../commun/dom.ts";
import { CHIOT_DE_FACE, CHIOT_DE_PROFIL } from "./dessin-du-chiot.ts";
import type { DessinDeMax } from "./personnage.ts";
import { poseDuChiotA, type ScenarioDeLaPolice, SOL } from "./poses.ts";

function creerLeGroupe(dessin: string): SVGGElement {
  const groupe = creerUnGroupe();
  groupe.innerHTML = dessin;
  return groupe;
}

/** Le chiot : de profil au sol, de face entre les deux mains de Max (fondu de 0,15 s de l'un à l'autre). Il saute, remue la queue, et reste assis, content. */
export function creerLeChiot(racine: SVGSVGElement) {
  const n = elementsDe(racine, "police");
  const profil = creerLeGroupe(CHIOT_DE_PROFIL), face = creerLeGroupe(CHIOT_DE_FACE);
  n("chiot-monde").append(profil);
  n("chiot-bras").append(face);
  const q1 = (classe: string) => trouver(profil, `.${classe}`);
  const pattes = [...profil.querySelectorAll(".patte")].map((patte, i) => {
    const base = /translate\(([^)]+)\)/.exec(patte.getAttribute("transform") ?? "")?.[1] ?? "0 0";
    return { patte, base, arriere: i < 2 };
  });
  let parent: Element = n("chiot-monde");

  function dessiner(scenario: ScenarioDeLaPolice, t: number, max: DessinDeMax) {
    const c = poseDuChiotA(scenario.chiot, t), fondu = clamp01(c.bras);
    poser(n("chiot-bras"), "opacity", c.vis > .5 ? r3(fondu) : 0);
    poser(profil, "opacity", c.vis > .5 ? r3(1 - fondu) : 0);
    if (fondu > 0) {
      const { g, d } = max.mains, x = (g.W.x + d.W.x) / 2, y = (g.W.y + d.W.y) / 2 - 4;
      deplacer(n("chiot-bras"), `translate(${r1(x)} ${r1(y)}) rotate(${r1(max.pose.tete * .4)}) scale(.78)`);
    }
    if (fondu >= 1) {
      poser(n("ombre-chiot"), "opacity", 0);
      return;
    }
    const cible = c.y < -2 || c.saut > .5 ? n("chiot-devant") : n("chiot-monde");
    if (parent !== cible) {
      cible.append(profil);
      parent = cible;
    }
    const remuer = Math.sin(t * Math.PI * 2 * (2.5 + c.queue * 1.5)) * 20 * Math.min(1.4, c.queue);
    deplacer(profil, `translate(${r1(c.x)} ${r1(SOL + 2 + c.y)}) scale(${r3(c.dir * c.sx * 1.05)} ${r3(c.sy * 1.05)}) rotate(${r1(c.rot)})`);
    deplacer(q1("corps-chiot"), `rotate(${r1(-26 * c.assis)} -12 -6)`);
    deplacer(q1("queue"), `translate(-16 -20) rotate(${r1(remuer)})`);
    poser(q1("haunche"), "opacity", c.assis > .5 ? 1 : 0);
    poser(q1("pattes-arriere"), "opacity", c.assis > .5 ? 0 : 1);
    for (const { patte, base, arriere } of pattes) {
      const angle = c.saut * (arriere ? -40 : 36) - (arriere ? 0 : 26 * c.assis);
      deplacer(patte, `translate(${base}) rotate(${r1(angle)}) scale(1 ${r3(1 + (arriere ? 0 : .5 * c.assis))})`);
    }
    deplacer(q1("tete-chiot"), `translate(14 -28) rotate(${r1(c.assis * 20 - c.saut * 10 + Math.sin(t * 5) * 2)})`);
    poser(q1("langue"), "opacity", c.lang > .5 ? 1 : 0);
    poser(n("ombre-chiot"), "cx", r1(c.x));
    poser(n("ombre-chiot"), "opacity", r3(Math.max(.06, .2 + c.y * .0015) * (1 - fondu)));
    poser(n("ombre-chiot"), "rx", r1(22 - c.y * .05));
  }

  return { dessiner };
}
