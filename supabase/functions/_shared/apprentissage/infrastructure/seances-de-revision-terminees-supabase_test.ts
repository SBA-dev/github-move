import { assertEquals, assertRejects } from "@std/assert";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import { FileDeRevision } from "../domain/file-de-revision.ts";
import { IntervalleDeRevision } from "../domain/intervalle-de-revision.ts";
import { Jour } from "../domain/jour.ts";
import { seanceDeRevisionTerminee } from "../domain/seance-de-revision.ts";
import { clientSupabaseFactice } from "../test_utils/client-supabase-factice.ts";
import { SeancesDeRevisionTermineesSupabase } from "./seances-de-revision-terminees-supabase.ts";

const ENFANT = "9a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d";
const SEANCE = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";

const fait = seanceDeRevisionTerminee({
  id: SEANCE,
  enfant: ENFANT,
  termineeLe: new Date("2026-10-26T08:30:00.000Z"),
  jour: Jour.de("2026-10-26"),
  resultats: [
    { identite: CleDeQuestion.de("bulles", "Combien font 3 + 4 ?"), juste: true },
    { identite: CleDeQuestion.de("ecoute", "cat"), juste: false },
    { identite: CleDeQuestion.de("ecoute", "dog"), juste: true },
  ],
});

const file = FileDeRevision.reconstituer({
  enfant: ENFANT,
  erreursCorrigeesPourDeBon: 4,
  questions: [{
    identite: CleDeQuestion.de("ecoute", "cat"),
    origine: { leconDOrigine: "fr-cp-lecture", position: 1, type: "ecoute", tirage: "a|b" },
    intervalle: IntervalleDeRevision.de(1),
    dateDeRevision: Jour.de("2026-10-27"),
    derniereErreurLe: new Date("2026-10-26T08:30:00.000Z"),
    nombreDeFoisRatee: 3,
  }],
});

Deno.test("la séance de révision terminée et la file sont écrites par la fonction Postgres dédiée", async () => {
  const faux = clientSupabaseFactice({ reponseDeFonction: { data: "enregistree" } });

  const issue = await new SeancesDeRevisionTermineesSupabase(faux.client).enregistrer(fait, { file, versionLue: 7 });

  assertEquals(faux.appels, [{
    fonction: "enregistrer_la_seance_de_revision_terminee",
    parametres: {
      p_id: SEANCE,
      p_profil: ENFANT,
      p_termine_le: "2026-10-26T08:30:00.000Z",
      p_jour: "2026-10-26",
      p_nombre_de_questions: 3,
      p_nombre_de_questions_justes: 2,
      p_version_de_la_file_lue: 7,
      p_erreurs_corrigees_pour_de_bon: 4,
      p_questions_retenues: [{
        cle: "e:cat",
        lecon_d_origine: "fr-cp-lecture",
        position: 1,
        type: "ecoute",
        tirage: "a|b",
        intervalle: 1,
        date_de_revision: "2026-10-27",
        derniere_erreur_le: "2026-10-26T08:30:00.000Z",
        nombre_de_fois_ratee: 3,
      }],
    },
  }]);
  assertEquals(issue, "enregistree");
});

Deno.test("l'issue de la fonction Postgres est rendue telle quelle : déjà enregistrée ou conflit", async () => {
  for (const issue of ["dejaEnregistree", "conflit"]) {
    const faux = clientSupabaseFactice({ reponseDeFonction: { data: issue } });

    assertEquals(
      await new SeancesDeRevisionTermineesSupabase(faux.client).enregistrer(fait, { file, versionLue: 0 }),
      issue,
    );
  }
});

Deno.test("une erreur de la base lors de l'enregistrement d'une séance de révision est remontée", async () => {
  const faux = clientSupabaseFactice({ reponseDeFonction: { data: null, error: { message: "panne" } } });

  await assertRejects(
    () => new SeancesDeRevisionTermineesSupabase(faux.client).enregistrer(fait, { file, versionLue: 1 }),
    Error,
    "panne",
  );
});
