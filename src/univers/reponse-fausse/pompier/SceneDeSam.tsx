import { type PropsDeLaScene, SceneAnimeeDeReponseFausse } from "../SceneAnimeeDeReponseFausse.tsx";
import { DecorDeSam } from "./DecorDeSam.tsx";
import { creerLaScene } from "./scene.ts";

/** La scène de Sam. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Pompier. */
export default function SceneDeSam(props: PropsDeLaScene) {
  return <SceneAnimeeDeReponseFausse univers="pompier" Decor={DecorDeSam} creerLaScene={creerLaScene} {...props} />;
}
