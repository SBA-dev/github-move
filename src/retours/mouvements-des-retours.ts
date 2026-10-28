import { animate } from "motion";

type Element = HTMLElement;

/** Rebond : 1 → 1,15 → 1 en deux ressorts, 350 ms au plus. */
export function rebondir(element: Element) {
  return animate([
    [element, { scale: 1.15 }, { type: "spring", visualDuration: 0.15, bounce: 0.3 }],
    [element, { scale: 1 }, { type: "spring", visualDuration: 0.2, bounce: 0.5 }],
  ]);
}

const AMPLITUDE_DU_BALANCEMENT_EN_PX = 6;

/** Léger balancement de côté : deux allers-retours de ±6 px, 400 ms. */
export function balancer(element: Element) {
  const a = AMPLITUDE_DU_BALANCEMENT_EN_PX;
  return animate(element, { x: [0, a, -a, a, -a, 0] }, { duration: 0.4, ease: "easeInOut" });
}
