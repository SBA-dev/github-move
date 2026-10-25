import { useEffect, useState } from "react";
import type { FileDeRevision } from "@domain/apprentissage";
import { lireLaFileDeRevision } from "./lire-la-file-de-revision.ts";

/** La file du profil : `undefined` pendant la lecture, `null` quand aucune file n'est connue. */
export function useFileDeRevision(profil: string): FileDeRevision | null | undefined {
  const [file, setFile] = useState<FileDeRevision | null | undefined>();
  useEffect(() => {
    let annule = false;
    void lireLaFileDeRevision(profil).then((lue) => {
      if (!annule) setFile(lue ?? null);
    });
    return () => {
      annule = true;
    };
  }, [profil]);
  return file;
}
