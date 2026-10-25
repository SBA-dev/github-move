import { assertEquals } from "@std/assert";
import { ResultatDuTestDeDepart } from "../domain/resultat-du-test-de-depart.ts";
import {
  ligneDuResultatDeTestDeDepart,
  resultatDeTestDeDepartDeLaLigne,
} from "./resultats-des-tests-de-depart-supabase.ts";

const resultat = ResultatDuTestDeDepart.reconstituer({
  enfant: "profil-lea",
  faitLe: new Date("2026-10-23T10:15:00.000Z"),
  leconsReussies: new Set(["ma-cp-calcul", "fr-cp-lecture"]),
});

Deno.test("le résultat du test de départ devient une ligne de resultats_des_tests_de_depart", () => {
  assertEquals(ligneDuResultatDeTestDeDepart(resultat), {
    profil: "profil-lea",
    fait_le: "2026-10-23T10:15:00.000Z",
    lecons_reussies: ["ma-cp-calcul", "fr-cp-lecture"],
  });
});

Deno.test("la ligne lue redevient le même résultat du test de départ", () => {
  const relu = resultatDeTestDeDepartDeLaLigne(ligneDuResultatDeTestDeDepart(resultat));

  assertEquals(
    [relu.enfant, relu.faitLe, [...relu.leconsReussies]],
    ["profil-lea", new Date("2026-10-23T10:15:00.000Z"), ["ma-cp-calcul", "fr-cp-lecture"]],
  );
});
