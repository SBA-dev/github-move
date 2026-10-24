import { assertEquals } from "@std/assert";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import type { SeanceTerminee } from "../domain/seance.ts";
import { ligneDeLaSeanceTerminee, lignesDesQuestionsDeLaSeance } from "./seances-terminees-supabase.ts";

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
