import type { SupabaseClient } from "@supabase/supabase-js";
import type { RecordsDeFluence } from "../application/ports/records-de-fluence.ts";
import { RecordDeFluence } from "../domain/record-de-fluence.ts";

const COLONNES = "profil, lecon, exercice, meilleur_score";

export type LigneDeRecordDeFluence = {
  profil: string;
  lecon: string;
  exercice: string;
  meilleur_score: number;
};

export function ligneDuRecordDeFluence(record: RecordDeFluence): LigneDeRecordDeFluence {
  if (record.meilleurScore === undefined) throw new Error("Un record sans score n'a pas de ligne.");
  return {
    profil: record.enfant,
    lecon: record.lecon,
    exercice: record.exercice,
    meilleur_score: record.meilleurScore,
  };
}

export function recordDeFluenceDeLaLigne(ligne: LigneDeRecordDeFluence): RecordDeFluence {
  return RecordDeFluence.reconstituer({
    enfant: ligne.profil,
    lecon: ligne.lecon,
    exercice: ligne.exercice,
    meilleurScore: ligne.meilleur_score,
  });
}

export class RecordsDeFluenceSupabase implements RecordsDeFluence {
  constructor(private readonly client: () => SupabaseClient) {}

  async lire(enfant: string, lecon: string, exercice: string): Promise<RecordDeFluence | null> {
    const { data, error } = await this.client().from("records_de_fluence").select(COLONNES)
      .eq("profil", enfant).eq("lecon", lecon).eq("exercice", exercice).maybeSingle<LigneDeRecordDeFluence>();
    if (error) throw new Error(`Lecture du record de fluence impossible : ${error.message}`);
    return data === null ? null : recordDeFluenceDeLaLigne(data);
  }

  // La fonction Postgres garde le plus grand score : un record ne baisse jamais, même avec deux séances simultanées.
  async enregistrer(record: RecordDeFluence): Promise<void> {
    if (record.meilleurScore === undefined) return;
    const ligne = ligneDuRecordDeFluence(record);
    const { error } = await this.client().rpc("enregistrer_un_record_de_fluence", {
      p_profil: ligne.profil,
      p_lecon: ligne.lecon,
      p_exercice: ligne.exercice,
      p_meilleur_score: ligne.meilleur_score,
    });
    if (error) throw new Error(`Enregistrement du record de fluence impossible : ${error.message}`);
  }
}
