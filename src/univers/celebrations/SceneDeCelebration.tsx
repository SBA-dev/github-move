import { type ComponentType, lazy, Suspense } from "react";
import type { CelebrationDeLUnivers, CleUnivers } from "@domain/motivation";

type PropsDeScene<Cle extends string> = { readonly cle: Cle; readonly cri: string };

/** L'espace de la scène, vide : il garde la place pour que les boutons ne bougent pas quand la scène arrive, ou quand elle n'arrive pas. */
function EspaceDeLaScene() {
  return <div className="celebration-de-l-univers" aria-hidden="true" />;
}

type Module<Cle extends string> = { default: ComponentType<PropsDeScene<Cle>> };

/** Le morceau d'une scène est demandé une seule fois : le préchargement et l'affichage partagent la même promesse. */
const memoriser = <T,>(charger: () => Promise<T>) => {
  let promesse: Promise<T> | undefined;
  return () => promesse ??= charger();
};

/** Une scène qui ne se charge pas (nouvelle version de l'appli, hors ligne) ne montre rien : la fin du défi reste intacte. */
const chargerSansEchec = <Cle extends string>(charger: () => Promise<Module<Cle>>) =>
  lazy(() => charger().catch(() => ({ default: EspaceDeLaScene })));

const chargerSports = memoriser(() => import("./sports/SceneDesSports.tsx"));
const chargerDanse = memoriser(() => import("./danse/SceneDeLaDanse.tsx"));

const SceneDesSports = chargerSansEchec(chargerSports);
const SceneDeLaDanse = chargerSansEchec(chargerDanse);

/**
 * Charge à l'avance la scène de l'univers, tant que le réseau est là (à l'ouverture du défi) : si le réseau se coupe pendant le défi,
 * la célébration de la fin se joue quand même. Un échec est ignoré : la fin du défi retombe sur l'espace vide.
 */
export function prechargerLaSceneDe(univers: CleUnivers): void {
  const charger = univers === "sports" ? chargerSports : univers === "danse" ? chargerDanse : undefined;
  charger?.().catch(() => undefined);
}

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
