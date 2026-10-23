import { assert, assertEquals, assertRejects } from "@std/assert";
import { ServiceDeConnexionEnMemoire } from "../test_utils/service-de-connexion-en-memoire.ts";
import { CodeDeConnexionInvalide, CodeDeConnexionMalForme } from "./erreurs.ts";
import { OuvrirLaConnexionAvecLeCode } from "./ouvrir-la-connexion-avec-le-code.ts";
import { ParentId } from "./parent-id.ts";

Deno.test("avec l'adresse et le bon code de connexion, le parent est connecté", async () => {
  const service = new ServiceDeConnexionEnMemoire("123456", ParentId.de("parent-paul"));

  const parent = await new OuvrirLaConnexionAvecLeCode(service).executer("paul@exemple.test", "123456");

  assertEquals(parent.valeur, "parent-paul");
  assertEquals(service.ouverturesAvecLeCode.length, 1);
});

Deno.test("un code de connexion qui n'a pas 6 chiffres est refusé sans appeler le service de connexion", async () => {
  const service = new ServiceDeConnexionEnMemoire();

  await assertRejects(
    () => new OuvrirLaConnexionAvecLeCode(service).executer("paul@exemple.test", "12345"),
    CodeDeConnexionMalForme,
  );

  assert(service.ouverturesAvecLeCode.length === 0);
});

Deno.test("un code de connexion refusé par le service de connexion est un code de connexion invalide", async () => {
  const service = new ServiceDeConnexionEnMemoire("123456");

  await assertRejects(
    () => new OuvrirLaConnexionAvecLeCode(service).executer("paul@exemple.test", "654321"),
    CodeDeConnexionInvalide,
  );
});
