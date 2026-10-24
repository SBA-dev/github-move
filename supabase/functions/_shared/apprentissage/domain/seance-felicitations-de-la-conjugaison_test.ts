import { assertEquals } from "@std/assert";
import { seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { leconDeConjugaisonDuVerbeEtre } from "../test_utils/lecons-de-conjugaison.ts";
import { Reponse } from "./reponse.ts";

const FORMES = ["suis", "es", "est", "sommes", "êtes", "sont"];

function repondreJusqua(rang: number) {
  const seance = seanceCommencee(leconDeConjugaisonDuVerbeEtre());
  for (const forme of FORMES.slice(0, rang)) seance.repondre(Reponse.choix(forme));
  return seance;
}

Deno.test("après une bonne forme qui n'est pas la dernière, le personnage guide ne dit rien", () => {
  const seance = repondreJusqua(3);

  assertEquals(seance.paroleDueApresLaDerniereReponse(), undefined);
});

Deno.test("après la bonne forme de la dernière personne, le personnage guide félicite l'enfant", () => {
  const seance = repondreJusqua(6);

  assertEquals(seance.paroleDueApresLaDerniereReponse(), "felicitation");
});

Deno.test("la bonne forme de la dernière personne complète la conjugaison", () => {
  const seance = repondreJusqua(6);

  assertEquals(seance.conjugaisonCompleteParLaDerniereReponse(), true);
});

Deno.test("la bonne forme d'une personne qui n'est pas la dernière ne complète pas la conjugaison", () => {
  const seance = repondreJusqua(5);

  assertEquals(seance.conjugaisonCompleteParLaDerniereReponse(), false);
});
