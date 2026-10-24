import type { SupabaseClient } from "@supabase/supabase-js";
import type { IssueDeLEnregistrement, SeancesTerminees } from "../application/ports/seances-terminees.ts";
import type { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";
import type { SeanceTerminee } from "../domain/seance.ts";
import { ligneDuResultat } from "./resultats-des-lecons-supabase.ts";

const CODE_POSTGRES_CONFLIT_DE_RESULTAT = "40001";

export function ligneDeLaSeanceTerminee(fait: SeanceTerminee) {
  return {
    id: fait.seance,
    profil: fait.enfant,
    lecon: fait.lecon,
    choix: fait.choix,
    termine_le: fait.termineeLe.toISOString(),
    etoiles: fait.etoiles ?? null,
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
  constructor(private readonly client: () => SupabaseClient) {}

  // La séance, ses questions et le résultat de la leçon sont écrits par une seule fonction Postgres, donc dans une
  // seule transaction. Elle rend « dejaEnregistree » (rien d'écrit) si la séance existe, et échoue avec le code
  // 40001 (rien d'écrit) si le nombre de séances stocké n'est plus celui que l'on avait lu.
  async enregistrerAvecLeResultat(
    fait: SeanceTerminee,
    resultat: ResultatDeLaLecon,
    nombreDeSeancesLu: number,
  ): Promise<IssueDeLEnregistrement> {
    const ligne = ligneDeLaSeanceTerminee(fait);
    const ligneDuResultatAEcrire = ligneDuResultat(resultat);
    const { data, error } = await this.client().rpc("enregistrer_la_seance_terminee", {
      p_id: ligne.id,
      p_profil: ligne.profil,
      p_lecon: ligne.lecon,
      p_choix: ligne.choix,
      p_termine_le: ligne.termine_le,
      p_etoiles: ligne.etoiles,
      p_erreurs: ligne.erreurs,
      p_par_type: ligne.par_type,
      p_questions: lignesDesQuestionsDeLaSeance(fait),
      p_meilleures_etoiles: ligneDuResultatAEcrire.meilleures_etoiles,
      p_dernieres_etoiles: ligneDuResultatAEcrire.dernieres_etoiles,
      p_nombre_de_seances_lu: nombreDeSeancesLu,
    });
    if (error?.code === CODE_POSTGRES_CONFLIT_DE_RESULTAT) return "conflit";
    if (error) throw new Error(`Enregistrement de la séance terminée impossible : ${error.message}`);
    return data === true ? "enregistree" : "dejaEnregistree";
  }

  async enregistrerSansResultat(fait: SeanceTerminee): Promise<"enregistree" | "dejaEnregistree"> {
    const ligne = ligneDeLaSeanceTerminee(fait);
    const { data, error } = await this.client().rpc("enregistrer_la_seance_terminee_sans_resultat", {
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
    return data === true ? "enregistree" : "dejaEnregistree";
  }
}
