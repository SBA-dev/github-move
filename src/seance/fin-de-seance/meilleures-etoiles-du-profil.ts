import { type Etoiles, meilleuresEtoilesReunies } from "@domain/apprentissage";
import { etoilesGagneesPendantLUtilisation } from "./etoiles-gagnees-pendant-l-utilisation.ts";
import { reseauDisponible } from "./reseau-disponible.ts";
import { lireToutesLesMeilleuresEtoiles } from "./lecture-des-meilleures-etoiles-supabase.ts";

/** Les étoiles enregistrées par le serveur (sans réseau : seulement celles de cet appareil), complétées par celles gagnées dans ce navigateur (la meilleure l'emporte). */
export async function lireLesMeilleuresEtoilesDuProfil(profil: string): Promise<ReadonlyMap<string, Etoiles>> {
  const duServeur = reseauDisponible() ? await lireToutesLesMeilleuresEtoiles(profil) : new Map<string, Etoiles>();
  return meilleuresEtoilesReunies(duServeur, etoilesGagneesPendantLUtilisation(profil));
}
