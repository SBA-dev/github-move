import type { DefiReleve } from "@domain/apprentissage";
import { defisRelevesDeLAppareil, retenirLesDefisReleves } from "./defis-releves-sur-l-appareil.ts";
import { lireLesDefisRelevesDuServeur } from "./lecture-des-defis-releves-supabase.ts";

/**
 * Les défis relevés du profil : ceux que le serveur a enregistrés (lus sous RLS) réunis à ceux de l'appareil, terminés ici et
 * pas encore enregistrés. Sans réseau, seule la copie de l'appareil est connue.
 */
export async function lireLesDefisReleves(profil: string): Promise<readonly DefiReleve[]> {
  const duServeur = await lireLesDefisRelevesDuServeur(profil);
  return duServeur ? retenirLesDefisReleves(profil, duServeur) : defisRelevesDeLAppareil(profil);
}
