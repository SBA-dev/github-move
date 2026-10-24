import { assertEquals } from "@std/assert";
import { RecordDeFluence } from "../domain/record-de-fluence.ts";
import { ligneDuRecordDeFluence, recordDeFluenceDeLaLigne } from "./records-de-fluence-supabase.ts";

const record = RecordDeFluence.reconstituer({
  enfant: "profil-lea",
  lecon: "ma-cp-calcul",
  exercice: "fluence-addition",
  meilleurScore: 12,
});

Deno.test("le record de fluence devient une ligne de records_de_fluence", () => {
  assertEquals(ligneDuRecordDeFluence(record), {
    profil: "profil-lea",
    lecon: "ma-cp-calcul",
    exercice: "fluence-addition",
    meilleur_score: 12,
  });
});

Deno.test("la ligne lue redevient le même record de fluence", () => {
  const relu = recordDeFluenceDeLaLigne(ligneDuRecordDeFluence(record));

  assertEquals(
    [relu.enfant, relu.lecon, relu.exercice, relu.meilleurScore],
    ["profil-lea", "ma-cp-calcul", "fluence-addition", 12],
  );
});
