import { lerp, r1, r3 } from "../commun/courbes.ts";
import { deplacer, elementsDe, poser, trouver } from "../commun/dom.ts";
import { DEVIDOIR_DESSINE, EAU_CONTOUR, GOUTTE, SORTIE_DU_TUYAU } from "./dessin-du-jardin.ts";
import { LANCE } from "./dessin-de-sam.ts";
import type { CapitaineSam } from "./personnage.ts";
import { ECHELLE_DE_BASE as BASE, LANCE_AU_SOL, type Pose, SOL } from "./poses.ts";
import type { Repere } from "./repere.ts";

const NOMBRE_DE_GOUTTES_DU_JET = 14;
/** La pesanteur de l'eau, et la hauteur du sol où le jet retombe. */
const G_JET = 560;
const Y_JET = 372;
const JET_FINI = .97;

type Trajet = { readonly te: number; readonly pos: (tau: number) => { x: number; y: number }; readonly atterrit: boolean };

/**
 * La lance au sol, le tuyau qui la relie au dévidoir, et le jet d'eau bleu clair et doux qui suit la pointe de la lance.
 * Le jet balaie le parterre, retombe en petite éclaboussure sur le sol et ne vise personne.
 */
export function creerLeJet(racine: SVGSVGElement, monde: Repere, sam: CapitaineSam) {
  const n = elementsDe(racine, "pompier");
  n("devidoir").innerHTML = DEVIDOIR_DESSINE;
  n("lance-sol").innerHTML = LANCE;
  const q1 = (g: ParentNode, classe: string) => trouver(g, `.${classe}`);
  const lanceAuSol = { arriere: q1(n("lance-sol"), "m-arriere"), axe: q1(n("lance-sol"), "m-axe") };
  const jet = n("jet"), gouttes = q1(jet, "gouttes"), eclaboussure = q1(jet, "eclabousse");
  gouttes.innerHTML = Array.from({ length: NOMBRE_DE_GOUTTES_DU_JET }, () => `<circle r="2.4"/>`).join("");
  eclaboussure.innerHTML = Array.from({ length: 4 }, () => `<g>${GOUTTE}</g>`).join("") + `<ellipse class="rond" rx="9" ry="2.6" fill="none" stroke="${EAU_CONTOUR}" stroke-width="1.6"/>`;

  function dessinerLaLanceAuSol(p: Pose) {
    poser(n("lance-sol"), "opacity", p.posee > .5 ? 1 : 0);
    deplacer(n("lance-sol"), `translate(${LANCE_AU_SOL.x} ${LANCE_AU_SOL.y}) rotate(${LANCE_AU_SOL.a}) scale(${BASE})`);
  }

  function dessinerLeTuyau(p: Pose) {
    const auSol = p.posee > .5, A = monde(auSol ? lanceAuSol.arriere : sam.lance.arriere), X = monde(auSol ? lanceAuSol.axe : sam.lance.axe);
    const dx = A.x - X.x, dy = A.y - X.y, l = Math.hypot(dx, dy) || 1, c2 = { x: A.x + dx / l * 30, y: A.y + dy / l * 30 }, pied = { x: Math.min(A.x - 14, p.x - 26), y: SOL + 5 };
    const d = `M${SORTIE_DU_TUYAU.x} ${SORTIE_DU_TUYAU.y} C${SORTIE_DU_TUYAU.x + 10} ${SORTIE_DU_TUYAU.y + 22} ${SORTIE_DU_TUYAU.x + 22} ${SOL + 6} ${r1((SORTIE_DU_TUYAU.x + pied.x) / 2)} ${SOL + 6} S${r1(pied.x - 10)} ${r1(pied.y)} ${r1(pied.x)} ${r1(pied.y)} C${r1(pied.x + 16)} ${r1(pied.y)} ${r1(c2.x)} ${r1(Math.max(c2.y, A.y))} ${r1(A.x)} ${r1(A.y)}`;
    for (const id of ["tuyau-contour", "tuyau", "tuyau-ombre"]) poser(n(id), "d", d);
  }

  /** Le trajet de l'eau : une parabole qui part de la pointe de la lance, dans son axe, avec la force du jet. */
  function trajet(p: Pose): Trajet | null {
    if (p.tenue < .5 || p.posee > .5 || p.jetA <= p.jetB + .002) return null;
    const T = monde(sam.lance.pointe), X = monde(sam.lance.axe), dx = T.x - X.x, dy = T.y - X.y, l = Math.hypot(dx, dy) || 1, vx = dx / l * p.force, vy = dy / l * p.force, h = Y_JET - T.y;
    const te = Math.min(2.4, h > 0 ? (-vy + Math.sqrt(vy * vy + 2 * G_JET * h)) / G_JET : .2);
    return { te, pos: (tau) => ({ x: T.x + vx * tau, y: T.y + vy * tau + .5 * G_JET * tau * tau }), atterrit: te < 2.4 };
  }

  function dessinerLeJet(p: Pose, t: number) {
    const j = trajet(p);
    if (!j) {
      poser(jet, "opacity", 0);
      return;
    }
    poser(jet, "opacity", 1);
    let d = "";
    for (let i = 0; i <= 26; i++) {
      const q = j.pos(lerp(p.jetB, p.jetA, i / 26) * j.te);
      d += `${i ? "L" : "M"}${r1(q.x)} ${r1(q.y)}`;
    }
    for (const c of ["jet-contour", "jet-eau"]) poser(q1(jet, c), "d", d);
    let reflet = "";
    for (let i = 0; i <= 10; i++) {
      const q = j.pos(lerp(p.jetB, p.jetA, .05 + i / 10 * .5) * j.te);
      reflet += `${i ? "L" : "M"}${r1(q.x - 1)} ${r1(q.y - 1.2)}`;
    }
    poser(q1(jet, "jet-reflet"), "d", reflet);
    [...gouttes.children].forEach((g, i) => {
      const fr = (i / NOMBRE_DE_GOUTTES_DU_JET + t * 1.1) % 1;
      if (fr < p.jetB || fr > p.jetA) {
        poser(g, "opacity", 0);
        return;
      }
      const q = j.pos(fr * j.te);
      poser(g, "opacity", 1);
      poser(g, "cx", r1(q.x + Math.sin(i * 2.1) * 2.5));
      poser(g, "cy", r1(q.y + Math.cos(i * 1.7) * 2.5));
    });
    const L = j.pos(j.te), visible = j.atterrit && p.jetA > JET_FINI && p.jetB < .03;
    poser(eclaboussure, "opacity", visible ? 1 : 0);
    if (!visible) return;
    [...eclaboussure.children].forEach((g, i) => {
      if (g.classList.contains("rond")) {
        deplacer(g, `translate(${r1(L.x)} ${r1(L.y + 2)}) scale(${r3(.8 + .3 * Math.sin(t * 7))} 1)`);
        return;
      }
      const ph = (t * 2.4 + i / 4) % 1, sens = i % 2 ? 1 : -1, a = (i < 2 ? 12 : 20) * sens;
      deplacer(g, `translate(${r1(L.x + a * ph)} ${r1(L.y - 18 * 4 * ph * (1 - ph))}) scale(${r3(.9 - .4 * ph)}) rotate(${r1(a * 2 * ph)})`);
      poser(g, "opacity", r3(1 - ph * ph));
    });
  }

  function dessiner(p: Pose, t: number) {
    dessinerLaLanceAuSol(p);
    dessinerLeTuyau(p);
    dessinerLeJet(p, t);
  }

  return { dessiner };
}
