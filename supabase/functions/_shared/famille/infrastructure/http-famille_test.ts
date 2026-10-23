import { assertEquals, assertThrows } from "@std/assert";
import { NiveauInconnu } from "../../catalogue/domain/index.ts";
import { ParentNonRattache, PrenomObligatoire, ProfilEnfantIntrouvable } from "../domain/erreurs.ts";
import {
  EntreeInvalide,
  lireLeCorpsJson,
  NonAuthentifie,
  statutEtMessage,
  texteFacultatif,
  texteObligatoire,
} from "./http-famille.ts";

Deno.test("un parent non rattaché et un profil introuvable sont présentés pareil (404)", () => {
  assertEquals(statutEtMessage(new ParentNonRattache()), statutEtMessage(new ProfilEnfantIntrouvable()));
  assertEquals(statutEtMessage(new ParentNonRattache()).statut, 404);
});

Deno.test("une erreur de validation métier est un 400 avec son message", () => {
  assertEquals(statutEtMessage(new PrenomObligatoire()), { statut: 400, message: "Écris le prénom de l'enfant." });
  assertEquals(statutEtMessage(new NiveauInconnu("CE9")).statut, 400);
});

Deno.test("sans connexion c'est un 401, et une panne inconnue un 500 sans détail", () => {
  assertEquals(statutEtMessage(new NonAuthentifie()).statut, 401);
  assertEquals(statutEtMessage(new Error("mot de passe de la base")).statut, 500);
  assertEquals(statutEtMessage(new Error("mot de passe de la base")).message.includes("mot de passe"), false);
});

Deno.test("le corps doit être un objet JSON", () => {
  assertEquals(lireLeCorpsJson('{"prenom":"Léa"}'), { prenom: "Léa" });
  assertThrows(() => lireLeCorpsJson("pas du json"), EntreeInvalide);
  assertThrows(() => lireLeCorpsJson("[1]"), EntreeInvalide);
});

Deno.test("un champ texte est validé en type et en taille", () => {
  assertEquals(texteFacultatif({}, "niveau"), undefined);
  assertThrows(() => texteFacultatif({ niveau: 3 }, "niveau"), EntreeInvalide);
  assertThrows(() => texteFacultatif({ prenom: "a".repeat(101) }, "prenom"), EntreeInvalide);
  assertThrows(() => texteObligatoire({}, "prenom"), EntreeInvalide);
});
