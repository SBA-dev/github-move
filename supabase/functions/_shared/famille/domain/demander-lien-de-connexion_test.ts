import { assert, assertEquals, assertRejects } from "@std/assert";
import { ServiceDeConnexionEnMemoire } from "../test_utils/service-de-connexion-en-memoire.ts";
import { DemanderLienDeConnexion } from "./demander-lien-de-connexion.ts";
import { AdresseEmailInvalide } from "./erreurs.ts";

Deno.test("demander un lien de connexion envoie à l'adresse validée, sans espaces autour", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await new DemanderLienDeConnexion(service).executer("  Paul@Exemple.TEST  ");

  assertEquals(service.adressesAuxquellesOnAEnvoye.map((a) => a.valeur), ["Paul@Exemple.TEST"]);
});

Deno.test("une adresse e-mail mal formée est refusée sans rien envoyer au service de connexion", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await assertRejects(() => new DemanderLienDeConnexion(service).executer("paul@exemple"), AdresseEmailInvalide);

  assert(service.adressesAuxquellesOnAEnvoye.length === 0);
});
