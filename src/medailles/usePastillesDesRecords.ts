import { useEffect, useState } from "react";
import type { Lecon } from "@domain/catalogue";
import { pastillesDesRecords, type PastilleDeRecord } from "@domain/motivation";
import { chargerToutesLesLecons } from "../seance/bibliotheque.ts";
import { lireLesRecordsDuProfil } from "./lecture-des-records-supabase.ts";

/** Les pastilles de records du profil, dans l'ordre du parcours ; `undefined` pendant la lecture. */
export function usePastillesDesRecords(profil: string): readonly PastilleDeRecord[] | undefined {
  const [pastilles, setPastilles] = useState<readonly PastilleDeRecord[] | undefined>();
  useEffect(() => {
    let annule = false;
    void (async () => {
      const [records, lecons] = await Promise.all([lireLesRecordsDuProfil(profil), chargerLecons()]);
      if (!annule) setPastilles(pastillesDesRecords(records, lecons));
    })();
    return () => {
      annule = true;
    };
  }, [profil]);
  return pastilles;
}

async function chargerLecons(): Promise<readonly Lecon[]> {
  try {
    return await chargerToutesLesLecons();
  } catch {
    return [];
  }
}
