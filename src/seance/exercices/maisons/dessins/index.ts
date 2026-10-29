import type { CleUnivers } from "@domain/motivation";
import { DESSIN_ANIMAUX } from "./animaux.tsx";
import { DESSIN_DANSE } from "./danse.tsx";
import type { DessinDeMaison } from "./dessin-de-maison.ts";
import { DESSIN_POLICE } from "./police.tsx";
import { DESSIN_POMPIER } from "./pompier.tsx";
import { DESSIN_PRINCESSE } from "./princesse.tsx";
import { DESSIN_SPORTS } from "./sports.tsx";

export const DESSINS_DES_MAISONS: Readonly<Record<CleUnivers, DessinDeMaison>> = {
  animaux: DESSIN_ANIMAUX,
  princesse: DESSIN_PRINCESSE,
  sports: DESSIN_SPORTS,
  police: DESSIN_POLICE,
  pompier: DESSIN_POMPIER,
  danse: DESSIN_DANSE,
};
export type { DessinDeMaison } from "./dessin-de-maison.ts";
