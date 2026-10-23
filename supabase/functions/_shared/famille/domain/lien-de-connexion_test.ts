import { assertEquals, assertThrows } from "@std/assert";
import { LienDeConnexion } from "./lien-de-connexion.ts";
import { LienDeConnexionMalForme } from "./erreurs.ts";

Deno.test("un lien de connexion qui est une adresse web absolue est gardé intact, redirect_to encodé compris", () => {
  const brut =
    "https://projet.supabase.co/auth/v1/verify?token=abc123&type=magiclink&redirect_to=https%3A%2F%2Fsavanturier.test%2Fconnexion%3Fa%3D1%26b%3D2";

  assertEquals(LienDeConnexion.de(brut).valeur, brut);
});

const liensRefuses: ReadonlyArray<readonly [string, string]> = [
  ["", "vide"],
  ["https://savanturier.test/connexion?x=1 2", "avec un espace"],
  ["/auth/v1/verify?token=abc", "non absolu (chemin seul)"],
  ["savanturier.test/connexion", "non absolu (sans protocole)"],
];

for (const [lien, cas] of liensRefuses) {
  Deno.test(`le lien « ${lien} » (${cas}) est refusé comme lien de connexion mal formé`, () => {
    assertThrows(() => LienDeConnexion.de(lien), LienDeConnexionMalForme);
  });
}
