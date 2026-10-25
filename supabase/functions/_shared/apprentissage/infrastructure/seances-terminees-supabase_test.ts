import { assertEquals } from "@std/assert";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import { FileDeRevision } from "../domain/file-de-revision.ts";
import { IntervalleDeRevision } from "../domain/intervalle-de-revision.ts";
import { Jour } from "../domain/jour.ts";
import { ResultatDeLaLecon } from "../domain/resultat-de-la-lecon.ts";
import type { SeanceTerminee } from "../domain/seance.ts";
import { clientSupabaseFactice } from "../test_utils/client-supabase-factice.ts";
import {
  ligneDeLaSeanceTerminee,
  lignesDesQuestionsDeLaSeance,
  SeancesTermineesSupabase,
} from "./seances-terminees-supabase.ts";

const fait: SeanceTerminee = {
  type: "SeanceTerminee",
  seance: "seance-1",
  enfant: "profil-lea",
  lecon: "ma-cp-calcul",
  choix: ChoixDeSeance.unExercice(1),
  termineeLe: new Date("2026-10-23T10:15:00.000Z"),
  etoiles: 2,
  erreurs: 3,
  questionsRatees: [
    { cle: CleDeQuestion.de("bulles", "Combien font 3 + 4 ?"), erreurs: 2, jeNeSaisPas: false },
    { cle: CleDeQuestion.de("ecoute", "cat"), erreurs: 1, jeNeSaisPas: true },
  ],
  questionsRateesARetenir: [],
  parType: { bulles: { reussites: 4, erreurs: 2 }, ecoute: { reussites: 2, erreurs: 1 } },
};

Deno.test("la séance terminée devient une ligne de seances_terminees", () => {
  assertEquals(ligneDeLaSeanceTerminee(fait), {
    id: "seance-1",
    profil: "profil-lea",
    lecon: "ma-cp-calcul",
    choix: { genre: "unExercice", position: 1 },
    termine_le: "2026-10-23T10:15:00.000Z",
    etoiles: 2,
    erreurs: 3,
    par_type: { bulles: { reussites: 4, erreurs: 2 }, ecoute: { reussites: 2, erreurs: 1 } },
  });
});

Deno.test("la ligne d'une séance ne garde que son résumé : ni réponse, ni tirage", () => {
  assertEquals(Object.keys(ligneDeLaSeanceTerminee(fait)).sort(), [
    "choix",
    "erreurs",
    "etoiles",
    "id",
    "lecon",
    "par_type",
    "profil",
    "termine_le",
  ]);
});

Deno.test("chaque question ratée devient une ligne de questions_des_seances", () => {
  assertEquals(lignesDesQuestionsDeLaSeance(fait), [
    { seance: "seance-1", cle: "b:combien font 3 + 4 ?", erreurs: 2, je_ne_sais_pas: false },
    { seance: "seance-1", cle: "e:cat", erreurs: 1, je_ne_sais_pas: true },
  ]);
});

Deno.test("une séance sans erreur n'écrit aucune ligne de question", () => {
  assertEquals(lignesDesQuestionsDeLaSeance({ ...fait, erreurs: 0, questionsRatees: [] }), []);
});

Deno.test("la ligne d'une séance de fluence seule, sans étoiles, a etoiles à null", () => {
  const { etoiles: _etoiles, ...sansEtoiles } = fait;

  assertEquals(ligneDeLaSeanceTerminee(sansEtoiles).etoiles, null);
});

const resultat = ResultatDeLaLecon.reconstituer({
  enfant: "profil-lea",
  lecon: "ma-cp-calcul",
  meilleures: 2,
  dernieres: 2,
  nombreDeSeances: 4,
});

const file = FileDeRevision.reconstituer({
  enfant: "profil-lea",
  erreursCorrigeesPourDeBon: 1,
  questions: [{
    identite: CleDeQuestion.de("bulles", "Combien font 3 + 4 ?"),
    origine: { leconDOrigine: "ma-cp-calcul", position: 1, type: "bulles" },
    intervalle: IntervalleDeRevision.de(3),
    dateDeRevision: Jour.de("2026-10-26"),
    derniereErreurLe: new Date("2026-10-23T10:15:00.000Z"),
    nombreDeFoisRatee: 2,
  }],
});

const parametresSansFile = {
  p_id: "seance-1",
  p_profil: "profil-lea",
  p_lecon: "ma-cp-calcul",
  p_choix: { genre: "unExercice", position: 1 },
  p_termine_le: "2026-10-23T10:15:00.000Z",
  p_etoiles: 2,
  p_erreurs: 3,
  p_par_type: { bulles: { reussites: 4, erreurs: 2 }, ecoute: { reussites: 2, erreurs: 1 } },
  p_questions: [
    { seance: "seance-1", cle: "b:combien font 3 + 4 ?", erreurs: 2, je_ne_sais_pas: false },
    { seance: "seance-1", cle: "e:cat", erreurs: 1, je_ne_sais_pas: true },
  ],
  p_meilleures_etoiles: 2,
  p_dernieres_etoiles: 2,
  p_nombre_de_seances_lu: 3,
};

Deno.test("la séance terminée avec une file de révision est écrite par la fonction Postgres qui écrit aussi la file", async () => {
  const faux = clientSupabaseFactice({ reponseDeFonction: { data: "enregistree" } });

  const issue = await new SeancesTermineesSupabase(faux.client)
    .enregistrerAvecLeResultat(fait, resultat, 3, { file, versionLue: 6 });

  assertEquals(faux.appels, [{
    fonction: "enregistrer_la_seance_terminee_et_la_file_de_revision",
    parametres: {
      ...parametresSansFile,
      p_version_de_la_file_lue: 6,
      p_erreurs_corrigees_pour_de_bon: 1,
      p_questions_retenues: [{
        cle: "b:combien font 3 + 4 ?",
        lecon_d_origine: "ma-cp-calcul",
        position: 1,
        type: "bulles",
        intervalle: 3,
        date_de_revision: "2026-10-26",
        derniere_erreur_le: "2026-10-23T10:15:00.000Z",
        nombre_de_fois_ratee: 2,
      }],
    },
  }]);
  assertEquals(issue, "enregistree");
});

Deno.test("l'issue de la fonction qui écrit la file est rendue telle quelle : déjà enregistrée ou conflit", async () => {
  for (const issue of ["dejaEnregistree", "conflit"]) {
    const faux = clientSupabaseFactice({ reponseDeFonction: { data: issue } });

    assertEquals(
      await new SeancesTermineesSupabase(faux.client).enregistrerAvecLeResultat(fait, resultat, 3, {
        file,
        versionLue: 0,
      }),
      issue,
    );
  }
});

Deno.test("sans file de révision, l'enregistrement de la séance appelle toujours la fonction existante", async () => {
  const faux = clientSupabaseFactice({ reponseDeFonction: { data: true } });

  const issue = await new SeancesTermineesSupabase(faux.client).enregistrerAvecLeResultat(fait, resultat, 3);

  assertEquals(faux.appels, [{ fonction: "enregistrer_la_seance_terminee", parametres: parametresSansFile }]);
  assertEquals(issue, "enregistree");
});
