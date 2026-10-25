import { assertEquals } from "@std/assert";
import { Jour } from "../../apprentissage/domain/jour.ts";
import { faitsDuJour } from "./faits-du-jour.ts";

const aujourdhui = Jour.de("2026-03-10");
const hier = Jour.de("2026-03-09");
const demain = Jour.de("2026-03-11");

Deno.test("seules les séances terminées aujourd'hui comptent, pas celles d'hier ni de demain", () => {
  const faits = faitsDuJour({
    aujourdhui,
    seancesTerminees: [
      { lecon: "lecon-hier", jour: hier },
      { lecon: "lecon-aujourdhui", jour: aujourdhui },
      { lecon: "lecon-demain", jour: demain },
    ],
    seancesDeRevisionTerminees: [],
  });

  assertEquals(faits.leconsDesSeancesTermineesDuJour, ["lecon-aujourdhui"]);
});

Deno.test("les leçons des séances du jour sont gardées dans l'ordre, doublons compris", () => {
  const faits = faitsDuJour({
    aujourdhui,
    seancesTerminees: [
      { lecon: "b", jour: aujourdhui },
      { lecon: "a", jour: aujourdhui },
      { lecon: "b", jour: aujourdhui },
    ],
    seancesDeRevisionTerminees: [],
  });

  assertEquals(faits.leconsDesSeancesTermineesDuJour, ["b", "a", "b"]);
});

Deno.test("seules les séances de révision terminées aujourd'hui sont comptées", () => {
  const faits = faitsDuJour({
    aujourdhui,
    seancesTerminees: [],
    seancesDeRevisionTerminees: [{ jour: hier }, { jour: aujourdhui }, { jour: aujourdhui }, { jour: demain }],
  });

  assertEquals(faits.nombreDeSeancesDeRevisionTermineesDuJour, 2);
});

Deno.test("le lendemain, les séances de la veille ne comptent plus", () => {
  const faits = faitsDuJour({
    aujourdhui: aujourdhui.plus(1),
    seancesTerminees: [{ lecon: "a", jour: aujourdhui }],
    seancesDeRevisionTerminees: [{ jour: aujourdhui }],
  });

  assertEquals(faits, {
    leconsDesSeancesTermineesDuJour: [],
    nombreDeSeancesDeRevisionTermineesDuJour: 0,
  });
});

Deno.test("sans aucune séance terminée, les faits du jour sont vides", () => {
  const faits = faitsDuJour({ aujourdhui, seancesTerminees: [], seancesDeRevisionTerminees: [] });

  assertEquals(faits, {
    leconsDesSeancesTermineesDuJour: [],
    nombreDeSeancesDeRevisionTermineesDuJour: 0,
  });
});
