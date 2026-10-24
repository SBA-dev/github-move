import { assertEquals, assertThrows } from "@std/assert";
import { TestDeDepartDUnAutreEnfant } from "./erreurs.ts";
import { ResultatDuTestDeDepart } from "./resultat-du-test-de-depart.ts";
import type { TestDeDepartTermine } from "./test-de-depart.ts";

const profilDeLea = "profil-lea";
const profilDeTom = "profil-tom";
const premierJour = new Date("2026-09-01T10:00:00Z");
const secondJour = new Date("2026-10-01T10:00:00Z");

function testTermine(enfant: string, termineeLe: Date): TestDeDepartTermine {
  return { type: "TestDeDepartTermine", test: "test-1", enfant, termineeLe, questions: [], arrete: false };
}

function triees(lecons: ReadonlySet<string>): string[] {
  return [...lecons].sort();
}

Deno.test("le premier test de départ fini crée le résultat de l'enfant avec ses leçons réussies", () => {
  const resultat = ResultatDuTestDeDepart.premier(
    testTermine(profilDeLea, premierJour),
    new Set(["lecon-a", "lecon-b"]),
  );

  assertEquals(
    [resultat.enfant, resultat.faitLe, triees(resultat.leconsReussies)],
    [profilDeLea, premierJour, ["lecon-a", "lecon-b"]],
  );
});

Deno.test("un test de départ suivant réunit les leçons réussies et met à jour la date", () => {
  const resultat = ResultatDuTestDeDepart.reconstituer({
    enfant: profilDeLea,
    faitLe: premierJour,
    leconsReussies: new Set(["lecon-a", "lecon-b"]),
  });

  resultat.enregistrer(testTermine(profilDeLea, secondJour), new Set(["lecon-b", "lecon-c"]));

  assertEquals(
    [resultat.faitLe, triees(resultat.leconsReussies)],
    [secondJour, ["lecon-a", "lecon-b", "lecon-c"]],
  );
});

Deno.test("une leçon réussie au test de départ le reste même si elle n'est pas réussie au suivant", () => {
  const resultat = ResultatDuTestDeDepart.reconstituer({
    enfant: profilDeLea,
    faitLe: premierJour,
    leconsReussies: new Set(["lecon-a"]),
  });

  resultat.enregistrer(testTermine(profilDeLea, secondJour), new Set(["lecon-b"]));

  assertEquals(resultat.leconsReussies.has("lecon-a"), true);
});

Deno.test("un test de départ arrêté sans leçon réussie met quand même la date à jour", () => {
  const resultat = ResultatDuTestDeDepart.reconstituer({
    enfant: profilDeLea,
    faitLe: premierJour,
    leconsReussies: new Set(["lecon-a"]),
  });

  resultat.enregistrer(testTermine(profilDeLea, secondJour), new Set());

  assertEquals([resultat.faitLe, triees(resultat.leconsReussies)], [secondJour, ["lecon-a"]]);
});

Deno.test("un premier test de départ arrêté sans leçon réussie crée un résultat vide", () => {
  const resultat = ResultatDuTestDeDepart.premier(testTermine(profilDeLea, premierJour), new Set());

  assertEquals([resultat.faitLe, resultat.leconsReussies.size], [premierJour, 0]);
});

Deno.test("le test de départ d'un autre enfant est refusé", () => {
  const resultat = ResultatDuTestDeDepart.reconstituer({
    enfant: profilDeLea,
    faitLe: premierJour,
    leconsReussies: new Set(["lecon-a"]),
  });

  assertThrows(
    () => resultat.enregistrer(testTermine(profilDeTom, secondJour), new Set(["lecon-b"])),
    TestDeDepartDUnAutreEnfant,
  );
});
