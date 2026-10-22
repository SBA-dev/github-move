import { assertEquals, assertRejects } from "@std/assert";
import { DonneesDeLAppareilEnMemoire } from "../test_utils/donnees-de-l-appareil-en-memoire.ts";
import { ServiceDeConnexionEnMemoire } from "../test_utils/service-de-connexion-en-memoire.ts";
import { SeDeconnecter } from "./se-deconnecter.ts";

Deno.test("se déconnecter ferme la connexion du parent et efface les données de la famille sur l'appareil", async () => {
  const service = new ServiceDeConnexionEnMemoire();
  const donnees = new DonneesDeLAppareilEnMemoire();

  await new SeDeconnecter(service, donnees).executer();

  assertEquals([service.deconnexions, donnees.effacements], [1, 1]);
});

Deno.test("si l'effacement des données de la famille échoue, la connexion du parent est quand même fermée et l'échec est signalé", async () => {
  const service = new ServiceDeConnexionEnMemoire();
  const donnees = new DonneesDeLAppareilEnMemoire(true);

  await assertRejects(() => new SeDeconnecter(service, donnees).executer(), Error, "effacement impossible");

  assertEquals(service.deconnexions, 1);
});
