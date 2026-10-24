import { type Etoiles, meilleuresEtoilesReunies } from "@domain/apprentissage";
import { etoilesGagneesPendantLUtilisation } from "./etoiles-gagnees-pendant-l-utilisation.ts";
import { lireToutesLesMeilleuresEtoiles } from "./lecture-des-meilleures-etoiles-supabase.ts";

/** Les étoiles enregistrées par le serveur, complétées par celles gagnées dans ce navigateur (la meilleure l'emporte). */
export async function lireLesMeilleuresEtoilesDuProfil(profil: string): Promise<ReadonlyMap<string, Etoiles>> {
  return meilleuresEtoilesReunies(await lireToutesLesMeilleuresEtoiles(profil), etoilesGagneesPendantLUtilisation(profil));
}
