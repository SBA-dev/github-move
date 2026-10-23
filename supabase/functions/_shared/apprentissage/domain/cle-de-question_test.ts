import { assertEquals } from "@std/assert";
import { CleDeQuestion } from "./cle-de-question.ts";

Deno.test("la clé d'une question de bulles commence par « b: » et normalise le texte", () => {
  assertEquals(CleDeQuestion.de("bulles", "  Été   Là ?").valeur, "b:ete la ?");
});

Deno.test("la clé d'une question de lecture commence par « l: »", () => {
  assertEquals(CleDeQuestion.de("lecture", "Où dort Plume ?").valeur, "l:ou dort plume ?");
});

Deno.test("la clé d'une question d'écoute commence par « e: »", () => {
  assertEquals(CleDeQuestion.de("ecoute", "Cat").valeur, "e:cat");
});
