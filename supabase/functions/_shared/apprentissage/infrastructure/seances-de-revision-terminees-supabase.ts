import type { SupabaseClient } from "@supabase/supabase-js";
import type { SeancesDeRevisionTerminees } from "../application/ports/seances-de-revision-terminees.ts";
import type { FileDeRevisionALEcrire, IssueDeLEnregistrement } from "../application/ports/seances-terminees.ts";
import type { SeanceDeRevisionTerminee } from "../domain/seance-de-revision.ts";
import { lignesDesQuestionsRetenues } from "./files-de-revision-supabase.ts";

export class SeancesDeRevisionTermineesSupabase implements SeancesDeRevisionTerminees {
  constructor(private readonly client: () => SupabaseClient) {}

  async enregistrer(fait: SeanceDeRevisionTerminee, { file, versionLue }: FileDeRevisionALEcrire) {
    const { data, error } = await this.client().rpc("enregistrer_la_seance_de_revision_terminee", {
      p_id: fait.id,
      p_profil: fait.enfant,
      p_termine_le: fait.termineeLe.toISOString(),
      p_jour: fait.jour.toString(),
      p_nombre_de_questions: fait.nombreDeQuestions,
      p_nombre_de_questions_justes: fait.nombreDeQuestionsJustes,
      p_version_de_la_file_lue: versionLue,
      p_erreurs_corrigees_pour_de_bon: file.erreursCorrigeesPourDeBon,
      p_questions_retenues: lignesDesQuestionsRetenues(file),
    });
    if (error) throw new Error(`Enregistrement de la séance de révision terminée impossible : ${error.message}`);
    return data as IssueDeLEnregistrement;
  }
}
