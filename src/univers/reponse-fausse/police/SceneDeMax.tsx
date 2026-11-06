import { type PropsDeLaScene, SceneAnimeeDeReponseFausse } from "../SceneAnimeeDeReponseFausse.tsx";
import { DecorDeMax } from "./DecorDeMax.tsx";
import { creerLaScene } from "./scene.ts";

/** La scène de Max. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Police. */
export default function SceneDeMax(props: PropsDeLaScene) {
  return <SceneAnimeeDeReponseFausse univers="police" Decor={DecorDeMax} creerLaScene={creerLaScene} {...props} />;
}
