import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { mouvementsReduits } from "./mouvements-reduits.ts";
import type { Transition } from "./transition-d-ecran.ts";

const DUREE_EN_SECONDES = 0.25;
const SECURITE_DE_DEBLOCAGE_EN_MS = 290;
const VERROU_DES_MOUVEMENTS_REDUITS_EN_MS = 250;
const DISTANCE_DU_GLISSEMENT_EN_PX = 48;
const DEPART: Readonly<Record<Transition, { x?: number; opacity?: number }>> = {
  avancer: { x: DISTANCE_DU_GLISSEMENT_EN_PX, opacity: 0 },
  revenir: { x: -DISTANCE_DU_GLISSEMENT_EN_PX, opacity: 0 },
  fondu: { opacity: 0 },
  aucune: {},
};

type Props = {
  readonly cle: string;
  readonly transition: Transition;
  readonly children: ReactNode;
};

/**
 * L'écran qui arrive remplace tout de suite le précédent (aucun écran sortant à attendre) et glisse ou apparaît en moins de 300 ms,
 * sur `transform` et `opacity` seulement. Le premier écran affiché, et les mouvements réduits, n'animent rien.
 * À l'arrivée, les touchers sont ignorés (le temps du mouvement, ou 250 ms avec les mouvements réduits) : le second toucher
 * d'un double toucher ne tombe pas sur l'écran qui arrive. Le clavier n'est jamais bloqué.
 */
export function EcranQuiArrive({ cle, transition, children }: Props) {
  const premiereCle = useRef(cle);
  const aChange = useRef(false);
  const racine = useRef<HTMLDivElement>(null);
  const [cleDebloquee, setCleDebloquee] = useState<string | null>(null);
  const animer = aChange.current || cle !== premiereCle.current;

  useEffect(() => {
    if (cle === premiereCle.current && !aChange.current) return;
    aChange.current = true;
    const ecran = racine.current;
    if (!ecran || ecran.contains(document.activeElement)) return;
    const titre = ecran.querySelector<HTMLElement>("h1, h2");
    const aFocaliser = titre ?? ecran;
    if (titre && !titre.hasAttribute("tabindex")) titre.tabIndex = -1;
    aFocaliser.focus({ preventScroll: true });
  }, [cle]);

  const reduits = mouvementsReduits();
  const enArrivee = animer && transition !== "aucune";
  const touchersIgnores = enArrivee && cleDebloquee !== cle;
  const depart = animer && !reduits ? DEPART[transition] : {};

  useEffect(() => {
    if (!enArrivee) return;
    const delai = reduits ? VERROU_DES_MOUVEMENTS_REDUITS_EN_MS : SECURITE_DE_DEBLOCAGE_EN_MS;
    const minuteur = setTimeout(() => setCleDebloquee(cle), delai);
    return () => clearTimeout(minuteur);
  }, [cle, enArrivee, reduits]);

  return (
    <motion.div
      key={cle}
      ref={racine}
      className="ecran-qui-arrive"
      tabIndex={-1}
      data-transition={animer && !reduits ? transition : "aucune"}
      initial={depart}
      style={touchersIgnores ? { pointerEvents: "none" } : undefined}
      animate={{ x: 0, opacity: 1 }}
      onAnimationComplete={() => !reduits && setCleDebloquee(cle)}
      transition={{ duration: DUREE_EN_SECONDES, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
