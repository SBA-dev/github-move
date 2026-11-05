import type { VarianteDe } from "@domain/motivation";
import { SceneAnimee } from "../commun/SceneAnimee.tsx";
import { DecorDeLaPolice } from "./DecorDeLaPolice.tsx";
import { creerLaScene } from "./scene.ts";

type Props = { readonly cle: VarianteDe<"police">; readonly cri: string };

/** La scène d'Agent Max. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Police. */
export default function SceneDeLaPolice({ cle, cri }: Props) {
  return <SceneAnimee univers="police" cle={cle} cri={cri} Decor={DecorDeLaPolice} creerLaScene={creerLaScene} />;
}
