import type { CSSProperties } from "react";
import type { CleUnivers } from "@domain/motivation";
import { PALETTES } from "./palettes.ts";

/** La couleur principale posée sur la racine de l'application : les feuilles de style la lisent par ces deux jetons. */
export type Habillage = CSSProperties & {
  readonly "--principale": string;
  readonly "--principale-foncee": string;
};

export function habillageDeLUnivers(univers: CleUnivers): Habillage {
  const { principale, foncee } = PALETTES[univers];
  return { "--principale": principale, "--principale-foncee": foncee };
}

/** Palette neutre et sobre des écrans du parent : jamais la couleur de l'univers de l'enfant. */
export const HABILLAGE_DU_PARENT: Habillage = {
  "--principale": "#3D4F6B",
  "--principale-foncee": "#2A3850",
};
