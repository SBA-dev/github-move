import { assert, assertEquals, assertRejects } from "@std/assert";
import { ServiceDeConnexionEnMemoire } from "../test_utils/service-de-connexion-en-memoire.ts";
import {
  AdresseEmailInvalide,
  ConfirmationDuMotDePasseDifferente,
  InformationsDeReinitialisationIncorrectes,
  MotDePasseNonConforme,
  MotDePasseTropLong,
  PrenomObligatoire,
  ServiceDeConnexionIndisponible,
  TropDEssaisDeReinitialisation,
} from "./erreurs.ts";
import { ParentId } from "./parent-id.ts";
import { ReinitialiserLeMotDePasseEtSeConnecter } from "./reinitialiser-le-mot-de-passe-et-se-connecter.ts";

const ADRESSE = "paul@exemple.test";
const PRENOM = "Léa";
const NOUVEAU_MOT_DE_PASSE = "Abcdefg%";

function aucunAppel(service: ServiceDeConnexionEnMemoire): boolean {
  return service.appels.length === 0;
}

Deno.test("un parent qui réinitialise son mot de passe est réinitialisé, connecté avec le nouveau mot de passe, puis ses autres connexions sont fermées", async () => {
  const service = new ServiceDeConnexionEnMemoire("123456", ParentId.de("parent-paul"));

  const parent = await new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(
    ADRESSE,
    PRENOM,
    NOUVEAU_MOT_DE_PASSE,
    NOUVEAU_MOT_DE_PASSE,
  );

  assertEquals(parent.valeur, "parent-paul");
  assertEquals(service.appels, [
    "reinitialiserLeMotDePasse",
    "ouvrirLaConnexionAvecLeMotDePasse",
    "fermerLesAutresConnexions",
  ]);
  assertEquals(service.reinitialisations[0].adresse.valeur, ADRESSE);
  assertEquals(service.reinitialisations[0].prenom.valeur, PRENOM);
  assertEquals(service.reinitialisations[0].motDePasse, NOUVEAU_MOT_DE_PASSE);
  assertEquals(service.ouverturesAvecLeMotDePasse[0].motDePasse, NOUVEAU_MOT_DE_PASSE);
});

Deno.test("une adresse mal formée est refusée sans appeler le service, même si le reste est invalide", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await assertRejects(
    () => new ReinitialiserLeMotDePasseEtSeConnecter(service).executer("paul@exemple", "  ", "abc", "xyz"),
    AdresseEmailInvalide,
  );

  assert(aucunAppel(service));
});

Deno.test("un prénom fait d'espaces est refusé sans appeler le service, même si le mot de passe est non conforme", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await assertRejects(
    () => new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(ADRESSE, "   ", "abc", "xyz"),
    PrenomObligatoire,
  );

  assert(aucunAppel(service));
});

Deno.test("un mot de passe non conforme est refusé avec ses règles manquantes sans appeler le service", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  const erreur = await assertRejects(
    () => new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(ADRESSE, PRENOM, "abcdefgh", "autre"),
    MotDePasseNonConforme,
  );

  assertEquals(erreur.reglesManquantes, ["uneMajuscule", "unCaractereSpecial"]);
  assert(aucunAppel(service));
});

Deno.test("un mot de passe conforme mais trop long est refusé sans appeler le service", async () => {
  const service = new ServiceDeConnexionEnMemoire();
  const tropLong = NOUVEAU_MOT_DE_PASSE + "a".repeat(60);

  await assertRejects(
    () => new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(ADRESSE, PRENOM, tropLong, "autre"),
    MotDePasseTropLong,
  );

  assert(aucunAppel(service));
});

Deno.test("une confirmation différente est refusée sans appeler le service", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await assertRejects(
    () =>
      new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(
        ADRESSE,
        PRENOM,
        NOUVEAU_MOT_DE_PASSE,
        "Abcdefg$",
      ),
    ConfirmationDuMotDePasseDifferente,
  );

  assert(aucunAppel(service));
});

Deno.test("des informations qui ne correspondent pas sont refusées : « Ces informations ne correspondent pas. », sans connexion ni fermeture", async () => {
  const service = ServiceDeConnexionEnMemoire.quiRefuseLaReinitialisation(
    new InformationsDeReinitialisationIncorrectes(),
  );

  const erreur = await assertRejects(
    () =>
      new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(
        ADRESSE,
        PRENOM,
        NOUVEAU_MOT_DE_PASSE,
        NOUVEAU_MOT_DE_PASSE,
      ),
    InformationsDeReinitialisationIncorrectes,
  );

  assertEquals(erreur.message, "Ces informations ne correspondent pas.");
  assertEquals(service.appels, ["reinitialiserLeMotDePasse"]);
});

Deno.test("un blocage pour trop d'essais est propagé, sans connexion ni fermeture", async () => {
  const service = ServiceDeConnexionEnMemoire.quiRefuseLaReinitialisation(new TropDEssaisDeReinitialisation());

  await assertRejects(
    () =>
      new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(
        ADRESSE,
        PRENOM,
        NOUVEAU_MOT_DE_PASSE,
        NOUVEAU_MOT_DE_PASSE,
      ),
    TropDEssaisDeReinitialisation,
  );

  assertEquals(service.appels, ["reinitialiserLeMotDePasse"]);
});

Deno.test("le prénom est transmis tel que validé, sans espaces autour", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(
    ADRESSE,
    "  Léa  ",
    NOUVEAU_MOT_DE_PASSE,
    NOUVEAU_MOT_DE_PASSE,
  );

  assertEquals(service.reinitialisations[0].prenom.valeur, "Léa");
});

Deno.test("la confirmation n'est pas transmise au service", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(
    ADRESSE,
    PRENOM,
    NOUVEAU_MOT_DE_PASSE,
    NOUVEAU_MOT_DE_PASSE,
  );

  assertEquals(Object.keys(service.reinitialisations[0]).sort(), ["adresse", "motDePasse", "prenom"]);
});

Deno.test("si la fermeture des autres connexions échoue, le parent reste connecté et le service est dit indisponible", async () => {
  const service = ServiceDeConnexionEnMemoire.quiEchoueALaFermetureDesAutresConnexions();

  const erreur = await assertRejects(
    () =>
      new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(
        ADRESSE,
        PRENOM,
        NOUVEAU_MOT_DE_PASSE,
        NOUVEAU_MOT_DE_PASSE,
      ),
    ServiceDeConnexionIndisponible,
  );

  assertEquals(erreur.message, "Le service ne répond pas. Réessaie dans un instant.");
  assertEquals(service.appels, [
    "reinitialiserLeMotDePasse",
    "ouvrirLaConnexionAvecLeMotDePasse",
    "fermerLesAutresConnexions",
  ]);
  assertEquals(service.deconnexions, 0);
});

Deno.test("ni le prénom ni le mot de passe saisis ne figurent dans un message d'erreur de la réinitialisation", async () => {
  const secret = "SecretTrèsUnique%9";
  const prenom = "Prénomtrèsunique";
  const service = new ServiceDeConnexionEnMemoire();

  const erreur = await assertRejects(
    () => new ReinitialiserLeMotDePasseEtSeConnecter(service).executer(ADRESSE, prenom, secret, secret + "x"),
    ConfirmationDuMotDePasseDifferente,
  );

  assert(!erreur.message.includes(secret));
  assert(!erreur.message.includes(prenom));
});
