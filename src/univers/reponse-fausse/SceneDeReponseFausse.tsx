import { lazy, type LazyExoticComponent, type ReactNode, Suspense } from "react";
import type { CleUnivers, SceneDeReponseFausse as SceneChoisieParLeDomaine } from "@domain/motivation";
import { memoriser } from "../chargement-a-la-demande.ts";
import type { PropsDeLaScene } from "./SceneAnimeeDeReponseFausse.tsx";

type PropsChargees = PropsDeLaScene & {
  /** Le dessin du personnage guide : il reste affiché tant que la scène n'est pas là, et si elle n'arrive jamais. */
  readonly repli: ReactNode;
};

function Repli({ repli }: PropsChargees) {
  return <>{repli}</>;
}

/** Une scène qui ne se charge pas (nouvelle version de l'appli, hors ligne) ne montre rien de plus : le dessin reste, la nouvelle chance n'attend pas (163.19). */
const chargerAvecRepli = (charger: () => Promise<{ default: (props: PropsDeLaScene) => ReactNode }>) =>
  lazy((): Promise<{ default: (props: PropsChargees) => ReactNode }> => charger().catch(() => ({ default: Repli })));

const chargerSports = memoriser(() => import("./sports/SceneDeCoachLeo.tsx"));

const chargerDanse = memoriser(() => import("./danse/SceneDeLili.tsx"));

const chargerAnimaux = memoriser(() => import("./animaux/SceneDeNoisette.tsx"));

const chargerPrincesse = memoriser(() => import("./princesse/SceneDeLumi.tsx"));

const chargerPolice = memoriser(() => import("./police/SceneDeMax.tsx"));

const chargerPompier = memoriser(() => import("./pompier/SceneDeSam.tsx"));

const SceneDeCoachLeo = chargerAvecRepli(chargerSports);
const SceneDeLili = chargerAvecRepli(chargerDanse);
const SceneDeNoisette = chargerAvecRepli(chargerAnimaux);
const SceneDeLumi = chargerAvecRepli(chargerPrincesse);
const SceneDeMax = chargerAvecRepli(chargerPolice);
const SceneDeSam = chargerAvecRepli(chargerPompier);

/** La scène chargée à la demande de chaque univers : l'oubli d'un univers est une erreur de compilation. */
const SCENES_DES_UNIVERS: Record<CleUnivers, LazyExoticComponent<(props: PropsChargees) => ReactNode>> = {
  sports: SceneDeCoachLeo,
  danse: SceneDeLili,
  animaux: SceneDeNoisette,
  princesse: SceneDeLumi,
  police: SceneDeMax,
  pompier: SceneDeSam,
};

/** Les scènes de réponse fausse dessinées, une par univers : l'oubli d'un univers est une erreur de compilation. */
const CHARGEURS_DES_SCENES: Record<CleUnivers, () => Promise<unknown>> = {
  sports: chargerSports,
  danse: chargerDanse,
  animaux: chargerAnimaux,
  princesse: chargerPrincesse,
  police: chargerPolice,
  pompier: chargerPompier,
};

/**
 * Charge à l'avance la scène de l'univers du profil, tant que le réseau est là : si le réseau se coupe pendant la séance,
 * la première réponse fausse joue quand même sa scène. Une erreur de chargement est ignorée : le dessin du personnage guide reste.
 */
export function prechargerLaSceneDeReponseFausseDe(univers: CleUnivers): void {
  CHARGEURS_DES_SCENES[univers]().catch(() => undefined);
}

type Props = PropsChargees & { readonly scene: SceneChoisieParLeDomaine };

/**
 * La scène de réponse fausse du personnage guide de l'univers, jouée à la place de son dessin : elle ne fait qu'afficher ce que le domaine a décidé.
 * Chaque scène est chargée à la demande, seulement pour l'univers du profil ; en attendant, ou si le chargement échoue, le dessin du personnage guide reste.
 */
export function SceneDeReponseFausse({ scene, ...props }: Props) {
  const Scene = SCENES_DES_UNIVERS[scene.univers];
  return <Suspense fallback={props.repli}><Scene {...props} /></Suspense>;
}
