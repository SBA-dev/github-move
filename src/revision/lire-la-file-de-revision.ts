import type { FileDeRevision } from "@domain/apprentissage";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { attendreLesEnvoisEnCours } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import { adopterLaFileDuServeur, fileDeRevisionDeLAppareil } from "./copie-de-la-file-sur-l-appareil.ts";
import { lireLaFileDeRevisionDuServeur } from "./lecture-de-la-file-de-revision-supabase.ts";
import { attendreLesEnvoisDesSeancesDeRevision } from "./sauvegarde-de-la-seance-de-revision.ts";

/**
 * La file de révision du profil : celle du serveur (lue sous RLS) quand le réseau répond, complétée par les séances pas encore
 * enregistrées ; sinon la copie de l'appareil. `undefined` quand aucune file n'est connue : l'accueil ne propose alors rien, sans message.
 */
export async function lireLaFileDeRevision(profil: string): Promise<FileDeRevision | undefined> {
  if (reseauDisponible()) await Promise.all([attendreLesEnvoisEnCours(), attendreLesEnvoisDesSeancesDeRevision()]);
  const duServeur = await lireLaFileDeRevisionDuServeur(profil);
  return duServeur ? adopterLaFileDuServeur(profil, duServeur) : fileDeRevisionDeLAppareil(profil);
}
