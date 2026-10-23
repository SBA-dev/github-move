import { assertEquals, assertThrows } from "@std/assert";
import { ProfilEnfantIdVide } from "./erreurs.ts";
import { ProfilEnfantId } from "./profil-enfant-id.ts";

Deno.test("un identifiant de profil enfant garde sa valeur", () => {
  assertEquals(ProfilEnfantId.de("profil-lea").valeur, "profil-lea");
});

Deno.test("un identifiant de profil enfant ne peut pas être vide", () => {
  assertThrows(() => ProfilEnfantId.de(""), ProfilEnfantIdVide);
});
