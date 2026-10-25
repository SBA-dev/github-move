import type { ProfilEnfantId } from "../../famille/domain/index.ts";
import type { ProfilSuivi } from "./entrees-du-suivi.ts";

export function enfantSuivi(
  profilsRattaches: readonly ProfilSuivi[],
  choix?: ProfilEnfantId,
): ProfilSuivi | undefined {
  const choisi = choix && profilsRattaches.find((profil) => profil.id.valeur === choix.valeur);
  return choisi || profilsRattaches[0];
}
