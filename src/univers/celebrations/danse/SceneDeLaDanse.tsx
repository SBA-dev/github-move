import type { VarianteDe } from "@domain/motivation";
import { SceneAnimee } from "../commun/SceneAnimee.tsx";
import { DecorDeLaDanse } from "./DecorDeLaDanse.tsx";
import { creerLaScene } from "./scene.ts";

type Props = { readonly cle: VarianteDe<"danse">; readonly cri: string };

/** La scène de Lili. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Danse. */
export default function SceneDeLaDanse({ cle, cri }: Props) {
  return <SceneAnimee univers="danse" cle={cle} cri={cri} Decor={DecorDeLaDanse} creerLaScene={creerLaScene} />;
}
