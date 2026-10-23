import { assert, assertEquals } from "@std/assert";
import { AdresseEmail } from "./adresse-email.ts";
import { CodeDeConnexion } from "./code-de-connexion.ts";
import { EmailDeConnexion } from "./email-de-connexion.ts";
import { LienDeConnexion } from "./lien-de-connexion.ts";

const adresse = AdresseEmail.de("paul@exemple.test");
const lien = LienDeConnexion.de(
  "https://projet.supabase.co/auth/v1/verify?token=abc123&type=magiclink&redirect_to=https%3A%2F%2Fsavanturier.test%2F",
);
const code = CodeDeConnexion.de("482913");

const composer = (codeDeConnexion = code) => EmailDeConnexion.composer(adresse, lien, codeDeConnexion);

Deno.test("le destinataire de l'e-mail de connexion est l'adresse du parent", () => {
  assert(composer().destinataire.estLaMemeQue(adresse));
});

Deno.test("l'e-mail de connexion a un sujet en français (texte provisoire du modèle)", () => {
  assertEquals(composer().sujet, "Ta connexion à Savanturier");
});

Deno.test("le texte de l'e-mail de connexion contient le lien de connexion inchangé", () => {
  assert(composer().texte.includes(lien.valeur));
});

Deno.test("le texte de l'e-mail de connexion contient le code de connexion en 6 chiffres à la suite", () => {
  assert(composer().texte.includes("482913"));
});

Deno.test("deux e-mails de connexion composés avec deux codes différents ne contiennent chacun que leur propre code", () => {
  const premier = composer(CodeDeConnexion.de("111111"));
  const second = composer(CodeDeConnexion.de("222222"));

  assert(premier.texte.includes("111111") && !premier.texte.includes("222222"));
  assert(second.texte.includes("222222") && !second.texte.includes("111111"));
});

// Texte exact non figé (question 16 ouverte) : on teste le sens par fragments.
// Fragments attendus, sans tenir compte de la casse : « une heure », « une seule fois », « ignorer ».
Deno.test("le texte de l'e-mail de connexion dit que le lien et le code valent une heure", () => {
  assert(composer().texte.toLowerCase().includes("une heure"));
});

Deno.test("le texte de l'e-mail de connexion dit que le lien et le code ne servent qu'une seule fois", () => {
  assert(composer().texte.toLowerCase().includes("une seule fois"));
});

Deno.test("le texte de l'e-mail de connexion dit qu'on peut l'ignorer si on n'a rien demandé", () => {
  assert(composer().texte.toLowerCase().includes("ignorer"));
});
