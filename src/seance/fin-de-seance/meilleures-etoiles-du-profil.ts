import type { Etoiles } from "@domain/apprentissage";
import { etoilesGagneesPendantLUtilisation } from "./etoiles-gagnees-pendant-l-utilisation.ts";
import { lireToutesLesMeilleuresEtoiles } from "./lecture-des-meilleures-etoiles-supabase.ts";

/** Les étoiles enregistrées par le serveur, complétées par celles gagnées dans ce navigateur (la meilleure l'emporte). */
export async function lireLesMeilleuresEtoilesDuProfil(profil: string): Promise<ReadonlyMap<string, Etoiles>> {
  const meilleures = new Map(await lireToutesLesMeilleuresEtoiles(profil));
  for (const [lecon, etoiles] of etoilesGagneesPendantLUtilisation(profil)) {
    meilleures.set(lecon, etoiles.meilleureQue(meilleures.get(lecon)));
  }
  return meilleures;
}
