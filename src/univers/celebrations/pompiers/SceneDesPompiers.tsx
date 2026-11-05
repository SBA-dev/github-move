import type { CleDeTenue, VarianteDe } from "@domain/motivation";
import { SceneAnimee } from "../commun/SceneAnimee.tsx";
import { DecorDesPompiers } from "./DecorDesPompiers.tsx";
import { creerLaScene } from "./scene.ts";

type Props = { readonly cle: VarianteDe<"pompier">; readonly cri: string; readonly tenue?: CleDeTenue | undefined };

/** La scène de Capitaine Sam. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Pompiers. */
export default function SceneDesPompiers({ cle, cri, tenue }: Props) {
  return <SceneAnimee univers="pompier" cle={cle} cri={cri} Decor={DecorDesPompiers} creerLaScene={creerLaScene} tenue={tenue} />;
}
