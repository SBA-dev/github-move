import { assertEquals } from "@std/assert";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import { FileDeRevision } from "../domain/file-de-revision.ts";
import { IntervalleDeRevision } from "../domain/intervalle-de-revision.ts";
import { Jour } from "../domain/jour.ts";
import { clientSupabaseFactice } from "../test_utils/client-supabase-factice.ts";
import { FilesDeRevisionSupabase } from "./files-de-revision-supabase.ts";

const ENFANT = "9a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d";

const ligneDeFile = { profil: ENFANT, erreurs_corrigees_pour_de_bon: 2, version: 5 };

const ligneAvecTirage = {
  profil: ENFANT,
  cle: "b:combien font 3 + 4 ?",
  lecon_d_origine: "ma-cp-calcul",
  position: 0,
  type: "bulles",
  tirage: "6|7|8|9",
  intervalle: 3,
  date_de_revision: "2026-10-26",
  derniere_erreur_le: "2026-10-23T10:15:00+00:00",
  nombre_de_fois_ratee: 2,
};

const ligneSansTirage = {
  profil: ENFANT,
  cle: "e:cat",
  lecon_d_origine: "fr-cp-lecture",
  position: 1,
  type: "ecoute",
  tirage: null,
  intervalle: 1,
  date_de_revision: "2026-10-24",
  derniere_erreur_le: "2026-10-23T09:00:00+00:00",
  nombre_de_fois_ratee: 1,
};

Deno.test("la file de révision d'un profil est reconstituée avec sa version, ses questions retenues et son compteur", async () => {
  const faux = clientSupabaseFactice({
    tables: { files_de_revision: [ligneDeFile], questions_retenues: [ligneAvecTirage, ligneSansTirage] },
  });

  const lue = await new FilesDeRevisionSupabase(faux.client).de(ENFANT);

  assertEquals(lue, {
    version: 5,
    file: FileDeRevision.reconstituer({
      enfant: ENFANT,
      erreursCorrigeesPourDeBon: 2,
      questions: [
        {
          identite: CleDeQuestion.de("bulles", "Combien font 3 + 4 ?"),
          origine: { leconDOrigine: "ma-cp-calcul", position: 0, type: "bulles", tirage: "6|7|8|9" },
          intervalle: IntervalleDeRevision.de(3),
          dateDeRevision: Jour.de("2026-10-26"),
          derniereErreurLe: new Date("2026-10-23T10:15:00.000Z"),
          nombreDeFoisRatee: 2,
        },
        {
          identite: CleDeQuestion.de("ecoute", "cat"),
          origine: { leconDOrigine: "fr-cp-lecture", position: 1, type: "ecoute" },
          intervalle: IntervalleDeRevision.de(1),
          dateDeRevision: Jour.de("2026-10-24"),
          derniereErreurLe: new Date("2026-10-23T09:00:00.000Z"),
          nombreDeFoisRatee: 1,
        },
      ],
    }),
  });
});

Deno.test("un profil dont la file n'a jamais été écrite n'a pas de file", async () => {
  const faux = clientSupabaseFactice({ tables: { files_de_revision: [], questions_retenues: [] } });

  assertEquals(await new FilesDeRevisionSupabase(faux.client).de(ENFANT), null);
});

Deno.test("seules la file et les questions retenues du profil demandé sont lues", async () => {
  const autre = { ...ligneAvecTirage, profil: "autre-profil", cle: "b:autre" };
  const faux = clientSupabaseFactice({
    tables: { files_de_revision: [ligneDeFile], questions_retenues: [ligneAvecTirage, autre] },
  });

  const lue = await new FilesDeRevisionSupabase(faux.client).de(ENFANT);

  assertEquals(lue?.file.questions.length, 1);
});
