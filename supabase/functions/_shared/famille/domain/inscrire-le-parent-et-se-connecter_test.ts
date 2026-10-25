import { assert, assertEquals, assertRejects } from "@std/assert";
import { ServiceDeConnexionEnMemoire } from "../test_utils/service-de-connexion-en-memoire.ts";
import { AdresseEmail } from "./adresse-email.ts";
import {
  AdresseDejaUtilisee,
  AdresseEmailInvalide,
  ConfirmationDuMotDePasseDifferente,
  MotDePasseNonConforme,
  MotDePasseTropLong,
} from "./erreurs.ts";
import { InscrireLeParentEtSeConnecter } from "./inscrire-le-parent-et-se-connecter.ts";
import { ParentId } from "./parent-id.ts";

const MOT_DE_PASSE = "Abcdefg%";

function aucunAppel(service: ServiceDeConnexionEnMemoire): boolean {
  return service.inscriptions.length === 0 && service.ouverturesAvecLeMotDePasse.length === 0;
}

Deno.test("un parent qui s'inscrit avec une adresse neuve est inscrit puis connecté", async () => {
  const service = new ServiceDeConnexionEnMemoire("123456", ParentId.de("parent-nouveau"));

  const parent = await new InscrireLeParentEtSeConnecter(service).executer(
    "nouveau@exemple.test",
    MOT_DE_PASSE,
    MOT_DE_PASSE,
  );

  assertEquals(parent.valeur, "parent-nouveau");
  assertEquals(service.inscriptions.length, 1);
  assertEquals(service.inscriptions[0].adresse.valeur, "nouveau@exemple.test");
  assertEquals(service.ouverturesAvecLeMotDePasse.length, 1);
  assertEquals(service.ouverturesAvecLeMotDePasse[0].motDePasse, MOT_DE_PASSE);
});

Deno.test("l'inscription n'envoie aucun e-mail", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await new InscrireLeParentEtSeConnecter(service).executer("nouveau@exemple.test", MOT_DE_PASSE, MOT_DE_PASSE);

  assertEquals(service.adressesAuxquellesOnAEnvoye.length, 0);
  assertEquals(service.ouverturesAvecLeCode.length, 0);
});

Deno.test("une adresse mal formée est refusée sans appeler le service, même si le mot de passe est non conforme", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await assertRejects(
    () => new InscrireLeParentEtSeConnecter(service).executer("paul@exemple", "abc", "xyz"),
    AdresseEmailInvalide,
  );

  assert(aucunAppel(service));
});

Deno.test("un mot de passe non conforme est refusé avec ses règles manquantes sans appeler le service", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  const erreur = await assertRejects(
    () => new InscrireLeParentEtSeConnecter(service).executer("paul@exemple.test", "abcdefgh", "autre"),
    MotDePasseNonConforme,
  );

  assertEquals(erreur.reglesManquantes, ["uneMajuscule", "unCaractereSpecial"]);
  assert(aucunAppel(service));
});

Deno.test("un mot de passe conforme mais trop long est refusé sans appeler le service", async () => {
  const service = new ServiceDeConnexionEnMemoire();
  const tropLong = MOT_DE_PASSE + "a".repeat(60);

  await assertRejects(
    () => new InscrireLeParentEtSeConnecter(service).executer("paul@exemple.test", tropLong, "autre"),
    MotDePasseTropLong,
  );

  assert(aucunAppel(service));
});

Deno.test("une confirmation différente est refusée : « Les deux mots de passe ne sont pas pareils. »", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  const erreur = await assertRejects(
    () => new InscrireLeParentEtSeConnecter(service).executer("paul@exemple.test", MOT_DE_PASSE, "Abcdefg$"),
    ConfirmationDuMotDePasseDifferente,
  );

  assertEquals(erreur.message, "Les deux mots de passe ne sont pas pareils.");
  assert(aucunAppel(service));
});

Deno.test("la confirmation est comparée exactement, espaces compris", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await assertRejects(
    () => new InscrireLeParentEtSeConnecter(service).executer("paul@exemple.test", MOT_DE_PASSE, MOT_DE_PASSE + " "),
    ConfirmationDuMotDePasseDifferente,
  );

  assert(aucunAppel(service));
});

Deno.test("une adresse déjà utilisée est refusée : « Cette adresse a déjà un compte. Connecte-toi. » et le parent n'est pas connecté", async () => {
  const service = ServiceDeConnexionEnMemoire.avecUnCompte(AdresseEmail.de("paul@exemple.test"), "Autre%123");

  const erreur = await assertRejects(
    () => new InscrireLeParentEtSeConnecter(service).executer("Paul@Exemple.TEST", MOT_DE_PASSE, MOT_DE_PASSE),
    AdresseDejaUtilisee,
  );

  assertEquals(erreur.message, "Cette adresse a déjà un compte. Connecte-toi.");
  assertEquals(service.ouverturesAvecLeMotDePasse.length, 0);
});

Deno.test("le mot de passe est transmis au service tel que saisi, espaces autour gardés", async () => {
  const service = new ServiceDeConnexionEnMemoire();
  const saisie = " Abcdefg% ";

  await new InscrireLeParentEtSeConnecter(service).executer("nouveau@exemple.test", saisie, saisie);

  assertEquals(service.inscriptions[0].motDePasse, saisie);
  assertEquals(service.ouverturesAvecLeMotDePasse[0].motDePasse, saisie);
});

Deno.test("la confirmation n'est pas transmise au service", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await new InscrireLeParentEtSeConnecter(service).executer("nouveau@exemple.test", MOT_DE_PASSE, MOT_DE_PASSE);

  assertEquals(Object.keys(service.inscriptions[0]).sort(), ["adresse", "motDePasse"]);
});

Deno.test("le mot de passe saisi ne figure dans aucun message d'erreur de l'inscription", async () => {
  const secret = "SecretTrèsUnique%9";
  const service = new ServiceDeConnexionEnMemoire();

  const erreur = await assertRejects(
    () => new InscrireLeParentEtSeConnecter(service).executer("paul@exemple.test", secret, secret + "x"),
    ConfirmationDuMotDePasseDifferente,
  );

  assert(!erreur.message.includes(secret));
});
