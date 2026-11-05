import { type MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Point } from "../maisons/groupe-sous-le-doigt.ts";

/** L'étiquette posée rejoint son wagon (`en-chemin`), le wagon s'accroche (`accroche`), puis tout reste en place (`au-repos`). */
export type EtatDuWagon = "en-chemin" | "accroche" | "au-repos";

export const DUREE_DU_CHEMIN_MS = 250;
const DUREE_DE_L_ACCROCHE_MS = 120;

type Dependances = {
  readonly remplie: boolean;
  readonly mouvementsReduits: boolean;
  /** Le rebond de #97 est en cours sur la place : l'accroche attend sa fin. */
  readonly enRebond: boolean;
  /** Le centre de l'étiquette touchée, où commence son chemin. */
  readonly depart: MutableRefObject<Point | undefined>;
  readonly onAccroche: () => void;
};

function faireRejoindreLeWagon(puce: HTMLElement | null, depart: Point | undefined): Animation | undefined {
  if (puce === null || depart === undefined) return undefined;
  const boite = puce.getBoundingClientRect();
  const versDepart = `${depart.x - (boite.left + boite.width / 2)}px ${depart.y - (boite.top + boite.height / 2)}px`;
  return puce.animate([{ translate: versDepart }, { translate: "0 0" }], { duration: DUREE_DU_CHEMIN_MS, easing: "ease-out" });
}

/** Les trois temps d'un wagon qui vient d'être rempli ; avec les mouvements réduits, il est là d'un coup. */
export function useAccrocheDuWagon({ remplie, mouvementsReduits, enRebond, depart, onAccroche }: Dependances) {
  const puce = useRef<HTMLSpanElement>(null);
  const [etat, setEtat] = useState<EtatDuWagon>("au-repos");
  const [cheminFait, setCheminFait] = useState(false);
  const [dejaRemplie, setDejaRemplie] = useState(remplie);
  if (dejaRemplie !== remplie) {
    setDejaRemplie(remplie);
    setCheminFait(false);
    setEtat(remplie && !mouvementsReduits ? "en-chemin" : "au-repos");
  }

  useLayoutEffect(() => {
    if (etat !== "en-chemin") return;
    const chemin = faireRejoindreLeWagon(puce.current, depart.current);
    let annule = false;
    void (chemin?.finished.catch(() => undefined) ?? Promise.resolve()).then(() => annule || setCheminFait(true));
    return () => {
      annule = true;
      chemin?.cancel();
    };
  }, [etat, depart]);

  useEffect(() => {
    if (etat !== "en-chemin" || !cheminFait || enRebond) return;
    setEtat("accroche");
    onAccroche();
  }, [etat, cheminFait, enRebond, onAccroche]);

  useEffect(() => {
    if (etat !== "accroche") return;
    const minuteur = setTimeout(() => setEtat("au-repos"), DUREE_DE_L_ACCROCHE_MS);
    return () => clearTimeout(minuteur);
  }, [etat]);

  return { etat, puce };
}
