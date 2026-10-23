import { assertEquals, assertRejects } from "@std/assert";
import { AdresseEmail } from "../domain/adresse-email.ts";
import { CodeDeConnexion } from "../domain/code-de-connexion.ts";
import { EmailDeConnexion } from "../domain/email-de-connexion.ts";
import { LienDeConnexion } from "../domain/lien-de-connexion.ts";
import { StockageDeLaBoiteDeTestEnMemoire } from "../test_utils/stockage-de-la-boite-de-test-en-memoire.ts";
import { AdresseRefuseeParLaBoiteDeTest, ExpediteurBoiteDeTest } from "./boite-de-test.ts";

const emailPour = (adresse: string) =>
  EmailDeConnexion.composer(
    AdresseEmail.de(adresse),
    LienDeConnexion.de("https://projet.supabase.co/auth/v1/verify?token=abc&type=magiclink"),
    CodeDeConnexion.de("482913"),
  );

Deno.test("la boîte de test range l'e-mail de connexion d'une adresse en @exemple.test", async () => {
  const stockage = new StockageDeLaBoiteDeTestEnMemoire();
  const email = emailPour("paul@exemple.test");

  await new ExpediteurBoiteDeTest(stockage).envoyer(email);

  assertEquals(stockage.emailsRanges, [email]);
});

Deno.test("la boîte de test refuse toute adresse qui ne finit pas par @exemple.test, sans la ranger", async () => {
  const stockage = new StockageDeLaBoiteDeTestEnMemoire();

  await assertRejects(
    () => new ExpediteurBoiteDeTest(stockage).envoyer(emailPour("paul@exemple.test.fr")),
    AdresseRefuseeParLaBoiteDeTest,
  );

  assertEquals(stockage.emailsRanges.length, 0);
});
