import { assert, assertEquals, assertRejects } from "@std/assert";
import { ServiceDeConnexionEnMemoire } from "../test_utils/service-de-connexion-en-memoire.ts";
import { AdresseEmail } from "./adresse-email.ts";
import { AdresseEmailInvalide, AdresseOuMotDePasseIncorrect, MotDePasseObligatoire } from "./erreurs.ts";
import { ParentId } from "./parent-id.ts";
import { SeConnecterAvecLeMotDePasse } from "./se-connecter-avec-le-mot-de-passe.ts";

const PAUL = AdresseEmail.de("paul@exemple.test");

function serviceAvecLeCompteDePaul(motDePasse = "Abcdefg%"): ServiceDeConnexionEnMemoire {
  return ServiceDeConnexionEnMemoire.avecUnCompte(PAUL, motDePasse, ParentId.de("parent-paul"));
}

Deno.test("avec l'adresse et le bon mot de passe, le parent est connecté", async () => {
  const service = serviceAvecLeCompteDePaul();

  const parent = await new SeConnecterAvecLeMotDePasse(service).executer("paul@exemple.test", "Abcdefg%");

  assertEquals(parent.valeur, "parent-paul");
  assertEquals(service.ouverturesAvecLeMotDePasse.length, 1);
});

Deno.test("les espaces autour de l'adresse saisie sont ignorés à la connexion", async () => {
  const service = serviceAvecLeCompteDePaul();

  await new SeConnecterAvecLeMotDePasse(service).executer("  paul@exemple.test  ", "Abcdefg%");

  assertEquals(service.ouverturesAvecLeMotDePasse[0].adresse.valeur, "paul@exemple.test");
});

Deno.test("une adresse saisie avec une autre casse connecte le même parent", async () => {
  const service = serviceAvecLeCompteDePaul();

  const parent = await new SeConnecterAvecLeMotDePasse(service).executer("Paul@Exemple.TEST", "Abcdefg%");

  assertEquals(parent.valeur, "parent-paul");
});

Deno.test("un mot de passe vide est refusé sans appeler le service de connexion", async () => {
  const service = serviceAvecLeCompteDePaul();

  const erreur = await assertRejects(
    () => new SeConnecterAvecLeMotDePasse(service).executer("paul@exemple.test", ""),
    MotDePasseObligatoire,
  );

  assertEquals(erreur.message, "Écris ton mot de passe.");
  assert(service.ouverturesAvecLeMotDePasse.length === 0);
});

Deno.test("une adresse mal formée est refusée sans appeler le service de connexion", async () => {
  const service = serviceAvecLeCompteDePaul();

  await assertRejects(
    () => new SeConnecterAvecLeMotDePasse(service).executer("paul@exemple", "Abcdefg%"),
    AdresseEmailInvalide,
  );

  assert(service.ouverturesAvecLeMotDePasse.length === 0);
});

Deno.test("un mauvais mot de passe est refusé comme une adresse inconnue : « Adresse e-mail ou mot de passe incorrect. »", async () => {
  const service = serviceAvecLeCompteDePaul();
  const seConnecter = new SeConnecterAvecLeMotDePasse(service);

  const mauvaisMotDePasse = await assertRejects(
    () => seConnecter.executer("paul@exemple.test", "Mauvais%1"),
    AdresseOuMotDePasseIncorrect,
  );
  const adresseInconnue = await assertRejects(
    () => seConnecter.executer("inconnu@exemple.test", "Abcdefg%"),
    AdresseOuMotDePasseIncorrect,
  );

  assertEquals(mauvaisMotDePasse.message, "Adresse e-mail ou mot de passe incorrect.");
  assertEquals(adresseInconnue.message, mauvaisMotDePasse.message);
});

Deno.test("le mot de passe saisi à la connexion est transmis tel quel, sans appliquer les règles de création", async () => {
  const service = serviceAvecLeCompteDePaul(" abc ");

  const parent = await new SeConnecterAvecLeMotDePasse(service).executer("paul@exemple.test", " abc ");

  assertEquals(parent.valeur, "parent-paul");
  assertEquals(service.ouverturesAvecLeMotDePasse[0].motDePasse, " abc ");
});

Deno.test("le mot de passe saisi ne figure dans aucun message d'erreur", async () => {
  const service = serviceAvecLeCompteDePaul();

  const erreur = await assertRejects(
    () => new SeConnecterAvecLeMotDePasse(service).executer("paul@exemple.test", "SecretTrèsUnique%9"),
    AdresseOuMotDePasseIncorrect,
  );

  assert(!erreur.message.includes("SecretTrèsUnique%9"));
});
