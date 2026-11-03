import type { CleUnivers } from "@domain/motivation";
import { BULLE_DES_ANIMAUX } from "./animaux.tsx";
import { BULLE_DE_LA_DANSE } from "./danse.tsx";
import type { DessinDeBulle } from "./dessin-de-bulle.tsx";
import { BULLE_DE_LA_POLICE } from "./police.tsx";
import { BULLE_DES_POMPIERS } from "./pompier.tsx";
import { BULLE_DES_PRINCESSES } from "./princesse.tsx";
import { BULLE_DES_SPORTS } from "./sports.tsx";

export const DESSINS_DES_BULLES: Readonly<Record<CleUnivers, DessinDeBulle>> = {
  animaux: BULLE_DES_ANIMAUX,
  princesse: BULLE_DES_PRINCESSES,
  sports: BULLE_DES_SPORTS,
  police: BULLE_DE_LA_POLICE,
  pompier: BULLE_DES_POMPIERS,
  danse: BULLE_DE_LA_DANSE,
};
