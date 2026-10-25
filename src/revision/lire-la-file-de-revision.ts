import type { FileDeRevision } from "@domain/apprentissage";
import { adopterLaFileDuServeur, fileDeRevisionDeLAppareil } from "./copie-de-la-file-sur-l-appareil.ts";
import { lireLaFileDeRevisionDuServeur } from "./lecture-de-la-file-de-revision-supabase.ts";

/**
 * La file de révision du profil : la copie de l'appareil quand il en a une ; sinon, à la première lecture (ou après une déconnexion),
 * celle du serveur (lue sous RLS). Ensuite l'appareil seul fait évoluer sa copie. `undefined` quand aucune file n'est connue :
 * l'accueil ne propose alors rien, sans message.
 */
export async function lireLaFileDeRevision(profil: string): Promise<FileDeRevision | undefined> {
  const copie = fileDeRevisionDeLAppareil(profil);
  if (copie) return copie;
  const duServeur = await lireLaFileDeRevisionDuServeur(profil);
  return duServeur ? adopterLaFileDuServeur(profil, duServeur) : undefined;
}
