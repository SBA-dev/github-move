import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  IssueDeLEnregistrementDuTestDeDepart,
  ResultatsDesTestsDeDepart,
} from "../application/ports/resultats-des-tests-de-depart.ts";
import { ResultatDuTestDeDepart } from "../domain/resultat-du-test-de-depart.ts";

export type LigneDeResultatDeTestDeDepart = {
  profil: string;
  fait_le: string;
  lecons_reussies: string[];
};

export function ligneDuResultatDeTestDeDepart(resultat: ResultatDuTestDeDepart): LigneDeResultatDeTestDeDepart {
  return {
    profil: resultat.enfant,
    fait_le: resultat.faitLe.toISOString(),
    lecons_reussies: [...resultat.leconsReussies],
  };
}

export function resultatDeTestDeDepartDeLaLigne(ligne: LigneDeResultatDeTestDeDepart): ResultatDuTestDeDepart {
  return ResultatDuTestDeDepart.reconstituer({
    enfant: ligne.profil,
    faitLe: new Date(ligne.fait_le),
    leconsReussies: new Set(ligne.lecons_reussies),
  });
}

export class ResultatsDesTestsDeDepartSupabase implements ResultatsDesTestsDeDepart {
  constructor(private readonly client: () => SupabaseClient) {}

  async de(enfant: string): Promise<ResultatDuTestDeDepart | null> {
    const { data, error } = await this.client().from("resultats_des_tests_de_depart")
      .select("profil, fait_le, lecons_reussies").eq("profil", enfant).maybeSingle<LigneDeResultatDeTestDeDepart>();
    if (error) throw new Error(`Lecture du résultat du test de départ impossible : ${error.message}`);
    return data === null ? null : resultatDeTestDeDepartDeLaLigne(data);
  }

  // La fonction Postgres compte le test, réunit les leçons et garde la date la plus récente dans une transaction.
  async enregistrer(resultat: ResultatDuTestDeDepart, test: string): Promise<IssueDeLEnregistrementDuTestDeDepart> {
    const ligne = ligneDuResultatDeTestDeDepart(resultat);
    const { data, error } = await this.client().rpc("enregistrer_un_resultat_de_test_de_depart", {
      p_profil: ligne.profil,
      p_test: test,
      p_fait_le: ligne.fait_le,
      p_lecons_reussies: ligne.lecons_reussies,
    });
    if (error) throw new Error(`Enregistrement du résultat du test de départ impossible : ${error.message}`);
    return data === true ? "enregistre" : "dejaEnregistre";
  }
}
