import { type PropsDeLaScene, SceneAnimeeDeReponseFausse } from "../SceneAnimeeDeReponseFausse.tsx";
import { DecorDeNoisette } from "./DecorDeNoisette.tsx";
import { creerLaScene } from "./scene.ts";

/** La scène de Noisette. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Animaux de la forêt. */
export default function SceneDeNoisette(props: PropsDeLaScene) {
  return <SceneAnimeeDeReponseFausse univers="animaux" Decor={DecorDeNoisette} creerLaScene={creerLaScene} {...props} />;
}
