import type { MeilleuresEtoilesDuProfil } from "@domain/motivation";
import { reseauDisponible } from "../../reseau/reseau-disponible.ts";
import { lireLesMeilleuresEtoilesDuProfil } from "./meilleures-etoiles-du-profil.ts";

/** Les meilleures étoiles du profil telles que la cabane les compte ; `undefined` quand les étoiles du serveur ne peuvent pas être lues (sans réseau). */
export async function lireLesMeilleuresEtoilesPourLaCabane(profil: string): Promise<MeilleuresEtoilesDuProfil | undefined> {
  if (!reseauDisponible()) return undefined;
  const lues = await lireLesMeilleuresEtoilesDuProfil(profil);
  return new Map([...lues].map(([lecon, etoiles]) => [lecon, etoiles.nombre]));
}
