import type { CleDeTenue, VarianteDe } from "@domain/motivation";
import { SceneAnimee } from "../commun/SceneAnimee.tsx";
import { DecorDesPrincesses } from "./DecorDesPrincesses.tsx";
import { creerLaScene } from "./scene.ts";

type Props = { readonly cle: VarianteDe<"princesse">; readonly cri: string; readonly tenue?: CleDeTenue | undefined };

/** La scène de Lumi. Export par défaut : elle est chargée à la demande (`React.lazy`), seulement quand l'univers est Princesses et fées. */
export default function SceneDesPrincesses({ cle, cri, tenue }: Props) {
  return <SceneAnimee univers="princesse" cle={cle} cri={cri} Decor={DecorDesPrincesses} creerLaScene={creerLaScene} tenue={tenue} />;
}
