import { assertEquals, assertThrows } from "@std/assert";
import { IntervalleDeRevisionInvalide } from "./erreurs.ts";
import { IntervalleDeRevision } from "./intervalle-de-revision.ts";

Deno.test("le premier intervalle de révision, après une erreur, est de 1 jour", () => {
  assertEquals(IntervalleDeRevision.premier().jours, 1);
});

Deno.test("un intervalle de révision se construit depuis 1, 3 ou 7 jours stockés", () => {
  for (const jours of [1, 3, 7]) {
    assertEquals(IntervalleDeRevision.de(jours).jours, jours);
  }
});

Deno.test("un intervalle de révision refuse toute autre valeur que 1, 3 ou 7", () => {
  for (const jours of [0, 2, 4, 5, 6, 8, 14, -1, 1.5, Number.NaN]) {
    assertThrows(() => IntervalleDeRevision.de(jours), IntervalleDeRevisionInvalide);
  }
});

Deno.test("après une révision juste, l'intervalle de 1 jour passe à 3 jours", () => {
  assertEquals(
    IntervalleDeRevision.de(1).suivant(),
    { corrigeePourDeBon: false, intervalle: IntervalleDeRevision.de(3) },
  );
});

Deno.test("après une révision juste, l'intervalle de 3 jours passe à 7 jours", () => {
  assertEquals(
    IntervalleDeRevision.de(3).suivant(),
    { corrigeePourDeBon: false, intervalle: IntervalleDeRevision.de(7) },
  );
});

Deno.test("après une révision juste à 7 jours, l'erreur est corrigée pour de bon", () => {
  assertEquals(IntervalleDeRevision.de(7).suivant(), { corrigeePourDeBon: true });
});
