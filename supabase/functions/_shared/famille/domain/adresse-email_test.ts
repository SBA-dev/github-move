import { assert, assertEquals, assertThrows } from "@std/assert";
import { AdresseEmail } from "./adresse-email.ts";
import { AdresseEmailInvalide } from "./erreurs.ts";

Deno.test("une adresse e-mail bien formée est acceptée", () => {
  assertEquals(AdresseEmail.de("paul@exemple.test").valeur, "paul@exemple.test");
});

Deno.test("les espaces au début et à la fin de l'adresse sont ignorés", () => {
  assertEquals(AdresseEmail.de("  paul@exemple.test  ").valeur, "paul@exemple.test");
});

Deno.test("deux adresses qui ne diffèrent que par les majuscules sont la même adresse", () => {
  const saisie = AdresseEmail.de("  Paul@Exemple.TEST  ");

  assert(saisie.estLaMemeQue(AdresseEmail.de("paul@exemple.test")));
});

Deno.test("deux adresses différentes ne sont pas la même adresse", () => {
  assert(!AdresseEmail.de("paul@exemple.test").estLaMemeQue(AdresseEmail.de("claire@exemple.test")));
});

const adressesRefusees: ReadonlyArray<readonly [string, string]> = [
  ["", "vide"],
  ["paul", "sans @"],
  ["@exemple.test", "rien avant le @"],
  ["paul@", "pas de domaine"],
  ["paul@exemple", "domaine sans point"],
  ["paul@@exemple.test", "deux @"],
  ["paul dupont@exemple.test", "espace dans l'adresse"],
];

for (const [adresse, cas] of adressesRefusees) {
  Deno.test(`l'adresse « ${adresse} » (${cas}) est refusée comme adresse e-mail invalide`, () => {
    assertThrows(() => AdresseEmail.de(adresse), AdresseEmailInvalide);
  });
}
