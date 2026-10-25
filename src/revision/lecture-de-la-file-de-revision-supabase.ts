import {
  CleDeQuestion,
  FileDeRevision,
  IntervalleDeRevision,
  Jour,
  type QuestionRetenue,
  type TypeDeQuestion,
} from "@domain/apprentissage";
import { clientSupabase } from "../connexion/client-supabase.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";

type LigneDeQuestionRetenue = {
  readonly cle: string;
  readonly lecon_d_origine: string;
  readonly position: number;
  readonly type: string;
  readonly tirage: string | null;
  readonly intervalle: number;
  readonly date_de_revision: string;
  readonly derniere_erreur_le: string;
  readonly nombre_de_fois_ratee: number;
};

type LigneDeFile = { readonly erreurs_corrigees_pour_de_bon: number };

const COLONNES_DES_QUESTIONS =
  "cle, lecon_d_origine, position, type, tirage, intervalle, date_de_revision, derniere_erreur_le, nombre_de_fois_ratee";

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

/** Une question retenue illisible est ignorée : elle ne doit pas priver l'enfant des autres. */
function questionsLisibles(lignes: readonly LigneDeQuestionRetenue[]): QuestionRetenue[] {
  return lignes.flatMap((ligne) => {
    try {
      return [questionRetenueDepuisLaLigne(ligne)];
    } catch {
      return [];
    }
  });
}

/** Lecture sous RLS, avec le client du parent. `undefined` : sans réseau, profil non enregistré ou lecture impossible. */
export async function lireLaFileDeRevisionDuServeur(profil: string): Promise<FileDeRevision | undefined> {
  if (!estUnIdentifiantDeProfil(profil) || !reseauDisponible()) return undefined;
  try {
    const client = clientSupabase();
    const { data: file, error } = await client.from("files_de_revision")
      .select("erreurs_corrigees_pour_de_bon").eq("profil", profil).maybeSingle<LigneDeFile>();
    if (error) return undefined;
    if (file === null) return FileDeRevision.vide(profil);
    const { data: lignes, error: erreurDesQuestions } = await client.from("questions_retenues")
      .select(COLONNES_DES_QUESTIONS).eq("profil", profil);
    if (erreurDesQuestions) return undefined;
    return FileDeRevision.reconstituer({
      enfant: profil,
      erreursCorrigeesPourDeBon: file.erreurs_corrigees_pour_de_bon,
      questions: questionsLisibles(lignes as LigneDeQuestionRetenue[]),
    });
  } catch {
    return undefined;
  }
}
