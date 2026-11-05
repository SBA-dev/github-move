import type { VarianteDe } from "@domain/motivation";
import { SceneAnimee } from "../commun/SceneAnimee.tsx";
import { DecorDesPompiers } from "./DecorDesPompiers.tsx";
import { creerLaScene } from "./scene.ts";

type Props = { readonly cle: VarianteDe<"pompier">; readonly cri: string };

/** La scène de Capitaine Sam. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Pompiers. */
export default function SceneDesPompiers({ cle, cri }: Props) {
  return <SceneAnimee univers="pompier" cle={cle} cri={cri} Decor={DecorDesPompiers} creerLaScene={creerLaScene} />;
}
