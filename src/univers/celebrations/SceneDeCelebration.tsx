import { type ComponentType, lazy, Suspense } from "react";
import type { CelebrationDeLUnivers, CleDeTenue, CleUnivers } from "@domain/motivation";

type PropsDeScene<Cle extends string> = { readonly cle: Cle; readonly cri: string; readonly tenue?: CleDeTenue | undefined };

/** L'espace de la scène, vide : il garde la place pour que les boutons ne bougent pas quand la scène arrive, ou quand elle n'arrive pas. */
function EspaceDeLaScene() {
  return <div className="celebration-de-l-univers" aria-hidden="true" />;
}

type Module<Cle extends string> = { default: ComponentType<PropsDeScene<Cle>> };

/** Le morceau d'une scène est demandé une seule fois : le préchargement et l'affichage partagent la même promesse. Un échec n'est pas gardé : l'appel suivant retente. */
const memoriser = <T,>(charger: () => Promise<T>) => {
  let promesse: Promise<T> | undefined;
  return () =>
    promesse ??= charger().catch((erreur: unknown) => {
      promesse = undefined;
      throw erreur;
    });
};

/** Une scène qui ne se charge pas (nouvelle version de l'appli, hors ligne) ne montre rien : la fin du défi reste intacte. */
const chargerSansEchec = <Cle extends string>(charger: () => Promise<Module<Cle>>) =>
  lazy(() => charger().catch(() => ({ default: EspaceDeLaScene })));

const chargerSports = memoriser(() => import("./sports/SceneDesSports.tsx"));
const chargerDanse = memoriser(() => import("./danse/SceneDeLaDanse.tsx"));
const chargerAnimaux = memoriser(() => import("./animaux/SceneDesAnimaux.tsx"));
const chargerPrincesses = memoriser(() => import("./princesses/SceneDesPrincesses.tsx"));
const chargerPolice = memoriser(() => import("./police/SceneDeLaPolice.tsx"));
const chargerPompiers = memoriser(() => import("./pompiers/SceneDesPompiers.tsx"));

const SceneDesSports = chargerSansEchec(chargerSports);
const SceneDeLaDanse = chargerSansEchec(chargerDanse);
const SceneDesAnimaux = chargerSansEchec(chargerAnimaux);
const SceneDesPrincesses = chargerSansEchec(chargerPrincesses);
const SceneDeLaPolice = chargerSansEchec(chargerPolice);
const SceneDesPompiers = chargerSansEchec(chargerPompiers);

/** Un univers sans chargeur ne compile pas : le préchargement ne peut pas oublier une scène. */
const CHARGEURS_DES_SCENES: Record<CleUnivers, () => Promise<unknown>> = {
  sports: chargerSports,
  danse: chargerDanse,
  animaux: chargerAnimaux,
  princesse: chargerPrincesses,
  police: chargerPolice,
  pompier: chargerPompiers,
};

/**
 * Charge à l'avance la scène de l'univers, tant que le réseau est là (dès que le profil de l'enfant est connu, puis à l'ouverture du défi) : si le réseau se coupe pendant le défi,
 * la célébration de la fin se joue quand même. Un échec est ignoré : la fin du défi retombe sur l'espace vide.
 */
export function prechargerLaSceneDe(univers: CleUnivers): void {
  CHARGEURS_DES_SCENES[univers]().catch(() => undefined);
}

/** Un univers célébré qui n'a pas de scène ne compile pas : ajouter un univers au domaine oblige à dessiner sa scène ici. */
function universSansScene(celebration: never): never {
  throw new Error(`Aucune scène de célébration pour ${JSON.stringify(celebration)}`);
}

type Props = { readonly celebration: CelebrationDeLUnivers; readonly tenue?: CleDeTenue | undefined };

/**
 * La célébration de l'univers, jouée à la place de la célébration commune : elle ne fait qu'afficher ce que le domaine a décidé
 * (la variante tirée, le cri de victoire). Dessin décoratif (`aria-hidden`) : l'annonce du moment est donnée ailleurs, une seule fois.
 * Le personnage guide y porte la tenue donnée (rien sans tenue) : le domaine a choisi laquelle, la scène la dessine sur ses articulations.
 * Elle ne capte aucun toucher et ne prend jamais le focus. Avec les mouvements réduits : l'image fixe de l'état final, sans confetti.
 * Chaque scène est chargée à la demande, seulement pour l'univers du profil : en attendant, ou si le chargement échoue,
 * un espace vide de même taille est réservé et la fin du défi reste utilisable.
 */
export function SceneDeCelebration({ celebration, tenue }: Props) {
  switch (celebration.univers) {
    case "sports":
      return <Suspense fallback={<EspaceDeLaScene />}><SceneDesSports cle={celebration.variante.cle} cri={celebration.cri} tenue={tenue} /></Suspense>;
    case "danse":
      return <Suspense fallback={<EspaceDeLaScene />}><SceneDeLaDanse cle={celebration.variante.cle} cri={celebration.cri} tenue={tenue} /></Suspense>;
    case "animaux":
      return <Suspense fallback={<EspaceDeLaScene />}><SceneDesAnimaux cle={celebration.variante.cle} cri={celebration.cri} tenue={tenue} /></Suspense>;
    case "princesse":
      return <Suspense fallback={<EspaceDeLaScene />}><SceneDesPrincesses cle={celebration.variante.cle} cri={celebration.cri} tenue={tenue} /></Suspense>;
    case "police":
      return <Suspense fallback={<EspaceDeLaScene />}><SceneDeLaPolice cle={celebration.variante.cle} cri={celebration.cri} tenue={tenue} /></Suspense>;
    case "pompier":
      return <Suspense fallback={<EspaceDeLaScene />}><SceneDesPompiers cle={celebration.variante.cle} cri={celebration.cri} tenue={tenue} /></Suspense>;
    default:
      return universSansScene(celebration);
  }
}
