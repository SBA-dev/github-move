import { type ComponentType, lazy, Suspense } from "react";
import type { CelebrationDeLUnivers } from "@domain/motivation";

type PropsDeScene<Cle extends string> = { readonly cle: Cle; readonly cri: string };

/** L'espace de la scène, vide : il garde la place pour que les boutons ne bougent pas quand la scène arrive, ou quand elle n'arrive pas. */
function EspaceDeLaScene() {
  return <div className="celebration-de-l-univers" aria-hidden="true" />;
}

/** Une scène qui ne se charge pas (nouvelle version de l'appli, hors ligne) ne montre rien : la fin du défi reste intacte. */
const chargerSansEchec = <Cle extends string>(charger: () => Promise<{ default: ComponentType<PropsDeScene<Cle>> }>) =>
  lazy(() => charger().catch(() => ({ default: EspaceDeLaScene })));

const SceneDesSports = chargerSansEchec(() => import("./sports/SceneDesSports.tsx"));
const SceneDeLaDanse = chargerSansEchec(() => import("./danse/SceneDeLaDanse.tsx"));

type Props = { readonly celebration: CelebrationDeLUnivers };

/**
 * La célébration de l'univers, jouée à la place de la célébration commune : elle ne fait qu'afficher ce que le domaine a décidé
 * (la variante tirée, le cri de victoire). Dessin décoratif (`aria-hidden`) : l'annonce du moment est donnée ailleurs, une seule fois.
 * Elle ne capte aucun toucher et ne prend jamais le focus. Avec les mouvements réduits : l'image fixe de l'état final, sans confetti.
 * Chaque scène est chargée à la demande, seulement pour l'univers du profil : en attendant, ou si le chargement échoue,
 * un espace vide de même taille est réservé et la fin du défi reste utilisable.
 */
export function SceneDeCelebration({ celebration }: Props) {
  switch (celebration.univers) {
    case "sports":
      return <Suspense fallback={<EspaceDeLaScene />}><SceneDesSports cle={celebration.variante.cle} cri={celebration.cri} /></Suspense>;
    case "danse":
      return <Suspense fallback={<EspaceDeLaScene />}><SceneDeLaDanse cle={celebration.variante.cle} cri={celebration.cri} /></Suspense>;
  }
}
