import type { CleDeTenue, VarianteDe } from "@domain/motivation";
import { SceneAnimee } from "../commun/SceneAnimee.tsx";
import { DecorDesAnimaux } from "./DecorDesAnimaux.tsx";
import { creerLaScene } from "./scene.ts";

type Props = { readonly cle: VarianteDe<"animaux">; readonly cri: string; readonly tenue?: CleDeTenue | undefined };

/** La scène de Noisette. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Animaux de la forêt. */
export default function SceneDesAnimaux({ cle, cri, tenue }: Props) {
  return <SceneAnimee univers="animaux" cle={cle} cri={cri} Decor={DecorDesAnimaux} creerLaScene={creerLaScene} tenue={tenue} />;
}
