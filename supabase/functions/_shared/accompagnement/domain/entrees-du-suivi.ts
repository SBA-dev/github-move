import type { Niveau } from "../../catalogue/domain/index.ts";
import type { ProfilEnfantId } from "../../famille/domain/index.ts";

export type ProfilSuivi = Readonly<{
  id: ProfilEnfantId;
  prenom: string;
  niveau: Niveau;
}>;
