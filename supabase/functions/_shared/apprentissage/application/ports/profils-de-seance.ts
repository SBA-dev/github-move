import type { ProfilDeSeance } from "../../domain/profil-de-seance.ts";

export interface ProfilsDeSeance {
  profilDe(enfant: string): Promise<ProfilDeSeance>;
}
