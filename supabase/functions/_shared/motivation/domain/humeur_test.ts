import { assertEquals } from "@std/assert";
import { HUMEUR_PAR_DEFAUT, humeurApresReponse } from "./humeur.ts";

Deno.test("le personnage guide est content par défaut", () => {
  assertEquals(HUMEUR_PAR_DEFAUT, "content");
});

Deno.test("le personnage guide applaudit après une réponse juste", () => {
  assertEquals(humeurApresReponse(true), "applaudit");
});

Deno.test("le personnage guide réfléchit après une réponse fausse", () => {
  assertEquals(humeurApresReponse(false), "reflechit");
});
