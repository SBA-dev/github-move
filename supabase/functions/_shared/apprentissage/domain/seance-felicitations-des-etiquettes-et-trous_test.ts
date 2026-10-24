import { assertEquals } from "@std/assert";
import { seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { leconDeDeuxTrous } from "../test_utils/lecons-de-trous.ts";
import { Reponse } from "./reponse.ts";

Deno.test("après un bon mot sur un trou qui n'est pas le dernier, le personnage guide félicite l'enfant", () => {
  const seance = seanceCommencee(leconDeDeuxTrous());

  seance.repondre(Reponse.choix("suis"));

  assertEquals(seance.paroleDueApresLaDerniereReponse(), "felicitation");
});

Deno.test("après le bon mot du dernier trou, le personnage guide félicite l'enfant", () => {
  const seance = seanceCommencee(leconDeDeuxTrous());
  seance.repondre(Reponse.choix("suis"));

  seance.repondre(Reponse.choix("es"));

  assertEquals(seance.paroleDueApresLaDerniereReponse(), "felicitation");
});

Deno.test("le bon mot du dernier trou complète le texte", () => {
  const seance = seanceCommencee(leconDeDeuxTrous());
  seance.repondre(Reponse.choix("suis"));

  seance.repondre(Reponse.choix("es"));

  assertEquals(seance.texteCompleteParLaDerniereReponse(), true);
});

Deno.test("le bon mot d'un trou qui n'est pas le dernier ne complète pas le texte", () => {
  const seance = seanceCommencee(leconDeDeuxTrous());

  seance.repondre(Reponse.choix("suis"));

  assertEquals(seance.texteCompleteParLaDerniereReponse(), false);
});
