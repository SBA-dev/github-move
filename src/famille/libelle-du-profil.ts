import type { ProfilEnfant } from "@domain/famille";
import { universDe } from "@domain/motivation";

/** « CE1 · Danse » : la classe et l'univers du profil, comme dans « Qui joue ? ». */
export function classeEtUnivers(profil: ProfilEnfant): string {
  return `${profil.niveau.valeur} · ${universDe(profil.univers).libelle}`;
}
