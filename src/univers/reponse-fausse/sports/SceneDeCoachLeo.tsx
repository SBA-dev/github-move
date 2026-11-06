import { type PropsDeLaScene, SceneAnimeeDeReponseFausse } from "../SceneAnimeeDeReponseFausse.tsx";
import { DecorDeLeo } from "./DecorDeLeo.tsx";
import { creerLaScene } from "./scene.ts";

/** La scène de Coach Léo. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Sports. */
export default function SceneDeCoachLeo(props: PropsDeLaScene) {
  return <SceneAnimeeDeReponseFausse univers="sports" Decor={DecorDeLeo} creerLaScene={creerLaScene} {...props} />;
}
