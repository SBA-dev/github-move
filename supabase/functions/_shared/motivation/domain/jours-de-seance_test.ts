import { assertEquals } from "@std/assert";
import { Jour } from "../../apprentissage/domain/jour.ts";
import { JoursDeSeance } from "./jours-de-seance.ts";

const lundi = Jour.de("2026-03-09");
const mardi = Jour.de("2026-03-10");
const mercredi = Jour.de("2026-03-11");

const enTexte = (jours: JoursDeSeance) => jours.jours.map((jour) => jour.toString()).sort();

Deno.test("aucun jour de séance : le profil n'a rien fait, aucun jour n'est un jour de séance", () => {
  const jours = JoursDeSeance.reunir();

  assertEquals(jours.contient(mardi), false);
});

Deno.test("un jour où une séance a été terminée est un jour de séance, pas les autres", () => {
  const jours = JoursDeSeance.reunir([mardi]);

  assertEquals([jours.contient(mardi), jours.contient(lundi)], [true, false]);
});

Deno.test("deux séances le même jour donnent un seul jour de séance", () => {
  const jours = JoursDeSeance.reunir([mardi, mardi]);

  assertEquals(enTexte(jours), ["2026-03-10"]);
});

Deno.test("un même jour présent dans deux sources compte une seule fois", () => {
  const seancesTerminees = [lundi, mardi];
  const seancesDeRevisionTerminees = [mardi, mercredi];

  const jours = JoursDeSeance.reunir(seancesTerminees, seancesDeRevisionTerminees);

  assertEquals(enTexte(jours), ["2026-03-09", "2026-03-10", "2026-03-11"]);
});
