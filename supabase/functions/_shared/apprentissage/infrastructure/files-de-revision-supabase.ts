import type { SupabaseClient } from "@supabase/supabase-js";
import type { FilesDeRevision } from "../application/ports/files-de-revision.ts";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import { FileDeRevision, type QuestionRetenue } from "../domain/file-de-revision.ts";
import { IntervalleDeRevision } from "../domain/intervalle-de-revision.ts";
import { Jour } from "../domain/jour.ts";
import type { TypeDeQuestion } from "../domain/question-suivie.ts";

type LigneDeQuestionRetenue = {
  cle: string;
  lecon_d_origine: string;
  position: number;
  type: string;
  tirage: string | null;
  intervalle: number;
  date_de_revision: string;
  derniere_erreur_le: string;
  nombre_de_fois_ratee: number;
};

type LigneDeFile = { erreurs_corrigees_pour_de_bon: number; version: number };

const COLONNES_DES_QUESTIONS =
  "cle, lecon_d_origine, position, type, tirage, intervalle, date_de_revision, derniere_erreur_le, nombre_de_fois_ratee";

export function lignesDesQuestionsRetenues(file: FileDeRevision) {
  return file.questions.map((
    { identite, origine, intervalle, dateDeRevision, derniereErreurLe, nombreDeFoisRatee },
  ) => ({
    cle: identite.valeur,
    lecon_d_origine: origine.leconDOrigine,
    position: origine.position,
    type: origine.type,
    ...(origine.tirage === undefined ? {} : { tirage: origine.tirage }),
    intervalle: intervalle.jours,
    date_de_revision: dateDeRevision.toString(),
    derniere_erreur_le: derniereErreurLe.toISOString(),
    nombre_de_fois_ratee: nombreDeFoisRatee,
  }));
}

function questionRetenueDepuisLaLigne(ligne: LigneDeQuestionRetenue): QuestionRetenue {
  return {
    identite: CleDeQuestion.depuisLaValeur(ligne.cle),
    origine: {
      leconDOrigine: ligne.lecon_d_origine,
      position: ligne.position,
      type: ligne.type as TypeDeQuestion,
      ...(ligne.tirage === null ? {} : { tirage: ligne.tirage }),
    },
    intervalle: IntervalleDeRevision.de(ligne.intervalle),
    dateDeRevision: Jour.de(ligne.date_de_revision),
    derniereErreurLe: new Date(ligne.derniere_erreur_le),
    nombreDeFoisRatee: ligne.nombre_de_fois_ratee,
  };
}

export class FilesDeRevisionSupabase implements FilesDeRevision {
  constructor(private readonly client: () => SupabaseClient) {}

  async de(enfant: string): Promise<{ file: FileDeRevision; version: number } | null> {
    const { data: ligne, error } = await this.client().from("files_de_revision")
      .select("erreurs_corrigees_pour_de_bon, version").eq("profil", enfant).maybeSingle<LigneDeFile>();
    if (error) throw new Error(`Lecture de la file de révision impossible : ${error.message}`);
    if (ligne === null) return null;
    const { data: lignes, error: erreurDesQuestions } = await this.client().from("questions_retenues")
      .select(COLONNES_DES_QUESTIONS).eq("profil", enfant);
    if (erreurDesQuestions) {
      throw new Error(`Lecture des questions retenues impossible : ${erreurDesQuestions.message}`);
    }
    const file = FileDeRevision.reconstituer({
      enfant,
      erreursCorrigeesPourDeBon: ligne.erreurs_corrigees_pour_de_bon,
      questions: (lignes as LigneDeQuestionRetenue[]).map(questionRetenueDepuisLaLigne),
    });
    return { file, version: ligne.version };
  }
}
