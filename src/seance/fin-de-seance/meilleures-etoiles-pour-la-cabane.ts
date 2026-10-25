import { meilleuresEtoilesReunies } from "@domain/apprentissage";
import type { MeilleuresEtoilesDuProfil } from "@domain/motivation";
import { reseauDisponible } from "../../reseau/reseau-disponible.ts";
import { etoilesGagneesPendantLUtilisation } from "./etoiles-gagnees-pendant-l-utilisation.ts";
import { lireToutesLesMeilleuresEtoilesSiPossible } from "./lecture-des-meilleures-etoiles-supabase.ts";

/** Au-delà, la lecture des étoiles d'avant la séance est abandonnée : la félicitation est dite sans objet plutôt que d'attendre sans fin. */
export const DELAI_MAXIMAL_DE_LECTURE_EN_MS = 5000;

/** Les meilleures étoiles du profil telles que la cabane les compte ; `undefined` quand les étoiles du serveur ne peuvent pas être lues (sans réseau, ou lecture en échec). */
export async function lireLesMeilleuresEtoilesPourLaCabane(profil: string): Promise<MeilleuresEtoilesDuProfil | undefined> {
  if (!reseauDisponible()) return undefined;
  const duServeur = await lireToutesLesMeilleuresEtoilesSiPossible(profil);
  if (duServeur === undefined) return undefined;
  const reunies = meilleuresEtoilesReunies(duServeur, etoilesGagneesPendantLUtilisation(profil));
  return new Map([...reunies].map(([lecon, etoiles]) => [lecon, etoiles.nombre]));
}

/** Les étoiles d'avant la séance, ou `undefined` si leur lecture dépasse le délai maximal. */
export function lireLesMeilleuresEtoilesAvantLaSeance(profil: string): Promise<MeilleuresEtoilesDuProfil | undefined> {
  const abandon = new Promise<undefined>((resoudre) => setTimeout(resoudre, DELAI_MAXIMAL_DE_LECTURE_EN_MS));
  return Promise.race([lireLesMeilleuresEtoilesPourLaCabane(profil), abandon]);
}
