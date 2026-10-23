import { assert, assertEquals, assertRejects } from "@std/assert";
import {
  AdresseEmailInvalide,
  CodeDeConnexionMalForme,
  EnvoiDeLEmailImpossible,
  LienDeConnexionMalForme,
} from "../domain/erreurs.ts";
import { ExpediteurDEmailsEnMemoire } from "../test_utils/expediteur-d-emails-en-memoire.ts";
import { EnvoyerEmailDeConnexion } from "./envoyer-email-de-connexion.ts";

const adresse = "paul@exemple.test";
const lien =
  "https://projet.supabase.co/auth/v1/verify?token=abc&type=magiclink&redirect_to=https%3A%2F%2Fsavanturier.test%2F";
const code = "482913";

Deno.test("l'e-mail de connexion composé pour la demande est confié à l'expéditeur", async () => {
  const expediteur = ExpediteurDEmailsEnMemoire.quiFonctionne();

  await new EnvoyerEmailDeConnexion(expediteur).executer(adresse, lien, code);

  assertEquals(expediteur.emailsEnvoyes.length, 1);
  const email = expediteur.emailsEnvoyes[0];
  assertEquals(email.destinataire.valeur, adresse);
  assert(email.texte.includes(lien));
  assert(email.texte.includes(code));
});

Deno.test("une adresse mal formée n'envoie aucun e-mail de connexion", async () => {
  const expediteur = ExpediteurDEmailsEnMemoire.quiFonctionne();

  await assertRejects(
    () => new EnvoyerEmailDeConnexion(expediteur).executer("paul.exemple.test", lien, code),
    AdresseEmailInvalide,
  );

  assertEquals(expediteur.emailsEnvoyes.length, 0);
});

Deno.test("un code de connexion sans 6 chiffres n'envoie aucun e-mail de connexion", async () => {
  const expediteur = ExpediteurDEmailsEnMemoire.quiFonctionne();

  await assertRejects(
    () => new EnvoyerEmailDeConnexion(expediteur).executer(adresse, lien, "4829"),
    CodeDeConnexionMalForme,
  );

  assertEquals(expediteur.emailsEnvoyes.length, 0);
});

Deno.test("un lien de connexion mal formé n'envoie aucun e-mail de connexion", async () => {
  const expediteur = ExpediteurDEmailsEnMemoire.quiFonctionne();

  await assertRejects(
    () => new EnvoyerEmailDeConnexion(expediteur).executer(adresse, "pas un lien", code),
    LienDeConnexionMalForme,
  );

  assertEquals(expediteur.emailsEnvoyes.length, 0);
});

Deno.test("un échec de l'expéditeur remonte en envoi de l'e-mail impossible", async () => {
  const expediteur = ExpediteurDEmailsEnMemoire.enPanne();

  await assertRejects(
    () => new EnvoyerEmailDeConnexion(expediteur).executer(adresse, lien, code),
    EnvoiDeLEmailImpossible,
  );
});
