import { lazy, type ReactNode, Suspense } from "react";
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

const SceneDeCoachLeo = chargerAvecRepli(chargerSports);
const SceneDeLili = chargerAvecRepli(chargerDanse);
const SceneDeNoisette = chargerAvecRepli(chargerAnimaux);

/** Les univers qui ont leur scène de réponse fausse dessinée : une livraison par personnage guide. */
const CHARGEURS_DES_SCENES: Partial<Record<CleUnivers, () => Promise<unknown>>> = {
  sports: chargerSports,
  danse: chargerDanse,
  animaux: chargerAnimaux,
};

/**
 * Charge à l'avance la scène de l'univers du profil, tant que le réseau est là : si le réseau se coupe pendant la séance,
 * la première réponse fausse joue quand même sa scène. Une erreur de chargement est ignorée : le dessin du personnage guide reste.
 */
export function prechargerLaSceneDeReponseFausseDe(univers: CleUnivers): void {
  CHARGEURS_DES_SCENES[univers]?.().catch(() => undefined);
}

type Props = PropsChargees & { readonly scene: SceneChoisieParLeDomaine };

/**
 * La scène de réponse fausse du personnage guide de l'univers, jouée à la place de son dessin : elle ne fait qu'afficher ce que le domaine a décidé.
 * Chaque scène est chargée à la demande, seulement pour l'univers du profil ; en attendant, ou si le chargement échoue, le dessin du personnage guide reste.
 */
export function SceneDeReponseFausse({ scene, ...props }: Props) {
  switch (scene.univers) {
    case "sports":
      return <Suspense fallback={props.repli}><SceneDeCoachLeo {...props} /></Suspense>;
    case "danse":
      return <Suspense fallback={props.repli}><SceneDeLili {...props} /></Suspense>;
    case "animaux":
      return <Suspense fallback={props.repli}><SceneDeNoisette {...props} /></Suspense>;
    default:
      return props.repli;
  }
}
