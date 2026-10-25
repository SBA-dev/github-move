import { assertEquals, assertFalse, assertInstanceOf, assertThrows } from "@std/assert";
import { MotDePasseNonConforme, MotDePasseTropLong } from "./erreurs.ts";
import { MotDePasseDuParent } from "./mot-de-passe-du-parent.ts";

function motDePasseDe(longueur: number): string {
  return "Abcdefg%".padEnd(longueur, "a");
}

Deno.test("un mot de passe qui respecte les 4 règles est accepté", () => {
  const motDePasse = MotDePasseDuParent.de("Abcdefg%");

  assertEquals(motDePasse.valeur, "Abcdefg%");
});

Deno.test("un mot de passe non conforme est refusé avec les règles manquantes dans l'ordre d'affichage", () => {
  const erreur = assertThrows(() => MotDePasseDuParent.de("abcdefgh"), MotDePasseNonConforme);

  assertEquals(erreur.reglesManquantes, ["uneMajuscule", "unCaractereSpecial"]);
});

Deno.test("le refus d'un mot de passe non conforme dit ce qu'il manque, sans citer la saisie", () => {
  const erreur = assertThrows(() => MotDePasseDuParent.de("abcdefgh"), MotDePasseNonConforme);

  assertEquals(erreur.message, "Il manque : une majuscule, un caractère spécial.");
  assertFalse(erreur.message.includes("abcdefgh"));
});

Deno.test("un mot de passe de 64 caractères est accepté", () => {
  const motDePasse = MotDePasseDuParent.de(motDePasseDe(64));

  assertEquals([...motDePasse.valeur].length, 64);
});

Deno.test("un mot de passe de 65 caractères est refusé comme trop long", () => {
  const erreur = assertThrows(() => MotDePasseDuParent.de(motDePasseDe(65)), MotDePasseTropLong);

  assertEquals(erreur.message, "64 caractères au plus.");
});

Deno.test("la longueur maximale du mot de passe est de 64 caractères", () => {
  assertEquals(MotDePasseDuParent.LONGUEUR_MAXIMALE, 64);
});

Deno.test("un mot de passe à la fois trop long et non conforme est refusé comme non conforme", () => {
  const erreur = assertThrows(() => MotDePasseDuParent.de("a".repeat(65)));

  assertInstanceOf(erreur, MotDePasseNonConforme);
  assertEquals(erreur.reglesManquantes, ["uneMajuscule", "unCaractereSpecial"]);
});

Deno.test("les espaces au début du mot de passe sont gardés et comptent dans la longueur", () => {
  const motDePasse = MotDePasseDuParent.de(" Abcdefg%");

  assertEquals(motDePasse.valeur, " Abcdefg%");
  assertEquals([...motDePasse.valeur].length, 9);
});

Deno.test("le mot de passe ne se montre pas quand on le convertit en texte ou en JSON", () => {
  const motDePasse = MotDePasseDuParent.de("Abcdefg%");

  assertFalse(String(motDePasse).includes("Abcdefg%"));
  assertFalse(JSON.stringify(motDePasse).includes("Abcdefg%"));
});
