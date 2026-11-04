import type { CleUnivers } from "@domain/motivation";
import teteAnimaux from "./tete-animaux.svg?url";
import teteDanse from "./tete-danse.svg?url";
import tetePolice from "./tete-police.svg?url";
import tetePompier from "./tete-pompier.svg?url";
import tetePrincesse from "./tete-princesse.svg?url";
import teteSports from "./tete-sports.svg?url";
import wagonAnimaux from "./wagon-animaux.svg?url";
import wagonDanse from "./wagon-danse.svg?url";
import wagonPolice from "./wagon-police.svg?url";
import wagonPompier from "./wagon-pompier.svg?url";
import wagonPrincesse from "./wagon-princesse.svg?url";
import wagonSports from "./wagon-sports.svg?url";

/** Les deux dessins du petit train d'un univers : la tête (150 × 110, fixe) et le wagon (120 × 110, découpé en neuf par `border-image`). */
export type DessinsDuPetitTrain = { readonly tete: string; readonly wagon: string };

export const DESSINS_DU_PETIT_TRAIN: Readonly<Record<CleUnivers, DessinsDuPetitTrain>> = {
  animaux: { tete: teteAnimaux, wagon: wagonAnimaux },
  princesse: { tete: tetePrincesse, wagon: wagonPrincesse },
  sports: { tete: teteSports, wagon: wagonSports },
  police: { tete: tetePolice, wagon: wagonPolice },
  pompier: { tete: tetePompier, wagon: wagonPompier },
  danse: { tete: teteDanse, wagon: wagonDanse },
};
