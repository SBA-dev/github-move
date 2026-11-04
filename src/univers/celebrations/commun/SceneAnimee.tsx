import { type ComponentType, type RefObject, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { UniversCelebre, VarianteDe } from "@domain/motivation";
import { useMouvementsReduits } from "../../../transitions/mouvements-reduits.ts";

type ScenePrete = { jouer(quandTerminee: () => void): () => void; montrerLEtatFinal(): void };

type Props<U extends UniversCelebre> = {
  readonly univers: U;
  readonly cle: VarianteDe<U>;
  readonly cri: string;
  readonly Decor: ComponentType<{ readonly racine: RefObject<SVGSVGElement | null>; readonly cri: string }>;
  readonly creerLaScene: (racine: SVGSVGElement, toile: HTMLCanvasElement | null, cle: VarianteDe<U>) => ScenePrete;
};

/**
 * La scène d'un univers : son décor, la toile des confettis (ou des pétales) et le moteur qui les anime.
 * Entrée en fondu avec Motion ; l'image fixe de l'état final avec les mouvements réduits (pas de toile, donc pas de confettis).
 */
export function SceneAnimee<U extends UniversCelebre>({ univers, cle, cri, Decor, creerLaScene }: Props<U>) {
  const reduits = useMouvementsReduits();
  const racine = useRef<SVGSVGElement>(null);
  const toile = useRef<HTMLCanvasElement>(null);
  const [terminee, setTerminee] = useState(false);

  useLayoutEffect(() => {
    if (!racine.current) return;
    if (reduits) {
      creerLaScene(racine.current, null, cle).montrerLEtatFinal();
      return;
    }
    return creerLaScene(racine.current, toile.current, cle).jouer(() => setTerminee(true));
  }, [cle, reduits, creerLaScene]);

  const fixe = reduits || terminee;
  return (
    <motion.div
      className="celebration-de-l-univers"
      aria-hidden="true"
      data-testid="celebration-de-l-univers"
      data-univers={univers}
      data-variante={cle}
      data-mouvements={reduits ? "reduits" : "animes"}
      data-etat={fixe ? "terminee" : "en-cours"}
      initial={reduits ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Decor racine={racine} cri={cri} />
      {!reduits && <canvas ref={toile} className="confettis-de-la-celebration" data-testid="confettis-de-la-celebration" />}
    </motion.div>
  );
}
