import type { CleDeTenue, VarianteDe } from "@domain/motivation";
import { SceneAnimee } from "../commun/SceneAnimee.tsx";
import { DecorDeLaDanse } from "./DecorDeLaDanse.tsx";
import { creerLaScene } from "./scene.ts";

type Props = { readonly cle: VarianteDe<"danse">; readonly cri: string; readonly tenue?: CleDeTenue | undefined };

/** La scène de Lili. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Danse. */
export default function SceneDeLaDanse({ cle, cri, tenue }: Props) {
  return <SceneAnimee univers="danse" cle={cle} cri={cri} Decor={DecorDeLaDanse} creerLaScene={creerLaScene} tenue={tenue} />;
}
