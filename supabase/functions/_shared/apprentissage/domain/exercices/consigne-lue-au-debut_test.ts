import { assertEquals } from "@std/assert";
import { consigneLueAuDebut } from "../index.ts";

Deno.test("en dictée, le personnage guide ne lit pas la consigne au début : il dicte directement le mot", () => {
  assertEquals(consigneLueAuDebut("dictee"), false);
});

Deno.test("les autres types d'exercice gardent la lecture de la consigne au début", () => {
  assertEquals(consigneLueAuDebut("classer"), true);
});
