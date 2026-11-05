import type { VarianteDe } from "@domain/motivation";
import { SceneAnimee } from "../commun/SceneAnimee.tsx";
import { DecorDesSports } from "./DecorDesSports.tsx";
import { creerLaScene } from "./scene.ts";

type Props = { readonly cle: VarianteDe<"sports">; readonly cri: string };

/** La scène de Coach Léo. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Sports. */
export default function SceneDesSports({ cle, cri }: Props) {
  return <SceneAnimee univers="sports" cle={cle} cri={cri} Decor={DecorDesSports} creerLaScene={creerLaScene} />;
}
