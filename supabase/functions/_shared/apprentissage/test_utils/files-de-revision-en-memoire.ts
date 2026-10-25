import type { FilesDeRevision } from "../application/ports/files-de-revision.ts";
import { type DonneesDeFileDeRevision, FileDeRevision } from "../domain/file-de-revision.ts";

type Entree = { readonly donnees: DonneesDeFileDeRevision; readonly version: number };

function donneesDe(file: FileDeRevision): DonneesDeFileDeRevision {
  return { enfant: file.enfant, questions: file.questions, erreursCorrigeesPourDeBon: file.erreursCorrigeesPourDeBon };
}

/** Les files de révision des profils. L'écriture passe par `SeancesTermineesEnMemoire`, avec la séance. */
export class FilesDeRevisionEnMemoire implements FilesDeRevision {
  private readonly entrees = new Map<string, Entree>();
  private autreAppareilApresLaProchaineLecture: ((file: FileDeRevision) => void) | undefined;
  private autreAppareilApresChaqueLecture: ((file: FileDeRevision) => void) | undefined;

  de(enfant: string): Promise<{ file: FileDeRevision; version: number } | null> {
    const lue = this.lire(enfant);
    this.faireAgirLAutreAppareil(enfant);
    return Promise.resolve(lue);
  }

  /** Lecture synchrone pour les assertions : la file stockée, ou null si elle n'a jamais été écrite. */
  fileDe(enfant: string): FileDeRevision | null {
    return this.lire(enfant)?.file ?? null;
  }

  version(enfant: string): number {
    return this.entrees.get(enfant)?.version ?? 0;
  }

  ecrire(file: FileDeRevision): void {
    this.entrees.set(file.enfant, { donnees: donneesDe(file), version: this.version(file.enfant) + 1 });
  }

  /** Simule un autre appareil qui modifie la file juste après la prochaine lecture du cas d'usage. */
  apresLaProchaineLecture(action: (file: FileDeRevision) => void): void {
    this.autreAppareilApresLaProchaineLecture = action;
  }

  /** Simule un autre appareil qui modifie la file juste après chaque lecture du cas d'usage. */
  apresChaqueLecture(action: (file: FileDeRevision) => void): void {
    this.autreAppareilApresChaqueLecture = action;
  }

  private lire(enfant: string): { file: FileDeRevision; version: number } | null {
    const entree = this.entrees.get(enfant);
    return entree ? { file: FileDeRevision.reconstituer(entree.donnees), version: entree.version } : null;
  }

  private faireAgirLAutreAppareil(enfant: string): void {
    const action = this.autreAppareilApresLaProchaineLecture ?? this.autreAppareilApresChaqueLecture;
    if (!action) return;
    this.autreAppareilApresLaProchaineLecture = undefined;
    const file = this.lire(enfant)?.file ?? FileDeRevision.vide(enfant);
    action(file);
    this.ecrire(file);
  }
}
