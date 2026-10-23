import type { SupabaseClient } from "@supabase/supabase-js";
import type { SeancesTerminees } from "../application/ports/seances-terminees.ts";
import type { SeanceTerminee } from "../domain/seance.ts";

export function ligneDeLaSeanceTerminee(fait: SeanceTerminee) {
  return {
    id: fait.seance,
    profil: fait.enfant,
    lecon: fait.lecon,
    choix: fait.choix,
    termine_le: fait.termineeLe.toISOString(),
    etoiles: fait.etoiles,
    erreurs: fait.erreurs,
    par_type: fait.parType,
  };
}

export function lignesDesQuestionsDeLaSeance(fait: SeanceTerminee) {
  return fait.questionsRatees.map((question) => ({
    seance: fait.seance,
    cle: question.cle.valeur,
    erreurs: question.erreurs,
    je_ne_sais_pas: question.jeNeSaisPas,
  }));
}

export class SeancesTermineesSupabase implements SeancesTerminees {
  constructor(private readonly client: SupabaseClient) {}

  // La séance et ses questions sont écrites par une fonction Postgres : une seule transaction, et un second
  // envoi de la même séance (même simultané) ne crée rien : la clé primaire fait attendre le second, puis l'écarte.
  async enregistrer(fait: SeanceTerminee): Promise<boolean> {
    const ligne = ligneDeLaSeanceTerminee(fait);
    const { data, error } = await this.client.rpc("enregistrer_la_seance_terminee", {
      p_id: ligne.id,
      p_profil: ligne.profil,
      p_lecon: ligne.lecon,
      p_choix: ligne.choix,
      p_termine_le: ligne.termine_le,
      p_etoiles: ligne.etoiles,
      p_erreurs: ligne.erreurs,
      p_par_type: ligne.par_type,
      p_questions: lignesDesQuestionsDeLaSeance(fait),
    });
    if (error) throw new Error(`Enregistrement de la séance terminée impossible : ${error.message}`);
    return data === true;
  }
}
