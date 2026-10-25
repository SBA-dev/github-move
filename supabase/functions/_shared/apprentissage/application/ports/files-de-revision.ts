import type { FileDeRevision } from "../../domain/file-de-revision.ts";

export interface FilesDeRevision {
  /** La file de révision du profil et sa version, ou `null` si elle n'a jamais été écrite. */
  de(enfant: string): Promise<{ file: FileDeRevision; version: number } | null>;
}
