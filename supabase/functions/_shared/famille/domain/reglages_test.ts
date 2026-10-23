import { assertEquals, assertThrows } from "@std/assert";
import { ClavierDesDicteesInconnu, LangueDuParentInconnue } from "./erreurs.ts";
import { Reglages } from "./reglages.ts";

Deno.test("les réglages par défaut : ni mode dys, ni tout lire à voix haute, ni parcours libre, clavier automatique, aucune langue du parent", () => {
  const reglages = Reglages.parDefaut();

  assertEquals(reglages.modeDys, false);
  assertEquals(reglages.toutLireAVoixHaute, false);
  assertEquals(reglages.parcoursLibre, false);
  assertEquals(reglages.clavierDesDictees.valeur, "automatique");
  assertEquals(reglages.langueDuParent.valeur, "aucune");
});

Deno.test("des réglages bruts complets donnent les cinq réglages choisis", () => {
  const reglages = Reglages.depuis({
    modeDys: true,
    toutLireAVoixHaute: true,
    parcoursLibre: true,
    clavierDesDictees: "clavierComplet",
    langueDuParent: "arabe",
  });

  assertEquals(reglages.modeDys, true);
  assertEquals(reglages.toutLireAVoixHaute, true);
  assertEquals(reglages.parcoursLibre, true);
  assertEquals(reglages.clavierDesDictees.valeur, "clavierComplet");
  assertEquals(reglages.langueDuParent.valeur, "arabe");
});

Deno.test("des réglages bruts partiels gardent les valeurs par défaut pour les réglages non choisis", () => {
  const reglages = Reglages.depuis({ modeDys: true });

  assertEquals(reglages.clavierDesDictees.valeur, "automatique");
  assertEquals(reglages.parcoursLibre, false);
  assertEquals(reglages.langueDuParent.valeur, "aucune");
});

Deno.test("des réglages bruts partiels complètent les réglages de départ donnés", () => {
  const depart = Reglages.depuis({ modeDys: true, langueDuParent: "wolof" });

  const reglages = Reglages.depuis({ parcoursLibre: true }, depart);

  assertEquals(reglages.modeDys, true);
  assertEquals(reglages.langueDuParent.valeur, "wolof");
  assertEquals(reglages.parcoursLibre, true);
});

Deno.test("des réglages bruts avec un clavier des dictées inconnu sont refusés", () => {
  assertThrows(() => Reglages.depuis({ clavierDesDictees: "azerty" }), ClavierDesDicteesInconnu);
});

Deno.test("des réglages bruts avec une langue du parent inconnue sont refusés", () => {
  assertThrows(() => Reglages.depuis({ langueDuParent: "klingon" }), LangueDuParentInconnue);
});
