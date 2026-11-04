import { lazy, Suspense } from "react";
import type { CelebrationDeLUnivers } from "@domain/motivation";

const SceneDesSports = lazy(() => import("./sports/SceneDesSports.tsx"));

type Props = { readonly celebration: CelebrationDeLUnivers };

/**
 * La célébration de l'univers, jouée à la place de la célébration commune : elle ne fait qu'afficher ce que le domaine a décidé
 * (la variante tirée, le cri de victoire). Dessin décoratif (`aria-hidden`) : l'annonce du moment est donnée ailleurs, une seule fois.
 * Elle ne capte aucun toucher et ne prend jamais le focus. Avec les mouvements réduits : l'image fixe de l'état final, sans confetti.
 * La scène est chargée à la demande, seulement pour l'univers du profil : en attendant, rien n'est montré et la fin du défi reste utilisable.
 * La scène de l'univers « Danse » n'est pas encore dessinée : rien n'est montré en attendant.
 */
export function SceneDeCelebration({ celebration }: Props) {
  if (celebration.univers === "sports") return <Suspense fallback={null}><SceneDesSports cle={celebration.variante.cle} cri={celebration.cri} /></Suspense>;
  return null;
}
