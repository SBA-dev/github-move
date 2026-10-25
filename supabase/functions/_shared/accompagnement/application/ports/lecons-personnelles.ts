import type { LeconPersonnelle } from "../../domain/lecon-personnelle.ts";

export interface LeconsPersonnelles {
  enregistrer(leconPersonnelle: LeconPersonnelle): Promise<void>;
  parId(id: string): Promise<LeconPersonnelle | undefined>;
  supprimer(id: string): Promise<void>;
}
