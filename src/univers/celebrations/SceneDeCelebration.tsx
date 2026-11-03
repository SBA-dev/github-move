import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { CelebrationDeLUnivers } from "@domain/motivation";
import { useMouvementsReduits } from "../../transitions/mouvements-reduits.ts";
import { DecorDesSports } from "./sports/DecorDesSports.tsx";
import { creerLaScene } from "./sports/scene.ts";
import { estUneVarianteDeSports, type VarianteDeSports } from "./sports/poses.ts";

type Props = { readonly celebration: CelebrationDeLUnivers };

/**
 * La célébration de l'univers, jouée à la place de la célébration commune : elle ne fait qu'afficher ce que le domaine a décidé
 * (la variante tirée, le cri de victoire). Dessin décoratif (`aria-hidden`) : l'annonce du moment est donnée ailleurs, une seule fois.
 * Elle ne capte aucun toucher et ne prend jamais le focus. Avec les mouvements réduits : l'image fixe de l'état final, sans confetti.
 * Seul l'univers « Sports » est livré ; pour tout autre, le domaine ne rend pas de célébration.
 */
export function SceneDeCelebration({ celebration }: Props) {
  const { variante, cri, univers } = celebration;
  if (univers !== "sports" || !estUneVarianteDeSports(variante.cle)) return null;
  return <SceneDesSports cle={variante.cle} cri={cri} />;
}

type PropsDesSports = { readonly cle: VarianteDeSports; readonly cri: string };

function SceneDesSports({ cle, cri }: PropsDesSports) {
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
  }, [cle, reduits]);

  const fixe = reduits || terminee;
  return (
    <motion.div
      className="celebration-de-l-univers"
      aria-hidden="true"
      data-testid="celebration-de-l-univers"
      data-univers="sports"
      data-variante={cle}
      data-mouvements={reduits ? "reduits" : "animes"}
      data-etat={fixe ? "terminee" : "en-cours"}
      initial={reduits ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <DecorDesSports racine={racine} cri={cri} />
      {!reduits && <canvas ref={toile} className="confettis-de-la-celebration" data-testid="confettis-de-la-celebration" />}
    </motion.div>
  );
}
