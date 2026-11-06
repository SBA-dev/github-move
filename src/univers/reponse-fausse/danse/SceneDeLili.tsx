import { type PropsDeLaScene, SceneAnimeeDeReponseFausse } from "../SceneAnimeeDeReponseFausse.tsx";
import { DecorDeLili } from "./DecorDeLili.tsx";
import { creerLaScene } from "./scene.ts";

/** La scène de Lili. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Danse. */
export default function SceneDeLili(props: PropsDeLaScene) {
  return <SceneAnimeeDeReponseFausse univers="danse" Decor={DecorDeLili} creerLaScene={creerLaScene} {...props} />;
}
