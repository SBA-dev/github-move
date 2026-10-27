import { assertEquals } from "@std/assert";
import { type FaitsDuJour, objectifDuJour } from "./objectif-du-jour.ts";

function faits(partiels: Partial<FaitsDuJour> = {}): FaitsDuJour {
  return {
    leconsDesSeancesTermineesDuJour: [],
    nombreDeSeancesDeRevisionTermineesDuJour: 0,
    ...partiels,
  };
}

Deno.test("sans aucun fait, l'objectif du jour est 0 sur 2 et n'est pas atteint", () => {
  assertEquals(objectifDuJour(faits()), {
    nombreVise: 2,
    nombreJoue: 0,
    estAtteint: false,
  });
});

Deno.test("une leçon terminée dans la journée compte pour 1", () => {
  const objectif = objectifDuJour(
    faits({ leconsDesSeancesTermineesDuJour: ["lecon-a"] }),
  );

  assertEquals(objectif.nombreJoue, 1);
  assertEquals(objectif.estAtteint, false);
});

Deno.test("deux leçons distinctes terminées atteignent l'objectif du jour", () => {
  const objectif = objectifDuJour(
    faits({ leconsDesSeancesTermineesDuJour: ["lecon-a", "lecon-b"] }),
  );

  assertEquals(objectif.nombreJoue, 2);
  assertEquals(objectif.estAtteint, true);
});

Deno.test("une leçon jouée deux fois dans la journée ne compte qu'une fois", () => {
  const objectif = objectifDuJour(
    faits({ leconsDesSeancesTermineesDuJour: ["lecon-a", "lecon-a"] }),
  );

  assertEquals(objectif.nombreJoue, 1);
  assertEquals(objectif.estAtteint, false);
});

Deno.test("plusieurs séances de révision terminées dans la journée comptent pour 1", () => {
  const objectif = objectifDuJour(
    faits({ nombreDeSeancesDeRevisionTermineesDuJour: 3 }),
  );

  assertEquals(objectif.nombreJoue, 1);
  assertEquals(objectif.estAtteint, false);
});

Deno.test("une leçon et une séance de révision terminées atteignent l'objectif du jour", () => {
  const objectif = objectifDuJour(
    faits({
      leconsDesSeancesTermineesDuJour: ["lecon-a"],
      nombreDeSeancesDeRevisionTermineesDuJour: 1,
    }),
  );

  assertEquals(objectif.nombreJoue, 2);
  assertEquals(objectif.estAtteint, true);
});

Deno.test("le compte de l'objectif du jour s'arrête à 2 même si l'enfant joue trois leçons", () => {
  const objectif = objectifDuJour(
    faits({
      leconsDesSeancesTermineesDuJour: ["lecon-a", "lecon-b", "lecon-c"],
    }),
  );

  assertEquals(objectif, { nombreVise: 2, nombreJoue: 2, estAtteint: true });
});
