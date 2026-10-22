import { assertEquals, assertThrows } from "@std/assert";
import { CodeDeConnexion } from "./code-de-connexion.ts";
import { CodeDeConnexionMalForme } from "./erreurs.ts";

Deno.test("un code de connexion de 6 chiffres est accepté", () => {
  assertEquals(CodeDeConnexion.de("123456").valeur, "123456");
});

Deno.test("un code de connexion peut commencer par des zéros", () => {
  assertEquals(CodeDeConnexion.de("004200").valeur, "004200");
});

const codesRefuses: ReadonlyArray<readonly [string, string]> = [
  ["", "vide"],
  ["12345", "5 chiffres"],
  ["1234567", "7 chiffres"],
  ["12a456", "une lettre"],
];

for (const [code, cas] of codesRefuses) {
  Deno.test(`le code de connexion « ${code} » (${cas}) n'a pas 6 chiffres : il est refusé`, () => {
    assertThrows(() => CodeDeConnexion.de(code), CodeDeConnexionMalForme);
  });
}

Deno.test("les espaces dans le code de connexion sont refusés (question ouverte n°2 du journal : « 123 456 » pas encore accepté)", () => {
  assertThrows(() => CodeDeConnexion.de("123 456"), CodeDeConnexionMalForme);
});
