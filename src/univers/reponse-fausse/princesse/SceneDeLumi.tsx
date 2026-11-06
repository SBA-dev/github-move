import { type PropsDeLaScene, SceneAnimeeDeReponseFausse } from "../SceneAnimeeDeReponseFausse.tsx";
import { DecorDeLumi } from "./DecorDeLumi.tsx";
import { creerLaScene } from "./scene.ts";

/** La scène de Lumi. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Princesses et fées. */
export default function SceneDeLumi(props: PropsDeLaScene) {
  return <SceneAnimeeDeReponseFausse univers="princesse" Decor={DecorDeLumi} creerLaScene={creerLaScene} {...props} />;
}
